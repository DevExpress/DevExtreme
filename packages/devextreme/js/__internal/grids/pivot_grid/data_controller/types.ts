import type {
  Cell,
  Properties as PivotGridProperties,
} from '@js/ui/pivot_grid';
import type { ColumnInfoCell } from '@ts/grids/grid_core/virtual_columns/types';
import type { VirtualScrollDataOptions } from '@ts/grids/grid_core/virtual_scrolling/types';
import type { PivotGridDataSource } from '@ts/grids/pivot_grid/data_source/m_data_source';
import type { DataSourceHeaderItem, DataSourceOptions } from '@ts/grids/pivot_grid/data_source/types';
import type { PivotGrid } from '@ts/grids/pivot_grid/m_widget';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

export type HeaderItemType = NonNullable<Cell['type']>;

export interface PivotGridColumnInfo extends ColumnInfoCell {
  type?: HeaderItemType;
  text?: string;
  path?: unknown[];
  width?: number | null;
  wordWrapEnabled?: boolean;
  isLast?: boolean;
  sorted?: boolean;
  dataIndex?: number;
  expanded?: boolean;
  dataSourceIndex?: number;
  isWhiteSpace?: boolean;
}

export interface ViewHeaderItem {
  type?: HeaderItemType;
  value?: unknown;
  key?: unknown;
  path?: unknown[];
  text?: string;
  displayText?: string;
  caption?: string;
  index?: number;
  dataIndex?: number;
  isMetric?: boolean;
  isEmpty?: boolean | boolean[];
  expanded?: boolean | null;
  isAdditionalTotal?: boolean;
  children?: ViewHeaderItem[] | null;
  depthSize?: number;
  width?: number;
  wordWrapEnabled?: boolean;
  isLast?: boolean;
  sorted?: boolean;
}

export type IndexedHeaderItem = DataSourceHeaderItem & {
  visibleIndex: number;
  path: unknown[];
};

export interface PivotGridCellInfo {
  text: string | undefined;
  value: unknown;
  format: PivotGridField['format'];
  dataType: PivotGridField['dataType'];
  columnType: HeaderItemType | undefined;
  rowType: HeaderItemType | undefined;
  rowPath: unknown[];
  columnPath: unknown[];
  dataIndex: number;
  width?: number;
}

export type SortBySummaryPath = (string | number)[];

export type PivotGridTexts = NonNullable<PivotGridProperties['texts']>;

export interface HeaderInfoOptions {
  texts: PivotGridTexts;
  hiddenTotals: number[];
  hiddenValues: number[];
  hiddenGrandTotals: number[];
  showEmpty: boolean;
  dataFields: PivotGridField[];
  progress: number;
  isEmptyGrandTotal?: boolean[];
  showTotals?: boolean;
  showTotalsPrior: boolean;
  showGrandTotals: boolean;
  sortBySummaryPaths: SortBySummaryPath[];
  layout?: PivotGridProperties['rowHeaderLayout'];
  fields: PivotGridField[];
  notifyProgress: (this: HeaderInfoOptions, progress: number) => void;
}

export interface AddInfoItemOptions {
  headerItem: ViewHeaderItem;
  index: number;
  lastIndex: number;
  depth: number;
  isHorizontal: boolean;
  isTree: boolean;
}

export type DataControllerOptions = Pick<
  PivotGridProperties,
  'texts'
  | 'showRowTotals'
  | 'showRowGrandTotals'
  | 'showColumnTotals'
  | 'showTotalsPrior'
  | 'showColumnGrandTotals'
  | 'dataFieldArea'
  | 'rowHeaderLayout'
  | 'hideEmptySummaryCells'
> & {
  component?: PivotGrid;
  dataSource?: PivotGridDataSource | DataSourceOptions;
  onFieldsPrepared?: (fields: PivotGridField[]) => void;
};

export type RowInfoCallback = (
  rowInfo: PivotGridColumnInfo,
  visibleIndex: number,
  rowIndex: number,
  columnIndex: number,
  columnOffset: number,
) => unknown;

export type ScrollDataAdapter = Pick<
  VirtualScrollDataOptions,
  'totalItemsCount' | 'pageIndex' | 'pageSize' | 'load'
>;

export interface VirtualContentParams {
  virtualRowHeight: number;
  virtualColumnWidth: number;
  itemWidths: number[];
  itemHeights: number[];
  viewportWidth: number;
  viewportHeight: number;
}

export interface VirtualContentSize {
  contentTop: number;
  contentLeft: number;
  width: number;
  height: number;
}

export interface ScrollPosition {
  left: number;
  top: number;
}
