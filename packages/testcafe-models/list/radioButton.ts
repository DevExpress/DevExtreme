const CLASS = {
  focused: 'dx-state-focused',
  radioButton: 'dx-radiobutton',
  radioButtonChecked: 'dx-radiobutton-checked',
};

export default class RadioButton {
  element: Selector;

  isChecked: Promise<boolean>;

  isFocused: Promise<boolean>;

  constructor(item: Selector) {
    this.element = item.find(`.${CLASS.radioButton}`);
    this.isChecked = this.element.hasClass(CLASS.radioButtonChecked);
    this.isFocused = item.hasClass(CLASS.focused);
  }
}
