import type { Locator, Page } from '@playwright/test';

const CLASS = {
  deleteButton: 'dx-tooltip-appointment-item-delete-button',
};

export default class AppointmentTooltip {
  public readonly deleteButton: Locator;

  constructor(page: Page) {
    this.deleteButton = page.locator(`.${CLASS.deleteButton}`).first();
  }
}
