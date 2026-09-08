import type { Locator } from '@playwright/test';
import { hasClass } from '../internal/hasClass';
import ListItemCheckBox from './checkBox';

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

  public readonly reorderHandle: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.checkBox = new ListItemCheckBox(element);
    this.reorderHandle = element.locator(`.${CLASS.reorderHandle}`);
  }

  public isDisabled(): Promise<boolean> {
    return hasClass(this.element, CLASS.disabled);
  }

  public isFocused(): Promise<boolean> {
    return hasClass(this.element, CLASS.focused);
  }

  public isHovered(): Promise<boolean> {
    return hasClass(this.element, CLASS.hovered);
  }

  public isSelected(): Promise<boolean> {
    return hasClass(this.element, CLASS.selected);
  }
}
