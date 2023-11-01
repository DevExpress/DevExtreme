import { Deferred } from '@js/core/utils/deferred';
import { isString } from '@js/core/utils/type';
import { DataSource } from '@js/data/data_source/data_source';

import { normalizeLookupDataSource } from './m_utils';

function normalizeGroupingLoadOptions(group) {
  if (!Array.isArray(group)) {
    group = [group];
  }

  return group.map((item, i) => {
    if (isString(item)) {
      return {
        selector: item,
        isExpanded: i < group.length - 1,
      };
    }

    return item;
  });
}

function sliceItems<T>(items: T[], loadOptions: { skip: number; take: number }): T[] {
  const start = loadOptions.skip ?? 0;
  const end = loadOptions.take ? start + loadOptions.take : items.length;
  return items.slice(start, end);
}

function createUniqueRelevantItemsLoader(dataSource, column, filter) {
  const hasGroupPaging = dataSource.remoteOperations().groupPaging;
  const hasLookupOptimization = column.displayField && isString(column.displayField);

  let cachedUniqueRelevantItems;
  let previousTake;
  let previousSkip;

  const loadUniqueRelevantItems = (loadOptions) => {
    const group = normalizeGroupingLoadOptions(
      hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField,
    );
    const d = Deferred<any>();

    const canUseCache = cachedUniqueRelevantItems && (
      !hasGroupPaging
      || (loadOptions.skip === previousSkip && loadOptions.take === previousTake)
    );

    if (canUseCache) {
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

  return loadUniqueRelevantItems;
}

export function getWrappedLookupDataSource(column, dataSource, filter) {
  if (!dataSource) {
    return [];
  }

  const lookupDataSourceOptions = normalizeLookupDataSource(column.lookup);

  if (column.calculateCellValue !== column.defaultCalculateCellValue) {
    return lookupDataSourceOptions;
  }

  const loadUniqueRelevantItems = createUniqueRelevantItemsLoader(column, dataSource, filter);

  const lookupDataSource = {
    ...lookupDataSourceOptions,
    __dataGridSourceFilter: filter,
    load: (loadOptions) => {
      const d = Deferred<any>();
      loadUniqueRelevantItems(loadOptions).done((items) => {
        if (items.length === 0) {
          d.resolve([]);
          return;
        }

        const filter = this.combineFilters(
          items.flatMap((data) => data.key).map((key) => [
            column.lookup.valueExpr, key,
          ]),
          'or',
        );

        const newDataSource = new DataSource({
          ...lookupDataSourceOptions,
          ...loadOptions,
          filter: this.combineFilters([filter, loadOptions.filter], 'and'),
          paginate: false, // pagination is included to filter
        });

        newDataSource
        // @ts-expect-error
          .load()
          .done(d.resolve)
          .fail(d.fail);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      }).fail(d.fail);
      return d;
    },
    key: column.lookup.valueExpr,
    byKey(key) {
      const d = Deferred();
      this.load({
        filter: [column.lookup.valueExpr, '=', key],
      }).done((arr) => {
        d.resolve(arr[0]);
      });

      return d.promise();
    },
  };

  return lookupDataSource;
}
