import { isDefined } from '@js/core/utils/type';
import {
  getFilterExpression,
  removeFieldConditionsFromFilter,
} from '@ts/filter_builder/m_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import type { FilterController } from '@ts/grids/grid_core/filter/filter_controller';
import type { FilterSyncController } from '@ts/grids/grid_core/filter_sync/m_filter_sync';
import { getColumnIdentifier, isFilterSyncActive } from '@ts/grids/grid_core/filter_sync/utils';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

export const filterSyncFilterControllerExtender = (
  Base: ModuleType<FilterController>,
): ModuleType<FilterController> => class FilterControllerFilterSyncExtender extends Base {
  private filterSyncController!: FilterSyncController;

  public init(): void {
    this.filterSyncController = this.getController('filterSync');

    super.init();
  }

  private skipCalculateColumnFilters(): boolean | undefined {
    const hasFilterValueOrSyncing = isDefined(this.option('filterValue'))
      || this.filterSyncController.isSyncingColumnOptions();

    return hasFilterValueOrSyncing && isFilterSyncActive(this);
  }

  public getAdditionalFilter(excludedColumn?: Column | null): DataFilter {
    const columns = this.columnsController.getFilteringColumns();
    const isFilterValueDisabled = this.option('filterPanel.filterEnabled') === false;

    if (!columns?.length || isFilterValueDisabled) {
      return super.getAdditionalFilter(excludedColumn);
    }

    const filters = [super.getAdditionalFilter(excludedColumn)];
    let filterValue = this.option('filterValue');

    if (isFilterSyncActive(this) && isDefined(excludedColumn) && filterValue) {
      filterValue = removeFieldConditionsFromFilter(
        filterValue,
        getColumnIdentifier(excludedColumn),
      );
    }

    const customOperations = this.filterSyncController.getCustomFilterOperations();
    const calculatedFilterValue: DataFilter = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');

    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }

    return gridCoreUtils.combineFilters(filters);
  }
};
