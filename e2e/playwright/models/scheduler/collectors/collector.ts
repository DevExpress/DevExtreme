import type { Locator } from '@playwright/test';
import { textMatcher } from '../../internal/textMatcher';

export const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
};

export default class AppointmentCollector {
  public readonly element: Locator;

  constructor(scheduler: Locator, index = 0, title?: string) {
    const collectors = scheduler.locator(`.${CLASS.appointmentCollector}`);

    this.element = (title ? collectors.filter({ hasText: textMatcher(title) }) : collectors)
      .nth(index);
  }
}
