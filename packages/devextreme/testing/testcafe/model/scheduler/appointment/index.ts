import { ClientFunction } from 'testcafe';

const CLASS = {
  appointment: 'dx-scheduler-appointment',
  appointmentContentDate: 'dx-scheduler-appointment-content-date',
  dateTableCell: 'dx-scheduler-date-table-cell',
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
};

export default class Appointment {
  element: Selector;

  date: { time: Promise<string> };

  resizableHandle: { left: Selector; right: Selector; top: Selector; bottom: Selector };

  size: { width: Promise<string>; height: Promise<string> };

  isFocused: Promise<boolean>;

  isAllDay: Promise<boolean>;

  isReduced: Promise<boolean>;

  isReducedHead: Promise<boolean>;

  isReducedBody: Promise<boolean>;

  isReducedTail: Promise<boolean>;

  isDraggableSource: Promise<boolean>;

  title: Promise<string>;

  resourcesItems: Selector;

  reducedIcon: Selector;

  constructor(scheduler: Selector, index = 0, title?: string) {
    const element = scheduler.find(`.${CLASS.appointment}`);
    this.element = (title ? element.withAttribute('title', title) : element).nth(index);

    const appointmentContentDate = this.element.find(`.${CLASS.appointmentContentDate}`);

    this.date = {
      time: appointmentContentDate.nth(0).innerText,
    };

    this.resizableHandle = {
      left: this.element.find(`.${CLASS.resizableHandleLeft}`),
      right: this.element.find(`.${CLASS.resizableHandleRight}`),
      top: this.element.find(`.${CLASS.resizableHandleTop}`),
      bottom: this.element.find(`.${CLASS.resizableHandleBottom}`),
    };

    this.size = {
      width: this.element.getStyleProperty('width'),
      height: this.element.getStyleProperty('height'),
    };

    this.isFocused = this.element.hasClass(CLASS.stateFocused);
    this.isAllDay = this.element.hasClass(CLASS.allDay);

    this.reducedIcon = this.element.find(`.${CLASS.reduced.icon}`);

    this.isReduced = this.element.hasClass(CLASS.reduced.appointment);
    this.isReducedHead = this.element.hasClass(CLASS.reduced.head);
    this.isReducedBody = this.element.hasClass(CLASS.reduced.body);
    this.isReducedTail = this.element.hasClass(CLASS.reduced.tail);
    this.isDraggableSource = this.element.hasClass(CLASS.draggableSource);
    this.title = this.element.find(`.${CLASS.title}`).innerText;
    this.resourcesItems = this.element.find(`.${CLASS.resources.item}`);
  }

  getColor(): Promise<string> {
    const appointment = this.element;

    return ClientFunction(
      () => getComputedStyle(appointment() as any).backgroundColor,
      {
        dependencies: {
          appointment,
        },
      },
    )();
  }

  getResource(label: string): Promise<string> {
    return this.resourcesItems
      .find('div').withText(label)
      .parent(0).find(`.${CLASS.resources.value}`)
      .innerText;
  }
}
