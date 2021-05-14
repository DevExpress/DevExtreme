import dxDataGrid from '../../../../../ui/data_grid';
import type { DataGridProps } from './data_grid_props';

export interface GridInstance extends dxDataGrid {
  isReady: () => boolean;
  getView: (name: string) => any;
  getController: (name: string) => any;
  resize: () => void;
  updateDimensions: (checkSize?: boolean) => void;
  isScrollbarVisible: () => boolean;
  getTopVisibleRowData: () => any;
  getScrollbarWidth: (isHorizontal: boolean) => number;
}

export interface IDataGrid {
  getComponentInstance: () => GridInstance;
  prevProps: DataGridProps;
}
