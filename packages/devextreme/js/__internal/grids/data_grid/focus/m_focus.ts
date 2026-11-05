import { equalByValue } from '@js/core/utils/common';
import { Deferred, type DeferredObj } from '@js/core/utils/deferred';
import { compileGetter } from '@ts/core/utils/data';
import type { StoreLoadOptions } from '@ts/data/data_source/types';
import type {
  GroupInfoData,
  GroupingDataControllerExtension,
  GroupItemData,
} from '@ts/grids/data_grid/grouping/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import { focusModule } from '@ts/grids/grid_core/focus/focus_module';
import type {
  FocusDataControllerExtension,
  FocusDataSourceControllerExtension,
} from '@ts/grids/grid_core/focus/types';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/keyboard_navigation';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';
import { isVirtualPaging } from '@ts/grids/grid_core/utils';

import gridCore from '../core';
import type { GroupingDataSourceAdapter } from '../grouping/m_grouping';
import { createGroupFilter } from '../utils';

const data = (
  Base: ModuleType<DataController & GroupingDataControllerExtension>,
): ModuleType<
  DataController & FocusDataControllerExtension & GroupingDataControllerExtension
> => class FocusDataControllerExtender extends focusModule.extenders.controllers.data(Base) {
  protected declare dataSourceController: DataSourceController<GroupingDataSourceAdapter>
  & FocusDataSourceControllerExtension;

  protected keyboardNavigationController!: KeyboardNavigationController;

  public init(): void {
    this.keyboardNavigationController = this.getController('keyboardNavigation');
    super.init();
  }

  public changeRowExpand(path: RowKey, isRowClick?: boolean): DeferredObj<unknown> {
    if (this.option('focusedRowEnabled') && Array.isArray(path) && this.isRowExpanded(path)) {
      if (
        (!isRowClick || !this.keyboardNavigationController.isKeyboardEnabled())
        && this._isFocusedRowInsideGroup(path)
      ) {
        this.option('focusedRowKey', path);
      }
    }

    return super.changeRowExpand(path, isRowClick);
  }

  private _isFocusedRowInsideGroup(path: unknown[]): boolean {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow = rowIndex >= 0 ? this.getVisibleRows()[rowIndex] : undefined;
    const groups = this._columnsController.getGroupDataSourceParameters(true);

    if (focusedRow && groups) {
      for (let i = 0; i < path.length; i += 1) {
        const selector = groups[i]?.selector;
        const getter = typeof selector === 'function' ? selector : compileGetter(selector);

        if (getter(focusedRow.data) !== path[i]) {
          return false;
        }
      }
    }
    return true;
  }

  private _getGroupPath(groupItems: GroupItemData[], groupCount: number): unknown[] {
    const groupPath: unknown[] = [];
    let groupItem: GroupItemData | undefined = groupItems[0];

    while (groupItem && groupPath.length < groupCount) {
      groupPath.push(groupItem.key);
      groupItem = groupItem.items?.[0];
    }

    return groupPath;
  }

  private _expandGroupByPath(
    that: this,
    groupPath: unknown[],
    level: number,
  ): DeferredObj<unknown> {
    const d = Deferred<unknown>();

    const nextLevel = level + 1;

    that.expandRow(groupPath.slice(0, nextLevel)).done(() => {
      if (nextLevel === groupPath.length) {
        d.resolve();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        that._expandGroupByPath(that, groupPath, nextLevel).done(d.resolve).fail(d.reject);
      }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  public getGlobalRowIndexByKey(key: RowKey): DeferredObj<number> {
    if (this.dataSourceController.getAdapter()?.group()) {
      return this._calculateGlobalRowIndexByGroupedData(key);
    }

    return super.getGlobalRowIndexByKey(key);
  }

  private _calculateGlobalRowIndexByGroupedData(key: RowKey): DeferredObj<number> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const filter = this._generateFilterByKey(key);
    const deferred = Deferred<number>();
    const isGroupKey = Array.isArray(key);

    if (isGroupKey || !dataSourceAdapter) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.resolve(-1).promise();
    }

    const group = dataSourceAdapter.group();

    if (!dataSourceAdapter._grouping._updatePagingOptions) {
      this._calculateGlobalRowIndexByFlatData(key, null, true)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .done(deferred.resolve)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        .fail(deferred.reject);
      return deferred;
    }

    dataSourceAdapter.customLoader.load({
      filter: this._concatWithCombinedFilter(filter),
      group,
    }).done(({ data: groupItems }) => {
      const hasData = Array.isArray(groupItems) && groupItems.length > 0;

      if (this.dataSourceController.getAdapter() !== dataSourceAdapter || !hasData) {
        deferred.resolve(-1);
        return;
      }

      // @ts-expect-error customLoader returns groups here, but types them as rows
      const groupPath = this._getGroupPath(groupItems, gridCore.normalizeSortingInfo(group).length);

      this._expandGroupByPath(this, groupPath, 0).done(() => {
        this._calculateExpandedRowGlobalIndex(deferred, key, groupPath, group, dataSourceAdapter);
        // @ts-expect-error fail() gets the error, but is typed with the resolve value
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(deferred.reject);
      // @ts-expect-error fail() gets the error, but is typed with the resolve value
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(deferred.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  private _calculateExpandedRowGlobalIndex(
    deferred: DeferredObj<number>,
    key: RowKey,
    groupPath: unknown[],
    group: StoreLoadOptions['group'],
    dataSourceAdapter: GroupingDataSourceAdapter,
  ): void {
    if (this.dataSourceController.getAdapter() !== dataSourceAdapter) {
      deferred.resolve(-1);
      return;
    }

    const groupFilter = createGroupFilter(groupPath, { group });
    const isVirtualScrolling = isVirtualPaging(this.option('scrolling'));
    const pageSize = dataSourceAdapter.pageSize();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the callback
    let groupOffset: number;

    dataSourceAdapter._grouping._updatePagingOptions(
      { skip: 0, take: Number.MAX_SAFE_INTEGER },
      (groupInfo: GroupInfoData, totalOffset: number) => {
        if (equalByValue(groupInfo.path, groupPath)) {
          groupOffset = totalOffset;
        }
      },
    );

    this._calculateGlobalRowIndexByFlatData(key, groupFilter).done((dataOffset) => {
      if (dataOffset < 0) {
        deferred.resolve(-1);
        return;
      }

      const currentPageOffset = (groupOffset % pageSize) || pageSize;
      const offsetFromPageStart = currentPageOffset + dataOffset - groupPath.length;
      const groupContinuationCount = isVirtualScrolling
        ? 0
        : Math.floor(offsetFromPageStart / (pageSize - groupPath.length)) * groupPath.length;

      deferred.resolve(groupOffset + dataOffset + groupContinuationCount);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(deferred.reject);
  }
};

gridCore.registerModule('focus', {
  ...focusModule,
  extenders: {
    ...focusModule.extenders,
    controllers: {
      ...focusModule.extenders.controllers,
      data,
    },
  },
});
