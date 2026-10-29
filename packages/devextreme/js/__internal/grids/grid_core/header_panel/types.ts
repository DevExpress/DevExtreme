import type { Item as BaseToolbarItem, ItemRenderedEvent } from '@js/ui/toolbar';

export interface ToolbarItem extends BaseToolbarItem {
  name?: string;
  sortIndex?: number;
  onItemRendered?: (e: ItemRenderedEvent) => void;
}
