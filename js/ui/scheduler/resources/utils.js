import { normalizeDataSourceOptions } from '../../../data/data_source/utils';
import { DataSource } from '../../../data/data_source/data_source';

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

export const isResourceMultiple = resourceField => {
    const resource = this.getResources().find(resource => {
        const field = getFieldExpr(resource);
        return field === resourceField;
    });

    return !!resource?.allowMultiple;
};
