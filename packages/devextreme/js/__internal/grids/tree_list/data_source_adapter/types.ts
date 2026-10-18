import type { StoreKey } from '@ts/data/abstract_store';
import type {
  LoadOperation as BaseLoadOperation,
  OperationTypes as BaseOperationTypes,
  RawItemData,
} from '@ts/grids/grid_core/data_source_adapter/types';
import type { RowKey } from '@ts/grids/grid_core/types';

export interface LoadOperation extends BaseLoadOperation {
  storeLoadOptions: BaseLoadOperation['storeLoadOptions'] & {
    parentIds?: RowKey[];
  };
  fullData?: RawItemData[];
  collapseVisibleNodes?: boolean;
  expandVisibleNodes?: boolean;
  isExpandedByKey?: Record<string, boolean>;
}

export interface OperationTypes extends BaseOperationTypes {
  nodeExpanding: boolean;
}

export type ConvertibleData = RawItemData[] & { isConverted?: boolean };

export type DataGetter = (data: unknown) => unknown;

export type DataSetter = (data: unknown, value: unknown) => void;

export type KeyExpr = StoreKey | ((item: unknown, value?: unknown) => unknown);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- alias fits RawItemData
export type TreeNode = {
  key: RowKey;
  children: TreeNode[];
  data?: RawItemData;
  parent?: TreeNode;
  level?: number;
  visible?: boolean;
  hasChildren?: boolean;
};

export type NodeByKey = Record<string, TreeNode>;

export type NodeCallback = (node: TreeNode) => unknown;
