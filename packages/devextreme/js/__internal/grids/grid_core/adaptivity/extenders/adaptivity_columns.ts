/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import { HIDDEN_COLUMNS_WIDTH } from '../const';
import type { AdaptiveColumnsController } from '../m_adaptivity';

export const adaptivityColumnsExtender = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class AdaptivityColumnsExtender extends Base {
  private adaptiveColumnsController!: AdaptiveColumnsController;

  public init(isApplyingUserState?: boolean): void {
    super.init(isApplyingUserState);
    this.adaptiveColumnsController = this.getController('adaptiveColumns');
  }

  protected _isColumnVisible(column) {
    return super._isColumnVisible(column) && !column.adaptiveHidden;
  }

  public getVisibleDataColumnsByBandColumn(bandColumnIndex: number) {
    return super.getVisibleDataColumnsByBandColumn(bandColumnIndex)
      .filter((column) => column.visibleWidth !== HIDDEN_COLUMNS_WIDTH);
  }

  public isAdaptiveHiddenColumn(column: Column): boolean {
    return super.isAdaptiveHiddenColumn(column)
      || this.adaptiveColumnsController.isColumnHidden(column);
  }
};
