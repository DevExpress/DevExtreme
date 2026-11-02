import { DEFAULT_TOOLBAR_ITEMS } from './const';
import type {
  DefaultToolbarItem, DefaultToolbarItemsCollection, ToolbarItems,
} from './types';

export function isVisible(
  visibleConfig: boolean | undefined,
  items: ToolbarItems,
): boolean {
  if (visibleConfig === undefined) {
    return items.length > 0;
  }

  return visibleConfig;
}

export function getSortedToolbarItems(
  defaultItemsCollection: DefaultToolbarItemsCollection,
): DefaultToolbarItem[] {
  return Object.values(defaultItemsCollection)
    .sort((a, b) => {
      const aIndex = DEFAULT_TOOLBAR_ITEMS.indexOf(a.name);
      const bIndex = DEFAULT_TOOLBAR_ITEMS.indexOf(b.name);
      return aIndex - bIndex;
    });
}
