import type { Locator } from '@playwright/test';
import { hasClass } from '../../internal/hasClass';

const CLASS = {
  appointment: 'dx-scheduler-appointment',
  appointmentContentDate: 'dx-scheduler-appointment-content-date',
  dateTableCell: 'dx-scheduler-date-table-cell',
  appointmentRecurrenceIcon: 'dx-scheduler-appointment-recurrence-icon',
  resizableHandleBottom: 'dx-resizable-handle-bottom',
  resizableHandleLeft: 'dx-resizable-handle-left',
  resizableHandleRight: 'dx-resizable-handle-right',
  resizableHandleTop: 'dx-resizable-handle-top',
  stateFocused: 'dx-state-focused',
  allDay: 'dx-scheduler-all-day-appointment',
  title: 'dx-scheduler-appointment-title',
  resources: {
    item: 'dx-scheduler-appointment-resource-item',
    value: 'dx-scheduler-appointment-resource-item-value',
  },
  reduced: {
    icon: 'dx-scheduler-appointment-reduced-icon',
    appointment: 'dx-scheduler-appointment-reduced',
    head: 'dx-scheduler-appointment-head',
    body: 'dx-scheduler-appointment-body',
    tail: 'dx-scheduler-appointment-tail',
  },
  draggableSource: 'dx-draggable-source',
  itemContent: 'dx-item-content',
};

export default class Appointment {
  public readonly element: Locator;

  public readonly date: { time: Locator };

  public readonly resizableHandle: {
    left: Locator; right: Locator; top: Locator; bottom: Locator;
  };

  public readonly title: Locator;

  public readonly resourcesItems: Locator;

  public readonly reducedIcon: Locator;

  constructor(scheduler: Locator, index = 0, text?: string) {
    const element = scheduler.locator(`.${CLASS.appointment}`);

    // Every appointment carries a hidden accessibility description that ends with "…navigate to
    // the first or last appointment", so a filter over the whole element matches on words from
    // that sentence as well. The visible content is what the TestCafe "withText" looked at.
    const content = scheduler.page().locator(`.${CLASS.itemContent}`, { hasText: text });

    this.element = (text ? element.filter({ has: content }) : element).nth(index);

    const appointmentContentDate = this.element.locator(`.${CLASS.appointmentContentDate}`);

    this.date = {
      time: appointmentContentDate.nth(0),
    };

    this.resizableHandle = {
      left: this.element.locator(`.${CLASS.resizableHandleLeft}`),
      right: this.element.locator(`.${CLASS.resizableHandleRight}`),
      top: this.element.locator(`.${CLASS.resizableHandleTop}`),
      bottom: this.element.locator(`.${CLASS.resizableHandleBottom}`),
    };

    this.reducedIcon = this.element.locator(`.${CLASS.reduced.icon}`);
    this.title = this.element.locator(`.${CLASS.title}`);
    this.resourcesItems = this.element.locator(`.${CLASS.resources.item}`);
  }

  public getSize(): Promise<{ width: string; height: string }> {
    return this.element.evaluate((element) => {
      const { width, height } = getComputedStyle(element);

      return { width, height };
    });
  }

  public isFocused(): Promise<boolean> {
    return hasClass(this.element, CLASS.stateFocused);
  }

  public isAllDay(): Promise<boolean> {
    return hasClass(this.element, CLASS.allDay);
  }

  public isReduced(): Promise<boolean> {
    return hasClass(this.element, CLASS.reduced.appointment);
  }

  public isReducedHead(): Promise<boolean> {
    return hasClass(this.element, CLASS.reduced.head);
  }

  public isReducedBody(): Promise<boolean> {
    return hasClass(this.element, CLASS.reduced.body);
  }

  public isReducedTail(): Promise<boolean> {
    return hasClass(this.element, CLASS.reduced.tail);
  }

  public isDraggableSource(): Promise<boolean> {
    return hasClass(this.element, CLASS.draggableSource);
  }

  public getColor(): Promise<string> {
    return this.element.evaluate((element) => getComputedStyle(element).backgroundColor);
  }

  public getResource(label: string): Promise<string> {
    return this.getResourceElement(label).first().innerText();
  }

  public getResourceElement(label: string): Locator {
    return this.resourcesItems
      .locator('div').filter({ hasText: label })
      .locator('..')
      .locator(`.${CLASS.resources.value}`);
  }

  public getRecurrenceElement(): Locator {
    return this.element.locator(`.${CLASS.appointmentRecurrenceIcon}`);
  }

  public getAriaLabel(): Promise<string | null> {
    return this.element.getAttribute('aria-label');
  }

  public async hasAriaDescription(): Promise<boolean> {
    const id = await this.element.getAttribute('aria-describedby');

    return Boolean(id);
  }

  public async getAriaDescription(): Promise<string> {
    const id = await this.element.getAttribute('aria-describedby');

    return this.element.locator(`#${id}`).innerText();
  }
}
