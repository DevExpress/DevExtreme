import dxDataGrid from '../../../../../ui/data_grid';

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
