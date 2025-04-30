// import type { ReadonlySignal } from '@preact/signals-core';
// import { computed } from '@preact/signals-core';
import { equalByValue } from '@js/core/utils/common';
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

const FILTER_OBJ_COMPARE_DEPTH = 6;

export class FilterSyncController {
  private readonly filterSyncEnabledOption = this.options.oneWay('filterSyncEnabled');

  public static dependencies = [
    OptionsController,
    ColumnsController,
    FilterController,
    HeaderFilterController,
  ] as const;

  private isFirstLoad = true;

  private previousComposedHeaderFilter: unknown[] | null = null;

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
      if (filter === undefined) {
        return;
      }
      if (!this.filterSyncEnabled.value) {
        return;
      }

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
          let filterValues: any[] | undefined;
          if (filterType) {
            filterValues = getFilterValues(filterConditions);
          }

          return {
            ...col,
            filterValues,
            filterType,
          };
        }),
      );
    });

    // Sync from HeaderFilter to FilterPanel
    this.headerFilterController.composedHeaderFilter.subscribe((filter) => {
      if (this.isFirstLoad) {
        this.isFirstLoad = false;
        if (this.filterController.filterPanelValue.value || filter.length === 0) {
          this.previousComposedHeaderFilter = filter;
          return;
        }
      }
      if (!this.filterSyncEnabled.value) {
        this.previousComposedHeaderFilter = filter;
        return;
      }
      const areEqualByValue = equalByValue(
        filter,
        this.filterController.filterValueOption.value,
        {
          maxDepth: FILTER_OBJ_COMPARE_DEPTH,
          strict: true,
        },
      );
      const areEqualByPrevious = equalByValue(
        filter,
        this.previousComposedHeaderFilter,
        {
          maxDepth: FILTER_OBJ_COMPARE_DEPTH,
          strict: true,
        },
      );
      const areEqualByEmpty = filter.length === 0
      && this.filterController.filterValueOption.value === null;

      if (!areEqualByValue && !areEqualByEmpty && !areEqualByPrevious) {
        this.filterController.filterValueOption.value = filter;
      }

      this.previousComposedHeaderFilter = filter;
    });
  }
}
