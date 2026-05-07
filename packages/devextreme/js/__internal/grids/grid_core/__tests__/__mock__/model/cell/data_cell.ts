const SELECTORS = {
  editCell: 'dx-editor-cell',
  invalidCell: 'invalid',
  widget: 'dx-widget',
};

export class DataCellModel {
  public readonly isEditCell: boolean;

  public readonly isValidCell: boolean;

  constructor(
    protected readonly root: HTMLElement | null,
    protected readonly addWidgetPrefix: (classNames: string) => string,
  ) {
    this.isEditCell = !!this.root?.classList.contains(SELECTORS.editCell);
    this.isValidCell = !this.root?.classList.contains(addWidgetPrefix(SELECTORS.invalidCell));
  }

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getText(): string {
    return this.root?.textContent ?? '';
  }

  public getHTML(): string {
    return this.root?.innerHTML ?? '';
  }

  public getEditor<T>(EditorModel: new (element: HTMLElement) => T): T {
    const editorElement = this.root?.querySelector(`.${SELECTORS.widget}`) as HTMLElement;
    return new EditorModel(editorElement);
  }
}
