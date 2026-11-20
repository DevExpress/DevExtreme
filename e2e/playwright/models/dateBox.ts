import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Popup from './popup';
import TextBox from './textBox';

const CLASS = {
  dropDownEditorButton: 'dx-dropdowneditor-button',
  button: 'dx-button',
  doneButton: 'dx-popup-done',
  popup: 'dx-popup',
  scrollableContainer: 'dx-scrollable-container',
};

export default class DateBox extends TextBox {
  name: WidgetName = 'dxDateBox';

  public readonly dropDownEditorButton: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.dropDownEditorButton = this.element.locator(`.${CLASS.dropDownEditorButton}`);
  }

  public getDoneButton(): Locator {
    return this.page.locator(`.${CLASS.button}.${CLASS.doneButton}`);
  }

  public getRollerScrollTop(viewName: string): Promise<number> {
    return this.page
      .locator(`.dx-dateviewroller-${viewName} .${CLASS.scrollableContainer}`)
      .evaluate((container) => container.scrollTop);
  }

  public getPopup(): Popup {
    return new Popup(this.page, this.element.locator(`.${CLASS.popup}`));
  }
}
