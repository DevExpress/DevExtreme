import dxDataGrid from '../../../../../ui/data_grid';
import { ComponentExt } from '../../../common/component';
import type { DataGridProps } from './data_grid_props';

export interface GridInstance extends dxDataGrid, ComponentExt {
  isReady: () => boolean;
  getView: (name: string) => any;
  getController: (name: string) => any;
  resize: () => void;
  updateDimensions: (checkSize?: boolean) => void;
  isScrollbarVisible: () => boolean;
  getTopVisibleRowData: () => any;
  getScrollbarWidth: (isHorizontal: boolean) => number;
}

export interface DataGridForComponentWrapper {
  getComponentInstance: () => GridInstance;
  prevProps: DataGridProps;
}
