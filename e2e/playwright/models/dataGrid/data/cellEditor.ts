import type { Locator } from '@playwright/test';
import GridElement from '../../gridCore/element';
import { expectClass } from '../../internal/classMatcher';

const CLASS = {
  checkboxChecked: 'dx-checkbox-checked',
  dropDownEditorButton: 'dx-dropdowneditor-button',
  editFormItem: 'dx-datagrid-edit-form-item',
  fieldItemLabel: 'dx-field-item-label',
};

export class CellEditor extends GridElement {
  public getItemLabel(): Locator {
    return this.element
      .locator(`xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' ${CLASS.editFormItem} ')]`)
      .locator(`.${CLASS.fieldItemLabel}`);
  }

  public getDropDownButton(): Locator {
    return this.element.locator('xpath=../..').locator(`.${CLASS.dropDownEditorButton}`);
  }

  public expectChecked(present = true): Promise<void> {
    return expectClass(this.element, CLASS.checkboxChecked, present);
  }
}
