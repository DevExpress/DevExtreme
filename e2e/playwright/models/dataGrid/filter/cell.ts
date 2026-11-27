import type { Locator, Page } from '@playwright/test';
import GridFocusableElement from '../../gridCore/focusable';
import FocusableElement from '../../internal/focusable';

const CLASS = {
  filterEditor: 'dx-widget',
  filterEditorContainer: 'dx-editor-container',
  menuButton: 'dx-menu-item',
  filterMenu: 'dx-filter-menu',
  editorInput: 'dx-texteditor-input',
};

export default class FilterCell extends GridFocusableElement {
  public readonly menuButton: Locator;

  constructor(element: Locator) {
    super(element);
    this.menuButton = this.element.locator(`.${CLASS.menuButton}`).nth(0);
  }

  public getSearchIcon(): FocusableElement {
    return new FocusableElement(this.element.locator(`.${CLASS.filterMenu}`));
  }

  public getEditorInput(): FocusableElement {
    return new FocusableElement(this.element.locator(`.${CLASS.editorInput}`));
  }

  // The editor itself, not the widgets inside it, such as the drop-down button of a select box.
  public getEditor<T>(EditorType: new (page: Page, element: Locator) => T): T {
    return new EditorType(
      this.element.page(),
      this.element.locator(`.${CLASS.filterEditorContainer} > .${CLASS.filterEditor}`),
    );
  }
}
