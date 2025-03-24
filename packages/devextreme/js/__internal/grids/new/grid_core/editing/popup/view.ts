/* eslint-disable spellcheck/spell-checker */
import type * as form from '@js/ui/form';
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed, state } from '@ts/core/reactive/index';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';
import { ToolbarController } from '../../toolbar/controller';
import { EditingController } from '../controller';
import type { Properties } from './component';
import { EditPopup } from './component';

export class EditPopupView extends View<Properties> {
  protected component = EditPopup;

  private readonly visible = state(false);

  public static dependencies = [OptionsController, EditingController, ToolbarController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly editingController: EditingController,
    private readonly toolbar: ToolbarController,
  ) {
    super();

    // this.toolbar.addDefaultItem(() => {

    // })
  }

  protected getProps(): SubsGets<Properties> {
    return combined({
      data: computed(
        (editRow) => editRow?.data && { ...editRow.data },
        [this.editingController.editRow],
      ),
      onSave: () => this.editingController.save(),
      onCancel: () => this.editingController.cancel(),
      onHide: () => this.editingController.cancel(),
      customizeItem: computed(
        (editKey) => (item: form.SimpleItem) => {
          item.editorOptions ??= {};
          item.editorOptions.onValueChanged = ({ value }): void => {
            this.editingController.changes.update([
              ...this.editingController.changes.unreactive_get(),
              {
                type: 'update',
                key: editKey,
                data: {
                  [item.dataField!]: value,
                },
              },
            ]);
          };
        },
        [this.editingController.editRowKey],
      ),
    });
  }
}
