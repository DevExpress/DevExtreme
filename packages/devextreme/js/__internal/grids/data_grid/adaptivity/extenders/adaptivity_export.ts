import type { ExportController } from '@ts/grids/data_grid/export/m_export';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import { HIDDEN_COLUMNS_WIDTH } from '../../../grid_core/adaptivity/const';

export const adaptivityExportExtender = (
  Base: ModuleType<ExportController>,
): ModuleType<ExportController> => class AdaptivityExportExtender extends Base {
  protected _updateColumnWidth(column, width): void {
    super._updateColumnWidth(
      column,
      column.visibleWidth === HIDDEN_COLUMNS_WIDTH ? column.bestFitWidth : width,
    );
  }
};
