import CheckBox from './checkBox';
import RadioButton from './radioButton';

const CLASS = {
  disabled: 'dx-state-disabled',
  focused: 'dx-state-focused',
  hovered: 'dx-state-hover',
  reorderHandle: 'dx-list-reorder-handle',
};

export default class ListItem {
  element: Selector;

  checkBox: CheckBox;

  isDisabled: Promise<boolean>;

  isFocused: Promise<boolean>;

  isHovered: Promise<boolean>;

  radioButton: RadioButton;

  reorderHandle: Selector;

  text: Promise<string>;

  constructor(element: Selector) {
    this.element = element;
    this.checkBox = new CheckBox(element);
    this.isDisabled = element.hasClass(CLASS.disabled);
    this.isFocused = element.hasClass(CLASS.focused);
    this.isHovered = element.hasClass(CLASS.hovered);
    this.radioButton = new RadioButton(element);
    this.reorderHandle = element.find(`.${CLASS.reorderHandle}`);
    this.text = element.textContent;
  }
}
