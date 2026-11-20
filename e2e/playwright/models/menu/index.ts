import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import ContextMenu from '../contextMenu';

const CLASS = {
  menu: 'dx-menu',
  item: 'dx-menu-item',
  adaptiveItem: 'dx-treeview-item',
  contextMenu: 'dx-context-menu',
  hamburgerButton: 'dx-menu-hamburger-button',
};

export default class Menu extends Widget {
  name: WidgetName = 'dxMenu';

  // The visible items of the whole page, submenus included: they live in overlays outside the menu.
  public readonly items: Locator;

  constructor(page: Page, adaptivityEnabled = false) {
    super(page, `.${CLASS.menu}`);

    const itemClass = adaptivityEnabled ? CLASS.adaptiveItem : CLASS.item;

    this.items = page.locator(`.${itemClass}`).filter({ visible: true });
  }

  public getItem(index: number): Locator {
    return this.items.nth(index);
  }

  public getHamburgerButton(): Locator {
    return this.element.locator(`.${CLASS.hamburgerButton}`);
  }

  public getSubMenu(rootItem: Locator): ContextMenu {
    // A shown submenu nests one more element with the class; the first one is the widget.
    return new ContextMenu(this.page, rootItem.locator(`.${CLASS.contextMenu}`).first());
  }
}
