import { DeferredObj } from '../../core/utils/deferred';
import { HandleDataChangedArguments } from './ui.grid_core.data_controller';
import { Controllers, View } from './ui.grid_core.modules';

export class ColumnsView extends View {
  // State:
  _columnsController: Controllers['columns'];

  _dataController: Controllers['data'];

  _delayedTemplates: any[];

  _templateDeferreds: Set<DeferredObj<void>>;

  _templatesCache: any;

  _tableElement: any;

  _scrollLeft: any;

  _requireReady: any;

  scrollChanged: any;

  _templateTimeout?: number;

  // Methods:
  _handleDataChanged: (this: this, e: HandleDataChangedArguments) => void;

  _createScrollableOptions: (this: this) => any;

  _updateCell: (this: this, $cell, parameters) => any;

  _createCell: (this: this, options) => any;

  _createRow: (this: this, rowObject?, tagName?) => any;

  _isAltRow: (this: this, row) => any;

  _createTable: (this: this, columns, isAppend) => any;

  _rowPointerDown: (this: this, ...args: any[]) => any;

  _rowClick: any;

  _rowDblClick: any;

  _createColGroup: (this: this, columns) => any;

  _createCol: (this: this, column) => any;

  renderDelayedTemplates: (this: this, change?) => any;

  _renderDelayedTemplatesCoreAsync: (this: this, templates) => any;

  _renderDelayedTemplatesCore: (this: this, templates, isAsync, change?) => any;

  _processTemplate: (this: this, template, options?) => any;

  renderTemplate: (this: this, container, template, options, allowRenderToDetachedContainer, change?) => any;

  _getBodies: (this: this, tableElement) => any;

  _needWrapRow: (this: this, $tableElement) => any;

  _wrapRowIfNeed: (this: this, $table, $row, isRefreshing?) => any;

  _appendRow: (this: this, $table, $row, appendTemplate?) => any;

  _resizeCore: (this: this) => any;

  _renderCore: (this: this, e?) => any;

  _renderTable: (this: this, options) => any;

  _renderRows: (this: this, $table, options) => any;

  _renderRow: (this: this, $table, options) => any;

  _needRenderCell: (this: this, columnIndex, columnIndices) => any;

  _renderCells: (this: this, $row, options) => any;

  _updateCells: (this: this, $rowElement, $newRowElement, columnIndices) => any;

  _setCellAriaAttributes: (this: this, $cell, cellOptions) => any;

  _renderCell: (this: this, $row, options) => any;

  _renderCellContent: (this: this, $cell, options, renderOptions) => any;

  _getCellTemplate: (this: this, options) => any;

  _getRows: (this: this, change?) => any;

  _getCellOptions: (this: this, options) => any;

  _addWatchMethod: (this: this, options, source?) => any;

  _cellPrepared: (this: this, cell, options) => any;

  _rowPrepared: (this: this, $row, options, row?) => any;

  _columnOptionChanged: (this: this, e) => any;

  getCellIndex: (this: this, ...args: any[]) => any;

  getTableElements: (this: this) => any;

  getTableElement: (this: this) => any;

  setTableElement: (this: this, tableElement) => any;

  _afterRowPrepared: any;

  callbackNames: (this: this) => any;

  _updateScrollLeftPosition: (this: this) => any;

  scrollTo: (this: this, pos) => any;

  _wrapTableInScrollContainer: (this: this, $table) => any;

  needWaitAsyncTemplates: (this: this) => boolean;

  waitAsyncTemplates: (this: this, forceWaiting?: boolean) => DeferredObj<unknown>;

  _updateContent: (this: this, $newTableElement, change) => any;

  _findContentElement: any;

  _getWidths: (this: this, $cellElements) => any;

  getColumnWidths: (this: this, $tableElement) => any;

  getVisibleColumnIndex: (this: this, columnIndex, rowIndex) => any;

  setColumnWidths: (this: this, options: {
   widths: any; $tableElement?: any; columns?: any; fixed?: any; optionNames: any;
  }) => any;

  getCellElements: (this: this, rowIndex) => any;

  _getCellElementsCore: (this: this, rowIndex) => any;

  _getCellElement: (this: this, rowIndex, columnIdentifier) => any;

  _getRowElement: (this: this, rowIndex) => any;

  getCellElement: (this: this, rowIndex, columnIdentifier) => any;

  getRowElement: (this: this, rowIndex) => any;

  _getVisibleColumnIndex: (this: this, $cells, rowIndex, columnIdentifier) => any;

  getColumnElements: (this: this) => any;

  getColumns: (this: this, rowIndex?, $tableElement?) => any;

  getCell: (this: this, cellPosition, rows, cells) => any;

  getRowsCount: (this: this) => any;

  _getRowElementsCore: (this: this, tableElement) => any;

  _getRowElements: (this: this, tableElement?) => any;

  getRowIndex: (this: this, $row) => any;

  getBoundingRect: (this: this) => any;

  getName: (this: this) => any;

  setScrollerSpacing: (this: this, width) => any;

  isScrollbarVisible: (this: this, isHorizontal) => any;
}
