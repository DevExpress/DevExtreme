import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';
import ListItemCheckBox from './checkBox';
import ListItemRadioButton from './radioButton';

const CLASS = {
  disabled: 'dx-state-disabled',
  focused: 'dx-state-focused',
  hovered: 'dx-state-hover',
  selected: 'dx-list-item-selected',
  reorderHandle: 'dx-list-reorder-handle',
};

export default class ListItem {
  public readonly element: Locator;

  public readonly checkBox: ListItemCheckBox;

  public readonly radioButton: ListItemRadioButton;

  public readonly reorderHandle: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.checkBox = new ListItemCheckBox(element);
    this.radioButton = new ListItemRadioButton(element);
    this.reorderHandle = element.locator(`.${CLASS.reorderHandle}`);
  }

  public expectDisabled(present = true): Promise<void> {
    return expectClass(this.element, CLASS.disabled, present);
  }

  public expectFocused(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focused, present);
  }

  public expectHovered(present = true): Promise<void> {
    return expectClass(this.element, CLASS.hovered, present);
  }

  public expectSelected(present = true): Promise<void> {
    return expectClass(this.element, CLASS.selected, present);
  }
}
