import type { Page, Locator } from '@playwright/test';

const CLASS = {
  menu: 'dx-menu',
  item: 'dx-menu-item',
  adaptiveItem: 'dx-treeview-item',
  contextMenu: 'dx-context-menu',
  hamburgerButton: 'dx-menu-hamburger-button',
} as const;

export class Menu {
  readonly page: Page;
  readonly element: Locator;
  readonly items: Locator;

  constructor(page: Page, adaptivityEnabled = false) {
    this.page = page;
    const itemClass = adaptivityEnabled ? CLASS.adaptiveItem : CLASS.item;
    this.element = page.locator(`.${CLASS.menu}`);
    this.items = page.locator(`.${itemClass}`).filter({ hasNot: page.locator('[style*="display: none"]') });
  }

  getItem(index: number): Locator {
    return this.items.nth(index);
  }

  getHamburgerButton(): Locator {
    return this.element.locator(`.${CLASS.hamburgerButton}`);
  }

  async isElementFocused(element: Locator): Promise<boolean> {
    return element.evaluate((el) => el.classList.contains('dx-state-focused'));
  }
}
