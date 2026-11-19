import { expect } from '@playwright/test';
import GridModule from '../../gridCore/module';
import { classMatcher } from '../../internal/classMatcher';
import DataCell from './cell';

const CLASS = {
  focusedRow: 'dx-row-focused',
  rowRemoved: 'dx-row-removed',
  selection: 'dx-selection',
  editedRow: 'dx-edit-row',
};

export default class DataRow extends GridModule {
  private async expectClass(className: string, present: boolean): Promise<void> {
    // TestCafe reads the state of the first match; legacy fixed columns render every row twice.
    const assertion = expect(this.element.first());

    await (present ? assertion : assertion.not).toHaveClass(classMatcher(className));
  }

  public expectRemoved(present = true): Promise<void> {
    return this.expectClass(CLASS.rowRemoved, present);
  }

  public expectFocusedRow(present = true): Promise<void> {
    return this.expectClass(CLASS.focusedRow, present);
  }

  public expectSelected(present = true): Promise<void> {
    return this.expectClass(CLASS.selection, present);
  }

  public expectEdited(present = true): Promise<void> {
    return this.expectClass(CLASS.editedRow, present);
  }

  public getDataCell(index: number): DataCell {
    return new DataCell(this.element, index);
  }
}
