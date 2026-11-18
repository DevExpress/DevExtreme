import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';

const CLASS = {
  menu: 'dx-menu',
  item: 'dx-menu-item',
  adaptiveItem: 'dx-treeview-item',
};

export default class Menu extends Widget {
  public readonly items: Locator;

  constructor(page: Page, adaptivityEnabled = false) {
    super(page, `.${CLASS.menu}`);

    const itemClass = adaptivityEnabled ? `.${CLASS.adaptiveItem}` : `.${CLASS.item}`;

    this.items = page.locator(itemClass).filter({ visible: true });
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxMenu'; }

  public getItem(index: number): Locator {
    return this.items.nth(index);
  }
}
