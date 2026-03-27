import { BaseRowModel } from './base_row';

const SELECTORS = {
  expandCell: 'dx-command-expand',
};

export class GroupRowModel extends BaseRowModel {
  public getExpandCell(): HTMLElement {
    const row = this.getElement() as HTMLElement;

    return row.querySelector(`.${SELECTORS.expandCell}`) as HTMLElement;
  }
}
