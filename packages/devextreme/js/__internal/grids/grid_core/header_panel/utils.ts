import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';

import type { ToolbarItem } from './types';

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

  return extend(true, {}, defaultProps, button);
}

export function normalizeToolbarItems(
  sortedDefaultItems: ToolbarItem[],
  userItems: (ToolbarItem | string)[] | undefined,
  defaultItemNames: readonly string[],
): ToolbarItem[] {
  if (!isDefined(userItems)) {
    return sortedDefaultItems;
  }

  const defaultButtonsMap = {};

  sortedDefaultItems.forEach((button) => {
    if (isDefined(button.name)) {
      defaultButtonsMap[button.name] = button;
    }
  });

  return userItems.map(
    (
      item: ToolbarItem | string,
    ) => normalizeToolbarItem(item, defaultButtonsMap, defaultItemNames),
  );
}
