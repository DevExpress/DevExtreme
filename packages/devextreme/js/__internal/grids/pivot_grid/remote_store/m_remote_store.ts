import { DataSource } from '@js/common/data/data_source/data_source';
import { normalizeLoadResult } from '@js/common/data/data_source/utils';
import type { ScalarFilterValue } from '@js/common/grids';
import dateSerialization from '@js/core/utils/date_serialization';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction, isString } from '@js/core/utils/type';
import { capitalize } from '@ts/core/utils/capitalize';
import type Store from '@ts/data/abstract_store';
import type { StoreKey } from '@ts/data/abstract_store';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type {
  DiscoveredField,
  DrillDownParams,
  ExpandedLevelOptions,
  PivotGridAxis,
  PivotGridField,
  PivotGridFilterField,
  PivotGridLoadOptions,
} from '@ts/grids/pivot_grid/types';

import pivotGridUtils, {
  getExpandedLevel,
  getFiltersByPath,
  setDefaultFieldValueFormatting,
} from '../m_widget_utils';
import { forEachGroup } from './m_remote_store_utils';
import type {
  DataFilter,
  FilterExpression,
  GroupingOption,
  RemoteFilterField,
  RemoteGroup,
  RemoteGroupedResult,
  RemoteHeaderItem,
  RemoteLoadExtra,
  RemoteLoadOptions,
  RemoteLoadResult,
  RemoteParseState,
  RemoteRequestOptions,
} from './types';

function createGroupingOptions(
  fields: PivotGridField[],
  useSortOrder: number | undefined,
): GroupingOption[] {
  return fields.map((field, index) => ({
    selector: field.dataField,
    groupInterval: field.groupInterval,
    desc: useSortOrder && field.sortOrder === 'desc',
    isExpanded: index < fields.length - 1,
  }));
}

function getFieldFilterSelector(field: RemoteFilterField): string | undefined {
  let selector = field.dataField;
  let { groupInterval } = field;

  if (field.dataType === 'date' && typeof groupInterval === 'string') {
    if (groupInterval.toLowerCase() === 'quarter') {
      groupInterval = 'Month';
    }
    selector = `${selector}.${capitalize(groupInterval)}`;
  }

  return selector;
}

function getIntervalFilterExpression(
  selector: string | undefined,
  numericInterval: number,
  numericValue: number,
  isExcludedFilterType: boolean,
): FilterExpression {
  const startFilterValue = [selector, isExcludedFilterType ? '<' : '>=', numericValue];
  const endFilterValue = [selector, isExcludedFilterType ? '>=' : '<', numericValue + numericInterval];

  return [startFilterValue, isExcludedFilterType ? 'or' : 'and', endFilterValue];
}

function getFilterExpressionForFilterValue(
  field: RemoteFilterField,
  filterValue: ScalarFilterValue,
  filterType?: string,
): FilterExpression {
  const selector = getFieldFilterSelector(field);
  const isExcludedFilterType = (filterType ?? field.filterType) === 'exclude';
  let expression: FilterExpression = [selector, isExcludedFilterType ? '<>' : '=', filterValue];

  if (isDefined(field.groupInterval)) {
    if (typeof field.groupInterval === 'string' && field.groupInterval.toLowerCase() === 'quarter') {
      expression = getIntervalFilterExpression(
        selector,
        3,
        // @ts-expect-error a quarter value is a number
        (filterValue - 1) * 3 + 1,
        isExcludedFilterType,
      );
    } else if (typeof field.groupInterval === 'number' && field.dataType !== 'date') {
      expression = getIntervalFilterExpression(
        selector,
        field.groupInterval,
        // @ts-expect-error a numeric interval value is a number
        filterValue,
        isExcludedFilterType,
      );
    }
  }

  return expression;
}

function createFieldFilterExpressions(
  field: RemoteFilterField,
  operation?: string,
): FilterExpression {
  const fieldFilterExpressions: FilterExpression = [];

  if (field.searchValue) {
    return [field.dataField, 'contains', field.searchValue];
  }

  const currentOperation = operation ?? (field.filterType === 'exclude' ? 'and' : 'or');

  each(field.filterValues, (index, filterValue) => {
    let currentExpression: FilterExpression = [];

    if (Array.isArray(filterValue)) {
      const parseLevelsRecursive = field.levels?.length;

      if (parseLevelsRecursive) {
        currentExpression = createFieldFilterExpressions({
          filterValues: filterValue,
          filterType: field.filterType,
          levels: field.levels,
        }, 'and');
      }
    } else {
      const currentField = field.levels ? field.levels[index] : field;

      currentExpression = getFilterExpressionForFilterValue(currentField, filterValue);
    }

    if (!currentExpression.length) {
      return;
    }

    if (fieldFilterExpressions.length) {
      fieldFilterExpressions.push(currentOperation);
    }

    fieldFilterExpressions.push(currentExpression);
  });

  return fieldFilterExpressions;
}

function createFilterExpressions(fields: RemoteFilterField[] | undefined): FilterExpression {
  let filterExpressions: FilterExpression = [];

  fields?.forEach((field) => {
    const fieldExpressions = createFieldFilterExpressions(field);

    if (!fieldExpressions.length) {
      return;
    }

    if (filterExpressions.length) {
      filterExpressions.push('and');
    }

    filterExpressions.push(fieldExpressions);
  });

  if (filterExpressions.length === 1 && Array.isArray(filterExpressions[0])) {
    // eslint-disable-next-line prefer-destructuring
    filterExpressions = filterExpressions[0];
  }

  return filterExpressions;
}

function mergeFilters(filters: (FilterExpression | undefined)[], op?: string): FilterExpression;
function mergeFilters(filters: (DataFilter | undefined)[], op?: string): DataFilter;
function mergeFilters(filters: (DataFilter | undefined)[], op = 'and'): DataFilter {
  const notEmpty = (filter: DataFilter | undefined): filter is DataFilter => !!filter?.length;

  const result: (DataFilter | string)[] = [];

  filters.forEach((filter) => {
    if (notEmpty(filter)) result.push(filter, op);
  });

  result.pop();

  // remove redundant nesting
  if (result.length === 1 && (Array.isArray(result[0]) || isFunction(result[0]))) {
    return result[0];
  }

  return result;
}

function createLoadOptions(
  options: RemoteRequestOptions,
  externalFilterExpr: DataFilter | undefined,
  hasRows: number,
): RemoteLoadOptions {
  const loadOptions: RemoteLoadOptions = {
    groupSummary: [],
    totalSummary: [],
  };

  const rowGroupingOptions = createGroupingOptions(options.rows, options.rowTake);
  const columnGroupingOptions = createGroupingOptions(options.columns, options.columnTake);
  const groupingOptions = [...rowGroupingOptions, ...columnGroupingOptions];

  if (groupingOptions.length) {
    loadOptions.group = groupingOptions;
    loadOptions.take = undefined;
  } else {
    loadOptions.group = undefined;
    loadOptions.take = 1;
  }

  if (options.rows.length && options.rowTake) {
    loadOptions.skip = options.rowSkip;
    loadOptions.take = options.rowTake;
    loadOptions.requireGroupCount = true;
  } else if (options.columns.length && options.columnTake && !hasRows) {
    loadOptions.skip = options.columnSkip;
    loadOptions.take = options.columnTake;
    loadOptions.requireGroupCount = true;
  }

  let filterExpressions: DataFilter = createFilterExpressions(options.filters);

  filterExpressions = externalFilterExpr
    ? mergeFilters([filterExpressions, options.filterExpression, externalFilterExpr])
    : mergeFilters([filterExpressions, options.filterExpression]);

  if (filterExpressions.length) {
    loadOptions.filter = filterExpressions;
  }

  options.values?.forEach((value) => {
    const summaryOption = {
      selector: value.dataField,
      summaryType: value.summaryType || 'count',
    };

    loadOptions.groupSummary.push(summaryOption);
    if (options.includeTotalSummary) {
      loadOptions.totalSummary.push(summaryOption);
    }
  });

  return loadOptions;
}

function setValue(
  valuesArray: unknown[][][],
  value: unknown,
  rowIndex: number,
  columnIndex: number,
  dataIndex: number,
): void {
  valuesArray[rowIndex] = valuesArray[rowIndex] || [];
  valuesArray[rowIndex][columnIndex] = valuesArray[rowIndex][columnIndex] || [];
  if (!isDefined(valuesArray[rowIndex][columnIndex][dataIndex])) {
    valuesArray[rowIndex][columnIndex][dataIndex] = value;
  }
}

function parseValue(value: unknown, field: PivotGridField | undefined): unknown {
  if (field?.dataType === 'number' && isString(value)) {
    return Number(value);
  }

  if (field?.dataType === 'date' && !field.groupInterval && !(value instanceof Date)) {
    return dateSerialization.deserializeDate(value);
  }

  return value;
}

function parseResult(
  data: (RemoteGroup | undefined)[],
  total: RemoteLoadExtra | undefined,
  descriptions: RemoteRequestOptions,
  result: RemoteParseState,
): RemoteParseState {
  const rowPath: string[] = [];
  let columnPath: string[] = [];
  const { rowHash } = result;
  const { columnHash } = result;
  let groups = data;

  if (total?.summary) {
    each(total.summary, (index, summary) => {
      setValue(
        result.values,
        summary,
        result.grandTotalRowIndex,
        result.grandTotalColumnIndex,
        index,
      );
    });
  }

  if (total?.groupCount !== undefined && total.groupCount >= 0) {
    const skip = descriptions.rows.length ? descriptions.rowSkip : descriptions.columnSkip;
    groups = [...Array(skip)].concat(data);
    groups.length = total.groupCount;
  }

  function getItem(
    dataItem: RemoteGroup,
    dimensionName: 'row' | 'column',
    path: string[],
    level: number,
    field: PivotGridField | undefined,
  ): RemoteHeaderItem {
    const dimensionHash = result[`${dimensionName}Hash`];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let parentItemChildren: RemoteHeaderItem[];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let item: RemoteHeaderItem;
    const pathValue = path.slice(0, level + 1).join('/');

    if (dimensionHash[pathValue] !== undefined) {
      item = dimensionHash[pathValue];
    } else {
      item = {
        value: parseValue(dataItem.key, field),
        // eslint-disable-next-line no-plusplus
        index: result[`${dimensionName}Index`]++,
        displayText: dataItem.displayText,
      };

      const parentPathValue = path.slice(0, level).join('/');

      if (level > 0 && dimensionHash[parentPathValue] !== undefined) {
        const parentItem = dimensionHash[parentPathValue];
        parentItem.children ??= [];
        parentItemChildren = parentItem.children;
      } else {
        parentItemChildren = result[`${dimensionName}s`];
      }

      parentItemChildren.push(item);
      dimensionHash[pathValue] = item;
    }

    return item;
  }

  forEachGroup(groups, (item, level) => {
    const rowLevel = level >= descriptions.rows.length ? descriptions.rows.length : level;
    const columnLevel = level >= descriptions.rows.length ? level - descriptions.rows.length : 0;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let columnItem: RemoteHeaderItem | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let rowItem: RemoteHeaderItem | undefined;

    if (level >= descriptions.rows.length && columnLevel >= descriptions.columns.length) {
      return;
    }

    if (level < descriptions.rows.length) {
      columnPath = [];
    }

    if (level >= descriptions.rows.length) {
      if (item) {
        columnPath[columnLevel] = `${item.key}`;
        columnItem = getItem(item, 'column', columnPath, columnLevel, descriptions.columns[columnLevel]);
        rowItem = rowHash[rowPath.slice(0, rowLevel + 1).join('/')];
      } else {
        result.columns.push({});
      }
    } else if (item) {
      rowPath[rowLevel] = `${item.key}`;
      rowItem = getItem(item, 'row', rowPath, rowLevel, descriptions.rows[rowLevel]);
      columnItem = columnHash[columnPath.slice(0, columnLevel + 1).join('/')];
    } else {
      result.rows.push({});
    }

    const currentRowIndex = rowItem?.index ?? result.grandTotalRowIndex;
    const currentColumnIndex = columnItem?.index ?? result.grandTotalColumnIndex;

    each(item?.summary || [], (i, summary) => {
      setValue(result.values, summary, currentRowIndex, currentColumnIndex, i);
    });
  });

  return result;
}

function getFiltersForDimension(fields: PivotGridField[] | undefined): PivotGridField[] {
  return fields?.filter((f) => f.filterValues?.length || f.searchValue) ?? [];
}

/**
 * If some field in the 'axis' area was expanded, then returns field's level index.
 *
 * Otherwise, returns 0
 */
function getExpandedIndex(options: ExpandedLevelOptions, axis: PivotGridAxis): number {
  if (options.headerName) {
    if (axis === options.headerName) {
      // @ts-expect-error path is set together with headerName
      return options.path.length;
    }

    if (options.oppositePath) {
      return options.oppositePath.length;
    }
  }
  return 0;
}

function getFiltersForExpandedDimension(options: ExpandedLevelOptions): PivotGridFilterField[] {
  const oppositeAxis = options.headerName === 'rows' ? 'columns' : 'rows';

  const fields = options.headerName ? options[options.headerName] : undefined;
  const oppositeFields = options[oppositeAxis];

  // @ts-expect-error path is set together with headerName
  const filters = getFiltersByPath(fields, options.path);
  const oppositeFieldsFilters = getFiltersByPath(oppositeFields, options.oppositePath || []);

  return filters.concat(oppositeFieldsFilters);
}

/**
 * @returns index of the first field with field.expanded != true
 */
function getFirstCollapsedIndex(fields: PivotGridField[]): number {
  for (let index = 0; index < fields.length; index += 1) {
    if (!fields[index].expanded) return index;
  }

  return 0;
}

function getExpandedPathsFilterExprByLevel(
  options: ExpandedLevelOptions,
  axis: PivotGridAxis,
  level: number,
): FilterExpression {
  if (options.headerName === axis) {
    return [];
  }

  const isPathInLevel = (fields: PivotGridField[], path: ScalarFilterValue[]): boolean => {
    if (path.length > level) return false;

    let expandedLevel = path.length;

    while (fields[expandedLevel]?.expanded) {
      expandedLevel += 1;
    }

    return expandedLevel >= level;
  };

  const firstCollapsedFieldIndex = axis === 'rows'
    ? getFirstCollapsedIndex(options.rows)
    : getFirstCollapsedIndex(options.columns);

  // Note: we don't need to create filters for fields with field.expanded=true,
  // if level <= number of the expanded fields that are at the beginning
  const startFieldIndex = level <= firstCollapsedFieldIndex ? firstCollapsedFieldIndex : 0;

  const fields = options[axis].slice(startFieldIndex, level);
  const paths = (axis === 'rows' ? options.rowExpandedPaths : options.columnExpandedPaths) || [];

  const result: FilterExpression[] = [];

  paths.forEach((expandedPath) => {
    const path = expandedPath.slice(startFieldIndex);

    // only prepare filters for paths that are in the specified level
    if (!isPathInLevel(fields, path)) return;

    const filters: FilterExpression[] = [];

    for (let i = 0; i < path.length; i += 1) {
      const field = fields[i];

      if (!isDefined(field)) break;

      const fieldFilterExpression = getFilterExpressionForFilterValue(field, path[i], 'include');

      filters.push(fieldFilterExpression);
    }

    const pathFilterExpression = mergeFilters(filters);

    result.push(pathFilterExpression);
  });

  return mergeFilters(result, 'or');
}

function getGrandTotalRequest(
  options: RemoteRequestOptions,
  dimensionName: PivotGridAxis,
  commonFilters: RemoteFilterField[],
): RemoteRequestOptions[] {
  const expandedIndex = getExpandedIndex(options, dimensionName);
  const expandedLevel = getExpandedLevel(options, dimensionName);
  const expandedPaths = (dimensionName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [];
  const oppositeDimensionName = dimensionName === 'columns' ? 'rows' : 'columns';
  const fields = options[dimensionName];
  const result: RemoteRequestOptions[] = [];

  if (expandedPaths.length) {
    for (let i = expandedIndex; i <= expandedLevel; i += 1) {
      const slicedFields = fields.slice(expandedIndex, i + 1);
      const filterExpr = getExpandedPathsFilterExprByLevel(options, dimensionName, i);

      const grandTotalOptions: Partial<RemoteRequestOptions> = {
        filters: commonFilters,
        filterExpression: filterExpr,
        [dimensionName]: slicedFields,
        [oppositeDimensionName]: [],
      };

      result.push({ ...options, ...grandTotalOptions });
    }
  } else {
    const slicedFields = fields.slice(expandedIndex, expandedLevel + 1);
    const grandTotalOptions: Partial<RemoteRequestOptions> = {
      filters: commonFilters,
      [dimensionName]: slicedFields,
      [oppositeDimensionName]: [],
    };

    result.push({ ...options, ...grandTotalOptions });
  }

  result[0].includeTotalSummary = true;

  return result;
}

function createRequestsOptions(options: RemoteRequestOptions): RemoteRequestOptions[] {
  const rowExpandedIndex = getExpandedIndex(options, 'rows');
  const rowExpandedLevel = getExpandedLevel(options, 'rows');
  const columnExpandedIndex = getExpandedIndex(options, 'columns');
  const columnExpandedLevel = getExpandedLevel(options, 'columns');

  const requestsOptions: RemoteRequestOptions[] = [];

  const commonFilters = (options.filters || []).concat(
    getFiltersForDimension(options.rows),
    getFiltersForDimension(options.columns),
    getFiltersForExpandedDimension(options),
  );

  const columnTotalsOptions = getGrandTotalRequest(options, 'columns', commonFilters);
  const rowTotalsOptions = getGrandTotalRequest(options, 'rows', commonFilters);

  if (options.rows.length && options.columns.length) {
    if (options.headerName !== 'rows') {
      requestsOptions.push(...columnTotalsOptions);
    }

    for (let i = rowExpandedIndex; i <= rowExpandedLevel; i += 1) {
      const rows = options.rows.slice(rowExpandedIndex, i + 1);
      const rowsFilterExpr = getExpandedPathsFilterExprByLevel(options, 'rows', i);

      for (let j = columnExpandedIndex; j <= columnExpandedLevel; j += 1) {
        const columns = options.columns.slice(columnExpandedIndex, j + 1);
        const columnsFilterExpr = getExpandedPathsFilterExprByLevel(options, 'columns', j);

        const filterExpression = mergeFilters([rowsFilterExpr, columnsFilterExpr]);

        const requestOptions = {
          ...options,
          columns,
          rows,
          filters: commonFilters,
          filterExpression,
        };

        requestsOptions.push(requestOptions);
      }
    }
  } else {
    const totalOptions = options.columns.length ? columnTotalsOptions : rowTotalsOptions;

    requestsOptions.push(...totalOptions);
  }

  return requestsOptions;
}

function prepareFields(fields: PivotGridField[] = []): void {
  fields.forEach((field) => {
    const { levels } = field;

    if (levels) {
      prepareFields(levels);
    }

    setDefaultFieldValueFormatting(field);
  });
}

class RemoteStore {
  public _dataSource: DataSource;

  public _store: Store;

  constructor(options: unknown) {
    this._dataSource = new DataSource(options);
    this._store = this._dataSource.store();
  }

  public getFields(fields?: PivotGridField[]): DeferredObj<DiscoveredField[]> {
    const d = Deferred<DiscoveredField[]>();

    this._store.load({
      skip: 0,
      take: 20,
    }).done((data) => {
      const normalizedArguments = normalizeLoadResult(data);
      d.resolve(pivotGridUtils.discoverObjectFields(normalizedArguments.data, fields));
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    return d;
  }

  public key(): StoreKey | undefined {
    return this._store.key();
  }

  public load(options: PivotGridLoadOptions): DeferredObj<RemoteLoadResult> {
    const d = Deferred<RemoteLoadResult>();
    const result: RemoteParseState = {
      rows: [],
      columns: [],
      values: [],
      grandTotalRowIndex: 0,
      grandTotalColumnIndex: 0,

      rowHash: {},
      columnHash: {},
      rowIndex: 1,
      columnIndex: 1,
    };
    const requestsOptions = createRequestsOptions(options);

    prepareFields(options.rows);
    prepareFields(options.columns);
    prepareFields(options.filters);

    const deferreds = requestsOptions.map((requestOptions) => {
      const loadOptions = createLoadOptions(requestOptions, this.filter(), options.rows.length);
      // @ts-expect-error group and summary items are looser than the data layer's descriptors
      return this._store.load(loadOptions);
    });

    when(...deferreds).done((...loadResults: unknown[]) => {
      // @ts-expect-error when() passes the resolve arguments of each load as a list
      const args: unknown[][] = deferreds.length > 1 ? loadResults : [loadResults];

      args.forEach((argument, index) => {
        // @ts-expect-error a grouped load returns groups, their summary and count
        const normalizedArguments: RemoteGroupedResult = normalizeLoadResult(
          argument[0],
          argument[1],
        );
        parseResult(
          normalizedArguments.data,
          normalizedArguments.extra,
          requestsOptions[index],
          result,
        );
      });

      d.resolve({
        rows: result.rows,
        columns: result.columns,
        values: result.values,
        grandTotalRowIndex: result.grandTotalRowIndex,
        grandTotalColumnIndex: result.grandTotalColumnIndex,
      });
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

  public createDrillDownDataSource(
    descriptions: PivotGridLoadOptions | undefined,
    drillDownParams: DrillDownParams | undefined,
  ): DataSource {
    // @ts-expect-error descriptions are created on the first load
    const loadOptions: PivotGridLoadOptions = descriptions || {};
    const params: DrillDownParams = drillDownParams || {};

    const store = this._store;
    const pathFilters: RemoteFilterField[] = getFiltersByPath(loadOptions.rows, params.rowPath);
    const filters = pathFilters
      .concat(getFiltersByPath(loadOptions.columns, params.columnPath))
      .concat(getFiltersForDimension(loadOptions.rows))
      .concat(loadOptions.filters || [])
      .concat(getFiltersForDimension(loadOptions.columns));

    const filterExp = createFilterExpressions(filters);

    return new DataSource({
      load(storeLoadOptions: StoreLoadOptions): DeferredObj<unknown[]> {
        const filter: DataFilter = mergeFilters([filterExp, storeLoadOptions.filter]);

        const extendedLoadOptions = extend({}, storeLoadOptions, {
          filter: filter.length === 0 ? undefined : filter,
          select: params.customColumns,
        });

        return store.load(extendedLoadOptions);
      },
    });
  }
}

export default { RemoteStore };
export { RemoteStore };
