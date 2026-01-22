import { extend } from '@js/core/utils/extend';
import type {
  FormItemComponent,
  GroupItem,
  Item as FormItem,
} from '@js/ui/form';

type ConfigItem = string | FormItem;

const isGroupItem = (item: FormItem): item is GroupItem => 'items' in item;

const createFormItemFromConfig = (configItem: ConfigItem): FormItem => (
  typeof configItem === 'string'
    ? {
      itemType: 'simple',
      editorType: 'dxTextBox' as FormItemComponent,
      name: configItem,
      dataField: configItem,
    }
    : configItem
);

const buildFormItemsMap = (
  items: FormItem[],
  map: Map<string, FormItem> = new Map(),
): Map<string, FormItem> => items.reduce(
  (accumulator, item) => {
    if (item.name) {
      accumulator.set(item.name, { ...item });
    }
    return buildFormItemsMap(isGroupItem(item) ? item.items ?? [] : [], accumulator);
  },
  map,
);

const removeItemFromGroups = (
  itemName: string,
  itemsMap: Map<string, FormItem>,
): void => {
  Array.from(itemsMap.values()).forEach((group) => {
    if (isGroupItem(group) && group.items) {
      group.items = group.items.filter((item) => item.name !== itemName);
    }
  });
};

const getItemName = (customItem: ConfigItem): string | undefined => (
  typeof customItem === 'string' ? customItem : customItem.name
);

const shouldMergeWithExisting = (customItems: ConfigItem): customItems is FormItem => typeof customItems === 'object';

const hasChildItems = (customItems: ConfigItem): customItems is GroupItem => typeof customItems === 'object'
&& isGroupItem(customItems) && Boolean(customItems.items);

const customizeFormItems = (
  items: FormItem[],
  userConfig?: ConfigItem[],
): FormItem[] => {
  if (!userConfig) {
    return items;
  }

  const defaultItemsMap = buildFormItemsMap(items);

  const resolveItem = (customItems: ConfigItem): FormItem => {
    const itemName = getItemName(customItems);
    const defaultItem = itemName ? defaultItemsMap.get(itemName) : undefined;

    if (defaultItem && itemName) {
      removeItemFromGroups(itemName, defaultItemsMap);

      return shouldMergeWithExisting(customItems)
        ? extend(true, {}, defaultItem, customItems) as FormItem
        : defaultItem;
    }

    return createFormItemFromConfig(customItems);
  };

  const customize = (userItems: ConfigItem[]):
  FormItem[] => userItems.map((customItems): FormItem => {
    const formItem = resolveItem(customItems);

    if (isGroupItem(formItem) && hasChildItems(customItems) && customItems.items) {
      return { ...formItem, items: customize(customItems.items) };
    }

    return formItem;
  });

  return customize(userConfig);
};

export { customizeFormItems };
export type { ConfigItem, FormItem };
