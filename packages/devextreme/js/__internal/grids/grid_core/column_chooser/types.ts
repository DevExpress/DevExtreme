import type { Item } from '@js/ui/tree_view';

export interface ColumnChooserItem {
  expanded: boolean;
  disabled: boolean;
  parentId: number | null;
  text?: string;
  cssClass?: string;
  allowHiding?: boolean;
  id?: number;
  selected?: boolean;
}

export type NodeInternal = Item & {
  itemData: {
    id: number;
  };
  children: NodeInternal[];
};
