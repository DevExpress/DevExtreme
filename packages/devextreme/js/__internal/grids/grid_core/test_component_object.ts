/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';

const CLASSES = {
  headerRow: 'dx-header-row',
  dataRow: 'dx-data-row',
};

export abstract class GridComponentObject<TInstance extends GridBase = GridBase> {
  constructor(protected readonly root: HTMLElement) {}

  public getHeaderCell(columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${CLASSES.headerRow} > td`)[columnIndex] as HTMLElement;
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${CLASSES.dataRow}`)[rowIndex]?.querySelectorAll('td')[columnIndex] as HTMLElement;
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
