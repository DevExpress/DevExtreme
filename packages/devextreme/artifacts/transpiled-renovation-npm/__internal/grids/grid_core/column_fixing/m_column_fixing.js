"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columnFixingModule = void 0;
var _translator = require("../../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _wheel = require("../../../../events/core/wheel");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */
// TODO Move DataGrid's summary methods to the DataGrid
// TODO Move virtual scrolling related methods to the virtual_scrolling

const CONTENT_CLASS = 'content';
const CONTENT_FIXED_CLASS = 'content-fixed';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const FIRST_CELL_CLASS = 'dx-first-cell';
const LAST_CELL_CLASS = 'dx-last-cell';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FIXED_COL_CLASS = 'dx-col-fixed';
const FIXED_COLUMNS_CLASS = 'dx-fixed-columns';
const POINTER_EVENTS_NONE_CLASS = 'dx-pointer-events-none';
const COMMAND_TRANSPARENT = 'transparent';
const GROUP_ROW_CLASS = 'dx-group-row';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const getTransparentColumnIndex = function (fixedColumns) {
  let transparentColumnIndex = -1;
  (0, _iterator.each)(fixedColumns, (index, column) => {
    if (column.command === COMMAND_TRANSPARENT) {
      transparentColumnIndex = index;
      return false;
    }
    return undefined;
  });
  return transparentColumnIndex;
};
const normalizeColumnWidths = function (fixedColumns, widths, fixedWidths) {
  let fixedColumnIndex = 0;
  if (fixedColumns && widths && fixedWidths) {
    for (let i = 0; i < fixedColumns.length; i++) {
      if (fixedColumns[i].command === COMMAND_TRANSPARENT) {
        fixedColumnIndex += fixedColumns[i].colspan;
      } else {
        if (widths[fixedColumnIndex] < fixedWidths[i]) {
          widths[fixedColumnIndex] = fixedWidths[i];
        }
        fixedColumnIndex++;
      }
    }
  }
  return widths;
};
// View
const baseFixedColumns = Base => class BaseFixedColumnsExtender extends Base {
  init() {
    super.init();
    this._isFixedTableRendering = false;
    this._isFixedColumns = false;
  }
  _createCol(column) {
    return super._createCol(column).toggleClass(FIXED_COL_CLASS, !!(this._isFixedTableRendering && (column.fixed || column.command && column.command !== COMMAND_TRANSPARENT)));
  }
  _correctColumnIndicesForFixedColumns(fixedColumns, change) {
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColspan = fixedColumns[transparentColumnIndex].colspan;
    const columnIndices = change && change.columnIndices;
    if (columnIndices) {
      change.columnIndices = columnIndices.map(columnIndices => {
        if (columnIndices) {
          return columnIndices.map(columnIndex => {
            if (columnIndex < transparentColumnIndex) {
              return columnIndex;
            }
            if (columnIndex >= transparentColumnIndex + transparentColspan) {
              return columnIndex - transparentColspan + 1;
            }
            return -1;
          }).filter(columnIndex => columnIndex >= 0);
        }
      });
    }
  }
  _partialUpdateFixedTable(fixedColumns, rows) {
    const fixedTableElement = this._fixedTableElement;
    const $rows = this._getRowElementsCore(fixedTableElement);
    const $colgroup = fixedTableElement.children('colgroup');
    $colgroup.replaceWith(this._createColGroup(fixedColumns));
    for (let i = 0; i < rows.length; i++) {
      this._partialUpdateFixedRow((0, _renderer.default)($rows[i]), fixedColumns, rows[i]);
    }
  }
  _partialUpdateFixedRow($row, fixedColumns, row) {
    const cellElements = $row.get(0).childNodes;
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const transparentColumn = fixedColumns[transparentColumnIndex];
    const columnIndexOffset = this._columnsController.getColumnIndexOffset();
    let groupCellOptions;
    let colIndex = columnIndexOffset + 1;
    let {
      colspan
    } = transparentColumn;
    if ($row.hasClass(DETAIL_ROW_CLASS)) {
      var _this$_columnsControl;
      cellElements[0].setAttribute('colspan', (_this$_columnsControl = this._columnsController.getVisibleColumns()) === null || _this$_columnsControl === void 0 ? void 0 : _this$_columnsControl.length);
      return;
    }
    if ($row.hasClass(GROUP_ROW_CLASS)) {
      // @ts-expect-error RowsView's method
      groupCellOptions = this._getGroupCellOptions({
        row,
        columns: this._columnsController.getVisibleColumns()
      });
      const hasSummary = row.summaryCells.length > 0;
      if (hasSummary) {
        // @ts-expect-error RowsView's method
        const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellOptions.colspan, {
          columns: this._columnsController.getVisibleColumns(),
          row,
          isFixed: true
        });
        colspan = groupCellOptions.colspan - alignByColumnCellCount;
      } else {
        colspan = groupCellOptions.colspan - Math.max(0, cellElements.length - (groupCellOptions.columnIndex + 2));
      }
    }
    for (let j = 0; j < cellElements.length; j++) {
      const needUpdateColspan = groupCellOptions ? j === groupCellOptions.columnIndex + 1 : j === transparentColumnIndex;
      cellElements[j].setAttribute('aria-colindex', colIndex);
      if (needUpdateColspan) {
        cellElements[j].setAttribute('colspan', colspan);
        colIndex += colspan;
      } else {
        colIndex++;
      }
    }
  }
  _renderTable(options) {
    let $fixedTable;
    const fixedColumns = this.getFixedColumns();
    this._isFixedColumns = !!fixedColumns.length;
    const $table = super._renderTable(options);
    if (this._isFixedColumns) {
      var _change$items;
      const change = options === null || options === void 0 ? void 0 : options.change;
      const $fixedDataRows = this._getRowElements(this._fixedTableElement);
      const needPartialUpdate = (change === null || change === void 0 ? void 0 : change.virtualColumnsScrolling) && $fixedDataRows.length === (change === null || change === void 0 || (_change$items = change.items) === null || _change$items === void 0 ? void 0 : _change$items.length);
      this._isFixedTableRendering = true;
      if (needPartialUpdate && this.option('scrolling.legacyMode') !== true) {
        var _options$change;
        this._partialUpdateFixedTable(fixedColumns, options === null || options === void 0 || (_options$change = options.change) === null || _options$change === void 0 ? void 0 : _options$change.items);
        this._isFixedTableRendering = false;
      } else {
        const columnIndices = change === null || change === void 0 ? void 0 : change.columnIndices;
        this._correctColumnIndicesForFixedColumns(fixedColumns, change);
        $fixedTable = this._createTable(fixedColumns);
        this._renderRows($fixedTable, (0, _extend.extend)({}, options, {
          columns: fixedColumns
        }));
        this._updateContent($fixedTable, change, true);
        if (columnIndices) {
          change.columnIndices = columnIndices;
        }
        this._isFixedTableRendering = false;
      }
    } else {
      this._fixedTableElement && this._fixedTableElement.parent().remove();
      this._fixedTableElement = null;
    }
    return $table;
  }
  _renderRow($table, options) {
    let fixedCorrection;
    let {
      cells
    } = options.row;
    super._renderRow.apply(this, arguments);
    if (this._isFixedTableRendering && cells && cells.length) {
      fixedCorrection = 0;
      const fixedCells = options.row.cells || [];
      cells = cells.slice();
      options.row.cells = cells;
      for (let i = 0; i < fixedCells.length; i++) {
        if (fixedCells[i].column && fixedCells[i].column.command === COMMAND_TRANSPARENT) {
          fixedCorrection = (fixedCells[i].column.colspan || 1) - 1;
          continue;
        }
        cells[i + fixedCorrection] = fixedCells[i];
      }
    }
  }
  _createCell(options) {
    const that = this;
    const {
      column
    } = options;
    const columnCommand = column && column.command;
    const {
      rowType
    } = options;
    const $cell = super._createCell.apply(that, arguments);
    let fixedColumns;
    let prevFixedColumn;
    let transparentColumnIndex;
    if (that._isFixedTableRendering || rowType === 'filter') {
      fixedColumns = that.getFixedColumns();
      transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
      prevFixedColumn = fixedColumns[transparentColumnIndex - 1];
    }
    if (that._isFixedTableRendering) {
      if (columnCommand === COMMAND_TRANSPARENT) {
        $cell.addClass(POINTER_EVENTS_NONE_CLASS).toggleClass(FIRST_CELL_CLASS, transparentColumnIndex === 0 || prevFixedColumn && prevFixedColumn.command === 'expand').toggleClass(LAST_CELL_CLASS, fixedColumns.length && transparentColumnIndex === fixedColumns.length - 1);
        if (rowType !== 'freeSpace') {
          _m_utils.default.setEmptyText($cell);
        }
      }
    } else if (rowType === 'filter') {
      $cell.toggleClass(FIRST_CELL_CLASS, options.columnIndex === transparentColumnIndex);
    }
    const isRowAltStyle = that.option('rowAlternationEnabled') && options.isAltRow;
    const isSelectAllCell = that.option('selection.mode') === 'multiple' && options.columnIndex === 0 && options.rowType === 'header';
    // T823783, T852898, T865179, T875201, T1120812
    if (_browser.default.mozilla && options.column.fixed && options.rowType !== 'group' && !isRowAltStyle && !isSelectAllCell) {
      $cell.addClass(FIXED_COL_CLASS);
    }
    return $cell;
  }
  _getContent(isFixedTableRendering) {
    var _this$_fixedTableElem;
    return isFixedTableRendering ? (_this$_fixedTableElem = this._fixedTableElement) === null || _this$_fixedTableElem === void 0 ? void 0 : _this$_fixedTableElem.parent() : super._getContent.apply(this, arguments);
  }
  _wrapTableInScrollContainer($table, isFixedTableRendering) {
    const $scrollContainer = super._wrapTableInScrollContainer.apply(this, arguments);
    if (this._isFixedTableRendering || isFixedTableRendering) {
      $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_FIXED_CLASS));
    }
    return $scrollContainer;
  }
  _renderCellContent($cell, options) {
    let isEmptyCell;
    const {
      column
    } = options;
    const isFixedTableRendering = this._isFixedTableRendering;
    const isGroupCell = options.rowType === 'group' && (0, _type.isDefined)(column.groupIndex);
    // T747718, T824508, T821252
    if (isFixedTableRendering && isGroupCell && !column.command && !column.groupCellTemplate) {
      $cell.css('pointerEvents', 'none');
    }
    if (!isFixedTableRendering && this._isFixedColumns) {
      isEmptyCell = column.fixed || column.command && column.fixed !== false;
      if (isGroupCell) {
        isEmptyCell = false;
        if (options.row.summaryCells && options.row.summaryCells.length) {
          var _this$_getAlignByColu;
          const columns = this._columnsController.getVisibleColumns();
          // @ts-expect-error DataGrid's method
          const alignByFixedColumnCellCount = ((_this$_getAlignByColu = this._getAlignByColumnCellCount) === null || _this$_getAlignByColu === void 0 ? void 0 : _this$_getAlignByColu.call(this, column.colspan, {
            columns,
            row: options.row,
            isFixed: true
          })) ?? 0;
          if (alignByFixedColumnCellCount > 0) {
            const transparentColumnIndex = getTransparentColumnIndex(this._columnsController.getFixedColumns());
            isEmptyCell = columns.length - alignByFixedColumnCellCount < transparentColumnIndex;
          }
        }
      }
      if (isEmptyCell) {
        if (column.command && column.type !== 'buttons' || options.rowType === 'group') {
          $cell.html('&nbsp;').addClass(column.cssClass);
          return;
        }
        $cell.addClass('dx-hidden-cell');
      }
    }
    if (column.command !== COMMAND_TRANSPARENT) {
      super._renderCellContent.apply(this, arguments);
    }
  }
  _getCellElementsCore(rowIndex) {
    const cellElements = super._getCellElementsCore.apply(this, arguments);
    const isGroupRow = cellElements === null || cellElements === void 0 ? void 0 : cellElements.parent().hasClass(GROUP_ROW_CLASS);
    const headerRowIndex = this.name === 'columnHeadersView' ? rowIndex : undefined; // TODO
    if (this._fixedTableElement && cellElements) {
      const fixedColumns = this.getFixedColumns(headerRowIndex);
      const fixedCellElements = this._getRowElements(this._fixedTableElement).eq(rowIndex).children('td');
      (0, _iterator.each)(fixedCellElements, (columnIndex, cell) => {
        if (isGroupRow) {
          if (cellElements[columnIndex] && cell.style.visibility !== 'hidden') {
            cellElements[columnIndex] = cell;
          }
        } else {
          const fixedColumn = fixedColumns[columnIndex];
          if (fixedColumn) {
            if (fixedColumn.command === COMMAND_TRANSPARENT) {
              if (fixedCellElements.eq(columnIndex).hasClass(MASTER_DETAIL_CELL_CLASS)) {
                cellElements[columnIndex] = cell || cellElements[columnIndex];
              }
            } else {
              const fixedColumnIndex = this._columnsController.getVisibleIndexByColumn(fixedColumn, headerRowIndex);
              cellElements[fixedColumnIndex] = cell || cellElements[fixedColumnIndex];
            }
          }
        }
      });
    }
    return cellElements;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getColumnWidths(fixedTableElement) {
    const result = super.getColumnWidths();
    const fixedColumns = this.getFixedColumns();
    const fixedWidths = this._fixedTableElement && result.length ? super.getColumnWidths(this._fixedTableElement) : undefined;
    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }
  getTableElement(isFixedTableRendering) {
    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
    const tableElement = isFixedTableRendering ? this._fixedTableElement : super.getTableElement();
    return tableElement;
  }
  setTableElement(tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      this._fixedTableElement = tableElement.addClass(POINTER_EVENTS_NONE_CLASS);
    } else {
      super.setTableElement(tableElement);
    }
  }
  getColumns(rowIndex) {
    const $tableElement = this.getTableElement();
    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }
    return super.getColumns(rowIndex, $tableElement);
  }
  getRowIndex($row) {
    const $fixedTable = this._fixedTableElement;
    if ($fixedTable && $fixedTable.find($row).length) {
      return this._getRowElements($fixedTable).index($row);
    }
    return super.getRowIndex($row);
  }
  getTableElements() {
    let result = super.getTableElements.apply(this, arguments);
    if (this._fixedTableElement) {
      result = (0, _renderer.default)([result.get(0), this._fixedTableElement.get(0)]);
    }
    return result;
  }
  getFixedColumns(rowIndex) {
    return this._columnsController.getFixedColumns(rowIndex);
  }
  getFixedColumnsOffset() {
    let offset = {
      left: 0,
      right: 0
    };
    let $transparentColumn;
    if (this._fixedTableElement) {
      $transparentColumn = this.getTransparentColumnElement();
      const positionTransparentColumn = $transparentColumn.position();
      offset = {
        left: positionTransparentColumn.left,
        right: (0, _size.getOuterWidth)(this.element(), true) - ((0, _size.getOuterWidth)($transparentColumn, true) + positionTransparentColumn.left)
      };
    }
    return offset;
  }
  getTransparentColumnElement() {
    return this._fixedTableElement && this._fixedTableElement.find(`.${POINTER_EVENTS_NONE_CLASS}`).first();
  }
  getFixedTableElement() {
    return this._fixedTableElement;
  }
  isFixedColumns() {
    return this._isFixedColumns;
  }
  _resizeCore() {
    super._resizeCore();
    this.synchronizeRows();
  }
  setColumnWidths(options) {
    var _options$optionNames;
    const {
      widths
    } = options;
    const visibleColumns = this._columnsController.getVisibleColumns();
    const isColumnWidthsSynced = (widths === null || widths === void 0 ? void 0 : widths.length) && visibleColumns.some(column => (0, _type.isDefined)(column.visibleWidth));
    const isColumnWidthChanged = (_options$optionNames = options.optionNames) === null || _options$optionNames === void 0 ? void 0 : _options$optionNames.width;
    super.setColumnWidths(options);
    if (this._fixedTableElement) {
      const hasAutoWidth = widths === null || widths === void 0 ? void 0 : widths.some(width => width === 'auto' || !(0, _type.isDefined)(width));
      // if order of calling isScrollbarVisible changed, performance tests will fail
      const needVisibleColumns = hasAutoWidth && (!isColumnWidthsSynced || !this.isScrollbarVisible(true));
      const columns = needVisibleColumns ? visibleColumns : this.getFixedColumns();
      this.setFixedTableColumnWidths(columns, widths);
    }
    const wordWrapEnabled = this.option('wordWrapEnabled');
    const needSynchronizeRows = isColumnWidthsSynced || isColumnWidthChanged && wordWrapEnabled;
    if (needSynchronizeRows) {
      this.synchronizeRows();
    }
  }
  setFixedTableColumnWidths(columns, widths) {
    if (!this._fixedTableElement || !widths) {
      return;
    }
    const $cols = this._fixedTableElement.children('colgroup').children('col');
    $cols.toArray().forEach(col => col.removeAttribute('style'));
    let columnIndex = 0;
    columns.forEach(column => {
      if (column.colspan) {
        columnIndex += column.colspan;
        return;
      }
      const colWidth = (0, _m_columns_view.normalizeWidth)(widths[columnIndex]);
      if ((0, _type.isDefined)(colWidth)) {
        (0, _style.setWidth)($cols.eq(columnIndex), colWidth);
      }
      columnIndex += 1;
    });
  }
  _getClientHeight(element) {
    const boundingClientRectElement = element.getBoundingClientRect && (0, _position.getBoundingRect)(element);
    return boundingClientRectElement && boundingClientRectElement.height ? boundingClientRectElement.height : element.clientHeight;
  }
  synchronizeRows() {
    const rowHeights = [];
    const fixedRowHeights = [];
    let rowIndex;
    let $rowElements;
    let $fixedRowElements;
    let $contentElement;
    this.waitAsyncTemplates(true).done(() => {
      if (this._isFixedColumns && this._tableElement && this._fixedTableElement) {
        const heightTable = this._getClientHeight(this._tableElement.get(0));
        const heightFixedTable = this._getClientHeight(this._fixedTableElement.get(0));
        $rowElements = this._getRowElements(this._tableElement);
        $fixedRowElements = this._getRowElements(this._fixedTableElement);
        $contentElement = this._findContentElement();
        if (heightTable !== heightFixedTable) {
          $contentElement && $contentElement.css('height', heightTable);
          $rowElements.css('height', '');
          $fixedRowElements.css('height', '');
          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            rowHeights.push(this._getClientHeight($rowElements.get(rowIndex)));
            fixedRowHeights.push(this._getClientHeight($fixedRowElements.get(rowIndex)));
          }
          for (rowIndex = 0; rowIndex < $rowElements.length; rowIndex++) {
            const rowHeight = rowHeights[rowIndex];
            const fixedRowHeight = fixedRowHeights[rowIndex];
            if (rowHeight > fixedRowHeight) {
              $fixedRowElements.eq(rowIndex).css('height', rowHeight);
            } else if (rowHeight < fixedRowHeight) {
              $rowElements.eq(rowIndex).css('height', fixedRowHeight);
            }
          }
          $contentElement && $contentElement.css('height', '');
        }
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setScrollerSpacing(width, hWidth) {
    const rtlEnabled = this.option('rtlEnabled');
    super.setScrollerSpacing(width);
    this.element().children(`.${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`).css({
      paddingLeft: rtlEnabled ? width : '',
      paddingRight: !rtlEnabled ? width : ''
    });
  }
};
const columnHeadersView = Base => class ColumnHeadersViewFixedColumnsExtender extends baseFixedColumns(Base) {
  _getRowVisibleColumns(rowIndex) {
    if (this._isFixedTableRendering) {
      return this.getFixedColumns(rowIndex);
    }
    // TODO Check that this method exists in runtime
    // @ts-expect-error A method with this name doesn't exist in js folder at all
    return super._getRowVisibleColumns(rowIndex);
  }
  getContextMenuItems(options) {
    const {
      column
    } = options;
    const columnFixingOptions = this.option('columnFixing');
    let items = super.getContextMenuItems(options);
    if (options.row && options.row.rowType === 'header') {
      if (columnFixingOptions.enabled === true && column && column.allowFixing) {
        const onItemClick = params => {
          // eslint-disable-next-line default-case
          switch (params.itemData.value) {
            case 'none':
              this._columnsController.columnOption(column.index, 'fixed', false);
              break;
            case 'left':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'left'
              });
              break;
            case 'right':
              this._columnsController.columnOption(column.index, {
                fixed: true,
                fixedPosition: 'right'
              });
              break;
          }
        };
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        items = items || [];
        items.push({
          text: columnFixingOptions.texts.fix,
          beginGroup: true,
          items: [{
            text: columnFixingOptions.texts.leftPosition,
            value: 'left',
            disabled: column.fixed && (!column.fixedPosition || column.fixedPosition === 'left'),
            onItemClick
          }, {
            text: columnFixingOptions.texts.rightPosition,
            value: 'right',
            disabled: column.fixed && column.fixedPosition === 'right',
            onItemClick
          }]
        }, {
          text: columnFixingOptions.texts.unfix,
          value: 'none',
          disabled: !column.fixed,
          onItemClick
        });
      }
    }
    return items;
  }
  getFixedColumnElements(rowIndex) {
    const that = this;
    if ((0, _type.isDefined)(rowIndex)) {
      return this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).children();
    }
    const columnElements = that.getColumnElements();
    const $transparentColumnElement = that.getTransparentColumnElement();
    if (columnElements && $transparentColumnElement && $transparentColumnElement.length) {
      const transparentColumnIndex = getTransparentColumnIndex(that.getFixedColumns());
      columnElements.splice(transparentColumnIndex, $transparentColumnElement.get(0).colSpan, $transparentColumnElement.get(0));
    }
    return columnElements;
  }
  getColumnWidths() {
    const that = this;
    let fixedWidths;
    const result = super.getColumnWidths();
    const $fixedColumnElements = that.getFixedColumnElements();
    const fixedColumns = that.getFixedColumns();
    if (that._fixedTableElement) {
      if ($fixedColumnElements && $fixedColumnElements.length) {
        fixedWidths = that._getWidths($fixedColumnElements);
      } else {
        fixedWidths = super.getColumnWidths(that._fixedTableElement);
      }
    }
    return normalizeColumnWidths(fixedColumns, result, fixedWidths);
  }
};
const rowsView = Base => class RowsViewFixedColumnsExtender extends baseFixedColumns(Base) {
  dispose() {
    super.dispose.apply(this, arguments);
    clearTimeout(this._fixedScrollTimeout);
  }
  optionChanged(args) {
    const that = this;
    super.optionChanged(args);
    if (args.name === 'hoverStateEnabled' && that._isFixedColumns) {
      args.value ? this._attachHoverEvents() : this._detachHoverEvents();
    }
  }
  _detachHoverEvents() {
    const element = this.element();
    if (this._fixedTableElement && this._tableElement) {
      _events_engine.default.off(element, 'mouseover mouseout', '.dx-data-row');
    }
  }
  _attachHoverEvents() {
    if (this._fixedTableElement && this._tableElement) {
      _events_engine.default.on(this.element(), 'mouseover mouseout', '.dx-data-row', this.createAction(args => {
        const {
          event
        } = args;
        const rowIndex = this.getRowIndex((0, _renderer.default)(event.target).closest('.dx-row'));
        const isHover = event.type === 'mouseover';
        if (rowIndex >= 0) {
          this._tableElement && this._getRowElements(this._tableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
          this._fixedTableElement && this._getRowElements(this._fixedTableElement).eq(rowIndex).toggleClass(HOVER_STATE_CLASS, isHover);
        }
      }));
    }
  }
  _getScrollDelay() {
    var _this$_resizingContro;
    // @ts-expect-error m_virtual_scrolling method
    const hasResizeTimeout = (_this$_resizingContro = this._resizingController) === null || _this$_resizingContro === void 0 ? void 0 : _this$_resizingContro.hasResizeTimeout();
    if (hasResizeTimeout) {
      return this.option('scrolling.updateTimeout');
    }
    return _browser.default.mozilla ? 60 : 0;
  }
  _findContentElement(isFixedTableRendering) {
    let $content;
    let scrollTop;
    const contentClass = this.addWidgetPrefix(CONTENT_CLASS);
    const element = this.element();
    isFixedTableRendering = this._isFixedTableRendering || isFixedTableRendering;
    if (element && isFixedTableRendering) {
      $content = element.children(`.${contentClass}`);
      const scrollable = this.getScrollable();
      if (!$content.length && scrollable) {
        $content = (0, _renderer.default)('<div>').addClass(contentClass);
        _events_engine.default.on($content, 'scroll', e => {
          const {
            target
          } = e;
          const scrollDelay = this._getScrollDelay();
          clearTimeout(this._fixedScrollTimeout);
          this._fixedScrollTimeout = setTimeout(() => {
            scrollTop = (0, _renderer.default)(target).scrollTop();
            scrollable.scrollTo({
              y: scrollTop
            });
          }, scrollDelay);
        });
        _events_engine.default.on($content, _wheel.name, e => {
          const $nearestScrollable = (0, _renderer.default)(e.target).closest('.dx-scrollable');
          let shouldScroll = false;
          if (scrollable && scrollable.$element().is($nearestScrollable)) {
            shouldScroll = true;
          } else {
            const nearestScrollableInstance = $nearestScrollable.length && _ui.default.getInstance($nearestScrollable.get(0));
            // @ts-expect-error
            const nearestScrollableHasVerticalScrollbar = nearestScrollableInstance && nearestScrollableInstance.scrollHeight() - nearestScrollableInstance.clientHeight() > 0;
            // @ts-expect-error
            shouldScroll = nearestScrollableInstance && !nearestScrollableHasVerticalScrollbar;
          }
          if (shouldScroll) {
            scrollTop = scrollable.scrollTop();
            scrollable.scrollTo({
              y: scrollTop - e.delta
            });
            const scrollableTop = scrollable.scrollTop() + scrollable.clientHeight();
            const scrollableHeight = scrollable.scrollHeight() + this.getScrollbarWidth();
            const isPreventDefault = scrollable.scrollTop() > 0 && scrollableTop < scrollableHeight;
            if (isPreventDefault) {
              return false;
            }
          }
          return undefined;
        });
        $content.appendTo(element);
      }
      return $content;
    }
    return super._findContentElement();
  }
  _updateScrollable() {
    super._updateScrollable();
    const scrollable = this.getScrollable();
    if (scrollable !== null && scrollable !== void 0 && scrollable._disposed) {
      return;
    }
    const scrollTop = scrollable && scrollable.scrollOffset().top;
    this._updateFixedTablePosition(scrollTop);
  }
  _renderContent(contentElement, tableElement, isFixedTableRendering) {
    if (this._isFixedTableRendering || isFixedTableRendering) {
      return contentElement.empty().addClass(`${this.addWidgetPrefix(CONTENT_CLASS)} ${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`).append(tableElement);
    }
    return super._renderContent(contentElement, tableElement);
  }
  _getGroupCellOptions(options) {
    if (this._isFixedTableRendering) {
      return super._getGroupCellOptions((0, _extend.extend)({}, options, {
        columns: this._columnsController.getVisibleColumns()
      }));
    }
    return super._getGroupCellOptions(options);
  }
  _renderGroupedCells($row, options) {
    return super._renderGroupedCells($row, (0, _extend.extend)({}, options, {
      columns: this._columnsController.getVisibleColumns()
    }));
  }
  _renderGroupSummaryCells($row, options) {
    if (this._isFixedTableRendering) {
      // @ts-expect-error DataGrid's method
      super._renderGroupSummaryCells($row, (0, _extend.extend)({}, options, {
        columns: this._columnsController.getVisibleColumns()
      }));
    } else {
      // @ts-expect-error DataGrid's method
      super._renderGroupSummaryCells($row, options);
    }
  }
  _hasAlignByColumnSummaryItems(columnIndex, options) {
    // @ts-expect-error DataGrid's method
    const result = super._hasAlignByColumnSummaryItems.apply(this, arguments);
    const column = options.columns[columnIndex];
    if (options.isFixed) {
      return column.fixed && (result || column.fixedPosition === 'right');
    }
    return result && (!this._isFixedColumns || !column.fixed);
  }
  _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
    let alignByFixedColumnCellCount;
    if (this._isFixedTableRendering) {
      options.isFixed = true;
      // @ts-expect-error DataGrid's method
      alignByFixedColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
      options.isFixed = false;
      const startColumnIndex = options.columns.length - alignByFixedColumnCellCount;
      options = (0, _extend.extend)({}, options, {
        columns: this.getFixedColumns()
      });
      const transparentColumnIndex = getTransparentColumnIndex(options.columns);
      if (startColumnIndex < transparentColumnIndex) {
        alignByFixedColumnCellCount -= options.columns[transparentColumnIndex].colspan - 1 || 0;
        groupCellColSpan -= options.columns[transparentColumnIndex].colspan - 1 || 0;
      } else if (alignByColumnCellCount > 0) {
        $groupCell.css('visibility', 'hidden');
      }
      alignByColumnCellCount = alignByFixedColumnCellCount;
    }
    // @ts-expect-error DataGrid's method
    super._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount);
  }
  _getSummaryCellIndex(columnIndex, columns) {
    if (this._isFixedTableRendering) {
      const transparentColumnIndex = getTransparentColumnIndex(columns);
      if (columnIndex > transparentColumnIndex) {
        columnIndex += columns[transparentColumnIndex].colspan - 1;
      }
      return columnIndex;
    }
    // @ts-expect-error DataGrid's method
    return super._getSummaryCellIndex.apply(this, arguments);
  }
  _renderCore(change) {
    this._detachHoverEvents();
    const deferred = super._renderCore(change);
    const isFixedColumns = this._isFixedColumns;
    this.element().toggleClass(FIXED_COLUMNS_CLASS, isFixedColumns);
    if (this.option('hoverStateEnabled') && isFixedColumns) {
      this._attachHoverEvents();
    }
    return deferred;
  }
  setAriaOwns(headerTableId, footerTableId, isFixed) {
    if (isFixed) {
      var _this$element;
      const contentFixedClass = this.addWidgetPrefix(CONTENT_FIXED_CLASS);
      const $contentFixedElement = (_this$element = this.element()) === null || _this$element === void 0 ? void 0 : _this$element.children(`.${contentFixedClass}`);
      const $fixedTableElement = this.getFixedTableElement();
      if ($contentFixedElement.length && $fixedTableElement !== null && $fixedTableElement !== void 0 && $fixedTableElement.length) {
        this.setAria('owns', `${headerTableId ?? ''} ${$fixedTableElement.attr('id') ?? ''} ${footerTableId ?? ''}`.trim(), $contentFixedElement);
      }
    } else {
      super.setAriaOwns.apply(this, arguments);
    }
  }
  setRowsOpacity(columnIndex, value) {
    super.setRowsOpacity(columnIndex, value);
    const $rows = this._getRowElements(this._fixedTableElement);
    this._setRowsOpacityCore($rows, this.getFixedColumns(), columnIndex, value);
  }
  getCellIndex($cell) {
    const $fixedTable = this._fixedTableElement;
    let cellIndex = 0;
    if ($fixedTable && $cell.is('td') && $cell.closest($fixedTable).length) {
      const columns = this.getFixedColumns();
      (0, _iterator.each)(columns, (index, column) => {
        if (index === $cell[0].cellIndex) {
          return false;
        }
        if (column.colspan) {
          cellIndex += column.colspan;
          return;
        }
        cellIndex++;
        return undefined;
      });
      return cellIndex;
    }
    return super.getCellIndex.apply(this, arguments);
  }
  _updateFixedTablePosition(scrollTop, needFocus) {
    if (this._fixedTableElement && this._tableElement) {
      let $focusedElement;
      this._fixedTableElement.parent().scrollTop(scrollTop);
      if (needFocus && this._editorFactoryController) {
        $focusedElement = this._editorFactoryController.focus();
        $focusedElement && this._editorFactoryController.focus($focusedElement);
      }
    }
  }
  setScrollerSpacing(vWidth, hWidth) {
    const that = this;
    const styles = {
      marginBottom: 0
    };
    const $fixedContent = that.element().children(`.${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`);
    if ($fixedContent.length && that._fixedTableElement) {
      $fixedContent.css(styles);
      that._fixedTableElement.css(styles);
      styles[that.option('rtlEnabled') ? 'marginLeft' : 'marginRight'] = vWidth;
      styles.marginBottom = hWidth;
      const useNativeScrolling = that._scrollable && that._scrollable.option('useNative');
      (useNativeScrolling ? $fixedContent : that._fixedTableElement).css(styles);
    }
  }
  _getElasticScrollTop(e) {
    let elasticScrollTop = 0;
    if (e.scrollOffset.top < 0) {
      elasticScrollTop = -e.scrollOffset.top;
    } else if (e.reachedBottom) {
      const $scrollableContent = (0, _renderer.default)(e.component.content());
      const $scrollableContainer = (0, _renderer.default)(e.component.container());
      const maxScrollTop = Math.max($scrollableContent.get(0).clientHeight - $scrollableContainer.get(0).clientHeight, 0);
      elasticScrollTop = Math.min(maxScrollTop - e.scrollOffset.top, 0);
    }
    return Math.floor(elasticScrollTop);
  }
  _applyElasticScrolling(e) {
    if (this._fixedTableElement) {
      const elasticScrollTop = this._getElasticScrollTop(e);
      if (Math.ceil(elasticScrollTop) !== 0) {
        (0, _translator.move)(this._fixedTableElement, {
          top: elasticScrollTop
        });
      } else {
        this._fixedTableElement.css('transform', '');
      }
    }
  }
  _handleScroll(e) {
    this._updateFixedTablePosition(e.scrollOffset.top, true);
    this._applyElasticScrolling(e);
    super._handleScroll(e);
  }
  _updateContentPosition(isRender) {
    // @ts-expect-error m_virtual_scrolling method
    super._updateContentPosition.apply(this, arguments);
    if (!isRender) {
      this._updateFixedTablePosition(this._scrollTop);
    }
  }
  _afterRowPrepared(e) {
    if (this._isFixedTableRendering) return;
    super._afterRowPrepared(e);
  }
  _scrollToElement($element) {
    super._scrollToElement($element, this.getFixedColumnsOffset());
  }
};
// TODO Move this view to the DataGrid
const footerView = Base => class FooterViewFixedColumnsExtender extends baseFixedColumns(Base) {};
const normalizeColumnIndicesByPoints = function (columns, fixedColumns, pointsByColumns) {
  const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
  const correctIndex = columns.length - fixedColumns.length;
  (0, _iterator.each)(pointsByColumns, (_, point) => {
    if (point.index > transparentColumnIndex) {
      point.columnIndex += correctIndex;
      point.index += correctIndex;
    }
  });
  return pointsByColumns;
};
const draggingHeader = Base => class DraggingHeaderColumnFixingExtender extends Base {
  _generatePointsByColumns(options) {
    const visibleColumns = options.columns;
    const {
      targetDraggingPanel
    } = options;
    if (targetDraggingPanel && targetDraggingPanel.getName() === 'headers' && targetDraggingPanel.isFixedColumns()) {
      if (options.sourceColumn.fixed) {
        if (!options.rowIndex) {
          options.columnElements = targetDraggingPanel.getFixedColumnElements(0);
        }
        options.columns = targetDraggingPanel.getFixedColumns(options.rowIndex);
        const pointsByColumns = super._generatePointsByColumns(options);
        normalizeColumnIndicesByPoints(visibleColumns, options.columns, pointsByColumns);
        return pointsByColumns;
      }
    }
    return super._generatePointsByColumns(options);
  }
  _pointCreated(point, columns, location, sourceColumn) {
    const result = super._pointCreated.apply(this, arguments);
    const targetColumn = columns[point.columnIndex];
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
    if (!result && location === 'headers' && $transparentColumn && $transparentColumn.length) {
      const boundingRect = (0, _position.getBoundingRect)($transparentColumn.get(0));
      if (sourceColumn && sourceColumn.fixed) {
        return sourceColumn.fixedPosition === 'right' ? point.x < boundingRect.right : point.x > boundingRect.left;
      }
      if (targetColumn && targetColumn.fixed && targetColumn.fixedPosition !== 'right') {
        return true;
      }
      return point.x < boundingRect.left || point.x > boundingRect.right;
    }
    return result;
  }
};
const columnsResizer = Base => class ColumnResizerColumnFixingExtender extends Base {
  _generatePointsByColumns() {
    const that = this;
    const columnsController = that._columnsController;
    const columns = columnsController && that._columnsController.getVisibleColumns();
    const fixedColumns = columnsController && that._columnsController.getFixedColumns();
    const transparentColumnIndex = getTransparentColumnIndex(fixedColumns);
    const correctIndex = columns.length - fixedColumns.length;
    // @ts-expect-error
    const cells = that._columnHeadersView.getFixedColumnElements();
    super._generatePointsByColumns();
    if (cells && cells.length > 0) {
      that._pointsByFixedColumns = _m_utils.default.getPointsByColumns(cells, point => {
        if (point.index > transparentColumnIndex) {
          point.columnIndex += correctIndex;
          point.index += correctIndex;
        }
        return that._pointCreated(point, columns.length, columns);
      });
    }
  }
  _getTargetPoint(pointsByColumns, currentX, deltaX) {
    // @ts-expect-error
    const $transparentColumn = this._columnHeadersView.getTransparentColumnElement();
    if ($transparentColumn && $transparentColumn.length) {
      const boundingRect = (0, _position.getBoundingRect)($transparentColumn.get(0));
      if (currentX <= boundingRect.left || currentX >= boundingRect.right) {
        return super._getTargetPoint(this._pointsByFixedColumns, currentX, deltaX);
      }
    }
    return super._getTargetPoint(pointsByColumns, currentX, deltaX);
  }
};
const resizing = Base => class ResizingColumnFixingExtender extends Base {
  _setAriaOwns() {
    var _this$_columnHeadersV, _this$_footerView, _this$_rowsView;
    super._setAriaOwns.apply(this, arguments);
    // @ts-expect-error
    const headerFixedTable = (_this$_columnHeadersV = this._columnHeadersView) === null || _this$_columnHeadersV === void 0 ? void 0 : _this$_columnHeadersV.getFixedTableElement();
    // @ts-expect-error
    const footerFixedTable = (_this$_footerView = this._footerView) === null || _this$_footerView === void 0 ? void 0 : _this$_footerView.getFixedTableElement();
    // @ts-expect-error
    (_this$_rowsView = this._rowsView) === null || _this$_rowsView === void 0 || _this$_rowsView.setAriaOwns(headerFixedTable === null || headerFixedTable === void 0 ? void 0 : headerFixedTable.attr('id'), footerFixedTable === null || footerFixedTable === void 0 ? void 0 : footerFixedTable.attr('id'), true);
  }
};
const keyboardNavigation = Base => class KeyboardNavigationExtender extends Base {
  _toggleInertAttr(value) {
    var _this$_rowsView2;
    const $fixedContent = (_this$_rowsView2 = this._rowsView) === null || _this$_rowsView2 === void 0 ? void 0 : _this$_rowsView2.getFixedContentElement();
    if (value) {
      $fixedContent === null || $fixedContent === void 0 || $fixedContent.attr('inert', true);
    } else {
      $fixedContent === null || $fixedContent === void 0 || $fixedContent.removeAttr('inert');
    }
  }
};
const columnFixingModule = exports.columnFixingModule = {
  defaultOptions() {
    return {
      columnFixing: {
        enabled: false,
        texts: {
          fix: _message.default.format('dxDataGrid-columnFixingFix'),
          unfix: _message.default.format('dxDataGrid-columnFixingUnfix'),
          leftPosition: _message.default.format('dxDataGrid-columnFixingLeftPosition'),
          rightPosition: _message.default.format('dxDataGrid-columnFixingRightPosition')
        }
      }
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      rowsView,
      footerView
    },
    controllers: {
      draggingHeader,
      columnsResizer,
      resizing,
      keyboardNavigation
    }
  }
};