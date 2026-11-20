// eslint-disable-next-line max-classes-per-file
import { Selector } from 'testcafe';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import { CellEditor } from './cellEditor';

const CLASS = {
  hiddenColumn: 'hidden-column',
  editCell: 'dx-editor-cell',
  focused: 'dx-focused',
  editorInput: 'dx-texteditor-input',
  invalidCell: 'dx-datagrid-invalid',
  cellModified: 'dx-cell-modified',
  checkbox: 'dx-checkbox',
  linkEdit: 'dx-link-edit',
  linkCancel: 'dx-link-cancel',
};

export default class DataCell extends FocusableElement {
  isEditCell: Promise<boolean>;

  isFocused: Promise<boolean>;

  isInvalid: Promise<boolean>;

  isModified: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(dataRow: Selector, index: number, widgetName: string) {
    super(dataRow.find(`td[aria-colindex='${index + 1}']`));
    this.isEditCell = this.element.hasClass(CLASS.editCell);
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isInvalid = this.element.hasClass(CLASS.invalidCell);
    this.isModified = this.element.hasClass(CLASS.cellModified);
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  static getModifiedCells(): Selector {
    return Selector(`.${CLASS.cellModified}`);
  }

  getEditor(): CellEditor {
    return new CellEditor(this.element.find(`.${CLASS.editorInput}, .${CLASS.checkbox}`));
  }

  getCheckbox(): Selector {
    return this.element.find(`.${CLASS.checkbox}`);
  }

  getLinkEdit(): Selector {
    return this.element.find(`.${CLASS.linkEdit}`);
  }

  getLinkCancel(): Selector {
    return this.element.find(`.${CLASS.linkCancel}`);
  }

  getIconByTitle(title: string): Selector {
    return this.element.find(`a[title=${title}]`);
  }
}
