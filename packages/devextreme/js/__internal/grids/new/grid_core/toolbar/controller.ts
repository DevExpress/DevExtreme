import type { ReadonlySignal } from '@preact/signals-core';
import { computed, effect, signal } from '@preact/signals-core';

import { OptionsController } from '../options_controller/options_controller';
import { DEFAULT_TOOLBAR_ITEMS } from './defaults';
import type { PredefinedToolbarItem, ToolbarItem, ToolbarItems } from './types';
import { normalizeToolbarItems } from './utils';

export class ToolbarController {
  private readonly itemSubscriptions: Record<string, () => void> = {};

  private readonly defaultItems = signal<Record<string, PredefinedToolbarItem>>({});

  private readonly userItems: ReadonlySignal<ToolbarItems | undefined>;

  public items: ReadonlySignal<ToolbarItem[]>;

  public static dependencies = [OptionsController] as const;

  constructor(
    private readonly options: OptionsController,
  ) {
    this.userItems = this.options.oneWay('toolbar.items');

    this.items = computed(
      () => normalizeToolbarItems(
        Object.values(this.defaultItems.value),
        this.userItems.value,
        DEFAULT_TOOLBAR_ITEMS,
      ),
    );
  }

  public addDefaultItem(
    item: ReadonlySignal<PredefinedToolbarItem>,
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
