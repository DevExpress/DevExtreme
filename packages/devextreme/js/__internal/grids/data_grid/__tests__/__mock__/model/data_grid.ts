import type { Column } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';
import { DataGridBaseModel } from '@ts/grids/grid_core/__tests__/__mock__/model/data_grid_base';

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
}
