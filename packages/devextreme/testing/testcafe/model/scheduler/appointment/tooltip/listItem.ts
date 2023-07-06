const CLASS = {
  listItem: 'dx-list-item',
  stateFocused: 'dx-state-focused',
  contentDate: 'dx-tooltip-appointment-item-content-date',
  contentSubject: 'dx-tooltip-appointment-item-content-subject',
};

export default class ListItem {
  readonly element: Selector;

  readonly date: Selector;

  readonly subject: Selector;

  constructor(wrapper: Selector, title?: string, index = 0) {
    if (title) {
      this.element = wrapper.find(`.${CLASS.listItem}`).withText(title).nth(index);
    } else {
      this.element = wrapper.find(`.${CLASS.listItem}`).nth(index);
    }
    this.date = this.element.find(`.${CLASS.contentDate}`);
    this.subject = this.element.find(`.${CLASS.contentSubject}`);
  }

  get isFocused(): Promise<boolean> {
    return this.element.hasClass(CLASS.stateFocused);
  }
}
