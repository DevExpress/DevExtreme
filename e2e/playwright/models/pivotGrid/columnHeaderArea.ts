import type { Locator, Page } from '@playwright/test';
import HeaderFilter from './headerFilter';

const CLASSES = {
  columnHeader: 'dx-column-header',
  field: 'dx-area-field',
  headerFilterMenu: 'dx-header-filter-menu',
  scrollable: 'dx-scrollable-container',
};

export default class ColumnHeaderArea {
  private readonly page: Page;

  public readonly element: Locator;

  constructor(page: Page, selector: Locator) {
    this.page = page;
    this.element = selector.locator(`.${CLASSES.columnHeader}`);
  }

  public getField(idx = 0): Locator {
    return this.element.locator(`.${CLASSES.field}`).nth(idx);
  }

  // The header filter popup is attached to the viewport, not to the area.
  public getHeaderFilterMenu(): Locator {
    return this.page.locator(`.${CLASSES.headerFilterMenu}`);
  }

  public getHeaderFilterIcon(idx = 0): HeaderFilter {
    return new HeaderFilter(this.getField(idx));
  }

  public getHeaderFilterScrollable(): Locator {
    return this.getHeaderFilterMenu().locator(`.${CLASSES.scrollable}`);
  }
}
