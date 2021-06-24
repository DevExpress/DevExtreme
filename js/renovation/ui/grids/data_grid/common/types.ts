import dxDataGrid from '../../../../../ui/data_grid';
import { ComponentExt } from '../../../common/component';
import type { DataGridProps } from './data_grid_props';

export interface GridInstance extends dxDataGrid, ComponentExt {
  isReady: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getView: (name: string) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getController: (name: string) => any;
  resize: () => void;
  updateDimensions: (checkSize?: boolean) => void;
  isScrollbarVisible: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTopVisibleRowData: () => any;
  getScrollbarWidth: (isHorizontal: boolean) => number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataProvider: (selectedRowsOnly: boolean) => any;
}

export interface DataGridForComponentWrapper {
  getComponentInstance: () => GridInstance;
  prevProps: DataGridProps;
}
