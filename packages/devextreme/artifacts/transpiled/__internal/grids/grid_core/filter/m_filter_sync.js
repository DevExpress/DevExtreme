"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterSyncModule = exports.FilterSyncController = void 0;
var _deferred = require("../../../../core/utils/deferred");
var _type = require("../../../../core/utils/type");
var _filtering = _interopRequireDefault(require("../../../../ui/shared/filtering"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_utils = require("../../../filter_builder/m_utils");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils2 = _interopRequireDefault(require("../m_utils"));
var _m_filter_custom_operations = require("./m_filter_custom_operations");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const FILTER_ROW_OPERATIONS = ['=', '<>', '<', '<=', '>', '>=', 'notcontains', 'contains', 'startswith', 'endswith', 'between'];
const FILTER_TYPES_INCLUDE = 'include';
const FILTER_TYPES_EXCLUDE = 'exclude';
function getColumnIdentifier(column) {
  return column.name || column.dataField;
}
function checkForErrors(columns) {
  columns.forEach(column => {
    const identifier = getColumnIdentifier(column);
    // @ts-expect-error
    if (!(0, _type.isDefined)(identifier) && column.allowFiltering) throw new _ui.default.Error('E1049', column.caption);
  });
}
const getEmptyFilterValues = function () {
  return {
    filterType: FILTER_TYPES_INCLUDE,
    filterValues: undefined
  };
};
const canSyncHeaderFilterWithFilterRow = function (column) {
  const filterValues = column.filterValues || [];
  return !_filtering.default.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource) || filterValues.length === 1 && filterValues[0] === null;
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
    default:
      return getEmptyFilterValues();
  }
  return {
    filterType,
    filterValues: hasArrayValue ? value : [value]
  };
};
const getConditionFromFilterRow = function (column) {
  const value = column.filterValue;
  if ((0, _type.isDefined)(value)) {
    const operation = column.selectedFilterOperation || column.defaultFilterOperation || (0, _m_utils.getDefaultOperation)(column);
    const filter = [getColumnIdentifier(column), operation, column.filterValue];
    return filter;
  }
  return null;
};
const getConditionFromHeaderFilter = function (column) {
  let selectedOperation;
  let value;
  const {
    filterValues
  } = column;
  if (!filterValues) return null;
  if (filterValues.length === 1 && canSyncHeaderFilterWithFilterRow(column) && !Array.isArray(filterValues[0])) {
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
  let selectedFilterOperation = condition === null || condition === void 0 ? void 0 : condition[1];
  const filterValue = condition === null || condition === void 0 ? void 0 : condition[2];
  const filterOperations = column.filterOperations || column.defaultFilterOperations;
  if ((!filterOperations || filterOperations.indexOf(selectedFilterOperation) >= 0 || selectedFilterOperation === column.defaultFilterOperation) && FILTER_ROW_OPERATIONS.includes(selectedFilterOperation) && filterValue !== null) {
    if (selectedFilterOperation === column.defaultFilterOperation && !(0, _type.isDefined)(column.selectedFilterOperation)) {
      selectedFilterOperation = column.selectedFilterOperation;
    }
    filterRowOptions = {
      filterValue,
      selectedFilterOperation
    };
  } else {
    filterRowOptions = {
      filterValue: undefined,
      selectedFilterOperation: undefined
    };
  }
  columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
};
class FilterSyncController extends _m_modules.default.Controller {
  init() {
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    // @ts-expect-error
    if (this._dataController.isFilterSyncActive()) {
      if (this._columnsController.isAllDataTypesDefined()) {
        this._initSync();
      } else {
        this._dataController.dataSourceChanged.add(() => this._initSync());
      }
    }
  }
  publicMethods() {
    return ['getCustomFilterOperations'];
  }
  syncFilterValue() {
    const that = this;
    const columns = this._columnsController.getFilteringColumns();
    this._skipSyncColumnOptions = true;
    columns.forEach(column => {
      const filterConditions = (0, _m_utils.getMatchedConditions)(that.option('filterValue'), getColumnIdentifier(column));
      if (filterConditions.length === 1) {
        const filterCondition = filterConditions[0];
        updateHeaderFilterCondition(this._columnsController, column, filterCondition);
        updateFilterRowCondition(this._columnsController, column, filterCondition);
      } else {
        (0, _type.isDefined)(column.filterValues) && updateHeaderFilterCondition(this._columnsController, column, null);
        (0, _type.isDefined)(column.filterValue) && updateFilterRowCondition(this._columnsController, column, null);
      }
    });
    this._skipSyncColumnOptions = false;
  }
  _initSync() {
    const columns = this._columnsController.getColumns();
    const pageIndex = this._dataController.pageIndex();
    checkForErrors(columns);
    if (!this.option('filterValue')) {
      const filteringColumns = this._columnsController.getFilteringColumns();
      const filterValue = this.getFilterValueFromColumns(filteringColumns);
      this._silentOption('filterValue', filterValue);
    }
    this.syncFilterValue();
    this._dataController.pageIndex(pageIndex);
  }
  _getSyncFilterRow(filterValue, column) {
    const filter = getConditionFromFilterRow(column);
    if ((0, _type.isDefined)(filter)) {
      return (0, _m_utils.syncFilters)(filterValue, filter);
    }
    return (0, _m_utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(column));
  }
  _getSyncHeaderFilter(filterValue, column) {
    const filter = getConditionFromHeaderFilter(column);
    if (filter) {
      return (0, _m_utils.syncFilters)(filterValue, filter);
    }
    return (0, _m_utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(column));
  }
  getFilterValueFromColumns(columns) {
    // @ts-expect-error
    if (!this._dataController.isFilterSyncActive()) {
      return null;
    }
    const filterValue = ['and'];
    columns && columns.forEach(column => {
      const headerFilter = getConditionFromHeaderFilter(column);
      const filterRow = getConditionFromFilterRow(column);
      headerFilter && (0, _m_utils.addItem)(headerFilter, filterValue);
      filterRow && (0, _m_utils.addItem)(filterRow, filterValue);
    });
    return (0, _m_utils.getNormalizedFilter)(filterValue);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syncFilterRow(column, filterValue) {
    this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
  }
  syncHeaderFilter(column) {
    this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
  }
  // Override in the private API WA [T1232532]
  getCustomFilterOperations() {
    const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') ?? [];
    return [(0, _m_filter_custom_operations.anyOf)(this.component), (0, _m_filter_custom_operations.noneOf)(this.component)].concat(filterBuilderCustomOperations);
  }
}
exports.FilterSyncController = FilterSyncController;
const data = Base => class DataControllerFilterSyncExtender extends Base {
  optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._applyFilter();
        this.isFilterSyncActive() && this._filterSyncController.syncFilterValue();
        args.handled = true;
        break;
      case 'filterSyncEnabled':
        args.handled = true;
        break;
      case 'columns':
        if (this.isFilterSyncActive()) {
          const column = this._columnsController.getColumnByPath(args.fullName);
          if (column && !this._filterSyncController._skipSyncColumnOptions) {
            const propertyName = this._parseColumnPropertyName(args.fullName);
            this._filterSyncController._skipSyncColumnOptions = true;
            if (propertyName === 'filterType') {
              if (FILTER_TYPES_EXCLUDE === args.value || FILTER_TYPES_EXCLUDE === args.previousValue) {
                this._filterSyncController.syncHeaderFilter(column);
              }
            } else if (propertyName === 'filterValues') {
              this._filterSyncController.syncHeaderFilter(column);
            } else if (['filterValue', 'selectedFilterOperation'].includes(propertyName)) {
              this._filterSyncController.syncFilterRow(column, column.filterValue);
            }
            this._filterSyncController._skipSyncColumnOptions = false;
          }
        }
        super.optionChanged(args);
        break;
      default:
        super.optionChanged(args);
    }
  }
  isFilterSyncActive() {
    const filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  }
  skipCalculateColumnFilters() {
    return ((0, _type.isDefined)(this.option('filterValue')) || this._filterSyncController._skipSyncColumnOptions) && this.isFilterSyncActive();
  }
  _calculateAdditionalFilter() {
    if (this.option('filterPanel.filterEnabled') === false) {
      return super._calculateAdditionalFilter();
    }
    const filters = [super._calculateAdditionalFilter()];
    const columns = this._columnsController.getFilteringColumns();
    let filterValue = this.option('filterValue');
    if (this.isFilterSyncActive()) {
      const currentColumnForHeaderFilter = this._headerFilterController.getCurrentColumn();
      const currentColumnForFilterRow = this._applyFilterController.getCurrentColumnForFiltering();
      const currentColumn = currentColumnForHeaderFilter || currentColumnForFilterRow;
      const needRemoveCurrentColumnFilter = currentColumnForHeaderFilter || (0, _type.isDefined)(currentColumnForFilterRow === null || currentColumnForFilterRow === void 0 ? void 0 : currentColumnForFilterRow.filterValue);
      if (needRemoveCurrentColumnFilter && filterValue) {
        filterValue = (0, _m_utils.removeFieldConditionsFromFilter)(filterValue, getColumnIdentifier(currentColumn));
      }
    }
    const customOperations = this._filterSyncController.getCustomFilterOperations();
    const calculatedFilterValue = (0, _m_utils.getFilterExpression)(filterValue, columns, customOperations, 'filterBuilder');
    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }
    return _m_utils2.default.combineFilters(filters);
  }
  _parseColumnPropertyName(fullName) {
    const matched = fullName.match(/.*\.(.*)/);
    if (matched) {
      return matched[1];
    }
    return null;
  }
  clearFilter(filterName) {
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
  _applyFilter() {
    if (this._filterSyncController._skipSyncColumnOptions) {
      // @ts-expect-error
      return new _deferred.Deferred().resolve();
    }
    // @ts-expect-error
    return super._applyFilter.apply(this, arguments);
  }
};
const columnHeadersView = Base => class ColumnHeadersViewFilterSyncExtender extends Base {
  optionChanged(args) {
    if (args.name === 'filterValue') {
      // @ts-expect-error
      this._updateHeaderFilterIndicators();
    } else {
      super.optionChanged(args);
    }
  }
  _isHeaderFilterEmpty(column) {
    // @ts-expect-error
    if (this._dataController.isFilterSyncActive()) {
      return !(0, _m_utils.filterHasField)(this.option('filterValue'), getColumnIdentifier(column));
    }
    // @ts-expect-error
    return super._isHeaderFilterEmpty(column);
  }
  _needUpdateFilterIndicators() {
    // @ts-expect-error
    return !this._dataController.isFilterSyncActive();
  }
};
const filterSyncModule = exports.filterSyncModule = {
  defaultOptions() {
    return {
      filterValue: null,
      filterSyncEnabled: 'auto'
    };
  },
  controllers: {
    filterSync: FilterSyncController
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      columnHeadersView
    }
  }
};