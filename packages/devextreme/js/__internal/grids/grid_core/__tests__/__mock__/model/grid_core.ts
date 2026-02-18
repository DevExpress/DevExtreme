/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import { DataCellModel } from './cell/data_cell';
import { HeaderCellModel } from './cell/header_cell';
import { ColumnChooserModel } from './column_chooser';
import { DataRowModel } from './row/data_row';

const SELECTORS = {
  headerRowClass: 'dx-header-row',
  dataRowClass: 'dx-data-row',
  groupRowClass: 'dx-group-row',
  headerCellIndicators: 'dx-column-indicators',
  headerCellFilter: 'dx-header-filter',
  revertButton: 'dx-revert-button',
};

export abstract class GridCoreModel<TInstance extends GridBase = GridBase> {
  protected abstract NAME: string;

  constructor(protected readonly root: HTMLElement) {}

  public getHeaderCells(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.headerRowClass} > td`);
  }

  public getHeaderCell(columnIndex: number): HeaderCellModel {
    return new HeaderCellModel(this.getHeaderCells()[columnIndex], this.addWidgetPrefix.bind(this));
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`)[rowIndex]?.querySelectorAll('td')[columnIndex] as HTMLElement;
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

  public getHeaderByText(text: string): dxElementWrapper {
    return $(Array.from(this.getHeaderCells()).find((el) => $(el).text().includes(text)));
  }

  public getDataRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`);
  }

  public getDataRow(rowIndex: number): DataRowModel {
    return new DataRowModel(this.getDataRows()[rowIndex]);
  }

  public getDataCells(rowIndex: number): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}:nth-child(${rowIndex + 1}) > td`);
  }

  public getDataCell(rowIndex: number, columnIndex: number): DataCellModel {
    return new DataCellModel(
      this.getDataCells(rowIndex)[columnIndex],
      this.addWidgetPrefix.bind(this),
    );
  }

  public getRevertButton(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.revertButton}`) as HTMLElement;
  }

  public addWidgetPrefix(classNames: string): string {
    const componentName = this.NAME;

    return `dx-${componentName.slice(2).toLowerCase()}${classNames ? `-${classNames}` : ''}`;
  }

  public getColumnChooser(): ColumnChooserModel {
    return new ColumnChooserModel(this.root);
  }

  public getHeaderCellFilter(columnIndex: number): dxElementWrapper {
    const $headerCell = $(this.getHeaderCells()[columnIndex]);
    const headerFilterSelector = `.${SELECTORS.headerCellIndicators} > .${SELECTORS.headerCellFilter}`;

    return $headerCell.find(headerFilterSelector);
  }

  public abstract getInstance(): TInstance;
}
