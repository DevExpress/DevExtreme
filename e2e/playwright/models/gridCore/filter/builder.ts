import type { Locator, Page } from '@playwright/test';
import FilterBuilder from '../../filterBuilder';
import Popup from '../../popup';

const CLASSES = {
  popup: 'dx-popup-wrapper',
  filterBuilder: 'dx-filterbuilder',
};

export class FilterBuilderPopup {
  public readonly page: Page;

  public readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator(`.${CLASSES.popup}`);
  }

  public getFilterBuilder(): FilterBuilder {
    return new FilterBuilder(this.page, this.page.locator(`.${CLASSES.filterBuilder}`));
  }

  public asPopup(): Popup {
    return new Popup(this.page, this.element);
  }
}
