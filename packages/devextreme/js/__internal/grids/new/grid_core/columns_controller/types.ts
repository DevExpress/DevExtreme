import type { ColumnBase } from '@js/common/grids';

export interface Column extends Pick<Required<ColumnBase>, 'alignment' | 'dataType'> {
  dataField?: string;

  name?: string;

  calculateCellValue: (this: this, data: unknown) => unknown | Promise<unknown>;

  editorTemplate?: unknown;

  fieldTemplate?: unknown;
}

export type ColumnProperties = Partial<Column> | string;

export interface Cell {
  value: unknown;
  column: Column;
}

export interface DataRow {
  cells: Cell[];

  key: unknown;
}
