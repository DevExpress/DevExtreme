import ArrayStore from '@js/common/data/array_store';
import { CustomStore } from '@js/common/data/custom_store';
import { DataSource } from '@js/common/data/data_source/data_source';
import dataQuery from '@js/common/data/query';
import { aggregators } from '@js/common/data/utils';
import { noop } from '@js/core/utils/common';
import dateSerialization from '@js/core/utils/date_serialization';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import { compileGetter, toComparable } from '@ts/core/utils/data';
import type { StoreKey } from '@ts/data/abstract_store';
import type { LoadOperation, StoreLoadOptions } from '@ts/data/data_source/types';
import type {
  DiscoveredField,
  DrillDownParams,
  PivotGridAxis,
  PivotGridField,
  PivotGridFilterValue,
  PivotGridLoadOptions,
} from '@ts/grids/pivot_grid/types';

import {
  discoverObjectFields,
  getFiltersByPath,
  setDefaultFieldValueFormatting,
  setFieldProperty,
  storeDrillDownMixin,
} from '../widget_utils';
import type {
  CustomSummaryOptions,
  DataItemFilter,
  DateIntervalSelector,
  FieldSelector,
  FieldSelectors,
  LocalAggregator,
  LocalExpandedPaths,
  LocalField,
  LocalFilterOptions,
  LocalHeaderItem,
  LocalHeaderItemsHash,
  LocalHeaders,
  LocalHierarchyOptions,
  LocalLoadOptions,
  LocalLoadResult,
  LocalStoreOptions,
} from './types';

const PATH_DELIMITER = '/./';

const DATE_INTERVAL_SELECTORS: Record<string, DateIntervalSelector> = {
  year(date) {
    return date && date.getFullYear();
  },
  quarter(date) {
    return date && (Math.floor(date.getMonth() / 3) + 1);
  },
  month(date) {
    return date && (date.getMonth() + 1);
  },
  day(date) {
    return date && date.getDate();
  },
  dayOfWeek(date) {
    return date && date.getDay();
  },
};

const AGGREGATORS: Partial<Record<string, LocalAggregator>> = aggregators;

function getDataSelector(dataField: string): FieldSelector {
  return dataField.includes('.')
    ? compileGetter(dataField)
    : function selectDataField(data: unknown): unknown {
      // @ts-expect-error a data item is an object here
      return data[dataField];
    };
}

function getDateValue(dataSelector: FieldSelector): FieldSelector {
  return function selectDateValue(data: unknown): unknown {
    const value = dataSelector(data);
    if (value && !(value instanceof Date)) {
      return dateSerialization.deserializeDate(value);
    }
    return value;
  };
}

function prepareFields(fields: PivotGridField[] | undefined): void {
  (fields || []).forEach((field) => {
    if (!field.selector) {
      const { dataField, levels } = field;
      const dataSelector = dataField
        ? getDataSelector(dataField)
        : function selectData(data: unknown): unknown { return data; };
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
      let fieldSelector: FieldSelector;

      if (levels) {
        prepareFields(levels);
      }

      if (field.dataType === 'date') {
        const intervalSelector: DateIntervalSelector | undefined = DATE_INTERVAL_SELECTORS[
          String(field.groupInterval)
        ];
        const valueSelector = getDateValue(dataSelector);

        fieldSelector = function selectDateInterval(data: unknown): unknown {
          // @ts-expect-error a date field's value is a Date or empty
          const value: Date | undefined = valueSelector(data);
          return intervalSelector ? intervalSelector(value) : value;
        };
      } else if (field.dataType === 'number') {
        const groupInterval = isNumeric(field.groupInterval)
          && field.groupInterval > 0
          && field.groupInterval;

        fieldSelector = function selectNumberGroup(data: unknown): unknown {
          // @ts-expect-error a number field's value is a number or a numeric string
          let value: number | string = dataSelector(data);
          if (isString(value)) {
            value = Number(value);
          }
          return groupInterval ? Math.floor(value / groupInterval) * groupInterval : value;
        };
      } else {
        fieldSelector = dataSelector;
      }

      setDefaultFieldValueFormatting(field);

      setFieldProperty(field, 'selector', fieldSelector);
    }
  });
}

const addHierarchyItem = function addHierarchyItem(
  value: unknown,
  hierarchyItems: LocalHeaderItem[],
  pathHash: string,
  childrenHash: LocalHeaderItemsHash,
): LocalHeaderItem {
  // @ts-expect-error the "length" key holds the item count
  const existingItem: LocalHeaderItem | undefined = childrenHash[pathHash];

  if (existingItem) {
    return existingItem;
  }

  const hierarchyItem: LocalHeaderItem = {
    value,
    index: childrenHash.length,
  };
  childrenHash.length += 1;
  childrenHash[pathHash] = hierarchyItem;
  hierarchyItems.push(hierarchyItem);

  return hierarchyItem;
};

function fillHierarchyItemIndexesCore(
  indexes: number[],
  options: LocalHierarchyOptions,
  children: LocalHeaderItem[],
  expandIndex: number,
  pathHash?: string,
): void {
  const dimension = options.dimensions[expandIndex];
  const { expandedPathsHash } = options;

  if (dimension) {
    const dimensionValue = dimension.selector(options.data);
    const itemPathHash = pathHash !== undefined
      ? `${pathHash}${PATH_DELIMITER}${dimensionValue}`
      : `${dimensionValue}`;

    const hierarchyItem = addHierarchyItem(
      dimensionValue,
      children,
      itemPathHash,
      options.childrenHash,
    );

    indexes.push(hierarchyItem.index);

    if (expandedPathsHash?.[itemPathHash] || dimension.expanded) {
      hierarchyItem.children ??= [];
      fillHierarchyItemIndexesCore(
        indexes,
        options,
        hierarchyItem.children,
        expandIndex + 1,
        itemPathHash,
      );
    }
  }
}

function generateHierarchyItems(
  data: unknown,
  loadOptions: LocalLoadOptions,
  headers: LocalHeaders,
  headerName: PivotGridAxis,
): number[] {
  const result = [0];
  const expandIndex = loadOptions.headerName === headerName ? loadOptions.path?.length ?? 0 : 0;
  const expandedPaths = headerName === 'rows' ? loadOptions.rowExpandedPaths : loadOptions.columnExpandedPaths;
  const options: LocalHierarchyOptions = {
    data,
    childrenHash: headers[`${headerName}Hash`],
    dimensions: loadOptions[headerName],
    expandedPathsHash: loadOptions.headerName !== headerName ? expandedPaths?.hash : undefined,
  };

  fillHierarchyItemIndexesCore(result, options, headers[headerName], expandIndex);

  return result;
}

function generateAggregationCells(
  data: unknown,
  cells: unknown[][][],
  headers: LocalHeaders,
  options: LocalLoadOptions,
): unknown[][] {
  const cellSet: unknown[][] = [];

  const rowIndexes = generateHierarchyItems(data, options, headers, 'rows');
  const columnIndexes = generateHierarchyItems(data, options, headers, 'columns');

  for (const rowIndex of rowIndexes) {
    cells[rowIndex] = cells[rowIndex] ?? [];
    for (const columnIndex of columnIndexes) {
      cellSet.push(cells[rowIndex][columnIndex] = cells[rowIndex][columnIndex] ?? []);
    }
  }

  return cellSet;
}

function fillHashExpandedPath(expandedPaths: LocalExpandedPaths | undefined): void {
  if (expandedPaths) {
    const hash: Record<string, boolean> = {};
    expandedPaths.hash = hash;
    expandedPaths.forEach((path) => {
      const pathValue = path.map((value) => `${value}`).join(PATH_DELIMITER);
      hash[pathValue] = true;
    });
  }
}

function prepareLoadOption(options: PivotGridLoadOptions): asserts options is LocalLoadOptions {
  options.rows = options.rows || [];
  options.columns = options.columns || [];
  options.filters = options.filters || [];

  fillHashExpandedPath(options.columnExpandedPaths);
  fillHashExpandedPath(options.rowExpandedPaths);

  prepareFields(options.columns);
  prepareFields(options.rows);
  prepareFields(options.values);
  prepareFields(options.filters);
}

function getAggregator(field: LocalField): LocalAggregator {
  if (field.summaryType === 'custom') {
    field.calculateCustomSummary = field.calculateCustomSummary || noop;

    return {
      seed(): CustomSummaryOptions {
        const options: CustomSummaryOptions = {
          summaryProcess: 'start',
          totalValue: undefined,
        };
        field.calculateCustomSummary?.(options);
        return options;
      },
      step(options: CustomSummaryOptions, value: unknown): CustomSummaryOptions {
        options.summaryProcess = 'calculate';
        options.value = value;
        field.calculateCustomSummary?.(options);
        return options;
      },
      finalize(options: CustomSummaryOptions): unknown {
        options.summaryProcess = 'finalize';
        delete options.value;
        field.calculateCustomSummary?.(options);
        return options.totalValue;
      },
    };
  }

  return AGGREGATORS[String(field.summaryType)] ?? aggregators.count;
}

function aggregationStep(
  measures: LocalField[],
  aggregationCells: unknown[][],
  data: unknown,
): void {
  for (let aggregatorIndex = 0; aggregatorIndex < measures.length; aggregatorIndex += 1) {
    const cellField = measures[aggregatorIndex];
    const cellValue = cellField.selector(data);

    const aggregator = getAggregator(cellField);
    const isAggregatorSeedFunction = typeof aggregator.seed === 'function';

    for (const cell of aggregationCells) {
      if (cell.length <= aggregatorIndex) {
        cell[aggregatorIndex] = isAggregatorSeedFunction ? aggregator.seed() : aggregator.seed;
      }
      if (cell[aggregatorIndex] === undefined) {
        cell[aggregatorIndex] = cellValue;
      } else if (isDefined(cellValue)) {
        cell[aggregatorIndex] = aggregator.step(cell[aggregatorIndex], cellValue);
      }
    }
  }
}

function aggregationFinalize(measures: LocalField[] | undefined, cells: unknown[][][]): void {
  measures?.forEach((cellField, aggregatorIndex) => {
    const aggregator = getAggregator(cellField);
    if (aggregator.finalize) {
      cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell?.[aggregatorIndex] !== undefined) {
            cell[aggregatorIndex] = aggregator.finalize?.(cell[aggregatorIndex]);
          }
        });
      });
    }
  });
}

function areValuesEqual(filterValue: PivotGridFilterValue, fieldValue: unknown): boolean {
  let valueOfFilter = filterValue && filterValue.valueOf();
  let valueOfField = fieldValue && fieldValue.valueOf();

  if (Array.isArray(filterValue)) {
    // @ts-expect-error a hierarchy field's value is an array
    const fieldValues: unknown[] = fieldValue || [];

    for (let i = 0; i < filterValue.length; i += 1) {
      const filterItem = filterValue[i];
      const fieldItem = fieldValues[i];
      valueOfFilter = filterItem && filterItem.valueOf();
      valueOfField = fieldItem && fieldItem.valueOf();

      if (valueOfFilter !== valueOfField) {
        return false;
      }
    }
    return true;
  }
  return valueOfFilter === valueOfField;
}

function getGroupValue(levels: LocalField[], data: unknown): unknown[] {
  return levels.map((field) => field.selector(data));
}

function createDimensionFilters(dimension: LocalField[]): DataItemFilter[] {
  const filters: DataItemFilter[] = [];
  dimension.forEach((field) => {
    const filterValues = field.filterValues || [];
    const { groupName } = field;

    if (groupName && isNumeric(field.groupIndex)) {
      return;
    }
    const filter = function filter(dataItem: unknown): boolean {
      const value = field.levels
        ? getGroupValue(field.levels, dataItem)
        : field.selector(dataItem);
      const result = filterValues.some((filterValue) => areValuesEqual(filterValue, value));

      return field.filterType === 'exclude' ? !result : result;
    };

    if (filterValues.length) {
      filters.push(filter);
    }
  });
  return filters;
}

function createFilter(options: LocalFilterOptions): DataItemFilter {
  const filters = createDimensionFilters(options.rows)
    .concat(createDimensionFilters(options.columns))
    .concat(createDimensionFilters(options.filters));
  const expandedDimensions = options.headerName ? options[options.headerName] : undefined;
  const { path } = options;

  if (expandedDimensions && path) {
    filters.push((dataItem) => path.every((pathValue, index) => {
      const expandValue = expandedDimensions[index].selector(dataItem);
      return toComparable(expandValue, true) === toComparable(pathValue, true);
    }));
  }

  return function filterDataItem(dataItem: unknown): boolean {
    return filters.every((filter) => filter(dataItem));
  };
}

function loadCore(
  items: unknown[],
  options: LocalLoadOptions,
  notifyProgress: (progress: number) => void,
): DeferredObj<LocalLoadResult> {
  const headers: LocalHeaders = {
    columns: [],
    rows: [],
    columnsHash: { length: 1 },
    rowsHash: { length: 1 },
  };
  const values: unknown[][][] = [];
  const d = Deferred<LocalLoadResult>();
  let i = 0;

  const filter = createFilter(options);

  function processData(): void {
    const t = new Date();
    const startIndex = i;

    for (; i < items.length; i += 1) {
      if (i > startIndex && i % 10000 === 0) {
        if (Number(new Date()) - Number(t) >= 300) {
          notifyProgress(i / items.length);
          // eslint-disable-next-line no-restricted-globals -- yields to the browser between chunks
          setTimeout(processData, 0);

          return;
        }
      }
      const data = items[i];
      if (filter(data)) {
        const aggregationCells = generateAggregationCells(data, values, headers, options);
        if (options.values) {
          aggregationStep(options.values, aggregationCells, data);
        }
      }
    }

    aggregationFinalize(options.values, values);
    notifyProgress(1);
    d.resolve({
      rows: headers.rows,
      columns: headers.columns,
      values,
      grandTotalRowIndex: 0,
      grandTotalColumnIndex: 0,
    });
  }

  processData();

  return d;
}

function processFilter(filter: unknown, fieldSelectors: FieldSelectors): unknown {
  if (!Array.isArray(filter)) {
    return filter;
  }

  const processedFilter = filter.slice(0);
  if (
    isString(processedFilter[0])
    && (processedFilter[1] instanceof Date || processedFilter[2] instanceof Date)
  ) {
    processedFilter[0] = fieldSelectors[processedFilter[0]];
  }

  for (let i = 0; i < processedFilter.length; i += 1) {
    processedFilter[i] = processFilter(processedFilter[i], fieldSelectors);
  }
  return processedFilter;
}

function filterDataSource(dataSource: DataSource, fieldSelectors: FieldSelectors): unknown[] {
  let filter = dataSource.filter();

  if (dataSource.store() instanceof CustomStore && filter) {
    filter = processFilter(filter, fieldSelectors);
    return dataQuery(dataSource.items()).filter(filter).toArray();
  }

  return dataSource.items();
}

function loadDataSource(
  dataSource: DataSource,
  fieldSelectors: FieldSelectors,
  reload?: boolean,
): DeferredObj<unknown[]> {
  const d = Deferred<unknown[]>();

  const customizeStoreLoadOptionsHandler = function customizeStoreLoadOptionsHandler(
    options: LoadOperation,
  ): void {
    if (dataSource.store() instanceof ArrayStore) {
      options.storeLoadOptions.filter = processFilter(
        options.storeLoadOptions.filter,
        fieldSelectors,
      );
    }
  };

  dataSource.on('customizeStoreLoadOptions', customizeStoreLoadOptionsHandler);

  if (!dataSource.isLoaded() || reload) {
    const loadDeferred = reload ? dataSource.load() : dataSource.reload();
    when(loadDeferred).done(() => {
      loadDataSource(dataSource, fieldSelectors).done(() => {
        d.resolve(filterDataSource(dataSource, fieldSelectors));
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(d.reject);
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);
  } else {
    d.resolve(filterDataSource(dataSource, fieldSelectors));
  }
  return d.always(() => {
    dataSource.off('customizeStoreLoadOptions', customizeStoreLoadOptionsHandler);
  });
}

function fillSelectorsByFields(selectors: FieldSelectors, fields: PivotGridField[]): void {
  fields.forEach((field) => {
    if (field.dataField && field.dataType === 'date') {
      selectors[field.dataField] = getDateValue(getDataSelector(field.dataField));
    }
  });
}

function getFieldSelectors(
  options: PivotGridField[] | LocalLoadOptions | undefined,
): FieldSelectors {
  const selectors: FieldSelectors = {};

  if (Array.isArray(options)) {
    fillSelectorsByFields(selectors, options);
  } else if (options) {
    (['rows', 'columns', 'filters'] as const).forEach((area) => {
      if (options[area]) {
        fillSelectorsByFields(selectors, options[area]);
      }
    });
  }
  return selectors;
}

class LocalStore {
  public _progressChanged: (progress: number) => void;

  public _dataSource: DataSource;

  constructor(options: LocalStoreOptions) {
    this._progressChanged = options.onProgressChanged || noop;
    this._dataSource = new DataSource(options);
    this._dataSource.paginate(false);
  }

  public getFields(fields?: PivotGridField[]): DeferredObj<DiscoveredField[]> {
    const d = Deferred<DiscoveredField[]>();

    loadDataSource(this._dataSource, getFieldSelectors(fields)).done((data) => {
      d.resolve(discoverObjectFields(data, fields));
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    return d;
  }

  public key(): StoreKey | undefined {
    return this._dataSource.key();
  }

  public load(options: PivotGridLoadOptions): DeferredObj<LocalLoadResult> {
    const d = Deferred<LocalLoadResult>();

    prepareLoadOption(options);

    loadDataSource(this._dataSource, getFieldSelectors(options), options.reload).done((data) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      when(loadCore(data, options, this._progressChanged)).done(d.resolve);
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    return d;
  }

  public filter(): StoreLoadOptions['filter'];
  public filter(...filterExpr: NonNullable<StoreLoadOptions['filter']>[]): void;
  public filter(...args: unknown[]): unknown {
    return this._dataSource.filter(...args);
  }

  public supportPaging(): boolean {
    return false;
  }

  public getDrillDownItems(
    descriptions: PivotGridLoadOptions | undefined,
    drillDownParams: DrillDownParams | undefined,
  ): unknown[] {
    // @ts-expect-error descriptions are created on the first load
    const loadOptions: PivotGridLoadOptions = descriptions || {};
    const params: DrillDownParams = drillDownParams || {};
    prepareLoadOption(loadOptions);

    const drillDownItems: unknown[] = [];
    const items = this._dataSource.items();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let item: unknown;
    const { maxRowCount } = params;
    const { customColumns } = params;
    const filter = createFilter(loadOptions);
    const pathFilter = createFilter({
      // @ts-expect-error getFiltersByPath() copies the prepared fields
      rows: getFiltersByPath(loadOptions.rows, params.rowPath),
      // @ts-expect-error getFiltersByPath() copies the prepared fields
      columns: getFiltersByPath(loadOptions.columns, params.columnPath),
      filters: [],
    });

    for (const dataItem of items) {
      if (pathFilter(dataItem) && filter(dataItem)) {
        if (customColumns) {
          item = {};

          // eslint-disable-next-line max-depth -- copies the custom columns of a matching data item
          for (const column of customColumns) {
            // @ts-expect-error a data item is an object here
            item[column] = dataItem[column];
          }
        } else {
          item = dataItem;
        }

        drillDownItems.push(item);
      }
      if ((maxRowCount ?? 0) > 0 && drillDownItems.length === maxRowCount) {
        break;
      }
    }

    return drillDownItems;
  }
}

Object.assign(LocalStore.prototype, storeDrillDownMixin);

export default { LocalStore };
export { LocalStore };
