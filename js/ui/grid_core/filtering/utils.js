// @ts-check

import DataSource from '../../../data/data_source';
import { normalizeDataSourceOptions } from '../../../data/data_source/utils';
import variableWrapper from '../../../core/utils/variable_wrapper';
import { isFunction, isString } from '../../../core/utils/type';
import gridCoreUtils from '../ui.grid_core.utils';

function normalizeGroupingLoadOptions(group) {
    if(!Array.isArray(group)) {
        group = [group];
    }

    return group.map((item, i) => {
        if(isString(item)) {
            return {
                selector: item,
                isExpanded: i < group.length - 1,
            };
        }

        return item;
    });
}

/**
 *
 * @param {import('../columns_controller/types').Lookup} lookup
 */
export function normalizeLookupDataSource(lookup) {
    let lookupDataSourceOptions;
    if(lookup.items) {
        lookupDataSourceOptions = lookup.items;
    } else {
        lookupDataSourceOptions = lookup.dataSource;
        if(isFunction(lookupDataSourceOptions) && !variableWrapper.isWrapped(lookupDataSourceOptions)) {
            lookupDataSourceOptions = lookupDataSourceOptions({});
        }
    }

    return normalizeDataSourceOptions(lookupDataSourceOptions);
}

/**
 *
 * @param {import('../columns_controller/types').LookupColumn} column
 * @param {import('../ui.grid_core.data_source_adapter').DataSourceAdapter} dataSource
 * @param {*} filter
 */
export function getWrappedLookupDataSource(column, dataSource, filter) {
    if(!dataSource) {
        return [];
    }

    const lookupDataSourceOptions = normalizeLookupDataSource(column.lookup);

    if(column.calculateCellValue !== column.defaultCalculateCellValue) {
        return lookupDataSourceOptions;
    }

    const hasGroupPaging = dataSource.remoteOperations().groupPaging;
    const hasLookupOptimization = column.displayField && isString(column.displayField);

    const sliceItems = (items, loadOptions) => {
        const start = loadOptions.skip ?? 0;
        const end = loadOptions.take ? start + loadOptions.take : items.length;
        return items.slice(start, end);
    };

    let cachedUniqueRelevantItems;
    let previousTake;
    let previousSkip;

    const loadUniqueRelevantItems = async(loadOptions) => {
        const group = normalizeGroupingLoadOptions(
            hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField
        );

        const canUseCache = cachedUniqueRelevantItems && (
            !hasGroupPaging ||
            (loadOptions.skip === previousSkip && loadOptions.take === previousTake)
        );

        if(canUseCache) {
            return sliceItems(cachedUniqueRelevantItems, loadOptions);
        } else {
            previousSkip = loadOptions.skip;
            previousTake = loadOptions.take;
            const items = await dataSource.load({
                filter,
                group,
                take: hasGroupPaging ? loadOptions.take : undefined,
                skip: hasGroupPaging ? loadOptions.skip : undefined,
            });
            cachedUniqueRelevantItems = items;
            return hasGroupPaging ? items : sliceItems(items, loadOptions);
        }
    };

    const lookupDataSource = {
        ...lookupDataSourceOptions,
        __dataGridSourceFilter: filter,
        load: async(loadOptions) => {
            const items = await loadUniqueRelevantItems(loadOptions);
            if(items.length === 0) {
                return [];
            }

            const filter = gridCoreUtils.combineFilters(
                items.flatMap((data) => data.key).map((key => [
                    column.lookup.valueExpr, key,
                ])),
                'or'
            );

            const newDataSource = new DataSource({
                ...lookupDataSourceOptions,
                ...loadOptions,
                filter: gridCoreUtils.combineFilters([filter, loadOptions.filter], 'and'),
                paginate: false, // pagination is included to filter
            });

            return newDataSource.load();
        },
        key: column.lookup.valueExpr,
        async byKey(key) {
            const arr = await this.load({
                filter: [column.lookup.valueExpr, '=', key],
            });

            return arr[0];
        },
    };

    return lookupDataSource;
}
