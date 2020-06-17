const CLASS = {
  focused: 'dx-state-focused',
  icon: 'dx-radiobutton-icon',
  radioButtonChecked: 'dx-radiobutton-checked',
};

export default class RadioButton {
  element: Selector;

  isChecked: Promise<boolean>;

  isFocused: Promise<boolean>;

  constructor(item: Selector) {
    this.element = item.find(`.${CLASS.icon}`);
    this.isChecked = item.hasClass(CLASS.radioButtonChecked);
    this.isFocused = item.hasClass(CLASS.focused);
  }
}
