import Widget from './internal/widget';
import ActionButton from './internal/actionButton';

const CLASS = {
  input: 'dx-texteditor-input',
};
export default class TextBox extends Widget {
  input: Selector;

  value: Promise<string>;

  name = 'dxTextBox';

  constructor(id: string) {
    super(id);

    this.input = this.getInput();
    this.value = this.input?.value;
  }

  getInput(): Selector {
    return this.element.find(`.${CLASS.input}`);
  }

  async getButton(index: number): Promise<ActionButton> {
    return new ActionButton(this.element, index);
  }
}
