import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Overlay from '../overlay';

const CLASS = {
  contextMenu: 'dx-context-menu',
  item: 'dx-menu-item',
  itemContent: 'dx-menu-item-content',
  itemText: 'dx-menu-item-text',
  overlay: 'dx-overlay',
};

export default class ContextMenu extends Widget {
  name: WidgetName = 'dxContextMenu';

  // The menu renders its items into an overlay outside its element.
  public readonly items: Locator;

  public readonly overlay: Overlay;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.items = page.locator(`.${CLASS.contextMenu} .${CLASS.item}`);
    this.overlay = new Overlay(page, this.element.locator(`.${CLASS.overlay}`));
  }

  // A submenu renders inside its parent item: only the item's own text counts.
  public getItemByText(text: string): Locator {
    return this.element.locator(`.${CLASS.item}`).filter({
      has: this.page
        .locator(`:scope > .${CLASS.itemContent} > .${CLASS.itemText}`)
        .getByText(text, { exact: true }),
    });
  }

  public getItemByIndex(index: number): Locator {
    return this.items.nth(index);
  }

  public getItemCount(): Promise<number> {
    return this.items.count();
  }

  public async show(): Promise<void> {
    await this.invoke('show');
  }
}
