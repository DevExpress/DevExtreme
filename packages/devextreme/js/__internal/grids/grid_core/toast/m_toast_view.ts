import $ from '@js/core/renderer';
import type { Properties as ToastProperties } from '@js/ui/toast';
import type dxToast from '@js/ui/toast';

import { View } from '../m_modules';

const DEFAULT_POSITION = { my: 'center bottom', at: 'center bottom' };

export class ToastView extends View {
  private _toastInstance: dxToast | null = null;

  private _$toastContainer: any | null = null;

  private _ensureToastContainer(): void {
    if (!this._$toastContainer) {
      this._$toastContainer = $('<div>').appendTo(this.component.$element());
    }
  }

  private _createToastInstance(options: ToastProperties): dxToast | null {
    this._ensureToastContainer();

    if (this._toastInstance) {
      return this._toastInstance;
    }

    this._toastInstance = this._$toastContainer.dxToast({
      position: {
        ...DEFAULT_POSITION,
        of: this.component.$element(),
      },
      ...options,
      visible: false,
    }).dxToast('instance');

    return this._toastInstance;
  }

  public showToast(message: string, options: ToastProperties = {}): void {
    const toast = this._createToastInstance(options);
    toast?.option({
      ...options,
      message,
      visible: true,
    });
  }

  public async hideToast(): Promise<void> {
    await this._toastInstance?.hide();
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
