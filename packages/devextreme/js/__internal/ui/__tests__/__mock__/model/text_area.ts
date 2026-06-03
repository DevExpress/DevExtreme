import TextArea from '@ts/ui/text_area';

const CLASSES = {
  textArea: 'dx-texteditor-input',
};

export class TextAreaModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getInputElement(): HTMLTextAreaElement {
    return this.root.querySelector(`.${CLASSES.textArea}`) as HTMLTextAreaElement;
  }

  public setValue(value: string): void {
    this.getInstance()?.option('value', value);
  }

  public getInstance(): TextArea {
    return TextArea.getInstance(this.root);
  }
}
