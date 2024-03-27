import { Deferred } from '@js/core/utils/deferred';
import { focusModule } from '@ts/grids/grid_core/focus/m_focus';

import type { DataController } from '../grid_core/data_controller/m_data_controller';
import type { ModuleType } from '../grid_core/m_types';
import core from './m_core';

function findIndex(items, callback) {
  let result = -1;

  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });

  return result;
}

const data = (
  Base: ModuleType<DataController>,
) => class TreeListDataControllerExtender extends focusModule.extenders.controllers.data(Base) {
  private changeRowExpand(key) {
    // @ts-expect-error
    if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
      if (this._isFocusedRowInside(key)) {
        this.option('focusedRowKey', key);
      }
    }

    // @ts-expect-error
    return super.changeRowExpand.apply(this, arguments);
  }

  private _isFocusedRowInside(parentKey) {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow = rowIndex >= 0 && this.getVisibleRows()[rowIndex];
    // @ts-expect-error
    let parent = focusedRow && focusedRow.node.parent;

    while (parent) {
      if (parent.key === parentKey) {
        return true;
      }
      parent = parent.parent;
    }

    return false;
  }

  private getParentKey(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
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
          d.resolve();
        }
      }).fail(d.reject);
    }

    return d.promise();
  }

  private expandAscendants(key) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new Deferred();

    that.getParentKey(key).done((parentKey) => {
      if (dataSource && parentKey !== undefined && parentKey !== that.option('rootValue')) {
        dataSource._isNodesInitializing = true;
        // @ts-expect-error
        that.expandRow(parentKey);
        dataSource._isNodesInitializing = false;
        that.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
    }).fail(d.reject);

    return d.promise();
  }

  protected getPageIndexByKey(key) {
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
  }
};

core.registerModule('focus', {
  ...focusModule,
  extenders: {
    ...focusModule.extenders,
    controllers: {
      ...focusModule.extenders.controllers,
      data,
    },
  },
});
