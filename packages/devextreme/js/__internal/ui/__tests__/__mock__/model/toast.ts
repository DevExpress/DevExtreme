import Toast from '@js/ui/toast';

export class ToastModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getInstance(): Toast {
    return Toast.getInstance(this.root) as Toast;
  }
}
