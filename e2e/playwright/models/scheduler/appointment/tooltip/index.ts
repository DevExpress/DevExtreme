import type { Locator, Page } from '@playwright/test';

const CLASS = {
  deleteButton: 'dx-tooltip-appointment-item-delete-button',
};

export default class AppointmentTooltip {
  public readonly deleteButton: Locator;

  constructor(page: Page) {
    // The tooltip content lives in an overlay outside the scheduler. The first match is the one the
    // TestCafe action took when the selector matched several buttons.
    this.deleteButton = page.locator(`.${CLASS.deleteButton}`).first();
  }
}
