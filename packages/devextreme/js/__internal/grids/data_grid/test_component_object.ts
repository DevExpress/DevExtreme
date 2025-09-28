import DataGrid from '@js/ui/data_grid';

import { GridComponentObject } from '../grid_core/test_component_object';

export class DataGridComponentObject extends GridComponentObject<DataGrid> {
  public getInstance(): DataGrid {
    return DataGrid.getInstance(this.root) as DataGrid;
  }
}
