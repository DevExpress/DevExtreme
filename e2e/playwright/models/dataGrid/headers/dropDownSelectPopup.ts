import type { Locator, Page } from '@playwright/test';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  menu: 'dx-dropdownmenu-popup',
  select: 'dx-selectbox-popup-wrapper',

  editorButton: 'dx-dropdowneditor-button',
  item: 'dx-item',
  listItem: 'dx-list-item',
};

// The toolbar menu and the drop-down of a select box in it are rendered into the page body.
export class DropDownSelectPopup {
  public readonly menu: Locator;

  public readonly select: Locator;

  constructor(page: Page) {
    this.menu = page.locator(`.${CLASS.menu}`);
    this.select = page.locator(`.${CLASS.select}`);
  }

  public menuContent(): Locator {
    return this.menu.locator(`.${CLASS.overlayContent}`);
  }

  public editButton(): Locator {
    return this.menu.locator(`.${CLASS.editorButton}`);
  }

  public getSelectItem(index: number): Locator {
    return this.select.locator(`.${CLASS.item}.${CLASS.listItem}`).nth(index);
  }
}
