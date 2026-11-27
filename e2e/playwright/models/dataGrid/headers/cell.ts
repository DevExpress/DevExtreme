import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';
import { expectClass } from '../../internal/classMatcher';

// The grid prefixes the class with its name, which a cell doesn't know.
const HIDDEN_COLUMN_CLASS = 'dx-(datagrid|treelist)-hidden-column';

export default class HeaderCell extends GridFocusableElement {
  constructor(headerRow: Locator, index: number) {
    super(headerRow.locator(`td[aria-colindex='${index + 1}']`));
  }

  public async expectFocused(present = true): Promise<void> {
    await (present ? expect(this.element) : expect(this.element).not).toBeFocused();
  }

  public expectHidden(present = true): Promise<void> {
    return expectClass(this.element, HIDDEN_COLUMN_CLASS, present);
  }

  public getFilterIcon(): Locator {
    return this.element.locator('.dx-column-indicators > .dx-header-filter');
  }
}
