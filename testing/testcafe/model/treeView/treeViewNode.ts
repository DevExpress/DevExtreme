import CheckBox from '../checkBox';

const CLASS = {
  focused: 'dx-state-focused',
  checkbox: 'dx-checkbox',
};

export default class TreeViewNode {
  private readonly element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  public get isFocused(): Promise<boolean> {
    return this.element.hasClass(CLASS.focused);
  }

  public getCheckBox(): CheckBox {
    return new CheckBox(this.element.find(`.${CLASS.checkbox}`));
  }
}
