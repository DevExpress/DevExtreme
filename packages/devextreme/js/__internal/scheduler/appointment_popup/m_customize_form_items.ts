import { extend } from '@js/core/utils/extend';
import type {
  FormItemComponent,
  GroupItem,
  Item as FormItem,
  TabbedItem,
} from '@js/ui/form';

type ConfigItem = string | FormItem;

const isGroupItem = (item: FormItem): item is GroupItem => 'items' in item && !('tabs' in item);
const isTabbedItem = (item: FormItem): item is TabbedItem => 'tabs' in item;

const createFormItemFromConfig = (configItem: ConfigItem): FormItem => (
  typeof configItem === 'string'
    ? {
      itemType: 'simple',
      editorType: 'dxTextBox' as FormItemComponent,
      name: configItem,
      dataField: configItem,
    }
    : { ...configItem }
);

const getChildren = (item: FormItem): FormItem[] => [
  ...isGroupItem(item) ? item.items ?? [] : [],
  ...isTabbedItem(item) ? item.tabs?.flatMap((tab) => tab.items ?? []) ?? [] : [],
];

const buildFormItemsMap = (
  items: FormItem[],
  map: Map<string, FormItem> = new Map(),
): Map<string, FormItem> => items.reduce(
  (accumulator, item) => {
    if (item.name) {
      accumulator.set(item.name, { ...item });
    }
    return buildFormItemsMap(getChildren(item), accumulator);
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

const getItemName = (configure: ConfigItem): string | undefined => (
  typeof configure === 'string' ? configure : configure.name
);

const shouldMergeWithExisting = (configure: ConfigItem): configure is FormItem => typeof configure === 'object';

const hasChildItems = (configure: ConfigItem): configure is GroupItem => typeof configure === 'object'
&& isGroupItem(configure) && Boolean(configure.items);

const baseResolveItem = (map: Map<string, FormItem>) => (configure: ConfigItem): FormItem => {
  const itemName = getItemName(configure);
  const existingItem = itemName ? map.get(itemName) : undefined;

  if (!existingItem || !itemName) {
    return createFormItemFromConfig(configure);
  }

  removeItemFromGroups(itemName, map);

  return shouldMergeWithExisting(configure)
    ? extend(true, {}, existingItem, configure) as FormItem
    : existingItem;
};

const customizeFormItems = (
  items: FormItem[],
  userConfig?: ConfigItem[],
): FormItem[] => {
  if (!userConfig) {
    return items;
  }

  const map = buildFormItemsMap(items);
  const resolveItem = baseResolveItem(map);

  const customize = (config: ConfigItem[]): FormItem[] => config.map((configure): FormItem => {
    const formItem = resolveItem(configure);

    if (isGroupItem(formItem) && hasChildItems(configure) && configure.items) {
      return { ...formItem, items: customize(configure.items) };
    }

    return formItem;
  });

  return customize(userConfig);
};

export { customizeFormItems };
export type { ConfigItem, FormItem };
