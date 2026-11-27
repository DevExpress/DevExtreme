import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';
import { expectClass } from '../../internal/classMatcher';
import CommandCell from '../commandCell';
import DataCell from './cell';

const CLASS = {
  focusedRow: 'dx-row-focused',
  rowRemoved: 'dx-row-removed',
  selection: 'dx-selection',
  insertedRow: 'dx-row-inserted',
  editedRow: 'dx-edit-row',
  commandExpand: 'dx-command-expand',
  groupOpened: 'dx-datagrid-group-opened',
  selectCheckBox: 'dx-select-checkbox',
  stateHover: 'dx-state-hover',
  commandDrag: 'dx-command-drag',
};

export default class DataRow extends GridFocusableElement {
  public expectRemoved(present = true): Promise<void> {
    return expectClass(this.element, CLASS.rowRemoved, present);
  }

  public expectFocusedRow(present = true): Promise<void> {
    return expectClass(this.element, CLASS.focusedRow, present);
  }

  public expectSelected(present = true): Promise<void> {
    return expectClass(this.element, CLASS.selection, present);
  }

  public expectInserted(present = true): Promise<void> {
    return expectClass(this.element, CLASS.insertedRow, present);
  }

  public expectEdited(present = true): Promise<void> {
    return expectClass(this.element, CLASS.editedRow, present);
  }

  public expectHovered(present = true): Promise<void> {
    return expectClass(this.element, CLASS.stateHover, present);
  }

  public async expectExpanded(present = true): Promise<void> {
    await expect(this.element.locator(`.${CLASS.commandExpand} .${CLASS.groupOpened}`))
      .toBeAttached({ attached: present });
  }

  public getDataCell(index: number): DataCell {
    return new DataCell(this.element, index);
  }

  public getCommandCell(index: number): CommandCell {
    return new CommandCell(this.element, index);
  }

  public getSelectCheckBox(): Locator {
    return this.element.locator(`.${CLASS.selectCheckBox}`);
  }

  public getDragCommand(): Locator {
    return this.element.locator(`.${CLASS.commandDrag}`);
  }

  public getOffset(): Promise<JQuery.Coordinates | undefined> {
    return this.element.evaluate((element) => $(element).offset());
  }
}
