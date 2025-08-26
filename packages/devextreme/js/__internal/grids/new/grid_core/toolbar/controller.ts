import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed, effect, signal } from '@ts/core/state_manager/index';

import { OptionsController } from '../options_controller/options_controller';
import { DEFAULT_TOOLBAR_ITEMS } from './const';
import type {
  DefaultToolbarItem, DefaultToolbarItemsCollection, ToolbarItem, ToolbarItems,
} from './types';
import { getSortedToolbarItems, normalizeToolbarItems } from './utils';

export class ToolbarController {
  private readonly itemSubscriptions: Record<string, () => void> = {};

  private readonly defaultItems = signal<DefaultToolbarItemsCollection>({});

  private readonly userItems: ReadonlySignal<ToolbarItems | undefined>;

  public items: ReadonlySignal<ToolbarItem[]>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.userItems = this.options.oneWay('toolbar.items');

    this.items = computed(
      () => normalizeToolbarItems(
        getSortedToolbarItems(this.defaultItems.value),
        this.userItems.value,
        DEFAULT_TOOLBAR_ITEMS,
      ),
    );
  }

  public addDefaultItem(
    item: ReadonlySignal<DefaultToolbarItem>,
    needRender: ReadonlySignal<boolean> = signal(true),
  ): void {
    const { name } = item.peek();

    this.itemSubscriptions[name] = effect(
      () => {
        const newDefaultItems = { ...this.defaultItems.peek() };

        if (needRender.value) {
          newDefaultItems[name] = item.value;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete newDefaultItems[name];
        }

        this.defaultItems.value = newDefaultItems;
      },
    );
  }
}
