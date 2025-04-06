import { keyboard } from '@js/common/core/events/short';
import {
  isCommandKeyPressed,
} from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';

import { KeyboardNavigationController as KeyboardNavigationControllerCore } from './m_keyboard_navigation_core';

export class HeadersKeyboardNavigationController extends KeyboardNavigationControllerCore {
  private renderCompletedWithContext!: (e: any) => void;

  private keyDownListener: any;

  private isNeedToFocusHeader = false;

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
      const column = this.getColumnByCellElement($cell, this._columnHeadersView);
      const newVisibleIndex = e.keyName === 'leftArrow' ? column.visibleIndex - 1 : column.visibleIndex + 2;

      this.isNeedToFocusHeader = true;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected tabKeyHandler(e) {}

  public init() {
    super.init();

    this.renderCompletedWithContext = this.renderCompletedWithContext || this.renderCompleted.bind(this);
    this.initHandlers();
  }

  public dispose() {
    keyboard.off(this.keyDownListener);
  }

  protected renderCompleted(): void {
    this.initKeyDownHandler();

    if (this.isNeedToFocusHeader) {
      this.isNeedToFocusHeader = false;
      // eventsEngine.trigger($focusElement, 'focus');
    }
  }
}

export const headersKeyboardNavigationModule = {
  controllers: {
    headersKeyboardNavigation: HeadersKeyboardNavigationController,
  },
};
