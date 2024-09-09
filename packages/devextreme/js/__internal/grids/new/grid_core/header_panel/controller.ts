/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable spellcheck/spell-checker */
import { isDefined } from '@js/core/utils/type';
import type { MaybeSubscribable } from '@ts/core/reactive';
import { computed, state, toSubscribable } from '@ts/core/reactive';

import { OptionsController } from '../options_controller/options_controller';
import { DEFAULT_TOOLBAR_ITEMS } from './defaults';
import type { PredefinedToolbarItem, ToolbarItem } from './types';

export class HeaderPanelController {
  private readonly defaultItems = state<Record<string, ToolbarItem>>({});

  private readonly userItems = this.options.oneWay('toolbarItems');

  public items = computed(
    (defaultItems, userItems) => {
      const defaultOrderedItems = Object.values(defaultItems)
        .sort((a, b) => {
          // @ts-expect-error
          const aIndex = a.name ? DEFAULT_TOOLBAR_ITEMS.indexOf(a.name) : Number.MAX_SAFE_INTEGER;
          // @ts-expect-error
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

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {}

  public addDefaultItem(
    item: MaybeSubscribable<PredefinedToolbarItem>,
  ): void {
    toSubscribable(item).subscribe((item) => {
      this.defaultItems.updateFunc((oldDefaultItems) => ({
        ...oldDefaultItems,
        [item.name]: item,
      }));
    });
  }

  public removeDefaultItem(name: typeof DEFAULT_TOOLBAR_ITEMS[number]): void {
    this.defaultItems.updateFunc((oldDefaultItems) => {
      const defaultItems = { ...oldDefaultItems };
      delete defaultItems[name];
      return defaultItems;
    });
  }
}
