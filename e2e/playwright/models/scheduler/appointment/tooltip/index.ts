import type { Locator, Page } from '@playwright/test';

const CLASS = {
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  tooltipWrapper: 'dx-tooltip-wrapper',
  deleteButton: 'dx-tooltip-appointment-item-delete-button',
};

export default class AppointmentTooltip {
  public readonly wrapper: Locator;

  public readonly deleteButton: Locator;

  constructor(page: Page) {
    this.wrapper = page.locator(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
    this.deleteButton = page.locator(`.${CLASS.deleteButton}`).first();
  }
}
