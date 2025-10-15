/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const SELECTORS = {
  headerRowClass: 'dx-header-row',
  dataRowClass: 'dx-data-row',
  groupRowClass: 'dx-group-row',
  colIndexAria: 'aria-colindex',
  rowIndexAria: 'aria-rowindex',
};

export abstract class GridCoreModel<TInstance extends GridBase = GridBase> {
  constructor(protected readonly root: HTMLElement) {}

  public getHeaderCells(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.headerRowClass} [${SELECTORS.colIndexAria}]`);
  }

  public getHeaderCell(columnIndex: number): HTMLElement | null {
    return this.root.querySelector(`.${SELECTORS.headerRowClass} [${SELECTORS.colIndexAria}="${columnIndex}"]`);
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement | null {
    return this.root.querySelector(`.${SELECTORS.dataRowClass}[${SELECTORS.rowIndexAria}="${rowIndex}"]`)
      ?.querySelector(`[${SELECTORS.colIndexAria}="${columnIndex}"]`) as HTMLElement | null;
  }

  public getGroupRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupRowClass}`);
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

  public getHeaderByText(text: string): dxElementWrapper | undefined {
    const $headers = this.getHeaderCells();
    return $(Array.from($headers).find((el) => $(el).text().includes(text)));
  }

  public abstract getInstance(): TInstance;
}
