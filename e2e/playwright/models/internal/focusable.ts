import type { Locator } from '@playwright/test';
import { hasClass } from './hasClass';

const CLASS = {
  focusedState: 'dx-state-focused',
  hiddenFocusedState: 'dx-cell-focus-disabled',
};

export default class FocusableElement {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public hasFocusedState(): Promise<boolean> {
    return hasClass(this.element, CLASS.focusedState);
  }

  public hasHiddenFocusState(): Promise<boolean> {
    return hasClass(this.element, CLASS.hiddenFocusedState);
  }
}
