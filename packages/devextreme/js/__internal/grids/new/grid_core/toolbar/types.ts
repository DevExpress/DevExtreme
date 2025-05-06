import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

import type { DEFAULT_TOOLBAR_ITEMS } from './defaults';

type DefaultToolbarItem = typeof DEFAULT_TOOLBAR_ITEMS[number];

export interface ToolbarItem extends BaseToolbarItem {
  name?: DefaultToolbarItem | string;
}

export type PredefinedToolbarItem = ToolbarItem & { name: DefaultToolbarItem };
export type ToolbarItems = (ToolbarItem | DefaultToolbarItem)[];

export interface ToolbarProps {
  items?: ToolbarItems;
  multiline?: boolean | undefined;
  visible?: boolean | undefined;
  disabled?: boolean;
  showContextMenu?: (event: KeyboardEvent | MouseEvent) => void;
}
