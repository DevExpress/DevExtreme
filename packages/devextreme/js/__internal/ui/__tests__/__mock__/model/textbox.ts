import TextBox from '@js/ui/text_box';

export class TextBoxModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): TextBox {
    return TextBox.getInstance(this.root) as TextBox;
  }

  public setValue(value: string): void {
    this.getInstance()?.option('value', value);
  }

  public getInput(): HTMLInputElement {
    return this.root.querySelector('input') as HTMLInputElement;
  }
}
