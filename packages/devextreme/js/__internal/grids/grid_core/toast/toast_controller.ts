import type { Properties as ToastProperties } from '@js/ui/toast';

import { ViewController } from '../modules/modules';
import type { ToastView } from './toast_view';

export class ToastViewController extends ViewController {
  private _toastView: ToastView | null = null;

  public init(): void {
    this._toastView = this.getView('toastView');
  }

  public showToast(message: string, options: ToastProperties = {}): void {
    this._toastView?.showToast(message, options);
  }

  public async hideToast(): Promise<void> {
    await this._toastView?.hideToast();
  }

  public dispose(): void {
    this._toastView?.dispose();
  }
}
