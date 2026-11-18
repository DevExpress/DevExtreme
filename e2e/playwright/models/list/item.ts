import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';
import ListItemCheckBox from './checkBox';

const CLASS = {
  disabled: 'dx-state-disabled',
};

export default class ListItem {
  public readonly element: Locator;

  public readonly checkBox: ListItemCheckBox;

  constructor(element: Locator) {
    this.element = element;
    this.checkBox = new ListItemCheckBox(element);
  }

  public expectDisabled(present = true): Promise<void> {
    return expectClass(this.element, CLASS.disabled, present);
  }
}
