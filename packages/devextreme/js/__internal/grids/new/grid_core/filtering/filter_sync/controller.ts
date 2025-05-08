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
import type { FilterValue } from '../types';
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

  private previousComposedHeaderFilter: FilterValue | null = null;

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
    private readonly filterController: FilterController,
    private readonly headerFilterController: HeaderFilterController,
  ) {
    // Sync from FilterPanel to HeaderFilter
    this.filterController.filterPanelValue.subscribe((filterPanelValue) => {
      if (filterPanelValue === null) {
        return;
      }

      if (!this.filterController.filterSyncEnabled.value) {
        return;
      }

      this.handleFilterPanelSync(filterPanelValue);
    });

    // Sync from HeaderFilter to FilterPanel
    this.headerFilterController.composedHeaderFilter.subscribe((headerFilter) => {
      if (this.isFirstLoad) {
        this.handleHeaderFilterFirstLoad(headerFilter);
        return;
      }

      if (this.filterController.filterSyncEnabled.value) {
        this.handleHeaderFilterSync(headerFilter);
      }

      this.previousComposedHeaderFilter = headerFilter;
    });
  }

  private handleFilterPanelSync(filterPanelValue: FilterValue | null): void {
    const sourceColumns = this.columnsController.columns.peek();

    this.columnsController.updateColumns(
      (columns) => columns.map((column) => {
        const sourceColumn = getColumnByIndexOrName(sourceColumns, column.name) as Column;

        if (!isColumnFilterable(sourceColumn)) {
          return column;
        }

        const columnId = getColumnIdentifier(column as Column);
        const filterConditions = getMatchedConditions(filterPanelValue, columnId) as FilterValue;
        const filterType = getFilterType(filterConditions);
        const filterValues = filterType ? getFilterValues(filterConditions) : undefined;

        return {
          ...column,
          filterValues,
          filterType,
        };
      }),
    );
  }

  private handleHeaderFilterFirstLoad(headerFilter: FilterValue): void {
    this.isFirstLoad = false;

    if (this.filterController.filterPanelValue.value || headerFilter.length === 0) {
      this.previousComposedHeaderFilter = headerFilter;
    }
  }

  private handleHeaderFilterSync(headerFilter: FilterValue): void {
    const comparisonOptions = { maxDepth: FILTER_OBJ_COMPARE_DEPTH, strict: true };
    const filterValue = this.filterController.filterValueOption.value;

    const areEqualByValue = equalByValue(headerFilter, filterValue, comparisonOptions);
    const areEqualByPrevious = equalByValue(
      headerFilter,
      this.previousComposedHeaderFilter,
      comparisonOptions,
    );
    const areEqualByEmpty = headerFilter.length === 0 && filterValue === null;

    if (!areEqualByValue && !areEqualByEmpty && !areEqualByPrevious) {
      this.filterController.filterValueOption.value = headerFilter;
    }
  }
}
// (!A && !B && !C) == !(A || B || C)
