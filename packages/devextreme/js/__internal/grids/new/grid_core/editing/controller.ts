/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import { applyChanges } from '@js/common/data';
import { isDefined } from '@js/core/utils/type';
import { computed, type Signal } from '@preact/signals-core';
import { generateNewRowTempKey } from '@ts/grids/grid_core/editing/m_editing_utils';
import { OptionsValidationController } from '@ts/grids/new/grid_core/options_validation/index';

import { ColumnsController } from '../columns_controller/columns_controller';
import { DataController } from '../data_controller/data_controller';
import type { DataObject, Key } from '../data_controller/types';
import { ItemsController } from '../items_controller/items_controller';
import { KeyboardNavigationController } from '../keyboard_navigation/index';
import { OptionsController } from '../options_controller/options_controller';
import { ConfirmController } from './confirm_controller';
import type { Change } from './types';

export class EditingController {
  // todo: fix typing, remove explicit type here
  public readonly changes: Signal<Change[]> = this.options.twoWay('editing.changes');

  public readonly editCardKey = this.options.twoWay('editing.editCardKey');

  public allowDeleting = this.options.twoWay('editing.allowDeleting');

  public allowUpdating = this.options.twoWay('editing.allowUpdating');

  public allowAdding = this.options.twoWay('editing.allowAdding');

  private readonly needConfirmDelete = this.options.oneWay('editing.confirmDelete');

  public readonly texts = this.options.oneWay('editing.texts');

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

  private validateMethod?: () => Promise<boolean>;

  public readonly editingCard = computed(() => {
    const editCardKey = this.editCardKey.value;
    const items = this.itemsController.items.value;
    const changes = this.changes.value;

    if (!isDefined(editCardKey)) {
      return null;
    }

    const oldItem = this.itemsController.findItemByKey(items, editCardKey)!;

    if (!oldItem) {
      return null;
    }

    const insertChange = changes.find(
      (change) => change.key === editCardKey && change.type === 'insert',
    );

    const oldData = insertChange?.data ?? oldItem.data;

    const newData = insertChange
      ? { ...oldData, ...changes }
      : applyChanges(
        [oldData],
        changes,
        {
          keyExpr: this.dataController.dataSource.peek().key(),
          immutable: true,
        },
      )[0];

    const newItem = this.itemsController.createCardInfo(
      newData,
      this.columnController.columns.peek(),
      oldItem.index,
      undefined,
      oldItem.key,
    );
    return newItem;
  });

  public static dependencies = [
    OptionsController, ItemsController,
    ColumnsController, DataController,
    KeyboardNavigationController,
    OptionsValidationController,
    ConfirmController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly itemsController: ItemsController,
    private readonly columnController: ColumnsController,
    private readonly dataController: DataController,
    private readonly kbn: KeyboardNavigationController,
    private readonly optionsValidationController: OptionsValidationController,
    private readonly confirmController: ConfirmController,
  ) {}

  public provideValidateMethod(validateMethod: () => Promise<boolean>): void {
    this.validateMethod = validateMethod;
  }

  public editCard(key: Key): void {
    this.optionsValidationController.validateKeyExpr();

    const eventArgs = {
      cancel: false,
      key,
      data: this.itemsController.getCardByKey(key)!.data,
    };

    this.onEditingStart.peek()(eventArgs);

    if (!eventArgs.cancel) {
      this.editCardKey.value = key;
    }
  }

  public async validate(): Promise<boolean> {
    return this.validateMethod?.() ?? true;
  }

  public async addCard(): Promise<void> {
    this.optionsValidationController.validateKeyExpr();

    const eventArgs = {
      promise: undefined,
      data: {},
    };

    this.onInitNewCard.peek()(eventArgs);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await eventArgs.promise;

    const newItemKey = this.dataController.getDataKey(eventArgs.data) ?? generateNewRowTempKey();

    this.itemsController.additionalItems.value = [
      ...this.itemsController.additionalItems.peek(),
      this.itemsController.createCardInfo(
        eventArgs.data,
        this.columnController.columns.peek(),
        -1,
        [],
        newItemKey,
        false,
      ),
    ];

    this.changes.value = [
      ...this.changes.peek(), { type: 'insert', key: newItemKey, data: eventArgs.data },
    ];
    this.editCardKey.value = newItemKey;
  }

  private async confirmDelete(): Promise<boolean> {
    if (!this.needConfirmDelete.peek()) {
      return Promise.resolve(true);
    }

    const { confirmDeleteMessage, confirmDeleteTitle } = this.texts.peek();

    const showDialogTitle = isDefined(confirmDeleteTitle) && confirmDeleteTitle.length > 0;

    const result = await this.confirmController.confirm(
      confirmDeleteMessage ?? '', // TODO: bad typing
      confirmDeleteTitle ?? '', // TODO: bad typing
      showDialogTitle,
    );

    return result;
  }

  public async deleteCard(key: Key): Promise<void> {
    this.optionsValidationController.validateKeyExpr();

    const confirmStatus = await this.confirmDelete();

    if (!confirmStatus) {
      this.kbn.returnFocus();
      return;
    }

    // @ts-expect-error
    this.changes.value = [...this.changes.peek(), {
      type: 'remove',
      key,
    }];
    await this.save();

    this.kbn.returnFocus();
  }

  public clear(): void {
    this.changes.value = [];
    this.editCardKey.value = null;
    this.itemsController.additionalItems.value = [];
  }

  private async flushChanges(): Promise<void> {
    await this.processChanges(this.changes.peek());
    this.clear();
  }

  public cancel(): boolean {
    const changes = this.changes.peek();
    const eventArgs = {
      changes,
      cancel: false,
    };

    this.onEditCanceling.peek()(eventArgs);
    if (eventArgs.cancel) {
      return false;
    }

    this.clear();

    this.onEditCanceled.peek()({ changes });

    return true;
  }

  public async save(): Promise<void> {
    const validationSuccessful = await this.validate();
    if (!validationSuccessful) {
      return;
    }

    const changes = this.changes.peek();

    const eventArgs = {
      promise: undefined,
      cancel: false,
      changes,
    };

    this.onSaving.peek()(eventArgs);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await eventArgs.promise;

    if (eventArgs.cancel) {
      return;
    }

    await this.flushChanges();

    this.onSaved.peek()({
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
            oldData: this.itemsController.getCardByKey(change.key)!.data,
            newData: change.data,
            cancel: false,
            key: change.key,
          };

          this.onCardUpdating.peek()(updatingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await updatingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.update(change.key, change.data),
          );

          this.onCardUpdated.peek()({
            data: change.data,
            key: change.key,
          });
          break;
        }
        case 'remove': {
          const { data } = (this.itemsController.findItemByKey(
            this.itemsController.items.peek(),
            change.key,
          )!);

          const removingArgs = {
            cancel: false,
            data,
            key: change.key,
          };

          this.onCardRemoving.peek()(removingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await removingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.remove(change.key),
          );

          this.onCardRemoved.peek()({
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

          this.onCardInserting.peek()(insertingArgs);

          // eslint-disable-next-line no-await-in-loop, @typescript-eslint/await-thenable
          if (await insertingArgs.cancel) {
            break;
          }

          promises.push(
            this.dataController.insert(change.data),
          );

          this.onCardInserted.peek()({
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
    const existingChange = this.changes.peek()
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

    this.changes.value = [
      ...this.changes.peek()
        .filter((change) => change !== existingChange),
      newChange,
    ];
  }
}
