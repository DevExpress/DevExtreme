/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable spellcheck/spell-checker */
import type { DataType } from '@js/common';
import $ from '@js/core/renderer';
import messageLocalization from '@js/localization/message';
import type * as dxForm from '@js/ui/form';
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed, signal } from '@ts/core/state_manager/index';
import { extend } from '@ts/core/utils/m_extend';
import { forEachFormItems } from '@ts/grids/grid_core/editing/m_editing_utils';
import { createRef } from 'inferno';

import { ColumnsController } from '../../columns_controller/columns_controller';
import type { Column } from '../../columns_controller/types';
import { View } from '../../core/view';
import { ItemsController } from '../../items_controller/items_controller';
import { KeyboardNavigationController } from '../../keyboard_navigation/index';
import { OptionsController } from '../../options_controller/options_controller';
import { ToolbarController } from '../../toolbar/controller';
import { EditingController } from '../controller';
import type { EditingTexts } from '../options';
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

  private readonly items = computed((): dxForm.Item[] => {
    const userItems = this.options.oneWay('editing.form.items').value;

    if (userItems) {
      return userItems;
    }

    return this.columnsController.columns.value.map((column) => ({
      column,
      name: column.name,
      dataField: column.dataField,
    }));
  });

  private readonly customEditorItems = computed((): string[] => {
    const items = this.items.value;
    const result: string[] = [];

    forEachFormItems(items, (item) => {
      const itemId = item?.name || item?.dataField;

      if (itemId && !!item.editorType) {
        result.push(itemId);
      }
    });

    return result;
  });

  private readonly visible = computed(() => !!this.editingController.editingCard.value);

  private readonly editingTexts = computed((): EditingTexts => {
    const texts = this.editingController.texts.value;
    return {
      confirmDeleteMessage: texts.confirmDeleteMessage ?? messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
      confirmDeleteTitle: texts.confirmDeleteTitle ?? '',
      deleteCard: texts.deleteCard ?? messageLocalization.format('dxDataGrid-editingDeleteRow'),
      editCard: texts.editCard ?? messageLocalization.format('dxDataGrid-editingEditRow'),
      saveCard: texts.saveCard ?? messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
      addCard: texts.addCard ?? messageLocalization.format('dxDataGrid-editingAddRow'),
      cancel: texts.cancel ?? messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
    };
  });

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

    this.editingController.provideValidateMethod(async (): Promise<boolean> => {
      const form = this.formRef.current;

      if (!form) {
        return true;
      }

      const preValidationResult = form.validate();
      const validationResult = await (preValidationResult.complete ?? preValidationResult);

      return !!validationResult.isValid;
    });
  }

  protected getProps(): ReadonlySignal<Props> {
    return computed(() => ({
      visible: this.visible.value,
      formProps: this.options.oneWay('editing.form').value,
      popupProps: this.options.oneWay('editing.popup').value,
      formRef: this.formRef,
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
      customizeItem: this.customizeItems,
      texts: this.editingTexts.value,
    }));
  }

  private readonly customizeItems = (item: dxForm.Item): void => {
    const editingCard = this.editingController.editingCard.peek();
    const columns = this.columnsController.columns.peek();
    const customEditorItems = this.customEditorItems.peek();

    if (!editingCard) {
      return;
    }

    if (item.itemType !== 'simple') {
      return;
    }

    const simpleFormItem = item as dxForm.SimpleItem;
    const itemId = simpleFormItem.name ?? simpleFormItem.dataField;

    const column: Column = (simpleFormItem as any).column
        ?? columns.find((c) => c.name === itemId)
        ?? columns.find((c) => c.dataField === itemId);

    if (!column) {
      return;
    }

    (simpleFormItem as any).column = column;

    if (itemId && !customEditorItems.includes(itemId)) {
      simpleFormItem.editorType = EDITOR_TYPES_BY_DATA_TYPE[column.dataType];
    }

    extend(simpleFormItem, column.formItem);

    simpleFormItem.dataField ??= column.dataField;
    simpleFormItem.validationRules ??= column.validationRules;
    simpleFormItem.label = {
      text: column.caption,
      ...column.formItem.label,
    };

    const originalContentReady = simpleFormItem?.editorOptions?.onContentReady;

    simpleFormItem.editorOptions = {
      stylingMode: 'outlined',
      disabled: !column.allowEditing,
      ...column.editorOptions,
      ...column.formItem.editorOptions,
      ...simpleFormItem.editorOptions,
      onValueChanged: async ({ value }): Promise<void> => {
        const newData = {};
        await this.promises.add(
          Promise.resolve(column.setFieldValue.bind(column)(newData, value, editingCard.data)),
        );
        this.editingController.addChange(editingCard.key, newData);
      },
      value: editingCard?.fields.find(
        (c) => c.column.name === column.name,
      )?.value ?? null,
      onContentReady: (e): void => {
        // TODO: refactor
        setTimeout(() => {
          // @ts-expect-error
          $(e.element).data('dxValidator')?.option('dataGetter', () => ({
            data: this.editingController.editingCard.peek()?.data,
            column,
          }));
        });
        originalContentReady?.(e);
      },
    };

    if (simpleFormItem.editorType === 'dxDateBox') {
      simpleFormItem.editorOptions.type = column.dataType;
    }
  };
}
