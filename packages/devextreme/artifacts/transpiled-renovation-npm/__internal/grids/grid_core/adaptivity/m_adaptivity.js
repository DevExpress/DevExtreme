"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adaptivityModule = exports.AdaptiveColumnsController = void 0;
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _dom = require("../../../../core/utils/dom");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _index = require("../../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _form = _interopRequireDefault(require("../../../../ui/form"));
var _themes = require("../../../../ui/themes");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable max-classes-per-file */

const COLUMN_HEADERS_VIEW = 'columnHeadersView';
const ROWS_VIEW = 'rowsView';
const FOOTER_VIEW = 'footerView';
const COLUMN_VIEWS = [COLUMN_HEADERS_VIEW, ROWS_VIEW, FOOTER_VIEW];
const ADAPTIVE_NAMESPACE = 'dxDataGridAdaptivity';
const HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
const ADAPTIVE_ROW_TYPE = 'detailAdaptive';
const FORM_ITEM_CONTENT_CLASS = 'dx-field-item-content';
const FORM_ITEM_MODIFIED = 'dx-item-modified';
const HIDDEN_COLUMN_CLASS = 'hidden-column';
const ADAPTIVE_COLUMN_BUTTON_CLASS = 'adaptive-more';
const ADAPTIVE_COLUMN_NAME_CLASS = 'dx-command-adaptive';
const COMMAND_ADAPTIVE_HIDDEN_CLASS = 'dx-command-adaptive-hidden';
const ADAPTIVE_DETAIL_ROW_CLASS = 'dx-adaptive-detail-row';
const ADAPTIVE_ITEM_TEXT_CLASS = 'dx-adaptive-item-text';
const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const LAST_DATA_CELL_CLASS = 'dx-last-data-cell';
const ADAPTIVE_COLUMN_NAME = 'adaptive';
const EDIT_MODE_BATCH = 'batch';
const EDIT_MODE_ROW = 'row';
const EDIT_MODE_FORM = 'form';
const EDIT_MODE_POPUP = 'popup';
const REVERT_TOOLTIP_CLASS = 'revert-tooltip';
const GROUP_CELL_CLASS = 'dx-group-cell';
const GROUP_ROW_CLASS = 'dx-group-row';
const EXPAND_ARIA_NAME = 'dxDataGrid-ariaAdaptiveExpand';
const COLLAPSE_ARIA_NAME = 'dxDataGrid-ariaAdaptiveCollapse';
const LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
function getColumnId(that, column) {
  return that._columnsController.getColumnId(column);
}
function getDataCellElements($row) {
  return $row.find('td:not(.dx-datagrid-hidden-column):not([class*=\'dx-command-\'])');
}
function adaptiveCellTemplate(container, options) {
  let $adaptiveColumnButton;
  const $container = (0, _renderer.default)(container);
  // TODO getController
  const adaptiveColumnsController = options.component.getController('adaptiveColumns');
  if (options.rowType === 'data') {
    $adaptiveColumnButton = (0, _renderer.default)('<span>').addClass(adaptiveColumnsController.addWidgetPrefix(ADAPTIVE_COLUMN_BUTTON_CLASS));
    _events_engine.default.on($adaptiveColumnButton, (0, _index.addNamespace)(_click.name, ADAPTIVE_NAMESPACE), adaptiveColumnsController.createAction(() => {
      adaptiveColumnsController.toggleExpandAdaptiveDetailRow(options.key);
    }));
    $adaptiveColumnButton.appendTo($container);
  } else {
    _m_utils.default.setEmptyText($container);
  }
}
function focusCellHandler(e) {
  var _e$data;
  const $nextCell = (_e$data = e.data) === null || _e$data === void 0 ? void 0 : _e$data.$nextCell;
  _events_engine.default.off($nextCell, 'focus', focusCellHandler);
  // @ts-expect-error
  _events_engine.default.trigger($nextCell, 'dxclick');
}
class AdaptiveColumnsController extends _m_modules.default.ViewController {
  init() {
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._editingController = this.getController('editing');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._rowsView = this.getView('rowsView');
    this._columnsController.addCommandColumn({
      type: ADAPTIVE_COLUMN_NAME,
      command: ADAPTIVE_COLUMN_NAME,
      visible: true,
      adaptiveHidden: true,
      cssClass: ADAPTIVE_COLUMN_NAME_CLASS,
      alignment: 'center',
      width: 'auto',
      cellTemplate: adaptiveCellTemplate,
      fixedPosition: 'right'
    });
    this._columnsController.columnsChanged.add(() => {
      const isAdaptiveVisible = !!this.updateHidingQueue(this._columnsController.getColumns()).length;
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !isAdaptiveVisible, true);
    });
    this._hidingColumnsQueue = [];
    this._hiddenColumns = [];
    this.createAction('onAdaptiveDetailRowPreparing');
    super.init();
  }
  optionChanged(args) {
    if (args.name === 'columnHidingEnabled') {
      this._columnsController.columnOption('command:adaptive', 'adaptiveHidden', !args.value);
    }
    super.optionChanged(args);
  }
  publicMethods() {
    return ['isAdaptiveDetailRowExpanded', 'expandAdaptiveDetailRow', 'collapseAdaptiveDetailRow'];
  }
  _isRowEditMode() {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_ROW;
  }
  _isItemModified(item, cellOptions) {
    const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
    const rowIndex = this._dataController.getRowIndexByKey(cellOptions.key);
    const row = this._dataController.items()[rowIndex + 1];
    return row && row.modifiedValues && (0, _type.isDefined)(row.modifiedValues[columnIndex]);
  }
  _renderFormViewTemplate(item, cellOptions, $container) {
    const that = this;
    const {
      column
    } = item;
    const focusAction = that.createAction(() => {
      if (that._editingController.isEditing()) {
        // @ts-expect-error
        _events_engine.default.trigger($container, _click.name);
      }
    });
    const rowData = cellOptions.row.data;
    const value = column.calculateCellValue(rowData);
    const displayValue = _m_utils.default.getDisplayValue(column, value, rowData, cellOptions.rowType);
    const text = _m_utils.default.formatValue(displayValue, column);
    const isCellOrBatchEditMode = this._editingController.isCellOrBatchEditMode();
    const rowsView = that._rowsView;
    if (column.allowEditing && this._keyboardNavigationController.isKeyboardEnabled()) {
      $container.attr('tabIndex', that.option('tabIndex'));
      if (isCellOrBatchEditMode) {
        _events_engine.default.off($container, 'focus', focusAction);
        _events_engine.default.on($container, 'focus', focusAction);
      }
    }
    if (column.cellTemplate) {
      const templateOptions = (0, _extend.extend)({}, cellOptions, {
        value,
        displayValue,
        text,
        column
      });
      rowsView.renderTemplate($container, column.cellTemplate, templateOptions, (0, _dom.isElementInDom)($container)).done(() => {
        rowsView._cellPrepared($container, cellOptions);
      });
    } else {
      const container = $container.get(0);
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }
      $container.addClass(ADAPTIVE_ITEM_TEXT_CLASS);
      if (!(0, _type.isDefined)(text) || text === '') {
        $container.html('&nbsp;');
      }
      if (!that._isRowEditMode()) {
        if (that._isItemModified(item, cellOptions)) {
          $container.addClass(FORM_ITEM_MODIFIED);
        }
      }
      rowsView._cellPrepared($container, cellOptions);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getTemplate(item, cellOptions, updateForm) {
    const that = this;
    const {
      column
    } = item;
    const editingController = this._editingController;
    return function (options, container) {
      const $container = (0, _renderer.default)(container);
      const columnIndex = that._columnsController.getVisibleIndex(column.index);
      const templateOptions = (0, _extend.extend)({}, cellOptions);
      const renderFormTemplate = function () {
        const isItemEdited = that._isItemEdited(item);
        templateOptions.value = cellOptions.row.values[columnIndex];
        if (isItemEdited || column.showEditorAlways) {
          editingController.renderFormEditorTemplate(templateOptions, item, options, $container, !isItemEdited);
        } else {
          templateOptions.column = column;
          templateOptions.columnIndex = columnIndex;
          that._renderFormViewTemplate(item, templateOptions, $container);
        }
      };
      renderFormTemplate();
      if (templateOptions.watch) {
        const dispose = templateOptions.watch(() => ({
          isItemEdited: that._isItemEdited(item),
          value: cellOptions.row.values[columnIndex]
        }), () => {
          $container.contents().remove();
          $container.removeClass(ADAPTIVE_ITEM_TEXT_CLASS);
          renderFormTemplate();
        });
        _events_engine.default.on($container, _remove.removeEvent, dispose);
      }
    };
  }
  _isVisibleColumnsValid(visibleColumns) {
    const getCommandColumnsCount = function () {
      let result = 0;
      for (let j = 0; j < visibleColumns.length; j++) {
        const visibleColumn = visibleColumns[j];
        if (visibleColumn.command) {
          result++;
        }
      }
      return result;
    };
    if (visibleColumns < 2) {
      return false;
    }
    if (visibleColumns.length - getCommandColumnsCount() <= 1) {
      return false;
    }
    return true;
  }
  _calculatePercentWidths(widths, visibleColumns) {
    const that = this;
    let percentWidths = 0;
    visibleColumns.forEach((item, index) => {
      if (widths[index] !== HIDDEN_COLUMNS_WIDTH) {
        percentWidths += that._getItemPercentWidth(item);
      }
    });
    return percentWidths;
  }
  _isPercentWidth(width) {
    return (0, _type.isString)(width) && width.endsWith('%');
  }
  _isColumnHidden(column) {
    return this._hiddenColumns.filter(hiddenColumn => hiddenColumn.index === column.index).length > 0;
  }
  _getAverageColumnsWidth(containerWidth, columns, columnsCanFit) {
    const that = this;
    let fixedColumnsWidth = 0;
    let columnsWithoutFixedWidthCount = 0;
    columns.forEach(column => {
      if (!that._isColumnHidden(column)) {
        const {
          width
        } = column;
        if ((0, _type.isDefined)(width) && !isNaN(parseFloat(width))) {
          fixedColumnsWidth += that._isPercentWidth(width) ? that._calculatePercentWidth({
            visibleIndex: column.visibleIndex,
            columnsCount: columns.length,
            columnsCanFit,
            bestFitWidth: column.bestFitWidth,
            columnWidth: width,
            containerWidth
          }) : parseFloat(width);
        } else {
          columnsWithoutFixedWidthCount++;
        }
      }
    });
    return (containerWidth - fixedColumnsWidth) / columnsWithoutFixedWidthCount;
  }
  _calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
    const columnsCount = contentColumns.length;
    let colWidth;
    if (widthOption && widthOption !== 'auto') {
      if (this._isPercentWidth(widthOption)) {
        colWidth = this._calculatePercentWidth({
          visibleIndex: column.visibleIndex,
          columnsCount,
          columnsCanFit,
          bestFitWidth,
          columnWidth: widthOption,
          containerWidth
        });
      } else {
        return parseFloat(widthOption);
      }
    } else {
      const columnAutoWidth = this.option('columnAutoWidth');
      colWidth = columnAutoWidth || !!column.command ? bestFitWidth : this._getAverageColumnsWidth(containerWidth, contentColumns, columnsCanFit);
    }
    return colWidth;
  }
  _calculatePercentWidth(options) {
    const columnFitted = options.visibleIndex < options.columnsCount - 1 && options.columnsCanFit;
    const partialWidth = options.containerWidth * parseFloat(options.columnWidth) / 100;
    const resultWidth = options.columnsCanFit && partialWidth < options.bestFitWidth ? options.bestFitWidth : partialWidth;
    return columnFitted ? options.containerWidth * parseFloat(options.columnWidth) / 100 : resultWidth;
  }
  _getNotTruncatedColumnWidth(column, containerWidth, contentColumns, columnsCanFit) {
    const columnId = getColumnId(this, column);
    const widthOption = this._columnsController.columnOption(columnId, 'width');
    const bestFitWidth = this._columnsController.columnOption(columnId, 'bestFitWidth');
    if (widthOption && widthOption !== 'auto' && !this._isPercentWidth(widthOption)) {
      return parseFloat(widthOption);
    }
    const colWidth = this._calculateColumnWidth(column, containerWidth, contentColumns, columnsCanFit);
    return colWidth < bestFitWidth ? null : colWidth;
  }
  _getItemPercentWidth(item) {
    let result = 0;
    if (item.width && this._isPercentWidth(item.width)) {
      result = parseFloat(item.width);
    }
    return result;
  }
  _getCommandColumnsWidth() {
    const that = this;
    const columns = that._columnsController.getVisibleColumns();
    let colWidth = 0;
    (0, _iterator.each)(columns, (index, column) => {
      if (column.index < 0 || column.command) {
        colWidth += that._columnsController.columnOption(getColumnId(that, column), 'bestFitWidth') || 0;
      }
    });
    return colWidth;
  }
  _isItemEdited(item) {
    if (this.isFormOrPopupEditMode()) {
      return false;
    }
    if (this._isRowEditMode()) {
      const editRowKey = this.option('editing.editRowKey');
      // @ts-expect-error
      if ((0, _common.equalByValue)(editRowKey, this._dataController.adaptiveExpandedKey())) {
        return true;
      }
    } else {
      // @ts-expect-error
      const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
      const columnIndex = this._columnsController.getVisibleIndex(item.column.index);
      return this._editingController.isEditCell(rowIndex, columnIndex);
    }
    return undefined;
  }
  _getFormItemsByHiddenColumns(hiddenColumns) {
    const items = [];
    (0, _iterator.each)(hiddenColumns, (_, column) => {
      items.push({
        column,
        name: column.name,
        dataField: column.dataField,
        visibleIndex: column.visibleIndex
      });
    });
    return items;
  }
  _getAdaptiveColumnVisibleIndex(visibleColumns) {
    for (let i = 0; i < visibleColumns.length; i++) {
      const column = visibleColumns[i];
      if (column.command === ADAPTIVE_COLUMN_NAME) {
        return i;
      }
    }
    return undefined;
  }
  _hideAdaptiveColumn(resultWidths, visibleColumns) {
    const visibleIndex = this._getAdaptiveColumnVisibleIndex(visibleColumns);
    if ((0, _type.isDefined)(visibleIndex)) {
      resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
      this._hideVisibleColumn({
        isCommandColumn: true,
        visibleIndex
      });
    }
  }
  /**
   * @extended: keyboard_navigation
   */
  _showHiddenCellsInView(_ref) {
    let {
      $cells,
      isCommandColumn
    } = _ref;
    let cssClassNameToRemove = this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    if (isCommandColumn) {
      cssClassNameToRemove = COMMAND_ADAPTIVE_HIDDEN_CLASS;
      $cells.attr({
        tabIndex: 0,
        'aria-hidden': null
      }).removeClass(cssClassNameToRemove);
    } else {
      $cells.removeClass(cssClassNameToRemove);
    }
  }
  _showHiddenColumns() {
    for (let i = 0; i < COLUMN_VIEWS.length; i++) {
      // TODO getView
      // @ts-expect-error
      const view = this.getView(COLUMN_VIEWS[i]);
      if (view && view.isVisible() && view.element()) {
        const viewName = view.name;
        const $hiddenCommandCells = view.element().find(`.${COMMAND_ADAPTIVE_HIDDEN_CLASS}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCommandCells,
          isCommandColumn: true
        });
        const $hiddenCells = view.element().find(`.${this.addWidgetPrefix(HIDDEN_COLUMN_CLASS)}`);
        this._showHiddenCellsInView({
          viewName,
          $cells: $hiddenCells
        });
      }
    }
  }
  _isCellValid($cell) {
    return $cell && $cell.length && !$cell.hasClass(MASTER_DETAIL_CELL_CLASS) && !$cell.hasClass(GROUP_CELL_CLASS);
  }
  _hideVisibleColumn(_ref2) {
    let {
      isCommandColumn,
      visibleIndex
    } = _ref2;
    const that = this;
    COLUMN_VIEWS.forEach(viewName => {
      // TODO: getView
      // @ts-expect-error
      const view = that.getView(viewName);
      view && that._hideVisibleColumnInView({
        view,
        isCommandColumn,
        visibleIndex
      });
    });
  }
  _hideVisibleColumnInView(_ref3) {
    let {
      view,
      isCommandColumn,
      visibleIndex
    } = _ref3;
    const viewName = view.name;
    let $cellElement;
    const column = this._columnsController.getVisibleColumns()[visibleIndex];
    const editFormRowIndex = this._editingController && this._editingController.getEditFormRowIndex();
    if (view && view.isVisible() && column) {
      const rowsCount = view.getRowsCount();
      const $rowElements = view._getRowElements();
      for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const cancelClassAdding = rowIndex === editFormRowIndex && viewName === ROWS_VIEW && this.option('editing.mode') !== 'popup';
        if (!cancelClassAdding) {
          const currentVisibleIndex = viewName === COLUMN_HEADERS_VIEW ? this._columnsController.getVisibleIndex(column.index, rowIndex) : visibleIndex;
          if (currentVisibleIndex >= 0) {
            const $rowElement = $rowElements.eq(rowIndex);
            $cellElement = this._findCellElementInRow($rowElement, currentVisibleIndex);
            this._isCellValid($cellElement) && this._hideVisibleCellInView({
              viewName,
              isCommandColumn,
              $cell: $cellElement
            });
          }
        }
      }
    }
  }
  _findCellElementInRow($rowElement, visibleColumnIndex) {
    const $rowCells = $rowElement.children();
    let visibleIndex = visibleColumnIndex;
    let cellIsInsideGroup = false;
    if ($rowElement.hasClass(GROUP_ROW_CLASS)) {
      const $groupCell = $rowElement.find(`.${GROUP_CELL_CLASS}`);
      const colSpan = $groupCell.attr('colspan');
      if ($groupCell.length && (0, _type.isDefined)(colSpan)) {
        // eslint-disable-next-line radix
        const groupCellLength = parseInt(colSpan);
        const endGroupIndex = $groupCell.index() + groupCellLength - 1;
        if (visibleColumnIndex > endGroupIndex) {
          visibleIndex = visibleColumnIndex - groupCellLength + 1;
        } else {
          cellIsInsideGroup = true;
        }
      }
    }
    const $cellElement = !cellIsInsideGroup ? $rowCells.eq(visibleIndex) : undefined;
    return $cellElement;
  }
  /**
   * @extended: keyboard_navigation
   */
  _hideVisibleCellInView(_ref4) {
    let {
      $cell,
      isCommandColumn
    } = _ref4;
    const cssClassNameToAdd = isCommandColumn ? COMMAND_ADAPTIVE_HIDDEN_CLASS : this.addWidgetPrefix(HIDDEN_COLUMN_CLASS);
    $cell.attr({
      tabIndex: -1,
      'aria-hidden': true
    }).addClass(cssClassNameToAdd);
  }
  _getEditMode() {
    return this._editingController.getEditMode();
  }
  isFormOrPopupEditMode() {
    const editMode = this._getEditMode();
    return editMode === EDIT_MODE_FORM || editMode === EDIT_MODE_POPUP;
  }
  hideRedundantColumns(resultWidths, visibleColumns, hiddenQueue) {
    const that = this;
    this._hiddenColumns = [];
    if (that._isVisibleColumnsValid(visibleColumns) && hiddenQueue.length) {
      let totalWidth = 0;
      const $rootElement = that.component.$element();
      let rootElementWidth = (0, _size.getWidth)($rootElement) - that._getCommandColumnsWidth();
      const getVisibleContentColumns = function () {
        return visibleColumns.filter(item => !item.command && this._hiddenColumns.filter(i => i.index === item.index).length === 0);
      }.bind(this);
      let visibleContentColumns = getVisibleContentColumns();
      const contentColumnsCount = visibleContentColumns.length;
      let i;
      let hasHiddenColumns;
      let needHideColumn;
      do {
        needHideColumn = false;
        totalWidth = 0;
        const percentWidths = that._calculatePercentWidths(resultWidths, visibleColumns);
        const columnsCanFit = percentWidths < 100 && percentWidths !== 0;
        for (i = 0; i < visibleColumns.length; i++) {
          const visibleColumn = visibleColumns[i];
          let columnWidth = that._getNotTruncatedColumnWidth(visibleColumn, rootElementWidth, visibleContentColumns, columnsCanFit);
          const columnId = getColumnId(that, visibleColumn);
          const widthOption = that._columnsController.columnOption(columnId, 'width');
          const minWidth = that._columnsController.columnOption(columnId, 'minWidth');
          const columnBestFitWidth = that._columnsController.columnOption(columnId, 'bestFitWidth');
          if (resultWidths[i] === HIDDEN_COLUMNS_WIDTH) {
            hasHiddenColumns = true;
            continue;
          }
          if (!columnWidth && !visibleColumn.command && !visibleColumn.fixed) {
            needHideColumn = true;
            break;
          }
          if (!widthOption || widthOption === 'auto') {
            columnWidth = Math.max(columnBestFitWidth || 0, minWidth || 0);
          }
          if (visibleColumn.command !== ADAPTIVE_COLUMN_NAME || hasHiddenColumns) {
            totalWidth += columnWidth;
          }
        }
        needHideColumn = needHideColumn || totalWidth > (0, _size.getWidth)($rootElement);
        if (needHideColumn) {
          const column = hiddenQueue.pop();
          const visibleIndex = that._columnsController.getVisibleIndex(column.index);
          rootElementWidth += that._calculateColumnWidth(column, rootElementWidth, visibleContentColumns, columnsCanFit);
          that._hideVisibleColumn({
            visibleIndex
          });
          resultWidths[visibleIndex] = HIDDEN_COLUMNS_WIDTH;
          this._hiddenColumns.push(column);
          visibleContentColumns = getVisibleContentColumns();
        }
      } while (needHideColumn && visibleContentColumns.length > 1 && hiddenQueue.length);
      if (contentColumnsCount === visibleContentColumns.length) {
        that._hideAdaptiveColumn(resultWidths, visibleColumns);
      }
    } else {
      that._hideAdaptiveColumn(resultWidths, visibleColumns);
    }
  }
  getAdaptiveDetailItems() {
    return this._$itemContents;
  }
  getItemContentByColumnIndex(visibleColumnIndex) {
    let $itemContent;
    for (let i = 0; i < this._$itemContents.length; i++) {
      $itemContent = this._$itemContents.eq(i);
      const item = $itemContent.data('dx-form-item');
      if (item && item.column && this._columnsController.getVisibleIndex(item.column.index) === visibleColumnIndex) {
        return $itemContent;
      }
    }
  }
  toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    if (!(this.isFormOrPopupEditMode() && this._editingController.isEditing())) {
      // @ts-expect-error
      this._dataController.toggleExpandAdaptiveDetailRow(key, alwaysExpanded);
    }
  }
  createFormByHiddenColumns(container, options) {
    const that = this;
    const $container = (0, _renderer.default)(container);
    const userFormOptions = {
      items: that._getFormItemsByHiddenColumns(that._hiddenColumns),
      formID: `dx-${new _guid.default()}`
    };
    // @ts-expect-error
    const defaultFormOptions = (0, _themes.isMaterial)() ? {
      colCount: 2
    } : {};
    this.executeAction('onAdaptiveDetailRowPreparing', {
      formOptions: userFormOptions
    });
    that._$itemContents = null;
    that._form = that._createComponent((0, _renderer.default)('<div>').appendTo($container), _form.default, (0, _extend.extend)(defaultFormOptions, userFormOptions, {
      customizeItem(item) {
        const column = item.column || that._columnsController.columnOption(item.name || item.dataField);
        if (column) {
          item.label = item.label || {};
          item.label.text = item.label.text || column.caption;
          item.column = column;
          item.template = that._getTemplate(item, options, that.updateForm.bind(that));
        }
        userFormOptions.customizeItem && userFormOptions.customizeItem.call(this, item);
      },
      onContentReady(e) {
        userFormOptions.onContentReady && userFormOptions.onContentReady.call(this, e);
        that._$itemContents = $container.find(`.${FORM_ITEM_CONTENT_CLASS}`);
      }
    }));
  }
  hasAdaptiveDetailRowExpanded() {
    // @ts-expect-error
    return (0, _type.isDefined)(this._dataController.adaptiveExpandedKey());
  }
  updateForm(hiddenColumns) {
    if (this.hasAdaptiveDetailRowExpanded()) {
      if (this._form && (0, _type.isDefined)(this._form._contentReadyAction)) {
        if (hiddenColumns && hiddenColumns.length) {
          this._form.option('items', this._getFormItemsByHiddenColumns(hiddenColumns));
        } else {
          this._form.repaint();
        }
      }
    }
  }
  updateHidingQueue(columns) {
    const that = this;
    const hideableColumns = columns.filter(column => column.visible && !column.type && !column.fixed && !((0, _type.isDefined)(column.groupIndex) && column.groupIndex >= 0));
    let columnsHasHidingPriority;
    let i;
    that._hidingColumnsQueue = [];
    if (that.option('allowColumnResizing') && that.option('columnResizingMode') === 'widget') {
      return that._hidingColumnsQueue;
    }
    for (i = 0; i < hideableColumns.length; i++) {
      if ((0, _type.isDefined)(hideableColumns[i].hidingPriority) && hideableColumns[i].hidingPriority >= 0) {
        columnsHasHidingPriority = true;
        that._hidingColumnsQueue[hideableColumns[i].hidingPriority] = hideableColumns[i];
      }
    }
    if (columnsHasHidingPriority) {
      that._hidingColumnsQueue.reverse();
    } else if (that.option('columnHidingEnabled')) {
      for (i = 0; i < hideableColumns.length; i++) {
        const visibleIndex = that._columnsController.getVisibleIndex(hideableColumns[i].index);
        that._hidingColumnsQueue[visibleIndex] = hideableColumns[i];
      }
    }
    that._hidingColumnsQueue = that._hidingColumnsQueue.filter(Object);
    return that._hidingColumnsQueue;
  }
  getHiddenColumns() {
    return this._hiddenColumns;
  }
  hasHiddenColumns() {
    return this._hiddenColumns.length > 0;
  }
  getHidingColumnsQueue() {
    return this._hidingColumnsQueue;
  }
  isAdaptiveDetailRowExpanded(key) {
    const dataController = this._dataController;
    // @ts-expect-error
    return dataController.adaptiveExpandedKey() && (0, _common.equalByValue)(dataController.adaptiveExpandedKey(), key);
  }
  expandAdaptiveDetailRow(key) {
    if (!this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow(key);
    }
  }
  collapseAdaptiveDetailRow() {
    if (this.hasAdaptiveDetailRowExpanded()) {
      this.toggleExpandAdaptiveDetailRow();
    }
  }
  updateCommandAdaptiveAriaLabel(key, label) {
    const rowIndex = this._dataController.getRowIndexByKey(key);
    if (rowIndex === -1) {
      return;
    }
    // @ts-expect-errors
    const $row = (0, _renderer.default)(this.component.getRowElement(rowIndex));
    this.setCommandAdaptiveAriaLabel($row, label);
  }
  setCommandAdaptiveAriaLabel($row, labelName) {
    const $adaptiveCommand = $row.find('.dx-command-adaptive');
    $adaptiveCommand.attr('aria-label', _message.default.format(labelName));
  }
}
exports.AdaptiveColumnsController = AdaptiveColumnsController;
const keyboardNavigation = Base => class AdaptivityKeyboardNavigationExtender extends Base {
  _isCellValid($cell, isClick) {
    return super._isCellValid($cell, isClick) && !$cell.hasClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS)) && !$cell.hasClass(COMMAND_ADAPTIVE_HIDDEN_CLASS);
  }
  _processNextCellInMasterDetail($nextCell, $cell) {
    super._processNextCellInMasterDetail($nextCell, $cell);
    const isCellOrBatchMode = this._editingController.isCellOrBatchEditMode();
    const isEditing = this._editingController.isEditing();
    if (isEditing && $nextCell && isCellOrBatchMode && !this._isInsideEditForm($nextCell)) {
      _events_engine.default.off($nextCell, 'focus', focusCellHandler);
      _events_engine.default.on($nextCell, 'focus', {
        $nextCell
      }, focusCellHandler);
      // @ts-expect-error
      _events_engine.default.trigger($cell, 'focus');
    }
  }
  _isCellElement($cell) {
    return super._isCellElement($cell) || $cell.hasClass(ADAPTIVE_ITEM_TEXT_CLASS);
  }
};
const rowsView = Base => class AdaptivityRowsViewExtender extends Base {
  _getCellTemplate(options) {
    const that = this;
    const {
      column
    } = options;
    if (options.rowType === ADAPTIVE_ROW_TYPE && column.command === 'detail') {
      return function (container, options) {
        that._adaptiveColumnsController.createFormByHiddenColumns((0, _renderer.default)(container), options);
      };
    }
    return super._getCellTemplate(options);
  }
  _createRow(row) {
    const $row = super._createRow.apply(this, arguments);
    // @ts-expect-error
    if (row && row.rowType === ADAPTIVE_ROW_TYPE && row.key === this._dataController.adaptiveExpandedKey()) {
      $row.addClass(ADAPTIVE_DETAIL_ROW_CLASS);
    }
    return $row;
  }
  _renderCells($row, options) {
    super._renderCells($row, options);
    const adaptiveColumnsController = this._adaptiveColumnsController;
    const hidingColumnsQueueLength = adaptiveColumnsController.getHidingColumnsQueue().length;
    const hiddenColumnsLength = adaptiveColumnsController.getHiddenColumns().length;
    if (hidingColumnsQueueLength && !hiddenColumnsLength) {
      getDataCellElements($row).last().addClass(LAST_DATA_CELL_CLASS);
    }
    if (options.row.rowType === 'data') {
      adaptiveColumnsController.setCommandAdaptiveAriaLabel($row, EXPAND_ARIA_NAME);
    }
  }
  _getColumnIndexByElementCore($element) {
    const $itemContent = $element.closest(`.${FORM_ITEM_CONTENT_CLASS}`);
    if ($itemContent.length && $itemContent.closest(this.component.$element()).length) {
      const formItem = $itemContent.length ? $itemContent.first().data('dx-form-item') : null;
      return formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
    }
    // @ts-expect-error
    return super._getColumnIndexByElementCore($element);
  }
  _cellPrepared($cell, options) {
    super._cellPrepared.apply(this, arguments);
    if (options.row.rowType !== ADAPTIVE_ROW_TYPE && options.column.visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      $cell.addClass(this.addWidgetPrefix(HIDDEN_COLUMN_CLASS));
    }
  }
  getCell(cellPosition, rows) {
    const item = this._dataController.items()[cellPosition === null || cellPosition === void 0 ? void 0 : cellPosition.rowIndex];
    if ((item === null || item === void 0 ? void 0 : item.rowType) === ADAPTIVE_ROW_TYPE) {
      const $adaptiveDetailItems = this._adaptiveColumnsController.getAdaptiveDetailItems();
      return super.getCell(cellPosition, rows, $adaptiveDetailItems);
    }
    return super.getCell.apply(this, arguments);
  }
  _getCellElement(rowIndex, columnIdentifier) {
    const item = this._dataController.items()[rowIndex];
    if (item && item.rowType === ADAPTIVE_ROW_TYPE) {
      return this._adaptiveColumnsController.getItemContentByColumnIndex(columnIdentifier);
    }
    return super._getCellElement.apply(this, arguments);
  }
  getContextMenuItems(options) {
    var _super$getContextMenu;
    if (options.row && options.row.rowType === 'detailAdaptive') {
      const view = this._columnHeadersView;
      const formItem = (0, _renderer.default)(options.targetElement).closest('.dx-field-item-label').next().data('dx-form-item');
      // @ts-expect-error
      options.column = formItem ? formItem.column : options.column;
      return view.getContextMenuItems && view.getContextMenuItems(options);
    }
    // @ts-expect-error
    return (_super$getContextMenu = super.getContextMenuItems) === null || _super$getContextMenu === void 0 ? void 0 : _super$getContextMenu.call(this, options);
  }
  isClickableElement($target) {
    var _super$isClickableEle;
    // @ts-expect-error
    const isClickable = ((_super$isClickableEle = super.isClickableElement) === null || _super$isClickableEle === void 0 ? void 0 : _super$isClickableEle.call(this, $target)) ?? false;
    return isClickable || !!$target.closest(`.${ADAPTIVE_COLUMN_NAME_CLASS}`).length;
  }
};
const exportExtender = Base => class AdaptivityExportExtender extends Base {
  _updateColumnWidth(column, width) {
    super._updateColumnWidth(column, column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width);
  }
};
const columnsResizer = Base => class AdaptivityColumnsResizerExtender extends Base {
  _pointCreated(point, cellsLength, columns) {
    const result = super._pointCreated(point, cellsLength, columns);
    const currentColumn = columns[point.columnIndex] || {};
    const nextColumnIndex = this._getNextColumnIndex(point.columnIndex);
    const nextColumn = columns[nextColumnIndex] || {};
    const hasHiddenColumnsOnly = nextColumnIndex !== point.columnIndex + 1 && nextColumn.command;
    const hasAdaptiveHiddenWidth = currentColumn.visibleWidth === HIDDEN_COLUMNS_WIDTH || hasHiddenColumnsOnly;
    return result || hasAdaptiveHiddenWidth;
  }
  _getNextColumnIndex(currentColumnIndex) {
    const visibleColumns = this._columnsController.getVisibleColumns();
    let index = super._getNextColumnIndex(currentColumnIndex);
    while (visibleColumns[index] && visibleColumns[index].visibleWidth === HIDDEN_COLUMNS_WIDTH) {
      index++;
    }
    return index;
  }
};
const draggingHeader = Base => class AdaptivityDraggingHeaderExtender extends Base {
  _pointCreated(point, columns, location, sourceColumn) {
    const result = super._pointCreated(point, columns, location, sourceColumn);
    const column = columns[point.columnIndex - 1] || {};
    const hasAdaptiveHiddenWidth = column.visibleWidth === HIDDEN_COLUMNS_WIDTH;
    return result || hasAdaptiveHiddenWidth;
  }
};
const editing = Base => class AdaptivityEditingExtender extends Base {
  _isRowEditMode() {
    return this.getEditMode() === EDIT_MODE_ROW;
  }
  _getFormEditItemTemplate(cellOptions, column) {
    if (this.getEditMode() !== EDIT_MODE_ROW && cellOptions.rowType === 'detailAdaptive') {
      cellOptions.columnIndex = this._columnsController.getVisibleIndex(column.index);
      return this.getColumnTemplate(cellOptions);
    }
    return super._getFormEditItemTemplate(cellOptions, column);
  }
  _closeEditItem($targetElement) {
    const $itemContents = $targetElement.closest(`.${FORM_ITEM_CONTENT_CLASS}`);
    // @ts-expect-error
    const rowIndex = this._dataController.getRowIndexByKey(this._dataController.adaptiveExpandedKey()) + 1;
    const formItem = $itemContents.length ? $itemContents.first().data('dx-form-item') : null;
    const columnIndex = formItem && formItem.column && this._columnsController.getVisibleIndex(formItem.column.index);
    if (!this.isEditCell(rowIndex, columnIndex)) {
      super._closeEditItem($targetElement);
    }
  }
  _beforeUpdateItems(rowIndices, rowIndex) {
    if (!this._adaptiveColumnsController.isFormOrPopupEditMode() && this._adaptiveColumnsController.hasHiddenColumns()) {
      const items = this._dataController.items();
      const item = items[rowIndex];
      // @ts-expect-error
      const oldExpandRowIndex = _m_utils.default.getIndexByKey(this._dataController.adaptiveExpandedKey(), items);
      this._isForceRowAdaptiveExpand = !this._adaptiveColumnsController.hasAdaptiveDetailRowExpanded();
      if (oldExpandRowIndex >= 0) {
        rowIndices.push(oldExpandRowIndex + 1);
      }
      rowIndices.push(rowIndex + 1);
      // @ts-expect-error
      this._dataController.adaptiveExpandedKey(item.key);
    }
  }
  _afterInsertRow(key) {
    super._afterInsertRow.apply(this, arguments);
    if (this._adaptiveColumnsController.hasHiddenColumns()) {
      // @ts-expect-error
      this._adaptiveColumnsController.toggleExpandAdaptiveDetailRow(key, this.isRowEditMode());
      this._isForceRowAdaptiveExpand = true;
    }
  }
  _collapseAdaptiveDetailRow() {
    if (this._isRowEditMode() && this._isForceRowAdaptiveExpand) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
      this._isForceRowAdaptiveExpand = false;
    }
  }
  _cancelEditAdaptiveDetailRow() {
    if (this._adaptiveColumnsController.hasHiddenColumns()) {
      this._collapseAdaptiveDetailRow();
    }
  }
  _afterSaveEditData() {
    super._afterSaveEditData.apply(this, arguments);
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    if (this._isRowEditMode() && this._adaptiveColumnsController.hasHiddenColumns()) {
      (0, _deferred.when)(this._validatingController.validate(true)).done(isValid => {
        if (isValid) {
          this._cancelEditAdaptiveDetailRow();
        }
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise();
  }
  _beforeCancelEditData() {
    super._beforeCancelEditData();
    this._cancelEditAdaptiveDetailRow();
  }
  _getRowIndicesForCascadeUpdating(row) {
    const rowIndices = super._getRowIndicesForCascadeUpdating.apply(this, arguments);
    if (this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(row.key)) {
      rowIndices.push(row.rowType === ADAPTIVE_ROW_TYPE ? row.rowIndex - 1 : row.rowIndex + 1);
    }
    return rowIndices;
  }
  _beforeCloseEditCellInBatchMode(rowIndices) {
    // @ts-expect-error
    const expandedKey = this._dataController._adaptiveExpandedKey;
    if (expandedKey) {
      const rowIndex = _m_utils.default.getIndexByKey(expandedKey, this._dataController.items());
      if (rowIndex > -1) {
        rowIndices.unshift(rowIndex);
      }
    }
  }
  editRow(rowIndex) {
    if (this._adaptiveColumnsController.isFormOrPopupEditMode()) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
    }
    return super.editRow(rowIndex);
  }
  deleteRow(rowIndex) {
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
    if (this.getEditMode() === EDIT_MODE_BATCH && this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(rowKey)) {
      this._adaptiveColumnsController.collapseAdaptiveDetailRow();
    }
    super.deleteRow(rowIndex);
  }
};
const data = Base => class AdaptivityDataControllerExtender extends Base {
  init() {
    super.init();
    this._adaptiveExpandedKey = undefined;
  }
  _processItems(items, change) {
    const {
      changeType
    } = change;
    items = super._processItems.apply(this, arguments);
    if (changeType === 'loadingAll' || !(0, _type.isDefined)(this._adaptiveExpandedKey)) {
      return items;
    }
    const expandRowIndex = _m_utils.default.getIndexByKey(this._adaptiveExpandedKey, items);
    const newMode = this.option(LEGACY_SCROLLING_MODE) === false;
    if (expandRowIndex >= 0) {
      const item = items[expandRowIndex];
      items.splice(expandRowIndex + 1, 0, {
        visible: true,
        rowType: ADAPTIVE_ROW_TYPE,
        key: item.key,
        data: item.data,
        node: item.node,
        modifiedValues: item.modifiedValues,
        isNewRow: item.isNewRow,
        values: item.values
      });
    } else if (changeType === 'refresh' && !(newMode && change.repaintChangesOnly)) {
      this._adaptiveExpandedKey = undefined;
    }
    return items;
  }
  _getRowIndicesForExpand(key) {
    // @ts-expect-error
    const rowIndices = super._getRowIndicesForExpand.apply(this, arguments);
    if (this._adaptiveColumnsController.isAdaptiveDetailRowExpanded(key)) {
      const lastRowIndex = rowIndices[rowIndices.length - 1];
      rowIndices.push(lastRowIndex + 1);
    }
    return rowIndices;
  }
  adaptiveExpandedKey(value) {
    if ((0, _type.isDefined)(value)) {
      this._adaptiveExpandedKey = value;
    } else {
      return this._adaptiveExpandedKey;
    }
  }
  toggleExpandAdaptiveDetailRow(key, alwaysExpanded) {
    const that = this;
    let oldExpandLoadedRowIndex = _m_utils.default.getIndexByKey(that._adaptiveExpandedKey, that._items);
    let newExpandLoadedRowIndex = _m_utils.default.getIndexByKey(key, that._items);
    if (oldExpandLoadedRowIndex >= 0 && oldExpandLoadedRowIndex === newExpandLoadedRowIndex && !alwaysExpanded) {
      key = undefined;
      newExpandLoadedRowIndex = -1;
    }
    const oldKey = that._adaptiveExpandedKey;
    that._adaptiveExpandedKey = key;
    if (oldExpandLoadedRowIndex >= 0) {
      oldExpandLoadedRowIndex++;
    }
    if (newExpandLoadedRowIndex >= 0) {
      newExpandLoadedRowIndex++;
    }
    const rowIndexDelta = that.getRowIndexDelta();
    that.updateItems({
      allowInvisibleRowIndices: true,
      changeType: 'update',
      rowIndices: [oldExpandLoadedRowIndex - rowIndexDelta, newExpandLoadedRowIndex - rowIndexDelta]
    });
    this._adaptiveColumnsController.updateCommandAdaptiveAriaLabel(key, COLLAPSE_ARIA_NAME);
    this._adaptiveColumnsController.updateCommandAdaptiveAriaLabel(oldKey, EXPAND_ARIA_NAME);
  }
};
const editorFactory = Base => class AdaptivityEditorFactoryExtender extends Base {
  _needHideBorder($element) {
    return super._needHideBorder($element) || ($element === null || $element === void 0 ? void 0 : $element.hasClass('dx-field-item-content')) && ($element === null || $element === void 0 ? void 0 : $element.find('.dx-checkbox').length);
  }
  _getFocusCellSelector() {
    return `${super._getFocusCellSelector()}, .dx-adaptive-detail-row .dx-field-item > .dx-field-item-content`;
  }
  /**
   * Overrides interface
   */
  _getRevertTooltipsSelector() {
    return `${super._getRevertTooltipsSelector()}, .dx-field-item-content .${this.addWidgetPrefix(REVERT_TOOLTIP_CLASS)}`;
  }
};
const columns = Base => class AdaptivityColumnsExtender extends Base {
  _isColumnVisible(column) {
    return super._isColumnVisible(column) && !column.adaptiveHidden;
  }
};
const resizing = Base => class AdaptivityResizingControllerExtender extends Base {
  dispose() {
    super.dispose.apply(this, arguments);
    clearTimeout(this._updateScrollableTimeoutID);
  }
  _needBestFit() {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return super._needBestFit() || !!this._adaptiveColumnsController.getHidingColumnsQueue().length;
  }
  _correctColumnWidths(resultWidths, visibleColumns) {
    const adaptiveController = this._adaptiveColumnsController;
    const oldHiddenColumns = adaptiveController.getHiddenColumns();
    const hidingColumnsQueue = adaptiveController.updateHidingQueue(this._columnsController.getColumns());
    adaptiveController.hideRedundantColumns(resultWidths, visibleColumns, hidingColumnsQueue);
    const hiddenColumns = adaptiveController.getHiddenColumns();
    if (adaptiveController.hasAdaptiveDetailRowExpanded()) {
      if (oldHiddenColumns.length !== hiddenColumns.length) {
        adaptiveController.updateForm(hiddenColumns);
      }
    }
    !hiddenColumns.length && adaptiveController.collapseAdaptiveDetailRow();
    return super._correctColumnWidths.apply(this, arguments);
  }
  _toggleBestFitMode(isBestFit) {
    isBestFit && this._adaptiveColumnsController._showHiddenColumns();
    super._toggleBestFitMode(isBestFit);
  }
  _needStretch() {
    const adaptiveColumnsController = this._adaptiveColumnsController;
    return super._needStretch.apply(this, arguments) || adaptiveColumnsController.getHidingColumnsQueue().length || adaptiveColumnsController.hasHiddenColumns();
  }
};
const adaptivityModule = exports.adaptivityModule = {
  defaultOptions() {
    return {
      columnHidingEnabled: false,
      // @ts-expect-error
      onAdaptiveDetailRowPreparing: null
    };
  },
  controllers: {
    adaptiveColumns: AdaptiveColumnsController
  },
  extenders: {
    views: {
      rowsView
    },
    controllers: {
      export: exportExtender,
      columnsResizer,
      draggingHeader,
      editing,
      resizing,
      data,
      editorFactory,
      columns,
      keyboardNavigation
    }
  }
};