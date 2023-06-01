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
  invalidOverlayMessage: 'dx-invalid-message',
  cellModified: 'dx-cell-modified',
  pendingIndicator: 'dx-pending-indicator',
  overlay: 'dx-overlay',
  checkbox: 'dx-checkbox',
  linkEdit: 'dx-link-edit',
};

export default class DataCell extends FocusableElement {
  isEditCell: Promise<boolean>;

  isFocused: Promise<boolean>;

  isValidationPending: Promise<boolean>;

  isInvalid: Promise<boolean>;

  isModified: Promise<boolean>;

  hasInvalidMessage: Promise<boolean>;

  isHidden: Promise<boolean>;

  constructor(dataRow: Selector, index: number, widgetName: string) {
    super(dataRow.find(`td[aria-colindex='${index + 1}']`));
    this.isEditCell = this.element.hasClass(CLASS.editCell);
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.isValidationPending = this.element.find(`div.${CLASS.pendingIndicator}`).exists;
    this.isInvalid = this.element.hasClass(CLASS.invalidCell);
    this.isModified = this.element.hasClass(CLASS.cellModified);
    this.hasInvalidMessage = this.element.find(`.${CLASS.invalidOverlayMessage}.${CLASS.overlay}`).exists;
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

  getIconByTitle(title: string): Selector {
    return this.element.find(`a[title=${title}]`);
  }
}
