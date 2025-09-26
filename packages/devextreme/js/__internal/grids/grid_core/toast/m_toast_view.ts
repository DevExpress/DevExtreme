import $ from '@js/core/renderer';
import type { Properties as ToastProperties } from '@js/ui/toast';
import type dxToast from '@js/ui/toast';

import modules from '../m_modules';

const DEFAULT_DISPLAY_TIME = 3000;
const DEFAULT_POSITION = { my: 'center bottom', at: 'center bottom' };

export class ToastView extends modules.View {
  private _toastInstance: dxToast | null = null;

  private _$toastContainer: any | null = null;

  public showToast(message: string, options: ToastProperties = {}): void {
    this._ensureToastContainer();
    const toast = this._createToastInstance(options);
    toast?.option({
      message,
      ...options,
      visible: true,
    });
  }

  private _ensureToastContainer(): void {
    if (!this._$toastContainer) {
      this._$toastContainer = $('<div>').appendTo(this.component.$element());
    }
  }

  private _createToastInstance(options: ToastProperties): dxToast | null {
    if (this._toastInstance) {
      return this._toastInstance;
    }

    this._$toastContainer?.dxToast({
      displayTime: DEFAULT_DISPLAY_TIME,
      position: { ...DEFAULT_POSITION, of: this.component.$element() },
      ...options,
      visible: false,
    });
    this._toastInstance = this._$toastContainer?.dxToast('instance');
    return this._toastInstance;
  }

  public hideToast(): void {
    if (this._toastInstance) {
      this._toastInstance.hide();
    }
  }

  public dispose(): void {
    if (this._toastInstance) {
      this._toastInstance.dispose();
      this._toastInstance = null;
    }
    if (this._$toastContainer) {
      this._$toastContainer.remove();
      this._$toastContainer = null;
    }
  }
}
