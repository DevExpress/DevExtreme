const CLASS = {
  checkboxChecked: 'dx-checkbox-checked',
  dropDownEditorButton: 'dx-dropdowneditor-button',
  editFormItem: 'dx-datagrid-edit-form-item',
  fieldItemLabel: 'dx-field-item-label',
};

export class CellEditor {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  getItemLabel(): Selector {
    return this.element.parent(`.${CLASS.editFormItem}`).find(`.${CLASS.fieldItemLabel}`);
  }

  getDropDownButton(): Selector {
    return this.element.parent().parent().find(`.${CLASS.dropDownEditorButton}`);
  }

  isChecked(): Promise<boolean> {
    return this.element.hasClass(CLASS.checkboxChecked);
  }
}
