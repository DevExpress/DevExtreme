import type { Format, SortOrder } from '@js/common';
import type { ColumnBase } from '@js/common/grids';
import type { Cell as PublicCell, DataRow as PublicDataRow } from '@js/ui/card_view';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter';
import type { ComponentType } from 'inferno';

import type { DataObject } from '../data_controller/types';
import type { HighlightedTextItem } from '../search/types';

export type Cell = PublicCell & {
  highlightedText: HighlightedTextItem[] | null;
};

export type DataRow = Omit<PublicDataRow, 'cells'> & {
  cells: Cell[];
};

type InheritedColumnProps =
  | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'allowHiding'
  | 'allowFiltering'
  | 'allowHeaderFiltering'
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

  calculateCellValue: (this: Column, data: DataObject) => unknown;

  calculateDisplayValue: (this: Column, data: DataObject) => unknown;

  format?: Format;

  customizeText?: (this: Column, info: {
    value: unknown;
    valueText: string;
  }) => string;

  fieldTemplate?: unknown;

  headerItemTemplate?: ComponentType<{ column: Column }>;

  headerItemCssClass?: string;
  // header filter options for specific column.
  headerFilter?: HeaderFilterColumnOptions;
};
