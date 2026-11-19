import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../../internal/classMatcher';
import { textMatcher } from '../../internal/textMatcher';

export const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
  stateFocused: 'dx-state-focused',
  compact: 'dx-scheduler-appointment-collector-compact',
};

export default class AppointmentCollector {
  public readonly element: Locator;

  constructor(scheduler: Locator, index = 0, title?: string) {
    const collectors = scheduler.locator(`.${CLASS.appointmentCollector}`);

    this.element = (title ? collectors.filter({ hasText: textMatcher(title) }) : collectors)
      .nth(index);
  }

  public async expectFocused(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.stateFocused));
  }

  public async expectCompact(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.compact));
  }

  // The pointer events go out synchronously: a mouseup more than 750ms after the mousedown starts
  // the hold gesture of the appointment collection, which cancels the click of the collector.
  public async click(): Promise<void> {
    await this.element.evaluate((element: HTMLElement) => {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      const {
        left, top, width, height,
      } = element.getBoundingClientRect();
      const options = {
        bubbles: true,
        cancelable: true,
        clientX: left + width / 2,
        clientY: top + height / 2,
        button: 0,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
      };

      element.dispatchEvent(new PointerEvent('pointerdown', { ...options, buttons: 1 }));
      element.dispatchEvent(new MouseEvent('mousedown', { ...options, buttons: 1 }));
      element.focus();
      element.dispatchEvent(new PointerEvent('pointerup', options));
      element.dispatchEvent(new MouseEvent('mouseup', options));
      element.dispatchEvent(new MouseEvent('click', options));
    });
  }
}
