export const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
  stateFocused: 'dx-state-focused',
  compact: 'dx-scheduler-appointment-collector-compact',
};

export default class AppointmentCollector {
  readonly element: Selector;

  constructor(scheduler: Selector, index = 0, title?: string) {
    const element = scheduler.find(`.${CLASS.appointmentCollector}`);
    this.element = (title ? element.withText(title) : element).nth(index);
  }

  get isFocused(): Promise<boolean> {
    return this.element.hasClass(CLASS.stateFocused);
  }

  get isCompact(): Promise<boolean> {
    return this.element.hasClass(CLASS.compact);
  }
}
