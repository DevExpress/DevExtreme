import Widget from './internal/widget';
import ActionButton from './internal/actionButton';
import { WidgetName } from '../helpers/createWidget';

const CLASS = {
  input: 'dx-texteditor-input',
};
export default class TextBox extends Widget {
  input: Selector;

  value: Promise<string | undefined>;

  constructor(id: string) {
    super(id);

    this.input = this.getInput();
    this.value = this.input?.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTextBox'; }

  getInput(): Selector {
    return this.element.find(`.${CLASS.input}`);
  }

  getButton(index: number): ActionButton {
    return new ActionButton(this.element, index);
  }
}
