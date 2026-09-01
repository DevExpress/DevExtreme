import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import {
  getFilterExpression,
  removeFieldConditionsFromFilter,
} from '@ts/filter_builder/m_utils';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataFilter } from '@ts/grids/grid_core/data_controller/types';
import { FILTER_TYPES_EXCLUDE } from '@ts/grids/grid_core/filter_sync/const';
import type { FilterSyncController } from '@ts/grids/grid_core/filter_sync/m_filter_sync';
import { getColumnIdentifier } from '@ts/grids/grid_core/filter_sync/utils';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

export interface FilterSyncDataControllerExtension {
  isFilterSyncActive: () => boolean | undefined;
}

export const filterSyncDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<
  DataController & FilterSyncDataControllerExtension
> => class FilterSyncDataControllerExtender extends Base {
  private filterSyncController!: FilterSyncController;

  public init(): void {
    this.filterSyncController = this.getController('filterSync');

    super.init();
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'filterValue':
        this.applyFilter();

        if (this.isFilterSyncActive()) {
          this.filterSyncController.syncFilterValue();
        }
        args.handled = true;
        break;
      case 'filterSyncEnabled':
        args.handled = true;
        break;
      case 'columns':
        if (this.isFilterSyncActive()) {
          const column: Column = this._columnsController.getColumnByPath(args.fullName);

          if (column && !this.filterSyncController.isSyncingColumnOptions()) {
            this.filterSyncController.withColumnOptionsSync(() => {
              this.syncColumnOption(
                column,
                this.parseColumnPropertyName(args.fullName),
                args.value,
                args.previousValue,
              );
            });
          }
        }
        super.optionChanged(args);
        break;
      default:
        super.optionChanged(args);
    }
  }

  public isFilterSyncActive(): boolean | undefined {
    const filterSyncEnabledValue = this.option('filterSyncEnabled');
    return filterSyncEnabledValue === 'auto' ? this.option('filterPanel.visible') : filterSyncEnabledValue;
  }

  private skipCalculateColumnFilters(): boolean | undefined {
    const hasFilterValueOrSyncing = isDefined(this.option('filterValue'))
      || this.filterSyncController.isSyncingColumnOptions();

    return hasFilterValueOrSyncing && this.isFilterSyncActive();
  }

  protected calculateAdditionalFilter(): DataFilter {
    const columns = this._columnsController.getFilteringColumns();
    const isFilterValueDisabled = this.option('filterPanel.filterEnabled') === false;

    if (!columns?.length || isFilterValueDisabled) {
      return super.calculateAdditionalFilter();
    }

    const filters = [super.calculateAdditionalFilter()];
    let filterValue = this.option('filterValue');

    if (this.isFilterSyncActive()) {
      const excludedColumn = this.getFilterExcludedColumn();

      if (isDefined(excludedColumn) && filterValue) {
        filterValue = removeFieldConditionsFromFilter(
          filterValue,
          getColumnIdentifier(excludedColumn),
        );
      }
    }

    const customOperations = this.filterSyncController.getCustomFilterOperations();
    const calculatedFilterValue: DataFilter = getFilterExpression(filterValue, columns, customOperations, 'filterBuilder');

    if (calculatedFilterValue) {
      filters.push(calculatedFilterValue);
    }

    return gridCoreUtils.combineFilters(filters);
  }

  private parseColumnPropertyName(fullName: string): string | null {
    const matched = /.*\.(.*)/.exec(fullName);

    if (matched) {
      return matched[1];
    }

    return null;
  }

  private syncColumnOption(
    column: Column,
    propertyName: string | null,
    // `OptionChanged` is discriminated on `name`, and its key list cannot enumerate array
    // indices, so `columns[N].<prop>` has no union member and falls back to the `columns`
    // array type. `unknown` is the honest type for the leaf value.
    value: unknown,
    previousValue: unknown,
  ): void {
    const hasExcludeFilterType = value === FILTER_TYPES_EXCLUDE
      || previousValue === FILTER_TYPES_EXCLUDE;
    const isExcludeFilterTypeToggled = propertyName === 'filterType' && hasExcludeFilterType;
    const needSyncHeaderFilter = isExcludeFilterTypeToggled || propertyName === 'filterValues';
    const needSyncFilterRow = propertyName === 'filterValue'
      || propertyName === 'selectedFilterOperation';

    if (needSyncHeaderFilter) {
      this.filterSyncController.syncHeaderFilter(column);

      return;
    }

    if (needSyncFilterRow) {
      this.filterSyncController.syncFilterRow(column, column.filterValue);
    }
  }

  protected clearFilter(filterName?: string): void {
    this.component.beginUpdate();

    if (filterName === undefined || filterName === 'filterValue') {
      this.option('filterValue', null);
    }

    super.clearFilter(filterName);

    this.component.endUpdate();
  }

  protected applyFilter(): DeferredObj<unknown> {
    if (this.filterSyncController.isSyncingColumnOptions()) {
      return Deferred().resolve();
    }

    return super.applyFilter();
  }
};
