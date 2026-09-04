import type { LoadOperation as BaseLoadOperation, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';

export interface LoadOperation extends BaseLoadOperation {
  storeLoadOptions: BaseLoadOperation['storeLoadOptions'] & {
    parentIds?: unknown[];
  };
  fullData?: RawItemData[];
  collapseVisibleNodes?: boolean;
  expandVisibleNodes?: boolean;
}

export interface TreeNode {
  key: unknown;
  children: TreeNode[];
  data?: unknown;
  parent?: TreeNode;
  level?: number;
  visible?: boolean;
  hasChildren?: boolean;
}

export type NodeByKey = Record<string, TreeNode>;
