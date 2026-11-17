import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import List from '../list';
import TextBox from '../textBox';

const ATTR = {
  popupId: 'aria-owns',
};

const CLASS = {
  dropDownButton: 'dx-dropdowneditor-button',
  invisible: 'dx-state-invisible',
  list: 'dx-list',
};

export default abstract class DropDownList extends TextBox {
  public readonly dropDownButton: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.dropDownButton = this.element.locator(`.${CLASS.dropDownButton}`);
  }

  // The input names the popup content in "aria-owns" once the popup is rendered; the content
  // itself sits in an overlay wrapper elsewhere in the body.
  public isOpened(): Promise<boolean> {
    return this.input.evaluate((input, { attr, invisible }) => {
      const popupId = input.getAttribute(attr);
      const popup = popupId ? document.getElementById(popupId) : null;

      return !!popup && !popup.parentElement?.classList.contains(invisible);
    }, { attr: ATTR.popupId, invisible: CLASS.invisible });
  }

  public async getPopup(): Promise<Locator> {
    await expect(this.input).toHaveAttribute(ATTR.popupId, /./);

    const popupId = await this.input.getAttribute(ATTR.popupId);

    return this.page.locator(`#${popupId}`);
  }

  public async getList(): Promise<List> {
    await expect.poll(() => this.isOpened()).toBe(true);

    return new List(this.page, (await this.getPopup()).locator(`.${CLASS.list}`));
  }

  public async open(): Promise<void> {
    await this.invoke('open');
  }
}
