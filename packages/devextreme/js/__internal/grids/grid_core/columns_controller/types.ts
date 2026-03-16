import type { ColumnAIOptions, ColumnBase } from '@js/common/grids';

import type { COLUMN_CHOOSER_LOCATION, GROUP_LOCATION, HEADERS_LOCATION } from './const';

export type DropLocationNames = typeof GROUP_LOCATION
  | typeof COLUMN_CHOOSER_LOCATION
  | typeof HEADERS_LOCATION;

export type ColumnIndex = number | {
  rowIndex: number;
  columnIndex: number;
};

export interface Column extends ColumnBase {
  parseValue?: (text: string) => unknown;
  index?: number;
  groupIndex?: number;
  type?: string;
  visibleWidth?: string | number;
  hidingPriority?: number;
  ai?: ColumnAIOptions;
  command?: string;
  rowspan?: number;
  colspan?: number;
}
