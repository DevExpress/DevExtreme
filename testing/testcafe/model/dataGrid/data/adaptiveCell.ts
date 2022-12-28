import FocusableElement from '../../internal/focusable';

const CLASS = {
  focused: 'dx-focused',
  fieldItemContent: 'dx-field-item-content',
  textBox: 'dx-textbox',
};

export default class AdaptiveCell extends FocusableElement {
  isFocused: Promise<boolean>;

  isEditCell: Promise<boolean>;

  constructor(adaptiveRow: Selector, index: number) {
    super(adaptiveRow.find(`.${CLASS.fieldItemContent}`).nth(index));
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isEditCell = this.element.child(`.${CLASS.textBox}`).exists;
  }
}
