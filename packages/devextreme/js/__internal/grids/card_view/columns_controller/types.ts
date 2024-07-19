export interface Column {
  dataField?: string;

  name?: string;

  calculateCellValue: (data) => unknown | Promise<unknown>;

  editorTemplate: unknown;

  fieldTemplate: unknown;
}

export type ColumnSettings = Partial<Column>;

export type ColumnConfiguration = ColumnSettings | string;

export interface Cell {
  value: unknown;
  column: Column;
}

export interface DataRow {
  cells: Cell[];
}
