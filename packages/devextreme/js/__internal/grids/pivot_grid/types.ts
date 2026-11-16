import type { DeferredObj } from '@js/core/utils/deferred';
import type { Field } from '@js/ui/pivot_grid/data_source';

export type PivotGridField = Field & {
  index?: number;
  _initProperties?: Record<string, unknown> | null;
};

export type PivotGridFilterField = Omit<
  PivotGridField,
  'groupIndex' | 'groupName' | 'filterType' | 'filterValues'
> & {
  groupIndex: null;
  groupName: null;
  filterType: string;
  filterValues: unknown[];
};

export interface TreeItem<TItem> {
  children?: TItem[];
}

export type ForeachTreeCallback<TItem> = (members: TItem[], index: number) => unknown;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- for unannotated callbacks
export type ForeachTree = <TItem extends TreeItem<TItem> = any>(
  items: NoInfer<TItem>[] | null | undefined,
  callback: ForeachTreeCallback<TItem>,
  parentAtFirst?: boolean,
  members?: TItem[],
  index?: number,
  isChildrenProcessing?: boolean,
) => DeferredObj<unknown> | undefined;

export interface PathItem {
  key?: unknown;
  value?: unknown;
}

export interface ExpandedLevelOptions {
  rows: PivotGridField[];
  columns: PivotGridField[];
  rowExpandedPaths?: unknown[][];
  columnExpandedPaths?: unknown[][];
  headerName?: string;
  path?: unknown[];
  oppositePath?: unknown[];
}

export interface DiscoveredField {
  dataField: string;
  dataType?: string;
  groupName?: string;
  groupInterval?: string;
  groupIndex?: number;
  displayFolder: string;
}

export interface DrillDownStore {
  getDrillDownItems: (
    descriptions: unknown,
    params: unknown,
  ) => unknown[] | DeferredObj<unknown[]>;
  key: () => string | string[] | undefined;
}
