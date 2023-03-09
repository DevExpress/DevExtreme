// @ts-check

import { Deferred } from '../../../core/utils/deferred';
import DataSource from '../../../data/data_source';
import { normalizeDataSourceOptions } from '../../../data/data_source/utils';
import variableWrapper from '../../../core/utils/variable_wrapper';
import { isFunction, isString } from '../../../core/utils/type';
import gridCoreUtils from '../ui.grid_core.utils';

function normalizeGroupingLoadOptions(group) {
    if(!Array.isArray(group)) {
        group = [group];
    }

    return group.map((item, i) =>
        isString(item) ? {
            selector: item,
            isExpanded: i < group.length - 1,
        } : item
    );
}

const sliceItems = (items, loadOptions) => {
    const start = loadOptions.skip ?? 0;
    const end = loadOptions.take ? start + loadOptions.take : items.length;
    return items.slice(start, end);
};

const createUniqueItemsLoader = (dataSource, column, filter) => {
    const hasGroupPaging = dataSource.remoteOperations().groupPaging;
    const hasLookupOptimization = column.displayField && isString(column.displayField);

    let cachedUniqueRelevantItems;
    let previousTake;
    let previousSkip;

    return (loadOptions) => {
        const group = normalizeGroupingLoadOptions(
            hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField
        );
        const d = Deferred();

        const canUseCache = cachedUniqueRelevantItems && (
            !hasGroupPaging ||
            (loadOptions.skip === previousSkip && loadOptions.take === previousTake)
        );

        if(canUseCache) {
            d.resolve(sliceItems(cachedUniqueRelevantItems, loadOptions));
        } else {
            previousSkip = loadOptions.skip;
            previousTake = loadOptions.take;
            dataSource.load({
                filter,
                group,
                take: hasGroupPaging ? loadOptions.take : undefined,
                skip: hasGroupPaging ? loadOptions.skip : undefined,
            }).done((items) => {
                cachedUniqueRelevantItems = items;
                d.resolve(hasGroupPaging ? items : sliceItems(items, loadOptions));
            }).fail(d.fail);
        }

        return d;
    };
};

/**
 *
 * @param {import('../columns_controller/types').Lookup} lookup
 */
export function normalizeLookupDataSource(lookup) {
    if(lookup.items) {
        return normalizeDataSourceOptions(lookup.items);
    } else if(
        isFunction(lookup.dataSource)
        && !variableWrapper.isWrapped(lookup.dataSource)
    ) {
        return normalizeDataSourceOptions(lookup.dataSource({}));
    }

    return normalizeDataSourceOptions(lookup.dataSource);
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

    const loadUniqueRelevantItems = createUniqueItemsLoader(dataSource, column, filter);

    const lookupDataSource = {
        ...lookupDataSourceOptions,
        __dataGridSourceFilter: filter,
        key: column.lookup.valueExpr,
        load(loadOptions) {
            const d = Deferred();
            loadUniqueRelevantItems(loadOptions).done((items) => {
                if(items.length === 0) {
                    d.resolve([]);
                    return;
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

                newDataSource
                    .load()
                    // @ts-ignore
                    .done(d.resolve)
                    .fail(d.fail);
            }).fail(d.fail);
            return d;
        },
        byKey(key) {
            const d = Deferred();
            this.load({
                filter: [column.lookup.valueExpr, '=', key],
            }).done(arr => {
                d.resolve(arr[0]);
            });

            return d.promise();
        },
    };

    return lookupDataSource;
}
