import { filterHasField } from '@ts/filter_builder/m_utils';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { FilterController } from '@ts/grids/grid_core/filter/filter_controller';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';

import { getColumnIdentifier } from '../utils';

export const filterSyncColumnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class ColumnHeadersViewFilterSyncExtender extends Base {
  private filterController!: FilterController;

  public init(): void {
    this.filterController = this.getController('filter');

    super.init();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'filterValue') {
      // @ts-expect-error introduced in HeaderFilter extender
      this._updateHeaderFilterIndicators();
    } else {
      super.optionChanged(args);
    }
  }

  private _isHeaderFilterEmpty(column): boolean {
    if (this.filterController.isFilterSyncActive()) {
      return !filterHasField(this.option('filterValue'), getColumnIdentifier(column));
    }

    // @ts-expect-error introduced in HeaderFilter extender
    return super._isHeaderFilterEmpty(column) as boolean;
  }

  private _needUpdateFilterIndicators(): boolean {
    return !this.filterController.isFilterSyncActive();
  }
};
