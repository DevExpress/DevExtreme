const SELECTORS = {
  expandCell: 'dx-command-expand',
};

export class GroupRowModel {
  constructor(protected readonly root: HTMLElement | null) {
  }

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getExpandCell(): HTMLElement {
    const row = this.getElement() as HTMLElement;

    return row.querySelector(`.${SELECTORS.expandCell}`) as HTMLElement;
  }

  public getCells(): NodeListOf<HTMLElement> {
    const row = this.getElement() as HTMLElement;

    return row.querySelectorAll('td');
  }
}
