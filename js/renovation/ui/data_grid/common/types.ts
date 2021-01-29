import dxDataGrid from '../../../../ui/data_grid';

export interface GridInstance extends dxDataGrid {
  getView: (name: string) => any;
  getController: (name: string) => any;
}

export interface DataGridView {
  name: string;
  _$element: any;
  render: () => any;
}
