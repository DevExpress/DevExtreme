import dxDataGrid from '../../../../ui/data_grid';
import { DataGridComponent } from '../datagrid_component';

export type GridInstance = (DataGridComponent & dxDataGrid & {
  getView: (name: string) => any;
  getController: (name: string) => any;
});

export interface DataGridView {
  name: string;
  _$element: any;
  render: () => any;
}
