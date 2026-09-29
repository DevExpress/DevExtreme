import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { FilterSyncController } from '@ts/grids/grid_core/filter_sync/m_filter_sync';
import type { ModuleType, OptionChanged } from '@ts/grids/grid_core/m_types';

export const filterSyncDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class FilterSyncDataControllerExtender extends Base {
  private filterSyncController!: FilterSyncController;

  public init(): void {
    this.filterSyncController = this.getController('filterSync');

    super.init();
  }

  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'filterValue':
        this.applyFilter();

        if (this.filterController.isFilterSyncActive()) {
          this.filterSyncController.syncFilterValue();
        }
        args.handled = true;
        break;
      case 'filterSyncEnabled':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
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
