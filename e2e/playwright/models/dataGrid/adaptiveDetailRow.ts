import type { Locator } from '@playwright/test';

export default class AdaptiveDetailRow {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }
}
