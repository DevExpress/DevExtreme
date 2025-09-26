import modules from '../m_modules';
import type { ToastView } from './m_toast_view';

export class ToastViewController extends modules.ViewController {
  private _toastView: ToastView | null = null;

  public init(): void {
    this._toastView = this.getView('toastView');
  }

  public showToast(message: string, options: any = {}): void {
    this._toastView?.showToast(message, options);
  }

  public hideToast(): void {
    this._toastView?.hideToast();
  }

  public dispose(): void {
    this._toastView = null;
  }
}
