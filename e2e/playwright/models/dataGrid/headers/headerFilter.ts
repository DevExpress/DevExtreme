import type { Locator, Page } from '@playwright/test';
import GridElement from '../../gridCore/element';
import List from '../../list';

const CLASS = {
  filterMenu: 'dx-header-filter-menu',
  content: 'dx-overlay-content',
  button: 'dx-button',
  list: 'dx-list',
};

export default class HeaderFilter extends GridElement {
  public readonly body: Locator;

  constructor(page: Page) {
    super(page.locator('body').locator(`.${CLASS.filterMenu}`));
    this.body = page.locator('body');
  }

  public getList(): List {
    return new List(this.element.page(), this.element.locator(`.${CLASS.list}`));
  }

  public getButtons(): Locator {
    return this.element.locator(`.${CLASS.button}`);
  }

  public getContent(): Locator {
    return this.element.locator(`.${CLASS.content}`);
  }
}
