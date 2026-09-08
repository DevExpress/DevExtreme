import type { Locator, Page } from '@playwright/test';
import List from '../../list';

const CLASS = {
  wrapper: 'dx-overlay-wrapper',
  filterMenu: 'dx-header-filter-menu',
  content: 'dx-overlay-content',
  list: 'dx-list',
  button: 'dx-button',
  searchInput: 'dx-texteditor-input',
};

export default class HeaderFilter {
  private readonly page: Page;

  public readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    // Two elements carry the menu class — the overlay root and its wrapper. The wrapper is the
    // popup itself and holds its content, so it is the one the model points at.
    this.element = page.locator(`.${CLASS.wrapper}.${CLASS.filterMenu}`);
  }

  public getList(): List {
    return new List(this.page, this.element.locator(`.${CLASS.list}`));
  }

  public getButtons(): Locator {
    return this.element.locator(`.${CLASS.button}`);
  }

  public getContent(): Locator {
    return this.element.locator(`.${CLASS.content}`);
  }

  public getSearchInput(): Locator {
    return this.element.locator(`.${CLASS.searchInput}`);
  }
}
