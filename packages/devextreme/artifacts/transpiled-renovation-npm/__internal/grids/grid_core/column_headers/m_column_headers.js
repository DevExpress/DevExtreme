"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columnHeadersModule = exports.ColumnHeadersView = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_accessibility = require("../m_accessibility");
var _m_columns_view = require("../views/m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CELL_CONTENT_CLASS = 'text-content';
const HEADERS_CLASS = 'headers';
const NOWRAP_CLASS = 'nowrap';
const ROW_CLASS_SELECTOR = '.dx-row';
const HEADER_ROW_CLASS = 'dx-header-row';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const CONTEXT_MENU_SORT_ASC_ICON = 'context-menu-sort-asc';
const CONTEXT_MENU_SORT_DESC_ICON = 'context-menu-sort-desc';
const CONTEXT_MENU_SORT_NONE_ICON = 'context-menu-sort-none';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const VISIBILITY_HIDDEN_CLASS = 'dx-visibility-hidden';
const TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = 'dx-text-content-alignment-';
const SORT_INDICATOR_CLASS = 'dx-sort-indicator';
const SORT_INDEX_INDICATOR_CLASS = 'dx-sort-index-indicator';
const HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
const HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';
const MULTI_ROW_HEADER_CLASS = 'dx-header-multi-row';
const LINK = 'dx-link';
const createCellContent = function (that, $cell, options) {
  const $cellContent = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));
  that.setAria('role', 'presentation', $cellContent);
  addCssClassesToCellContent(that, $cell, options.column, $cellContent);
  const showColumnLines = that.option('showColumnLines');
  // TODO getController
  const contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);
  return $cellContent[showColumnLines || contentAlignment === 'right' ? 'appendTo' : 'prependTo']($cell);
};
function addCssClassesToCellContent(that, $cell, column, $cellContent) {
  const $indicatorElements = that._getIndicatorElements($cell, true);
  const $visibleIndicatorElements = that._getIndicatorElements($cell);
  const indicatorCount = $indicatorElements && $indicatorElements.length;
  const columnAlignment = that._getColumnAlignment(column.alignment);
  const sortIndicatorClassName = `.${that._getIndicatorClassName('sort')}`;
  const sortIndexIndicatorClassName = `.${that._getIndicatorClassName('sortIndex')}`;
  const $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
  const $sortIndexIndicator = $visibleIndicatorElements.children().filter(sortIndexIndicatorClassName);
  $cellContent = $cellContent || $cell.children(`.${that.addWidgetPrefix(CELL_CONTENT_CLASS)}`);
  $cellContent.toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0).toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center').toggleClass(SORT_INDICATOR_CLASS, !!$sortIndicator.length).toggleClass(SORT_INDEX_INDICATOR_CLASS, !!$sortIndexIndicator.length).toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter(`.${that._getIndicatorClassName('headerFilter')}`).length);
}
class ColumnHeadersView extends _m_columns_view.ColumnsView {
  init() {
    super.init();
    this._headerPanelView = this.getView('headerPanel');
    this._headerFilterController = this.getController('headerFilter');
    this._dataController = this.getController('data');
  }
  _createTable() {
    // @ts-expect-error
    const $table = super._createTable.apply(this, arguments);
    _events_engine.default.on($table, 'mousedown selectstart', this.createAction(e => {
      const {
        event
      } = e;
      if (event.shiftKey) {
        event.preventDefault();
      }
    }));
    return $table;
  }
  _isLegacyKeyboardNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  }
  _getDefaultTemplate(column) {
    const that = this;
    return function ($container, options) {
      const {
        caption
      } = column;
      const needCellContent = !column.command || caption && column.command !== 'expand';
      if (column.command === 'empty') {
        that._renderEmptyMessage($container, options);
      } else if (needCellContent) {
        const $content = createCellContent(that, $container, options);
        $content.text(caption);
      } else if (column.command) {
        $container.html('&nbsp;');
      }
    };
  }
  _renderEmptyMessage($container, options) {
    const textEmpty = this._getEmptyHeaderText();
    if (!textEmpty) {
      $container.html('&nbsp;');
      return;
    }
    const $cellContent = createCellContent(this, $container, options);
    const needSplit = textEmpty.includes('{0}');
    if (needSplit) {
      const [leftPart, rightPart] = textEmpty.split('{0}');
      const columnChooserTitle = _message.default.format('dxDataGrid-emptyHeaderColumnChooserText');
      const columnChooserView = this._columnChooserView;
      const $link = (0, _renderer.default)('<a>').text(columnChooserTitle).addClass(LINK);
      _events_engine.default.on($link, 'click', this.createAction(() => columnChooserView.showColumnChooser()));
      $cellContent
      // @ts-expect-error
      .append(_dom_adapter.default.createTextNode(leftPart)).append($link)
      // @ts-expect-error
      .append(_dom_adapter.default.createTextNode(rightPart));
    } else {
      $cellContent.text(textEmpty);
    }
  }
  _getEmptyHeaderText() {
    const hasHiddenColumns = !!this._columnChooserView.hasHiddenColumns();
    const hasGroupedColumns = !!this._headerPanelView.hasGroupedColumns();
    switch (true) {
      case hasHiddenColumns && hasGroupedColumns:
        return _message.default.format('dxDataGrid-emptyHeaderWithColumnChooserAndGroupPanelText');
      case hasGroupedColumns:
        return _message.default.format('dxDataGrid-emptyHeaderWithGroupPanelText');
      case hasHiddenColumns:
        return _message.default.format('dxDataGrid-emptyHeaderWithColumnChooserText');
      default:
        return '';
    }
  }
  _getHeaderTemplate(column) {
    return column.headerCellTemplate || {
      allowRenderToDetachedContainer: true,
      render: this._getDefaultTemplate(column)
    };
  }
  _processTemplate(template, options) {
    const that = this;
    let resultTemplate;
    const {
      column
    } = options;
    const renderingTemplate = super._processTemplate(template);
    if (options.rowType === 'header' && renderingTemplate && column.headerCellTemplate && !column.command) {
      resultTemplate = {
        render(options) {
          const $content = createCellContent(that, options.container, options.model);
          renderingTemplate.render((0, _extend.extend)({}, options, {
            container: $content
          }));
        }
      };
    } else {
      resultTemplate = renderingTemplate;
    }
    return resultTemplate;
  }
  /**
   * @extended: filter_row, selection
   */
  _handleDataChanged(e) {
    if (e.changeType !== 'refresh') return;
    if (this._isGroupingChanged || this._requireReady) {
      this._isGroupingChanged = false;
      this.render();
    }
  }
  _renderCell($row, options) {
    const $cell = super._renderCell($row, options);
    if (options.row.rowType === 'header') {
      $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        if (options.column && !options.column.type) {
          $cell.attr('tabindex', this.option('tabindex') || 0);
        }
      }
    }
    return $cell;
  }
  _setCellAriaAttributes($cell, cellOptions) {
    super._setCellAriaAttributes($cell, cellOptions);
    if (cellOptions.rowType === 'header') {
      if (!cellOptions.column.type) {
        this.setAria('role', 'columnheader', $cell);
      }
      if (cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
        $cell.attr('id', cellOptions.column.headerId);
        this.setAria('label', `${_message.default.format('dxDataGrid-ariaColumn')} ${cellOptions.column.caption}`, $cell);
      }
    }
  }
  /**
   * @extended: filter_row
   */
  _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);
    $row.toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));
    if (row.rowType === 'header') {
      $row.addClass(HEADER_ROW_CLASS);
      if (!this._isLegacyKeyboardNavigation()) {
        (0, _m_accessibility.registerKeyboardAction)('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
      }
    }
    return $row;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processHeaderAction(event, $row) {}
  _handleActionKeyDown(args) {
    const {
      event
    } = args;
    const $target = (0, _renderer.default)(event.target);
    this._lastActionElement = event.target;
    if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
      const headerFilterController = this._headerFilterController;
      const $column = $target.closest('td');
      const columnIndex = this.getColumnIndexByElement($column);
      if (columnIndex >= 0) {
        headerFilterController.showHeaderFilterMenu(columnIndex, false);
      }
    } else {
      const $row = $target.closest(ROW_CLASS_SELECTOR);
      this._processHeaderAction(event, $row);
    }
    event.preventDefault();
  }
  /**
   * @extended: filter_row, virtual_column
   */
  _renderCore() {
    const that = this;
    const $container = that.element();
    const change = {};
    if (that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
      return;
    }
    $container.addClass(that.addWidgetPrefix(HEADERS_CLASS)).toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled')).empty();
    that.setAria('role', 'presentation', $container);
    const deferred = that._updateContent(that._renderTable({
      change
    }), change);
    if (that.getRowCount() > 1) {
      $container.addClass(MULTI_ROW_HEADER_CLASS);
    }
    // @ts-expect-error
    super._renderCore.apply(that, arguments);
    return deferred;
  }
  _renderRows() {
    const that = this;
    if (that._dataController.isLoaded() || that._hasRowElements) {
      // @ts-expect-error
      super._renderRows.apply(that, arguments);
      that._hasRowElements = true;
    }
  }
  _renderRow($table, options) {
    const rowIndex = this.getRowCount() === 1 ? null : options.row.rowIndex;
    options.columns = this.getColumns(rowIndex);
    super._renderRow($table, options);
  }
  _createCell(options) {
    const {
      column
    } = options;
    // @ts-expect-error
    const $cellElement = super._createCell.apply(this, arguments);
    column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);
    return $cellElement;
  }
  /**
   * @extended: filter_row
   */
  _getRows() {
    const result = [];
    const rowCount = this.getRowCount();
    if (this.option('showColumnHeaders')) {
      for (let i = 0; i < rowCount; i++) {
        result.push({
          rowType: 'header',
          rowIndex: i
        });
      }
    }
    return result;
  }
  _getCellTemplate(options) {
    if (options.rowType === 'header') {
      return this._getHeaderTemplate(options.column);
    }
  }
  /**
   * @extended: filter_row, header_filter
   */
  _columnOptionChanged(e) {
    const {
      changeTypes
    } = e;
    const {
      optionNames
    } = e;
    if (changeTypes.grouping || changeTypes.groupExpanding) {
      if (changeTypes.grouping) {
        this._isGroupingChanged = true;
      }
      return;
    }
    super._columnOptionChanged(e);
    if (optionNames.width || optionNames.visible) {
      this.resizeCompleted.fire();
    }
  }
  /**
   * @extended: filter_row
   */
  _isElementVisible(elementOptions) {
    return elementOptions && elementOptions.visible;
  }
  _alignCaptionByCenter($cell) {
    let $indicatorsContainer = this._getIndicatorContainer($cell, true);
    if ($indicatorsContainer && $indicatorsContainer.length) {
      $indicatorsContainer.filter(`.${VISIBILITY_HIDDEN_CLASS}`).remove();
      $indicatorsContainer = this._getIndicatorContainer($cell);
      $indicatorsContainer.clone().addClass(VISIBILITY_HIDDEN_CLASS).css('float', '').insertBefore($cell.children(`.${this.addWidgetPrefix(CELL_CONTENT_CLASS)}`));
    }
  }
  _updateCell($cell, options) {
    if (options.rowType === 'header' && options.column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }
    // @ts-expect-error
    super._updateCell.apply(this, arguments);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateIndicator($cell, column, indicatorName) {
    // @ts-expect-error
    const $indicatorElement = super._updateIndicator.apply(this, arguments);
    if (column.alignment === 'center') {
      this._alignCaptionByCenter($cell);
    }
    addCssClassesToCellContent(this, $cell, column);
    return $indicatorElement;
  }
  _getIndicatorContainer($cell, returnAll) {
    const $indicatorsContainer = super._getIndicatorContainer($cell);
    return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(`:not(.${VISIBILITY_HIDDEN_CLASS})`);
  }
  /**
   * @extended: tree_list/selection
   */
  // eslint-disable-next-line
  _isSortableElement($target) {
    return true;
  }
  getHeadersRowHeight() {
    const $tableElement = this.getTableElement();
    const $headerRows = $tableElement && $tableElement.find(`.${HEADER_ROW_CLASS}`);
    return $headerRows && $headerRows.toArray().reduce((sum, headerRow) => sum + (0, _size.getHeight)(headerRow), 0) || 0;
  }
  getHeaderElement(index) {
    const columnElements = this.getColumnElements();
    return columnElements && columnElements.eq(index);
  }
  getColumnElements(index, bandColumnIndex) {
    const that = this;
    let $cellElement;
    const columnsController = that._columnsController;
    const rowCount = that.getRowCount();
    if (that.option('showColumnHeaders')) {
      if (rowCount > 1 && (!(0, _type.isDefined)(index) || (0, _type.isDefined)(bandColumnIndex))) {
        const result = [];
        const visibleColumns = (0, _type.isDefined)(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();
        (0, _iterator.each)(visibleColumns, (_, column) => {
          const rowIndex = (0, _type.isDefined)(index) ? index : columnsController.getRowIndex(column.index);
          $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
          $cellElement && result.push($cellElement.get(0));
        });
        // @ts-expect-error
        return (0, _renderer.default)(result);
      }
      if (!index || index < rowCount) {
        return that.getCellElements(index || 0);
      }
    }
    return undefined;
  }
  getColumnIndexByElement($cell) {
    const cellIndex = this.getCellIndex($cell);
    const $row = $cell.closest('.dx-row');
    const {
      rowIndex
    } = $row[0];
    const column = this.getColumns(rowIndex)[cellIndex];
    return column ? column.index : -1;
  }
  getVisibleColumnIndex(columnIndex, rowIndex) {
    const column = this.getColumns()[columnIndex];
    return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
  }
  /**
   * @extended: column_fixing
   */
  getColumnWidths() {
    const $columnElements = this.getColumnElements();
    if ($columnElements && $columnElements.length) {
      return this._getWidths($columnElements);
    }
    // @ts-expect-error
    return super.getColumnWidths.apply(this, arguments);
  }
  /**
   * @extended: column_chooser
   */
  allowDragging(column) {
    const rowIndex = column && this._columnsController.getRowIndex(column.index);
    const columns = this.getColumns(rowIndex);
    const isReorderingEnabled = this.option('allowColumnReordering') ?? this._columnsController.isColumnOptionUsed('allowReordering');
    return isReorderingEnabled && column.allowReordering && columns.length > 1;
  }
  getBoundingRect() {
    const that = this;
    const $columnElements = that.getColumnElements();
    if ($columnElements && $columnElements.length) {
      const offset = that.getTableElement().offset();
      return {
        top: offset.top
      };
    }
    return null;
  }
  getName() {
    return 'headers';
  }
  getColumnCount() {
    const $columnElements = this.getColumnElements();
    return $columnElements ? $columnElements.length : 0;
  }
  /**
   * @extended: filter_row
   */
  isVisible() {
    return this.option('showColumnHeaders');
  }
  optionChanged(args) {
    const that = this;
    switch (args.name) {
      case 'showColumnHeaders':
      case 'wordWrapEnabled':
      case 'showColumnLines':
        that._invalidate(true, true);
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  getHeight() {
    return this.getElementHeight();
  }
  /**
   * @extended: column_fixing
   */
  getContextMenuItems(options) {
    const that = this;
    const {
      column
    } = options;
    if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
      const sortingOptions = that.option('sorting');
      if (sortingOptions && sortingOptions.mode !== 'none' && column && column.allowSorting) {
        const onItemClick = function (params) {
          setTimeout(() => {
            that._columnsController.changeSortOrder(column.index, params.itemData.value);
          });
        };
        return [{
          text: sortingOptions.ascendingText,
          value: 'asc',
          disabled: column.sortOrder === 'asc',
          icon: CONTEXT_MENU_SORT_ASC_ICON,
          onItemClick
        }, {
          text: sortingOptions.descendingText,
          value: 'desc',
          disabled: column.sortOrder === 'desc',
          icon: CONTEXT_MENU_SORT_DESC_ICON,
          onItemClick
        }, {
          text: sortingOptions.clearText,
          value: 'none',
          disabled: !column.sortOrder,
          icon: CONTEXT_MENU_SORT_NONE_ICON,
          onItemClick
        }];
      }
    }
    return undefined;
  }
  getRowCount() {
    return this._columnsController && this._columnsController.getRowCount();
  }
  setRowsOpacity(columnIndex, value, rowIndex) {
    let i;
    let columnElements;
    const rowCount = this.getRowCount();
    const columns = this._columnsController.getColumns();
    const column = columns && columns[columnIndex];
    const columnID = column && column.isBand && column.index;
    const setColumnOpacity = (column, index) => {
      if (column.ownerBand === columnID) {
        columnElements.eq(index).css({
          opacity: value
        });
        if (column.isBand) {
          this.setRowsOpacity(column.index, value, i + 1);
        }
      }
    };
    if ((0, _type.isDefined)(columnID)) {
      rowIndex = rowIndex || 0;
      for (i = rowIndex; i < rowCount; i++) {
        columnElements = this.getCellElements(i);
        if (columnElements) {
          const rowColumns = this.getColumns(i);
          rowColumns.forEach(setColumnOpacity);
        }
      }
    }
  }
}
exports.ColumnHeadersView = ColumnHeadersView;
const columnHeadersModule = exports.columnHeadersModule = {
  defaultOptions() {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true
    };
  },
  views: {
    columnHeadersView: ColumnHeadersView
  }
};