import type {
  COLUMN_CHOOSER_LOCATION,
  GROUP_LOCATION,
  HEADERS_LOCATION,
} from './const';

export type DropLocationNames = typeof GROUP_LOCATION
  | typeof COLUMN_CHOOSER_LOCATION
  | typeof HEADERS_LOCATION;

export type ColumnIndex = number | {
  rowIndex: number;
  columnIndex: number;
};
