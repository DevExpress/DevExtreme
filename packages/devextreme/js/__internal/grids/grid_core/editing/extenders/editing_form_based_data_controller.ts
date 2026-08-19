import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { EditingController } from '../m_editing';

export const dataControllerEditingFormBasedExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class DataEditingFormBasedExtender extends Base {
  protected _editingController!: EditingController;

  public init(): void {
    this._editingController = this.getController('editing');
    super.init();
  }

  private _updateEditItem(item: ProcessedItem): void {
    // @ts-expect-error isFormEditMode is private on the editing controller
    if (this._editingController.isFormEditMode()) {
      item.rowType = 'detail';
    }
  }

  protected _getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    // @ts-expect-error isFormEditMode is private on the editing controller
    if (isLiveUpdate === false && newItem.isEditing && this._editingController.isFormEditMode()) {
      return undefined;
    }

    return super._getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
  }
};
