import type { Locator } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';
import { expectClass } from '../../internal/classMatcher';
import { CellEditor } from './cellEditor';

const CLASS = {
  editCell: 'dx-editor-cell',
  editorInput: 'dx-texteditor-input',
  cellModified: 'dx-cell-modified',
  checkbox: 'dx-checkbox',
};

export default class DataCell extends GridFocusableElement {
  constructor(dataRow: Locator, index: number) {
    super(dataRow.locator(`td[aria-colindex='${index + 1}']`));
  }

  public expectEditCell(present = true): Promise<void> {
    return expectClass(this.element, CLASS.editCell, present);
  }

  public expectModified(present = true): Promise<void> {
    return expectClass(this.element, CLASS.cellModified, present);
  }

  public getEditor(): CellEditor {
    return new CellEditor(this.element.locator(`.${CLASS.editorInput}, .${CLASS.checkbox}`));
  }

  public getCheckbox(): Locator {
    return this.element.locator(`.${CLASS.checkbox}`);
  }
}
