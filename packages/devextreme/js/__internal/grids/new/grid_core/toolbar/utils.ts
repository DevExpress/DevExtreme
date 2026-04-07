import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

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

interface ToolbarItem extends BaseToolbarItem {
  name?: string;
}

function normalizeToolbarItem(
  item: ToolbarItem | string,
  defaultButtonsMap: { [key: string]: ToolbarItem },
  defaultItemNames: readonly string[],
): ToolbarItem {
  let button = item;
  const defaultProps: ToolbarItem = { location: 'after' };

  if (isString(button)) {
    button = { name: button };
  }

  if (isDefined(button.name)) {
    if (isDefined(defaultButtonsMap[button.name])) {
      button = extend(true, {}, defaultButtonsMap[button.name], button);
    } else if (defaultItemNames.includes(button.name)) {
      button = { ...button, visible: false };
    }
  }

  return extend(true, {}, defaultProps, button) as ToolbarItem;
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

export function normalizeToolbarItems(
  sortedDefaultItems: DefaultToolbarItem[],
  userItems: (ToolbarItem | string)[] | undefined,
  defaultItemNames: readonly string[],
): ToolbarItem[] {
  if (!isDefined(userItems)) {
    return sortedDefaultItems;
  }

  const defaultButtonsMap = {};

  sortedDefaultItems.forEach((button) => {
    defaultButtonsMap[button.name] = button;
  });

  return userItems.map(
    (
      item: ToolbarItem | string,
    ) => normalizeToolbarItem(item, defaultButtonsMap, defaultItemNames),
  );
}
