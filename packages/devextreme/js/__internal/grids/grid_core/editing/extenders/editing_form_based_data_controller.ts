import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/types';

import type { FormBasedEditingController } from '../m_editing_form_based';

export const editingFormBasedDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class EditingFormBasedDataControllerExtender extends Base {
  protected _editingController!: FormBasedEditingController;

  public init(): void {
    this._editingController = this.getController('editing') as FormBasedEditingController;
    super.init();
  }

  private _updateEditItem(item: ProcessedItem): void {
    if (this._editingController.isFormEditMode()) {
      item.rowType = 'detail';
    }
  }

  protected getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    if (isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
      return undefined;
    }

    return super.getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
  }
};
