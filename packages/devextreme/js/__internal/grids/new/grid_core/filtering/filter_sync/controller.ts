// import type { ReadonlySignal } from '@ts/core/state_manager/index';
// import { computed } from '@ts/core/state_manager/index';
import { equalByValue } from '@js/core/utils/common';
import { batch, effect } from '@ts/core/state_manager/index';
import { getMatchedConditions } from '@ts/filter_builder/m_utils';
import type { HeaderFilterInfo } from '@ts/grids/new/grid_core/filtering/header_filter/types';
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

  private previousFilterPanelEnabled: boolean = this.filterController
    .filterPanelFilterEnabled
    .peek();

  private previousHeaderFilterInfoArray: HeaderFilterInfo[] = [];

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
    effect(() => {
      const filterPanelValue = this.filterController.filterValueOption.value;
      const isFilterPanelEnabled = this.filterController.filterPanelFilterEnabled.value;

      if (equalByValue(
        this.previousFilterPanelValue,
        filterPanelValue,
        FILTER_DEEP_COMPARISON_OPTS,
      ) && this.previousFilterPanelEnabled === isFilterPanelEnabled) {
        return;
      }

      this.previousFilterPanelValue = filterPanelValue;
      this.previousFilterPanelEnabled = isFilterPanelEnabled;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If FilterPanel value is empty or disabled -> clear HeaderFilter values
      if (!isFilterPanelEnabled || filterPanelValue === null) {
        this.headerFilterController.clearHeaderFilters();
        this.previousHeaderFilterInfoArray = this.headerFilterController
          .headerFilterInfoArray
          .peek();
        return;
      }

      // NOTE: If all conditions above passed sync FilterPanel -> HeaderFilter values
      this.handleFilterPanelSync(filterPanelValue);
      this.previousHeaderFilterInfoArray = this.headerFilterController
        .headerFilterInfoArray
        .peek();
    });

    // --- HeaderFilter -> FilterPanel ---
    effect(() => {
      const headerFilterInfoArray = this.headerFilterController.headerFilterInfoArray.value;

      if (equalByValue(
        this.previousHeaderFilterInfoArray,
        headerFilterInfoArray,
        FILTER_DEEP_COMPARISON_OPTS,
      )) {
        return;
      }

      this.previousHeaderFilterInfoArray = headerFilterInfoArray;

      // NOTE: If filterSync is disabled -> do nothing
      const isSyncEnabled = this.filterController.filterSyncEnabled.peek();
      if (!isSyncEnabled) {
        return;
      }

      // NOTE: If merged from HeaderFilter values equals current FilterPanel values
      // do nothing
      const filterPanelValue = this.filterController.filterPanelValue.peek() ?? [];
      const newFilterPanelValue = mergeFilterPanelWithHeaderFilterValues(
        filterPanelValue,
        headerFilterInfoArray,
      );
      if (equalByValue(filterPanelValue, newFilterPanelValue, FILTER_DEEP_COMPARISON_OPTS)) {
        return;
      }

      // NOTE: If all conditions above passed sync HeaderFilter -> FilterPanel values
      this.handleHeaderFilterSync(newFilterPanelValue);
      this.previousFilterPanelValue = newFilterPanelValue;
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
          filterType,
          filterValues,
        };
      }),
    );
  }

  private handleHeaderFilterSync(newFilterPanelValue: FilterValue): void {
    const normalizedValue = !newFilterPanelValue?.length
      ? null
      : newFilterPanelValue;

    // NOTE: If we update filters from HeaderFilter side
    // For better UX the filter panel will be enabled
    batch(() => {
      this.filterController.filterValueOption.value = normalizedValue;
      this.filterController.filterPanelFilterEnabled.value = true;
    });
  }
}
