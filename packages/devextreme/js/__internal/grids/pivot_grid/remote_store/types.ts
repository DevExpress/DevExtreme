import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type {
  PivotGridField,
  PivotGridFilterValue,
  PivotGridLoadOptions,
} from '@ts/grids/pivot_grid/types';

export type FilterExpression = unknown[];

/** A DataSource filter can also be a function, which works only on the client. */
export type FilterPredicate = (item: unknown) => unknown;

export type DataFilter = FilterExpression | FilterPredicate;

/** An area field, or a path filter that getFiltersByPath() builds. */
export interface RemoteFilterField {
  dataField?: string;
  dataType?: string;
  groupInterval?: string | number;
  filterType?: string;
  filterValues?: PivotGridFilterValue[];
  searchValue?: string;
  levels?: RemoteFilterField[];
}

export type RemoteRequestOptions = Omit<PivotGridLoadOptions, 'filters'> & {
  filters?: RemoteFilterField[];
  filterExpression?: FilterExpression;
  includeTotalSummary?: boolean;
};

export interface GroupingOption {
  selector: string | undefined;
  groupInterval: PivotGridField['groupInterval'];
  desc: boolean | number | undefined;
  isExpanded: boolean;
}

export interface SummaryOption {
  selector: string | undefined;
  summaryType: string;
}

export type RemoteLoadOptions = Pick<StoreLoadOptions, 'filter' | 'skip' | 'take'> & {
  group?: GroupingOption[];
  groupSummary: SummaryOption[];
  totalSummary: SummaryOption[];
  requireGroupCount?: boolean;
};

export interface RemoteGroup {
  key?: unknown;
  displayText?: string;
  items?: (RemoteGroup | undefined)[] | null;
  summary?: unknown[];
}

export interface RemoteLoadExtra {
  summary?: unknown[];
  groupCount?: number;
}

export interface RemoteGroupedResult {
  data: (RemoteGroup | undefined)[];
  extra: RemoteLoadExtra | undefined;
}

export interface RemoteHeaderItem {
  value?: unknown;
  index?: number;
  displayText?: string;
  children?: RemoteHeaderItem[];
}

export interface RemoteLoadResult {
  rows: RemoteHeaderItem[];
  columns: RemoteHeaderItem[];
  values: unknown[][][];
  grandTotalRowIndex: number;
  grandTotalColumnIndex: number;
}

export interface RemoteParseState extends RemoteLoadResult {
  rowHash: Record<string, RemoteHeaderItem>;
  columnHash: Record<string, RemoteHeaderItem>;
  rowIndex: number;
  columnIndex: number;
}
