import core from './localization/core';
import message from './localization/message';
import number from './localization/number';
import date from './localization/date';
import './localization/currency';

/**
 * @name localization
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

    const loadUniqueRelevantItems = (loadOptions) => {
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

    const lookupDataSource = {
        ...lookupDataSourceOptions,
        __dataGridSourceFilter: filter,
        load: (loadOptions) => {
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
        key: column.lookup.valueExpr,
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

export const locale = core.locale.bind(core);

export const loadMessages = message.load.bind(message);
export const formatMessage = message.format.bind(message);
export const formatNumber = number.format.bind(number);
export const parseNumber = number.parse.bind(number);
export const formatDate = date.format.bind(date);
export const parseDate = date.parse.bind(date);
export {
    message,
    number,
    date
};

export function disableIntl() {
    if(number.engine() === 'intl') {
        number.resetInjection();
    }
    if(date.engine() === 'intl') {
        date.resetInjection();
    }
}
