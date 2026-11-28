import { Selector } from 'testcafe';
// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
  checkboxChecked: 'dx-checkbox-checked',
  checkbox: 'dx-checkbox',
  treeViewItem: 'dx-treeview-item',
  itemContent: 'dx-item-content',
  itemContentToolbar: 'dx-toolbar-item-content',
  emptyMessage: 'dx-empty-message',
  closeButton: 'dx-closebutton',
};

export default class ColumnChooser extends FocusableElement {
  body: Selector;

  content: Selector;

  isOpened: Promise<boolean>;

  constructor(element: Selector) {
    super(element);

    this.body = Selector('body');
    this.content = this.element.find(`.${CLASS.overlayContent}`);
    this.isOpened = this.body.find(`.${CLASS.overlayWrapper}.${CLASS.columnChooser}`).exists;
  }

  getCheckbox(nth = 0): Selector {
    return this.content.find(`.${CLASS.checkbox}`).nth(nth);
  }

  isCheckboxChecked(nth = 0): Promise<boolean> {
    return this.getCheckbox(nth).hasClass(CLASS.checkboxChecked);
  }

  getColumnsCount(): Promise<number> {
    return this.content.find(`.${CLASS.treeViewItem}`).count;
  }

  getColumn(index = 0): Selector {
    return this.content.find(`.${CLASS.treeViewItem}`).nth(index);
  }

  getColumns(): Selector {
    return this.content.find(`.${CLASS.treeViewItem}`);
  }

  getTitle(): Selector {
    return this.content.find(`.${CLASS.itemContent}.${CLASS.itemContentToolbar}`).nth(0);
  }

  getEmptyMessage(): Selector {
    return this.content.find(`.${CLASS.emptyMessage}`);
  }

  getCloseButton(): Selector {
    return this.element.find(`.${CLASS.closeButton}`);
  }
}
