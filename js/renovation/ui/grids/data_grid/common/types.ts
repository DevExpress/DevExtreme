import dxDataGrid, { Column } from '../../../../../ui/data_grid';
import { ComponentExt } from '../../../common/component';
import type { DataGridProps } from './data_grid_props';

export interface GridInstance
  <TRowData,
   TKeyExpr extends string | string[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TKey=TKeyExpr extends keyof TRowData ? TRowData[TKeyExpr] : any,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TColumns extends (Column<TRowData, TKey, any> | string)[]=(Column<TRowData, TKey, any> | string)[],
  > extends dxDataGrid<TRowData, TKeyExpr, TKey, TColumns>, ComponentExt {
  isReady: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getView: (name: string) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getController: (name: string) => any;
  resize: () => void;
  updateDimensions: (checkSize?: boolean) => void;
  isScrollbarVisible: () => boolean;
  getTopVisibleRowData: () => TRowData;
  getScrollbarWidth: (isHorizontal: boolean) => number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDataProvider: (selectedRowsOnly: boolean) => any;
}

export interface DataGridForComponentWrapper
  <TRowData,
   TKeyExpr extends string | string[],
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TKey=TKeyExpr extends keyof TRowData ? TRowData[TKeyExpr] : any,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   TColumns extends (Column<TRowData, TKey, any> | string)[]=(Column<TRowData, TKey, any> | string)[],
  > {
  getComponentInstance: () => GridInstance<TRowData, TKeyExpr, TKey, TColumns>;
  prevProps: DataGridProps<TRowData, TKeyExpr, TKey, TColumns>;
}
