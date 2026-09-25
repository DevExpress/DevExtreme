import type { ColumnAIOptions, ColumnBase, ColumnLookup } from '@js/common/grids';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { DataFilter } from '../filter/types';
import type { OptionChanged, OptionChangedFor } from '../m_types';
import type {
  COLUMN_CHOOSER_LOCATION, GROUP_LOCATION, HEADERS_LOCATION, USER_STATE_FIELD_NAMES,
} from './const';

export interface ValueSerializers {
  serializationFormat?: string | null;
  deserializeValue?: (value: unknown) => unknown;
  serializeValue?: (value: unknown, target?: string) => unknown;
}

type InternalColumnLookup = ColumnLookup & ValueSerializers & {
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

export type SavedColumnState = ColumnUserState & { initialIndex?: number };

export type AddedColumn = string | (Column & { columns?: (Column | string)[] });

export interface UserStateApplierOptions {
  columns: Column[];
  columnsUserState: SavedColumnState[];
  ignoreColumnOptionNames: string[];
  hasUserState: boolean;
  createColumn: (columnOptions: AddedColumn) => Column;
}

export interface ColumnsStateMatch {
  stateIndexes: number[];
  allColumnsHaveState: boolean;
}

export interface UserStateApplyResult {
  columns: Column[];
  hasAddedBands: boolean;
}

export type ColumnSelector = ((data: RawItemData) => unknown) & {
  columnIndex?: number;
  filterValue?: unknown;
  selectedFilterOperation?: unknown;
  originalCallback?: unknown;
};

type FilterTargets = 'filterRow' | 'headerFilter' | 'filterBuilder' | 'search';

export interface InternalColumnOptions extends ValueSerializers {
  parseValue?: (text: string) => unknown;
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
  defaultSelectedFilterOperation?: ColumnBase['selectedFilterOperation'] | null;
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

export type ColumnChangeType = Exclude<keyof ColumnsChanges['changeTypes'], 'length'>;

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

export interface ColumnsControllerOptions {
  adaptColumnWidthByRatio?: boolean;
  commonColumnSettings?: Partial<Column>;
  customizeColumns?: ((columns: Column[]) => void) | null;
  regenerateColumnsByVisibleItems?: boolean;
}

export type ColumnsControllerOptionChanged = OptionChanged
  | OptionChangedFor<ColumnsControllerOptions>
  | OptionChangedFor<Pick<DataGridProperties, 'grouping' | 'groupPanel'>>
  | ColumnOptionChanged;
