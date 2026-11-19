import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import FocusableElement from '../../internal/focusable';

export default class HeaderCell extends FocusableElement {
  constructor(headerRow: Locator, index: number) {
    super(headerRow.locator(`td[aria-colindex='${index + 1}']`));
  }

  public async expectFocused(present = true): Promise<void> {
    await (present ? expect(this.element) : expect(this.element).not).toBeFocused();
  }

  public getFilterIcon(): Locator {
    return this.element.locator('.dx-column-indicators > .dx-header-filter');
  }
}
