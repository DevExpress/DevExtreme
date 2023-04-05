import { ColumnsView } from './ui.grid_core.columns_view';
import { ViewController } from './ui.grid_core.modules';

interface ColumnChooserViewState {
  _popupContainer: any;
  _columnChooserList: any;
  _isPopupContainerShown: boolean;
}

export interface ColumnChooserView extends ColumnChooserViewState, ColumnsView {
  _isWinDevice: (this: this) => any;

  _updateList: (this: this, change) => any;

  _initializePopupContainer: (this: this) => any;

  _renderTreeView: (this: this, $container, items) => any;

  _prepareDragModeConfig: (this: this) => any;

  _prepareSelectModeConfig: (this: this) => any;

  optionChanged: (this: this, args) => any;

  getColumnElements: (this: this) => any;

  getColumns: (this: this) => any;

  allowDragging: (this: this, column, sourceLocation) => any;

  getBoundingRect: (this: this) => any;

  showColumnChooser: (this: this) => any;

  hideColumnChooser: (this: this) => any;

  isColumnChooserVisible: (this: this) => any;
}

interface ColumnChooserController extends ViewController {
  renderShowColumnChooserButton: (this: this, ...args: any[]) => any;

  getPosition: (this: this, ...args: any[]) => any;
}
