const SELECTORS = {
  textEditorInput: 'dx-texteditor-input',
  item: 'dx-item',
};

export class EditFormModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getItem(id: string): HTMLElement | null {
    return this.root?.querySelector(`.${SELECTORS.textEditorInput}[id*=_${id}]`) ?? null;
  }

  public getItems(): NodeListOf<HTMLElement> | null {
    return this.root?.querySelectorAll(`.${SELECTORS.item}`) ?? null;
  }
}
