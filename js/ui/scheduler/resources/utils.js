import { normalizeDataSourceOptions } from '../../../data/data_source/utils';
import { DataSource } from '../../../data/data_source/data_source';
import { Deferred } from '../../../core/utils/deferred';
import query from '../../../data/query';
import { compileGetter } from '../../../core/utils/data';
import { each } from '../../../core/utils/iterator';
import { extend } from '../../../core/utils/extend';
import { isDefined } from '../../../core/utils/type';
import { wrapToArray, inArray } from '../../../core/utils/array';
import { deepExtendArraySafe } from '../../../core/utils/object';

export const getValueExpr = resource => resource.valueExpr || 'id';
export const getDisplayExpr = resource => resource.displayExpr || 'text';
export const getFieldExpr = resource => resource.fieldExpr || resource.field;

export const getWrappedDataSource = dataSource => {
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
};

export const createResourcesTree = (groups) => {
    let leafIndex = 0;

    const make = (group, groupIndex, result, parent) => {
        result = result || [];

        for(let itemIndex = 0; itemIndex < group.items.length; itemIndex++) {
            const currentGroupItem = group.items[itemIndex];
            const resultItem = {
                name: group.name,
                value: currentGroupItem.id,
                title: currentGroupItem.text,
                data: group.data?.[itemIndex],
                children: [],
                parent: parent || null
            };

            const nextGroupIndex = groupIndex + 1;

            if(groups[nextGroupIndex]) {
                make(groups[nextGroupIndex], nextGroupIndex, resultItem.children, resultItem);
            }

            if(!resultItem.children.length) {
                resultItem.leafIndex = leafIndex;
                leafIndex++;
            }

            result.push(resultItem);
        }

        return result;
    };

    return make(groups[0], 0);
};

export const getPathToLeaf = (leafIndex, groups) => {
    const tree = createResourcesTree(groups);

    const findLeafByIndex = (data, index) => {
        for(let i = 0; i < data.length; i++) {
            if(data[i].leafIndex === index) {
                return data[i];
            } else {
                const leaf = findLeafByIndex(data[i].children, index);
                if(leaf) {
                    return leaf;
                }
            }
        }
    };

    const makeBranch = (leaf, result) => {
        result = result || [];
        result.push(leaf.value);

        if(leaf.parent) {
            makeBranch(leaf.parent, result);
        }

        return result;
    };

    const leaf = findLeafByIndex(tree, leafIndex);

    return makeBranch(leaf).reverse();
};

// TODO rework
export const getCellGroups = (groupIndex, groups) => {
    const result = [];

    if(getGroupCount(groups)) {
        if(groupIndex < 0) {
            return;
        }

        const path = getPathToLeaf(groupIndex, groups);

        for(let i = 0; i < groups.length; i++) {
            result.push({
                name: groups[i].name,
                id: path[i]
            });
        }

    }

    return result;
};

export const getGroupCount = (groups) => {
    let result = 0;

    for(let i = 0, len = groups.length; i < len; i++) {
        if(!i) {
            result = groups[i].items.length;
        } else {
            result *= groups[i].items.length;
        }
    }

    return result;
};

export const getGroupsObjectFromGroupsArray = (groupsArray) => {
    return groupsArray.reduce((currentGroups, { name, id }) => ({
        ...currentGroups,
        [name]: id,
    }), {});
};

export const getAllGroups = (groups) => {
    const groupCount = getGroupCount(groups);

    return [...(new Array(groupCount))].map((_, groupIndex) => {
        const groupsArray = getCellGroups(
            groupIndex,
            groups,
        );

        return getGroupsObjectFromGroupsArray(groupsArray);
    });
};

export const getResourceByField = (fieldName, loadedResources) => {
    for(let i = 0; i < loadedResources.length; i++) {
        const resource = loadedResources[i];
        if(resource.name === fieldName) {
            return resource.data;
        }
    }

    return [];
};

export const createResourceEditorModel = (resources, loadedResources) => {
    return resources.map(resource => {
        const dataField = getFieldExpr(resource);
        const dataSource = getResourceByField(dataField, loadedResources);

        return {
            editorOptions: {
                dataSource: dataSource.length ? dataSource : getWrappedDataSource(resource.dataSource),
                displayExpr: getDisplayExpr(resource),
                valueExpr: getValueExpr(resource)
            },
            dataField,
            editorType: resource.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
            label: { text: resource.label || dataField }
        };
    });
};

export const isResourceMultiple = (resources, resourceField) => {
    const resource = resources.find(resource => {
        const field = getFieldExpr(resource);
        return field === resourceField;
    });

    return !!resource?.allowMultiple;
};

export const filterResources = (resources, fields) => {
    return resources.filter(resource => {
        const field = getFieldExpr(resource);
        return fields.indexOf(field) > -1;
    });
};

export const getPaintedResources = (resources, groups = []) => {
    const result = resources.find(resource => resource.useColorAsDefault);
    if(result) {
        return result;
    }

    const newResources = groups.length ?
        filterResources(resources, groups) :
        resources;

    return newResources[newResources.length - 1];
};

export const getOrLoadResourceItem = (resources, resourceLoaderMap, field, value) => {
    const result = new Deferred();

    resources.forEach(resource => {
        const resourceField = getFieldExpr(resource);

        if(resourceField === field) {
            const dataSource = getWrappedDataSource(resource.dataSource);
            const valueExpr = getValueExpr(resource);

            if(!resourceLoaderMap.has(field)) {
                resourceLoaderMap.set(field, dataSource.load());
            }

            resourceLoaderMap.get(field)
                .done(data => {
                    const filteredData = query(data)
                        .filter(valueExpr, value)
                        .toArray();

                    result.resolve(filteredData[0]);
                })
                .fail(() => {
                    resourceLoaderMap.delete(field);
                    result.reject();
                });
        }
    });

    return result.promise();
};

export const getResourceColor = (resources, resourceLoaderMap, field, value) => {
    const result = new Deferred();

    const resource = filterResources(resources, [field])[0] || {};

    const colorExpr = resource.colorExpr || 'color';
    const colorGetter = compileGetter(colorExpr);

    getOrLoadResourceItem(resources, resourceLoaderMap, field, value)
        .done(resource => result.resolve(colorGetter(resource)))
        .fail(() => result.reject());

    return result.promise();
};

export const getResourcesFromItem = (_resourceFields, resources, getDataAccessors, itemData, wrapOnlyMultipleResources = false) => {
    let result = null;

    _resourceFields.forEach(field => {
        each(itemData, (fieldName, fieldValue) => {
            const tempObject = {};
            tempObject[fieldName] = fieldValue;

            let resourceData = getDataAccessors(field, 'getter')(tempObject);
            if(isDefined(resourceData)) {
                if(!result) {
                    result = {};
                }
                if(resourceData.length === 1) {
                    resourceData = resourceData[0];
                }
                if(!wrapOnlyMultipleResources || (wrapOnlyMultipleResources && isResourceMultiple(resources, field))) {
                    getDataAccessors(field, 'setter')(tempObject, wrapToArray(resourceData));
                } else {
                    getDataAccessors(field, 'setter')(tempObject, resourceData);
                }

                extend(result, tempObject);

                return true;
            }
        });
    });

    return result;
};

export const groupAppointmentsByResources = (config, appointments, groups = []) => {
    let result = { '0': appointments };

    if(groups.length && config.loadedResources.length) {
        result = groupAppointmentsByResourcesCore(config, appointments, config.loadedResources);
    }

    let totalResourceCount = 0;

    config.loadedResources.forEach((resource, index) => {
        if(!index) {
            totalResourceCount = resource.items.length;
        } else {
            totalResourceCount *= resource.items.length;
        }
    });

    for(let index = 0; index < totalResourceCount; index++) {
        const key = index.toString();

        if(result[key]) {
            continue;
        }

        result[key] = [];
    }

    return result;
};

export const groupAppointmentsByResourcesCore = (config, appointments, resources) => {
    const tree = createResourcesTree(resources);
    const result = {};

    appointments.forEach(appointment => {
        const appointmentResources = getResourcesFromItem(
            config._resourceFields,
            () => config.getResources(),
            (field, action) => config.getDataAccessors(field, action),
            appointment
        );

        const treeLeaves = getResourceTreeLeaves((field, action) => config.getDataAccessors(field, action), tree, appointmentResources);

        for(let i = 0; i < treeLeaves.length; i++) {
            if(!result[treeLeaves[i]]) {
                result[treeLeaves[i]] = [];
            }

            // NOTE: check appointment before pushing
            result[treeLeaves[i]].push(deepExtendArraySafe({}, appointment, true));
        }
    });

    return result;
};

export const getResourceTreeLeaves = (getDataAccessors, tree, appointmentResources, result) => {
    result = result || [];

    for(let i = 0; i < tree.length; i++) {
        if(!hasGroupItem(getDataAccessors, appointmentResources, tree[i].name, tree[i].value)) {
            continue;
        }

        if(isDefined(tree[i].leafIndex)) {
            result.push(tree[i].leafIndex);
        }

        if(tree[i].children) {
            getResourceTreeLeaves(tree[i].children, appointmentResources, result);
        }
    }

    return result;
};

const hasGroupItem = (getDataAccessors, appointmentResources, groupName, itemValue) => {
    const group = getDataAccessors(groupName, 'getter')(appointmentResources);

    if(group) {
        if(inArray(itemValue, group) > -1) {
            return true;
        }
    }
    return false;
};

export const createReducedResourcesTree = (loadedResources, getDataAccessors, appointments) => {
    const tree = createResourcesTree(loadedResources);
    return reduceResourcesTree(getDataAccessors, tree, appointments);
};

export const reduceResourcesTree = (getDataAccessors, tree, existingAppointments, _result) => {
    _result = _result ? _result.children : [];

    tree.forEach(function(node, index) {
        let ok = false;
        const resourceName = node.name;
        const resourceValue = node.value;
        const resourceTitle = node.title;
        const resourceData = node.data;
        const resourceGetter = getDataAccessors(resourceName, 'getter');

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
            reduceResourcesTree(getDataAccessors, node.children, existingAppointments, _result[index]);
        }

    });

    return _result;
};
