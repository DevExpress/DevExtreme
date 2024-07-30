import type { Subscribable } from '@ts/core/reactive';
import { state } from '@ts/core/reactive';

import { HeaderPanelController } from '../header_panel/controller';

export class EditingController {
  static dependencies = [HeaderPanelController] as const;

  private readonly _isEditing = state(false);

  public isEditing: Subscribable<boolean> = this._isEditing;

  public save(): void {

  }

  public revert(): void {
  }

  public startEdit(): void {
    this._isEditing.update(true);
  }

  constructor(
    private readonly headerPanel: HeaderPanelController,
  ) {
    this.headerPanel.addDefaultItem({
      name: 'saveButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'save',
        onClick: () => {
          this.save();
        },
      },
    });
    this.headerPanel.addDefaultItem({
      name: 'editButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'edit',
        onClick: () => {
          this.startEdit();
        },
      },
    });
    this.headerPanel.addDefaultItem({
      name: 'revertButton',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'revert',
        onClick: () => {
          this.revert();
        },
      },
    });
  }
}
