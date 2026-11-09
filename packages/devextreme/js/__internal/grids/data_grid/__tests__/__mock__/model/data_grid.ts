import type { Column, Row } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridBaseModel } from '@ts/grids/grid_core/__tests__/__mock__/model/data_grid_base';
import { DropDownButtonModel } from '@ts/ui/drop_down_editor/__tests__/__mock__/model/drop_down_button';

export class DataGridModel extends DataGridBaseModel<DataGrid> {
  protected NAME = 'dxDataGrid';

  public getInstance(): DataGrid {
    return DataGrid.getInstance(this.root) as DataGrid;
  }

  public getExportButton(): DropDownButtonModel {
    return new DropDownButtonModel(this.root.querySelector<HTMLElement>(`.${this.addWidgetPrefix('export-button')}`));
  }

  public apiGetVisibleColumns(headerLevel?: number): Column[] {
    if (headerLevel === undefined) {
      return this.getInstance().getVisibleColumns();
    }

    return this.getInstance().getVisibleColumns(headerLevel);
  }

  public apiGetVisibleRows(): Row[] {
    return this.getInstance().getVisibleRows();
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
