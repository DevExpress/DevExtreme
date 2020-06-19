const CLASS = {
  focused: 'dx-state-focused',
};

export default class MultiViewItem {
  element: Selector;

  isFocused: Promise<boolean>;

  constructor(element: Selector) {
    this.element = element;
    this.isFocused = this.element.hasClass(CLASS.focused);
  }
}
