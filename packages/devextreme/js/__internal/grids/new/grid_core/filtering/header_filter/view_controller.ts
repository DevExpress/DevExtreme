/* eslint-disable spellcheck/spell-checker */
import type { ReadonlySignal } from '@preact/signals-core';
import { signal } from '@preact/signals-core';
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
import { getDataSourceOptions, getFilterType } from './legacy_header_filter';
import type { PopupState } from './types';
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
  ): void {
    const rootDataSource = this.dataController.getStoreLoadAdapter();
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').peek();
    const filterExpression = this.getFilterExpressionWithoutCurrentColumn(column);

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.filterType,
        filterValues: column.filterValues,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },

      filterExpression,
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupStateInternal.value = {
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.filterValues)

          ? [...column.filterValues]
          : column.filterValues,
        apply(): void {
          colsController.updateColumns(
            (columns) => {
              const index = getColumnIndexByName(columns, column.name);
              const newColumns = [...columns];

              newColumns[index] = {
                ...newColumns[index],
                headerFilter: {
                  ...newColumns[index].headerFilter,
                  // NOTE: Copy array because of mutations in legacy code
                },
                filterValues: Array.isArray(this.filterValues)
                  ? [...this.filterValues]
                  : this.filterValues,
                filterType: this.filterType,
              };
              return newColumns;
            },
          );

          onFilterCloseCallback?.();
        },
        hidePopupCallback: (): void => {
          this.popupStateInternal.value = null;
          onFilterCloseCallback?.();
        },
      },
    };
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
    const allColumns = this.columnsController.columns.peek();
    const customOperations = this.filterController.customOperations.peek();

    const appliedFilterExpresssionsArray = getAppliedFilterExpressions(
      filtersWithoutCurrentColumn,
      allColumns,
      customOperations,
    );
    return this.combineFilterExpressions(appliedFilterExpresssionsArray);
  }
}
