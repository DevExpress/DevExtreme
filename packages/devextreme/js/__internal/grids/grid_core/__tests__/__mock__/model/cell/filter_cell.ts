const SELECTORS = {
  editorCell: 'dx-editor-cell',
  editorContainer: 'dx-editor-container',
  widget: 'dx-widget',
  menuItem: 'dx-menu-item',
  filterMenu: 'dx-filter-menu',
  contextMenu: 'dx-context-menu',
};

export class FilterCellModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getEditor<T>(EditorModel: new (element: HTMLElement) => T): T {
    const editorElement = this.root?.querySelector(`.${SELECTORS.editorContainer} .${SELECTORS.widget}`) as HTMLElement;
    return new EditorModel(editorElement);
  }

  public getMenuButton(): HTMLElement {
    return this.root?.querySelector(`.${SELECTORS.menuItem}`) as HTMLElement;
  }

  public getMenuItemByText(text: string): HTMLElement {
    const menuItems = document.querySelectorAll<HTMLElement>(
      `.${SELECTORS.contextMenu}.${SELECTORS.filterMenu} .${SELECTORS.menuItem}`,
    );

    return Array.from(menuItems).find((item) => item.textContent === text) as HTMLElement;
  }
}
