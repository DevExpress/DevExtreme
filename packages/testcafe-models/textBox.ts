import Widget from './internal/widget';
import ActionButton from './internal/actionButton';
import type { WidgetName } from './types';

const CLASS = {
  input: 'dx-texteditor-input',
  isInvalid: 'dx-invalid',
  label: 'dx-label',
  buttonsContainer: 'dx-texteditor-buttons-container',
  clearButton: 'dx-clear-button-area',
};
export default class TextBox extends Widget {
  input: Selector;

  value: Promise<string | undefined>;

  constructor(id: string | Selector) {
    super(id);

    this.input = this.getInput();
    this.value = this.input?.value;
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTextBox'; }

  public get isInvalid(): Promise<boolean> {
    return this.element.hasClass(CLASS.isInvalid);
  }

  getInput(): Selector {
    return this.element.find(`.${CLASS.input}`);
  }

  getButton(index: number): ActionButton {
    return new ActionButton(this.element, index);
  }

  getClearButton(): Selector {
    return this.element.find(`.${CLASS.buttonsContainer}`).find(`.${CLASS.clearButton}`);
  }

  getLabel(): Selector {
    return this.element.find(`.${CLASS.label}`);
  }

  getLabelSpan(): Selector {
    return this.getLabel().find('span');
  }
}
