/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { computed, toSubscribable } from '@ts/core/reactive/index';

import type { DataController } from '../data_controller';
import type { Key } from '../data_controller/types';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import * as modes from './modes';

export class EditingController {
  public static dependencies = [ToolbarController, OptionsController] as const;

  public readonly changes = this.options.twoWay('editingChanges');

  private readonly _editRowKey = this.options.twoWay('editCardKey');

  public readonly editRowKey: SubsGets<Key> = this._editRowKey;

  public readonly editRow = computed(
    (editRowKey) => { throw new Error('todo'); },
    [this.editRowKey],
  );

  private readonly mode = computed(
    (mode) => new modes.MODES[mode](
      this.options,
      this,
      this.toolbar,
    ),
    [
      // this.options.oneWay('editing.mode'),
      toSubscribable('popup' as const),
    ],
  );

  constructor(
    private readonly toolbar: ToolbarController,
    private readonly options: OptionsController,
  ) {}

  public addNewCard(): Promise<void> {
    return this.mode.unreactive_get().addNewCardImpl();
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
