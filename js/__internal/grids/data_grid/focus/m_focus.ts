import { equalByValue } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import { focusModule } from '@ts/grids/grid_core/focus/m_focus';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { GroupingDataControllerExtension } from '../grouping/m_grouping';
import gridCore from '../m_core';
import { createGroupFilter } from '../m_utils';

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */;

// Move CoreFocusModuleType to focusModule after migration to ts
interface CoreFocusModuleType {
  _generateFilterByKey: (key, operation?) => any;
  _calculateGlobalRowIndexByFlatData: (key, groupFilter, useGroup?) => any;
  _concatWithCombinedFilter: (filter, groupFilter?) => any;
}

type DataControllerBase = ModuleType<
DataController
& CoreFocusModuleType
& GroupingDataControllerExtension>;

gridCore.registerModule('focus', extend(true, {}, focusModule, {
  extenders: {
    controllers: {
      data: (Base: DataControllerBase): DataControllerBase => class FocusDataControllerExtender
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        extends (Base.inherit(focusModule.extenders.controllers.data) as DataControllerBase) {
        changeRowExpand(path, isRowClick) {
          if (this.option('focusedRowEnabled') && Array.isArray(path) && this.isRowExpanded(path)) {
            const keyboardNavigation = this.getController('keyboardNavigation');
            if ((!isRowClick || !keyboardNavigation.isKeyboardEnabled()) && this._isFocusedRowInsideGroup(path)) {
              this.option('focusedRowKey', path);
            }
          }

          return super.changeRowExpand(path, isRowClick);
        }

        _isFocusedRowInsideGroup(path) {
          const columnsController = this.getController('columns');
          const focusedRowKey = this.option('focusedRowKey');
          const rowIndex = this.getRowIndexByKey(focusedRowKey);
          const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
          const groups = columnsController.getGroupDataSourceParameters(true);

          if (focusedRow) {
            for (let i = 0; i < path.length; ++i) {
              const getter = compileGetter(groups[i] && groups[i].selector);

              // @ts-expect-error
              if (getter(focusedRow.data) !== path[i]) {
                return false;
              }
            }
          }
          return true;
        }

        _getGroupPath(groupItem, groupCount) {
          const groupPath: any[] = [];
          let items = [groupItem];

          while (items && items[0] && groupCount) {
            const item = items[0];
            if (item.key !== undefined) {
              groupPath.push(item.key);
            }
            items = item.items;
            groupCount--;
          }
          return groupPath;
        }

        _expandGroupByPath(that, groupPath, level) {
          // @ts-expect-error
          const d = new Deferred();

          level++;

          that.expandRow(groupPath.slice(0, level)).done(() => {
            if (level === groupPath.length) {
              d.resolve();
            } else {
              that._expandGroupByPath(that, groupPath, level)
                .done(d.resolve)
                .fail(d.reject);
            }
          }).fail(d.reject);

          return d.promise();
        }

        _calculateGlobalRowIndexByGroupedData(key) {
          const that = this;
          const dataSource = that._dataSource;
          const filter = that._generateFilterByKey(key);
          // @ts-expect-error
          const deferred = new Deferred();
          const isGroupKey = Array.isArray(key);
          const group = dataSource.group();

          if (isGroupKey) {
            return deferred.resolve(-1).promise();
          }

          if (!dataSource._grouping._updatePagingOptions) {
            that._calculateGlobalRowIndexByFlatData(key, null, true)
              .done(deferred.resolve)
              .fail(deferred.reject);
            return deferred;
          }

          dataSource.load({
            filter: that._concatWithCombinedFilter(filter),
            group,
          }).done((data) => {
            if (!data || data.length === 0 || !isDefined(data[0].key) || data[0].key === -1) {
              return deferred.resolve(-1).promise();
            }

            const groupPath = that._getGroupPath(data[0], group.length);

            that._expandGroupByPath(that, groupPath, 0).done(() => {
              that._calculateExpandedRowGlobalIndex(deferred, key, groupPath, group);
            }).fail(deferred.reject);
          }).fail(deferred.reject);

          return deferred.promise();
        }

        _calculateExpandedRowGlobalIndex(deferred, key, groupPath, group) {
          const groupFilter = createGroupFilter(groupPath, { group });
          const dataSource = this._dataSource;
          const scrollingMode = this.option('scrolling.mode');
          const isVirtualScrolling = scrollingMode === 'virtual' || scrollingMode === 'infinite';
          const pageSize = dataSource.pageSize();
          let groupOffset;

          dataSource._grouping._updatePagingOptions({ skip: 0, take: MAX_SAFE_INTEGER }, (groupInfo, totalOffset) => {
            if (equalByValue(groupInfo.path, groupPath)) {
              groupOffset = totalOffset;
            }
          });

          this._calculateGlobalRowIndexByFlatData(key, groupFilter).done((dataOffset) => {
            let count;
            let groupContinuationCount;

            if (dataOffset < 0) {
              deferred.resolve(-1);
              return;
            }

            const currentPageOffset = (groupOffset % pageSize) || pageSize;

            count = currentPageOffset + dataOffset - groupPath.length;

            if (isVirtualScrolling) {
              groupContinuationCount = 0;
            } else {
              groupContinuationCount = Math.floor(count / (pageSize - groupPath.length)) * groupPath.length;
            }

            count = groupOffset + dataOffset + groupContinuationCount;

            deferred.resolve(count);
          }).fail(deferred.reject);
        }
      },
    },
  },
}));
