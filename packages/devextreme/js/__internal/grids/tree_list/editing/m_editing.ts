/* eslint-disable max-classes-per-file */
import '../module_not_extended/editor_factory';

import messageLocalization from '@js/common/core/localization/message';
import type { NewRowInfo } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import { DATA_CHANGE_TYPE } from '@ts/grids/grid_core/editing/const';
import { editingModule } from '@ts/grids/grid_core/editing/editing';
import { editingDataControllerExtender } from '@ts/grids/grid_core/editing/extenders/editing_data_controller';
import type {
  EditActionOptions,
  EditingChange,
  EditingDataControllerExtension,
  EditingRowsViewExtension,
  EditorCellOptions,
  InternalColumnButton,
} from '@ts/grids/grid_core/editing/types';
import { SELECT_CHECKBOX_CLASS } from '@ts/grids/grid_core/selection/const';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import type { ViewRowEvent } from '@ts/grids/grid_core/views/types';
import { CLASSES as ROWS_CLASSES } from '@ts/grids/tree_list/rows/const';
import type { TreeListRowsView } from '@ts/grids/tree_list/rows/m_rows';

import treeListCore from '../core';
import type { TreeListDataController } from '../data_controller/data_controller';
import type { TreeListDataSourceController } from '../data_source/data_source_controller';
import type { TreeListEditingDefaultOptions } from './types';

const isExpandIconTarget = ($target: dxElementWrapper): boolean => !!$target
  .closest(`.${ROWS_CLASSES.expandIconContainer}`).length;

const isSelectCheckboxTarget = ($target: dxElementWrapper): boolean => !!$target
  .closest(`.${SELECT_CHECKBOX_CLASS}`).length;

class EditingController extends editingModule.controllers.editing {
  protected declare _dataController: TreeListDataController;

  protected declare dataSourceController: TreeListDataSourceController;

  protected _generateNewItem(key: RowKey): RawItemData {
    return {
      ...super._generateNewItem(key),
      data: { key },
      children: [],
      level: 0,
      parentKey: this.option('rootValue'),
    };
  }

  protected _isProcessedItem(): boolean {
    return true;
  }

  private isRootParentKey(parentKey: RowKey): boolean {
    return parentKey === undefined || parentKey === this.option('rootValue');
  }

  protected _setInsertAfterOrBeforeKey(change: Partial<EditingChange>, parentKey?: RowKey): void {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const key = parentKey || dataSourceAdapter?.parentKeyOf(change.data);

    if (!this.isRootParentKey(key)) {
      change.insertAfterKey = key;
    } else {
      super._setInsertAfterOrBeforeKey(change, parentKey);
    }
  }

  protected _getLoadedRowIndex(
    items: (RawItemData | ProcessedItem)[],
    change: Partial<EditingChange>,
    isProcessedItems?: boolean,
  ): number {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const insertParentKey = this._getInternalData(change.key)?.insertInfo?.parentKey;
    const parentKey = insertParentKey !== undefined
      ? insertParentKey
      : dataSourceAdapter?.parentKeyOf(change.data);

    if (!this.isRootParentKey(parentKey)) {
      const rowIndex = gridCoreUtils.getIndexByKey(parentKey, items);
      if (!(rowIndex >= 0 && this._dataController.isRowExpanded(parentKey))) {
        return -1;
      }
    }

    return super._getLoadedRowIndex(items, change, isProcessedItems);
  }

  protected _isEditColumnVisible(): boolean {
    const result = super._isEditColumnVisible();
    const editingOptions = this.option('editing');

    return result || !!editingOptions?.allowAdding;
  }

  protected _isDefaultButtonVisible(
    button: InternalColumnButton,
    options: EditorCellOptions,
  ): boolean {
    const result = super._isDefaultButtonVisible(button, options);
    const { row } = options;

    if (button.name === 'add') {
      return this.allowAdding(options)
        && !!row
        && row.rowIndex !== this._getVisibleEditRowIndex()
        && !row.removed
        && !row.isNewRow;
    }

    return result;
  }

  protected _getEditingButtons(options: EditorCellOptions): InternalColumnButton[] {
    const buttons = super._getEditingButtons(options);

    if (!options.column.buttons) {
      buttons.unshift(this._getButtonConfig('add', options));
    }

    return buttons;
  }

  protected _beforeSaveEditData(change?: EditingChange): boolean {
    const result = super._beforeSaveEditData(change);

    if (change && change.type !== DATA_CHANGE_TYPE.insert) {
      const key = this.dataSourceController.store()?.key();

      if (!isDefined(key)) {
        throw errors.Error('E1045');
      }
    }

    return result;
  }

  // the add button's click handler calls it via METHOD_NAMES[buttonName]
  private addRowByRowIndex(rowIndex: number): DeferredObj<unknown> {
    const row = this._dataController.getVisibleRows()[rowIndex];

    return this.addRow(row ? row.key : undefined);
  }

  protected addRow(key: RowKey = this.option('rootValue')): DeferredObj<unknown> {
    return super.addRow(key);
  }

  protected _addRowCore(
    data: RawItemData,
    parentKey: RowKey | undefined,
    oldEditRowIndex: number,
  ): DeferredObj<unknown> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const parentKeyGetter = dataSourceAdapter?.createParentIdGetter();
    const newRowParentKey = parentKeyGetter ? parentKeyGetter(data) : parentKey;

    if (!this.isRootParentKey(newRowParentKey)
      && !this._dataController.isRowExpanded(newRowParentKey)) {
      const deferred = Deferred<unknown>();

      this._dataController.expandRow(newRowParentKey).done(() => {
        setTimeout(() => {
          super._addRowCore(data, newRowParentKey, oldEditRowIndex)
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
            .done(deferred.resolve)
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
            .fail(deferred.reject);
        });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(deferred.reject);

      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.promise();
    }

    return super._addRowCore(data, newRowParentKey, oldEditRowIndex);
  }

  protected _initNewRow(
    options: NewRowInfo<RawItemData>,
    parentKey?: RowKey,
  ): DeferredObj<unknown> | undefined {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const parentIdSetter = dataSourceAdapter?.createParentIdSetter();

    parentIdSetter?.(options.data, parentKey);

    return super._initNewRow(options, parentKey);
  }

  private allowAdding(options: EditActionOptions): boolean {
    return this._allowEditAction('allowAdding', options);
  }

  protected _needToCloseEditableCell($targetElement: dxElementWrapper): boolean | undefined {
    return !!super._needToCloseEditableCell($targetElement)
      || (isExpandIconTarget($targetElement) && this.isEditing());
  }

  protected getButtonLocalizationNames(): Partial<Record<string, string>> {
    return {
      ...super.getButtonLocalizationNames(),
      add: 'dxTreeList-editingAddRowToNode',
    };
  }
}

const rowsView = (
  Base: ModuleType<TreeListRowsView>,
): ModuleType<
  TreeListRowsView & EditingRowsViewExtension
> => class TreeListEditingRowsViewExtender
  extends editingModule.extenders.views.rowsView(Base) {
  protected _renderCellCommandContent(
    $container: dxElementWrapper,
    options: EditorCellOptions,
  ): boolean {
    const editingController = this._editingController;
    const isEditRow = options.row && editingController.isEditRow(options.row.rowIndex);
    const isEditing = !!options.isEditing || isEditRow;

    if (!options.isOnForm && !isEditing) {
      return super._renderCellCommandContent($container, options);
    }

    return false;
  }

  public handleRowClickByEditing(e: ViewRowEvent): boolean {
    return !isExpandIconTarget($(e.event.target)) && super.handleRowClickByEditing(e);
  }

  public handleRowDblClickByEditing(e: ViewRowEvent): boolean {
    return !isExpandIconTarget($(e.event.target)) && super.handleRowDblClickByEditing(e);
  }

  protected _rowClick(e: ViewRowEvent): void {
    if (!isSelectCheckboxTarget($(e.event.target))) {
      super._rowClick(e);
    }
  }

  protected _rowDblClick(e: ViewRowEvent): void {
    if (!isSelectCheckboxTarget($(e.event.target))) {
      super._rowDblClick(e);
    }
  }
};

const data = (
  Base: ModuleType<TreeListDataController>,
): ModuleType<
  TreeListDataController & EditingDataControllerExtension
> => class TreeListEditingDataControllerExtender extends editingDataControllerExtender(Base) {
  public changeRowExpand(key: RowKey): DeferredObj<unknown> {
    this._editingController.refresh();

    return super.changeRowExpand(key);
  }
};

treeListCore.registerModule('editing', {
  defaultOptions(): TreeListEditingDefaultOptions {
    return extend(true, editingModule.defaultOptions(), {
      editing: {
        texts: {
          addRowToNode: messageLocalization.format('dxTreeList-editingAddRowToNode'),
        },
      },
    });
  },
  controllers: {
    editing: EditingController,
  },
  extenders: {
    controllers: {
      data,
    },
    views: {
      rowsView,
      headerPanel: editingModule.extenders.views.headerPanel,
    },
  },
});
