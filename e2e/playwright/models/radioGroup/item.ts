import type { Locator } from '@playwright/test';
import RadioButton from './button';

const CLASS = {
  itemContent: 'dx-item-content',
};

export default class RadioGroupItem {
  public readonly element: Locator;

  public readonly content: Locator;

  public readonly radioButton: RadioButton;

  constructor(element: Locator) {
    this.element = element;
    this.content = element.locator(`:scope > .${CLASS.itemContent}`);
    this.radioButton = new RadioButton(element);
  }
}
