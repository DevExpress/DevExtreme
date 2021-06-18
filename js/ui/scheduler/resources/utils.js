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
