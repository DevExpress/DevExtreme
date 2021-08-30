import { wrapToArray, inArray } from '../../../core/utils/array';
import { isDefined } from '../../../core/utils/type';
import { deepExtendArraySafe } from '../../../core/utils/object';
import { each } from '../../../core/utils/iterator';
import { extend } from '../../../core/utils/extend';
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
    getResourceColor,
    isResourceMultiple,
    filterResources,
    getPaintedResources
} from './utils';

export class ResourceManager {
    constructor(resources) {
        this.loadedResources = [];
        this.resourceLoaderMap = new Map();
        this._dataAccessors = {
            getter: {},
            setter: {}
        };
        this.agendaProcessor = new AgendaResourceProcessor();

        this.setResources(resources);
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

    setResources(resources = []) {
        this._resources = resources;
        this._dataAccessors = {
            getter: {},
            setter: {}
        };

        this._resourceFields = resources.map(resource => {
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

    setResourcesToItem(itemData, resources) {
        const resourcesSetter = this._dataAccessors.setter;

        for(const name in resources) {
            if(Object.prototype.hasOwnProperty.call(resources, name)) {
                const resourceData = resources[name];
                resourcesSetter[name](itemData, isResourceMultiple(this.getResources(), name) ? wrapToArray(resourceData) : resourceData);
            }
        }
    }

    getResourcesFromItem(itemData, wrapOnlyMultipleResources = false) {
        let result = null;

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
                    if(!wrapOnlyMultipleResources || (wrapOnlyMultipleResources && isResourceMultiple(this.getResources(), field))) {
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

        return data.map(item => {
            const result = {
                id: valueGetter(item),
                text: displayGetter(item),
            };

            if(item.color) { // TODO for passed tests
                result.color = item.color;
            }

            return result;
        });
    }

    loadResources(groups) {
        const result = new Deferred();
        const deferreds = [];

        filterResources(this.getResources(), groups)
            .forEach(resource => {
                const deferred = new Deferred();
                const name = getFieldExpr(resource);
                deferreds.push(deferred);

                const dataSourcePromise = getWrappedDataSource(resource.dataSource).load();
                this.resourceLoaderMap.set(name, dataSourcePromise);

                dataSourcePromise
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

        when.apply(null, deferreds).done((...resources) => {
            const hasEmpty = resources.some(r => r.items.length === 0);

            this.loadedResources = hasEmpty ? [] : resources;

            result.resolve(this.loadedResources);
        }).fail(() => result.reject());

        return result.promise();
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

    getAppointmentColor({ groupIndex, itemData, groups }) {
        const paintedResources = getPaintedResources(this.getResources(), groups);

        if(paintedResources) {
            const field = getFieldExpr(paintedResources);

            const cellGroups = getCellGroups(groupIndex, this.loadedResources);
            const resourceValues = wrapToArray(this.getDataAccessors(field, 'getter')(itemData));

            let groupId = resourceValues[0];

            for(let i = 0; i < cellGroups.length; i++) {
                if(cellGroups[i].name === field) {
                    groupId = cellGroups[i].id;
                    break;
                }
            }

            return getResourceColor(this.getResources(), field, groupId);
        }

        return new Deferred().resolve().promise();
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

            const resource = filterResources(this.getResources(), [resourceName])[0] || {};
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
