import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';

export default class HeaderCell extends GridFocusableElement {
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
