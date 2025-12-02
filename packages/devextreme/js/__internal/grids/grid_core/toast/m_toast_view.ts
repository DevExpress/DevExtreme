import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as ToastProperties } from '@js/ui/toast';
import dxToast from '@js/ui/toast';

import { View } from '../m_modules';

export class ToastView extends View {
  private _toastInstance: dxToast | null = null;

  private _$toastContainer: dxElementWrapper | null = null;

  private _createToastInstance(options: ToastProperties): dxToast | null {
    if (this._toastInstance) {
      return this._toastInstance;
    }

    if (!this._$toastContainer) {
      this._$toastContainer = $('<div>').appendTo(this.component.$element());
    }

    this._toastInstance = this._createComponent(this._$toastContainer, dxToast, {
      position: {
        my: 'bottom',
        at: 'bottom',
        of: this.component.$element().get(0),
      },
      ...options,
      visible: false,
    });

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
