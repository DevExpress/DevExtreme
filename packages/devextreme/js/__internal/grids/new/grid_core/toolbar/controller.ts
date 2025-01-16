/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import type {
  MaybeSubscribable, Subscribable, Subscription, SubsGets,
} from '@ts/core/reactive/index';
import { computed, state, toSubscribable } from '@ts/core/reactive/index';

import { OptionsController } from '../options_controller/options_controller';
import { DEFAULT_TOOLBAR_ITEMS } from './defaults';
import type { PredefinedToolbarItem, ToolbarItem, ToolbarItems } from './types';
import { normalizeToolbarItems } from './utils';

export class ToolbarController {
  private readonly itemSubscriptions: Record<string, Subscription> = {};

  private readonly defaultItems = state<Record<string, PredefinedToolbarItem>>({});

  private readonly userItems: Subscribable<ToolbarItems | undefined>;

  public items: SubsGets<ToolbarItem[]>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.userItems = this.options.oneWay('toolbar.items');
    this.items = computed(
      (defaultItems, userItems) => normalizeToolbarItems(
        Object.values(defaultItems),
        userItems,
        DEFAULT_TOOLBAR_ITEMS,
      ),
      [this.defaultItems, this.userItems],
    );
  }

  public addDefaultItem(
    item: MaybeSubscribable<PredefinedToolbarItem>,
  ): void {
    const itemObs = toSubscribable(item);
    // @ts-expect-error
    const { name } = itemObs.unreactive_get();

    this.itemSubscriptions[name] = itemObs.subscribe((item) => {
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
    this.itemSubscriptions[name].unsubscribe();
  }
}
