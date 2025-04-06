import { keyboard } from '@js/common/core/events/short';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { KeyboardNavigationController } from '../m_keyboard_navigation';

export const keyboardNavigationControllerExtender = (Base: ModuleType<KeyboardNavigationController>): ModuleType<KeyboardNavigationController> => class HeadersKeyboardNavigationController extends Base {
  private columnHeadersViewRenderCompletedWithContext!: (e: any) => void;

  private _columnHeadersViewKeyDownListener: any;

  private initColumnHeadersViewHandler(): void {
    this.unsubscribeFromColumnHeadersViewKeyDownEvent();

    this._columnHeadersView?.renderCompleted?.remove(this.columnHeadersViewRenderCompletedWithContext);

    if (this.isKeyboardEnabled()) {
      this._columnHeadersView?.renderCompleted?.add(this.columnHeadersViewRenderCompletedWithContext);
    }
  }

  private unsubscribeFromColumnHeadersViewKeyDownEvent(): void {
    if (this._columnHeadersViewKeyDownListener) {
      keyboard.off(this._columnHeadersViewKeyDownListener);
    }
  }

  private subscribeToColumnHeadersViewKeyDownEvent(): void {
    const $columnHeadersView = this._columnHeadersView.element();

    this._columnHeadersViewKeyDownListener = keyboard.on($columnHeadersView, null, (e) => this._columnHeadersViewKeyDownHandler(e));
  }

  private initColumnHeadersViewKeyDownHandler(): void {
    this.unsubscribeFromColumnHeadersViewKeyDownEvent();
    this.subscribeToColumnHeadersViewKeyDownEvent();
  }

  private _columnHeadersViewKeyDownHandler(e) {
    if (e.keyName === 'tab') {
      this.headerTabKeyHandler(e);
    }
  }

  public init() {
    super.init();

    this.columnHeadersViewRenderCompletedWithContext = this.columnHeadersViewRenderCompletedWithContext || this.columnHeadersViewRenderCompleted.bind(this);
    this.initColumnHeadersViewHandler();
  }

  public dispose() {
    super.dispose();
    keyboard.off(this._columnHeadersViewKeyDownListener);
  }

  protected columnHeadersViewRenderCompleted(): void {
    this.initColumnHeadersViewKeyDownHandler();
  }
};

export const headersKeyboardNavigationModule = {
  extenders: {
    controllers: {
      keyboardNavigation: keyboardNavigationControllerExtender,
    },
  },
};
