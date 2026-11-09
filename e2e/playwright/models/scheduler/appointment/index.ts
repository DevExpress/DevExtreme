import type { Locator } from '@playwright/test';
import { textMatcher } from '../../internal/textMatcher';

const CLASS = {
  appointment: 'dx-scheduler-appointment',
};

export default class Appointment {
  public readonly element: Locator;

  constructor(scheduler: Locator, index = 0, title?: string) {
    const appointments = scheduler.locator(`.${CLASS.appointment}`);

    this.element = (title ? appointments.filter({ hasText: textMatcher(title) }) : appointments)
      .nth(index);
  }
}
