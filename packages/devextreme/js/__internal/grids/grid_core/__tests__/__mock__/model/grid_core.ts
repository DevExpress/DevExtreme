/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';

const SELECTORS = {
  headerRow: 'dx-header-row',
  dataRow: 'dx-data-row',
  groupRow: 'dx-group-row',
  headerCell: '[aria-colindex]',
};

export abstract class GridCoreModel<TInstance extends GridBase = GridBase> {
  constructor(protected readonly root: HTMLElement) {}

  public getHeaderCell(columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${SELECTORS.headerRow} > td`)[columnIndex] as HTMLElement;
  }

  public getHeaders(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(SELECTORS.headerCell);
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${SELECTORS.dataRow}`)[rowIndex]?.querySelectorAll('td')[columnIndex] as HTMLElement;
  }

  public getGroupColumns(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupRow}`);
  }

  public apiColumnOption(id: string, name?: string, value?: any): any {
    switch (arguments.length) {
      case 1:
        return this.getInstance().columnOption(id);
      case 2:
        return this.getInstance().columnOption(id, name);
      default:
        this.getInstance().columnOption(id, name as string, value);
        return undefined;
    }
  }

  public abstract getInstance(): TInstance;
}
