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

  public blurInput(): void {
    this.getInputElement().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  }
}
