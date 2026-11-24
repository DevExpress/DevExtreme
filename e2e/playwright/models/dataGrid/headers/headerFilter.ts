import type { Locator, Page } from '@playwright/test';

const CLASS = {
  filterMenu: 'dx-header-filter-menu',
  content: 'dx-overlay-content',
  button: 'dx-button',
};

export default class HeaderFilter {
  public readonly body: Locator;

  public readonly element: Locator;

  constructor(page: Page) {
    this.body = page.locator('body');
    this.element = this.body.locator(`.${CLASS.filterMenu}`);
  }

  public getButtons(): Locator {
    return this.element.locator(`.${CLASS.button}`);
  }

  public getContent(): Locator {
    return this.element.locator(`.${CLASS.content}`);
  }
}
