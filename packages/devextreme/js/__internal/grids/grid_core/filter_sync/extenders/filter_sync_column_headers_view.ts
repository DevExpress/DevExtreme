import { filterHasField } from '@ts/filter_builder/m_utils';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';

import { getColumnIdentifier } from '../utils';
import type { FilterSyncDataControllerExtension } from './filter_sync_data_controller';

export const filterSyncColumnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class ColumnHeadersViewFilterSyncExtender extends Base {
  declare protected _dataController: DataController & FilterSyncDataControllerExtension;

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'filterValue') {
      // @ts-expect-error introduced in HeaderFilter extender
      this._updateHeaderFilterIndicators();
    } else {
      super.optionChanged(args);
    }
  }

  private _isHeaderFilterEmpty(column): boolean {
    if (this._dataController.isFilterSyncActive()) {
      return !filterHasField(this.option('filterValue'), getColumnIdentifier(column));
    }

    // @ts-expect-error introduced in HeaderFilter extender
    return super._isHeaderFilterEmpty(column) as boolean;
  }

  private _needUpdateFilterIndicators(): boolean {
    return !this._dataController.isFilterSyncActive();
  }
};
