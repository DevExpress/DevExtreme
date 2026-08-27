import type { Locator } from '@playwright/test';

const CLASSES = {
  dataHeader: 'dx-data-header',
  field: 'dx-area-field',
  box: 'dx-area-box',
};

export default class DataHeaderArea {
  public readonly element: Locator;

  constructor(selector: Locator) {
    this.element = selector.locator(`.${CLASSES.dataHeader}`);
  }

  public getField(idx = 0): Locator {
    return this.element.locator(`.${CLASSES.field}.${CLASSES.box}`).nth(idx);
  }
}
