/* eslint-disable spellcheck/spell-checker */
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { signal } from '@ts/core/state_manager/index';
import { removeFieldConditionsFromFilter } from '@ts/filter_builder/m_utils';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

import { ColumnsController } from '../../columns_controller/index';
import type { Column } from '../../columns_controller/types';
import { getColumnIndexByName } from '../../columns_controller/utils';
import { DataController } from '../../data_controller/index';
import { OptionsController } from '../../options_controller/options_controller';
import { FilterController } from '../filter_controller';
import type { AppliedFilters } from '../types';
import { getAppliedFilterExpressions } from '../utils';
import { getDataSourceOptions, getHeaderFilterListType } from './legacy_header_filter';
import type { PopupOptions, PopupState } from './types';
import { getColumnIdentifier } from './utils';

export class HeaderFilterViewController {
  private readonly popupStateInternal = signal<PopupState>(null);

  public readonly popupState: ReadonlySignal<PopupState> = this.popupStateInternal;

  public static dependencies = [
    OptionsController,
    DataController,
    ColumnsController,
    FilterController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly dataController: DataController,
    private readonly columnsController: ColumnsController,
    private readonly filterController: FilterController,
  ) { }

  public openPopup(
    element: Element,
    column: Column,
    onFilterCloseCallback?: () => void,
    customApply?: (filterValues) => void,
    isFilterBuilder?: boolean,
  ): void {
    const rootDataSource = this.dataController.getStoreLoadAdapter();
    /*
      Note: Root headerFilter options are used because the legacy code handles retrieving
      options for specific columns on its own
    */
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').peek();
    const filterExpression = this.getFilterExpressionWithoutCurrentColumn(column);
    const type = getHeaderFilterListType(column);
    const { columnsController } = this;
    const applyFilter = (filterValues, filterType): void => {
      if (customApply) {
        customApply(filterValues);
      } else {
        columnsController.updateColumns(
          (columns) => {
            const index = getColumnIndexByName(columns, column.name);
            const newColumns = [...columns];

            newColumns[index] = {
              ...newColumns[index],
              // NOTE: Copy array because of mutations in legacy code
              filterValues: Array.isArray(filterValues)
                ? [...filterValues]
                : filterValues,
              filterType,
            };
            return newColumns;
          },
        );
      }

      onFilterCloseCallback?.();
    };
    const popupOptions: PopupOptions = {
      type,
      column: { ...column },
      isFilterBuilder,
      headerFilter: { ...column.headerFilter },
      filterType: column.filterType,
      // NOTE: Copy array because of mutations in legacy code
      filterValues: Array.isArray(column.filterValues)
        ? [...column.filterValues]
        : column.filterValues,
      apply(): void {
        applyFilter(this.filterValues, this.filterType);
      },
      hidePopupCallback: (): void => {
        this.popupStateInternal.value = null;
        onFilterCloseCallback?.();
      },
    };

    popupOptions.dataSource = getDataSourceOptions(
      rootDataSource,
      popupOptions,
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },
      filterExpression,
    );

    this.popupStateInternal.value = {
      element,
      options: popupOptions,
    };
  }

  public closePopup(): void {
    this.popupStateInternal.value = null;
  }

  private removeColumnFromFilters(
    appliedFilters: AppliedFilters,
    excludedColumn: Column,
  ): AppliedFilters {
    const columnId = getColumnIdentifier(excludedColumn);
    const filterPanel = removeFieldConditionsFromFilter(appliedFilters.filterPanel, columnId);
    const headerFilter = removeFieldConditionsFromFilter(appliedFilters.headerFilter, columnId);

    return {
      filterPanel,
      headerFilter,
      // Note: Search filter should not be handled as in the DataGrid implementation
      search: appliedFilters.search,
    };
  }

  private combineFilterExpressions(filterExpressions: unknown[]): unknown {
    if (!filterExpressions || filterExpressions.length === 0) {
      return undefined;
    }
    return gridCoreUtils.combineFilters(filterExpressions);
  }

  private getFilterExpressionWithoutCurrentColumn(column: Column): unknown {
    const appliedFilters = this.filterController.appliedFilters.peek();

    const filtersWithoutCurrentColumn = this.removeColumnFromFilters(appliedFilters, column);
    const filterableColumns = this.columnsController.filterableColumns.peek();
    const customOperations = this.filterController.customOperations.peek();
    const filterSyncEnabled = this.filterController.filterSyncEnabled.peek();

    const appliedFilterExpresssionsArray = getAppliedFilterExpressions(
      filtersWithoutCurrentColumn,
      filterableColumns,
      customOperations,
      filterSyncEnabled,
    );
    return this.combineFilterExpressions(appliedFilterExpresssionsArray);
  }
}
