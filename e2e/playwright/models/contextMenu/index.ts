import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
};

export default class ContextMenu extends Widget {
  public readonly items: Locator;

  public readonly contextMenu: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.contextMenu = page.locator(`.${CLASS.contextMenu}`);
    this.items = this.contextMenu.locator(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxContextMenu'; }

  public getItemByIndex(index: number): Locator {
    return this.items.nth(index);
  }

  public async show(): Promise<void> {
    await this.invoke('show');
  }
}
