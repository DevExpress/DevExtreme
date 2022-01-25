/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-type-alias */

import { JSXTemplate } from '@devextreme-generator/declarations';

export type RowData = Record<string, unknown>;

export interface Column {
  dataField?: string;

  cellTemplate?: JSXTemplate<{ data: RowData }, 'data'>;

  headerTemplate?: JSXTemplate;
}

export type ColumnUserConfig = string;
export type KeyExpr = string;
export type Key = unknown;
