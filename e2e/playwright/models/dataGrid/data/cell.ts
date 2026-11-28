import type { Locator } from '@playwright/test';
import DropDownButton from '../../dropDownButton';
import GridFocusableElement from '../../gridCore/focusable';
import { expectClass } from '../../internal/classMatcher';
import { CellEditor } from './cellEditor';

const CLASS = {
  editCell: 'dx-editor-cell',
  editorInput: 'dx-texteditor-input',
  cellModified: 'dx-cell-modified',
  checkbox: 'dx-checkbox',
  pendingIndicator: 'dx-pending-indicator',
  invalidMessage: 'dx-invalid-message',
  overlay: 'dx-overlay',
  dropDownButton: 'dx-dropdownbutton',
  linkEdit: 'dx-link-edit',
};

// The grid prefixes the class with its name, which a cell doesn't know.
const INVALID_CELL_CLASS = 'dx-(datagrid|treelist)-invalid';
const HIDDEN_COLUMN_CLASS = 'dx-(datagrid|treelist)-hidden-column';

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

  public expectInvalid(present = true): Promise<void> {
    return expectClass(this.element, INVALID_CELL_CLASS, present);
  }

  public getPendingIndicator(): Locator {
    return this.element.locator(`.${CLASS.pendingIndicator}`);
  }

  public getInvalidMessage(): Locator {
    return this.element.locator(`.${CLASS.invalidMessage}.${CLASS.overlay}`);
  }

  public expectHidden(present = true): Promise<void> {
    return expectClass(this.element, HIDDEN_COLUMN_CLASS, present);
  }

  public getLinkEdit(): Locator {
    return this.element.locator(`.${CLASS.linkEdit}`);
  }

  public getIconByTitle(title: string): Locator {
    return this.element.locator(`a[title="${title}"]`);
  }

  public getDropDownButton(): DropDownButton {
    return new DropDownButton(this.element.page(), this.element.locator(`.${CLASS.dropDownButton}`));
  }
}
