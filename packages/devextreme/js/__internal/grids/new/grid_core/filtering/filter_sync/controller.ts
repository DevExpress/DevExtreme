// import type { ReadonlySignal } from '@preact/signals-core';
// import { computed } from '@preact/signals-core';
import { computed } from '@preact/signals-core';
import { getMatchedConditions } from '@ts/filter_builder/m_utils';

import { ColumnsController } from '../../columns_controller';
import type { Column } from '../../columns_controller/types';
import { getColumnByIndexOrName } from '../../columns_controller/utils';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '..';
import { HeaderFilterController } from '../header_filter/index';
import { getColumnIdentifier, isColumnFilterable } from '../header_filter/utils';
import {
  getFilterType,
  getFilterValues,
} from './utils';

export class FilterSyncController {
  private readonly filterSyncEnabledOption = this.options.oneWay('filterSyncEnabled');

  public static dependencies = [
    OptionsController,
    ColumnsController,
    FilterController,
    HeaderFilterController,
  ] as const;

  private syncLockFromFilterPanel = 0;

  private syncLockFromHeaderFilter = 0;

  private isFirstLoad = true;

  public readonly filterSyncEnabled = computed(
    () => {
      if (this.filterSyncEnabledOption.value === 'auto') {
        return !!this.filterController.filterPanelVisible.value;
      }
      return !!this.filterSyncEnabledOption.value;
    },
  );

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly filterController: FilterController,
    private readonly headerFilterController: HeaderFilterController,
  ) {
    // Sync from FilterPanel to HeaderFilter
    this.filterController.filterPanelValue.subscribe((filter) => {
      if (!this.filterSyncEnabled.value) {
        return;
      }
      if (this.isHeaderFilterLock()) {
        return;
      }
      this.lockFromFilterPanel();

      const sourceColumns = this.columnsController.columns.peek();

      this.columnsController.updateColumns(
        (columns) => columns.map((col) => {
          const sourceColumn = getColumnByIndexOrName(sourceColumns, col.name) as Column;
          if (!isColumnFilterable(sourceColumn)) {
            return col;
          }

          const filterConditions = getMatchedConditions(filter, getColumnIdentifier(col as Column));
          const filterType = getFilterType(filterConditions);
          // eslint-disable-next-line @stylistic/max-len
          // eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
          let values: any[] | undefined;
          if (filterType) {
            values = getFilterValues(filterConditions);
          }

          return {
            ...col,
            headerFilter: {
              ...col.headerFilter,
              values,
            },
            filterType,
          };
        }),
      );

      this.unlockFromFilterPanel();
    });

    // Sync from HeaderFilter to FilterPanel
    this.headerFilterController.composedHeaderFilter.subscribe((/* filter */) => {
      if (!this.filterSyncEnabled.value) {
        return;
      }
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        return;
      }
      if (this.isFilterPanelLock()) {
        return;
      }
      this.lockFromHeaderFilter();

      // TODO: sync
      this.unlockFromHeaderFilter();
    });
  }

  private readonly isFilterPanelLock = (): boolean => this.syncLockFromFilterPanel > 0;

  private readonly isHeaderFilterLock = (): boolean => this.syncLockFromHeaderFilter > 0;

  private readonly lockFromFilterPanel = (): void => { this.syncLockFromFilterPanel += 1; };

  private readonly lockFromHeaderFilter = (): void => { this.syncLockFromHeaderFilter += 1; };

  private readonly unlockFromFilterPanel = (): void => { this.syncLockFromFilterPanel -= 1; };

  private readonly unlockFromHeaderFilter = (): void => { this.syncLockFromHeaderFilter -= 1; };
}
