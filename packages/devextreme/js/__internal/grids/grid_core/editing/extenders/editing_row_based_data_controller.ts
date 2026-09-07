import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { EditingController } from '../m_editing';

export const editingRowBasedDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class EditingRowBasedDataControllerExtender extends Base {
  protected _editingController!: EditingController;

  public init(): void {
    this._editingController = this.getController('editing');
    super.init();
  }

  protected getChangedColumnIndices(
    oldItem: ProcessedItem,
    newItem: ProcessedItem,
    visibleRowIndex: number,
    isLiveUpdate?: boolean,
  ): number[] | undefined {
    if (this._editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
      return undefined;
    }

    return super.getChangedColumnIndices(oldItem, newItem, visibleRowIndex, isLiveUpdate);
  }
};
