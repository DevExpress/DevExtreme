import type { Locator, Page } from '@playwright/test';
import { hasClass } from './hasClass';
import TextBox from '../textBox';
import List from '../list';

const ATTR = {
  popupId: 'aria-owns',
};

const CLASS = {
  dropDownButton: 'dx-dropdowneditor-button',
  list: 'dx-list',
  invisible: 'dx-state-invisible',
};

export default abstract class DropDownList extends TextBox {
  public readonly dropDownButton: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.dropDownButton = this.element.locator(`.${CLASS.dropDownButton}`);
  }

  public getPopupOwnerElement(): Locator {
    return this.input;
  }

  // eslint-disable-next-line class-methods-use-this
  public getPopupIdAttr(): string {
    return ATTR.popupId;
  }

  public async isPopupRendered(): Promise<boolean> {
    const popupId = await this.getPopupOwnerElement().getAttribute(this.getPopupIdAttr());

    return popupId !== null;
  }

  public async isOpened(): Promise<boolean> {
    if (!await this.isPopupRendered()) {
      return false;
    }

    const popup = await this.getPopup();

    return !await hasClass(popup.locator('..'), CLASS.invisible);
  }

  public async getPopup(): Promise<Locator> {
    const popupId = await this.getPopupOwnerElement().getAttribute(this.getPopupIdAttr());

    return this.page.locator(`#${popupId}`);
  }

  public async getList(): Promise<List> {
    if (!await this.isOpened()) {
      throw new Error('The drop down list is closed, its list is not rendered yet.');
    }

    return new List(this.page, (await this.getPopup()).locator(`.${CLASS.list}`));
  }

  public async open(): Promise<void> {
    await this.invoke('open');
  }
}
