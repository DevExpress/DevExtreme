import type { ColumnAIOptions, ColumnBase, ColumnLookup } from '@js/common/grids';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { DataFilter } from '../filter/types';
import type { OptionChanged } from '../m_types';
import type {
  COLUMN_CHOOSER_LOCATION, GROUP_LOCATION, HEADERS_LOCATION, USER_STATE_FIELD_NAMES,
} from './const';

type InternalColumnLookup = ColumnLookup & {
  items?: RawItemData[];
  dataType?: string;
};

export type DropLocationNames = typeof GROUP_LOCATION
  | typeof COLUMN_CHOOSER_LOCATION
  | typeof HEADERS_LOCATION;

export type ColumnIndex = number | {
  rowIndex: number;
  columnIndex: number;
};

export type FilterField = Omit<Column, 'filterOperations'> & { filterOperations?: string[] | null };

export type ColumnUserState = Pick<Column, typeof USER_STATE_FIELD_NAMES[number]>;

export type AddedColumn = string | (Column & { columns?: (Column | string)[] });

export type ColumnSelector = ((data: RawItemData) => unknown) & {
  columnIndex?: number;
  filterValue?: unknown;
  selectedFilterOperation?: unknown;
  originalCallback?: unknown;
};

type FilterTargets = 'filterRow' | 'headerFilter' | 'filterBuilder' | 'search';

export interface InternalColumnOptions {
  parseValue?: (text: string) => unknown;
  deserializeValue?: (value: unknown) => unknown;
  serializeValue?: (value: unknown, target?: string) => unknown;
  selector?: ColumnSelector;
  createFilterExpression?: (
    filterValue: unknown,
    selectedFilterOperation: string | null | undefined,
    target: FilterTargets,
  ) => DataFilter;
  index?: number;
  groupIndex?: number;
  type?: string;
  defaultFilterOperations?: string[];
  defaultFilterOperation?: string;
  visibleWidth?: string | number;
  hidingPriority?: number;
  ai?: ColumnAIOptions;
  command?: string;
  rowspan?: number;
  colspan?: number;
  lastSortOrder?: ColumnBase['sortOrder'];
  bufferedFilterValue?: ColumnBase['filterValue'];
  bufferedSelectedFilterOperation?: ColumnBase['selectedFilterOperation'];
  added?: AddedColumn;
  lookup?: InternalColumnLookup;
}

export type Column = ColumnBase & InternalColumnOptions;

export interface ColumnsChanges {
  changeTypes: {
    sorting?: boolean;
    grouping?: boolean;
    groupExpanding?: boolean;
    columns?: boolean;
    filtering?: boolean;
    event?: unknown;
    virtualColumnsScrolling?: boolean;
    length: number;
  };
  optionNames: {
    [name in keyof Column]?: boolean;
  } & {
    all?: boolean;
    length: number;
  };
  columnIndex?: number;
  columnIndices?: number[];
  appliedFilters?: DataFilter[];
}

export type ColumnsOptionChanged = Extract<OptionChanged, { name: 'columns' }>;

type ColumnOptions = NonNullable<ColumnsOptionChanged['value']>[number];

type WholeColumnOptionChanged = Omit<ColumnsOptionChanged, 'fullName' | 'value' | 'previousValue'> & {
  fullName: `columns[${number}]`;
  value: ColumnOptions | undefined;
  previousValue: ColumnOptions | undefined;
};

type ColumnFieldOptionChanged = Omit<ColumnsOptionChanged, 'fullName' | 'value' | 'previousValue'> & {
  fullName: `columns[${number}].${string}`;
  value: unknown;
  previousValue: unknown;
};

export type ColumnOptionChanged = WholeColumnOptionChanged | ColumnFieldOptionChanged;

export type ColumnIdentifier = number | string;
