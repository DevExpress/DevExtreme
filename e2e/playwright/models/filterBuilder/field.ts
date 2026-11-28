import type { Locator } from '@playwright/test';

const CLASS = {
  valueText: 'dx-filterbuilder-item-value-text',
  dateBox: 'dx-datebox',
};

export default class Field {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  // The value text of the whole page, not of this field.
  public getValueText(): Locator {
    return this.element.page().locator(`.${CLASS.valueText}`);
  }

  // The date box of the whole page, not of this field.
  public getDateBox(): Locator {
    return this.element.page().locator(`.${CLASS.dateBox}`);
  }
}
