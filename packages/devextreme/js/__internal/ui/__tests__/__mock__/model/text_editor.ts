import { BaseModel } from './base_model';

const CLASSES = {
  input: 'dx-texteditor-input',
};

export class TextEditorModel extends BaseModel {
  public getInputElement(): HTMLInputElement {
    return this.root.querySelector(`.${CLASSES.input}`) as HTMLInputElement;
  }

  public clearInput(): void {
    const input = this.getInputElement();

    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  public pressKey(key: string): void {
    const input = this.getInputElement();

    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
  }

  public blurInput(): void {
    this.getInputElement().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  }
}
