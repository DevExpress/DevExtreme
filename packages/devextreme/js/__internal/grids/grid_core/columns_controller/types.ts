import type { ColumnAIOptions, ColumnBase } from '@js/common/grids';

import type { COLUMN_CHOOSER_LOCATION, GROUP_LOCATION, HEADERS_LOCATION } from './const';

export type DropLocationNames = typeof GROUP_LOCATION
  | typeof COLUMN_CHOOSER_LOCATION
  | typeof HEADERS_LOCATION;

export type ColumnIndex = number | {
  rowIndex: number;
  columnIndex: number;
};

export type FilterField = Omit<Column, 'filterOperations'> & { filterOperations?: string[] | null };

export type AddedColumn = string | (Column & { columns?: (Column | string)[] });

export interface Column extends ColumnBase {
  parseValue?: (text: string) => unknown;
  index?: number;
  groupIndex?: number;
  type?: string;
  defaultFilterOperations?: string[];
  visibleWidth?: string | number;
  hidingPriority?: number;
  ai?: ColumnAIOptions;
  command?: string;
  rowspan?: number;
  colspan?: number;
  lastSortOrder?: ColumnBase['sortOrder'];
  bufferedFilterValue?: ColumnBase['filterValue'];
  bufferedSelectedFilterOperation?: ColumnBase['selectedFilterOperation'];
  added?: AddedColumn;
}

export interface ColumnsChanges {
  changeTypes: {
    sorting?: boolean;
    grouping?: boolean;
    groupExpanding?: boolean;
    columns?: boolean;
    filtering?: boolean;
    event?: unknown;
    virtualColumnsScrolling?: boolean;
    length: number;
  };
  optionNames: {
    [name in keyof Column]?: boolean;
  } & {
    all?: boolean;
    length: number;
  };
  columnIndex?: number;
  columnIndices?: number[];
}
