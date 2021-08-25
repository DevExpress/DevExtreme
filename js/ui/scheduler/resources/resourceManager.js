import { wrapToArray, inArray } from '../../../core/utils/array';
import { grep } from '../../../core/utils/common';
import { isDefined } from '../../../core/utils/type';
import { deepExtendArraySafe } from '../../../core/utils/object';
import { each } from '../../../core/utils/iterator';
import { extend } from '../../../core/utils/extend';
import query from '../../../data/query';
import { compileGetter, compileSetter } from '../../../core/utils/data';
import { when, Deferred } from '../../../core/utils/deferred';

import { AgendaResourceProcessor } from './agendaResourceProcessor';
import {
    createResourcesTree,
    getCellGroups,
    getDisplayExpr,
    getFieldExpr,
    getValueExpr,
    getWrappedDataSource,
} from './utils';

export class ResourceManager {
    constructor(resources) {
        this.loadedResources = [];
        this._resourceLoader = {};
        this._dataAccessors = {
            getter: {},
            setter: {}
        };
        this.agendaProcessor = new AgendaResourceProcessor();

        this.setResources(resources);
    }

    _isMultipleResource(resourceField) {
        let result = false;

        each(this.getResources(), (function(_, resource) {
            const field = getFieldExpr(resource);
            if(field === resourceField) {
                result = resource.allowMultiple;
                return false;
            }
        }).bind(this));

        return result;
    }

    getDataAccessors(field, type) {
        let result = null;
        each(this._dataAccessors[type], function(accessorName, accessors) {
            if(field === accessorName) {
                result = accessors;
                return false;
            }
        });

        return result;
    }

    setResources(resources) {
        this._resources = resources;
        this._dataAccessors = {
            getter: {},
            setter: {}
        };

        this._resourceFields = (resources || []).map(resource => {
            const field = getFieldExpr(resource);

            this._dataAccessors.getter[field] = compileGetter(field);
            this._dataAccessors.setter[field] = compileSetter(field);

            return field;
        });

        this.agendaProcessor.initializeState(resources);
    }

    getResources() {
        return this._resources || [];
    }

    getEditors() {
        return this.getResources().map(resource => {
            const dataField = getFieldExpr(resource);
            const currentResourceItems = this._getResourceDataByField(dataField);

            return {
                editorOptions: {
                    dataSource: currentResourceItems.length ? currentResourceItems : getWrappedDataSource(resource.dataSource),
                    displayExpr: getDisplayExpr(resource),
                    valueExpr: getValueExpr(resource)
                },
                dataField,
                editorType: resource.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
                label: { text: resource.label || dataField }
            };
        });
    }

    getResourceDataByValue(field, value) {
        const result = new Deferred();

        this.getResources().forEach(resource => {
            const resourceField = getFieldExpr(resource);

            if(resourceField === field) {
                const dataSource = getWrappedDataSource(resource.dataSource);
                const valueExpr = getValueExpr(resource);

                if(!this._resourceLoader[field]) {
                    this._resourceLoader[field] = dataSource.load();
                }

                this._resourceLoader[field]
                    .done(data => {
                        const filteredData = query(data)
                            .filter(valueExpr, value)
                            .toArray();

                        delete this._resourceLoader[field];
                        result.resolve(filteredData[0]);
                    })
                    .fail(() => {
                        delete this._resourceLoader[field];
                        result.reject();
                    });
            }
        });

        return result.promise();
    }

    setResourcesToItem(itemData, resources) {
        const resourcesSetter = this._dataAccessors.setter;

        for(const name in resources) {
            if(Object.prototype.hasOwnProperty.call(resources, name)) {
                const resourceData = resources[name];
                resourcesSetter[name](itemData, this._isMultipleResource(name) ? wrapToArray(resourceData) : resourceData);
            }
        }
    }

    getResourcesFromItem(itemData, wrapOnlyMultipleResources) {
        let result = null;

        if(!isDefined(wrapOnlyMultipleResources)) {
            wrapOnlyMultipleResources = false;
        }

        this._resourceFields.forEach(field => {
            each(itemData, (fieldName, fieldValue) => {
                const tempObject = {};
                tempObject[fieldName] = fieldValue;

                let resourceData = this.getDataAccessors(field, 'getter')(tempObject);
                if(isDefined(resourceData)) {
                    if(!result) {
                        result = {};
                    }
                    if(resourceData.length === 1) {
                        resourceData = resourceData[0];
                    }
                    if(!wrapOnlyMultipleResources || (wrapOnlyMultipleResources && this._isMultipleResource(field))) {
                        this.getDataAccessors(field, 'setter')(tempObject, wrapToArray(resourceData));
                    } else {
                        this.getDataAccessors(field, 'setter')(tempObject, resourceData);
                    }

                    extend(result, tempObject);

                    return true;
                }
            });
        });

        return result;
    }

    isLoaded() {
        return isDefined(this.loadedResources);
    }

    _mapResourceData(resource, data) {
        const valueGetter = compileGetter(getValueExpr(resource));
        const displayGetter = compileGetter(getDisplayExpr(resource));

        return data.map(item => ({
            id: valueGetter(item),
            text: displayGetter(item),
            color: item.color
        }));
    }

    loadResources(groups) {
        const result = new Deferred();
        const deferreds = [];

        this.getResourcesByFields(groups)
            .forEach(resource => {
                const deferred = new Deferred();
                const name = getFieldExpr(resource);
                deferreds.push(deferred);

                getWrappedDataSource(resource.dataSource)
                    .load()
                    .done(data => {
                        const items = this._mapResourceData(resource, data);

                        deferred.resolve({ name, items, data });
                    })
                    .fail(() => deferred.reject());
            });

        if(!deferreds.length) {
            this.loadedResources = [];
            return result.resolve([]);
        }

        when.apply(null, deferreds).done((...data) => {
            const isValidResources = this._isValidResourcesForGrouping(data);

            this.loadedResources = isValidResources ? data : [];

            result.resolve(this.loadedResources);
        }).fail(() => result.reject());

        return result.promise();
    }

    _isValidResourcesForGrouping(resources) {
        const result = resources.reduce((isValidResources, currentResource) => {
            return isValidResources && currentResource.items.length > 0;
        }, true);

        return result;
    }

    getResourcesByFields(fields) {
        return grep(this.getResources(), (function(resource) {
            const field = getFieldExpr(resource);
            return inArray(field, fields) > -1;
        }).bind(this));
    }

    getResourceByField(field) {
        return this.getResourcesByFields([field])[0] || {};
    }

    getResourceColor(field, value) {
        const valueExpr = this.getResourceByField(field).valueExpr || 'id';
        const valueGetter = compileGetter(valueExpr);
        const colorExpr = this.getResourceByField(field).colorExpr || 'color';
        const colorGetter = compileGetter(colorExpr);

        const result = new Deferred();
        const resourceData = this._getResourceDataByField(field);
        const resourceDataLength = resourceData.length;
        let color;

        if(resourceDataLength) {
            for(let i = 0; i < resourceDataLength; i++) {
                if(valueGetter(resourceData[i]) === value) {
                    color = colorGetter(resourceData[i]);
                    break;
                }
            }
            result.resolve(color);
        } else {
            this.getResourceDataByValue(field, value)
                .done(function(resourceData) {
                    if(resourceData) {
                        color = colorGetter(resourceData);
                    }

                    result.resolve(color);
                })
                .fail(function() {
                    result.reject();
                });
        }

        return result.promise();
    }

    getResourceForPainting(groups) {
        let resources = this.getResources();
        let result;

        each(resources, function(index, resource) {
            if(resource.useColorAsDefault) {
                result = resource;
                return false;
            }
        });

        if(!result) {
            if(Array.isArray(groups) && groups.length) {
                resources = this.getResourcesByFields(groups);
            }
            result = resources[resources.length - 1];
        }

        return result;
    }

    _hasGroupItem(appointmentResources, groupName, itemValue) {
        const group = this.getDataAccessors(groupName, 'getter')(appointmentResources);

        if(group) {
            if(inArray(itemValue, group) > -1) {
                return true;
            }
        }
        return false;
    }

    _createPlainResourcesByAppointmentAsync(rawAppointment) {
        return this.agendaProcessor.createListAsync(rawAppointment);
    }

    _getResourceDataByField(fieldName) {
        for(let i = 0; i < this.loadedResources.length; i++) {
            const resource = this.loadedResources[i];
            if(resource.name === fieldName) {
                return resource.data;
            }
        }

        return [];
    }

    getResourceTreeLeaves(tree, appointmentResources, result) {
        result = result || [];

        for(let i = 0; i < tree.length; i++) {

            if(!this._hasGroupItem(appointmentResources, tree[i].name, tree[i].value)) {
                continue;
            }

            if(isDefined(tree[i].leafIndex)) {
                result.push(tree[i].leafIndex);
            }

            if(tree[i].children) {
                this.getResourceTreeLeaves(tree[i].children, appointmentResources, result);
            }

        }

        return result;
    }

    groupAppointmentsByResources(appointments, groups) {
        let result = { '0': appointments };

        if(groups && groups.length && this.loadedResources.length) {
            result = this.groupAppointmentsByResourcesCore(appointments, this.loadedResources);
        }

        let totalResourceCount = 0;

        each(this.loadedResources, function(i, resource) {
            if(!i) {
                totalResourceCount = resource.items.length;
            } else {
                totalResourceCount *= resource.items.length;
            }
        });

        for(let j = 0; j < totalResourceCount; j++) {
            const index = j.toString();

            if(result[index]) {
                continue;
            }

            result[index] = [];
        }

        return result;
    }
    groupAppointmentsByResourcesCore(appointments, resources) {
        const tree = createResourcesTree(resources);
        const result = {};

        each(appointments, (function(_, appointment) {
            const appointmentResources = this.getResourcesFromItem(appointment);
            const treeLeaves = this.getResourceTreeLeaves(tree, appointmentResources);

            for(let i = 0; i < treeLeaves.length; i++) {
                if(!result[treeLeaves[i]]) {
                    result[treeLeaves[i]] = [];
                }

                // NOTE: check appointment before pushing
                result[treeLeaves[i]].push(deepExtendArraySafe({}, appointment, true));
            }
        }).bind(this));

        return result;
    }

    getAppointmentColor(options) {
        const { groups } = options;
        const resourceForPainting = this.getResourceForPainting(groups);
        let response = new Deferred().resolve().promise();

        if(resourceForPainting) {
            const field = getFieldExpr(resourceForPainting);
            const {
                groupIndex,
                itemData
            } = options;
            const cellGroups = getCellGroups(groupIndex, this.loadedResources);
            const resourceValues = wrapToArray(this.getDataAccessors(field, 'getter')(itemData));

            let groupId = resourceValues.length
                ? resourceValues[0]
                : undefined;

            for(let i = 0; i < cellGroups.length; i++) {
                if(cellGroups[i].name === field) {
                    groupId = cellGroups[i].id;
                    break;
                }
            }

            response = this.getResourceColor(field, groupId);
        }

        return response;
    }

    reduceResourcesTree(tree, existingAppointments, _result) {
        _result = _result ? _result.children : [];

        const that = this;

        tree.forEach(function(node, index) {
            let ok = false;
            const resourceName = node.name;
            const resourceValue = node.value;
            const resourceTitle = node.title;
            const resourceData = node.data;
            const resourceGetter = that.getDataAccessors(resourceName, 'getter');

            existingAppointments.forEach(function(appointment) {
                if(!ok) {
                    const resourceFromAppointment = resourceGetter(appointment);

                    if(Array.isArray(resourceFromAppointment)) {
                        if(resourceFromAppointment.indexOf(resourceValue) > -1) {
                            _result.push({
                                name: resourceName,
                                value: resourceValue,
                                title: resourceTitle,
                                data: resourceData,
                                children: []
                            });
                            ok = true;
                        }
                    } else {
                        if(resourceFromAppointment === resourceValue) {
                            _result.push({
                                name: resourceName,
                                value: resourceValue,
                                title: resourceTitle,
                                data: resourceData,
                                children: []
                            });
                            ok = true;
                        }
                    }
                }
            });

            if(ok && node.children && node.children.length) {
                that.reduceResourcesTree(node.children, existingAppointments, _result[index]);
            }

        });

        return _result;
    }

    getResourcesDataByGroups(groups) {
        if(!groups || !groups.length) {
            return this.loadedResources;
        }

        const fieldNames = {};
        const currentResourcesData = [];

        groups.forEach(group => {
            each(group, (name, value) => fieldNames[name] = value);
        });

        const resourceData = this.loadedResources.filter(({ name }) => isDefined(fieldNames[name]));
        resourceData.forEach(
            data => currentResourcesData.push(extend({}, data))
        );

        currentResourcesData.forEach(currentResource => {
            const {
                items,
                data,
                name: resourceName
            } = currentResource;

            const resource = this.getResourceByField(resourceName);
            const valueExpr = getValueExpr(resource);
            const filteredItems = [];
            const filteredData = [];

            groups
                .filter(group => isDefined(group[resourceName]))
                .forEach(group => {
                    each(group, (name, value) => {

                        if(!filteredItems.filter(item => item.id === value && item[valueExpr] === name).length) {
                            const currentItems = items.filter(item => item.id === value);
                            const currentData = data.filter(item => item[valueExpr] === value);

                            filteredItems.push(...currentItems);
                            filteredData.push(...currentData);
                        }
                    });
                });

            currentResource.items = filteredItems;
            currentResource.data = filteredData;
        });

        return currentResourcesData;
    }

    createReducedResourcesTree(appointments) {
        const tree = createResourcesTree(this.loadedResources);
        return this.reduceResourcesTree(tree, appointments);
    }
}
