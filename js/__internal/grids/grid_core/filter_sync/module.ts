import { isDefined } from '@js/core/utils/type';
import {
  getDefaultOperation, getMatchedConditions, syncFilters,
  removeFieldConditionsFromFilter, addItem, getNormalizedFilter,
  getFilterExpression, filterHasField,
} from '@js/ui/filter_builder/utils';
import errors from '@js/ui/widget/ui.errors';
import filterUtils from '@js/ui/shared/filtering';
import { anyOf, noneOf } from '../filter_custom_operations/module';
import modules from '../modules';
import gridCoreUtils from '../module_utils';

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

const FilterSyncController = modules.Controller.inherit((function () {
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

  return {
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
    },

    _initSync() {
      const columns = this.getController('columns').getColumns();
      const dataController = this.getController('data');
      const pageIndex = dataController.pageIndex();

      checkForErrors(columns);
      if (!this.option('filterValue')) {
        const filteringColumns = this.getController('columns').getFilteringColumns();
        const filterValue = this.getFilterValueFromColumns(filteringColumns);
        this.option('filterValue', filterValue);
      }
      this.syncFilterValue();

      dataController.pageIndex(pageIndex);
    },

    init() {
      const dataController = this.getController('data');
      if (dataController.isFilterSyncActive()) {
        if (this.getController('columns').isAllDataTypesDefined()) {
          this._initSync();
        } else {
          dataController.dataSourceChanged.add(() => this._initSync());
        }
      }
    },

    _getSyncFilterRow(filterValue, column) {
      const filter = getConditionFromFilterRow(column);
      if (isDefined(filter)) {
        return syncFilters(filterValue, filter);
      }
      return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
    },

    _getSyncHeaderFilter(filterValue, column) {
      const filter = getConditionFromHeaderFilter(column);
      if (filter) {
        return syncFilters(filterValue, filter);
      }
      return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
    },

    getFilterValueFromColumns(columns) {
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
    },

    syncFilterRow(column) {
      this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
    },

    syncHeaderFilter(column) {
      this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
    },

    getCustomFilterOperations() {
      const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') || [];
      return [anyOf(this.component), noneOf(this.component)].concat(filterBuilderCustomOperations);
    },

    publicMethods() {
      return ['getCustomFilterOperations'];
    },
  };
})());

const DataControllerFilterSyncExtender = {

  isFilterSyncActive() {
    const filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  },

  skipCalculateColumnFilters() {
    const filterSyncController = this.getController('filterSync');
    return (isDefined(this.option('filterValue')) || filterSyncController._skipSyncColumnOptions) && this.isFilterSyncActive();
  },

  _calculateAdditionalFilter() {
    const that = this;

    if (that.option('filterPanel.filterEnabled') === false) {
      return that.callBase();
    }

    const filters = [that.callBase()];
    const columns = that.getController('columns').getFilteringColumns();
    let filterValue = that.option('filterValue');

    if (that.isFilterSyncActive()) {
      const currentColumn = that.getController('headerFilter').getCurrentColumn();
      if (currentColumn && filterValue) {
        filterValue = removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(currentColumn));
      }
    }
    const customOperations = that.getController('filterSync').getCustomFilterOperations();
    const calculatedFilterValue = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');
    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }

    return gridCoreUtils.combineFilters(filters);
  },

  _parseColumnPropertyName(fullName) {
    const matched = fullName.match(/.*\.(.*)/);
    if (matched) {
      return matched[1];
    }
    return null;
  },

  clearFilter(filterName) {
    this.component.beginUpdate();
    if (arguments.length > 0) {
      if (filterName === 'filterValue') {
        this.option('filterValue', null);
      }
      this.callBase(filterName);
    } else {
      this.option('filterValue', null);
      this.callBase();
    }
    this.component.endUpdate();
  },

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
        this.callBase(args);
        break;
      default:
        this.callBase(args);
    }
  },
};

const ColumnHeadersViewFilterSyncExtender = {
  _isHeaderFilterEmpty(column) {
    if (this.getController('data').isFilterSyncActive()) {
      return !filterHasField(this.option('filterValue'), getColumnIdentifier(column));
    }

    return this.callBase(column);
  },

  _needUpdateFilterIndicators() {
    return !this.getController('data').isFilterSyncActive();
  },

  optionChanged(args) {
    if (args.name === 'filterValue') {
      this._updateHeaderFilterIndicators();
    } else {
      this.callBase(args);
    }
  },
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
      data: DataControllerFilterSyncExtender,
    },
    views: {
      columnHeadersView: ColumnHeadersViewFilterSyncExtender,
    },
  },
};
