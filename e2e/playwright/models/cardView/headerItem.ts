import type { Locator } from '@playwright/test';

const CLASS = {
  filterIcon: 'dx-header-filter-icon',
};

export default class HeaderItem {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public getFilterIcon(): Locator {
    return this.element.locator(`.${CLASS.filterIcon}`);
  }
}
