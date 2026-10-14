import type { dxElementWrapper } from '@js/core/renderer';

import type { Column } from '../columns_controller/types';
import type { DataController } from '../data_controller/data_controller';
import type { RowKey } from '../types';
import type { ColumnsView } from '../views/columns_view';
import type { ViewCellOptions, ViewRow } from '../views/types';

export interface AdaptivityDataController extends DataController {
  getAdaptiveExpandedKey: () => RowKey | undefined;
  setAdaptiveExpandedKey: (key: RowKey) => void;
  toggleExpandAdaptiveDetailRow: (key?: RowKey, alwaysExpanded?: boolean) => void;
}

export interface AdaptiveDetailRowTarget {
  key: RowKey | undefined;
  rowIndex: number;
}

export interface AdaptiveDetailCellOptions extends ViewCellOptions {
  row: ViewRow & { values: unknown[] };
}

export interface AdaptiveFormItem {
  column: Column;
  name?: string;
  dataField?: string;
  visibleIndex?: number;
}

export interface PercentWidthOptions {
  visibleIndex?: number;
  columnsCount: number;
  columnsCanFit: boolean;
  bestFitWidth?: number;
  columnWidth: string;
  containerWidth: number;
}

export interface HiddenCellsInViewOptions {
  viewName: string;
  $cells: dxElementWrapper;
  isCommandColumn?: boolean;
}

export interface HiddenCellInViewOptions {
  viewName: string;
  $cell: dxElementWrapper;
  isCommandColumn?: boolean;
}

export interface HideVisibleColumnOptions {
  visibleIndex: number;
  isCommandColumn?: boolean;
}

export interface HideVisibleColumnInViewOptions extends HideVisibleColumnOptions {
  view: ColumnsView;
}
