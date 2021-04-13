import dxDataGrid from '../../../../../ui/data_grid';

export interface GridInstance extends dxDataGrid {
  isReady: () => boolean;
  getView: (name: string) => any;
  getController: (name: string) => any;
  resize: () => void;
}
