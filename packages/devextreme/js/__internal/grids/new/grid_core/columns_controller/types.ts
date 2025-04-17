import type { Format, SortOrder } from '@js/common';
import type { ColumnBase, FilterType } from '@js/common/grids';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import type { ComponentType } from 'inferno';

import type { DataObject, Key } from '../data_controller/types';
import type { HighlightedTextItem } from '../search/types';

type InheritedColumnProps =
  | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'allowHiding'
  | 'allowFiltering'
  | 'allowHeaderFiltering'
  | 'allowSearch'
  | 'trueText'
  | 'falseText'
  | 'caption'
  | 'showInColumnChooser';

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

  calculateFilterExpression: (
    this: Column,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterValue: any,
    selectedFilterOperation: string | undefined,
    target: string,
  ) => unknown;

  format?: Format;

  customizeText?: (this: Column, info: {
    value: unknown;
    valueText: string;
  }) => string;

  editorTemplate?: unknown;

  fieldTemplate?: ComponentType<{ cell: Cell }>;
  captionTemplate?: ComponentType<{ cell: Cell }>;
  valueTemplate?: ComponentType<{ cell: Cell }>;

  headerItemTemplate?: ComponentType<{ column: Column }>;

  headerItemCssClass?: string;

  // header filter options for specific column.
  headerFilter?: HeaderFilterColumnOptions;

  filterType?: FilterType;
};

export type VisibleColumn = Column & { visible: true };

export interface Cell {
  value: unknown;

  displayValue: unknown;

  text: string;

  column: Column;

  highlightedText: HighlightedTextItem[] | null;

  index: number;
}

export interface DataRow {
  cells: Cell[];

  key: Key;

  data: DataObject;

  isSelected?: boolean;

  index: number;
}
