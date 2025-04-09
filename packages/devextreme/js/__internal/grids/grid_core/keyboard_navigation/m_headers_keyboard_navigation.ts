import eventsEngine from '@js/common/core/events/core/events_engine';
import { keyboard } from '@js/common/core/events/short';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type { Views } from '../m_types';
import { StickyPosition } from '../sticky_columns/const';
import { getColumnFixedPosition, isFirstFixedColumn, isLastFixedColumn } from '../sticky_columns/utils';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

enum Direction {
  Next = 'next',
  Previous = 'previous',
}

export class HeadersKeyboardNavigationController extends KeyboardNavigationControllerCore {
  private renderCompletedWithContext!: (e: any) => void;

  private keyDownListener: any;

  private isNeedToFocusHeader = false;

  private focusinHandlerContext!: (event: any) => void;

  protected _columnHeadersView!: Views['columnHeadersView'];

  private initHandlers(): void {
    this.unsubscribeFromKeyDownEvent();

    this._columnHeadersView?.renderCompleted?.remove(this.renderCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      this._columnHeadersView?.renderCompleted?.add(this.renderCompletedWithContext);
    }
  }

  private unsubscribeFromKeyDownEvent(): void {
    if (this.keyDownListener) {
      keyboard.off(this.keyDownListener);
    }
  }

  private subscribeToKeyDownEvent(): void {
    const $columnHeadersView = this._columnHeadersView.element();

    this.keyDownListener = keyboard.on($columnHeadersView, null, (e) => this.keyDownHandler(e));
  }

  private initKeyDownHandler(): void {
    this.unsubscribeFromKeyDownEvent();
    this.subscribeToKeyDownEvent();
  }

  private getDirectionByKeyName(keyName): Direction {
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

  private isHeaderValidForReordering(column, direction, rowIndex?): boolean {
    if (column.fixed && column.fixedPosition !== StickyPosition.Sticky) {
      const fixedPosition = getColumnFixedPosition(this._columnsController, column);

      return direction === Direction.Next ? !isLastFixedColumn(
        this._columnsController,
        column,
        rowIndex,
        false,
        fixedPosition,
      ) : !isFirstFixedColumn(
        this._columnsController,
        column,
        rowIndex,
        false,
        fixedPosition,
      );
    }

    const unfixedColumns = this._columnsController.getUnfixedAndStickyColumns(rowIndex);
    const isFirstColumn = column.index === unfixedColumns[0].index;
    const isLastColumn = column.index === unfixedColumns[unfixedColumns.length - 1].index;

    return direction === Direction.Next ? !isLastColumn : !isFirstColumn;
  }

  private leftRightKeysHandler(e): void {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $cell = $(originalEvent.target).closest('td');
      const column = this._getColumnByCellElement($cell);
      const direction = this.getDirectionByKeyName(e.keyName);

      if (this.isHeaderValidForReordering(column, direction)) {
        const newVisibleIndex = direction === 'previous' ? column.visibleIndex - 1 : column.visibleIndex + 2;

        this.isNeedToFocusHeader = true;
        this._updateFocusedCellPosition($cell, direction);
        this._columnsController.columnOption(
          column.index,
          'visibleIndex',
          newVisibleIndex,
        );
      }
      originalEvent?.preventDefault();
    }
  }

  private keyDownHandler(e): void {
    const isHandled = this.processOnKeyDown(e);

    if (isHandled) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (e.keyName) {
      case 'tab': {
        this.tabKeyHandler(e);
        break;
      }
      case 'leftArrow':
      case 'rightArrow':
        this.leftRightKeysHandler(e);
        break;
    }
  }

  private focusinHandler(e): void {
    this._updateFocusedCellPosition($(e.target));
  }

  private unsubscribeFromFocusinEvent(): void {
    const $columnHeadersView = this._columnHeadersView?.element();

    eventsEngine.off($columnHeadersView, 'focusin', this.focusinHandlerContext);
  }

  private subscribeToFocusinEvent(): void {
    const $columnHeadersView = this._columnHeadersView?.element();

    eventsEngine.on($columnHeadersView, 'focusin', '.dx-header-row > td', this.focusinHandlerContext);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected tabKeyHandler(e): void {}

  protected getCellIndex($cell): number {
    return this._columnHeadersView.getCellIndex($cell);
  }

  protected _getCell(cellPosition): dxElementWrapper {
    return this._columnHeadersView?.getCell(cellPosition);
  }

  protected renderCompleted(): void {
    this.initKeyDownHandler();

    this.unsubscribeFromFocusinEvent();
    this.subscribeToFocusinEvent();

    if (this.isNeedToFocusHeader) {
      const $focusElement = this._getFocusedCell();

      this.isNeedToFocusHeader = false;
      // @ts-expect-error
      eventsEngine.trigger($focusElement, 'focus');
    }
  }

  public init(): void {
    super.init();
    this._columnHeadersView = this.getView('columnHeadersView');

    this.renderCompletedWithContext = this.renderCompletedWithContext
      ?? this.renderCompleted.bind(this);
    this.focusinHandlerContext = this.focusinHandlerContext ?? this.focusinHandler.bind(this);

    this.initHandlers();
  }

  public dispose(): void {
    keyboard.off(this.keyDownListener);
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
  },
};
