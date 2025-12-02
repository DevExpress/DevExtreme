const SELECTORS = {
  editRow: 'dx-edit-row',
};

export class DataRowModel {
  public readonly isEditRow: boolean;

  constructor(protected readonly root: HTMLElement | null) {
    this.isEditRow = !!this.root?.classList.contains(SELECTORS.editRow);
  }

  public getElement(): HTMLElement | null {
    return this.root;
  }
}
