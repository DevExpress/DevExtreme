import { ClientFunction, Selector } from 'testcafe';
// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';
import { title } from 'node:process';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
  checkboxChecked: 'dx-checkbox-checked',
  checkboxDisabled: 'dx-state-disabled',
  checkbox: 'dx-checkbox',
  treeViewItem: 'dx-treeview-item',
  treeView: 'dx-treeview',
  itemContent: 'dx-item-content',
  itemContentToolbar: 'dx-toolbar-item-content',
  emptyMessage: 'dx-empty-message',
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

  async focusList() {
    const treeView = this.content.find(`.${CLASS.treeView}`);

    await ClientFunction((container) => {
      const $treeView = $(container());

      $treeView.trigger('focus');
    }, {
      dependencies: {
        treeView,
      }
    })(treeView);
  }

  getCheckbox(nth = 0): Selector {
    return this.content.find(`.${CLASS.checkbox}`).nth(nth);
  }

  isCheckboxChecked(nth = 0): Promise<boolean> {
    return this.getCheckbox(nth).hasClass(CLASS.checkboxChecked);
  }

  isCheckboxDisabled(nth = 0): Promise<boolean> {
    return this.getCheckbox(nth).hasClass(CLASS.checkboxDisabled);
  }

  getColumnsCount(): Promise<number> {
    return this.content.find(`.${CLASS.treeViewItem}`).count;
  }

  getColumn(index = 0): Selector {
    return this.content.find(`.${CLASS.treeViewItem}`).nth(index);
  }

  getTitle(): Selector {
    return this.content.find(`.${CLASS.itemContent}.${CLASS.itemContentToolbar}`).nth(0);
  }

  getEmptyMessage(): Selector {
    return this.content.find(`.${CLASS.emptyMessage}`);
  }
}