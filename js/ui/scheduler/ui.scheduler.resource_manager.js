import { wrapToArray, inArray } from '../../core/utils/array';
import { grep } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import { deepExtendArraySafe } from '../../core/utils/object';
import { each, map } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import query from '../../data/query';
import { compileGetter, compileSetter } from '../../core/utils/data';
import { DataSource } from '../../data/data_source/data_source';
import { when, Deferred } from '../../core/utils/deferred';
import { normalizeDataSourceOptions } from '../../data/data_source/utils';

const getValueExpr = resource => resource.valueExpr || 'id';
const getDisplayExpr = resource => resource.displayExpr || 'text';

export default class ResourceManager {
    constructor(resources) {
        this._resourceLoader = {};
        this.setResources(resources);
    }

    _createWrappedDataSource(dataSource) {
        if(dataSource instanceof DataSource) {
            return dataSource;
        }
        const result = {
            store: normalizeDataSourceOptions(dataSource).store,
            pageSize: 0
        };

        if(!Array.isArray(dataSource)) {
            result.filter = dataSource.filter;
        }

        return new DataSource(result);
    }

    _mapResourceData(resource, data) {
        const valueGetter = compileGetter(getValueExpr(resource));
        const displayGetter = compileGetter(getDisplayExpr(resource));

        return map(data, function(item) {
            const result = {
                id: valueGetter(item),
                text: displayGetter(item)
            };

            if(item.color) {
                result.color = item.color;
            }

            return result;
        });
    }

    _isMultipleResource(resourceField) {
        let result = false;

        each(this.getResources(), (function(_, resource) {
            const field = this.getField(resource);
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

    getField(resource) {
        return resource.fieldExpr || resource.field;
    }

    setResources(resources) {
        this._resources = resources;
        this._dataAccessors = {
            getter: {},
            setter: {}
        };

        this._resourceFields = map(resources || [], (function(resource) {
            const field = this.getField(resource);

            this._dataAccessors.getter[field] = compileGetter(field);
            this._dataAccessors.setter[field] = compileSetter(field);

            return field;
        }).bind(this));
    }

    getResources() {
        return this._resources || [];
    }

    getResourcesData() {
        return this._resourcesData || [];
    }

    getEditors() {
        const result = [];
        const that = this;

        each(this.getResources(), function(i, resource) {
            const field = that.getField(resource);
            const currentResourceItems = that._getResourceDataByField(field);

            result.push({
                editorOptions: {
                    dataSource: currentResourceItems.length ? currentResourceItems : that._createWrappedDataSource(resource.dataSource),
                    displayExpr: getDisplayExpr(resource),
                    valueExpr: getValueExpr(resource)
                },
                dataField: field,
                editorType: resource.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
                label: { text: resource.label || field }
            });
        });

        return result;
    }

    getResourceDataByValue(field, value) {
        const that = this;
        const result = new Deferred();

        each(this.getResources(), function(_, resource) {
            const resourceField = that.getField(resource);
            if(resourceField === field) {
                const dataSource = that._createWrappedDataSource(resource.dataSource);
                const valueExpr = getValueExpr(resource);

                if(!that._resourceLoader[field]) {
                    that._resourceLoader[field] = dataSource.load();
                }

                that._resourceLoader[field]
                    .done(function(data) {
                        const filteredData = query(data)
                            .filter(valueExpr, value)
                            .toArray();

                        delete that._resourceLoader[field];
                        result.resolve(filteredData[0]);
                    })
                    .fail(function() {
                        delete that._resourceLoader[field];
                        result.reject();
                    });
                return false;
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

    loadResources(groups) {
        const result = new Deferred();
        const that = this;
        const deferreds = [];

        each(this.getResourcesByFields(groups), function(i, resource) {
            const deferred = new Deferred();
            const field = that.getField(resource);
            deferreds.push(deferred);

            that._createWrappedDataSource(resource.dataSource)
                .load()
                .done(function(data) {
                    deferred.resolve({
                        name: field,
                        items: that._mapResourceData(resource, data),
                        data: data
                    });
                }).fail(function() {
                    deferred.reject();
                });

        });

        if(!deferreds.length) {
            that._resourcesData = [];
            return result.resolve([]);
        }

        when.apply(null, deferreds).done(function() {
            const data = Array.prototype.slice.call(arguments);
            const mapFunction = function(obj) {
                return { name: obj.name, items: obj.items, data: obj.data };
            };

            that._resourcesData = data;
            result.resolve(data.map(mapFunction));
        }).fail(function() {
            result.reject();
        });

        return result.promise();
    }

    getResourcesByFields(fields) {
        return grep(this.getResources(), (function(resource) {
            const field = this.getField(resource);
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

    createResourcesTree(groups) {
        let leafIndex = 0;
        const groupIndex = groupIndex || 0;

        function make(group, groupIndex, result, parent) {
            result = result || [];

            for(let i = 0; i < group.items.length; i++) {
                const currentGroupItem = group.items[i];
                const resultItem = {
                    name: group.name,
                    value: currentGroupItem.id,
                    title: currentGroupItem.text,
                    data: group.data && group.data[i],
                    children: [],
                    parent: parent ? parent : null
                };
                result.push(resultItem);
                const nextGroupIndex = groupIndex + 1;

                if(groups[nextGroupIndex]) {
                    make.call(this,
                        groups[nextGroupIndex], nextGroupIndex, resultItem.children, resultItem);
                }
                if(!resultItem.children.length) {
                    resultItem.leafIndex = leafIndex;
                    leafIndex++;
                }
            }

            return result;
        }

        return make.call(this, groups[0], 0);
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

    _getResourceDataByField(fieldName) {
        const loadedResources = this.getResourcesData();
        let currentResourceData = [];

        for(let i = 0, resourceCount = loadedResources.length; i < resourceCount; i++) {
            if(loadedResources[i].name === fieldName) {
                currentResourceData = loadedResources[i].data;
                break;
            }
        }

        return currentResourceData;
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

    groupAppointmentsByResources(appointments, resources) {
        const tree = this.createResourcesTree(resources);
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
        const resourcesData = this.getResourcesData();

        if(!groups) {
            return resourcesData;
        }

        const fieldNames = Object.getOwnPropertyNames(groups);
        const resourceData = resourcesData.filter(item => fieldNames.indexOf(item.name) !== -1);
        const currentResourcesData = [];

        resourceData.forEach(
            data => currentResourcesData.push(extend({}, data))
        );

        each(groups, (_, value) => {
            currentResourcesData.forEach(resourceData => {

                const { items, data, name } = resourceData;
                const resource = this.getResourceByField(name);
                const valueExpr = getValueExpr(resource);

                const currentItems = items.filter(item => item.id === value);
                const currentData = data.filter(item => item[valueExpr] === value);
                resourceData.items = currentItems;
                resourceData.data = currentData;
            });
        });

        return currentResourcesData;
    }
}
