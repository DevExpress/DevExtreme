"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderSummaryCell = exports.FooterView = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _store_helper = _interopRequireDefault(require("../../../../data/store_helper"));
var _utils = require("../../../../data/utils");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_columns_view = require("../../../grids/grid_core/views/m_columns_view");
var _m_aggregate_calculator = _interopRequireDefault(require("../m_aggregate_calculator"));
var _m_core = _interopRequireDefault(require("../m_core"));
var _m_data_source_adapter = _interopRequireDefault(require("../m_data_source_adapter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

// @ts-expect-error

const DATAGRID_TOTAL_FOOTER_CLASS = 'dx-datagrid-total-footer';
const DATAGRID_SUMMARY_ITEM_CLASS = 'dx-datagrid-summary-item';
const DATAGRID_TEXT_CONTENT_CLASS = 'dx-datagrid-text-content';
const DATAGRID_GROUP_FOOTER_CLASS = 'dx-datagrid-group-footer';
const DATAGRID_GROUP_TEXT_CONTENT_CLASS = 'dx-datagrid-group-text-content';
const DATAGRID_NOWRAP_CLASS = 'dx-datagrid-nowrap';
const DATAGRID_FOOTER_ROW_CLASS = 'dx-footer-row';
const DATAGRID_CELL_DISABLED = 'dx-cell-focus-disabled';
const DATAGRID_GROUP_FOOTER_ROW_TYPE = 'groupFooter';
const DATAGRID_TOTAL_FOOTER_ROW_TYPE = 'totalFooter';
const renderSummaryCell = function (cell, options) {
  const $cell = (0, _renderer.default)(cell);
  const {
    column
  } = options;
  const {
    summaryItems
  } = options;
  const $summaryItems = [];
  if (!column.command && summaryItems) {
    for (let i = 0; i < summaryItems.length; i++) {
      const summaryItem = summaryItems[i];
      const text = _m_core.default.getSummaryText(summaryItem, options.summaryTexts);
      $summaryItems.push((0, _renderer.default)('<div>').css('textAlign', summaryItem.alignment || column.alignment).addClass(DATAGRID_SUMMARY_ITEM_CLASS).addClass(DATAGRID_TEXT_CONTENT_CLASS).addClass(summaryItem.cssClass).toggleClass(DATAGRID_GROUP_TEXT_CONTENT_CLASS, options.rowType === 'group').text(text).attr('aria-label', `${column.caption} ${text}`));
    }
    $cell.append($summaryItems);
  }
};
exports.renderSummaryCell = renderSummaryCell;
const getSummaryCellOptions = function (that, options) {
  const summaryTexts = that.option('summary.texts') || {};
  return {
    totalItem: options.row,
    summaryItems: options.row.summaryCells[options.columnIndex],
    summaryTexts
  };
};
const getGroupAggregates = function (data) {
  return data.summary || data.aggregates || [];
};
const recalculateWhileEditing = function (that) {
  return that.option('summary.recalculateWhileEditing');
};
const forEachGroup = function (groups, groupCount, callback, path) {
  path = path || [];
  for (let i = 0; i < groups.length; i++) {
    path.push(groups[i].key);
    if (groupCount === 1) {
      callback(path, groups[i].items);
    } else {
      forEachGroup(groups[i].items, groupCount - 1, callback, path);
    }
    path.pop();
  }
};
const applyAddedData = function (data, insertedData, groupLevel) {
  if (groupLevel) {
    return applyAddedData(data, insertedData.map(item => ({
      items: [item]
    }), groupLevel - 1));
  }
  return data.concat(insertedData);
};
const applyRemovedData = function (data, removedData, groupLevel) {
  if (groupLevel) {
    return data.map(data => {
      const updatedData = {};
      const updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);
      Object.defineProperty(updatedData, 'aggregates', {
        get: () => data.aggregates,
        set: value => {
          data.aggregates = value;
        }
      });
      return (0, _extend.extend)(updatedData, data, {
        items: updatedItems
      });
    });
  }
  return data.filter(data => removedData.indexOf(data) < 0);
};
const sortGroupsBySummaryCore = function (items, groups, sortByGroups) {
  if (!items || !groups.length) return items;
  const group = groups[0];
  const sorts = sortByGroups[0];
  let query;
  if (group && sorts && sorts.length) {
    query = (0, _query.default)(items);
    (0, _iterator.each)(sorts, function (index) {
      if (index === 0) {
        query = query.sortBy(this.selector, this.desc);
      } else {
        query = query.thenBy(this.selector, this.desc);
      }
    });
    query.enumerate().done(sortedItems => {
      items = sortedItems;
    });
  }
  groups = groups.slice(1);
  sortByGroups = sortByGroups.slice(1);
  if (groups.length && sortByGroups.length) {
    (0, _iterator.each)(items, function () {
      this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups);
    });
  }
  return items;
};
const sortGroupsBySummary = function (data, group, summary) {
  const sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();
  if (sortByGroups && sortByGroups.length) {
    return sortGroupsBySummaryCore(data, group, sortByGroups);
  }
  return data;
};
const calculateAggregates = function (that, summary, data, groupLevel) {
  let calculator;
  if (recalculateWhileEditing(that)) {
    const editingController = that._editingController;
    if (editingController) {
      const insertedData = editingController.getInsertedData();
      if (insertedData.length) {
        data = applyAddedData(data, insertedData, groupLevel);
      }
      const removedData = editingController.getRemovedData();
      if (removedData.length) {
        data = applyRemovedData(data, removedData, groupLevel);
      }
    }
  }
  if (summary) {
    calculator = new _m_aggregate_calculator.default({
      totalAggregates: summary.totalAggregates,
      groupAggregates: summary.groupAggregates,
      data,
      groupLevel
    });
    calculator.calculate();
  }
  return calculator ? calculator.totalAggregates() : [];
};
class FooterView extends _m_columns_view.ColumnsView {
  _getRows() {
    // @ts-expect-error
    return this._dataController.footerItems();
  }
  _getCellOptions(options) {
    return (0, _extend.extend)(super._getCellOptions(options), getSummaryCellOptions(this, options));
  }
  _renderCellContent($cell, options) {
    renderSummaryCell($cell, options);
    // @ts-expect-error
    super._renderCellContent.apply(this, arguments);
  }
  _renderCore(change) {
    let needUpdateScrollLeft = false;
    // @ts-expect-error
    const totalItem = this._dataController.footerItems()[0];
    if (!change || !change.columnIndices) {
      this.element().empty().addClass(DATAGRID_TOTAL_FOOTER_CLASS).toggleClass(DATAGRID_NOWRAP_CLASS, !this.option('wordWrapEnabled'));
      needUpdateScrollLeft = true;
    }
    if (totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
      this._updateContent(this._renderTable({
        change
      }), change);
      needUpdateScrollLeft && this._updateScrollLeftPosition();
    }
  }
  _updateContent($newTable, change) {
    if (change && change.changeType === 'update' && change.columnIndices) {
      return this.waitAsyncTemplates().done(() => {
        const $row = this.getTableElement().find('.dx-row');
        const $newRow = $newTable.find('.dx-row');
        this._updateCells($row, $newRow, change.columnIndices[0]);
      });
    }
    // @ts-expect-error
    return super._updateContent.apply(this, arguments);
  }
  _rowClick(e) {
    // @ts-expect-error
    const item = this._dataController.footerItems()[e.rowIndex] || {};
    this.executeAction('onRowClick', (0, _extend.extend)({}, e, item));
  }
  _columnOptionChanged(e) {
    const {
      optionNames
    } = e;
    if (e.changeTypes.grouping) return;
    if (optionNames.width || optionNames.visibleWidth) {
      super._columnOptionChanged(e);
    }
  }
  _handleDataChanged(e) {
    const {
      changeType
    } = e;
    if (e.changeType === 'update' && e.repaintChangesOnly) {
      if (!e.totalColumnIndices) {
        this.render();
      } else if (e.totalColumnIndices.length) {
        this.render(null, {
          changeType: 'update',
          columnIndices: [e.totalColumnIndices]
        });
      }
    } else if (changeType === 'refresh' || changeType === 'append' || changeType === 'prepend') {
      this.render();
    }
  }
  _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);
    if (row.rowType === DATAGRID_TOTAL_FOOTER_ROW_TYPE) {
      $row.addClass(DATAGRID_FOOTER_ROW_CLASS);
      $row.addClass(DATAGRID_CELL_DISABLED);
      $row.attr('tabindex', 0);
    }
    return $row;
  }
  getHeight() {
    return this.getElementHeight();
  }
  isVisible() {
    // @ts-expect-error
    return !!this._dataController.footerItems().length;
  }
}
exports.FooterView = FooterView;
const dataSourceAdapterExtender = Base => class SummaryDataSourceAdapterExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._editingController = this.getController('editing');
    this._totalAggregates = [];
    this._summaryGetter = _common.noop;
  }
  summaryGetter(summaryGetter) {
    if (!arguments.length) {
      return this._summaryGetter;
    }
    if ((0, _type.isFunction)(summaryGetter)) {
      this._summaryGetter = summaryGetter;
    }
  }
  summary(summary) {
    if (!arguments.length) {
      return this._summaryGetter();
    }
    this._summaryGetter = function () {
      return summary;
    };
  }
  totalAggregates() {
    return this._totalAggregates;
  }
  isLastLevelGroupItemsPagingLocal() {
    const summary = this.summary();
    const sortByGroupsInfo = summary === null || summary === void 0 ? void 0 : summary.sortByGroups();
    return sortByGroupsInfo === null || sortByGroupsInfo === void 0 ? void 0 : sortByGroupsInfo.length;
  }
  sortLastLevelGroupItems(items, groups, paths) {
    const groupedItems = _store_helper.default.multiLevelGroup((0, _query.default)(items), groups).toArray();
    let result = [];
    paths.forEach(path => {
      forEachGroup(groupedItems, groups.length, (itemsPath, items) => {
        if (path.toString() === itemsPath.toString()) {
          result = result.concat(items);
        }
      });
    });
    return result;
  }
  _customizeRemoteOperations(options) {
    const summary = this.summary();
    if (summary) {
      if (options.remoteOperations.summary) {
        if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
          if (options.storeLoadOptions.group) {
            if (options.remoteOperations.grouping) {
              options.storeLoadOptions.groupSummary = summary.groupAggregates;
            } else if (summary.groupAggregates.length) {
              options.remoteOperations.paging = false;
            }
          }
          options.storeLoadOptions.totalSummary = summary.totalAggregates;
        }
      } else if (summary.totalAggregates.length || summary.groupAggregates.length && options.storeLoadOptions.group) {
        options.remoteOperations.paging = false;
      }
    }
    super._customizeRemoteOperations.apply(this, arguments);
    const cachedExtra = options.cachedData.extra;
    if (cachedExtra !== null && cachedExtra !== void 0 && cachedExtra.summary && !options.isCustomLoading) {
      options.storeLoadOptions.totalSummary = undefined;
    }
  }
  _handleDataLoadedCore(options) {
    const groups = (0, _utils.normalizeSortingInfo)(options.storeLoadOptions.group || options.loadOptions.group || []);
    const remoteOperations = options.remoteOperations || {};
    const summary = this.summaryGetter()(remoteOperations);
    if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
      if (remoteOperations.summary) {
        if (!remoteOperations.paging && groups.length && summary) {
          if (!remoteOperations.grouping) {
            calculateAggregates(this, {
              groupAggregates: summary.groupAggregates
            }, options.data, groups.length);
          }
          options.data = sortGroupsBySummary(options.data, groups, summary);
        }
      } else if (!remoteOperations.paging && summary) {
        var _options$cachedData;
        const operationTypes = options.operationTypes || {};
        const hasOperations = Object.keys(operationTypes).some(type => operationTypes[type]);
        if (!hasOperations || !((_options$cachedData = options.cachedData) !== null && _options$cachedData !== void 0 && (_options$cachedData = _options$cachedData.extra) !== null && _options$cachedData !== void 0 && _options$cachedData.summary) || groups.length && summary.groupAggregates.length) {
          const totalAggregates = calculateAggregates(this, summary, options.data, groups.length);
          options.extra = (0, _type.isPlainObject)(options.extra) ? options.extra : {};
          options.extra.summary = totalAggregates;
          if (options.cachedData) {
            options.cachedData.extra = options.extra;
          }
        }
        options.data = sortGroupsBySummary(options.data, groups, summary);
      }
    }
    if (!options.isCustomLoading) {
      this._totalAggregates = options.extra && options.extra.summary || this._totalAggregates;
    }
    super._handleDataLoadedCore(options);
  }
};
_m_data_source_adapter.default.extend(dataSourceAdapterExtender);
const data = Base => class SummaryDataControllerExtender extends Base {
  _isDataColumn(column) {
    return column && (!(0, _type.isDefined)(column.groupIndex) || column.showWhenGrouped);
  }
  _isGroupFooterVisible() {
    const groupItems = this.option('summary.groupItems') || [];
    for (let i = 0; i < groupItems.length; i++) {
      const groupItem = groupItems[i];
      const column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
      if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
        return true;
      }
    }
    return false;
  }
  _processGroupItems(items, groupCount, options) {
    const data = options && options.data;
    // @ts-expect-error
    const result = super._processGroupItems.apply(this, arguments);
    if (options) {
      if (options.isGroupFooterVisible === undefined) {
        options.isGroupFooterVisible = this._isGroupFooterVisible();
      }
      if (data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
        result.push({
          rowType: DATAGRID_GROUP_FOOTER_ROW_TYPE,
          key: options.path.slice(),
          data,
          groupIndex: options.path.length - 1,
          values: []
        });
      }
    }
    return result;
  }
  _processGroupItem(groupItem, options) {
    const that = this;
    if (!options.summaryGroupItems) {
      options.summaryGroupItems = that.option('summary.groupItems') || [];
    }
    if (groupItem.rowType === 'group') {
      let groupColumnIndex = -1;
      let afterGroupColumnIndex = -1;
      (0, _iterator.each)(options.visibleColumns, function (visibleIndex) {
        const prevColumn = options.visibleColumns[visibleIndex - 1];
        if (groupItem.groupIndex === this.groupIndex) {
          groupColumnIndex = this.index;
        }
        if (visibleIndex > 0 && prevColumn.command === 'expand' && this.command !== 'expand') {
          afterGroupColumnIndex = this.index;
        }
      });
      groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => {
        if (summaryItem.showInGroupFooter) {
          return -1;
        }
        if (summaryItem.alignByColumn && column && !(0, _type.isDefined)(column.groupIndex) && column.index !== afterGroupColumnIndex) {
          return column.index;
        }
        return groupColumnIndex;
      }, true);
    }
    if (groupItem.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE) {
      groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, (summaryItem, column) => summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1);
    }
    return groupItem;
  }
  _calculateSummaryCells(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex, isGroupRow) {
    const that = this;
    const summaryCells = [];
    const summaryCellsByColumns = {};
    (0, _iterator.each)(summaryItems, (summaryIndex, summaryItem) => {
      const column = that._columnsController.columnOption(summaryItem.column);
      const showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
      const columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);
      if (columnIndex >= 0) {
        if (!summaryCellsByColumns[columnIndex]) {
          summaryCellsByColumns[columnIndex] = [];
        }
        const aggregate = aggregates[summaryIndex];
        if (aggregate === aggregate) {
          let valueFormat;
          if ((0, _type.isDefined)(summaryItem.valueFormat)) {
            valueFormat = summaryItem.valueFormat;
          } else if (summaryItem.summaryType !== 'count') {
            valueFormat = _m_core.default.getFormatByDataType(column && column.dataType);
          }
          summaryCellsByColumns[columnIndex].push((0, _extend.extend)({}, summaryItem, {
            value: (0, _type.isString)(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
            valueFormat,
            columnCaption: column && column.index !== columnIndex ? column.caption : undefined
          }));
        }
      }
    });
    if (!(0, _type.isEmptyObject)(summaryCellsByColumns)) {
      visibleColumns.forEach((column, visibleIndex) => {
        const prevColumn = visibleColumns[visibleIndex - 1];
        const columnIndex = isGroupRow && ((prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.command) === 'expand' || column.command === 'expand') ? prevColumn === null || prevColumn === void 0 ? void 0 : prevColumn.index : column.index;
        summaryCells.push(summaryCellsByColumns[columnIndex] || []);
      });
    }
    return summaryCells;
  }
  _getSummaryCells(summaryTotalItems, totalAggregates) {
    const that = this;
    const columnsController = that._columnsController;
    return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), (summaryItem, column) => that._isDataColumn(column) ? column.index : -1);
  }
  _updateItemsCore(change) {
    const that = this;
    let summaryCells;
    const dataSource = that._dataSource;
    const footerItems = that._footerItems;
    const oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
    const summaryTotalItems = that.option('summary.totalItems');
    that._footerItems = [];
    if (dataSource && summaryTotalItems && summaryTotalItems.length) {
      const totalAggregates = dataSource.totalAggregates();
      summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
      if (change && change.repaintChangesOnly && oldSummaryCells) {
        change.totalColumnIndices = summaryCells.map((summaryCell, index) => {
          if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
            return index;
          }
          return -1;
        }).filter(index => index >= 0);
      }
      if (summaryCells.length) {
        that._footerItems.push({
          rowType: DATAGRID_TOTAL_FOOTER_ROW_TYPE,
          summaryCells
        });
      }
    }
    super._updateItemsCore(change);
  }
  _prepareUnsavedDataSelector(selector) {
    if (recalculateWhileEditing(this)) {
      const editingController = this._editingController;
      if (editingController) {
        return function (data) {
          data = editingController.getUpdatedData(data);
          return selector(data);
        };
      }
    }
    return selector;
  }
  _prepareAggregateSelector(selector, aggregator) {
    selector = this._prepareUnsavedDataSelector(selector);
    if (aggregator === 'avg' || aggregator === 'sum') {
      return function (data) {
        const value = selector(data);
        return (0, _type.isDefined)(value) ? Number(value) : value;
      };
    }
    return selector;
  }
  _getAggregates(summaryItems, remoteOperations) {
    const that = this;
    let calculateCustomSummary = that.option('summary.calculateCustomSummary');
    const commonSkipEmptyValues = that.option('summary.skipEmptyValues');
    return (0, _iterator.map)(summaryItems || [], summaryItem => {
      const column = this._columnsController.columnOption(summaryItem.column);
      const calculateCellValue = column && column.calculateCellValue ? column.calculateCellValue.bind(column) : (0, _data.compileGetter)(column ? column.dataField : summaryItem.column);
      let aggregator = summaryItem.summaryType || 'count';
      const skipEmptyValues = (0, _type.isDefined)(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;
      if (remoteOperations) {
        return {
          selector: summaryItem.column,
          summaryType: aggregator
        };
      }
      const selector = that._prepareAggregateSelector(calculateCellValue, aggregator);
      if (aggregator === 'custom') {
        if (!calculateCustomSummary) {
          _ui.default.log('E1026');
          calculateCustomSummary = function () {};
        }
        const options = {
          component: that.component,
          name: summaryItem.name
        };
        calculateCustomSummary(options);
        options.summaryProcess = 'calculate';
        aggregator = {
          seed(groupIndex) {
            options.summaryProcess = 'start';
            options.totalValue = undefined;
            options.groupIndex = groupIndex;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          step(totalValue, value) {
            options.summaryProcess = 'calculate';
            options.totalValue = totalValue;
            options.value = value;
            calculateCustomSummary(options);
            return options.totalValue;
          },
          finalize(totalValue) {
            options.summaryProcess = 'finalize';
            options.totalValue = totalValue;
            delete options.value;
            calculateCustomSummary(options);
            return options.totalValue;
          }
        };
      }
      return {
        selector,
        aggregator,
        skipEmptyValues
      };
    });
  }
  _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
    if (groupColumn) {
      const {
        groupIndex
      } = groupColumn;
      sortOrder = sortOrder || groupColumn.sortOrder;
      if ((0, _type.isDefined)(groupIndex)) {
        sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
        sortByGroups[groupIndex].push({
          selector,
          desc: sortOrder === 'desc'
        });
      }
    }
  }
  _findSummaryItem(summaryItems, name) {
    let summaryItemIndex = -1;
    const getFullName = function (summaryItem) {
      const {
        summaryType
      } = summaryItem;
      const {
        column
      } = summaryItem;
      return summaryType && column && `${summaryType}_${column}`;
    };
    if ((0, _type.isDefined)(name)) {
      // @ts-expect-error
      (0, _iterator.each)(summaryItems || [], function (index) {
        if (this.name === name || index === name || this.summaryType === name || this.column === name || getFullName(this) === name) {
          summaryItemIndex = index;
          return false;
        }
      });
    }
    return summaryItemIndex;
  }
  _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
    const that = this;
    const columnsController = that._columnsController;
    const groupColumns = columnsController.getGroupColumns();
    const sortByGroups = [];
    if (!groupSummaryItems || !groupSummaryItems.length) return;
    (0, _iterator.each)(sortByGroupSummaryInfo || [], function () {
      const {
        sortOrder
      } = this;
      let {
        groupColumn
      } = this;
      const summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);
      if (summaryItemIndex < 0) return;
      const selector = function (data) {
        return getGroupAggregates(data)[summaryItemIndex];
      };
      if ((0, _type.isDefined)(groupColumn)) {
        groupColumn = columnsController.columnOption(groupColumn);
        that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
      } else {
        (0, _iterator.each)(groupColumns, (groupIndex, groupColumn) => {
          that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder);
        });
      }
    });
    return sortByGroups;
  }
  _createDataSourceAdapterCore(dataSource, remoteOperations) {
    const that = this;
    const dataSourceAdapter = super._createDataSourceAdapterCore(dataSource, remoteOperations);
    dataSourceAdapter.summaryGetter(currentRemoteOperations => that._getSummaryOptions(currentRemoteOperations || remoteOperations));
    return dataSourceAdapter;
  }
  _getSummaryOptions(remoteOperations) {
    const that = this;
    const groupSummaryItems = that.option('summary.groupItems');
    const totalSummaryItems = that.option('summary.totalItems');
    const sortByGroupSummaryInfo = that.option('sortByGroupSummaryInfo');
    const groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);
    const totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);
    const sortByGroups = function () {
      return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems);
    };
    if (groupAggregates.length || totalAggregates.length) {
      return {
        groupAggregates,
        totalAggregates,
        sortByGroups
      };
    }
    return undefined;
  }
  publicMethods() {
    const methods = super.publicMethods();
    methods.push('getTotalSummaryValue');
    return methods;
  }
  getTotalSummaryValue(summaryItemName) {
    const summaryItemIndex = this._findSummaryItem(this.option('summary.totalItems'), summaryItemName);
    const aggregates = this._dataSource.totalAggregates();
    if (aggregates.length && summaryItemIndex > -1) {
      return aggregates[summaryItemIndex];
    }
  }
  optionChanged(args) {
    if (args.name === 'summary' || args.name === 'sortByGroupSummaryInfo') {
      args.name = 'dataSource';
    }
    super.optionChanged(args);
  }
  init() {
    this._footerItems = [];
    super.init();
  }
  footerItems() {
    return this._footerItems;
  }
};
const editing = Base => class SummaryEditingController extends Base {
  _refreshSummary() {
    if (recalculateWhileEditing(this) && !this.isSaving()) {
      this._dataController.refresh({
        load: true,
        changesOnly: true
      });
    }
  }
  _addChange(params) {
    // @ts-expect-error
    const result = super._addChange.apply(this, arguments);
    if (params.type) {
      this._refreshSummary();
    }
    return result;
  }
  _removeChange() {
    // @ts-expect-error
    const result = super._removeChange.apply(this, arguments);
    this._refreshSummary();
    return result;
  }
  cancelEditData() {
    // @ts-expect-error
    const result = super.cancelEditData.apply(this, arguments);
    this._refreshSummary();
    return result;
  }
};
const rowsView = Base => class SummaryRowsViewExtender extends Base {
  _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);
    row && $row.addClass(row.rowType === DATAGRID_GROUP_FOOTER_ROW_TYPE ? DATAGRID_GROUP_FOOTER_CLASS : '');
    return $row;
  }
  _renderCells($row, options) {
    // @ts-expect-error
    super._renderCells.apply(this, arguments);
    if (options.row.rowType === 'group' && options.row.summaryCells && options.row.summaryCells.length) {
      this._renderGroupSummaryCells($row, options);
    }
  }
  _hasAlignByColumnSummaryItems(columnIndex, options) {
    return !(0, _type.isDefined)(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length;
  }
  _getAlignByColumnCellCount(groupCellColSpan, options) {
    let alignByColumnCellCount = 0;
    for (let i = 1; i < groupCellColSpan; i++) {
      const columnIndex = options.row.summaryCells.length - i;
      alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount;
    }
    return alignByColumnCellCount;
  }
  _renderGroupSummaryCells($row, options) {
    const $groupCell = $row.children().last();
    const groupCellColSpan = Number($groupCell.attr('colSpan')) || 1;
    const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
    this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
  }
  _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    if (alignByColumnCellCount > 0) {
      $groupCell.attr('colSpan', groupCellColSpan - alignByColumnCellCount);
      for (let i = 0; i < alignByColumnCellCount; i++) {
        const columnIndex = options.columns.length - alignByColumnCellCount + i;
        this._renderCell($groupCell.parent(), (0, _extend.extend)({
          column: options.columns[columnIndex],
          columnIndex: this._getSummaryCellIndex(columnIndex, options.columns)
        }, options));
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getSummaryCellIndex(columnIndex, columns) {
    return columnIndex;
  }
  _getCellTemplate(options) {
    if (!options.column.command && !(0, _type.isDefined)(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
      return renderSummaryCell;
    }
    return super._getCellTemplate(options);
  }
  _getCellOptions(options) {
    const that = this;
    const parameters = super._getCellOptions(options);
    if (options.row.summaryCells) {
      return (0, _extend.extend)(parameters, getSummaryCellOptions(that, options));
    }
    return parameters;
  }
};
_m_core.default.registerModule('summary', {
  defaultOptions() {
    return {
      summary: {
        groupItems: undefined,
        totalItems: undefined,
        calculateCustomSummary: undefined,
        skipEmptyValues: true,
        recalculateWhileEditing: false,
        texts: {
          sum: _message.default.format('dxDataGrid-summarySum'),
          sumOtherColumn: _message.default.format('dxDataGrid-summarySumOtherColumn'),
          min: _message.default.format('dxDataGrid-summaryMin'),
          minOtherColumn: _message.default.format('dxDataGrid-summaryMinOtherColumn'),
          max: _message.default.format('dxDataGrid-summaryMax'),
          maxOtherColumn: _message.default.format('dxDataGrid-summaryMaxOtherColumn'),
          avg: _message.default.format('dxDataGrid-summaryAvg'),
          avgOtherColumn: _message.default.format('dxDataGrid-summaryAvgOtherColumn'),
          count: _message.default.format('dxDataGrid-summaryCount')
        }
      },
      sortByGroupSummaryInfo: undefined
    };
  },
  views: {
    footerView: FooterView
  },
  extenders: {
    controllers: {
      data,
      editing
    },
    views: {
      rowsView
    }
  }
});