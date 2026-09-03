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
    // The Scheduler can leave more than one dialog in the document, stacked on the same spot. The
    // last one is the one on top, and it is the one a click at those coordinates reaches.
    this.element = page.locator(`.${CLASS.dialog}`).last();
    this.series = this.element.locator(`.${CLASS.dialogButton}`).nth(0);
    this.appointment = this.element.locator(`.${CLASS.dialogButton}`).nth(1);
  }
}
