import { isDefined } from '@js/core/utils/type';
import type { CustomOperation } from '@js/ui/filter_builder';
import filterUtils from '@js/ui/shared/filtering';
import errors from '@js/ui/widget/ui.errors';
import {
  addItem,
  getDefaultOperation,
  getMatchedConditions,
  getNormalizedFilter,
  removeFieldConditionsFromFilter,
  syncFilters,
} from '@ts/filter_builder/m_utils';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { ColumnUserState } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { FilterValue } from '@ts/grids/grid_core/data_controller/types';
import {
  FILTER_ROW_OPERATIONS,
  FILTER_TYPES_EXCLUDE,
  FILTER_TYPES_INCLUDE,
} from '@ts/grids/grid_core/filter_sync/const';
import type {
  FilterSyncDataControllerExtension,
} from '@ts/grids/grid_core/filter_sync/extenders/filter_sync_data_controller';
import { getColumnIdentifier } from '@ts/grids/grid_core/filter_sync/utils';
import modules from '@ts/grids/grid_core/m_modules';

import { anyOf, noneOf } from './m_filter_custom_operations';

function checkForErrors(columns) {
  columns.forEach((column) => {
    const identifier = getColumnIdentifier(column);
    // @ts-expect-error
    if (!isDefined(identifier) && column.allowFiltering) throw new errors.Error('E1049', column.caption);
  });
}

const getEmptyFilterValues = function () {
  return {
    filterType: FILTER_TYPES_INCLUDE,
    filterValues: undefined,
  };
};

const canSyncHeaderFilterWithFilterRow = function (column) {
  const filterValues = column.filterValues || [];
  return (!filterUtils.getGroupInterval(column) && !(column.headerFilter && column.headerFilter.dataSource))
      || (filterValues.length === 1 && filterValues[0] === null);
};

const getHeaderFilterFromCondition = function (headerFilterCondition, column) {
  if (!headerFilterCondition) {
    return getEmptyFilterValues();
  }

  let filterType;
  const selectedFilterOperation = headerFilterCondition[1];
  const value = headerFilterCondition[2];
  const hasArrayValue = Array.isArray(value);

  if (!hasArrayValue) {
    if (!canSyncHeaderFilterWithFilterRow(column)) {
      return getEmptyFilterValues();
    }
  }

  switch (selectedFilterOperation) {
    case 'anyof':
    case '=':
      filterType = FILTER_TYPES_INCLUDE;
      break;
    case 'noneof':
    case '<>':
      filterType = FILTER_TYPES_EXCLUDE;
      break;
    default: return getEmptyFilterValues();
  }

  return {
    filterType,
    filterValues: hasArrayValue ? value : [value],
  };
};

const getConditionFromFilterRow = function (column) {
  const value = column.filterValue;
  if (isDefined(value)) {
    const operation = column.selectedFilterOperation || column.defaultFilterOperation || getDefaultOperation(column);
    const filter = [getColumnIdentifier(column), operation, column.filterValue];
    return filter;
  }
  return null;
};

const getConditionFromHeaderFilter = function (column) {
  let selectedOperation;
  let value;
  const { filterValues } = column;

  if (!filterValues) return null;

  if (filterValues.length === 1 && (
    canSyncHeaderFilterWithFilterRow(column)
          && !Array.isArray(filterValues[0])
  )) {
    selectedOperation = column.filterType === FILTER_TYPES_EXCLUDE ? '<>' : '=';
    // eslint-disable-next-line prefer-destructuring
    value = filterValues[0];
  } else {
    selectedOperation = column.filterType === FILTER_TYPES_EXCLUDE ? 'noneof' : 'anyof';
    value = filterValues;
  }
  return [getColumnIdentifier(column), selectedOperation, value];
};

const updateHeaderFilterCondition = function (columnsController, column, headerFilterCondition) {
  const headerFilter = getHeaderFilterFromCondition(headerFilterCondition, column);
  columnsController.columnOption(getColumnIdentifier(column), headerFilter);
};

const updateFilterRowCondition = function (columnsController, column, condition) {
  let filterRowOptions;
  let selectedFilterOperation = condition?.[1];
  const filterValue = condition?.[2];
  const filterOperations = column.filterOperations || column.defaultFilterOperations;

  const selectedOperationExists = !filterOperations || filterOperations.includes(selectedFilterOperation);
  const defaultOperationSelected = selectedFilterOperation === column.defaultFilterOperation;
  const builtInOperationSelected = FILTER_ROW_OPERATIONS.includes(selectedFilterOperation);
  const filterValueNotNullOrEmpty = filterValue !== null && filterValue !== '';

  if ((selectedOperationExists || defaultOperationSelected) && builtInOperationSelected && filterValueNotNullOrEmpty) {
    if (defaultOperationSelected && !isDefined(column.selectedFilterOperation)) {
      selectedFilterOperation = column.selectedFilterOperation;
    }
    filterRowOptions = {
      filterValue,
      selectedFilterOperation,
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    };
  } else {
    filterRowOptions = {
      filterValue: undefined,
      selectedFilterOperation: undefined,
      bufferedFilterValue: undefined,
      bufferedSelectedFilterOperation: undefined,
    };
  }
  columnsController.columnOption(getColumnIdentifier(column), filterRowOptions);
};

export class FilterSyncController extends modules.Controller {
  private skipSyncColumnOptions = false;

  private _dataController!: DataController & FilterSyncDataControllerExtension;

  private _columnsController!: ColumnsController;

  public init(): void {
    this._dataController = this.getController('data') as DataController & FilterSyncDataControllerExtension;
    this._columnsController = this.getController('columns');

    if (this._dataController.isFilterSyncActive()) {
      if (this._columnsController.isAllDataTypesDefined()) {
        this.initSync();
      } else {
        this._dataController.dataSourceChanged.add(() => this.initSync());
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
    const columns = this._columnsController.getFilteringColumns();

    this.withColumnOptionsSync(() => {
      columns.forEach((column) => {
        const filterConditions = getMatchedConditions(this.option('filterValue'), getColumnIdentifier(column));
        if (filterConditions.length === 1) {
          const filterCondition = filterConditions[0];
          updateHeaderFilterCondition(this._columnsController, column, filterCondition);
          updateFilterRowCondition(this._columnsController, column, filterCondition);
        } else {
          isDefined(column.filterValues) && updateHeaderFilterCondition(this._columnsController, column, null);
          isDefined(column.filterValue) && updateFilterRowCondition(this._columnsController, column, null);
        }
      });
    });
  }

  private initSync(): void {
    const columns = this._columnsController.getColumns();
    const pageIndex = this._dataController.pageIndex();

    checkForErrors(columns);

    if (!this.option('filterValue')) {
      const filteringColumns = this._columnsController.getFilteringColumns();
      const filterValue = this.getFilterValueFromColumns(filteringColumns);
      this._silentOption('filterValue', filterValue);
    }

    this.syncFilterValue();

    this._dataController.pageIndex(pageIndex);
  }

  private _getSyncFilterRow(filterValue, column) {
    const filter = getConditionFromFilterRow(column);
    if (isDefined(filter)) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }

  private _getSyncHeaderFilter(filterValue, column) {
    const filter = getConditionFromHeaderFilter(column);
    if (filter) {
      return syncFilters(filterValue, filter);
    }
    return removeFieldConditionsFromFilter(filterValue, getColumnIdentifier(column));
  }

  public getFilterValueFromColumns(
    columns: ColumnUserState[] | undefined,
  ): FilterValue {
    if (!this._dataController.isFilterSyncActive()) {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public syncFilterRow(column, filterValue?): void {
    this.option('filterValue', this._getSyncFilterRow(this.option('filterValue'), column));
  }

  public syncHeaderFilter(column): void {
    this.option('filterValue', this._getSyncHeaderFilter(this.option('filterValue'), column));
  }

  // Override in the private API WA [T1232532]
  public getCustomFilterOperations(): CustomOperation[] {
    const filterBuilderCustomOperations = this.option('filterBuilder.customOperations') ?? [];

    return [anyOf(this.component), noneOf(this.component)].concat(filterBuilderCustomOperations) as CustomOperation[];
  }
}
