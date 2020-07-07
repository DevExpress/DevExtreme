const CLASS = {
  listItem: 'dx-list-item',
  stateFocused: 'dx-state-focused',
  tooltipAppointmentItemContentDate: 'dx-tooltip-appointment-item-content-date',
  tooltipAppointmentItemContentSubject: 'dx-tooltip-appointment-item-content-subject',
};

export default class AppointmentTooltipListItem {
  element: Selector;

  date: Selector;

  subject: Selector;

  isFocused: Promise<boolean>;

  constructor(wrapper: Selector, title: string, index = 0) {
    this.element = wrapper.find(`.${CLASS.listItem}`).withText(title).nth(index);
    this.isFocused = this.element.hasClass(CLASS.stateFocused);

    this.date = this.element.find(`.${CLASS.tooltipAppointmentItemContentDate}`);
    this.subject = this.element.find(`.${CLASS.tooltipAppointmentItemContentSubject}`);
  }
}
