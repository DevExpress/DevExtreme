import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import GridFocusableElement from '../gridCore/focusable';
import DataCell from './data/cell';

const CLASS = {
  commandExpand: 'dx-command-expand',
  groupOpened: 'dx-datagrid-group-opened',
};

export default class GroupRow extends GridFocusableElement {
  public getCell(index: number): DataCell {
    return new DataCell(this.element, index);
  }

  public getExpandCell(): Locator {
    return this.element.locator(`.${CLASS.commandExpand}`);
  }

  public async expectExpanded(present = true): Promise<void> {
    await expect(this.element.locator(`.${CLASS.commandExpand} .${CLASS.groupOpened}`))
      .toBeAttached({ attached: present });
  }
}
