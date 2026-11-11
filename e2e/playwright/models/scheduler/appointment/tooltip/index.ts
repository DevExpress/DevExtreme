import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import ListItem from './listItem';

const CLASS = {
  tooltip: 'dx-tooltip',
  appointmentTooltipWrapper: 'dx-scheduler-appointment-tooltip-wrapper',
  tooltipWrapper: 'dx-tooltip-wrapper',
  stateInvisible: 'dx-state-invisible',
  deleteButton: 'dx-tooltip-appointment-item-delete-button',
  mobileTooltip: '.dx-scheduler-overlay-panel > .dx-overlay-content',
};

export default class AppointmentTooltip {
  public readonly element: Locator;

  public readonly anyElement: Locator;

  public readonly wrapper: Locator;

  public readonly mobileElement: Locator;

  public readonly deleteButton: Locator;

  constructor(page: Page, scheduler: Locator) {
    this.element = scheduler.locator(`.${CLASS.tooltip}.${CLASS.appointmentTooltipWrapper}`);
    this.anyElement = page.locator(`.${CLASS.appointmentTooltipWrapper}`);
    this.wrapper = page.locator(`.${CLASS.tooltipWrapper}.${CLASS.appointmentTooltipWrapper}`);
    this.mobileElement = page.locator(CLASS.mobileTooltip);
    this.deleteButton = page.locator(`.${CLASS.deleteButton}`).first();
  }

  public getListItem(title?: string, index = 0): ListItem {
    return new ListItem(this.wrapper, title, index);
  }

  public async isVisible(): Promise<boolean> {
    if (await this.element.count() === 0) {
      return false;
    }

    return this.element.first().evaluate(
      (node, invisible) => !node.classList.contains(invisible),
      CLASS.stateInvisible,
    );
  }

  public async expectVisible(visible = true): Promise<void> {
    await expect.poll(() => this.isVisible()).toBe(visible);
  }
}
