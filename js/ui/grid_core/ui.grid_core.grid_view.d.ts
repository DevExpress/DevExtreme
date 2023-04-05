import { Controllers, ViewController } from './ui.grid_core.modules';

interface ResizingControllerState {
  _columnHeadersView: any;
  _columnsController: any;
  _devicePixelRatio: any;
  _footerView: any;
  _hasHeight: any;
  _hasWidth: any;
  _lastHeight: any;
  _lastWidth: any;
  _maxWidth: any;
  _refreshSizesHandler: any;
  _resizeDeferred: any;
  _rowsView: any;

  _updateScrollableTimeoutID: any;

  _dataController: Controllers['data'];
  _adaptiveColumnsController: Controllers['adaptiveColumns'];
}

interface ResizingController extends ViewController, ResizingControllerState {
  _initPostRenderHandlers: (this: this) => any;

  _refreshSizes: (this: this, e) => any;

  fireContentReadyAction: (this: this) => any;

  _setAriaRowColCount: (this: this) => any;

  _getBestFitWidths: (this: this) => any;

  _setVisibleWidths: (this: this, visibleColumns, widths) => any;

  _toggleBestFitModeForView: (this: this, view, className, isBestFit) => any;

  _toggleBestFitMode: (this: this, isBestFit) => any;

  _toggleContentMinHeight: (this: this, isBestFit) => any;

  _synchronizeColumns: (this: this) => any;

  _needBestFit: (this: this) => any;

  _needStretch: (this: this) => any;

  _getAverageColumnsWidth: (this: this, resultWidths) => any;

  _correctColumnWidths: (this: this, resultWidths, visibleColumns) => any;

  _processStretch: (this: this, resultSizes, visibleColumns) => any;

  _getRealColumnWidth: (this: this, columnIndex, columnWidths, groupWidth?) => any;

  _getTotalWidth: (this: this, widths, groupWidth) => any;

  updateSize: (this: this, rootElement) => any;

  resize: (this: this) => any;

  updateDimensions: (this: this, checkSize?) => any;

  _resetGroupElementHeight: (this: this) => any;

  _checkSize: (this: this, checkSize) => any;

  _setScrollerSpacingCore: (this: this, hasHeight) => any;

  _setScrollerSpacing: (this: this, hasHeight) => any;

  _updateDimensionsCore: (this: this) => any;

  _updateLastSizes: (this: this, $rootElement) => any;
}
