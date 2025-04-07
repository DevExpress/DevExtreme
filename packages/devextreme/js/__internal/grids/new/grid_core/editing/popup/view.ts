/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import type { DataType } from '@js/common';
import type * as dxForm from '@js/ui/form';
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';

import { ColumnsController } from '../../columns_controller';
import { View } from '../../core/view';
import { ItemsController } from '../../items_controller/items_controller';
import { OptionsController } from '../../options_controller/options_controller';
import { ToolbarController } from '../../toolbar/controller';
import { EditingController } from '../controller';
import type { Properties } from './component';
import { EditPopup } from './component';

const EDITOR_TYPES_BY_DATA_TYPE: Record<DataType, dxForm.FormItemComponent> = {
  string: 'dxTextBox',
  number: 'dxNumberBox',
  boolean: 'dxCheckBox',
  object: 'dxTextBox',
  date: 'dxDateBox',
  datetime: 'dxDateBox',
};

export class EditPopupView extends View<Properties> {
  protected component = EditPopup;

  private readonly items = computed(
    (columns) => columns.map((column): dxForm.Item => ({
      name: column.name,
      dataField: column.dataField,
      validationRules: column.validationRules,
      label: {
        text: column.caption,
      },
      editorType: EDITOR_TYPES_BY_DATA_TYPE[column.dataType],
    })),
    [this.columnsController.columns],
  );

  public static dependencies = [
    OptionsController, ColumnsController,
    ItemsController, EditingController,
    ToolbarController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly itemsController: ItemsController,
    private readonly editingController: EditingController,
    private readonly toolbar: ToolbarController,
  ) {
    super();

    this.toolbar.addDefaultItem({
      name: 'addCardButton',
      location: 'after',
      widget: 'dxButton',
      options: { icon: 'add', onClick: () => this.editingController.addCard() },
    }); // TODO: add conditional showing of button after rebase
  }

  protected getProps(): SubsGets<Properties> {
    return combined({
      data: computed(
        (editRow) => editRow?.data && { ...editRow.data },
        [this.editingController.editingRow],
      ),
      onSave: () => this.editingController.save(),
      onCancel: () => this.editingController.cancel(),
      onHide: () => this.editingController.cancel(),
      items: this.items,
      customizeItem: computed(
        (editKey) => (item: dxForm.SimpleItem) => {
          const column = this.columnsController.columns.unreactive_get()
            .find((c) => c.name === item.name)!;
          const dataRow = this.itemsController.findItemByKey(
            this.itemsController.items.unreactive_get(),
            editKey,
          );

          item.editorOptions ??= {};
          item.editorOptions.onValueChanged = ({ value }): void => {
            this.editingController.addChange(editKey, column, value);
          };
          item.editorOptions.value = dataRow?.cells.find(
            (c) => c.column.name === column.name,
          )?.value;
        },
        [this.editingController.editRowKey],
      ),
    });
  }
}
