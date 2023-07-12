import { Selector } from 'testcafe';

const CLASS = {
  valueText: 'dx-filterbuilder-item-value-text',
  dateBox: 'dx-datebox',
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
  getDateBox(): Selector { return Selector(`.${CLASS.dateBox}`); }
}
