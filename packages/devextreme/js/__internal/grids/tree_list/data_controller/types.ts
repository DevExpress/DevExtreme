import type { Properties as TreeListProperties, RowExpandingEvent } from '@js/ui/tree_list';
import type { GeneratedItem, ItemProcessingOptions, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { OptionChanged, OptionChangedFor, RowKey } from '@ts/grids/grid_core/types';
import type { LoadOperation, TreeNode } from '@ts/grids/tree_list/data_source_adapter/types';

export interface TreeListGeneratedItem extends GeneratedItem {
  node: TreeNode;
  isExpanded?: boolean;
  level: number;
}

export interface TreeListProcessedItem extends ProcessedItem {
  node?: TreeNode;
  level?: number;
}

export type ExpandedKeysCache = Pick<LoadOperation, 'isExpandedByKey'>;

export type TreeListItemProcessingOptions = ItemProcessingOptions & ExpandedKeysCache;

export type RowExpandArgs = Pick<RowExpandingEvent<unknown, RowKey>, 'key' | 'cancel'>;

interface TreeListDataControllerOptions extends Pick<TreeListProperties<unknown, RowKey>,
'rootValue'
| 'parentIdExpr'
| 'itemsExpr'
| 'filterMode'
| 'expandNodesOnFiltering'
| 'autoExpandAll'
| 'hasItemsExpr'
| 'dataStructure'
> {
  maxFilterLengthInRequest?: number;
}

export type TreeListDataControllerOptionChanged = OptionChanged
  | OptionChangedFor<TreeListDataControllerOptions>;
