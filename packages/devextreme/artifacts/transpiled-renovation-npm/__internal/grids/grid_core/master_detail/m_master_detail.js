"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.masterDetailModule = exports.dataMasterDetailExtenderMixin = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

// @ts-expect-error

const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const ROW_LINES_CLASS = 'dx-row-lines';
const columns = Base => class ColumnsMasterDetailExtender extends Base {
  _getExpandColumnsCore() {
    const expandColumns = super._getExpandColumnsCore();
    if (this.option('masterDetail.enabled')) {
      expandColumns.push({
        type: 'detailExpand',
        cellTemplate: _m_utils.default.getExpandCellTemplate()
      });
    }
    return expandColumns;
  }
};
const initMasterDetail = function (that) {
  that._expandedItems = [];
  that._isExpandAll = that.option('masterDetail.autoExpandAll');
};
const dataMasterDetailExtenderMixin = Base => class DataMasterDetailExtender extends Base {
  init() {
    const that = this;
    initMasterDetail(that);
    super.init();
  }
  expandAll(groupIndex) {
    const that = this;
    if (groupIndex < 0) {
      that._isExpandAll = true;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.expandAll.apply(that, arguments);
    }
  }
  collapseAll(groupIndex) {
    const that = this;
    if (groupIndex < 0) {
      that._isExpandAll = false;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.collapseAll.apply(that, arguments);
    }
  }
  isRowExpandedHack() {
    // @ts-expect-error
    return super.isRowExpanded.apply(this, arguments);
  }
  isRowExpanded(key) {
    const that = this;
    const expandIndex = _m_utils.default.getIndexByKey(key, that._expandedItems);
    if (Array.isArray(key)) {
      // @ts-expect-error
      return super.isRowExpanded.apply(that, arguments);
    }
    return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
  }
  _getRowIndicesForExpand(key) {
    const rowIndex = this.getRowIndexByKey(key);
    return [rowIndex, rowIndex + 1];
  }
  _changeRowExpandCore(key) {
    const that = this;
    let result;
    if (Array.isArray(key)) {
      // @ts-expect-error
      result = super._changeRowExpandCore.apply(that, arguments);
    } else {
      const expandIndex = _m_utils.default.getIndexByKey(key, that._expandedItems);
      if (expandIndex >= 0) {
        const {
          visible
        } = that._expandedItems[expandIndex];
        that._expandedItems[expandIndex].visible = !visible;
      } else {
        that._expandedItems.push({
          key,
          visible: true
        });
      }
      that.updateItems({
        changeType: 'update',
        rowIndices: that._getRowIndicesForExpand(key)
      });
      // @ts-expect-error
      result = new _deferred.Deferred().resolve();
    }
    return result;
  }
  _processDataItemHack() {
    return super._processDataItem.apply(this, arguments);
  }
  _processDataItem(data, options) {
    const that = this;
    const dataItem = super._processDataItem.apply(that, arguments);
    dataItem.isExpanded = that.isRowExpanded(dataItem.key);
    if (options.detailColumnIndex === undefined) {
      options.detailColumnIndex = -1;
      (0, _iterator.each)(options.visibleColumns, (index, column) => {
        if (column.command === 'expand' && !(0, _type.isDefined)(column.groupIndex)) {
          options.detailColumnIndex = index;
          return false;
        }
        return undefined;
      });
    }
    if (options.detailColumnIndex >= 0) {
      dataItem.values[options.detailColumnIndex] = dataItem.isExpanded;
    }
    return dataItem;
  }
  _processItemsHack() {
    return super._processItems.apply(this, arguments);
  }
  _processItems(items, change) {
    const that = this;
    const {
      changeType
    } = change;
    const result = [];
    items = super._processItems.apply(that, arguments);
    if (changeType === 'loadingAll') {
      return items;
    }
    if (changeType === 'refresh') {
      that._expandedItems = (0, _common.grep)(that._expandedItems, item => item.visible);
    }
    (0, _iterator.each)(items, (index, item) => {
      result.push(item);
      const expandIndex = _m_utils.default.getIndexByKey(item.key, that._expandedItems);
      if (item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
        result.push({
          visible: item.isExpanded,
          rowType: 'detail',
          key: item.key,
          data: item.data,
          values: []
        });
      }
    });
    return result;
  }
  optionChanged(args) {
    const that = this;
    let isEnabledChanged;
    let isAutoExpandAllChanged;
    if (args.name === 'masterDetail') {
      args.name = 'dataSource';
      // eslint-disable-next-line default-case
      switch (args.fullName) {
        case 'masterDetail':
          {
            const value = args.value || {};
            const previousValue = args.previousValue || {};
            isEnabledChanged = value.enabled !== previousValue.enabled;
            isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
            break;
          }
        case 'masterDetail.template':
          {
            initMasterDetail(that);
            break;
          }
        case 'masterDetail.enabled':
          isEnabledChanged = true;
          break;
        case 'masterDetail.autoExpandAll':
          isAutoExpandAllChanged = true;
          break;
      }
      if (isEnabledChanged || isAutoExpandAllChanged) {
        initMasterDetail(that);
      }
    }
    super.optionChanged(args);
  }
};
exports.dataMasterDetailExtenderMixin = dataMasterDetailExtenderMixin;
const resizing = Base => class ResizingMasterDetailExtender extends Base {
  fireContentReadyAction() {
    super.fireContentReadyAction.apply(this, arguments);
    this._updateParentDataGrids(this.component.$element());
  }
  _updateParentDataGrids($element) {
    const $masterDetailRow = $element.closest(`.${MASTER_DETAIL_ROW_CLASS}`);
    if ($masterDetailRow.length) {
      (0, _deferred.when)(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
        this._updateParentDataGrids($masterDetailRow.parent());
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateMasterDataGrid($masterDetailRow, $detailElement) {
    const masterRowOptions = (0, _renderer.default)($masterDetailRow).data('options');
    const masterDataGrid = (0, _renderer.default)($masterDetailRow).closest(`.${this.getWidgetContainerClass()}`).parent().data('dxDataGrid');
    if (masterRowOptions && masterDataGrid) {
      return this._updateMasterDataGridCore(masterDataGrid, masterRowOptions);
    }
    return undefined;
  }
  _updateMasterDataGridCore(masterDataGrid, masterRowOptions) {
    const d = (0, _deferred.Deferred)();
    if (masterDataGrid.getView('rowsView').isFixedColumns()) {
      // @ts-expect-error
      this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, (0, _renderer.default)(masterRowOptions.rowElement)).done(d.resolve);
    } else {
      if (masterDataGrid.option('scrolling.useNative') === true) {
        masterDataGrid.updateDimensions().done(() => d.resolve(true));
        return;
      }
      const scrollable = masterDataGrid.getScrollable();
      if (scrollable) {
        // T607490
        scrollable === null || scrollable === void 0 || scrollable.update().done(() => d.resolve());
      } else {
        d.resolve();
      }
    }
    return d.promise();
  }
  _updateFixedMasterDetailGrids(masterDataGrid, masterRowIndex, $detailElement) {
    const d = (0, _deferred.Deferred)();
    const $rows = (0, _renderer.default)(masterDataGrid.getRowElement(masterRowIndex));
    const $tables = (0, _renderer.default)(masterDataGrid.getView('rowsView').getTableElements());
    const rowsNotEqual = ($rows === null || $rows === void 0 ? void 0 : $rows.length) === 2 && (0, _size.getHeight)($rows.eq(0)) !== (0, _size.getHeight)($rows.eq(1));
    const tablesNotEqual = ($tables === null || $tables === void 0 ? void 0 : $tables.length) === 2 && (0, _size.getHeight)($tables.eq(0)) !== (0, _size.getHeight)($tables.eq(1));
    if (rowsNotEqual || tablesNotEqual) {
      const detailElementWidth = (0, _size.getWidth)($detailElement);
      masterDataGrid.updateDimensions().done(() => {
        const isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
        const isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== (0, _size.getWidth)($detailElement);
        if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
          this.updateDimensions().done(() => d.resolve(true));
        } else {
          d.resolve(true);
        }
      });
      return d.promise();
    }
    return (0, _deferred.Deferred)().resolve();
  }
  _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode.apply(this, arguments);
    if (this.option('masterDetail.template')) {
      const $rowsTable = this._rowsView.getTableElement();
      if ($rowsTable) {
        $rowsTable.find('.dx-master-detail-cell').css('maxWidth', isBestFit ? 0 : '');
      }
    }
  }
};
const rowsView = Base => class RowsViewMasterDetailExtender extends Base {
  _getCellTemplate(options) {
    const that = this;
    const {
      column
    } = options;
    const editingController = this._editingController;
    const isEditRow = editingController && editingController.isEditRow(options.rowIndex);
    let template;
    if (column.command === 'detail' && !isEditRow) {
      template = that.option('masterDetail.template') || {
        allowRenderToDetachedContainer: false,
        render: that._getDefaultTemplate(column)
      };
    } else {
      template = super._getCellTemplate.apply(that, arguments);
    }
    return template;
  }
  _isDetailRow(row) {
    return row && row.rowType && row.rowType.indexOf('detail') === 0;
  }
  _createRow(row) {
    const $row = super._createRow.apply(this, arguments);
    if (row && this._isDetailRow(row)) {
      this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
      $row.addClass(MASTER_DETAIL_ROW_CLASS);
      if ((0, _type.isDefined)(row.visible)) {
        $row.toggle(row.visible);
      }
    }
    return $row;
  }
  _renderCells($row, options) {
    const {
      row
    } = options;
    let $detailCell;
    const visibleColumns = this._columnsController.getVisibleColumns();
    if (row.rowType && this._isDetailRow(row)) {
      if (this._needRenderCell(0, options.columnIndices)) {
        $detailCell = this._renderCell($row, {
          value: null,
          row,
          rowIndex: row.rowIndex,
          column: {
            command: 'detail'
          },
          columnIndex: 0,
          change: options.change
        });
        $detailCell.addClass(CELL_FOCUS_DISABLED_CLASS).addClass(MASTER_DETAIL_CELL_CLASS).attr('colSpan', visibleColumns.length);
        const isEditForm = row.isEditing;
        if (!isEditForm) {
          $detailCell.attr('aria-roledescription', _message.default.format('dxDataGrid-masterDetail'));
        }
      }
    } else {
      super._renderCells.apply(this, arguments);
    }
  }
};
const masterDetailModule = exports.masterDetailModule = {
  defaultOptions() {
    return {
      masterDetail: {
        enabled: false,
        autoExpandAll: false,
        template: null
      }
    };
  },
  extenders: {
    controllers: {
      columns,
      data: dataMasterDetailExtenderMixin,
      resizing
    },
    views: {
      rowsView
    }
  }
};