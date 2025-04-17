/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import { applyChanges } from '@js/common/data';
import { confirm } from '@js/ui/dialog';
import type { SubsGetsUpd } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import { generateNewRowTempKey } from '@ts/grids/grid_core/editing/m_editing_utils';

import { ColumnsController } from '../columns_controller';
import { DataController } from '../data_controller/data_controller';
import type { DataObject, Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { OptionsController } from '../options_controller/options_controller';
import type { Change } from './types';

export class EditingController {
  // todo: fix typing, remove explicit type here
  public readonly changes: SubsGetsUpd<Change[]> = this.options.twoWay('editing.changes');

  public readonly editRowKey = this.options.twoWay('editing.editCardKey');

  public allowDeleting = this.options.twoWay('editing.allowDeleting');

  public allowUpdating = this.options.twoWay('editing.allowUpdating');

  public allowAdding = this.options.twoWay('editing.allowAdding');

  private readonly needConfirmDelete = this.options.oneWay('editing.confirmDelete');

  private readonly texts = this.options.oneWay('editing.texts');

  private readonly onEditCanceling = this.options.action('onEditCanceling');

  private readonly onEditCanceled = this.options.action('onEditCanceled');

  private readonly onEditingStart = this.options.action('onEditingStart');

  private readonly onInitNewCard = this.options.action('onInitNewCard');

  private readonly onCardInserted = this.options.action('onCardInserted');

  private readonly onCardInserting = this.options.action('onCardInserting');

  private readonly onCardUpdated = this.options.action('onCardUpdated');

  private readonly onCardUpdating = this.options.action('onCardUpdating');

  private readonly onCardRemoved = this.options.action('onCardRemoved');

  private readonly onCardRemoving = this.options.action('onCardRemoving');

  private readonly onSaving = this.options.action('onSaving');

  private readonly onSaved = this.options.action('onSaved');

  public readonly editingRow = computed(
    (editRowKey, items, changes) => {
      if (!editRowKey) {
        return null;
      }

      const oldItem = this.itemsController.findItemByKey(items, editRowKey)!;
      const newData = applyChanges(
        [oldItem.data],
        changes,
        {
          keyExpr: this.dataController.dataSource.unreactive_get().key(),
          immutable: true,
        },
      )[0];

      const newItem = this.itemsController.createDataRow(
        newData,
        this.columnController.columns.unreactive_get(),
        oldItem.index,
      );
      return newItem;
    },
    [this.editRowKey, this.itemsController.items, this.changes],
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
    const eventArgs = {
      cancel: false,
      key,
      data: this.itemsController.getRowByKey(key)!.data,
    };

    this.onEditingStart.unreactive_get()(eventArgs);

    if (!eventArgs.cancel) {
      this.editRowKey.update(key);
    }
  }

  public async addCard(): Promise<void> {
    const eventArgs = {
      promise: undefined,
      data: {},
    };

    this.onInitNewCard.unreactive_get()(eventArgs);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await eventArgs.promise;

    const newItemKey = this.dataController.getDataKey(eventArgs.data) ?? generateNewRowTempKey();
    this.itemsController.additionalItems.updateFunc((additionalItems) => {
      const newItem = this.itemsController.createDataRow(
        eventArgs.data,
        this.columnController.columns.unreactive_get(),
        -1,
        [],
        newItemKey,
      );
      return [...additionalItems, newItem];
    });
    this.changes.update([
      ...this.changes.unreactive_get(), { type: 'insert', key: newItemKey, data: {} },
    ]);
    this.editRowKey.update(newItemKey);
  }

  private async confirmDelete(): Promise<boolean> {
    if (!this.needConfirmDelete.unreactive_get()) {
      return Promise.resolve(true);
    }

    const result = await confirm(
      this.texts.unreactive_get().confirmDeleteMessage!,
      // @ts-expect-error wrong typing in optionController
      this.texts.unreactive_get().confirmDeleteTitle,
    );

    return result;
  }

  public async deleteRow(key: Key): Promise<void> {
    const confirmStatus = await this.confirmDelete();

    if (!confirmStatus) {
      return;
    }

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

  public cancel(): boolean {
    const changes = this.changes.unreactive_get();
    const eventArgs = {
      changes,
      cancel: false,
    };

    this.onEditCanceling.unreactive_get()(eventArgs);
    if (eventArgs.cancel) {
      return false;
    }

    this.clear();

    this.onEditCanceled.unreactive_get()({ changes });

    return true;
  }

  public async save(): Promise<void> {
    const changes = this.changes.unreactive_get();

    const eventArgs = {
      promise: undefined,
      cancel: false,
      changes,
    };

    this.onSaving.unreactive_get()(eventArgs);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await eventArgs.promise;

    if (eventArgs.cancel) {
      return;
    }

    await this.flushChanges();

    this.onSaved.unreactive_get()({
      changes,
    });
  }

  private async processChanges(changes: Change[]): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const change of changes) {
      // eslint-disable-next-line default-case
      switch (change.type) {
        case 'update': {
          const updatingArgs = {
            oldData: this.itemsController.getRowByKey(change.key)!.data,
            newData: change.data,
            cancel: false,
            key: change.key,
          };

          this.onCardUpdating.unreactive_get()(updatingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await updatingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.update(change.key, change.data),
          );

          this.onCardUpdated.unreactive_get()({
            data: change.data,
            key: change.key,
          });
          break;
        }
        case 'remove': {
          const { data } = (this.itemsController.findItemByKey(
            this.itemsController.items.unreactive_get(),
            change.key,
          )!);

          const removingArgs = {
            cancel: false,
            data,
            key: change.key,
          };

          this.onCardRemoving.unreactive_get()(removingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await removingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.remove(change.key),
          );

          this.onCardRemoved.unreactive_get()({
            data,
            key: change.key,
          });
          break;
        }
        case 'insert': {
          const insertingArgs = {
            cancel: false,
            data: change.data,
          };

          this.onCardInserting.unreactive_get()(insertingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await insertingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.insert(change.data),
          );

          this.onCardInserted.unreactive_get()({
            data: change.data,
          });
          break;
        }
      }
    }

    await Promise.all(promises);
    await this.dataController.reload();
  }

  public addChange(key: Key, newData: DataObject): void {
    const existingChange = this.changes.unreactive_get()
      .find(
        (change) => change.key === key && ['insert', 'update'].includes(change.type),
      );

    const newChange = existingChange ? {
      ...existingChange,
      data: {
        ...existingChange.data,
        ...newData,
      },
    } : {
      key,
      type: 'update' as const,
      data: newData,
    };

    this.changes.update([
      ...this.changes.unreactive_get().filter((change) => change !== existingChange),
      newChange,
    ]);
  }
}
