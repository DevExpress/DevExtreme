export class BaseRowModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getCells(): NodeListOf<HTMLElement> {
    return this.root?.querySelectorAll('td') as NodeListOf<HTMLElement>;
  }

  public getCell(columnIndex: number): HTMLElement | null {
    return this.getCells()?.[columnIndex] ?? null;
  }
}
