import type { Locator } from '@playwright/test';
import HeaderFilter from './headerFilter';

const CLASSES = {
  rowHeader: 'dx-area-description-cell',
  field: 'dx-area-field',
};

export default class RowHeaderArea {
  public readonly element: Locator;

  constructor(selector: Locator) {
    this.element = selector.locator(`.${CLASSES.rowHeader}`);
  }

  public getField(idx = 0): Locator {
    return this.element.locator(`.${CLASSES.field}`).nth(idx);
  }

  public getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }
}
