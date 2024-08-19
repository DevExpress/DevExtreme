/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive';
import { computed, state } from '@ts/core/reactive';

import { HeaderPanelController } from '../header_panel/controller';
import type { PredefinedToolbarItem } from '../types';

export class EditingController {
  static dependencies = [HeaderPanelController] as const;

  private readonly _isEditing = state(false);

  public isEditing: Subscribable<boolean> = this._isEditing;

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
    (isEditing) => ({
      name: 'revertButton',
      location: 'after',
      widget: 'dxButton',
      disabled: !isEditing,
      options: {
        text: 'revert',
        onClick: () => {
          this.revert();
        },
      },
    } as PredefinedToolbarItem),
    [this.isEditing],
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
  ) {
    this.headerPanel.addDefaultItem(this.saveButtonConfig);
    this.headerPanel.addDefaultItem(this.editButtonConfig);
    this.headerPanel.addDefaultItem(this.revertButtonConfig);
  }

  public save(): void {
    this._isEditing.update(false);
  }

  public revert(): void {
    this._isEditing.update(false);
  }

  public startEdit(): void {
    this._isEditing.update(true);
  }

  public onChanged(columnName: string, value: unknown): void {
    console.log(columnName, value);
  }
}
