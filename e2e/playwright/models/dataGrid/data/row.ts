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

  public getDataCell(index: number): DataCell {
    return new DataCell(this.element, index);
  }

  public getCommandCell(index: number): CommandCell {
    return new CommandCell(this.element, index);
  }
}
