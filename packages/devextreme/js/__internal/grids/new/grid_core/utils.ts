import { extend } from '@js/core/utils/extend';
import { isDefined, isString } from '@js/core/utils/type';
import type { Item as BaseToolbarItem } from '@js/ui/toolbar';

interface ToolbarItem extends BaseToolbarItem {
  name?: string;
}

export function normalizeToolbarItem(
  item: ToolbarItem | string,
  defaultButtonsMap: { [key: string]: ToolbarItem },
  defaultItemNames: string[],
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
  items: (ToolbarItem & { name: string })[],
  userItems: (ToolbarItem | string)[],
  defaultItemNames: string[],
): ToolbarItem[] {
  const isArray = Array.isArray(userItems);

  items.forEach((button) => {
    if (!defaultItemNames.includes(button.name)) {
      throw new Error(`Default toolbar item '${button.name}' is not added to DEFAULT_TOOLBAR_ITEM_NAMES`);
    }
  });

  if (!isDefined(userItems)) {
    return items;
  }

  const defaultButtonsMap = {};
  items.forEach((button) => {
    defaultButtonsMap[button.name] = button;
  });

  return (isArray ? userItems : [userItems])
    .map(
      (
        item: ToolbarItem | string,
      ) => normalizeToolbarItem(item, defaultButtonsMap, defaultItemNames),
    );
}
