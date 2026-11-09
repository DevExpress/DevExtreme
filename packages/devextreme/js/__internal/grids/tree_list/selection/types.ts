import type { SelectionController } from '@ts/grids/grid_core/selection/selection';
import type { RowKey } from '@ts/grids/grid_core/types';

export type SelectionStateByKey = Record<string, boolean | undefined>;

export interface NormalizedSelectionArgs {
  currentSelectedRowKeys: RowKey[];
  currentDeselectedRowKeys: RowKey[];
  selectedRowKeys: RowKey[];
  selectedRowsData?: unknown[];
}

export interface SelectionStateArgs {
  selectedItemKeys?: RowKey[];
  removedItemKeys?: RowKey[];
}

export interface TreeListSelectionControllerExtension {
  isRecursiveSelection: () => boolean;
  updateSelectionState: (options: SelectionStateArgs) => void;
}

export type TreeListSelectionController = SelectionController
  & TreeListSelectionControllerExtension;
