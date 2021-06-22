import dxDataGrid from '../../../../../ui/data_grid';
import { ComponentExt } from '../../../common/component';
import type { DataGridProps } from './data_grid_props';

export interface GridInstance extends dxDataGrid, ComponentExt {
  isReady: () => boolean;
  getView: (name: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  getController: (name: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  resize: () => void;
  updateDimensions: (checkSize?: boolean) => void;
  isScrollbarVisible: () => boolean;
  getTopVisibleRowData: () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  getScrollbarWidth: (isHorizontal: boolean) => number;
}

export interface DataGridForComponentWrapper {
  getComponentInstance: () => GridInstance;
  prevProps: DataGridProps;
}
