import type { Locator } from '@playwright/test';
import { hasClass } from '../internal/hasClass';

const CLASS = {
  invisible: 'dx-state-invisible',
};

export default class Overlay {
  public readonly element: Locator;

  constructor(selector: Locator) {
    this.element = selector;
  }

  public isInvisible(): Promise<boolean> {
    return hasClass(this.element, CLASS.invisible);
  }
}
