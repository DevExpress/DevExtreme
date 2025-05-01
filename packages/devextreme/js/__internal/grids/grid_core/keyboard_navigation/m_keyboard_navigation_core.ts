import eventsEngine from '@js/common/core/events/core/events_engine';
import { keyboard } from '@js/common/core/events/short';
import $ from '@js/core/renderer';

import modules from '../m_modules';
import type { Controllers, OptionChanged } from '../m_types';
import { Direction } from './const';
import { isElementDefined, isFixedColumnIndexOffsetRequired } from './m_keyboard_navigation_utils';

export class KeyboardNavigationController extends modules.ViewController {
  private keyDownListener: any;

  protected isNeedToFocus = false;

  protected renderCompletedWithContext!: (e: any) => void;

  protected focusinHandlerContext!: (event: any) => void;

  protected _columnsController!: Controllers['columns'];

  public _focusedCellPosition: any;

  private _getFocusedColumnIndexOffset(columnIndex) {
    let offset = 0;
    const column = this._columnsController.getVisibleColumns()[columnIndex];

    if (column?.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }

    return offset;
  }

  private _applyColumnIndexBoundaries(columnIndex) {
    const visibleColumnCount = this._columnsController.getVisibleColumns(null, true).length;

    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnCount) {
      columnIndex = visibleColumnCount - 1;
    }

    return columnIndex;
  }

  private unsubscribeFromKeyDownEvent(): void {
    if (this.keyDownListener) {
      keyboard.off(this.keyDownListener);
    }
  }

  private subscribeToKeyDownEvent(): void {
    const $focusedViewElement = this.getFocusedViewElement();

    if ($focusedViewElement) {
      this.keyDownListener = keyboard.on($focusedViewElement, null, (e) => this.keyDownHandler(e));
    }
  }

  protected getFocusedViewElement() {
    return this.getFocusedView()?.element();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected keyDownHandler(e): void {}

  protected initKeyDownHandler(): void {
    this.unsubscribeFromKeyDownEvent();
    this.subscribeToKeyDownEvent();
  }

  private unsubscribeFromFocusinEvent(): void {
    const $focusedView = this.getFocusedViewElement();

    if ($focusedView) {
      eventsEngine.off($focusedView, 'focusin', this.focusinHandlerContext);
    }
  }

  private subscribeToFocusinEvent(): void {
    const $focusedView = this.getFocusedViewElement();
    const focusinSelector = this.getFocusinSelector();

    if ($focusedView) {
      eventsEngine.on($focusedView, 'focusin', focusinSelector, this.focusinHandlerContext);
    }
  }

  protected getFocusinSelector(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected focusinHandler(e): void {}

  protected initHandlers(): void {
    const focusedView = this.getFocusedView();
    this.unsubscribeFromKeyDownEvent();

    focusedView?.renderCompleted?.remove(this.renderCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      focusedView?.renderCompleted?.add(this.renderCompletedWithContext);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected getFocusedView(): any {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _getCell(cellPosition): any {}

  protected _getRowIndex($row): number {
    return $row?.index();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getCellIndex($cell, rowIndex?): number {
    return $cell?.index();
  }

  protected _getFixedColumnIndexOffset(column) {
    const visibleColumnCount = this._columnsController.getVisibleColumns(null, true).length;
    const offset = isFixedColumnIndexOffsetRequired(this, column)
      ? visibleColumnCount
        - this._columnsController.getVisibleColumns().length
      : 0;

    return offset;
  }

  protected getNewVisibleIndex(
    visibleIndex: number,
    direction: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    targetLocation?: string,
  ): number {
    return direction === 'previous' ? visibleIndex - 1 : visibleIndex + 1;
  }

  protected _getCellPosition($cell, direction?): {
    rowIndex: number;
    columnIndex: number;
  } | undefined {
    const $row = isElementDefined($cell) && $cell.closest('tr');

    if (isElementDefined($row)) {
      const rowIndex = this._getRowIndex($row);
      let columnIndex = this.getCellIndex($cell, rowIndex);

      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);

      if (direction) {
        columnIndex = this.getNewVisibleIndex(columnIndex, direction);
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }

      return { rowIndex, columnIndex };
    }

    return undefined;
  }

  protected _getColumnByCellElement($cell, rowIndex?) {
    const cellIndex = this.getCellIndex($cell);
    const columnIndex = cellIndex + this._columnsController.getColumnIndexOffset();

    return this._columnsController.getVisibleColumns(rowIndex, true)[columnIndex];
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
  protected _updateFocusedCellPosition($cell, direction?) {
    const position = this._getCellPosition($cell, direction);

    if (position) {
      if (
        !$cell.length
        || (position.rowIndex >= 0 && position.columnIndex >= 0)
      ) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }
    return position;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected renderCompleted(e: any): void {
    this.initKeyDownHandler();

    this.unsubscribeFromFocusinEvent();
    this.subscribeToFocusinEvent();
  }

  public init() {
    this._columnsController = this.getController('columns');
    this._focusedCellPosition = {};

    if (this.isKeyboardEnabled()) {
      this.createAction('onKeyDown');
    }

    this.renderCompletedWithContext = this.renderCompletedWithContext
      ?? this.renderCompleted.bind(this);
    this.focusinHandlerContext = this.focusinHandlerContext ?? this.focusinHandler.bind(this);

    this.initHandlers();
  }

  public dispose(): void {
    keyboard.off(this.keyDownListener);
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

  public _getFocusedCell() {
    return $(this._getCell(this._focusedCellPosition));
  }

  public getDirectionByKeyName(keyName: string): Direction {
    const rtlEnabled = this.option('rtlEnabled');

    switch (keyName) {
      case 'leftArrow': {
        return rtlEnabled ? Direction.Next : Direction.Previous;
      }
      case 'rightArrow': {
        return rtlEnabled ? Direction.Previous : Direction.Next;
        break;
      }
      default: {
        return Direction.Next;
      }
    }
  }
}
