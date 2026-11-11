import type { Locator } from '@playwright/test';
import { textMatcher } from '../../internal/textMatcher';

const CLASS = {
  appointment: 'dx-scheduler-appointment',
  resizableHandleBottom: 'dx-resizable-handle-bottom',
  resizableHandleLeft: 'dx-resizable-handle-left',
  resizableHandleRight: 'dx-resizable-handle-right',
  resizableHandleTop: 'dx-resizable-handle-top',
};

export default class Appointment {
  public readonly element: Locator;

  public readonly resizableHandle: {
    left: Locator;
    right: Locator;
    top: Locator;
    bottom: Locator;
  };

  constructor(scheduler: Locator, index = 0, title?: string) {
    const appointments = scheduler.locator(`.${CLASS.appointment}`);

    this.element = (title ? appointments.filter({ hasText: textMatcher(title) }) : appointments)
      .nth(index);

    this.resizableHandle = {
      left: this.element.locator(`.${CLASS.resizableHandleLeft}`),
      right: this.element.locator(`.${CLASS.resizableHandleRight}`),
      top: this.element.locator(`.${CLASS.resizableHandleTop}`),
      bottom: this.element.locator(`.${CLASS.resizableHandleBottom}`),
    };
  }
}
