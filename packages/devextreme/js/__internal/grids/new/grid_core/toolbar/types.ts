import type { Item as BaseToolbarItem, ItemRenderedEvent } from '@js/ui/toolbar';

import type { DEFAULT_TOOLBAR_ITEMS } from './const';

export type DefaultToolbarItemName = typeof DEFAULT_TOOLBAR_ITEMS[number];

export interface ToolbarItem extends BaseToolbarItem {
  name?: DefaultToolbarItemName | string;
  sortIndex?: number;
  onItemRendered?: (e: ItemRenderedEvent) => void,
}

export type DefaultToolbarItem = ToolbarItem & {
  name: DefaultToolbarItemName,
  sortIndex?: number,
  onItemRendered?: (e: ItemRenderedEvent) => void,
};

export type ToolbarItems = (ToolbarItem | DefaultToolbarItemName)[];

export type DefaultToolbarItemsCollection = Record<string, DefaultToolbarItem>;

export interface ToolbarProps {
  items?: ToolbarItems;
  multiline?: boolean | undefined;
  visible?: boolean | undefined;
  disabled?: boolean;
  showContextMenu?: (event: KeyboardEvent | MouseEvent) => void;
}
