/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */

import { JSXTemplate } from '@devextreme-generator/declarations';

import type Store from '../../../../data/abstract_store';

export type RowData = Record<string, unknown>;
export type Column = string;
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

export interface ColumnInternal {
  dataField?: string;

  headerCssClass?: string;

  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  headerTemplate?: JSXTemplate;

  cellContainerTemplate?: JSXTemplate<{ data: RowData }, 'data'>;
}

export type SelectionMode = 'multiple' | 'single' | 'none';
export type SelectAllMode = 'allPages' | 'page';
export interface DataState {
  data: RowData[];
  totalCount?: number;
}

export type DataSource = RowData[] | Store | undefined;

export type VirtualScrollingMode = 'virtual' | 'infinite';
export type ScrollingMode = 'standard' | VirtualScrollingMode;
