import type { Locator, Page } from '@playwright/test';
import GridElement from '../../gridCore/element';

const CLASS = {
  filterEditor: 'dx-widget',
  filterEditorContainer: 'dx-editor-container',
  menuButton: 'dx-menu-item',
};

export default class FilterCell extends GridElement {
  public readonly menuButton: Locator;

  constructor(element: Locator) {
    super(element);
    this.menuButton = this.element.locator(`.${CLASS.menuButton}`).nth(0);
  }

  public getEditor<T>(EditorType: new (page: Page, element: Locator) => T): T {
    return new EditorType(
      this.element.page(),
      this.element.locator(`.${CLASS.filterEditorContainer} .${CLASS.filterEditor}`),
    );
  }
}
