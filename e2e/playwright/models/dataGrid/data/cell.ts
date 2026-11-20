import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import { classMatcher } from '../../internal/classMatcher';

const CLASS = {
  editCell: 'dx-editor-cell',
  focused: 'dx-focused',
  cellModified: 'dx-cell-modified',
};

export default class DataCell extends FocusableElement {
  constructor(dataRow: Locator, index: number) {
    super(dataRow.locator(`td[aria-colindex='${index + 1}']`));
  }

  private async expectClass(className: string, present: boolean): Promise<void> {
    // TestCafe reads the state of the first match; legacy fixed columns render every row twice.
    const assertion = expect(this.element.first());

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(className));
  }

  public expectEditCell(present = true): Promise<void> {
    return this.expectClass(CLASS.editCell, present);
  }

  public expectFocused(present = true): Promise<void> {
    return this.expectClass(CLASS.focused, present);
  }

  public expectModified(present = true): Promise<void> {
    return this.expectClass(CLASS.cellModified, present);
  }
}
