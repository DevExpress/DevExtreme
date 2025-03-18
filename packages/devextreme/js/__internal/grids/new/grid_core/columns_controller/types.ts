import type { Format, SortOrder } from '@js/common';
import type { ColumnBase } from '@js/common/grids';
import type { ComponentType } from 'inferno';

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

  sortOrder?: SortOrder; // todo: move to sorting module
  sortIndex?: number; // todo: move to sorting module

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

  // TODO: move to cardview/headerpanel
  headerItemTemplate?: ComponentType<{ column: Column }>;

  headerItemCssClass?: string;
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

  index: number;
}
