const SELECTORS = {
  editorCell: 'dx-editor-cell',
  widget: 'dx-widget',
};

export class FilterCellModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getEditor<T>(EditorModel: new (element: HTMLElement) => T): T {
    const editorElement = this.root?.querySelector(`.${SELECTORS.widget}`) as HTMLElement;
    return new EditorModel(editorElement);
  }
}
