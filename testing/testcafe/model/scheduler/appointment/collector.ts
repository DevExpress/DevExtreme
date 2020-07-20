const CLASS = {
  appointmentCollector: 'dx-scheduler-appointment-collector',
  stateFocused: 'dx-state-focused',
};

export default class AppointmentCollector {
  element: Selector;

  isFocused: Promise<boolean>;

  constructor(scheduler: Selector, index = 0, title?: string) {
    const element = scheduler.find(`.${CLASS.appointmentCollector}`);
    this.element = (title ? element.withText(title) : element).nth(index);

    this.isFocused = this.element.hasClass(CLASS.stateFocused);
  }
}
