import { ColumnsView } from './ui.grid_core.columns_view';

interface State {
  _isGroupingChanged: any;
  _lastActionElement: any;
  _hasRowElements: any;
  resizeCompleted: any;
}

interface ColumnHeadersView extends ColumnsView, State {
  _createTable: (this: this) => any;

  _isLegacyKeyboardNavigation: (this: this) => any;

  _getDefaultTemplate: (this: this, column) => any;

  _getHeaderTemplate: (this: this, column) => any;

  _processTemplate: (this: this, template, options) => any;

  _handleDataChanged: (this: this, e) => any;

  _renderCell: (this: this, $row, options) => any;

  _setCellAriaAttributes: (this: this, $cell, cellOptions) => any;

  _createRow: (this: this, row) => any;

  _handleActionKeyDown: (this: this, args) => any;

  _renderCore: (this: this) => any;

  _renderRows: (this: this) => any;

  _getRowVisibleColumns: (this: this, rowIndex) => any;

  _renderRow: (this: this, $table, options) => any;

  _createCell: (this: this, options) => any;

  _getRows: (this: this) => any;

  _getCellTemplate: (this: this, options) => any;

  _isElementVisible: (this: this, elementOptions) => any;

  _alignCaptionByCenter: (this: this, $cell) => any;

  _updateCell: (this: this, $cell, options) => any;

  _updateIndicator: (this: this, $cell, column, indicatorName) => any;

  _getIndicatorContainer: (this: this, $cell, returnAll?) => any;

  _isSortableElement: (this: this) => any;

  getHeadersRowHeight: (this: this) => any;

  getHeaderElement: (this: this, index) => any;

  getColumnElements: (this: this, index?, bandColumnIndex?) => any;

  getColumnIndexByElement: (this: this, $cell) => any;

  getVisibleColumnIndex: (this: this, columnIndex, rowIndex) => any;

  getColumnWidths: (this: this) => any;

  allowDragging: (this: this, column, sourceLocation, draggingPanels) => any;

  getBoundingRect: (this: this) => any;

  getColumnCount: (this: this) => any;

  getHeight: (this: this) => any;

  getContextMenuItems: (this: this, options) => any;

  getRowCount: (this: this) => any;

  setRowsOpacity: (this: this, columnIndex, value, rowIndex) => any;

  _processHeaderAction: (this: this, ...args: any[]) => any;
}
