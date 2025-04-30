// import type { ReadonlySignal } from '@preact/signals-core';
// import { computed } from '@preact/signals-core';
import { equalByValue } from '@js/core/utils/common';
import { getMatchedConditions } from '@ts/filter_builder/m_utils';

import { ColumnsController } from '../../columns_controller/index';
import type { Column } from '../../columns_controller/types';
import { getColumnByIndexOrName } from '../../columns_controller/utils';
import { OptionsController } from '../../options_controller/options_controller';
import { HeaderFilterController } from '../header_filter/index';
import { getColumnIdentifier, isColumnFilterable } from '../header_filter/utils';
import { FilterController } from '../index';
import {
  getFilterType,
  getFilterValues,
} from './utils';

const FILTER_OBJ_COMPARE_DEPTH = 6;

export class FilterSyncController {
  public static dependencies = [
    OptionsController,
    ColumnsController,
    FilterController,
    HeaderFilterController,
  ] as const;

  private isFirstLoad = true;

  private previousComposedHeaderFilter: unknown[] | null = null;

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
      if (!this.filterController.filterSyncEnabled.value) {
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
      if (!this.filterController.filterSyncEnabled.value) {
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
