import { Controllers, ViewController, Views } from '../module_types';

interface State {
  _updateFocusTimeout: any;
  _fastEditingStarted: any;
  _focusedCellPosition: any;
  _canceledCellPosition: any;
  _isNeedScroll: any;
  _focusedView: any;
  _isNeedFocus: any;
  _isHiddenFocus: any;
  _documentClickHandler: any;
  _pointerEventAction: any;
  _keyDownListener: any;
  focusType: any;
  _testInteractiveElement: any;

  _dataController: Controllers['data'];
  _selectionController: Controllers['selection'];
  _editingController: Controllers['editing'];
  _headerPanel: Views['headerPanel'];
  _rowsView: Views['rowsView'];
  _columnsController: Controllers['columns'];
  _editorFactory: Controllers['editorFactory'];
  _adaptiveController: Controllers['adaptiveColumns'];
}

export interface KeyboardNavigationController extends ViewController, State {
  _initViewHandlers: (this: this, ...args: any[]) => any;

  _initDocumentHandlers: (this: this, ...args: any[]) => any;

  _setRowsViewAttributes: (this: this, ...args: any[]) => any;

  _initPointerEventHandler: (this: this, ...args: any[]) => any;

  _initKeyDownHandler: (this: this, ...args: any[]) => any;

  isRowFocusType: (this: this, ...args: any[]) => any;

  isCellFocusType: (this: this, ...args: any[]) => any;

  setRowFocusType: (this: this, ...args: any[]) => any;

  setCellFocusType: (this: this, ...args: any[]) => any;

  _keyDownHandler: (this: this, ...args: any[]) => any;

  _processOnKeyDown: (this: this, ...args: any[]) => any;

  _closeEditCell: (this: this, ...args: any[]) => any;

  _leftRightKeysHandler: (this: this, ...args: any[]) => any;

  _upDownKeysHandler: (this: this, ...args: any[]) => any;

  _pageUpDownKeyHandler: (this: this, ...args: any[]) => any;

  _spaceKeyHandler: (this: this, ...args: any[]) => any;

  _ctrlAKeyHandler: (this: this, ...args: any[]) => any;

  _tabKeyHandler: (this: this, ...args: any[]) => any;

  _getMaxHorizontalOffset: (this: this, ...args: any[]) => any;

  _isColumnRendered: (this: this, ...args: any[]) => any;

  _isFixedColumn: (this: this, ...args: any[]) => any;

  _isColumnVirtual: (this: this, ...args: any[]) => any;

  _processVirtualHorizontalPosition: (this: this, ...args: any[]) => any;

  _getHorizontalScrollPositionOffset: (this: this, ...args: any[]) => any;

  _editingCellTabHandler: (this: this, ...args: any[]) => any;

  _targetCellTabHandler: (this: this, ...args: any[]) => any;

  _getNextCellByTabKey: (this: this, ...args: any[]) => any;

  _checkNewLineTransition: (this: this, ...args: any[]) => any;

  _enterKeyHandler: (this: this, ...args: any[]) => any;

  _processEnterKeyForDataCell: (this: this, ...args: any[]) => any;

  _getEnterKeyDirection: (this: this, ...args: any[]) => any;

  _handleEnterKeyEditingCell: (this: this, ...args: any[]) => any;

  _escapeKeyHandler: (this: this, ...args: any[]) => any;

  _ctrlFKeyHandler: (this: this, ...args: any[]) => any;

  _f2KeyHandler: (this: this, ...args: any[]) => any;

  _navigateNextCell: (this: this, ...args: any[]) => any;

  _arrowKeysHandlerFocusCell: (this: this, ...args: any[]) => any;

  _beginFastEditing: (this: this, ...args: any[]) => any;

  _pointerEventHandler: (this: this, ...args: any[]) => any;

  _clickTargetCellHandler: (this: this, ...args: any[]) => any;

  _allowRowUpdating: (this: this, ...args: any[]) => any;

  focus: (this: this, ...args: any[]) => any;

  getFocusedView: (this: this, ...args: any[]) => any;

  setupFocusedView: (this: this, ...args: any[]) => any;

  _focusElement: (this: this, ...args: any[]) => any;

  _getFocusedViewByElement: (this: this, ...args: any[]) => any;

  _focusView: (this: this, ...args: any[]) => any;

  _resetFocusedView: (this: this, ...args: any[]) => any;

  _focusInteractiveElement: (this: this, ...args: any[]) => any;

  _focus: (this: this, ...args: any[]) => any;

  _updateFocus: (this: this, ...args: any[]) => any;

  _getFocusedCell: (this: this, ...args: any[]) => any;

  _updateFocusedCellPositionByTarget: (this: this, ...args: any[]) => any;

  _updateFocusedCellPosition: (this: this, ...args: any[]) => any;

  _getFocusedColumnIndexOffset: (this: this, ...args: any[]) => any;

  _getFixedColumnIndexOffset: (this: this, ...args: any[]) => any;

  _getCellPosition: (this: this, ...args: any[]) => any;

  _focusCell: (this: this, ...args: any[]) => any;

  _focusEditFormCell: (this: this, ...args: any[]) => any;

  _resetFocusedCell: (this: this, ...args: any[]) => any;

  restoreFocusableElement: (this: this, ...args: any[]) => any;

  _getNewPositionByCode: (this: this, ...args: any[]) => any;

  setFocusedCellPosition: (this: this, ...args: any[]) => any;

  setFocusedRowIndex: (this: this, ...args: any[]) => any;

  setFocusedColumnIndex: (this: this, ...args: any[]) => any;

  getRowIndex: (this: this, ...args: any[]) => any;

  getColumnIndex: (this: this, ...args: any[]) => any;

  getVisibleRowIndex: (this: this, ...args: any[]) => any;

  getVisibleColumnIndex: (this: this, ...args: any[]) => any;

  _applyColumnIndexBoundaries: (this: this, ...args: any[]) => any;

  _isCellByPositionValid: (this: this, ...args: any[]) => any;

  _isLastRow: (this: this, ...args: any[]) => any;

  _isFirstValidCell: (this: this, ...args: any[]) => any;

  _hasValidCellBeforePosition: (this: this, ...args: any[]) => any;

  _hasValidCellAfterPosition: (this: this, ...args: any[]) => any;

  _isLastValidCell: (this: this, ...args: any[]) => any;

  _isCellValid: (this: this, ...args: any[]) => any;

  getFirstValidCellInRow: (this: this, ...args: any[]) => any;

  _getNextCell: (this: this, ...args: any[]) => any;

  _startEditing: (this: this, ...args: any[]) => any;

  _isAllowEditing: (this: this, ...args: any[]) => any;

  _editFocusedCell: (this: this, ...args: any[]) => any;

  _startEditCell: (this: this, ...args: any[]) => any;

  _editingCellHandler: (this: this, ...args: any[]) => any;

  _fireFocusChangingEvents: (this: this, ...args: any[]) => any;

  _fireFocusedCellChanging: (this: this, ...args: any[]) => any;

  _fireFocusedCellChanged: (this: this, ...args: any[]) => any;

  _fireFocusedRowChanging: (this: this, ...args: any[]) => any;

  _fireFocusedRowChanged: (this: this, ...args: any[]) => any;

  _isEventInCurrentGrid: (this: this, ...args: any[]) => any;

  _isRowEditMode: (this: this, ...args: any[]) => any;

  _isCellEditMode: (this: this, ...args: any[]) => any;

  _isFastEditingAllowed: (this: this, ...args: any[]) => any;

  _getInteractiveElement: (this: this, ...args: any[]) => any;

  _applyTabIndexToElement: (this: this, ...args: any[]) => any;

  _getCell: (this: this, ...args: any[]) => any;

  _getRowIndex: (this: this, ...args: any[]) => any;

  _hasSkipRow: (this: this, ...args: any[]) => any;

  _allowEditingOnEnterKey: (this: this, ...args: any[]) => any;

  _isLegacyNavigation: (this: this, ...args: any[]) => any;

  _getDirectionCodeByKey: (this: this, ...args: any[]) => any;

  _isVirtualScrolling: (this: this, ...args: any[]) => any;

  _isVirtualRowRender: (this: this, ...args: any[]) => any;

  _isVirtualColumnRender: (this: this, ...args: any[]) => any;

  _scrollBy: (this: this, ...args: any[]) => any;

  _isInsideEditForm: (this: this, ...args: any[]) => any;

  _isMasterDetailCell: (this: this, ...args: any[]) => any;

  _processNextCellInMasterDetail: (this: this, ...args: any[]) => any;

  _handleTabKeyOnMasterDetailCell: (this: this, ...args: any[]) => any;

  _getElementType: (this: this, ...args: any[]) => any;

  _isFastEditingStarted: (this: this, ...args: any[]) => any;

  _getVisibleColumnCount: (this: this, ...args: any[]) => any;

  _isCellInRow: (this: this, ...args: any[]) => any;

  _getCellElementFromTarget: (this: this, ...args: any[]) => any;

  _getRowsViewElement: (this: this, ...args: any[]) => any;

  isKeyboardEnabled: (this: this, ...args: any[]) => any;

  _processCanceledEditCellPosition: (this: this, ...args: any[]) => any;

  updateFocusedRowIndex: (this: this, ...args: any[]) => any;

  _isCellElement: (this: this, ...args: any[]) => any;
}
