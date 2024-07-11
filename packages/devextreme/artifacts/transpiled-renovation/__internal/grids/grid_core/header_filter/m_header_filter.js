"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerFilterModule = exports.HeaderFilterController = void 0;
exports.invertFilterExpression = invertFilterExpression;
var _data = require("../../../../core/utils/data");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _type = require("../../../../core/utils/type");
var _utils = require("../../../../data/data_source/utils");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _store_helper = _interopRequireDefault(require("../../../../data/store_helper"));
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _date = _interopRequireDefault(require("../../../../localization/date"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _accessibility = require("../../../../ui/shared/accessibility");
var _filtering = _interopRequireDefault(require("../../../../ui/shared/filtering"));
var _m_modules = _interopRequireDefault(require("../../../grids/grid_core/m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_header_filter_core = require("./m_header_filter_core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
const DATE_INTERVAL_FORMATS = {
  month(value) {
    return _date.default.getMonthNames()[value - 1];
  },
  quarter(value) {
    return _date.default.format(new Date(2000, value * 3 - 1), 'quarter');
  }
};
function ungroupUTCDates(items, dateParts, dates) {
  dateParts = dateParts || [];
  dates = dates || [];
  items.forEach(item => {
    if ((0, _type.isDefined)(item.key)) {
      const isMonthPart = dateParts.length === 1;
      dateParts.push(isMonthPart ? item.key - 1 : item.key);
      if (item.items) {
        ungroupUTCDates(item.items, dateParts, dates);
      } else {
        const date = new Date(Date.UTC.apply(Date, dateParts));
        dates.push(date);
      }
      dateParts.pop();
    } else {
      dates.push(null);
    }
  });
  return dates;
}
function convertDataFromUTCToLocal(data, column) {
  const dates = ungroupUTCDates(data);
  const query = (0, _query.default)(dates);
  const group = _m_utils.default.getHeaderFilterGroupParameters(_extends({}, column, {
    calculateCellValue: date => date
  }));
  return _store_helper.default.queryByOptions(query, {
    group
  }).toArray();
}
function isUTCFormat(format) {
  return (format === null || format === void 0 ? void 0 : format.slice(-1)) === 'Z' || (format === null || format === void 0 ? void 0 : format.slice(-3)) === '\'Z\'';
}
const getFormatOptions = function (value, column, currentLevel) {
  const groupInterval = _filtering.default.getGroupInterval(column);
  const result = _m_utils.default.getFormatOptionsByColumn(column, 'headerFilter');
  if (groupInterval) {
    result.groupInterval = groupInterval[currentLevel];
    if (_m_utils.default.isDateType(column.dataType)) {
      result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]];
    } else if (column.dataType === 'number') {
      result.getDisplayFormat = function () {
        const formatOptions = {
          format: column.format,
          target: 'headerFilter'
        };
        const firstValueText = _m_utils.default.formatValue(value, formatOptions);
        const secondValue = value + groupInterval[currentLevel];
        const secondValueText = _m_utils.default.formatValue(secondValue, formatOptions);
        return firstValueText && secondValueText ? `${firstValueText} - ${secondValueText}` : '';
      };
    }
  }
  return result;
};
class HeaderFilterController extends _m_modules.default.ViewController {
  init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._headerFilterView = this.getView('headerFilterView');
  }
  _updateSelectedState(items, column) {
    let i = items.length;
    const isExclude = column.filterType === 'exclude';
    while (i--) {
      const item = items[i];
      if ('items' in items[i]) {
        this._updateSelectedState(items[i].items, column);
      }
      (0, _m_header_filter_core.updateHeaderFilterItemSelectionState)(item, _m_utils.default.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude);
    }
  }
  _normalizeGroupItem(item, currentLevel, options) {
    let value;
    let displayValue;
    const {
      path
    } = options;
    const {
      valueSelector
    } = options;
    const {
      displaySelector
    } = options;
    const {
      column
    } = options;
    if (valueSelector && displaySelector) {
      value = valueSelector(item);
      displayValue = displaySelector(item);
    } else {
      value = item.key;
      displayValue = value;
    }
    if (!(0, _type.isObject)(item)) {
      item = {};
    } else {
      item = (0, _extend.extend)({}, item);
    }
    path.push(value);
    if (path.length === 1) {
      // NOTE: Important! Deconstructing here causes a lot of failed usage scenarios.
      // eslint-disable-next-line prefer-destructuring
      item.value = path[0];
    } else {
      item.value = path.join('/');
    }
    item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);
    return item;
  }
  // Used in the filter/m_filter_custom_operations as public method
  // Used in the private API WA [T1232532]
  getHeaderItemText(displayValue, column, currentLevel, headerFilterOptions) {
    let text = _m_utils.default.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));
    if (!text) {
      text = headerFilterOptions.texts.emptyValue;
    }
    return text;
  }
  _processGroupItems(groupItems, currentLevel, path, options) {
    const that = this;
    let displaySelector;
    let valueSelector;
    const {
      column
    } = options;
    const {
      lookup
    } = column;
    const {
      level
    } = options;
    path = path || [];
    currentLevel = currentLevel || 0;
    if (lookup) {
      displaySelector = (0, _data.compileGetter)(lookup.displayExpr);
      valueSelector = (0, _data.compileGetter)(lookup.valueExpr);
    }
    for (let i = 0; i < groupItems.length; i++) {
      groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
        column: options.column,
        headerFilterOptions: options.headerFilterOptions,
        displaySelector,
        valueSelector,
        path
      });
      if ('items' in groupItems[i]) {
        if (currentLevel === level || !(0, _type.isDefined)(groupItems[i].value)) {
          delete groupItems[i].items;
        } else {
          that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options);
        }
      }
      path.pop();
    }
  }
  getDataSource(column) {
    var _column$headerFilter;
    const dataSource = this._dataController.dataSource();
    const remoteGrouping = dataSource === null || dataSource === void 0 ? void 0 : dataSource.remoteOperations().grouping;
    const group = _m_utils.default.getHeaderFilterGroupParameters(column, remoteGrouping);
    const headerFilterDataSource = (_column$headerFilter = column.headerFilter) === null || _column$headerFilter === void 0 ? void 0 : _column$headerFilter.dataSource;
    const headerFilterOptions = this.option('headerFilter');
    let isLookup = false;
    const options = {
      component: this.component
    };
    if (!dataSource) return;
    if ((0, _type.isDefined)(headerFilterDataSource) && !(0, _type.isFunction)(headerFilterDataSource)) {
      options.dataSource = (0, _utils.normalizeDataSourceOptions)(headerFilterDataSource);
    } else if (column.lookup) {
      isLookup = true;
      if (this.option('syncLookupFilterValues')) {
        this._currentColumn = column;
        const filter = this._dataController.getCombinedFilter();
        this._currentColumn = null;
        options.dataSource = _m_utils.default.getWrappedLookupDataSource(column, dataSource, filter);
      } else {
        options.dataSource = _m_utils.default.normalizeLookupDataSource(column.lookup);
      }
    } else {
      const cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;
      this._currentColumn = column;
      const filter = this._dataController.getCombinedFilter();
      this._currentColumn = null;
      options.dataSource = {
        filter,
        group,
        useDefaultSearch: true,
        load: options => {
          // @ts-expect-error Deferred ctor.
          const d = new _deferred.Deferred();
          // TODO remove in 16.1
          options.dataField = column.dataField || column.name;
          dataSource.load(options).done(data => {
            const convertUTCDates = remoteGrouping && isUTCFormat(column.serializationFormat) && cutoffLevel > 3;
            if (convertUTCDates) {
              data = convertDataFromUTCToLocal(data, column);
            }
            that._processGroupItems(data, null, null, {
              level: cutoffLevel,
              column,
              headerFilterOptions
            });
            d.resolve(data);
          }).fail(d.reject);
          return d;
        }
      };
    }
    if ((0, _type.isFunction)(headerFilterDataSource)) {
      headerFilterDataSource.call(column, options);
    }
    const origPostProcess = options.dataSource.postProcess;
    const that = this;
    options.dataSource.postProcess = function (data) {
      let items = data;
      if (isLookup) {
        items = items.filter(item => item[column.lookup.valueExpr] !== null);
        if (this.pageIndex() === 0 && !this.searchValue()) {
          items = items.slice(0);
          items.unshift(null);
        }
        that._processGroupItems(items, null, null, {
          level: 0,
          column,
          headerFilterOptions
        });
      }
      items = origPostProcess && origPostProcess.call(this, items) || items;
      that._updateSelectedState(items, column);
      return items;
    };
    return options.dataSource;
  }
  getCurrentColumn() {
    return this._currentColumn;
  }
  showHeaderFilterMenu(columnIndex, isGroupPanel) {
    const columnsController = this._columnsController;
    const column = (0, _extend.extend)(true, {}, this._columnsController.getColumns()[columnIndex]);
    if (column) {
      const visibleIndex = columnsController.getVisibleIndex(columnIndex);
      // TODO getView
      const view = isGroupPanel ? this.getView('headerPanel') : this.getView('columnHeadersView');
      const $columnElement = view.getColumnElements()
      // @ts-expect-error
      .eq(isGroupPanel ? column.groupIndex : visibleIndex);
      this.showHeaderFilterMenuBase({
        columnElement: $columnElement,
        column,
        applyFilter: true,
        apply() {
          columnsController.columnOption(columnIndex, {
            filterValues: this.filterValues,
            filterType: this.filterType
          });
        }
      });
    }
  }
  showHeaderFilterMenuBase(options) {
    const that = this;
    const {
      column
    } = options;
    if (column) {
      const groupInterval = _filtering.default.getGroupInterval(column);
      const dataSource = that._dataController.dataSource();
      const remoteFiltering = dataSource && dataSource.remoteOperations().filtering;
      const previousOnHidden = options.onHidden;
      (0, _extend.extend)(options, column, {
        type: groupInterval && groupInterval.length > 1 ? 'tree' : 'list',
        remoteFiltering,
        onShowing: e => {
          const dxResizableInstance = e.component.$overlayContent().dxResizable('instance');
          dxResizableInstance && dxResizableInstance.option('onResizeEnd', e => {
            let headerFilterByColumn = this._columnsController.columnOption(options.dataField, 'headerFilter');
            headerFilterByColumn = headerFilterByColumn || {};
            headerFilterByColumn.width = e.width;
            headerFilterByColumn.height = e.height;
            this._columnsController.columnOption(options.dataField, 'headerFilter', headerFilterByColumn, true);
          });
        },
        onHidden: () => {
          previousOnHidden === null || previousOnHidden === void 0 || previousOnHidden();
          (0, _accessibility.restoreFocus)(this);
        }
      });
      options.dataSource = that.getDataSource(options);
      if (options.isFilterBuilder) {
        options.dataSource.filter = null;
        options.alignment = 'right';
      }
      that._headerFilterView.showHeaderFilterMenu(options.columnElement, options);
    }
  }
  hideHeaderFilterMenu() {
    this._headerFilterView.hideHeaderFilterMenu();
  }
}
exports.HeaderFilterController = HeaderFilterController;
const columnHeadersView = Base => class ColumnHeadersViewHeaderFilterExtender extends (0, _m_header_filter_core.headerFilterMixin)(Base) {
  _renderCellContent($cell, options) {
    const that = this;
    let $headerFilterIndicator;
    const {
      column
    } = options;
    if (!column.command && (0, _m_header_filter_core.allowHeaderFiltering)(column) && that.option('headerFilter.visible') && options.rowType === 'header') {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $cell,
        column,
        showColumnLines: that.option('showColumnLines')
      });
      $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, 'headerFilter');
    }
    super._renderCellContent.apply(this, arguments);
  }
  _subscribeToIndicatorEvent($indicator, column, indicatorName) {
    if (indicatorName === 'headerFilter') {
      _events_engine.default.on($indicator, _click.name, this.createAction(e => {
        e.event.stopPropagation();
        (0, _accessibility.saveFocusedElementInfo)($indicator, this);
        this._headerFilterController.showHeaderFilterMenu(column.index, false);
      }));
    }
  }
  _updateIndicator($cell, column, indicatorName) {
    const $indicator = super._updateIndicator($cell, column, indicatorName);
    $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName);
  }
  _updateHeaderFilterIndicators() {
    if (this.option('headerFilter.visible')) {
      this._updateIndicators('headerFilter');
    }
  }
  _needUpdateFilterIndicators() {
    return true;
  }
  _columnOptionChanged(e) {
    const {
      optionNames
    } = e;
    const isFilterRowAndHeaderFilterValuesChanged = _m_utils.default.checkChanges(optionNames, ['filterValues', 'filterValue']);
    const isHeaderFilterValuesAndTypeChanged = _m_utils.default.checkChanges(optionNames, ['filterValues', 'filterType']);
    const shouldUpdateFilterIndicators = (isFilterRowAndHeaderFilterValuesChanged || isHeaderFilterValuesAndTypeChanged) && this._needUpdateFilterIndicators();
    if (shouldUpdateFilterIndicators) {
      this._updateHeaderFilterIndicators();
    }
    if (!isHeaderFilterValuesAndTypeChanged) {
      super._columnOptionChanged(e);
    }
  }
};
const headerPanel = Base => class HeaderPanelHeaderFilterExtender extends (0, _m_header_filter_core.headerFilterMixin)(Base) {
  _createGroupPanelItem($rootElement, groupColumn) {
    const that = this;
    const $item = super._createGroupPanelItem.apply(that, arguments);
    let $headerFilterIndicator;
    if (!groupColumn.command && (0, _m_header_filter_core.allowHeaderFiltering)(groupColumn) && that.option('headerFilter.visible')) {
      $headerFilterIndicator = that._applyColumnState({
        name: 'headerFilter',
        rootElement: $item,
        column: {
          alignment: (0, _position.getDefaultAlignment)(that.option('rtlEnabled')),
          filterValues: groupColumn.filterValues,
          allowHeaderFiltering: true,
          caption: groupColumn.caption
        },
        showColumnLines: true
      });
      $headerFilterIndicator && _events_engine.default.on($headerFilterIndicator, _click.name, that.createAction(e => {
        const {
          event
        } = e;
        event.stopPropagation();
        this._headerFilterController.showHeaderFilterMenu(groupColumn.index, true);
      }));
    }
    return $item;
  }
};
function invertFilterExpression(filter) {
  return ['!', filter];
}
const data = Base => class DataControllerFilterRowExtender extends Base {
  skipCalculateColumnFilters() {
    return false;
  }
  _calculateAdditionalFilter() {
    if (this.skipCalculateColumnFilters()) {
      return super._calculateAdditionalFilter();
    }
    const that = this;
    const filters = [super._calculateAdditionalFilter()];
    const columns = that._columnsController.getVisibleColumns(null, true);
    const headerFilterController = this._headerFilterController;
    const currentColumn = headerFilterController.getCurrentColumn();
    (0, _iterator.each)(columns, (_, column) => {
      let filter;
      if (currentColumn && currentColumn.index === column.index) {
        return;
      }
      if ((0, _m_header_filter_core.allowHeaderFiltering)(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
        let filterValues = [];
        (0, _iterator.each)(column.filterValues, (_, filterValue) => {
          if (Array.isArray(filterValue)) {
            filter = filterValue;
          } else {
            if (column.deserializeValue && !_m_utils.default.isDateType(column.dataType) && column.dataType !== 'number') {
              filterValue = column.deserializeValue(filterValue);
            }
            filter = column.createFilterExpression(filterValue, '=', 'headerFilter');
          }
          if (filter) {
            filter.columnIndex = column.index;
          }
          filterValues.push(filter);
        });
        filterValues = _m_utils.default.combineFilters(filterValues, 'or');
        filters.push(column.filterType === 'exclude' ? ['!', filterValues] : filterValues);
      }
    });
    return _m_utils.default.combineFilters(filters);
  }
};
const headerFilterModule = exports.headerFilterModule = {
  defaultOptions() {
    return {
      syncLookupFilterValues: true,
      headerFilter: {
        visible: false,
        width: 252,
        height: 325,
        allowSelectAll: true,
        search: {
          enabled: false,
          timeout: 500,
          mode: 'contains',
          editorOptions: {}
        },
        texts: {
          emptyValue: _message.default.format('dxDataGrid-headerFilterEmptyValue'),
          ok: _message.default.format('dxDataGrid-headerFilterOK'),
          cancel: _message.default.format('dxDataGrid-headerFilterCancel')
        }
      }
    };
  },
  controllers: {
    headerFilter: HeaderFilterController
  },
  views: {
    headerFilterView: _m_header_filter_core.HeaderFilterView
  },
  extenders: {
    controllers: {
      data
    },
    views: {
      columnHeadersView,
      headerPanel
    }
  }
};