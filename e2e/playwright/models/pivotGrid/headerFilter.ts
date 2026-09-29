import type { Locator } from '@playwright/test';

const CLASSES = {
  icon: 'dx-header-filter',
};

export default class HeaderFilter {
  public readonly element: Locator;

  constructor(selector: Locator) {
    this.element = selector.locator(`.${CLASSES.icon}`);
  }

  public ariaLabel(): Promise<string | null> {
    return this.element.getAttribute('aria-label');
  }
}
