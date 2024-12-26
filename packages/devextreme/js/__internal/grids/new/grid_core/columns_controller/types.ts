import type { Format } from '@js/common';
import type { ColumnBase } from '@js/common/grids';

type InheritedColumnProps =
  | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'trueText'
  | 'falseText'
  | 'caption';

export type Column = Pick<Required<ColumnBase>, InheritedColumnProps> & {
  dataField?: string;

  name: string;

  calculateCellValue: (this: Column, data: unknown) => unknown;

  calculateDisplayValue: (this: Column, data: unknown) => unknown;

  format?: Format;

  customizeText?: (this: Column, info: {
    value: unknown;
    valueText: string;
  }) => string;

  editorTemplate?: unknown;

  fieldTemplate?: unknown;
};

export type VisibleColumn = Column & { visible: true };

export interface Cell {
  value: unknown;

  displayValue: unknown;

  text: string;

  column: Column;
}

export interface DataRow {
  cells: Cell[];

  key: unknown;

  data: unknown;
}
