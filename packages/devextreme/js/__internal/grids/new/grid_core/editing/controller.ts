/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive/index';
import { computed, state } from '@ts/core/reactive/index';

import { HeaderPanelController } from '../header_panel/controller';
import type { PredefinedToolbarItem } from '../header_panel/types';
import { OptionsController } from '../options_controller/options_controller';

export class EditingController {
  public static dependencies = [HeaderPanelController, OptionsController] as const;

  private readonly _isEditing = state(false);

  public isEditing: Subscribable<boolean> = this._isEditing;

  public readonly changes = this.options.twoWay('editingChanges');

  private readonly saveButtonConfig = computed(
    (isEditing) => ({
      name: 'saveButton',
      location: 'after',
      widget: 'dxButton',
      disabled: !isEditing,
      options: {
        text: 'save',
        onClick: (): void => {
          this.save();
        },
      },
    } as PredefinedToolbarItem),
    [this.isEditing],
  );
  private readonly revertButtonConfig = computed(
    (changes) => ({
      name: 'revertButton',
      location: 'after',
      widget: 'dxButton',
      disabled: !changes?.length,
      options: {
        text: 'revert',
        onClick: () => {
          this.revert();
        },
      },
    } as PredefinedToolbarItem),
    [this.changes],
  );

  private readonly editButtonConfig = computed(
    (isEditing) => ({
      name: 'editButton',
      location: 'after',
      widget: 'dxButton',
      disabled: isEditing,
      options: {
        text: 'edit',
        onClick: () => {
          this.startEdit();
        },
      },
    } as PredefinedToolbarItem),
    [this.isEditing],
  );

  constructor(
    private readonly headerPanel: HeaderPanelController,
    private readonly options: OptionsController,
  ) {
    this.headerPanel.addDefaultItem(this.saveButtonConfig);
    this.headerPanel.addDefaultItem(this.editButtonConfig);
    this.headerPanel.addDefaultItem(this.revertButtonConfig);
  }

  public save(): void {
    this._isEditing.update(false);
  }

  public revert(): void {
    this.changes.update([]);
    this._isEditing.update(false);
  }

  public startEdit(): void {
    this._isEditing.update(true);
  }

  public onChanged(key: unknown, columnName: string, value: unknown): void {
    this.changes.update([
      ...this.changes.unreactive_get() ?? [],
      {
        type: 'update',
        key,
        data: {
          [columnName]: value,
        },
      },
    ]);
  }
}
