import { isDefined } from '@js/core/utils/type';
import type { CustomOperation } from '@js/ui/filter_builder';
import {
  addItem,
  getMatchedConditions,
  getNormalizedFilter,
} from '@ts/filter_builder/m_utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type {
  Column, ColumnUserState, FilterField,
} from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { FilterValue, FilterValueCondition } from '@ts/grids/grid_core/data_controller/types';
import modules from '@ts/grids/grid_core/m_modules';

import type {
  FilterSyncDataControllerExtension,
} from './extenders/filter_sync_data_controller';
import { anyOf, noneOf } from './m_filter_custom_operations';
import {
  checkForErrors,
  getColumnIdentifier,
  getConditionFromFilterRow,
  getConditionFromHeaderFilter,
  getFilterRowOptionsFromCondition,
  getFilterValueWithFilterRow,
  getFilterValueWithHeaderFilter,
  getHeaderFilterFromCondition,
} from './utils';

export class FilterSyncController extends modules.Controller {
  private skipSyncColumnOptions = false;

  private dataController!: DataController & FilterSyncDataControllerExtension;

  private columnsController!: ColumnsController;

  public init(): void {
    this.dataController = this.getController('data') as DataController & FilterSyncDataControllerExtension;
    this.columnsController = this.getController('columns');

    if (this.dataController.isFilterSyncActive()) {
      if (this.columnsController.isAllDataTypesDefined()) {
        this.initSync();
      } else {
        this.dataController.dataSourceChanged.add(() => this.initSync());
      }
    }
  }

  public publicMethods(): string[] {
    return ['getCustomFilterOperations'];
  }

  public isSyncingColumnOptions(): boolean {
    return this.skipSyncColumnOptions;
  }

  public withColumnOptionsSync<T>(sync: () => T): T {
    this.skipSyncColumnOptions = true;
    try {
      return sync();
    } finally {
      this.skipSyncColumnOptions = false;
    }
  }

  public syncFilterValue(): void {
    const columns = this.columnsController.getFilteringColumns();

    this.withColumnOptionsSync(() => {
      columns.forEach((column) => {
        const filterConditions = getMatchedConditions(
          this.option('filterValue'),
          getColumnIdentifier(column),
        ) as FilterValueCondition[];

        if (filterConditions.length === 1) {
          const filterCondition = filterConditions[0];

          this.updateHeaderFilterCondition(column, filterCondition);
          this.updateFilterRowCondition(column, filterCondition);
        } else {
          if (isDefined(column.filterValues)) {
            this.updateHeaderFilterCondition(column, null);
          }

          if (isDefined(column.filterValue)) {
            this.updateFilterRowCondition(column, null);
          }
        }
      });
    });
  }

  private updateHeaderFilterCondition(
    column: FilterField,
    headerFilterCondition: FilterValueCondition | null,
  ): void {
    const headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);

    this.columnsController.columnOption(getColumnIdentifier(column), headerFilter);
  }

  private updateFilterRowCondition(
    column: FilterField,
    condition: FilterValueCondition | null,
  ): void {
    const filterRowOptions = getFilterRowOptionsFromCondition(condition, column);

    this.columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
  }

  private initSync(): void {
    const columns = this.columnsController.getColumns();
    const pageIndex = this.dataController.pageIndex();

    checkForErrors(columns);

    if (!this.option('filterValue')) {
      const filteringColumns = this.columnsController.getFilteringColumns();
      const filterValue = this.getFilterValueFromColumns(filteringColumns);
      this._silentOption('filterValue', filterValue);
    }

    this.syncFilterValue();

    this.dataController.pageIndex(pageIndex);
  }

  public getFilterValueFromColumns(
    columns: ColumnUserState[] | undefined,
  ): FilterValue {
    if (!this.dataController.isFilterSyncActive()) {
      return null;
    }

    const filterValue = ['and'];

    columns?.forEach((column) => {
      const headerFilter = getConditionFromHeaderFilter(column);
      if (headerFilter) {
        addItem(headerFilter, filterValue);
      }

      const filterRow = getConditionFromFilterRow(column);
      if (filterRow) {
        addItem(filterRow, filterValue);
      }
    });

    return getNormalizedFilter(filterValue) as FilterValue;
  }

  public syncFilterRow(column: Column): void {
    const syncedFilterValue = getFilterValueWithFilterRow(this.option('filterValue'), column);

    this.option('filterValue', syncedFilterValue);
  }

  public syncHeaderFilter(column: Column): void {
    const syncedFilterValue = getFilterValueWithHeaderFilter(this.option('filterValue'), column);

    this.option('filterValue', syncedFilterValue);
  }

  // Override in the private API WA [T1232532]
  public getCustomFilterOperations(): CustomOperation[] {
    const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') ?? [];

    return [
      anyOf(this.component),
      noneOf(this.component),
      ...filterBuilderCustomOperations,
    ];
  }
}
