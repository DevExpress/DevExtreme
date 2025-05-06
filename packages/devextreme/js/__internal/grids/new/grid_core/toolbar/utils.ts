import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

import type { ToolbarItems } from './types';

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

export function normalizeToolbarItems(
  defaultItems: (ToolbarItem & { name: string })[],
  userItems: (ToolbarItem | string)[] | undefined,
  defaultItemNames: readonly string[],
): ToolbarItem[] {
  if (!isDefined(userItems)) {
    return defaultItems;
  }

  const defaultButtonsMap = {};

  defaultItems.forEach((button) => {
    defaultButtonsMap[button.name] = button;
  });

  return userItems.map(
    (
      item: ToolbarItem | string,
    ) => normalizeToolbarItem(item, defaultButtonsMap, defaultItemNames),
  );
}
