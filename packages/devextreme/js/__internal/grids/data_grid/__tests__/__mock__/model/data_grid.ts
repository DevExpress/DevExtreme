import type { Column } from '@js/ui/data_grid';
import DataGrid from '@js/ui/data_grid';

import { GridCoreModel } from '../../../../grid_core/__tests__/__mock__/model/grid_core';

export class DataGridModel extends GridCoreModel<DataGrid> {
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
