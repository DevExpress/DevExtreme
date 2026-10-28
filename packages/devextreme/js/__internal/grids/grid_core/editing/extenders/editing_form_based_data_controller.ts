import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/types';

import { EDIT_MODE } from '../const';
import type { EditingController } from '../editing';

export const editingFormBasedDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class EditingFormBasedDataControllerExtender extends Base {
  protected _editingController!: EditingController;

  public init(): void {
    this._editingController = this.getController('editing');
    super.init();
  }

  private _updateEditItem(item: ProcessedItem): void {
    if (this._editingController.getEditMode() === EDIT_MODE.form) {
      item.rowType = 'detail';
    }
  }

  protected getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    const isFormEditMode = this._editingController.getEditMode() === EDIT_MODE.form;

    if (isLiveUpdate === false && newItem.isEditing && isFormEditMode) {
      return undefined;
    }

    return super.getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
  }
};
