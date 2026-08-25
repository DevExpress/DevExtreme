import type { DataChange as EditingDataChange } from '@js/common/grids';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type {
  DataChange,
  GeneratedItem,
  ItemProcessingOptions,
  ProcessedItem,
  UpdateChange,
} from '@ts/grids/grid_core/data_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { EDITING_EDITROWKEY_OPTION_NAME } from '../const';
import type { EditingController } from '../m_editing';

export interface EditingDataControllerExtension {
  _editingController: EditingController;
}

export const editingDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & EditingDataControllerExtension
> => class EditingDataControllerExtender extends Base {
  public _editingController!: EditingController;

  public init(): void {
    this._editingController = this.getController('editing');
    super.init();
  }

  public reload(full?: boolean, repaintChangesOnly?: boolean): DeferredObj<unknown> {
    if (!repaintChangesOnly) {
      this._editingController.refresh();
    }

    return super.reload(full, repaintChangesOnly);
  }

  public repaintRows(
    rowIndexes: number | (number | undefined)[] | undefined,
    changesOnly?: boolean,
  ): void {
    if (this._editingController.isSaving()) {
      return;
    }

    super.repaintRows(rowIndexes, changesOnly);
  }

  private _updateEditRow(items: ProcessedItem[] | undefined): void {
    if (!items) {
      return;
    }

    const editRowKey = this.option(EDITING_EDITROWKEY_OPTION_NAME);
    const editRowIndex = gridCoreUtils.getIndexByKey(editRowKey, items);
    const editItem = items[editRowIndex];
    if (editItem) {
      editItem.isEditing = true;
      // @ts-expect-error form-based leakage
      this._updateEditItem?.(editItem);
    }
  }

  protected _updateItemsCore(change: DataChange): void {
    super._updateItemsCore(change);
    this._updateEditRow(this.items(true));
  }

  protected applyChangeUpdate(change: UpdateChange): void {
    this._updateEditRow(change.items);
    super.applyChangeUpdate(change);
  }

  protected applyChangesOnly(change: DataChange): void {
    this._updateEditRow(change.items);
    super.applyChangesOnly(change);
  }

  protected _processItems(items: RawItemData[], change: DataChange): ProcessedItem[] {
    const editingItems = this._editingController.processItems(items, change);
    return super._processItems(editingItems, change);
  }

  protected _processDataItem(
    generatedItem: GeneratedItem,
    options: ItemProcessingOptions,
  ): ProcessedItem {
    this._editingController.processDataItem(generatedItem, options);
    return super._processDataItem(generatedItem, options);
  }

  protected _processItem(dataItem: RawItemData, options: ItemProcessingOptions): ProcessedItem {
    const processedItem = super._processItem(dataItem, options);

    if (processedItem.isNewRow) {
      options.dataIndex -= 1;
      delete processedItem.dataIndex;
    }

    return processedItem;
  }

  protected _getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    if (oldItem.isNewRow !== newItem.isNewRow || oldItem.removed !== newItem.removed) {
      return undefined;
    }

    return super._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
  }

  protected _isCellChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    visibleRowIndex: number,
    columnIndex: number,
    isLiveUpdate?: boolean,
  ): boolean {
    const cell = oldRow.cells?.[columnIndex];
    const isEditing = this._editingController
      && this._editingController.isEditCell(visibleRowIndex, columnIndex);

    if (isLiveUpdate && isEditing) {
      return false;
    }

    if (cell?.column && !cell.column.showEditorAlways && cell.isEditing !== isEditing) {
      return true;
    }

    return super._isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate);
  }

  protected needToRefreshOnDataSourceChange(args?: OptionChanged): boolean {
    const value = args?.value;
    const isParasiteChange = Array.isArray(value)
      && value === args?.previousValue
      && this._editingController.isSaving();
    return !isParasiteChange;
  }

  protected _handleDataSourceChange(args: OptionChanged): boolean {
    const result = super._handleDataSourceChange(args);
    const dataSource = args.value;
    if (Array.isArray(dataSource)) {
      this._dropEditingStateForRemovedItems(dataSource);
    }
    return result;
  }

  private _dropEditingStateForRemovedItems(dataSource: RawItemData[]): void {
    const changes = this.option('editing.changes') as EditingDataChange[];
    if (!changes.length) {
      return;
    }

    const dataSourceKeys = dataSource.map((item) => this.keyOf(item));
    const survivingChanges = changes.filter(
      (change) => change.type === 'insert' || dataSourceKeys.some((key) => equalByValue(change.key, key)),
    );
    if (survivingChanges.length !== changes.length) {
      this.option('editing.changes', survivingChanges);
    }

    const editRowKey = this.option('editing.editRowKey');
    const isEditingNewRow = survivingChanges.some(
      (change) => change.type === 'insert' && equalByValue(editRowKey, change.key),
    );
    if (!isEditingNewRow && dataSourceKeys.every((key) => !equalByValue(editRowKey, key))) {
      this.option('editing.editRowKey', null);
    }
  }
};
