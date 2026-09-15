import type { Locator } from '@playwright/test';
import HeaderFilter from './headerFilter';

const CLASSES = {
  header: 'dx-pivotgrid-fields-area',
  field: 'dx-area-field',
};

export default class FilterHeaderArea {
  public readonly element: Locator;

  constructor(selector: Locator) {
    this.element = selector.locator(`.${CLASSES.header}`);
  }

  public getField(idx = 0): Locator {
    return this.element.locator(`.${CLASSES.field}`).nth(idx);
  }

  public getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }
}
