import { ClientFunction, Selector } from 'testcafe';
// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
  checkboxChecked: 'dx-checkbox-checked',
  stateDisabled: 'dx-state-disabled',
  checkbox: 'dx-checkbox',
  treeViewItem: 'dx-treeview-item',
  treeViewItemContent: 'dx-treeview-item-content',
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
    return this.getCheckbox(nth).hasClass(CLASS.stateDisabled);
  }

  isColumnDisabled(index = 0): Promise<boolean> {
    return this.getColumn(index).find(`.${CLASS.treeViewItemContent}`).hasClass(CLASS.stateDisabled);
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

  async getColumnTexts(): Promise<string[]> {
    const result: string[] = [];
    const columns = this.getColumns();
    const columnCount = await columns.count;

    for (let i = 0; i < columnCount; i += 1) {
      result.push(await columns.nth(i).textContent);
    }

    return result;
  }

  getTitle(): Selector {
    return this.content.find(`.${CLASS.itemContent}.${CLASS.itemContentToolbar}`).nth(0);
  }

  getEmptyMessage(): Selector {
    return this.content.find(`.${CLASS.emptyMessage}`);
  }
}