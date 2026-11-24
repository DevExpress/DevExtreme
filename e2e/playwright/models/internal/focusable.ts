import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { classMatcher } from './classMatcher';

const CLASS = {
  focusedState: 'dx-state-focused',
  hiddenFocusedState: 'dx-cell-focus-disabled',
};

export default class FocusableElement {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public async expectFocusedState(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.focusedState));
  }

  public async expectHiddenFocusState(present = true): Promise<void> {
    const assertion = expect(this.element);

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.hiddenFocusedState));
  }
}
