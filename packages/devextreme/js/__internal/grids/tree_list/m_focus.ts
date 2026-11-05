import { Deferred, type DeferredObj } from '@js/core/utils/deferred';
import { focusModule } from '@ts/grids/grid_core/focus/focus_module';
import type {
  FocusDataControllerExtension,
  FocusDataSourceControllerExtension,
} from '@ts/grids/grid_core/focus/types';
import type { ModuleType, RowKey } from '@ts/grids/grid_core/types';

import core from './core';
import type { TreeListDataController } from './data_controller/data_controller';
import type { TreeListProcessedItem } from './data_controller/types';
import type { TreeListDataSourceController } from './data_source/data_source_controller';
import type { TreeNode } from './data_source_adapter/types';

function findIndex<T>(items: T[], callback: (item: T) => boolean): number {
  let result = -1;

  items.forEach((node, index) => {
    if (callback(node)) {
      result = index;
    }
  });

  return result;
}

const data = (
  Base: ModuleType<TreeListDataController>,
): ModuleType<
  TreeListDataController & FocusDataControllerExtension
> => class TreeListDataControllerExtender extends focusModule.extenders.controllers.data(Base) {
  protected declare dataSourceController: TreeListDataSourceController
  & FocusDataSourceControllerExtension;

  public changeRowExpand(key: RowKey): DeferredObj<unknown> {
    if (this.option('focusedRowEnabled') && this.isRowExpanded(key)) {
      if (this._isFocusedRowInside(key)) {
        this.option('focusedRowKey', key);
      }
    }

    return super.changeRowExpand(key);
  }

  private _isFocusedRowInside(parentKey: RowKey): boolean {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this.getRowIndexByKey(focusedRowKey);
    const focusedRow: TreeListProcessedItem | false = rowIndex >= 0
      && this.getVisibleRows()[rowIndex];
    let parent = focusedRow && focusedRow.node?.parent;

    while (parent) {
      if (parent.key === parentKey) {
        return true;
      }
      parent = parent.parent;
    }

    return false;
  }

  private getParentKey(key: RowKey): DeferredObj<RowKey> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const node = this.getNodeByKey(key);
    const d = Deferred<RowKey>();

    if (node) {
      d.resolve(node.parent ? node.parent.key : undefined);
    } else if (dataSourceAdapter) {
      dataSourceAdapter.customLoader.load({
        filter: [dataSourceAdapter.getKeyExpr(), '=', key],
      }).done((loadResult) => {
        const parentData = loadResult.data[0];

        if (parentData) {
          d.resolve(dataSourceAdapter.parentKeyOf(parentData));
        } else {
          d.resolve();
        }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(d.reject);
    } else {
      d.reject();
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  private expandAscendants(key: RowKey): DeferredObj<unknown> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const d = Deferred<unknown>();

    this.getParentKey(key).done((parentKey) => {
      if (dataSourceAdapter && parentKey !== undefined && parentKey !== this.option('rootValue')) {
        dataSourceAdapter._isNodesInitializing = true;
        this.expandRow(parentKey);
        dataSourceAdapter._isNodesInitializing = false;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
        this.expandAscendants(parentKey).done(d.resolve).fail(d.reject);
      } else {
        d.resolve();
      }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  public getPageIndexByKey(key: RowKey): DeferredObj<number> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();
    const d = Deferred<number>();

    if (!dataSourceAdapter) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return d.reject().promise();
    }

    this.expandAscendants(key).done(() => {
      dataSourceAdapter.customLoader.load({
        parentIds: [],
      }).done((loadResult) => {
        if (this.dataSourceController.getAdapter() !== dataSourceAdapter) {
          d.resolve(-1);
          return;
        }

        // @ts-expect-error customLoader returns nodes here, but types them as rows
        const nodes: TreeNode[] = loadResult.data;
        const offset = findIndex(nodes, (node) => (
          !!node.data && this.dataSourceController.keyOf(node.data) === key
        ));

        let pageIndex = -1;

        if (offset >= 0) {
          pageIndex = Math.floor(offset / this.pageSize());
        }

        d.resolve(pageIndex);
      // @ts-expect-error fail() gets the error, but is typed with the resolve value
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(d.reject);
    // @ts-expect-error fail() gets the error, but is typed with the resolve value
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
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
