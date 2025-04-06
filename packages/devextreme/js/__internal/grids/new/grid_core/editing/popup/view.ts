/* eslint-disable spellcheck/spell-checker */
import type * as form from '@js/ui/form';
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed, state } from '@ts/core/reactive/index';
import { ColumnsController } from '../../columns_controller';

import { View } from '../../core/view';
import { OptionsController } from '../../options_controller/options_controller';
import { ToolbarController } from '../../toolbar/controller';
import { EditingController } from '../controller';
import type { Properties } from './component';
import { EditPopup } from './component';
import type * as dxForm from '@js/ui/form'
import { DataType } from '@js/common';
import { ItemsController } from '../../items_controller/items_controller';

const EDITOR_TYPES_BY_DATA_TYPE: Record<DataType, dxForm.FormItemComponent> = {
  string: 'dxTextBox',
  number: 'dxNumberBox',
  boolean: 'dxCheckBox',
  object: 'dxTextBox',
  date: 'dxDateBox',
  datetime: 'dxDateBox',
}

export class EditPopupView extends View<Properties> {
  protected component = EditPopup;

  private items = computed(
    (columns) => {
      return columns.map((column): dxForm.Item => ({
        name: column.name,
        dataField: column.dataField,
        validationRules: column.validationRules,
        label: {
          text: column.caption,
        },
        editorType: EDITOR_TYPES_BY_DATA_TYPE[column.dataType],
      }))
    },
    [this.columnsController.columns],
  )

  public static dependencies = [OptionsController, ColumnsController, ItemsController, EditingController, ToolbarController] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly itemsController: ItemsController,
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
      items: this.items,
      customizeItem: computed(
        (editKey) => (item: form.SimpleItem) => {
          const column = this.columnsController.columns.unreactive_get()
            .find((c) => c.name === item.name)!;
          const dataRow = this.itemsController.findItemByKey(
            this.itemsController.items.unreactive_get(),
            editKey
          );

          item.editorOptions ??= {};
          item.editorOptions.onValueChanged = ({ value }): void => {
            this.editingController.changes.update([
              ...this.editingController.changes.unreactive_get(),
              {
                type: 'update',
                key: editKey,
                data: {
                  // TODO: use column.setValue
                  [item.dataField!]: value,
                },
              },
            ]);
          };
          item.editorOptions.value = dataRow?.cells.find((c) => c.column.name === column.name)?.value;
        },
        [this.editingController.editRowKey],
      ),
    });
  }
}
