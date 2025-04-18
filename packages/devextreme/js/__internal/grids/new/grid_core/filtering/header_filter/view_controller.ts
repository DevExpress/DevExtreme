/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { state } from '@ts/core/reactive/index';
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
  private readonly popupStateInternal = state<PopupState>(null);

  public readonly popupState: SubsGets<PopupState> = this.popupStateInternal;

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
    const rootHeaderFilterOptions = this.options.oneWay('headerFilter').unreactive_get();
    const filterExpression = this.getFilterExpressionWithoutCurrentColumn(column);

    const filterDataSourceOptions = getDataSourceOptions(
      rootDataSource,
      {
        ...column,
        filterType: column.filterType,
        filterValues: column.headerFilter?.values,
      },
      // NOTE: Only text used from root options
      {
        texts: rootHeaderFilterOptions.texts,
      },

      filterExpression,
    );

    const type = getFilterType(column);
    const colsController = this.columnsController;

    this.popupStateInternal.update({
      element,
      options: {
        type,
        headerFilter: { ...column.headerFilter },
        dataSource: filterDataSourceOptions,
        filterType: column.filterType,
        // NOTE: Copy array because of mutations in legacy code
        filterValues: Array.isArray(column.headerFilter?.values)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ? [...column.headerFilter!.values]
          : column.headerFilter?.values,
        apply() {
          colsController.updateColumns(
            (columns) => {
              const index = getColumnIndexByName(columns, column.name);
              const newColumns = [...columns];

              newColumns[index] = {
                ...newColumns[index],
                headerFilter: {
                  ...newColumns[index].headerFilter,
                  // NOTE: Copy array because of mutations in legacy code
                  values: Array.isArray(this.filterValues)
                    ? [...this.filterValues]
                    : this.filterValues,
                },
                filterType: this.filterType,
              };
              return newColumns;
            },
          );

          onFilterCloseCallback?.();
        },
        hidePopupCallback: () => {
          this.popupStateInternal.update(null);
          onFilterCloseCallback?.();
        },
      },
    });
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
    const appliedFilters = this.filterController.appliedFilters.unreactive_get();

    const filtersWithoutCurrentColumn = this.removeColumnFromFilters(appliedFilters, column);
    const allColumns = this.columnsController.columns.unreactive_get();
    const customOperations = this.filterController.customOperations.unreactive_get();

    const appliedFilterExpresssionsArray = getAppliedFilterExpressions(
      filtersWithoutCurrentColumn,
      allColumns,
      customOperations,
    );
    return this.combineFilterExpressions(appliedFilterExpresssionsArray);
  }
}
