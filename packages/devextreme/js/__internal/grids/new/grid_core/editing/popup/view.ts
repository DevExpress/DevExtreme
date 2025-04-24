/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
import type { DataType } from '@js/common';
import type * as dxForm from '@js/ui/form';
import type { ReadonlySignal } from '@preact/signals-core';
import { computed, signal } from '@preact/signals-core';
import { createRef } from 'inferno';

import { ColumnsController } from '../../columns_controller/columns_controller';
import { View } from '../../core/view';
import { ItemsController } from '../../items_controller/items_controller';
import { KeyboardNavigationController } from '../../keyboard_navigation/index';
import { OptionsController } from '../../options_controller/options_controller';
import { ToolbarController } from '../../toolbar/controller';
import { EditingController } from '../controller';
import { PendingPromises } from '../utils';
import type { Props } from './component';
import { EditPopup } from './component';

const EDITOR_TYPES_BY_DATA_TYPE: Record<DataType, dxForm.FormItemComponent> = {
  string: 'dxTextBox',
  number: 'dxNumberBox',
  boolean: 'dxCheckBox',
  object: 'dxTextBox',
  date: 'dxDateBox',
  datetime: 'dxDateBox',
};

export class EditPopupView extends View<Props> {
  private readonly promises = new PendingPromises();

  private readonly formRef = createRef<dxForm.default>();

  protected component = EditPopup;

  private readonly items = computed(
    () => this.columnsController.columns.value.map((column): dxForm.Item => ({
      // @ts-expect-error
      column,
      name: column.name,
      dataField: column.dataField,
      validationRules: column.validationRules,
      label: {
        text: column.caption,
        ...column.formItem.label,
      },
      editorType: EDITOR_TYPES_BY_DATA_TYPE[column.dataType],
      editorOptions: {
        ...column.editorOptions,
        disabled: !column.allowEditing,
        ...column.formItem.editorOptions,
      },
      ...column.formItem,
    })),
  );

  private readonly formData = computed(() => {
    const editRow = this.editingController.editingRow.value;
    return editRow?.data && { ...editRow.data };
  });

  private readonly customizeItems = computed(
    () => (item: dxForm.SimpleItem): void => {
      const editingRow = this.editingController.editingRow.value;

      if (!editingRow) {
        return;
      }

      const column = this.columnsController.columns.peek()
        .find((c) => c.name === item.name)!;

      item.editorOptions ??= {};
      item.editorOptions.onValueChanged = async ({ value }): Promise<void> => {
        const newData = {};
        await this.promises.add(
          Promise.resolve(column.setCellValue.bind(column)(newData, value, editingRow.data)),
        );
        this.editingController.addChange(editingRow.key, newData);
        this.formRef.current?.repaint();
      };
      item.editorOptions.value = editingRow?.cells.find(
        (c) => c.column.name === column.name,
      )?.value;
    },
  );

  public static dependencies = [
    OptionsController, ColumnsController,
    ItemsController, EditingController,
    ToolbarController, KeyboardNavigationController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly itemsController: ItemsController,
    private readonly editingController: EditingController,
    private readonly toolbar: ToolbarController,
    private readonly kbn: KeyboardNavigationController,
  ) {
    super();

    this.toolbar.addDefaultItem(
      signal({
        name: 'addCardButton',
        location: 'after',
        widget: 'dxButton',
        options: { icon: 'add', onClick: () => this.editingController.addCard() },
      }),
      this.editingController.allowAdding,
    );
  }

  protected getProps(): ReadonlySignal<Props> {
    return computed(() => ({
      formProps: this.options.oneWay('editing.form').value,
      popupProps: this.options.oneWay('editing.popup').value,
      formRef: this.formRef,
      data: this.formData.value,
      onSave: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.editingController.save();
        this.kbn.returnFocus();
      },
      onCancel: (): void => {
        this.editingController.cancel();
        this.kbn.returnFocus();
      },
      onHide: (): void => {
        this.editingController.cancel();
        this.kbn.returnFocus();
      },
      items: this.items.value,
      customizeItem: this.customizeItems.value,
    }));
  }
}
