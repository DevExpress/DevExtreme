import type { Locator } from '@playwright/test';
import ListItemCheckBox from './checkBox';

export default class ListItem {
  public readonly element: Locator;

  public readonly checkBox: ListItemCheckBox;

  constructor(element: Locator) {
    this.element = element;
    this.checkBox = new ListItemCheckBox(element);
  }
}
