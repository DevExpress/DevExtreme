import arrayUtils from '../../core/utils/array';
import { grep } from '../../core/utils/common';
import { isDefined } from '../../core/utils/type';
import objectUtils from '../../core/utils/object';
import iteratorUtils from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import query from '../../data/query';
import dataCoreUtils from '../../core/utils/data';
import DataSourceModule from '../../data/data_source/data_source';
import { when, Deferred } from '../../core/utils/deferred';

const getValueExpr = resource => resource.valueExpr || 'id';
const getDisplayExpr = resource => resource.displayExpr || 'text';

export default class ResourceManager {
    constructor(resources) {
        this._resourceLoader = {};
        this.setResources(resources);
    }

    _wrapDataSource(dataSource) {
        if(dataSource instanceof DataSourceModule.DataSource) {
            return dataSource;
        } else {
            return new DataSourceModule.DataSource({
                store: DataSourceModule.normalizeDataSourceOptions(dataSource).store,
                pageSize: 0
            });
        }
    }

    _mapResourceData(resource, data) {
        var valueGetter = dataCoreUtils.compileGetter(getValueExpr(resource)),
            displayGetter = dataCoreUtils.compileGetter(getDisplayExpr(resource));

        return iteratorUtils.map(data, function(item) {
            var result = {
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
        var result = false;

        iteratorUtils.each(this.getResources(), (function(_, resource) {
            var field = this.getField(resource);
            if(field === resourceField) {
                result = resource.allowMultiple;
                return false;
            }
        }).bind(this));

        return result;
    }

    getDataAccessors(field, type) {
        var result = null;
        iteratorUtils.each(this._dataAccessors[type], function(accessorName, accessors) {
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

        this._resourceFields = iteratorUtils.map(resources || [], (function(resource) {
            var field = this.getField(resource);

            this._dataAccessors.getter[field] = dataCoreUtils.compileGetter(field);
            this._dataAccessors.setter[field] = dataCoreUtils.compileSetter(field);

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
        var result = [],
            that = this;

        iteratorUtils.each(this.getResources(), function(i, resource) {
            var field = that.getField(resource),
                currentResourceItems = that._getResourceDataByField(field);

            result.push({
                editorOptions: {
                    dataSource: currentResourceItems.length ? currentResourceItems : that._wrapDataSource(resource.dataSource),
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
        var that = this,
            result = new Deferred();

        iteratorUtils.each(this.getResources(), function(_, resource) {
            var resourceField = that.getField(resource);
            if(resourceField === field) {
                var dataSource = that._wrapDataSource(resource.dataSource),
                    valueExpr = getValueExpr(resource);

                if(!that._resourceLoader[field]) {
                    that._resourceLoader[field] = dataSource.load();
                }

                that._resourceLoader[field]
                    .done(function(data) {
                        var filteredData = query(data)
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
        var resourcesSetter = this._dataAccessors.setter;

        for(var name in resources) {
            if(Object.prototype.hasOwnProperty.call(resources, name)) {
                var resourceData = resources[name];
                resourcesSetter[name](itemData, this._isMultipleResource(name) ? arrayUtils.wrapToArray(resourceData) : resourceData);
            }
        }
    }

    getResourcesFromItem(itemData, wrapOnlyMultipleResources) {
        let result = null;

        if(!isDefined(wrapOnlyMultipleResources)) {
            wrapOnlyMultipleResources = false;
        }

        this._resourceFields.forEach(field => {
            iteratorUtils.each(itemData, (fieldName, fieldValue) => {
                let tempObject = {};
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
                        this.getDataAccessors(field, 'setter')(tempObject, arrayUtils.wrapToArray(resourceData));
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
        var result = new Deferred(),
            that = this,
            deferreds = [];

        iteratorUtils.each(this.getResourcesByFields(groups), function(i, resource) {
            var deferred = new Deferred(),
                field = that.getField(resource);
            deferreds.push(deferred);

            that._wrapDataSource(resource.dataSource)
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
            var data = Array.prototype.slice.call(arguments),
                mapFunction = function(obj) {
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
            var field = this.getField(resource);
            return inArray(field, fields) > -1;
        }).bind(this));
    }

    getResourceByField(field) {
        return this.getResourcesByFields([field])[0] || {};
    }

    getResourceColor(field, value) {
        var valueExpr = this.getResourceByField(field).valueExpr || 'id',
            valueGetter = dataCoreUtils.compileGetter(valueExpr),
            colorExpr = this.getResourceByField(field).colorExpr || 'color',
            colorGetter = dataCoreUtils.compileGetter(colorExpr);

        var result = new Deferred(),
            resourceData = this._getResourceDataByField(field),
            resourceDataLength = resourceData.length,
            color;


        if(resourceDataLength) {
            for(var i = 0; i < resourceDataLength; i++) {
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
        var resources = this.getResources(),
            result;

        iteratorUtils.each(resources, function(index, resource) {
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
        var leafIndex = 0,
            groupIndex = groupIndex || 0;

        function make(group, groupIndex, result, parent) {
            result = result || [];

            for(var i = 0; i < group.items.length; i++) {
                var currentGroupItem = group.items[i];
                var resultItem = {
                    name: group.name,
                    value: currentGroupItem.id,
                    title: currentGroupItem.text,
                    data: group.data && group.data[i],
                    children: [],
                    parent: parent ? parent : null
                };
                result.push(resultItem);
                var nextGroupIndex = groupIndex + 1;

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
        var group = this.getDataAccessors(groupName, 'getter')(appointmentResources);

        if(group) {
            if(inArray(itemValue, group) > -1) {
                return true;
            }
        }
        return false;
    }

    _getResourceDataByField(fieldName) {
        var loadedResources = this.getResourcesData(),
            currentResourceData = [];

        for(var i = 0, resourceCount = loadedResources.length; i < resourceCount; i++) {
            if(loadedResources[i].name === fieldName) {
                currentResourceData = loadedResources[i].data;
                break;
            }
        }

        return currentResourceData;
    }

    getResourceTreeLeaves(tree, appointmentResources, result) {
        result = result || [];

        for(var i = 0; i < tree.length; i++) {

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
        var tree = this.createResourcesTree(resources),
            result = {};

        iteratorUtils.each(appointments, (function(_, appointment) {
            var appointmentResources = this.getResourcesFromItem(appointment),
                treeLeaves = this.getResourceTreeLeaves(tree, appointmentResources);

            for(var i = 0; i < treeLeaves.length; i++) {
                if(!result[treeLeaves[i]]) {
                    result[treeLeaves[i]] = [];
                }

                // NOTE: check appointment before pushing
                result[treeLeaves[i]].push(objectUtils.deepExtendArraySafe({}, appointment, true));
            }
        }).bind(this));

        return result;
    }

    reduceResourcesTree(tree, existingAppointments, _result) {
        _result = _result ? _result.children : [];

        var that = this;

        tree.forEach(function(node, index) {
            var ok = false,
                resourceName = node.name,
                resourceValue = node.value,
                resourceTitle = node.title,
                resourceData = node.data,
                resourceGetter = that.getDataAccessors(resourceName, 'getter');

            existingAppointments.forEach(function(appointment) {
                if(!ok) {
                    var resourceFromAppointment = resourceGetter(appointment);

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
}
