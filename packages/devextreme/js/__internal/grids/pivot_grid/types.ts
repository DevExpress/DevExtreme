import type { ScalarFilterValue } from '@js/common/grids';
import type { DeferredObj } from '@js/core/utils/deferred';
import type PivotGridDataSource from '@js/ui/pivot_grid/data_source';
import type { Field } from '@js/ui/pivot_grid/data_source';

export type PivotGridField = Field & {
  index?: number;
  _initProperties?: Record<string, unknown> | null;
  levels?: PivotGridField[];
  searchValue?: string;
};

export type PivotGridFilterField = Omit<
  PivotGridField,
  'groupIndex' | 'groupName' | 'filterType' | 'filterValues'
> & {
  groupIndex: null;
  groupName: null;
  filterType: string;
  filterValues: ScalarFilterValue[];
};

/** A hierarchy field's filter value holds one header value per level. */
export type PivotGridFilterValue = ScalarFilterValue | ScalarFilterValue[];

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

export type PivotGridAxis = 'rows' | 'columns';

export interface ExpandedLevelOptions {
  rows: PivotGridField[];
  columns: PivotGridField[];
  rowExpandedPaths?: ScalarFilterValue[][];
  columnExpandedPaths?: ScalarFilterValue[][];
  headerName?: PivotGridAxis;
  path?: ScalarFilterValue[];
  oppositePath?: ScalarFilterValue[];
}

export interface PivotGridLoadOptions extends ExpandedLevelOptions {
  values?: PivotGridField[];
  filters?: PivotGridField[];
  rowSkip?: number;
  rowTake?: number;
  columnSkip?: number;
  columnTake?: number;
}

export interface PivotGridDescriptions {
  rows: PivotGridField[];
  columns: PivotGridField[];
  values: PivotGridField[];
  filters: PivotGridField[];
}

export type DrillDownParams = Parameters<PivotGridDataSource['createDrillDownDataSource']>[0];

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
    descriptions: PivotGridLoadOptions | undefined,
    params: DrillDownParams | undefined,
  ) => unknown[] | DeferredObj<unknown[]>;
  key: () => string | string[] | undefined;
}
