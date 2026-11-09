import type { ViewCellOptions, ViewRow } from '@ts/grids/grid_core/views/types';
import type { TreeNode } from '@ts/grids/tree_list/data_source_adapter/types';

export interface TreeListNodeRow extends ViewRow {
  node: TreeNode;
  // the adaptive detail row copies the node but not the level
  level?: number;
}

export type TreeListViewRow = TreeListNodeRow | (ViewRow & { node?: undefined });

export interface TreeListNodeCellOptions extends ViewCellOptions {
  row: TreeListNodeRow;
}
