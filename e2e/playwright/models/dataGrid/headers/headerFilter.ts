import type { Locator, Page } from '@playwright/test';
import GridElement from '../../gridCore/element';

const CLASS = {
  filterMenu: 'dx-header-filter-menu',
  content: 'dx-overlay-content',
  button: 'dx-button',
};

export default class HeaderFilter extends GridElement {
  public readonly body: Locator;

  constructor(page: Page) {
    super(page.locator('body').locator(`.${CLASS.filterMenu}`));
    this.body = page.locator('body');
  }

  public getButtons(): Locator {
    return this.element.locator(`.${CLASS.button}`);
  }

  public getContent(): Locator {
    return this.element.locator(`.${CLASS.content}`);
  }
}
