import { Selector } from 'testcafe';
import TextBox from '../textBox';

const CLASS = {
  valueText: 'dx-filterbuilder-item-value-text',
  textBox: 'dx-textbox',
};

export default class Field {
  element: Selector;

  text: Promise<string>;

  constructor(element: Selector) {
    this.element = element;
    this.text = element.textContent;
  }

  // eslint-disable-next-line class-methods-use-this
  getValueText(): Selector { return Selector(`.${CLASS.valueText}`); }

  // eslint-disable-next-line class-methods-use-this
  getTextBox(): TextBox { return new TextBox(`.${CLASS.textBox}`); }
}
