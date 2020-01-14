const Class = require('../../core/class');
const arrayUtils = require('../../core/utils/array');
const grep = require('../../core/utils/common').grep;
const isDefined = require('../../core/utils/type').isDefined;
const objectUtils = require('../../core/utils/object');
const iteratorUtils = require('../../core/utils/iterator');
const extend = require('../../core/utils/extend').extend;
const inArray = require('../../core/utils/array').inArray;
const query = require('../../data/query');
const dataCoreUtils = require('../../core/utils/data');
const DataSourceModule = require('../../data/data_source/data_source');
const deferredUtils = require('../../core/utils/deferred');
const when = deferredUtils.when;
const Deferred = deferredUtils.Deferred;

const getValueExpr = function(resource) {
    return resource.valueExpr || 'id';
};
const getDisplayExpr = function(resource) {
    return resource.displayExpr || 'text';
};

const ResourceManager = Class.inherit({

    _wrapDataSource: function(dataSource) {
        if(dataSource instanceof DataSourceModule.DataSource) {
            return dataSource;
        } else {
            return new DataSourceModule.DataSource({
                store: DataSourceModule.normalizeDataSourceOptions(dataSource).store,
                pageSize: 0
            });
        }
    },

    _mapResourceData: function(resource, data) {
        const valueGetter = dataCoreUtils.compileGetter(getValueExpr(resource));
        const displayGetter = dataCoreUtils.compileGetter(getDisplayExpr(resource));

        return iteratorUtils.map(data, function(item) {
            const result = {
                id: valueGetter(item),
                text: displayGetter(item)
            };

            if(item.color) {
                result.color = item.color;
            }

            return result;
        });
    },

    _isMultipleResource: function(resourceField) {
        let result = false;

        iteratorUtils.each(this.getResources(), (function(_, resource) {
            const field = this.getField(resource);
            if(field === resourceField) {
                result = resource.allowMultiple;
                return false;
            }
        }).bind(this));

        return result;
    },

    ctor: function(resources) {
        this.setResources(resources);
    },

    getDataAccessors: function(field, type) {
        let result = null;
        iteratorUtils.each(this._dataAccessors[type], function(accessorName, accessors) {
            if(field === accessorName) {
                result = accessors;
                return false;
            }
        });

        return result;
    },

    getField: function(resource) {
        return resource.fieldExpr || resource.field;
    },

    setResources: function(resources) {
        this._resources = resources;
        this._dataAccessors = {
            getter: {},
            setter: {}
        };

        this._resourceFields = iteratorUtils.map(resources || [], (function(resource) {
            const field = this.getField(resource);

            this._dataAccessors.getter[field] = dataCoreUtils.compileGetter(field);
            this._dataAccessors.setter[field] = dataCoreUtils.compileSetter(field);

            return field;
        }).bind(this));
    },

    getResources: function() {
        return this._resources || [];
    },

    getResourcesData: function() {
        return this._resourcesData || [];
    },

    getEditors: function() {
        const result = [];
        const that = this;

        iteratorUtils.each(this.getResources(), function(i, resource) {
            const field = that.getField(resource);
            const currentResourceItems = that._getResourceDataByField(field);

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
    },

    _resourceLoader: {},

    getResourceDataByValue: function(field, value) {
        const that = this;
        const result = new Deferred();

        iteratorUtils.each(this.getResources(), function(_, resource) {
            const resourceField = that.getField(resource);
            if(resourceField === field) {
                const dataSource = that._wrapDataSource(resource.dataSource);
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
    },

    setResourcesToItem: function(itemData, resources) {
        const resourcesSetter = this._dataAccessors.setter;

        for(const name in resources) {
            if(Object.prototype.hasOwnProperty.call(resources, name)) {
                const resourceData = resources[name];
                resourcesSetter[name](itemData, this._isMultipleResource(name) ? arrayUtils.wrapToArray(resourceData) : resourceData);
            }
        }
    },

    getResourcesFromItem: function(itemData, wrapOnlyMultipleResources) {
        const that = this;
        let result = null;

        if(!isDefined(wrapOnlyMultipleResources)) {
            wrapOnlyMultipleResources = false;
        }

        iteratorUtils.each(that._resourceFields, function(index, field) {
            iteratorUtils.each(itemData, function(fieldName, fieldValue) {
                const tmp = {};
                tmp[fieldName] = fieldValue;
                let resourceData = that.getDataAccessors(field, 'getter')(tmp);
                if(isDefined(resourceData)) {
                    if(!result) {
                        result = {};
                    }
                    if(resourceData.length === 1) {
                        resourceData = resourceData[0];
                    }
                    if(!wrapOnlyMultipleResources || (wrapOnlyMultipleResources && that._isMultipleResource(field))) {
                        that.getDataAccessors(field, 'setter')(tmp, arrayUtils.wrapToArray(resourceData));
                    } else {
                        that.getDataAccessors(field, 'setter')(tmp, resourceData);
                    }

                    extend(result, tmp);

                    return true;
                }
            });
        });

        return result;
    },

    loadResources: function(groups) {
        const result = new Deferred();
        const that = this;
        const deferreds = [];

        iteratorUtils.each(this.getResourcesByFields(groups), function(i, resource) {
            const deferred = new Deferred();
            const field = that.getField(resource);
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
    },

    getResourcesByFields: function(fields) {
        return grep(this.getResources(), (function(resource) {
            const field = this.getField(resource);
            return inArray(field, fields) > -1;
        }).bind(this));
    },

    getResourceByField: function(field) {
        return this.getResourcesByFields([field])[0] || {};
    },

    getResourceColor: function(field, value) {
        const valueExpr = this.getResourceByField(field).valueExpr || 'id';
        const valueGetter = dataCoreUtils.compileGetter(valueExpr);
        const colorExpr = this.getResourceByField(field).colorExpr || 'color';
        const colorGetter = dataCoreUtils.compileGetter(colorExpr);

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
    },

    getResourceForPainting: function(groups) {
        let resources = this.getResources();
        let result;

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
    },

    createResourcesTree: function(groups) {
        let leafIndex = 0;
        var groupIndex = groupIndex || 0;

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
    },

    _hasGroupItem: function(appointmentResources, groupName, itemValue) {
        const group = this.getDataAccessors(groupName, 'getter')(appointmentResources);

        if(group) {
            if(inArray(itemValue, group) > -1) {
                return true;
            }
        }
        return false;
    },

    _getResourceDataByField: function(fieldName) {
        const loadedResources = this.getResourcesData();
        let currentResourceData = [];

        for(let i = 0, resourceCount = loadedResources.length; i < resourceCount; i++) {
            if(loadedResources[i].name === fieldName) {
                currentResourceData = loadedResources[i].data;
                break;
            }
        }

        return currentResourceData;
    },

    getResourceTreeLeaves: function(tree, appointmentResources, result) {
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
    },

    groupAppointmentsByResources: function(appointments, resources) {
        const tree = this.createResourcesTree(resources);
        const result = {};

        iteratorUtils.each(appointments, (function(_, appointment) {
            const appointmentResources = this.getResourcesFromItem(appointment);
            const treeLeaves = this.getResourceTreeLeaves(tree, appointmentResources);

            for(let i = 0; i < treeLeaves.length; i++) {
                if(!result[treeLeaves[i]]) {
                    result[treeLeaves[i]] = [];
                }

                // NOTE: check appointment before pushing
                result[treeLeaves[i]].push(objectUtils.deepExtendArraySafe({}, appointment, true));
            }
        }).bind(this));

        return result;
    },

    reduceResourcesTree: function(tree, existingAppointments, _result) {
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

});

module.exports = ResourceManager;
