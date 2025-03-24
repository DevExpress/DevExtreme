/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';

import { DataController } from '../data_controller/data_controller';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { Change } from './types';

export class EditingController {
  public readonly changes = this.options.twoWay('editing.changes');

  public readonly editRowKey = this.options.twoWay('editing.editCardKey');

  public readonly editRow = computed(
    (editRowKey, items) => {
      if (!editRowKey) {
        return null;
      }

      return this.itemsController.findItemByKey(items, editRowKey);
    },
    [this.editRowKey, this.itemsController.items],
  );

  public static dependencies = [OptionsController, ItemsController, DataController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly itemsController: ItemsController,
    private readonly dataController: DataController,
  ) {}

  public cancel(): void {
    this.changes.update([]);
    this.editRowKey.update(null);
  }

  public async save(): Promise<void> {
    await this.processChanges(this.changes.unreactive_get());
    this.changes.update([]);
    this.editRowKey.update(null);
  }

  private async processChanges(changes: Change[]): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const change of changes) {
      // eslint-disable-next-line default-case
      switch (change.type) {
        case 'update':
          promises.push(
            this.dataController.update(change.key, change.data),
          );
          break;
        case 'remove':
          break;
        case 'insert':
          break;
      }
    }

    await Promise.all(promises);
    await this.dataController.reload();
  }

  // public onChanged(key: unknown, columnName: string, value: unknown): void {
  //   this.changes.update([
  //     ...this.changes.unreactive_get() ?? [],
  //     {
  //       type: 'update',
  //       key,
  //       data: {
  //         [columnName]: value,
  //       },
  //     },
  //   ]);
  // }
}
