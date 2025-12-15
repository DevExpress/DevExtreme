const SELECTORS = {
  editRow: 'dx-edit-row',
  deleteRowButton: 'dx-link-delete',
  undeleteRowButton: 'dx-link-undelete',
};

export class DataRowModel {
  public readonly isEditRow: boolean;

  constructor(protected readonly root: HTMLElement | null) {
    this.isEditRow = !!this.root?.classList.contains(SELECTORS.editRow);
  }

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getDeleteButton(): HTMLElement {
    const row = this.getElement() as HTMLElement;

    return row.querySelector(`.${SELECTORS.deleteRowButton}`) as HTMLElement;
  }

  public getRecoverButton(): HTMLElement {
    const row = this.getElement() as HTMLElement;

    return row.querySelector(`.${SELECTORS.undeleteRowButton}`) as HTMLElement;
  }
}
