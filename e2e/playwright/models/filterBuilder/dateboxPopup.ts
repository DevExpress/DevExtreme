import type { Locator, Page } from '@playwright/test';
import Popup from '../popup';

const CLASS = {
  dateBoxPopup: 'dx-datebox-wrapper',
  popupDone: 'dx-popup-done',
  button: 'dx-button',
};

export class DateBoxPopup extends Popup {
  constructor(page: Page) {
    super(page, `.${CLASS.dateBoxPopup}`);
  }

  public getDoneButton(): Locator {
    return this.page.locator(`.${CLASS.popupDone}.${CLASS.button}`);
  }
}
