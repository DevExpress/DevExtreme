const CLASS = {
  focused: 'dx-state-focused',
};

export default class TabItem {
  element: Selector;

  isFocused: Promise<boolean>;

  constructor(element: Selector) {
    this.element = element;
    this.isFocused = element.hasClass(CLASS.focused);
  }
}
