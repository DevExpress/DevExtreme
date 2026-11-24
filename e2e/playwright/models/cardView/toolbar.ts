import type { Locator } from '@playwright/test';
import Button from '../button';

export default class Toolbar {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public getAddButton(): Button {
    return new Button(this.element.page(), this.element.locator('[aria-label=\'add\']'));
  }
}
