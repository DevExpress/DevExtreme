import type { Locator, Page } from '@playwright/test';

const CLASS = {
  dialog: 'dx-dialog.dx-popup',
  dialogButton: 'dx-dialog-button',
};

export default class AppointmentDialog {
  public readonly element: Locator;

  public readonly series: Locator;

  public readonly appointment: Locator;

  constructor(page: Page) {
    this.element = page.locator(`.${CLASS.dialog}`);
    this.series = this.element.locator(`.${CLASS.dialogButton}`).nth(0);
    this.appointment = this.element.locator(`.${CLASS.dialogButton}`).nth(1);
  }
}
