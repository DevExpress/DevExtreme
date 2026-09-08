import type { Locator } from '@playwright/test';
import { hasClass } from '../../internal/hasClass';

export const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
  stateFocused: 'dx-state-focused',
  compact: 'dx-scheduler-appointment-collector-compact',
};

export default class AppointmentCollector {
  public readonly element: Locator;

  constructor(scheduler: Locator, index = 0, title?: string) {
    const element = scheduler.locator(`.${CLASS.appointmentCollector}`);

    this.element = (title ? element.filter({ hasText: title }) : element).nth(index);
  }

  public isFocused(): Promise<boolean> {
    return hasClass(this.element, CLASS.stateFocused);
  }

  public isCompact(): Promise<boolean> {
    return hasClass(this.element, CLASS.compact);
  }
}
