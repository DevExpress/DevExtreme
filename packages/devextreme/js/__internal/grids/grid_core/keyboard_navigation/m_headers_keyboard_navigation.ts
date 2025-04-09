import eventsEngine from '@js/common/core/events/core/events_engine';
import { keyboard } from '@js/common/core/events/short';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';

import type { Views } from '../m_types';
import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

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

  private leftRightKeysHandler(e) {
    const { originalEvent } = e;

    if (isCommandKeyPressed(originalEvent)) {
      const $cell = $(originalEvent.target).closest('td');
      const column = this._getColumnByCellElement($cell);
      const direction = e.keyName === 'leftArrow' ? 'previous' : 'next';
      const newVisibleIndex = direction === 'previous' ? column.visibleIndex - 1 : column.visibleIndex + 2;

      this.isNeedToFocusHeader = true;
      this._updateFocusedCellPosition($cell, direction);
      this._columnsController.columnOption(
        column.index,
        'visibleIndex',
        newVisibleIndex,
      );
      originalEvent?.preventDefault();
    }
  }

  private keyDownHandler(e) {
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

  private focusinHandler(e) {
    this._updateFocusedCellPosition($(e.target));
  }

  private unsubscribeFromFocusinEvent() {
    const $columnHeadersView = this._columnHeadersView?.element();

    eventsEngine.off($columnHeadersView, 'focusin', this.focusinHandlerContext);
  }

  private subscribeToFocusinEvent() {
    const $columnHeadersView = this._columnHeadersView?.element();

    eventsEngine.on($columnHeadersView, 'focusin', '.dx-header-row > td', this.focusinHandlerContext);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected tabKeyHandler(e) {}

  protected getCellIndex($cell) {
    return this._columnHeadersView.getCellIndex($cell);
  }

  protected _getCell(cellPosition) {
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

  public init() {
    super.init();
    this._columnHeadersView = this.getView('columnHeadersView');

    this.renderCompletedWithContext = this.renderCompletedWithContext
      ?? this.renderCompleted.bind(this);
    this.focusinHandlerContext = this.focusinHandlerContext ?? this.focusinHandler.bind(this);

    this.initHandlers();
  }

  public dispose() {
    keyboard.off(this.keyDownListener);
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
  },
};
