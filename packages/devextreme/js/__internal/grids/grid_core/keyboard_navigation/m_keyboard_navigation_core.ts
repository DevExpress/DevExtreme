import modules from '../m_modules';
import type { Controllers, OptionChanged, Views } from '../m_types';

export class KeyboardNavigationController extends modules.ViewController {
  protected _columnHeadersView!: Views['columnHeadersView'];

  protected _rowsView!: Views['rowsView'];

  protected _columnsController!: Controllers['columns'];

  public _focusedCellPosition: any;

  protected getColumnByCellElement($cell, focusedView) {
    const cellIndex = focusedView.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();

    return this._columnsController.getVisibleColumns(null, true)[columnIndex];
  }

  protected processOnKeyDown(eventArgs) {
    const { originalEvent } = eventArgs;
    const args = {
      handled: false,
      event: originalEvent,
    };

    this.executeAction('onKeyDown', args);

    eventArgs.ctrl = originalEvent.ctrlKey;
    eventArgs.alt = originalEvent.altKey;
    eventArgs.shift = originalEvent.shiftKey;

    return !!args.handled;
  }

  /**
     * @extended: focus
     */
  protected setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.columnIndex = columnIndex;
  }

  /**
     * @extended: focus
     */
  public setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }
    this._focusedCellPosition.rowIndex = rowIndex;
  }

  public setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  }

  public init() {
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowsView = this.getView('rowsView');
    this._columnsController = this.getController('columns');
    this._focusedCellPosition = {};

    if (this.isKeyboardEnabled()) {
      this.createAction('onKeyDown');
    }
  }

  public optionChanged(args: OptionChanged) {
    switch (args.name) {
      case 'keyboardNavigation':
        if (args.fullName === 'keyboardNavigation.enabled') {
          this.init();
        }
        args.handled = true;
        break;
      case 'useLegacyKeyboardNavigation':
        this.init();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  public isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  }
}
