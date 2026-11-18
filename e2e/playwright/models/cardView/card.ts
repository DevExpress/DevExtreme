import type { Locator } from '@playwright/test';

export const CLASS = {
  header: 'dx-cardview-card-header',
  toolbarItem: 'dx-toolbar-item',
};

export default class Card {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public getHeader(): Locator {
    return this.element.locator(`.${CLASS.header}`);
  }

  public getToolbarItem(index: number): Locator {
    return this.getHeader().locator(`.${CLASS.toolbarItem}`).nth(index);
  }
}
