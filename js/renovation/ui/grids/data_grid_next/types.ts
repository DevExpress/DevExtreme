/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */

import { JSXTemplate } from '@devextreme-generator/declarations';

import type Store from '../../../../data/abstract_store';

import type { Format } from '../../../../localization';

export type RowData = Record<string, unknown>;
export type KeyExpr = string;
export type KeyExprInternal = KeyExpr | null;
export type Key = unknown;
export interface Row {
  key?: Key;

  data: RowData;

  rowType: 'data' | 'detail';

  loadIndex?: number;

  template?: JSXTemplate<RowTemplateProps>;
}
export interface RowTemplateProps {
  row: Row;

  rowIndex: number;
}

export type ColumnDataType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
export type ColumnAlignment = 'left' | 'right' | 'center';

export interface Column {
  dataField?: string;

  caption?: string;

  alignment?: ColumnAlignment;

  format?: Format;

  cssClass?: string;

  width?: number | string;

  dataType?: ColumnDataType;

  calculateCellValue?: (data: RowData) => unknown;

  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  headerCellTemplate?: JSXTemplate;
}

export interface ColumnInternal extends Column {
  headerCssClass?: string;

  cellContainerTemplate?: JSXTemplate<{ data: RowData }, 'data'>;
}

export type SelectionMode = 'multiple' | 'single' | 'none';
export type SelectAllMode = 'allPages' | 'page';
export interface DataState {
  data: RowData[];
  totalCount?: number;
  dataOffset?: number;
}

export type DataSource = RowData[] | Store | undefined;

export type VirtualScrollingMode = 'virtual' | 'infinite';
export type ScrollingMode = 'standard' | VirtualScrollingMode;
export type VirtualContentType = 'top' | 'bottom';
