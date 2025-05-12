import type { ColumnProperties, ColumnSettings } from '../options';

export interface ColumnsChangeAll {
  type: 'allColumns';
  value: ColumnProperties[] | null;
}

export interface ColumnsChangeColumn {
  type: 'column';
  columnIdx: number;
  value: ColumnProperties;
}

export interface ColumnChangeColumnOption {
  type: 'columnOption';
  columnIdx: number;
  optionPath: string;
  value: keyof ColumnSettings[keyof ColumnSettings];
}

export type ColumnChange = ColumnsChangeAll
  | ColumnsChangeColumn
  | ColumnChangeColumnOption;
