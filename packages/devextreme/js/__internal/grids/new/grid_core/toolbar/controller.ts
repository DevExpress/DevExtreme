/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable spellcheck/spell-checker */
import type {
  MaybeSubscribable, Subscribable, Subscription, SubsGets,
} from '@ts/core/reactive/index';
import {
  computed, effect, state, toSubscribable,
} from '@ts/core/reactive/index';

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
    needRender: MaybeSubscribable<boolean> = true,
  ): void {
    const itemObs = toSubscribable(item);
    const needRenderObs = toSubscribable(needRender);
    // @ts-expect-error
    const { name } = itemObs.unreactive_get();

    this.itemSubscriptions[name] = effect(
      (item, needRender) => {
        this.defaultItems.updateFunc((oldDefaultItems) => {
          const newDefaultItems = { ...oldDefaultItems };

          if (needRender) {
            newDefaultItems[item.name] = item;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete newDefaultItems[item.name];
          }

          return newDefaultItems;
        });
      },
      [itemObs, needRenderObs],
    );
  }
}
