const CLASS = {
  checkbox: 'dx-checkbox',
  checkboxChecked: 'dx-checkbox-checked',
  focused: 'dx-state-focused',
};

export default class CheckBox {
  element: Selector;

  isChecked: Promise<boolean>;

  isFocused: Promise<boolean>;

  constructor(item: Selector) {
    this.element = item.find(`.${CLASS.checkbox}`);
    this.isChecked = this.element.hasClass(CLASS.checkboxChecked);
    this.isFocused = item.hasClass(CLASS.focused);
  }
}
