import { ColumnsView } from './ui.grid_core.columns_view';
import LoadPanel from '../load_panel';
import dxScrollable from '../scroll_view/ui.scrollable';
import { dxElementWrapper } from '../../core/renderer';
import { Controllers } from './ui.grid_core.modules';

interface State {
  _loadPanel: LoadPanel;
  _scrollable: dxScrollable;

  resizeCompleted: any;
  renderCompleted: any;

  _hasHeight: boolean;
  _scrollRight: number;
  _scrollTop: number;
  _scrollableContainer: dxElementWrapper;
  _rowHeight: number | null;
  _lastColumnWidths: any;

  _hideLoadingTimeoutID: any;
  _pointerDownTimeout: any;
  _scrollToFocusOnResize: any;

  _adaptiveColumnsController: Controllers['adaptiveColumns'];
  _editingController: Controllers['editing'];
}

export interface RowsView extends State, ColumnsView {
  _getDefaultTemplate: (this: this, column) => any;

  _getDefaultGroupTemplate: (this: this, column) => any;

  _update: (this: this, change?) => any;

  _getCellTemplate: (this: this, options) => any;

  _rowPrepared: (this: this, $row, rowOptions, row) => any;

  _setAriaRowIndex: (this: this, row, $row) => any;

  _afterRowPrepared: (this: this, e) => any;

  _renderScrollable: (this: this, force?) => any;

  _handleScroll: (this: this, e) => any;

  _renderScrollableCore: (this: this, $element) => any;

  _renderLoadPanel: (this: this, ...args) => any;

  _renderContent: (this: this, contentElement, tableElement) => any;

  _updateContent: (this: this, newTableElement, change) => any;

  _createEmptyRow: (this: this, className?, isFixed?, height?) => any;

  _appendEmptyRow: (this: this, $table, $emptyRow, location?) => any;

  _renderFreeSpaceRow: (this: this, $tableElement, change) => any;

  _checkRowKeys: (this: this, options) => any;

  _needUpdateRowHeight: (this: this, itemsCount) => any;

  _getRowsHeight: (this: this, $tableElement) => any;

  _updateRowHeight: (this: this) => any;

  _findContentElement: (this: this) => any;

  _getFreeSpaceRowElements: (this: this, $table) => any;

  getFixedColumns: (this: this) => any;

  _getNoDataText: (this: this) => any;

  _rowClick: (this: this, e) => any;

  _rowDblClick: (this: this, e) => any;

  _getColumnsCountBeforeGroups: (this: this, columns) => any;

  _getGroupCellOptions: (this: this, options) => any;

  _needWrapRow: (this: this) => any;

  _renderCells: (this: this, $row, options) => any;

  _renderGroupedCells: (this: this, $row, options) => any;

  _renderRows: (this: this, $table, options) => any;

  _renderDataRowByTemplate: (this: this, $table, options, dataRowTemplate) => any;

  _renderRow: (this: this, $table, options) => any;

  _renderTable: (this: this, options) => any;

  _createTable: (this: this) => any;

  _renderCore: (this: this, change) => any;

  _getRows: (this: this, change) => any;

  _getCellOptions: (this: this, options) => any;

  _setRowsOpacityCore: (this: this, $rows, visibleColumns, columnIndex, value) => any;

  _getDevicePixelRatio: (this: this) => any;

  renderNoDataText: any;

  getCellOptions: (this: this, rowIndex, columnIdentifier) => any;

  getRow: (this: this, index) => any;

  updateFreeSpaceRowHeight: (this: this, $table?) => any;

  _getHeightCorrection: (this: this) => any;

  _columnOptionChanged: (this: this, e) => any;

  getScrollable: (this: this) => any;

  init: (this: this) => any;

  _handleDataChanged: (this: this, change) => any;

  publicMethods: (this: this) => any;

  contentWidth: (this: this) => any;

  getScrollbarWidth: (this: this, isHorizontal?) => any;

  _fireColumnResizedCallbacks: (this: this) => any;

  _updateLastRowBorder: (this: this, isFreeSpaceRowVisible) => any;

  _updateScrollable: (this: this) => any;

  _updateHorizontalScrollPosition: (this: this) => any;

  _resizeCore: (this: this) => any;

  scrollTo: (this: this, location) => any;

  height: (this: this, height) => any;

  hasHeight: (this: this, hasHeight) => any;

  setLoading: (this: this, isLoading, messageText) => any;

  setRowsOpacity: (this: this, columnIndex, value) => any;

  _getCellElementsCore: (this: this, rowIndex) => any;

  _getBoundaryVisibleItemIndex: (this: this, isTop, isFloor) => any;

  getTopVisibleItemIndex: (this: this, isFloor?) => any;

  getBottomVisibleItemIndex: (this: this, isFloor?) => any;

  getTopVisibleRowData: (this: this) => any;

  _scrollToElement: (this: this, $element, offset) => any;

  optionChanged: (this: this, args) => any;

  dispose: (this: this) => any;

  setScrollerSpacing: (this: this) => any;

  _restoreErrorRow: (this: this) => any;

  _getColumnIndexByElementCore: (this: this, ...args: any[]) => any;

  getContextMenuItems: (this: this, ...args: any[]) => any;

  isClickableElement: (this: this, ...args: any[]) => any;

  _getColumnIndexByElement: (this: this, ...args: any[]) => any;

  _editCellByClick: (this: this, ...args: any[]) => any;

  _editCellPrepared: (this: this, ...args: any[]) => any;

  _formItemPrepared: (this: this, ...args: any[]) => any;

  cellValue: (this: this, ...args: any[]) => any;

  _triggerPointerDownEventHandler: (this: this, ...args: any[]) => any;

  renderFocusState: (this: this, ...args: any[]) => any;

  updateFocusElementTabIndex: (this: this, ...args: any[]) => any;

  _updateFocusedCellTabIndex: (this: this, ...args: any[]) => any;

  _renderFocusByChange: (this: this, ...args: any[]) => any;

  _getEditorInstance: (this: this, ...args: any[]) => any;

  _handleEditingNavigationMode: (this: this, ...args: any[]) => any;

  scrollToRowElement: (this: this, ...args: any[]) => any;

  scrollTopPosition: (this: this, ...args: any[]) => any;

  scrollToElementVertically: (this: this, ...args: any[]) => any;

  _setFocusedRowElementTabIndex: (this: this, ...args: any) => any;

  _findRowElementForTabIndex: (this: this, ...args: any) => any;
}
