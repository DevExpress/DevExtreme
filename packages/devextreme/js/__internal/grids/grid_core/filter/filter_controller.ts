import type { LangParams } from '@js/common/data';
import config from '@js/core/config';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction, isString } from '@js/core/utils/type';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { DataFilter } from '@ts/grids/grid_core/filter/types';
import modules from '@ts/grids/grid_core/m_modules';
import type { Controllers } from '@ts/grids/grid_core/m_types';

import { SOURCE_ORDER } from './const';
import type { FilterSourceContext, FilterSourceName } from './types';
import { combineFilters } from './utils';

type TaggedFilter = unknown[] & {
  columnIndex?: number;
  filterValue?: unknown;
  selectedFilterOperation?: unknown;
};

export class FilterController extends modules.Controller {
  protected columnsController!: Controllers['columns'];

  protected dataSourceController!: Controllers['dataSource'];

  private columnSourcesSuspended = false;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.dataSourceController = this.getController('dataSource');
  }

  public isFilterSyncActive(): boolean {
    const filterSyncEnabled = this.option('filterSyncEnabled');

    return filterSyncEnabled === 'auto' ? !!this.option('filterPanel.visible') : !!filterSyncEnabled;
  }

  public suspendColumnSources<T>(callback: () => T): T {
    const wasSuspended = this.columnSourcesSuspended;

    this.columnSourcesSuspended = true;

    try {
      return callback();
    } finally {
      this.columnSourcesSuspended = wasSuspended;
    }
  }

  public getAdditionalFilter(excludedColumn?: Column | null): DataFilter {
    const context = this.createSourceContext(excludedColumn);

    return SOURCE_ORDER.reduce<DataFilter>((filter, sourceName) => {
      const source = this.getController(sourceName);

      if (!source || this.needToSkipFilter(sourceName)) {
        return filter;
      }

      return combineFilters([filter, ...source.getFilterExpressions(context)]);
    }, null);
  }

  public normalizeFilterSelectors(
    filter: DataFilter,
    remoteFiltering?: boolean,
    columnIndex?: number,
    filterValue?: unknown,
  ): DataFilter {
    return this.normalizeNode(filter, remoteFiltering, columnIndex, filterValue) as DataFilter;
  }

  private needToSkipFilter(sourceName: FilterSourceName): boolean {
    switch (sourceName) {
      case 'searchPanel':
        return false;
      case 'filterSync': {
        const columns = this.columnsController.getFilteringColumns();

        return !columns?.length || this.option('filterPanel.filterEnabled') === false;
      }
      default:
        return this.isFilterSyncActive()
          && (isDefined(this.option('filterValue')) || this.columnSourcesSuspended);
    }
  }

  private createSourceContext(excludedColumn?: Column | null): FilterSourceContext {
    return {
      langParams: this.getLangParams(),
      excludedColumn: excludedColumn ?? null,
      filterSyncActive: this.isFilterSyncActive(),
      columnsController: this.columnsController,
    };
  }

  private getLangParams(): LangParams | undefined {
    return this.dataSourceController?.getDataSource()?.loadOptions?.()?.langParams;
  }

  private normalizeNode(
    node: unknown,
    remoteFiltering: boolean | undefined,
    columnIndex: number | undefined,
    filterValue: unknown,
  ): unknown {
    if (!Array.isArray(node)) {
      return node;
    }

    const normalized = extend([], node) as TaggedFilter;
    const nestedColumnIndex = normalized.columnIndex ?? columnIndex;
    const nestedFilterValue = normalized.filterValue !== undefined
      ? normalized.filterValue
      : filterValue;
    const head = normalized[0];

    if (isString(head) && head !== '!') {
      this.normalizeDataFieldSelector(normalized, head, remoteFiltering);
    } else if (isFunction(head)) {
      Object.assign(head, {
        columnIndex: nestedColumnIndex,
        filterValue: nestedFilterValue,
        selectedFilterOperation: normalized.selectedFilterOperation,
      });
    }

    for (let i = 0; i < normalized.length; i += 1) {
      normalized[i] = this.normalizeNode(
        normalized[i],
        remoteFiltering,
        nestedColumnIndex,
        nestedFilterValue,
      );
    }

    return normalized;
  }

  private normalizeDataFieldSelector(
    filter: TaggedFilter,
    dataField: string,
    remoteFiltering: boolean | undefined,
  ): void {
    const column = this.columnsController.columnOption(dataField) as Column | undefined;

    if (remoteFiltering) {
      const lastIndex = filter.length - 1;

      if (config().forceIsoDateParsing && column?.serializeValue && lastIndex > 0) {
        filter[lastIndex] = column.serializeValue(filter[lastIndex], 'filter');
      }
    } else if (column?.selector) {
      column.selector.columnIndex = column.index;
      filter[0] = column.selector;
    }
  }
}
