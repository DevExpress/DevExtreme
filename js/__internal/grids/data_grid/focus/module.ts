import { focusModule } from '@js/ui/grid_core/ui.grid_core.focus';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined } from '@js/core/utils/type';
import { equalByValue } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { createGroupFilter } from '../module_utils';
import gridCore from '../module_core';

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991/* IE11 */;

gridCore.registerModule('focus', extend(true, {}, focusModule, {
  extenders: {
    controllers: {
      data: {
        changeRowExpand(path, isRowClick) {
          if (this.option('focusedRowEnabled') && Array.isArray(path) && this.isRowExpanded(path)) {
            const keyboardNavigation = this.getController('keyboardNavigation');
            if ((!isRowClick || !keyboardNavigation.isKeyboardEnabled()) && this._isFocusedRowInsideGroup(path)) {
              this.option('focusedRowKey', path);
            }
          }

          return this.callBase.apply(this, arguments);
        },
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
        },
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
        },
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
        },
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
        },
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
        },
      },
    },
  },
}));
