import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { StateStoringController } from '../state_storing_controller_core';

export const stateStoringColumnsControllerExtender = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class StateStoringColumnsExtender extends Base {
  private stateStoringController!: StateStoringController;

  public init(isApplyingUserState?: boolean): void {
    this.stateStoringController = this.getController('stateStoring');

    super.init(isApplyingUserState);
  }

  private isWaitingForState(): boolean {
    return this.stateStoringController.isEnabled() && !this.stateStoringController.isLoaded();
  }

  protected _shouldReturnVisibleColumns(): boolean {
    return super._shouldReturnVisibleColumns() && !this.isWaitingForState();
  }
};
