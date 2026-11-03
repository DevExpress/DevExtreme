import type { RowKey } from '@ts/grids/grid_core/types';

export type SelectionStateByKey = Record<string, boolean | undefined>;

export interface NormalizedSelectionArgs {
  currentSelectedRowKeys: RowKey[];
  currentDeselectedRowKeys: RowKey[];
  selectedRowKeys: RowKey[];
  selectedRowsData?: unknown[];
}

export interface TreeListSelectionControllerExtension {
  isRecursiveSelection: () => boolean | undefined;
  updateSelectionState: (options: {
    selectedItemKeys?: unknown[];
    removedItemKeys?: unknown[];
  }) => void;
}
