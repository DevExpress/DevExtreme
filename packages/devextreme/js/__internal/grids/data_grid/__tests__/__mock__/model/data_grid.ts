import type { Column } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { DataGridBaseModel } from '@ts/grids/grid_core/__tests__/__mock__/model/data_grid_base';

export class DataGridModel extends DataGridBaseModel<DataGrid> {
  protected NAME = 'dxDataGrid';

  public getInstance(): DataGridInstance {
    return DataGrid.getInstance(this.root) as DataGridInstance;
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
}
