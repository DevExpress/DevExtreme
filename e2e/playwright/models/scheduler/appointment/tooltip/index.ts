import type { Locator, Page } from '@playwright/test';
import TooltipBase from './base';
import ListItem from './listItem';

const CLASS = {
  tooltip: 'dx-tooltip',
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  tooltipWrapper: 'dx-tooltip-wrapper',
  tooltipDeleteButton: 'dx-tooltip-appointment-item-delete-button',
  mobileTooltip: '.dx-scheduler-overlay-panel > .dx-overlay-content',
};

export default class AppointmentTooltip extends TooltipBase {
  public readonly mobileElement: Locator;

  public readonly deleteButton: Locator;

  public readonly wrapper: Locator;

  constructor(page: Page, scheduler: Locator) {
    super(page, CLASS.appointmentTooltipWrapper);

    this.element = scheduler.locator(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);

    this.mobileElement = page.locator(CLASS.mobileTooltip);

    this.deleteButton = page.locator(`.${CLASS.tooltipDeleteButton}`);

    this.wrapper = page.locator(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
  }

  public getListItem(title?: string, index = 0): ListItem {
    return new ListItem(this.wrapper, title, index);
  }
}
