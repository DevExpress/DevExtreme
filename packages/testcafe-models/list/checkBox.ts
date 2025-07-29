const CLASS = {
  checkbox: 'dx-checkbox',
  checkboxChecked: 'dx-checkbox-checked',
  indeterminate: 'dx-checkbox-indeterminate',
  focused: 'dx-state-focused',
};

export default class CheckBox {
  element: Selector;

  isChecked: Promise<boolean>;

  isFocused: Promise<boolean>;

  isIndeterminate: Promise<boolean>;

  constructor(item: Selector) {
    this.element = item.find(`.${CLASS.checkbox}`);
    this.isChecked = this.element.hasClass(CLASS.checkboxChecked);
    this.isIndeterminate = this.element.hasClass(CLASS.indeterminate);
    this.isFocused = item.hasClass(CLASS.focused);
  }

  async getCheckBoxState(): Promise<'checked' | 'unchecked' | 'indeterminate'> {
    const isChecked = await this.isChecked;
    const isIndeterminate = await this.isIndeterminate;

    if (isChecked && !isIndeterminate) {
      return 'checked';
    }
    if (!isChecked && !isIndeterminate) {
      return 'unchecked';
    }
    if (!isChecked && isIndeterminate) {
      return 'indeterminate';
    }

    throw Error(`Invalid checkbox state. checked = ${isChecked}, indeterminate = ${isIndeterminate}`);
  }
}
