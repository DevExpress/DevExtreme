import type { Format, SortOrder } from '@js/common';
import type { ColumnBase } from '@js/common/grids';
import type { HeaderFilterColumnOptions } from '@ts/grids/new/grid_core/filtering/header_filter';
import type { ComponentType } from 'inferno';

import type { DataObject } from '../data_controller/types';

export type { DataRow } from '@js/ui/card_view';

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
  | 'validationRules'
  | 'caption';

export type Column = Pick<Required<ColumnBase>, InheritedColumnProps> & {
  dataField?: string;

  sortOrder?: SortOrder;

  sortIndex?: number;

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
