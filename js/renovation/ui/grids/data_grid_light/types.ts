/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */

import { JSXTemplate } from '@devextreme-generator/declarations';

export type RowData = Record<string, unknown>;
export type ColumnUserConfig = string;
export type KeyExprUserConfig = string;
export type KeyExpr = KeyExprUserConfig | null;
export type Key = unknown;
export interface Row {
  key?: Key;

  data: RowData;

  rowType: 'data' | 'detail';

  template?: JSXTemplate<RowTemplateProps>;
}
export interface RowTemplateProps {
  row: Row;

  rowIndex: number;
}

export interface Column {
  dataField?: string;

  headerCssClass?: string;

  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  headerTemplate?: JSXTemplate;

  cellContainerTemplate?: JSXTemplate<{ data: RowData }, 'data'>;
}
