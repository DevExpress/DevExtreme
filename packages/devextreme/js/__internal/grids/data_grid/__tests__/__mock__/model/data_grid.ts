import type { Column } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridBaseModel } from '@ts/grids/grid_core/__tests__/__mock__/model/data_grid_base';

const SELECTORS = {
  summaryItem: 'dx-datagrid-summary-item',
  groupFooter: 'dx-datagrid-group-footer',
  footerRow: 'dx-footer-row',
};

export class DataGridModel extends DataGridBaseModel<DataGrid> {
  protected NAME = 'dxDataGrid';

  public getInstance(): DataGrid {
    return DataGrid.getInstance(this.root) as DataGrid;
  }

  public apiGetVisibleColumns(headerLevel?: number): Column[] {
    if (headerLevel === undefined) {
      return this.getInstance().getVisibleColumns();
    }

    return this.getInstance().getVisibleColumns(headerLevel);
  }

  public setDataGridOptions(options: Record<string, unknown>): void {
    const instance = this.getInstance();

    Object.entries(options).forEach(([optionName, optionValue]) => {
      instance.option(optionName, optionValue);
    });
  }

  public setDataGridColumnOptions(
    columnName: string,
    options: Record<string, unknown>,
  ): void {
    const instance = this.getInstance();

    Object.entries(options).forEach(([optionName, optionValue]) => {
      instance.columnOption(columnName, optionName, optionValue);
    });
  }

  public getFooterRow(): HTMLElement | null {
    return this.root.querySelector(`.${SELECTORS.footerRow}`);
  }

  public getGroupFooterRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupFooter}`);
  }

  public getSummaryItems(row: HTMLElement): NodeListOf<HTMLElement> {
    return row.querySelectorAll(`.${SELECTORS.summaryItem}`);
  }
}
