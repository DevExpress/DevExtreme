import type { Locator } from '@playwright/test';
import { expectClass } from './classMatcher';

const CLASS = {
  focusedState: 'dx-state-focused',
};

export default class FocusableElement {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public expectFocusedState(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusedState, present);
  }
}
