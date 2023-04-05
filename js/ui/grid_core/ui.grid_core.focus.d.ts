import { Controllers, ViewController } from './ui.grid_core.modules';

interface State {
  _dataController: Controllers['data'];
  _keyboardController: Controllers['keyboardNavigation'];
}

interface FocusController extends ViewController, State {
  _triggerFocusedRowChangedIfNeed: (this: this, ...args: any[]) => any;

  isAutoNavigateToFocusedRow: (this: this, ...args: any[]) => any;

  _focusRowByIndex: (this: this, ...args: any[]) => any;

  _focusRowByIndexCore: (this: this, ...args: any[]) => any;

  _isLocalRowIndex: (this: this, ...args: any[]) => any;

  _setFocusedRowKeyByIndex: (this: this, ...args: any[]) => any;

  _focusRowByKey: (this: this, ...args: any[]) => any;

  _resetFocusedRow: (this: this, ...args: any[]) => any;

  _isValidFocusedRowIndex: (this: this, ...args: any[]) => any;

  publicMethods: (this: this, ...args: any[]) => any;

  navigateToRow: (this: this, ...args: any[]) => any;

  _navigateToRow: (this: this, ...args: any[]) => any;

  _navigateTo: (this: this, ...args: any[]) => any;

  _navigateToVisibleRow: (this: this, ...args: any[]) => any;

  _navigateToVirtualRow: (this: this, ...args: any[]) => any;

  _triggerUpdateFocusedRow: (this: this, ...args: any[]) => any;

  getFocusedRowIndexByKey: (this: this, ...args: any[]) => any;

  _focusRowByKeyOrIndex: (this: this, ...args: any[]) => any;

  isRowFocused: (this: this, ...args: any[]) => any;

  updateFocusedRow: (this: this, ...args: any[]) => any;

  _clearPreviousFocusedRow: (this: this, ...args: any[]) => any;

  _prepareFocusedRow: (this: this, ...args: any[]) => any;
}
