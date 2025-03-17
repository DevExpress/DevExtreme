import type { Format, SortOrder } from '@js/common';
import type { ColumnBase } from '@js/common/grids';
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
  | 'trueText'
  | 'falseText'
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
};
