import type { DxContextMenuTypes } from 'devextreme-vue/context-menu';

interface ResourceItem {
  text: string;
  id: number;
  color: string;
}

export type ContextMenuItem = DxContextMenuTypes.Item & Partial<ResourceItem> & {
  onItemClick?: (e: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) => void
};
