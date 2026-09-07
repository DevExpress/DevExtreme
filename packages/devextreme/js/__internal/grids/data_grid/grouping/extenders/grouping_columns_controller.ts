import gridCore from '@ts/grids/data_grid/m_core';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

export const groupingColumnsControllerExtender = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class GroupingColumnsExtender extends Base {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public _getExpandColumnOptions() {
    const options = super._getExpandColumnOptions();

    // @ts-expect-error
    options.cellTemplate = gridCore.getExpandCellTemplate();

    return options;
  }
};
