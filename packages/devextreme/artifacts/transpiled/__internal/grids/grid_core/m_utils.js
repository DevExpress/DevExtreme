"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _data = require("../../../core/utils/data");
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _string = require("../../../core/utils/string");
var _type = require("../../../core/utils/type");
var _variable_wrapper = _interopRequireDefault(require("../../../core/utils/variable_wrapper"));
var _window = require("../../../core/utils/window");
var _data_source = require("../../../data/data_source/data_source");
var _utils = require("../../../data/data_source/utils");
var _utils2 = require("../../../data/utils");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _format_helper = _interopRequireDefault(require("../../../format_helper"));
var _load_panel = _interopRequireDefault(require("../../../ui/load_panel"));
var _filtering = _interopRequireDefault(require("../../../ui/shared/filtering"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // @ts-check
// @ts-expect-error
// @ts-expect-error
const DATAGRID_SELECTION_DISABLED_CLASS = 'dx-selection-disabled';
const DATAGRID_GROUP_OPENED_CLASS = 'dx-datagrid-group-opened';
const DATAGRID_GROUP_CLOSED_CLASS = 'dx-datagrid-group-closed';
const DATAGRID_EXPAND_CLASS = 'dx-datagrid-expand';
const NO_DATA_CLASS = 'nodata';
const SCROLLING_MODE_INFINITE = 'infinite';
const SCROLLING_MODE_VIRTUAL = 'virtual';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
const SCROLLING_MODE_OPTION = 'scrolling.mode';
const ROW_RENDERING_MODE_OPTION = 'scrolling.rowRenderingMode';
const DATE_INTERVAL_SELECTORS = {
  year(value) {
    return value && value.getFullYear();
  },
  month(value) {
    return value && value.getMonth() + 1;
  },
  day(value) {
    return value && value.getDate();
  },
  quarter(value) {
    return value && Math.floor(value.getMonth() / 3) + 1;
  },
  hour(value) {
    return value && value.getHours();
  },
  minute(value) {
    return value && value.getMinutes();
  },
  second(value) {
    return value && value.getSeconds();
  }
};
const getIntervalSelector = function () {
  const data = arguments[1];
  const value = this.calculateCellValue(data);
  if (!(0, _type.isDefined)(value)) {
    return null;
  }
  if (isDateType(this.dataType)) {
    const nameIntervalSelector = arguments[0];
    return DATE_INTERVAL_SELECTORS[nameIntervalSelector](value);
  }
  if (this.dataType === 'number') {
    const groupInterval = arguments[0];
    return Math.floor(Number(value) / groupInterval) * groupInterval;
  }
};
const equalSelectors = function (selector1, selector2) {
  if ((0, _type.isFunction)(selector1) && (0, _type.isFunction)(selector2)) {
    if (selector1.originalCallback && selector2.originalCallback) {
      return selector1.originalCallback === selector2.originalCallback && selector1.columnIndex === selector2.columnIndex;
    }
  }
  return selector1 === selector2;
};
function isDateType(dataType) {
  return dataType === 'date' || dataType === 'datetime';
}
const setEmptyText = function ($container) {
  $container.get(0).textContent = '\u00A0';
};
const normalizeSortingInfo = function (sort) {
  sort = sort || [];
  const result = (0, _utils2.normalizeSortingInfo)(sort);
  for (let i = 0; i < sort.length; i++) {
    if (sort && sort[i] && sort[i].isExpanded !== undefined) {
      result[i].isExpanded = sort[i].isExpanded;
    }
    if (sort && sort[i] && sort[i].groupInterval !== undefined) {
      result[i].groupInterval = sort[i].groupInterval;
    }
  }
  return result;
};
const formatValue = function (value, options) {
  const valueText = _format_helper.default.format(value, options.format) || value && value.toString() || '';
  const formatObject = {
    value,
    valueText: options.getDisplayFormat ? options.getDisplayFormat(valueText) : valueText,
    target: options.target || 'row',
    groupInterval: options.groupInterval
  };
  return options.customizeText ? options.customizeText.call(options, formatObject) : formatObject.valueText;
};
const getSummaryText = function (summaryItem, summaryTexts) {
  const displayFormat = summaryItem.displayFormat || summaryItem.columnCaption && summaryTexts[`${summaryItem.summaryType}OtherColumn`] || summaryTexts[summaryItem.summaryType];
  return formatValue(summaryItem.value, {
    format: summaryItem.valueFormat,
    getDisplayFormat(valueText) {
      return displayFormat ? (0, _string.format)(displayFormat, valueText, summaryItem.columnCaption) : valueText;
    },
    customizeText: summaryItem.customizeText
  });
};
const getWidgetInstance = function ($element) {
  const editorData = $element.data && $element.data();
  const dxComponents = editorData && editorData.dxComponents;
  const widgetName = dxComponents && dxComponents[0];
  return widgetName && editorData[widgetName];
};
const equalFilterParameters = function (filter1, filter2) {
  if (Array.isArray(filter1) && Array.isArray(filter2)) {
    if (filter1.length !== filter2.length) {
      return false;
    }
    for (let i = 0; i < filter1.length; i++) {
      if (!equalFilterParameters(filter1[i], filter2[i])) {
        return false;
      }
    }
    return true;
  }
  if ((0, _type.isFunction)(filter1) && filter1.columnIndex >= 0 && (0, _type.isFunction)(filter2) && filter2.columnIndex >= 0) {
    return filter1.columnIndex === filter2.columnIndex && (0, _data.toComparable)(filter1.filterValue) === (0, _data.toComparable)(filter2.filterValue) && (0, _data.toComparable)(filter1.selectedFilterOperation) === (0, _data.toComparable)(filter2.selectedFilterOperation);
  }
  return (0, _data.toComparable)(filter1) == (0, _data.toComparable)(filter2); // eslint-disable-line eqeqeq
};
function normalizeGroupingLoadOptions(group) {
  if (!Array.isArray(group)) {
    group = [group];
  }
  return group.map((item, i) => {
    if ((0, _type.isString)(item)) {
      return {
        selector: item,
        isExpanded: i < group.length - 1
      };
    }
    return item;
  });
}
var _default = exports.default = {
  renderNoDataText($element) {
    const that = this;
    $element = $element || this.element();
    if (!$element) {
      return;
    }
    const noDataClass = that.addWidgetPrefix(NO_DATA_CLASS);
    let noDataElement = $element.find(`.${noDataClass}`).last();
    const isVisible = this._dataController.isEmpty();
    const isLoading = this._dataController.isLoading();
    if (!noDataElement.length) {
      noDataElement = (0, _renderer.default)('<span>').addClass(noDataClass);
    }
    if (!noDataElement.parent().is($element)) {
      noDataElement.appendTo($element);
    }
    if (isVisible && !isLoading) {
      noDataElement.removeClass('dx-hidden').text(that._getNoDataText());
    } else {
      noDataElement.addClass('dx-hidden');
    }
  },
  renderLoadPanel($element, $container, isLocalStore) {
    const that = this;
    let loadPanelOptions;
    that._loadPanel && that._loadPanel.$element().remove();
    loadPanelOptions = that.option('loadPanel');
    if (loadPanelOptions && (loadPanelOptions.enabled === 'auto' ? !isLocalStore : loadPanelOptions.enabled)) {
      loadPanelOptions = (0, _extend.extend)({
        shading: false,
        message: loadPanelOptions.text,
        container: $container
      }, loadPanelOptions);
      that._loadPanel = that._createComponent((0, _renderer.default)('<div>').appendTo($container), _load_panel.default, loadPanelOptions);
    } else {
      that._loadPanel = null;
    }
  },
  calculateLoadPanelPosition($element) {
    // @ts-expect-error
    const $window = (0, _renderer.default)((0, _window.getWindow)());
    if ((0, _size.getHeight)($element) > (0, _size.getHeight)($window)) {
      return {
        of: $window,
        boundary: $element,
        collision: 'fit'
      };
    }
    return {
      of: $element
    };
  },
  getIndexByKey(key, items, keyName) {
    let index = -1;
    if (key !== undefined && Array.isArray(items)) {
      keyName = arguments.length <= 2 ? 'key' : keyName;
      for (let i = 0; i < items.length; i++) {
        const item = (0, _type.isDefined)(keyName) ? items[i][keyName] : items[i];
        if ((0, _common.equalByValue)(key, item)) {
          index = i;
          break;
        }
      }
    }
    return index;
  },
  combineFilters(filters, operation) {
    let resultFilter = [];
    operation = operation || 'and';
    for (let i = 0; i < filters.length; i++) {
      var _filters$i;
      if (!filters[i]) {
        continue;
      }
      if (((_filters$i = filters[i]) === null || _filters$i === void 0 ? void 0 : _filters$i.length) === 1 && filters[i][0] === '!') {
        if (operation === 'and') {
          return ['!'];
        }
        if (operation === 'or') {
          continue;
        }
      }
      if (resultFilter.length) {
        resultFilter.push(operation);
      }
      resultFilter.push(filters[i]);
    }
    if (resultFilter.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      resultFilter = resultFilter[0];
    }
    if (resultFilter.length) {
      return resultFilter;
    }
    return undefined;
  },
  checkChanges(changes, changeNames) {
    let changesWithChangeNamesCount = 0;
    for (let i = 0; i < changeNames.length; i++) {
      if (changes[changeNames[i]]) {
        changesWithChangeNamesCount++;
      }
    }
    return changes.length && changes.length === changesWithChangeNamesCount;
  },
  equalFilterParameters,
  proxyMethod(instance, methodName, defaultResult) {
    if (!instance[methodName]) {
      instance[methodName] = function () {
        const dataSource = this._dataSource;
        return dataSource ? dataSource[methodName].apply(dataSource, arguments) : defaultResult;
      };
    }
  },
  formatValue,
  getFormatOptionsByColumn(column, target) {
    return {
      format: column.format,
      getDisplayFormat: column.getDisplayFormat,
      customizeText: column.customizeText,
      target,
      trueText: column.trueText,
      falseText: column.falseText
    };
  },
  getDisplayValue(column, value, data, rowType) {
    if (column.displayValueMap && column.displayValueMap[value] !== undefined) {
      return column.displayValueMap[value];
    }
    if (column.calculateDisplayValue && data && rowType !== 'group') {
      return column.calculateDisplayValue(data);
    }
    if (column.lookup && !(rowType === 'group' && (column.calculateGroupValue || column.calculateDisplayValue))) {
      return column.lookup.calculateCellValue(value);
    }
    return value;
  },
  getGroupRowSummaryText(summaryItems, summaryTexts) {
    let result = '(';
    for (let i = 0; i < summaryItems.length; i++) {
      const summaryItem = summaryItems[i];
      result += (i > 0 ? ', ' : '') + getSummaryText(summaryItem, summaryTexts);
    }
    // eslint-disable-next-line no-return-assign
    return result += ')';
  },
  getSummaryText,
  normalizeSortingInfo,
  getFormatByDataType(dataType) {
    // eslint-disable-next-line default-case
    switch (dataType) {
      case 'date':
        return 'shortDate';
      case 'datetime':
        return 'shortDateShortTime';
      default:
        return undefined;
    }
  },
  getHeaderFilterGroupParameters(column, remoteGrouping) {
    let result = [];
    const dataField = column.dataField || column.name;
    const groupInterval = _filtering.default.getGroupInterval(column);
    if (groupInterval) {
      (0, _iterator.each)(groupInterval, (index, interval) => {
        result.push(remoteGrouping ? {
          selector: dataField,
          groupInterval: interval,
          isExpanded: index < groupInterval.length - 1
        } : getIntervalSelector.bind(column, interval));
      });
      return result;
    }
    if (remoteGrouping) {
      result = [{
        selector: dataField,
        isExpanded: false
      }];
    } else {
      result = function (data) {
        let result = column.calculateCellValue(data);
        if (result === undefined || result === '') {
          result = null;
        }
        return result;
      };
      if (column.sortingMethod) {
        result = [{
          selector: result,
          compare: column.sortingMethod.bind(column)
        }];
      }
    }
    return result;
  },
  equalSortParameters(sortParameters1, sortParameters2, ignoreIsExpanded) {
    sortParameters1 = normalizeSortingInfo(sortParameters1);
    sortParameters2 = normalizeSortingInfo(sortParameters2);
    if (Array.isArray(sortParameters1) && Array.isArray(sortParameters2)) {
      if (sortParameters1.length !== sortParameters2.length) {
        return false;
      }
      for (let i = 0; i < sortParameters1.length; i++) {
        if (!equalSelectors(sortParameters1[i].selector, sortParameters2[i].selector) || sortParameters1[i].desc !== sortParameters2[i].desc || sortParameters1[i].groupInterval !== sortParameters2[i].groupInterval || !ignoreIsExpanded && Boolean(sortParameters1[i].isExpanded) !== Boolean(sortParameters2[i].isExpanded)) {
          return false;
        }
      }
      return true;
    }
    return (!sortParameters1 || !sortParameters1.length) === (!sortParameters2 || !sortParameters2.length);
  },
  getPointsByColumns(items, pointCreated, isVertical, startColumnIndex) {
    const cellsLength = items.length;
    let notCreatePoint = false;
    let item;
    let offset;
    let columnIndex = startColumnIndex || 0;
    const result = [];
    let rtlEnabled;
    for (let i = 0; i <= cellsLength; i++) {
      if (i < cellsLength) {
        item = items.eq(i);
        offset = item.offset();
        rtlEnabled = item.css('direction') === 'rtl';
      }
      const point = {
        index: columnIndex,
        // @ts-expect-error
        x: offset ? offset.left + (!isVertical && rtlEnabled ^ i === cellsLength ? (0, _position.getBoundingRect)(item[0]).width : 0) : 0,
        y: offset ? offset.top + (isVertical && i === cellsLength ? (0, _position.getBoundingRect)(item[0]).height : 0) : 0,
        columnIndex
      };
      if (!isVertical && i > 0) {
        const prevItemOffset = items.eq(i - 1).offset();
        if (prevItemOffset.top < point.y) {
          point.y = prevItemOffset.top;
        }
      }
      if (pointCreated) {
        notCreatePoint = pointCreated(point);
      }
      if (!notCreatePoint) {
        result.push(point);
      }
      columnIndex++;
    }
    return result;
  },
  getExpandCellTemplate() {
    return {
      allowRenderToDetachedContainer: true,
      render(container, options) {
        const $container = (0, _renderer.default)(container);
        if ((0, _type.isDefined)(options.value) && !(options.data && options.data.isContinuation) && !options.row.isNewRow) {
          const rowsView = options.component.getView('rowsView');
          $container.addClass(DATAGRID_EXPAND_CLASS).addClass(DATAGRID_SELECTION_DISABLED_CLASS);
          (0, _renderer.default)('<div>').addClass(options.value ? DATAGRID_GROUP_OPENED_CLASS : DATAGRID_GROUP_CLOSED_CLASS).appendTo($container);
          rowsView.setAria('label', options.value ? rowsView.localize('dxDataGrid-ariaCollapse') : rowsView.localize('dxDataGrid-ariaExpand'), $container);
        } else {
          setEmptyText($container);
        }
      }
    };
  },
  setEmptyText,
  isDateType,
  getSelectionRange(focusedElement) {
    try {
      if (focusedElement) {
        return {
          selectionStart: focusedElement.selectionStart,
          selectionEnd: focusedElement.selectionEnd
        };
      }
    } catch (e) {/* empty */}
    return {};
  },
  setSelectionRange(focusedElement, selectionRange) {
    try {
      if (focusedElement && focusedElement.setSelectionRange) {
        focusedElement.setSelectionRange(selectionRange.selectionStart, selectionRange.selectionEnd);
      }
    } catch (e) {/* empty */}
  },
  focusAndSelectElement(component, $element) {
    const isFocused = $element.is(':focus');
    // @ts-expect-error
    _events_engine.default.trigger($element, 'focus');
    const isSelectTextOnEditingStart = component.option('editing.selectTextOnEditStart');
    const element = $element.get(0);
    if (!isFocused && isSelectTextOnEditingStart && $element.is('.dx-texteditor-input') && !$element.is('[readonly]')) {
      const editor = getWidgetInstance($element.closest('.dx-texteditor'));
      (0, _deferred.when)(editor && editor._loadItemDeferred).done(() => {
        element.select();
      });
    }
  },
  getWidgetInstance,
  getLastResizableColumnIndex(columns, resultWidths) {
    const hasResizableColumns = columns.some(column => column && !column.command && !column.fixed && column.allowResizing !== false);
    let lastColumnIndex;
    for (lastColumnIndex = columns.length - 1; columns[lastColumnIndex]; lastColumnIndex--) {
      const column = columns[lastColumnIndex];
      const width = resultWidths && resultWidths[lastColumnIndex];
      const allowResizing = !hasResizableColumns || column.allowResizing !== false;
      if (!column.command && !column.fixed && width !== 'adaptiveHidden' && allowResizing) {
        break;
      }
    }
    return lastColumnIndex;
  },
  isElementInCurrentGrid(controller, $element) {
    if ($element && $element.length) {
      const $grid = $element.closest(`.${controller.getWidgetContainerClass()}`).parent();
      return $grid.is(controller.component.$element());
    }
    return false;
  },
  isVirtualRowRendering(that) {
    const rowRenderingMode = that.option(ROW_RENDERING_MODE_OPTION);
    const isVirtualMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_VIRTUAL;
    const isAppendMode = that.option(SCROLLING_MODE_OPTION) === SCROLLING_MODE_INFINITE;
    if (that.option(LEGACY_SCROLLING_MODE) === false && (isVirtualMode || isAppendMode)) {
      return true;
    }
    return rowRenderingMode === SCROLLING_MODE_VIRTUAL;
  },
  getPixelRatio(window) {
    return window.devicePixelRatio || 1;
  },
  /// #DEBUG
  _setPixelRatioFn(value) {
    this.getPixelRatio = value;
  },
  /// #ENDDEBUG
  getContentHeightLimit(browser) {
    if (browser.mozilla) {
      return 8000000;
    }
    return 15000000 / this.getPixelRatio((0, _window.getWindow)());
  },
  normalizeLookupDataSource(lookup) {
    let lookupDataSourceOptions;
    if (lookup.items) {
      lookupDataSourceOptions = lookup.items;
    } else {
      lookupDataSourceOptions = lookup.dataSource;
      if ((0, _type.isFunction)(lookupDataSourceOptions) && !_variable_wrapper.default.isWrapped(lookupDataSourceOptions)) {
        lookupDataSourceOptions = lookupDataSourceOptions({});
      }
    }
    return (0, _utils.normalizeDataSourceOptions)(lookupDataSourceOptions);
  },
  getWrappedLookupDataSource(column, dataSource, filter) {
    if (!dataSource) {
      return [];
    }
    const lookupDataSourceOptions = this.normalizeLookupDataSource(column.lookup);
    if (column.calculateCellValue !== column.defaultCalculateCellValue) {
      return lookupDataSourceOptions;
    }
    const hasGroupPaging = dataSource.remoteOperations().groupPaging;
    const hasLookupOptimization = column.displayField && (0, _type.isString)(column.displayField);
    let cachedUniqueRelevantItems;
    let previousTake;
    let previousSkip;
    const sliceItems = (items, loadOptions) => {
      const start = loadOptions.skip ?? 0;
      const end = loadOptions.take ? start + loadOptions.take : items.length;
      return items.slice(start, end);
    };
    const loadUniqueRelevantItems = loadOptions => {
      const group = normalizeGroupingLoadOptions(hasLookupOptimization ? [column.dataField, column.displayField] : column.dataField);
      // @ts-expect-error
      const d = new _deferred.Deferred();
      const canUseCache = cachedUniqueRelevantItems && (!hasGroupPaging || loadOptions.skip === previousSkip && loadOptions.take === previousTake);
      if (canUseCache) {
        d.resolve(sliceItems(cachedUniqueRelevantItems, loadOptions));
      } else {
        previousSkip = loadOptions.skip;
        previousTake = loadOptions.take;
        dataSource.load({
          filter,
          group,
          take: hasGroupPaging ? loadOptions.take : undefined,
          skip: hasGroupPaging ? loadOptions.skip : undefined
        }).done(items => {
          cachedUniqueRelevantItems = items;
          d.resolve(hasGroupPaging ? items : sliceItems(items, loadOptions));
        }).fail(d.fail);
      }
      return d;
    };
    const lookupDataSource = _extends({}, lookupDataSourceOptions, {
      __dataGridSourceFilter: filter,
      load: loadOptions => {
        // @ts-expect-error
        const d = new _deferred.Deferred();
        loadUniqueRelevantItems(loadOptions).done(items => {
          if (items.length === 0) {
            d.resolve([]);
            return;
          }
          const filter = this.combineFilters(items.flatMap(data => data.key).map(key => [column.lookup.valueExpr, key]), 'or');
          const newDataSource = new _data_source.DataSource(_extends({}, lookupDataSourceOptions, loadOptions, {
            filter: this.combineFilters([filter, loadOptions.filter], 'and'),
            paginate: false // pagination is included to filter
          }));
          newDataSource
          // @ts-expect-error
          .load().done(d.resolve).fail(d.fail);
        }).fail(d.fail);
        return d;
      },
      key: column.lookup.valueExpr,
      byKey(key) {
        const d = (0, _deferred.Deferred)();
        this.load({
          filter: [column.lookup.valueExpr, '=', key]
        }).done(arr => {
          d.resolve(arr[0]);
        });
        return d.promise();
      }
    });
    return lookupDataSource;
  },
  logHeaderFilterDeprecatedWarningIfNeed(component) {
    const since = '23.1';
    const logWarning = component._logDeprecatedOptionWarning.bind(component);
    if ((0, _type.isDefined)(component.option('headerFilter.allowSearch'))) {
      logWarning('headerFilter.allowSearch', {
        since,
        alias: 'headerFilter.search.enabled'
      });
    }
    if ((0, _type.isDefined)(component.option('headerFilter.searchTimeout'))) {
      logWarning('headerFilter.searchTimeout', {
        since,
        alias: 'headerFilter.search.timeout'
      });
    }
    const specificName = component.NAME === 'dxPivotGrid' ? 'dataSource.fields' : 'columns';
    const columns = component.option(specificName);
    if (!Array.isArray(columns)) {
      return;
    }
    const logSpecificDeprecatedWarningIfNeed = columns => {
      columns.forEach(column => {
        var _column$columns;
        const headerFilter = column.headerFilter || {};
        if ((0, _type.isDefined)(headerFilter.allowSearch)) {
          logWarning(`${specificName}[].headerFilter.allowSearch`, {
            since,
            alias: `${specificName}[].headerFilter.search.enabled`
          });
        }
        if ((0, _type.isDefined)(headerFilter.searchMode)) {
          logWarning(`${specificName}[].headerFilter.searchMode`, {
            since,
            alias: `${specificName}[].headerFilter.search.mode`
          });
        }
        if ((_column$columns = column.columns) !== null && _column$columns !== void 0 && _column$columns.length) {
          logSpecificDeprecatedWarningIfNeed(column.columns);
        }
      });
    };
    logSpecificDeprecatedWarningIfNeed(columns);
  }
};