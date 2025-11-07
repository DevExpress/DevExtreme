export class DataCellModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getText(): string {
    return this.root?.textContent ?? '';
  }
}
