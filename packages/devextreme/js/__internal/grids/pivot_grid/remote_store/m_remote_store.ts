import Class from '@js/core/class';
import dateSerialization from '@js/core/utils/date_serialization';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isDefined, isString } from '@js/core/utils/type';
import { DataSource } from '@js/data/data_source/data_source';
import { normalizeLoadResult } from '@js/data/data_source/utils';

import pivotGridUtils, {
  capitalizeFirstLetter,
  getExpandedLevel,
  getFiltersByPath,
  setDefaultFieldValueFormatting,
} from '../m_widget_utils';
import { forEachGroup } from './m_remote_store_utils';

function createGroupingOptions(dimensionOptions, useSortOrder) {
  const groupingOptions: any = [];

  each(dimensionOptions, (index: number, dimensionOption) => {
    groupingOptions.push({
      selector: dimensionOption.dataField,
      groupInterval: dimensionOption.groupInterval,
      desc: useSortOrder && dimensionOption.sortOrder === 'desc',
      isExpanded: index < dimensionOptions.length - 1,
    });
  });

  return groupingOptions;
}

function getFieldFilterSelector(field) {
  let selector = field.dataField;
  let { groupInterval } = field;

  if (field.dataType === 'date' && typeof groupInterval === 'string') {
    if (groupInterval.toLowerCase() === 'quarter') {
      groupInterval = 'Month';
    }
    selector = `${selector}.${capitalizeFirstLetter(groupInterval)}`;
  }

  return selector;
}

function getIntervalFilterExpression(
  selector,
  numericInterval,
  numericValue,
  isExcludedFilterType,
) {
  const startFilterValue = [selector, isExcludedFilterType ? '<' : '>=', numericValue];
  const endFilterValue = [selector, isExcludedFilterType ? '>=' : '<', numericValue + numericInterval];

  return [startFilterValue, isExcludedFilterType ? 'or' : 'and', endFilterValue];
}

function getFilterExpressionForFilterValue(field, filterValue) {
  const selector = getFieldFilterSelector(field);
  const isExcludedFilterType = field.filterType === 'exclude';
  let expression = [selector, isExcludedFilterType ? '<>' : '=', filterValue];

  if (isDefined(field.groupInterval)) {
    if (typeof field.groupInterval === 'string' && field.groupInterval.toLowerCase() === 'quarter') {
      expression = getIntervalFilterExpression(
        selector,
        3,
        (filterValue - 1) * 3 + 1,
        isExcludedFilterType,
      );
    } else if (typeof field.groupInterval === 'number' && field.dataType !== 'date') {
      expression = getIntervalFilterExpression(
        selector,
        field.groupInterval,
        filterValue,
        isExcludedFilterType,
      );
    }
  }

  return expression;
}

function createFieldFilterExpressions(field, operation?) {
  const fieldFilterExpressions: any = [];

  if (field.searchValue) {
    return [field.dataField, 'contains', field.searchValue];
  }

  if (field.filterType === 'exclude') {
    operation = operation || 'and';
  } else {
    operation = operation || 'or';
  }

  each(field.filterValues, (index, filterValue) => {
    let currentExpression: any = [];

    if (Array.isArray(filterValue)) {
      const parseLevelsRecursive = field.levels && field.levels.length;

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
      fieldFilterExpressions.push(operation);
    }

    fieldFilterExpressions.push(currentExpression);
  });

  return fieldFilterExpressions;
}

function createFilterExpressions(fields) {
  let filterExpressions: any = [];

  each(fields, ((_, field) => {
    const fieldExpressions = createFieldFilterExpressions(field);

    if (!fieldExpressions.length) {
      return [];
    }

    if (filterExpressions.length) {
      filterExpressions.push('and');
    }

    filterExpressions.push(fieldExpressions);

    return undefined;
  }) as any);

  if (filterExpressions.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    filterExpressions = filterExpressions[0];
  }

  return filterExpressions;
}

function mergeFilters(filters, op = 'and') {
  const empty = (filter): boolean => !filter || filter.length === 0;

  const result: any = [];

  each(filters, (_, filter) => {
    if (!empty(filter)) result.push(filter, op);
  });

  if (result.length) result.pop();

  return result;
}

function createLoadOptions(options, externalFilterExpr, hasRows) {
  let filterExpressions = createFilterExpressions(options.filters);
  const groupingOptions = createGroupingOptions(options.rows, options.rowTake)
    .concat(createGroupingOptions(options.columns, options.columnTake));
  const loadOptions: any = {
    groupSummary: [],
    totalSummary: [],
    group: groupingOptions.length ? groupingOptions : undefined,
    take: groupingOptions.length ? undefined : 1,
  };

  if (options.rows.length && options.rowTake) {
    loadOptions.skip = options.rowSkip;
    loadOptions.take = options.rowTake;
    loadOptions.requireGroupCount = true;
  } else if (options.columns.length && options.columnTake && !hasRows) {
    loadOptions.skip = options.columnSkip;
    loadOptions.take = options.columnTake;
    loadOptions.requireGroupCount = true;
  }

  filterExpressions = mergeFilters([filterExpressions, options.filterExpression]);

  if (externalFilterExpr) {
    filterExpressions = mergeFilters([filterExpressions, externalFilterExpr]);
  }

  if (filterExpressions.length) {
    loadOptions.filter = filterExpressions;
  }

  each(options.values, (_, value) => {
    const summaryOption = {
      selector: value.dataField,
      summaryType: value.summaryType || 'count',
    };

    loadOptions.groupSummary.push(summaryOption);
    options.includeTotalSummary && loadOptions.totalSummary.push(summaryOption);
  });

  return loadOptions;
}

function setValue(valuesArray, value, rowIndex, columnIndex, dataIndex) {
  valuesArray[rowIndex] = valuesArray[rowIndex] || [];
  valuesArray[rowIndex][columnIndex] = valuesArray[rowIndex][columnIndex] || [];
  if (!isDefined(valuesArray[rowIndex][columnIndex][dataIndex])) {
    valuesArray[rowIndex][columnIndex][dataIndex] = value;
  }
}

function parseValue(value, field) {
  if (field && field.dataType === 'number' && isString(value)) {
    return Number(value);
  }

  if (field && field.dataType === 'date' && !field.groupInterval && !(value instanceof Date)) {
    return dateSerialization.deserializeDate(value);
  }

  return value;
}

function parseResult(data, total, descriptions, result) {
  const rowPath: any = [];
  let columnPath: any = [];
  const { rowHash } = result;
  const { columnHash } = result;

  if (total && total.summary) {
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

  if (total && total.groupCount >= 0) {
    const skip = descriptions.rows.length ? descriptions.rowSkip : descriptions.columnSkip;
    data = [...Array(skip)].concat(data);
    data.length = total.groupCount;
  }

  function getItem(dataItem, dimensionName, path, level, field) {
    const dimensionHash = result[`${dimensionName}Hash`];
    let parentItem;
    let parentItemChildren;
    let item;
    const pathValue = path.slice(0, level + 1).join('/');
    let parentPathValue;

    if (dimensionHash[pathValue] !== undefined) {
      item = dimensionHash[pathValue];
    } else {
      item = {
        value: parseValue(dataItem.key, field),
        // eslint-disable-next-line no-plusplus
        index: result[`${dimensionName}Index`]++,
        displayText: dataItem.displayText,
      };

      parentPathValue = path.slice(0, level).join('/');

      if (level > 0 && dimensionHash[parentPathValue] !== undefined) {
        parentItem = dimensionHash[parentPathValue];
        parentItemChildren = parentItem.children = parentItem.children || [];
      } else {
        parentItemChildren = result[`${dimensionName}s`];
      }

      parentItemChildren.push(item);
      dimensionHash[pathValue] = item;
    }

    return item;
  }

  forEachGroup(data, (item, level) => {
    const rowLevel = level >= descriptions.rows.length ? descriptions.rows.length : level;
    const columnLevel = level >= descriptions.rows.length ? level - descriptions.rows.length : 0;
    let columnItem;
    let rowItem;

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

    const currentRowIndex = rowItem && rowItem.index || result.grandTotalRowIndex;
    const currentColumnIndex = columnItem && columnItem.index || result.grandTotalColumnIndex;

    each(item && item.summary || [], (i, summary) => {
      setValue(result.values, summary, currentRowIndex, currentColumnIndex, i);
    });
  });

  return result;
}

function getFiltersForDimension(fields) {
  return (fields || []).filter((f) => f.filterValues && f.filterValues.length || f.searchValue);
}

function getExpandedIndex(options, axis) {
  if (options.headerName) {
    if (axis === options.headerName) {
      return options.path.length;
    } if (options.oppositePath) {
      return options.oppositePath.length;
    }
  }
  return 0;
}

function getFiltersForExpandedDimension(options) {
  return getFiltersByPath(options[options.headerName], options.path).concat(
    getFiltersByPath(options[options.headerName === 'rows' ? 'columns' : 'rows'], options.oppositePath || []),
  );
}

function getExpandedPathsFilterExpression(options, dimensionName, level, firstCollapsedFieldIndex) {
  if (options.headerName === dimensionName) {
    return [];
  }

  const result: any = [];
  const startSliceIndex = level > firstCollapsedFieldIndex ? 0 : firstCollapsedFieldIndex;
  let fields = options[dimensionName];
  let paths = dimensionName === 'rows' ? options.rowExpandedPaths : options.columnExpandedPaths;

  fields = fields.slice(startSliceIndex);
  paths = paths
    .map((path) => path.slice(startSliceIndex))
    .filter((path) => path.length === level); // TODO: is order correct?

  // eslint-disable-next-line
  for (const path of paths) {
    const filters: any = [];

    for (let i = 0; i < path.length; i++) {
      const field = fields[i];
      field.filterType = 'include'; // TODO: refactor this
      const fieldFilterExpression = getFilterExpressionForFilterValue(field, path[i]);

      filters.push(fieldFilterExpression);
    }

    const pathFilterExpression = mergeFilters(filters);

    result.push(pathFilterExpression, 'or');
  }

  result.pop();

  return result;
}

function getGrandTotalRequest(
  options,
  dimensionName,
  expandedIndex,
  expandedLevel,
  commonFilters,
  firstCollapsedFieldIndex,
) {
  const expandedPaths = (dimensionName === 'columns' ? options.columnExpandedPaths : options.rowExpandedPaths) || [];
  const oppositeDimensionName = dimensionName === 'columns' ? 'rows' : 'columns';
  const fields = options[dimensionName];
  const result: any = [];
  let newOptions;

  if (expandedPaths.length) {
    for (let i = expandedIndex; i < expandedLevel + 1; i += 1) {
      newOptions = {
        filters: commonFilters,
        filterExpression: getExpandedPathsFilterExpression(
          options,
          dimensionName,
          i,
          firstCollapsedFieldIndex,
        ),
      };
      newOptions[dimensionName] = fields.slice(expandedIndex, i + 1);
      newOptions[oppositeDimensionName] = [];

      result.push(extend({}, options, newOptions));
    }
  } else {
    newOptions = {
      filters: commonFilters,
    };

    newOptions[dimensionName] = fields.slice(expandedIndex, expandedLevel + 1);
    newOptions[oppositeDimensionName] = [];
    result.push(extend({}, options, newOptions));
  }

  result[0].includeTotalSummary = true;

  return result;
}

function getFirstCollapsedIndex(fields) {
  let firstCollapsedIndex = 0;
  each(fields, (index: number, field) => {
    if (!field.expanded) {
      firstCollapsedIndex = index;
      return false;
    }

    return undefined;
  });

  return firstCollapsedIndex;
}

function createRequestsOptions(options) {
  const rowExpandedLevel = getExpandedLevel(options, 'rows');
  const rowExpandedIndex = getExpandedIndex(options, 'rows');
  const columnExpandedLevel = getExpandedLevel(options, 'columns');
  const columnExpandedIndex = getExpandedIndex(options, 'columns');
  const firstCollapsedColumnFieldIndex = getFirstCollapsedIndex(options.columns);
  const firstCollapsedRowFieldIndex = getFirstCollapsedIndex(options.rows);
  const requestsOptions: any = [];

  const commonFilters = (options.filters || []).concat(
    getFiltersForDimension(options.rows),
    getFiltersForDimension(options.columns),
    getFiltersForExpandedDimension(options),
  );

  const columnTotalsOptions = getGrandTotalRequest(options, 'columns', columnExpandedIndex, columnExpandedLevel, commonFilters, firstCollapsedColumnFieldIndex);
  const rowTotalsOptions = getGrandTotalRequest(options, 'rows', rowExpandedIndex, rowExpandedLevel, commonFilters, firstCollapsedRowFieldIndex);

  if (options.rows.length && options.columns.length) {
    if (options.headerName !== 'rows') {
      requestsOptions.push(...columnTotalsOptions);
    }

    for (let i = rowExpandedIndex; i < rowExpandedLevel + 1; i += 1) {
      const rows = options.rows.slice(rowExpandedIndex, i + 1);
      const rowFilters = getExpandedPathsFilterExpression(options, 'rows', i, firstCollapsedRowFieldIndex);

      for (let j = columnExpandedIndex; j < columnExpandedLevel + 1; j += 1) {
        const columns = options.columns.slice(columnExpandedIndex, j + 1);
        const columnFilters = getExpandedPathsFilterExpression(options, 'columns', j, firstCollapsedColumnFieldIndex);

        const filterExpression = mergeFilters([rowFilters, columnFilters]);

        const requestOptions = extend({}, options, {
          columns,
          rows,
          filters: commonFilters,
          filterExpression,
        });

        requestsOptions.push(requestOptions);
      }
    }
  } else {
    const totalOptions = options.columns.length ? columnTotalsOptions : rowTotalsOptions;

    requestsOptions.push(...totalOptions);
  }

  return requestsOptions;
}

function prepareFields(fields) {
  each(fields || [], (_, field) => {
    const { levels } = field;

    if (levels) {
      prepareFields(levels);
    }

    setDefaultFieldValueFormatting(field);
  });
}

const RemoteStore = Class.inherit((function () {
  return {
    ctor(options) {
      this._dataSource = new DataSource(options);
      this._store = this._dataSource.store();
    },

    getFields(fields) {
      // @ts-expect-error
      const d = new Deferred();

      this._store.load({
        skip: 0,
        take: 20,
      }).done((data) => {
        const normalizedArguments = normalizeLoadResult(data);
        d.resolve(pivotGridUtils.discoverObjectFields(normalizedArguments.data, fields));
      }).fail(d.reject);

      return d;
    },

    key() {
      return this._store.key();
    },

    load(options) {
      const that: any = this;
      // @ts-expect-error
      const d = new Deferred();
      const result = {
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
      const deferreds: any = [];

      prepareFields(options.rows);
      prepareFields(options.columns);
      prepareFields(options.filters);

      each(requestsOptions, (_, requestOptions) => {
        const loadOptions = createLoadOptions(requestOptions, that.filter(), options.rows.length);
        const loadDeferred = that._store.load(loadOptions);

        deferreds.push(loadDeferred);
      });

      when.apply(null, deferreds).done(function () {
        const args = deferreds.length > 1 ? arguments : [arguments];

        each(args, (index, argument) => {
          const normalizedArguments = normalizeLoadResult(argument[0], argument[1]);
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
      }).fail(d.reject);

      return d;
    },

    filter() {
      return this._dataSource.filter.apply(this._dataSource, arguments);
    },

    supportPaging() {
      return false;
    },

    createDrillDownDataSource(loadOptions, params) {
      loadOptions = loadOptions || {};
      params = params || {};

      const store = this._store;
      const filters = getFiltersByPath(loadOptions.rows, params.rowPath)
        .concat(getFiltersByPath(loadOptions.columns, params.columnPath))
        .concat(getFiltersForDimension(loadOptions.rows))
        .concat(loadOptions.filters || [])
        .concat(getFiltersForDimension(loadOptions.columns));

      const filterExp = createFilterExpressions(filters);

      return new DataSource({
        load(loadOptions) {
          return store.load(extend({}, loadOptions, {
            filter: mergeFilters([filterExp, loadOptions.filter]),
            select: params.customColumns,
          }));
        },
      });
    },
  };
})());

export default { RemoteStore };
export { RemoteStore };
