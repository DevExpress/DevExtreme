import { expect } from '@playwright/test';
import GridFocusableElement from '../gridCore/focusable';
import { expectClass } from '../internal/classMatcher';
import DataCell from './data/cell';

const CLASS = {
  commandExpand: 'dx-command-expand',
  groupOpened: 'dx-datagrid-group-opened',
  focusedRow: 'dx-row-focused',
};

export default class GroupRow extends GridFocusableElement {
  public async expectExpanded(present = true): Promise<void> {
    await expect(this.element.locator(`.${CLASS.commandExpand} .${CLASS.groupOpened}`))
      .toBeAttached({ attached: present });
  }

  public expectFocusedRow(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusedRow, present);
  }

  public getCell(index: number): DataCell {
    return new DataCell(this.element, index);
  }
}
