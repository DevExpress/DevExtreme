import type { ScalarFilterValue } from '@js/common/grids';
import type {
  PivotGridField,
  PivotGridLoadOptions,
} from '@ts/grids/pivot_grid/types';

export type FieldSelector = (data: unknown) => unknown;

/** Selectors of the date fields, by data field. */
export type FieldSelectors = Record<string, FieldSelector>;

export type DateIntervalSelector = (date: Date | undefined) => number | undefined;

export type DataItemFilter = (dataItem: unknown) => boolean;

/** prepareFields() gives a selector to each field that has none. */
export type LocalField = Omit<PivotGridField, 'selector' | 'levels'> & {
  selector: FieldSelector;
  levels?: LocalField[];
};

/** fillHashExpandedPath() adds the hash of the joined paths. */
export type LocalExpandedPaths = ScalarFilterValue[][] & {
  hash?: Record<string, boolean>;
};

/** Load options after prepareLoadOption(). */
export type LocalLoadOptions = Omit<
  PivotGridLoadOptions,
  'rows' | 'columns' | 'values' | 'filters' | 'rowExpandedPaths' | 'columnExpandedPaths'
> & {
  rows: LocalField[];
  columns: LocalField[];
  values?: LocalField[];
  filters: LocalField[];
  rowExpandedPaths?: LocalExpandedPaths;
  columnExpandedPaths?: LocalExpandedPaths;
  reload?: boolean;
};

export type LocalFilterOptions = Pick<
  LocalLoadOptions,
  'rows' | 'columns' | 'filters' | 'headerName' | 'path'
>;

export interface LocalHeaderItem {
  value: unknown;
  index: number;
  children?: LocalHeaderItem[];
}

/** Header items by path; `length` counts the items, the grand total included. */
export interface LocalHeaderItemsHash {
  [pathHash: string]: LocalHeaderItem | number;
  length: number;
}

export interface LocalHeaders {
  columns: LocalHeaderItem[];
  rows: LocalHeaderItem[];
  columnsHash: LocalHeaderItemsHash;
  rowsHash: LocalHeaderItemsHash;
}

export interface LocalHierarchyOptions {
  data: unknown;
  childrenHash: LocalHeaderItemsHash;
  dimensions: LocalField[];
  expandedPathsHash: Record<string, boolean> | false | undefined;
}

export interface CustomSummaryOptions {
  summaryProcess: 'start' | 'calculate' | 'finalize';
  totalValue: unknown;
  value?: unknown;
}

/** Each aggregator types its own accumulator, so the methods are bivariant. */
export interface LocalAggregator {
  readonly seed?: unknown;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- bivariant accumulator
  step(accumulator: unknown, value: unknown): unknown;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- bivariant accumulator
  finalize?(accumulator: unknown): unknown;
}

export interface LocalLoadResult {
  rows: LocalHeaderItem[];
  columns: LocalHeaderItem[];
  values: unknown[][][];
  grandTotalRowIndex: number;
  grandTotalColumnIndex: number;
}

export interface LocalStoreOptions {
  onProgressChanged?: (progress: number) => void;
}
