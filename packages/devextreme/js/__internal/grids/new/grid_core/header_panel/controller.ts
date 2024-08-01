// @ts-nocheck
import { isDefined } from '@js/core/utils/type';
import type { Item as BaseToolbarItem } from '@js/ui/toolbar';
import { computed, state } from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';
import { DEFAULT_TOOLBAR_ITEMS } from './defaults';

interface ToolbarItem extends BaseToolbarItem {
  name?: string;
}

export type ToolbarConfiguration = ToolbarItem | string;

export class HeaderPanelController {
  private readonly defaultItems = state<Record<string, ToolbarItem>>({});

  private readonly userItems = this.options.oneWay('toolbarItems');

  public items = computed(
    (defaultItems, userItems) => {
      const defaultOrderedItems = Object.values(defaultItems)
        .sort((a, b) => {
          const aIndex = a.name ? DEFAULT_TOOLBAR_ITEMS.indexOf(a.name) : Number.MAX_SAFE_INTEGER;
          const bIndex = b.name ? DEFAULT_TOOLBAR_ITEMS.indexOf(b.name) : Number.MAX_SAFE_INTEGER;
          return bIndex - aIndex;
        });

      const baseItems = userItems ?? defaultOrderedItems;
      return baseItems
        .map(
          (item) => (typeof item === 'string' ? defaultItems[item] : item),
        )
        .filter(
          (item): item is ToolbarItem => isDefined(item),
        );
    },
    [this.defaultItems, this.userItems],
  );

  static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {}

  public addDefaultItem(item: ToolbarItem & { name: typeof DEFAULT_TOOLBAR_ITEMS[number] }): void {
    this.defaultItems.update((oldDefaultItems) => ({
      ...oldDefaultItems,
      [item.name]: item,
    }));
  }

  public removeDefaultItem(name: typeof DEFAULT_TOOLBAR_ITEMS[number]): void {
    this.defaultItems.update((oldDefaultItems) => {
      const defaultItems = { ...oldDefaultItems };
      delete defaultItems[name];
      return defaultItems;
    });
  }
}
