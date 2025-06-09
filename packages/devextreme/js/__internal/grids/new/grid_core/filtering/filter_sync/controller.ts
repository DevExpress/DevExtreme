// import type { ReadonlySignal } from '@preact/signals-core';
// import { computed } from '@preact/signals-core';
import { equalByValue } from '@js/core/utils/common';
import { batch } from '@preact/signals-core';
import { getMatchedConditions } from '@ts/filter_builder/m_utils';
import { SearchController } from '@ts/grids/new/grid_core/search/index';

import { ColumnsController } from '../../columns_controller/index';
import type { Column } from '../../columns_controller/types';
import { getColumnByIndexOrName } from '../../columns_controller/utils';
import { HeaderFilterController } from '../header_filter/index';
import { getColumnIdentifier, isColumnFilterable } from '../header_filter/utils';
import { FilterController } from '../index';
import type { FilterValue } from '../types';
import {
  getFilterType,
  getFilterValues,
  mergeFilterPanelWithHeaderFilterValues,
} from './utils';

const FILTER_DEEP_COMPARISON_OPTS = { maxDepth: 6, strict: true };

export class FilterSyncController {
  public static dependencies = [
    ColumnsController,
    FilterController,
    HeaderFilterController,
    SearchController,
  ] as const;

  private previousFilterPanelValue: FilterValue | null = null;

  private previousComposedHeaderFilterValue: FilterValue | null = null;

  // 🚨🚨🚨 This controller was hotfixed during severe issues in filterSync feature.
  // Change logic in ctor very carefully, the order of conditions is important.
  // Here we sync two states "filterValue" and "column[].filterValues"
  // TODO filterSync: refactor filters and get rid of this hotfix states sync logic
  constructor(
    private readonly columnsController: ColumnsController,
    private readonly filterController: FilterController,
    private readonly headerFilterController: HeaderFilterController,
    private readonly searchController: SearchController,
  ) {
    // --- FilterPanel -> HeaderFilter ---
    this.filterController.filterPanelValue.subscribe((filterPanelValue) => {
      // NOTE: Handle first load with empty FilterPanel value
      if (this.previousFilterPanelValue === null && filterPanelValue === null) {
        return;
      }

      this.previousFilterPanelValue = filterPanelValue;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If FilterPanel value is empty -> clear HeaderFilter values
      if (filterPanelValue === null) {
        this.headerFilterController.clearHeaderFilters();
        return;
      }

      // NOTE: If HeaderFilter is empty and FilterPanel isn't
      // sync FilterPanel -> HeaderFilter
      const composedHeaderFilter = this.headerFilterController.composedHeaderFilter.peek();
      if (!composedHeaderFilter.length) {
        this.handleFilterPanelSync(filterPanelValue);
        return;
      }

      // NOTE: If merged from HeaderFilter values equals current FilterPanel values
      // do nothing
      const newFilterPanelValue = mergeFilterPanelWithHeaderFilterValues(
        filterPanelValue ?? [],
        composedHeaderFilter,
      );
      if (equalByValue(
        filterPanelValue ?? [],
        newFilterPanelValue,
        FILTER_DEEP_COMPARISON_OPTS,
      )) {
        return;
      }

      // NOTE: If all conditions above passed sync FilterPanel -> HeaderFilter values
      this.handleFilterPanelSync(filterPanelValue);
    });

    // --- HeaderFilter -> FilterPanel ---
    this.headerFilterController.composedHeaderFilter.subscribe((composedHeaderFilter) => {
      // NOTE: Handle first load with empty HeaderFilter values
      if (!this.previousComposedHeaderFilterValue?.length && !composedHeaderFilter.length) {
        return;
      }

      this.previousComposedHeaderFilterValue = composedHeaderFilter;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If HeaderFilter values is empty & filter panel disabled -> clear FilterPanel value
      const filterPanelEnabled = this.filterController.filterPanelFilterEnabled.value;
      if (!composedHeaderFilter.length && filterPanelEnabled) {
        this.filterController.filterValueOption.value = null;
        return;
      }

      // NOTE: If merged from HeaderFilter values equals current FilterPanel values
      // do nothing
      const filterPanelValue = this.filterController.filterPanelValue.peek() ?? [];
      const newFilterPanelValue = mergeFilterPanelWithHeaderFilterValues(
        filterPanelValue,
        composedHeaderFilter,
      );
      if (equalByValue(filterPanelValue, newFilterPanelValue, FILTER_DEEP_COMPARISON_OPTS)) {
        return;
      }

      // NOTE: If all conditions above passed sync HeaderFilter -> FilterPanel values
      this.handleHeaderFilterSync(newFilterPanelValue);
    });
  }

  public clearFilters(): void {
    batch(() => {
      this.searchController.searchTextOption.value = '';
      this.filterController.filterValueOption.value = null;
      this.headerFilterController.clearHeaderFilters();
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

  private handleHeaderFilterSync(headerFilter: FilterValue): void {
    // NOTE: If we update filters from HeaderFilter side
    // For better UX the filter panel will be enabled
    batch(() => {
      this.filterController.filterValueOption.value = headerFilter.length === 0
        ? null
        : headerFilter;
      this.filterController.filterPanelFilterEnabled.value = true;
    });
  }
}
