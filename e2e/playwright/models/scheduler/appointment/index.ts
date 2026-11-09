import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from '../../internal/classMatcher';
import { textMatcher } from '../../internal/textMatcher';

const CLASS = {
  appointment: 'dx-scheduler-appointment',
  contentDate: 'dx-scheduler-appointment-content-date',
  recurrenceIcon: 'dx-scheduler-appointment-recurrence-icon',
  resizableHandleBottom: 'dx-resizable-handle-bottom',
  resizableHandleLeft: 'dx-resizable-handle-left',
  resizableHandleRight: 'dx-resizable-handle-right',
  resizableHandleTop: 'dx-resizable-handle-top',
  title: 'dx-scheduler-appointment-title',
  resourceItem: 'dx-scheduler-appointment-resource-item',
  resourceValue: 'dx-scheduler-appointment-resource-item-value',
  reducedIcon: 'dx-scheduler-appointment-reduced-icon',
};

const STATE_CLASS = {
  focused: 'dx-state-focused',
  allDay: 'dx-scheduler-all-day-appointment',
  reduced: 'dx-scheduler-appointment-reduced',
  reducedHead: 'dx-scheduler-appointment-head',
  reducedBody: 'dx-scheduler-appointment-body',
  reducedTail: 'dx-scheduler-appointment-tail',
  draggableSource: 'dx-draggable-source',
};

export type AppointmentState = keyof typeof STATE_CLASS;

export default class Appointment {
  public readonly element: Locator;

  public readonly date: Locator;

  public readonly title: Locator;

  public readonly resourcesItems: Locator;

  public readonly reducedIcon: Locator;

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

    this.date = this.element.locator(`.${CLASS.contentDate}`).first();
    this.title = this.element.locator(`.${CLASS.title}`);
    this.resourcesItems = this.element.locator(`.${CLASS.resourceItem}`);
    this.reducedIcon = this.element.locator(`.${CLASS.reducedIcon}`);

    this.resizableHandle = {
      left: this.element.locator(`.${CLASS.resizableHandleLeft}`),
      right: this.element.locator(`.${CLASS.resizableHandleRight}`),
      top: this.element.locator(`.${CLASS.resizableHandleTop}`),
      bottom: this.element.locator(`.${CLASS.resizableHandleBottom}`),
    };
  }

  public async expectState(state: AppointmentState, present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(STATE_CLASS[state]));
  }

  public getColor(): Promise<string> {
    return this.element.evaluate((node) => getComputedStyle(node).backgroundColor);
  }

  public getResource(label: string): Locator {
    return this.resourcesItems
      .filter({ has: this.element.page().locator('div', { hasText: textMatcher(label) }) })
      .locator(`.${CLASS.resourceValue}`);
  }

  public getRecurrenceElement(): Locator {
    return this.element.locator(`.${CLASS.recurrenceIcon}`);
  }

  public async getAriaDescription(): Promise<string> {
    const id = await this.element.getAttribute('aria-describedby');

    return this.element.locator(`[id="${id}"]`).innerText();
  }
}
