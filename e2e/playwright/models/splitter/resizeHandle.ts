import type { Locator } from '@playwright/test';
import { expectClass } from '../internal/classMatcher';

const CLASS = {
  focused: 'dx-state-focused',
  collapsePrev: 'dx-resize-handle-collapse-prev-pane',
};

export default class ResizeHandle {
  public readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  public getCollapsePrev(): Locator {
    return this.element.locator(`.${CLASS.collapsePrev}`);
  }

  public expectFocused(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focused, present);
  }
}
