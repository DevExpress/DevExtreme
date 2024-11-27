import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

import type { DEFAULT_TOOLBAR_ITEMS } from './defaults';

export interface ToolbarItem extends BaseToolbarItem {
  name?: string;
}

export type PredefinedToolbarItem = ToolbarItem & { name: typeof DEFAULT_TOOLBAR_ITEMS[number] };
