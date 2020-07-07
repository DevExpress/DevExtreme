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

    this.input = this.element.find(`.${CLASS.input}`);
    this.value = this.input.value;
  }

  async getButton(index: number): Promise<ActionButton> {
    return new ActionButton(this.element, index);
  }
}
