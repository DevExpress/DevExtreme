import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export default class HeaderCell {
  public readonly element: Locator;

  constructor(headerRow: Locator, index: number) {
    this.element = headerRow.locator(`td[aria-colindex='${index + 1}']`);
  }

  public async expectFocused(present = true): Promise<void> {
    await (present ? expect(this.element) : expect(this.element).not).toBeFocused();
  }

  public getFilterIcon(): Locator {
    return this.element.locator('.dx-column-indicators > .dx-header-filter');
  }
}
