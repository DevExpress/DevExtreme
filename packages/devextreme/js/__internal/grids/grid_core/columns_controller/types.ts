import type { template } from '@js/common';
import type { ColumnAIOptions, ColumnBase, ColumnLookup } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type { SortingInfo } from '@ts/data/utils';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

import type { DataFilter } from '../filter/types';
import type { InternalGrid, OptionChanged, OptionChangedFor } from '../types';
import type {
  COLUMN_CHOOSER_LOCATION, GROUP_LOCATION, HEADERS_LOCATION, USER_STATE_FIELD_NAMES,
} from './const';

export interface TemplateModel {
  column?: Column;
  rowType?: string;
  renderAsync?: boolean;
  component?: InternalGrid;
}

export interface ColumnRenderTemplate<TModel extends TemplateModel = TemplateModel> {
  allowRenderToDetachedContainer?: boolean;
  // DataChange can't be imported here: data_controller depends on columns_controller.
  // No { render } template reads it; function templates (editing's) type their own param.
  render: (container: dxElementWrapper, model: TModel, change?: unknown) => void;
}

export type ColumnTemplateSource<TModel extends TemplateModel = TemplateModel> = template
  | ColumnRenderTemplate<TModel>;

export interface ValueSerializers {
  serializationFormat?: string | null;
  deserializeValue?: (value: unknown) => unknown;
  serializeValue?: (value: unknown, target?: string) => unknown;
}

type InternalColumnLookup = ColumnLookup & ValueSerializers & {
  items?: unknown[];
  dataType?: string;
  valueMap?: Record<string, unknown>;
  update?: () => DeferredObj<unknown> | undefined;
  updateValueMap?: () => void;
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

export type ColumnFilterExpression = (unknown[] | ColumnSelector)
  & Pick<ColumnSelector, 'columnIndex' | 'filterValue' | 'selectedFilterOperation'>;

type FilterTargets = 'filterRow' | 'headerFilter' | 'filterBuilder' | 'search';

// Besides pixels: 'auto', 'adaptiveHidden', and null/undefined while widths are reset
export type VisibleWidth = ColumnBase['width'] | null;

export interface InternalColumnOptions extends ValueSerializers {
  parseValue?: (text: string) => unknown;
  userDataType?: ColumnBase['dataType'];
  selector?: ColumnSelector;
  createFilterExpression?: (
    filterValue: unknown,
    selectedFilterOperation: string | null | undefined,
    target: FilterTargets,
  ) => DataFilter;
  index?: number;
  groupIndex?: number;
  calculateGroupValue?: string | ColumnBase['calculateCellValue'];
  autoExpandGroup?: boolean;
  displayField?: string;
  displayValueMap?: Record<string, unknown>;
  type?: string;
  defaultFilterOperations?: string[];
  defaultFilterOperation?: string;
  defaultSelectedFilterOperation?: ColumnBase['selectedFilterOperation'] | null;
  bestFitWidth?: number;
  visibleWidth?: VisibleWidth;
  hidingPriority?: number;
  ai?: ColumnAIOptions;
  command?: string;
  headerId?: string;
  showWhenGrouped?: boolean;
  allowGrouping?: boolean;
  allowCollapsing?: boolean;
  resizedCallbacks?: Callback<[VisibleWidth]>;
  resized?: (width: VisibleWidth) => void;
  adaptiveHidden?: boolean;
  elementAttr?: { name: string; value: string }[];
  cellTemplate?: ColumnTemplateSource | null;
  headerCellTemplate?: ColumnTemplateSource | null;
  rowspan?: number;
  colspan?: number;
  lastSortOrder?: ColumnBase['sortOrder'];
  bufferedFilterValue?: ColumnBase['filterValue'];
  bufferedSelectedFilterOperation?: ColumnBase['selectedFilterOperation'];
  added?: Column | string;
  lookup?: InternalColumnLookup;
  columns?: (Column | string)[];
  hasColumns?: boolean;
  grouped?: boolean;
}

export type Column = ColumnBase & InternalColumnOptions;

// groupPanel.visible: 'auto' reaches the common settings as is, as a truthy allowGrouping
export type ColumnCommonSettings = Omit<Partial<Column>, 'allowGrouping'> & {
  allowGrouping?: boolean | 'auto';
};

export type CellValueCalculator = (rowData: RawItemData, skipDeserialization?: boolean) => unknown;

export type WithCellValueCalculator<T> = T & { calculateCellValue: CellValueCalculator };

export type ColumnOptionsUpdate = Partial<Column> | Record<string, unknown>;

export interface ColumnDataSourceParameter {
  selector?: string | ((data: RawItemData) => unknown);
  desc: boolean;
  compare?: (value1: unknown, value2: unknown) => number;
  isExpanded?: boolean;
}

export type SortParameters = StoreLoadOptions['sort']
  | ColumnDataSourceParameter[]
  | SortingInfo[]
  | null;

export type GroupParameters = StoreLoadOptions['group']
  | ColumnDataSourceParameter[]
  | SortingInfo[]
  | null;

export interface ColumnsDataSourceParameters {
  sorting: SortParameters;
  grouping: GroupParameters;
  filtering?: DataFilter;
}

export type GroupColumn = Column & { groupIndex: number };

export type DisplayValueColumn = Pick<
  Column,
  'displayValueMap' | 'calculateDisplayValue' | 'type' | 'calculateGroupValue'
> & { lookup?: Pick<NonNullable<Column['lookup']>, 'calculateCellValue'> };

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

export type ColumnsChangingEvent = ColumnsChanges & { component: InternalGrid };

export interface ColumnsControllerOptions {
  adaptColumnWidthByRatio?: boolean;
  commonColumnSettings?: Partial<Column>;
  customizeColumns?: ((columns: Column[]) => void) | null;
  regenerateColumnsByVisibleItems?: boolean;
  onColumnsChanging?: (e: ColumnsChangingEvent) => void;
}

export type ColumnsControllerOptionChanged = OptionChanged
  | OptionChangedFor<ColumnsControllerOptions>
  | OptionChangedFor<Pick<DataGridProperties, 'grouping' | 'groupPanel'>>
  | ColumnOptionChanged;

export type MatchCountById = Map<string, number>;

export type ColumnOptionGetter = (column: Column, options?: { functionsAsIs: boolean }) => unknown;

export type ColumnOptionSetter = (
  column: Column,
  value: unknown,
  options: { functionsAsIs: boolean },
) => void;

export interface BandColumnsCache {
  isPlain: boolean;
  columnChildrenByIndex: Record<number, Column[]>;
  columnParentByIndex: Record<number, Column>;
}

export interface IndexedColumns {
  positiveIndexedColumns: Record<string, Column[]>[][];
  negativeIndexedColumns: Record<string, Column[]>[];
}

export interface ColumnOptionChangeArgs {
  fullOptionName: string;
  optionName: string;
  value: unknown;
  prevValue: unknown;
}
