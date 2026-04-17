import type { Page, Locator } from '@playwright/test';

const CLASS = {
  overflowMenu: 'dx-dropdownmenu',
  item: 'dx-toolbar-item',
  popup: 'dx-popup',
  popupWrapper: 'dx-popup-wrapper',
  popupContent: 'dx-popup-content',
  overlayContent: 'dx-overlay-content',
  list: 'dx-list',
} as const;

export class ToolbarDropDownMenu {
  readonly element: Locator;
  readonly page: Page;

  constructor(page: Page, element: Locator) {
    this.page = page;
    this.element = element;
  }

  async click(): Promise<void> {
    await this.element.click();
  }

  getPopup(): ToolbarDropDownMenuPopup {
    return new ToolbarDropDownMenuPopup(this.page);
  }

  getList(): Locator {
    return this.page.locator(`.${CLASS.popupWrapper} .${CLASS.list}`);
  }
}

export class ToolbarDropDownMenuPopup {
  readonly element: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator(`.${CLASS.popupWrapper}`).locator(`.${CLASS.overlayContent}`).filter({ has: page.locator(`.${CLASS.popupContent}`) });
  }

  getContent(): Locator {
    return this.element.locator(`.${CLASS.popupContent}`);
  }

  async isVisible(): Promise<boolean> {
    return this.element.isVisible();
  }
}

export class Toolbar {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
  }

  getOverflowMenu(): ToolbarDropDownMenu {
    return new ToolbarDropDownMenu(this.page, this.element.locator(`.${CLASS.overflowMenu}`));
  }

  getItem(index = 0): Locator {
    return this.element.locator(`.${CLASS.item}`).nth(index);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxToolbar('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxToolbar('instance').option(n),
      { sel, name },
    );
  }
}
