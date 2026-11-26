import type { Locator } from '@playwright/test';

export default class GridElement {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }
}
