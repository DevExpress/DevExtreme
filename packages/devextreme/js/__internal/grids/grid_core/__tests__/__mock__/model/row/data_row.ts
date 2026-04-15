import { BaseRowModel } from './base_row';

const SELECTORS = {
  editRow: 'dx-edit-row',
  deleteRowButton: 'dx-link-delete',
  undeleteRowButton: 'dx-link-undelete',
};

export class DataRowModel extends BaseRowModel {
  public readonly isEditRow: boolean;

  constructor(root: HTMLElement | null) {
    super(root);
    this.isEditRow = !!this.root?.classList.contains(SELECTORS.editRow);
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
