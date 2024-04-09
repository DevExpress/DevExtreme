const CLASS = {
  focusedState: 'dx-state-focused',
  hiddenFocusedState: 'dx-cell-focus-disabled',
};

export default class FocusableElement {
  element: Selector;

  hasFocusedState: Promise<boolean>;

  hasHiddenFocusState: Promise<boolean>;

  constructor(element: Selector) {
    this.element = element;
    this.hasFocusedState = this.element.hasClass(CLASS.focusedState);
    this.hasHiddenFocusState = this.element.hasClass(CLASS.hiddenFocusedState);
  }
}
