import type { Format, SortOrder } from '@js/common';
import type { ColumnBase } from '@js/common/grids';
import type { ComponentType } from 'inferno';

import type { DataObject } from '../data_controller/types';
import type { HighlightedTextItem } from '../search/types';

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
  allowSorting?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortingMethod?: ((this: Column, value1: any, value2: any) => number) | undefined;
  calculateSortValue?: string | ((this: Column, rowData: DataObject) => unknown);

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

  highlightedText: HighlightedTextItem[] | null;
}

export interface DataRow {
  cells: Cell[];

  key: unknown;

  data: unknown;

  index: number;
}
