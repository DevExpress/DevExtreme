/* eslint-disable max-classes-per-file */
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import {
  addItem, filterHasField,
  getDefaultOperation, getFilterExpression, getMatchedConditions, getNormalizedFilter,
  removeFieldConditionsFromFilter, syncFilters,
} from '@ts/filter_builder/m_utils';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { DataController } from '../data_controller/m_data_controller';
import modules from '../m_modules';
import type { ModuleType } from '../m_types';
import gridCoreUtils from '../m_utils';
import { anyOf, noneOf } from './m_filter_custom_operations';

const FILTER_ROW_OPERATIONS = ['=', '<>', '<', '<=', '>', '>=', 'notcontains', 'contains', 'startswith', 'endswith', 'between'];
const FILTER_TYPES_INCLUDE = 'include';
const FILTER_TYPES_EXCLUDE = 'exclude';

function getColumnIdentifier(column) {
  return column.name || column.dataField;
}

function checkForErrors(columns) {
  columns.forEach((column) => {
    const identifier = getColumnIdentifier(column);
    // @ts-expect-error
    if (!isDefined(identifier) && column.allowFiltering) throw new errors.Error('E1049', column.caption);
  });
}

const getEmptyFilterValues = function () {
  return {
    filterType: FILTER_TYPES_INCLUDE,
    filterValues: undefined,
  };
};

const canSyncHeaderFilterWithFilterRow = function (column) {
  const filterValues = column.filterValues || [];
  return (!filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource))
      || (filterValues.length === 1 && filterValues[0] === null);
};

const getHeaderFilterFromCondition = function (headerFilterCondition, column) {
  if (!headerFilterCondition) {
    return getEmptyFilterValues();
  }

  let filterType;
  const selectedFilterOperation = headerFilterCondition[1];
  const value = headerFilterCondition[2];
  const hasArrayValue = Array.isArray(value);

  if (!hasArrayValue) {
    if (!canSyncHeaderFilterWithFilterRow(column)) {
      return getEmptyFilterValues();
    }
  }

  switch (selectedFilterOperation) {
    case 'anyof':
    case '=':
      filterType = FILTER_TYPES_INCLUDE;
      break;
    case 'noneof':
    case '<>':
      filterType = FILTER_TYPES_EXCLUDE;
      break;
    default: return getEmptyFilterValues();
  }

  return {
    filterType,
    filterValues: hasArrayValue ? value : [value],
  };
};

const getConditionFromFilterRow = function (column) {
  const value = column.filterValue;
  if (isDefined(value)) {
    const operation = column.selectedFilterOperation || column.defaultFilterOperation || getDefaultOperation(column);
    const filter = [getColumnIdentifier(column), operation, column.filterValue];
    return filter;
  }
  return null;
};

const getConditionFromHeaderFilter = function (column) {
  let selectedOperation;
  let value;
  const { filterValues } = column;

  if (!filterValues) return null;

  if (filterValues.length === 1 && (
    canSyncHeaderFilterWithFilterRow(column)
          && !Array.isArray(filterValues[0])
  )) {
    column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = '<>' : selectedOperation = '=';
    // eslint-disable-next-line prefer-destructuring
    value = filterValues[0];
  } else {
    column.filterType === FILTER_TYPES_EXCLUDE ? selectedOperation = 'noneof' : selectedOperation = 'anyof';
    value = filterValues;
  }
  return [getColumnIdentifier(column), selectedOperation, value];
};

const updateHeaderFilterCondition = function (columnsController, column, headerFilterCondition) {
  const headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
  columnsController.columnOption(getColumnIdentifier(column), headerFilter);
};

const updateFilterRowCondition = function (columnsController, column, condition) {
  let filterRowOptions;
  let selectedFilterOperation = condition?.[1];
  const filterValue = condition?.[2];
  const filterOperations = column.filterOperations || column.defaultFilterOperations;

  if ((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation)
          && FILTER_ROW_OPERATIONS.includes(selectedFilterOperation) && filterValue !== null) {
    if (selectedFilterOperation === column.defaultFilterOperation && !isDefined(column.selectedFilterOperation)) {
      selectedFilterOperation = column.selectedFilterOperation;
    }
    filterRowOptions = {
      filterValue,
      selectedFilterOperation,
    };
  } else {
    filterRowOptions = {
      filterValue: undefined,
      selectedFilterOperation: undefined,
    };
  }
  columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
};

export class FilterSyncController extends modules.Controller {
  public _skipSyncColumnOptions: any;

  syncFilterValue() {
    const that = this;
    const columnsController = that.getController('columns');
    const columns = columnsController.getFilteringColumns();

    this._skipSyncColumnOptions = true;
    columns.forEach((column) => {
      const filterConditions = getMatchedConditions(that.option('filterValue'), getColumnIdentifier(column));
      if (filterConditions.length === 1) {
        const filterCondition = filterConditions[0];
        updateHeaderFilterCondition(columnsController, column, filterCondition);
        updateFilterRowCondition(columnsController, column, filterCondition);
      } else {
        isDefined(column.filterValues) && updateHeaderFilterCondition(columnsController, column, null);
        isDefined(column.filterValue) && updateFilterRowCondition(columnsController, column, null);
      }
    });
    this._skipSyncColumnOptions = false;
  }

  _initSync() {
    const columns = this.getController('columns').getColumns();
    const dataController = this.getController('data');
    const pageIndex = dataController.pageIndex();

    checkForErrors(columns);
    if (!this.option('filterValue')) {
      const filteringColumns = this.getController('columns').getFilteringColumns();
      const filterValue = this.getFilterValueFromColumns(filteringColumns);
      this._silentOption('filterValue', filterValue);
    }
    this.syncFilterValue();

    dataController.pageIndex(pageIndex);
  }

  init() {
    const dataController = this.getController('data');
    // @ts-expect-error
    if (dataController.isFilterSyncActive()) {
      if (this.getController('columns').isAllDataTypesDefined()) {
        this._initSync();
      } else {
        dataController.dataSourceChanged.add(() => this._initSync());
      }
    }
  }

  _getSyncFilterRow(filterValue, column) {
    const filter = getConditionFromFilterRow(column);
    if (isDefined(filter)) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }

  _getSyncHeaderFilter(filterValue, column) {
    const filter = getConditionFromHeaderFilter(column);
    if (filter) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }

  getFilterValueFromColumns(columns) {
    // @ts-expect-error
    if (!this.getController('data').isFilterSyncActive()) {
      return null;
    }

    const filterValue = ['and'];

    columns && columns.forEach((column) => {
      const headerFilter = getConditionFromHeaderFilter(column);
      const filterRow = getConditionFromFilterRow(column);

      headerFilter && addItem(headerFilter, filterValue);
      filterRow && addItem(filterRow, filterValue);
    });
    return getNormalizedFilter(filterValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syncFilterRow(column, filterValue?) {
    this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
  }

  syncHeaderFilter(column) {
    this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
  }

  getCustomFilterOperations() {
    const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') ?? [];
    return [anyOf(this.component), noneOf(this.component)].concat(filterBuilderCustomOperations);
  }

  publicMethods() {
    return ['getCustomFilterOperations'];
  }
}

const data = (Base: ModuleType<DataController>) => class DataControllerFilterSyncExtender extends Base {
  isFilterSyncActive() {
    const filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  }

  skipCalculateColumnFilters() {
    const filterSyncController = this.getController('filterSync');
    return (isDefined(this.option('filterValue')) || filterSyncController._skipSyncColumnOptions) && this.isFilterSyncActive();
  }

  _calculateAdditionalFilter() {
    if (this.option('filterPanel.filterEnabled') === false) {
      return super._calculateAdditionalFilter();
    }

    const filters = [super._calculateAdditionalFilter()];
    const columns = this.getController('columns').getFilteringColumns();
    let filterValue = this.option('filterValue');

    if (this.isFilterSyncActive()) {
      const currentColumnForHeaderFilter = this.getController('headerFilter').getCurrentColumn();
      const currentColumnForFilterRow = this.getController('applyFilter').getCurrentColumnForFiltering();
      const currentColumn = currentColumnForHeaderFilter || currentColumnForFilterRow;
      const needRemoveCurrentColumnFilter = currentColumnForHeaderFilter || isDefined(currentColumnForFilterRow?.filterValue);

      if (needRemoveCurrentColumnFilter && filterValue) {
        filterValue = removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn));
      }
    }
    const customOperations = this.getController('filterSync').getCustomFilterOperations();
    const calculatedFilterValue = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');
    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }

    return gridCoreUtils.combineFilters(filters);
  }

  _parseColumnPropertyName(fullName) {
    const matched = fullName.match(/.*\.(.*)/);
    if (matched) {
      return matched[1];
    }
    return null;
  }

  protected clearFilter(filterName) {
    this.component.beginUpdate();
    if (arguments.length > 0) {
      if (filterName === 'filterValue') {
        // @ts-expect-error
        this.option('filterValue', null);
      }
      super.clearFilter(filterName);
    } else {
      // @ts-expect-error
      this.option('filterValue', null);
      super.clearFilter();
    }
    this.component.endUpdate();
  }

  optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._applyFilter();
        this.isFilterSyncActive() && this.getController('filterSync').syncFilterValue();
        args.handled = true;
        break;
      case 'filterSyncEnabled':
        args.handled = true;
        break;
      case 'columns':
        if (this.isFilterSyncActive()) {
          const column = this.getController('columns').getColumnByPath(args.fullName);
          const filterSyncController = this.getController('filterSync');
          if (column && !filterSyncController._skipSyncColumnOptions) {
            const propertyName = this._parseColumnPropertyName(args.fullName);
            filterSyncController._skipSyncColumnOptions = true;
            if (propertyName === 'filterType') {
              if (FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                filterSyncController.syncHeaderFilter(column);
              }
            } else if (propertyName === 'filterValues') {
              filterSyncController.syncHeaderFilter(column);
            } else if (['filterValue', 'selectedFilterOperation'].includes(propertyName)) {
              filterSyncController.syncFilterRow(column, column.filterValue);
            }
            filterSyncController._skipSyncColumnOptions = false;
          }
        }
        super.optionChanged(args);
        break;
      default:
        super.optionChanged(args);
    }
  }

  _applyFilter(): Promise<void> {
    const filterSyncController = this.getController('filterSync');

    if (filterSyncController._skipSyncColumnOptions) {
      // @ts-expect-error
      return new Deferred().resolve();
    }

    // @ts-expect-error
    return super._applyFilter.apply(this, arguments);
  }
};

const columnHeadersView = (Base: ModuleType<ColumnHeadersView>) => class ColumnHeadersViewFilterSyncExtender extends Base {
  _isHeaderFilterEmpty(column) {
    // @ts-expect-error
    if (this.getController('data').isFilterSyncActive()) {
      return !filterHasField(this.option('filterValue'), getColumnIdentifier(column));
    }

    // @ts-expect-error
    return super._isHeaderFilterEmpty(column);
  }

  _needUpdateFilterIndicators() {
    // @ts-expect-error
    return !this.getController('data').isFilterSyncActive();
  }

  optionChanged(args) {
    if (args.name === 'filterValue') {
      // @ts-expect-error
      this._updateHeaderFilterIndicators();
    } else {
      super.optionChanged(args);
    }
  }
};

export const filterSyncModule = {
  defaultOptions() {
    return {
      filterValue: null,

      filterSyncEnabled: 'auto',
    };
  },
  controllers: {
    filterSync: FilterSyncController,
  },
  extenders: {
    controllers: {
      data,
    },
    views: {
      columnHeadersView,
    },
  },
};
