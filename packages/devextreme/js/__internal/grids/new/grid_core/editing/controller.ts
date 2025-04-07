/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import type { SubsGetsUpd } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { generateNewRowTempKey } from '@ts/grids/grid_core/editing/m_editing_utils';

import { ColumnsController } from '../columns_controller';
import type { Column } from '../columns_controller/types';
import { DataController } from '../data_controller/data_controller';
import type { Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { Change } from './types';

export class EditingController {
  // todo: fix typing, remove explicit type here
  public readonly changes: SubsGetsUpd<Change[]> = this.options.twoWay('editing.changes');

  public readonly editRowKey = this.options.twoWay('editing.editCardKey');

  public allowDeleting = this.options.twoWay('editing.allowDeleting');

  public allowUpdating = this.options.twoWay('editing.allowUpdating');

  public allowAdding = this.options.twoWay('editing.allowDeleting');

  public readonly editingRow = computed(
    (editRowKey, items) => {
      if (!editRowKey) {
        return null;
      }

      return this.itemsController.findItemByKey(items, editRowKey);
    },
    [this.editRowKey, this.itemsController.items],
  );

  public static dependencies = [
    OptionsController, ItemsController,
    ColumnsController, DataController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly itemsController: ItemsController,
    private readonly columnController: ColumnsController,
    private readonly dataController: DataController,
  ) {}

  public editRow(key: Key): void {
    this.editRowKey.update(key);
  }

  public addCard(): void {
    const newItemKey = generateNewRowTempKey();
    this.itemsController.additionalItems.updateFunc((additionalItems) => {
      const newItem = this.itemsController.createDataRow(
        {},
        this.columnController.columns.unreactive_get(),
        -1,
        newItemKey,
      );
      return [...additionalItems, newItem];
    });
    this.changes.update([
      ...this.changes.unreactive_get(), { type: 'insert', key: newItemKey, data: {} },
    ]);
    this.editRowKey.update(newItemKey);
  }

  public async deleteRow(key: Key): Promise<void> {
    // todo: onCardDeleting event
    // @ts-expect-error
    this.changes.update([...this.changes.unreactive_get(), {
      type: 'remove',
      key,
    }]);
    await this.save();
  }

  private clear(): void {
    this.changes.update([]);
    this.editRowKey.update(null);
    this.itemsController.additionalItems.update([]);
  }

  private async flushChanges(): Promise<void> {
    await this.processChanges(this.changes.unreactive_get());
    this.clear();
  }

  public cancel(): void {
    this.clear();
  }

  public async save(): Promise<void> {
    await this.flushChanges();
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
          promises.push(
            this.dataController.remove(change.key),
          );
          break;
        case 'insert':
          promises.push(
            this.dataController.insert(change.data),
          );
          break;
      }
    }

    await Promise.all(promises);
    await this.dataController.reload();
  }

  public addChange(key: Key, column: Column, value: unknown): void {
    const existingChange = this.changes.unreactive_get()
      .find(
        (change) => change.key === key && ['insert', 'update'].includes(change.type),
      );

    const newChange = existingChange ? {
      ...existingChange,
      data: {
        ...existingChange.data,
        [column.dataField!]: value,
      },
    } : {
      key,
      type: 'update' as const,
      data: {
        [column.dataField!]: value,
      },
    };

    this.changes.update([
      ...this.changes.unreactive_get().filter((change) => change !== existingChange),
      newChange,
    ]);
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
