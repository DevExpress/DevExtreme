import { extend } from '@js/core/utils/extend';
import { Deferred } from '@js/core/utils/deferred';
// @ts-expect-error
import { focusModule } from '@js/ui/grid_core/ui.grid_core.focus';
import core from './module_core';

function findIndex(items, callback) {
  let result = -1;

  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });

  return result;
}

core.registerModule('focus', extend(true, {}, focusModule, {
  extenders: {
    controllers: {
      data: {
        changeRowExpand(key) {
          if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
            if (this._isFocusedRowInside(key)) {
              this.option('focusedRowKey', key);
            }
          }

          return this.callBase.apply(this, arguments);
        },
        _isFocusedRowInside(parentKey) {
          const focusedRowKey = this.option('focusedRowKey');
          const rowIndex = this.getRowIndexByKey(focusedRowKey);
          const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
          let parent = focusedRow && focusedRow.node.parent;

          while (parent) {
            if (parent.key === parentKey) {
              return true;
            }
            parent = parent.parent;
          }

          return false;
        },
        getParentKey(key) {
          const that = this;
          const dataSource = that._dataSource;
          const node = that.getNodeByKey(key);
          // @ts-expect-error
          const d = new Deferred();

          if (node) {
            d.resolve(node.parent ? node.parent.key : undefined);
          } else {
            dataSource.load({
              filter: [dataSource.getKeyExpr(), '=', key],
            }).done((items) => {
              const parentData = items[0];

              if (parentData) {
                d.resolve(dataSource.parentKeyOf(parentData));
              } else {
                d.reject();
              }
            }).fail(d.reject);
          }

          return d.promise();
        },
        expandAscendants(key) {
          const that = this;
          const dataSource = that._dataSource;
          // @ts-expect-error
          const d = new Deferred();

          that.getParentKey(key).done((parentKey) => {
            if (dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
              dataSource._isNodesInitializing = true;
              that.expandRow(parentKey);
              dataSource._isNodesInitializing = false;
              that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
            } else {
              d.resolve();
            }
          }).fail(d.reject);

          return d.promise();
        },
        getPageIndexByKey(key) {
          const that = this;
          const dataSource = that._dataSource;
          // @ts-expect-error
          const d = new Deferred();

          that.expandAscendants(key).done(() => {
            dataSource.load({
              parentIds: [],
            }).done((nodes) => {
              const offset = findIndex(nodes, (node) => that.keyOf(node.data) === key);

              let pageIndex = -1;

              if (offset >= 0) {
                pageIndex = Math.floor(offset / that.pageSize());
              }

              d.resolve(pageIndex);
            }).fail(d.reject);
          }).fail(d.reject);

          return d.promise();
        },
      },
    },
  },
}));
