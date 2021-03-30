import dxDataGrid from '../../../../../ui/data_grid';

export interface GridInstance extends dxDataGrid {
  getView: (name: string) => any;
  getController: (name: string) => any;
}
