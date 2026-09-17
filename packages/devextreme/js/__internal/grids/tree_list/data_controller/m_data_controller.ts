import { equalByValue } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { DataController, dataControllerModule } from '@ts/grids/grid_core/data_controller/data_controller';
import type { RowKey } from '@ts/grids/grid_core/m_types';

import type { TreeListDataSourceController } from '../data_source/data_source_controller';
import treeListCore from '../m_core';

export class TreeListDataController extends DataController {
  protected declare dataSourceController: TreeListDataSourceController;

  private _getNodeLevel(node) {
    let level = -1;
    while (node.parent) {
      if (node.visible) {
        level++;
      }
      node = node.parent;
    }
    return level;
  }

  protected _generateDataItem(node?: any, options?: any): any {
    return {
      rowType: 'data',
      node,
      key: node.key,
      data: node.data,
      isExpanded: this.isRowExpanded(node.key, options),
      level: this._getNodeLevel(node),
    };
  }

  private _loadOnOptionChange() {
    this.dataSourceController.getAdapter()!.load();
  }

  protected isSameRowState(item1, item2): boolean {
    if (item1.isSelected !== item2.isSelected) {
      return false;
    }

    if (item1.node && item2.node && item1.node.hasChildren !== item2.node.hasChildren) {
      return false;
    }

    if (item1.level !== item2.level || item1.isExpanded !== item2.isExpanded) {
      return false;
    }

    return super.isSameRowState(item1, item2);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate) {
    // @ts-expect-error
    const firstDataColumnIndex = this._columnsController.getFirstDataColumnIndex();

    if (columnIndex === firstDataColumnIndex && oldRow.isSelected !== newRow.isSelected) {
      return true;
    }

    return super._isCellChanged.apply(this, arguments as any);
  }

  public init() {
    this.createAction('onRowExpanding');
    this.createAction('onRowExpanded');
    this.createAction('onRowCollapsing');
    this.createAction('onRowCollapsed');

    super.init.apply(this, arguments as any);
  }

  public publicMethods() {
    return super.publicMethods().concat(['expandRow', 'collapseRow', 'isRowExpanded', 'getRootNode', 'getNodeByKey', 'loadDescendants', 'forEachNode']);
  }

  protected override needUpdateDimensions(operationTypes) {
    return super.needUpdateDimensions(operationTypes) || (
      operationTypes && operationTypes.nodeExpanding
    );
  }

  private changeRowExpand(key) {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (dataSourceAdapter) {
      const args: any = {
        key,
      };
      const isExpanded = this.isRowExpanded(key);

      this.executeAction(isExpanded ? 'onRowCollapsing' : 'onRowExpanding', args);

      if (!args.cancel) {
        return dataSourceAdapter.changeRowExpand(key).done(() => {
          this.executeAction(isExpanded ? 'onRowCollapsed' : 'onRowExpanded', args);
        });
      }
    }

    // @ts-expect-error
    return new Deferred().resolve();
  }

  private isRowExpanded(key, cache?) {
    return this.dataSourceController.getAdapter()?.isRowExpanded(key, cache);
  }

  private expandRow(key) {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }

  private collapseRow(key) {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    // @ts-expect-error
    return new Deferred().resolve();
  }

  private getRootNode() {
    return this.dataSourceController.getAdapter()?.getRootNode();
  }

  public optionChanged(args) {
    switch (args.name) {
      case 'rootValue':
      case 'parentIdExpr':
      case 'itemsExpr':
      case 'filterMode':
      case 'expandNodesOnFiltering':
      case 'autoExpandAll':
      case 'hasItemsExpr':
      case 'dataStructure':
        this._columnsController.reset();
        this._items = [];
        this.resetDataSource();
        args.handled = true;
        break;
      case 'expandedRowKeys':
      case 'onNodesInitialized': {
        const dataSourceAdapter = this.dataSourceController.getAdapter();

        if (dataSourceAdapter && !dataSourceAdapter._isNodesInitializing && !equalByValue(args.value, args.previousValue)) {
          this._loadOnOptionChange();
        }
        args.handled = true;
        break;
      }
      case 'maxFilterLengthInRequest':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  private getNodeByKey(key) {
    return this.dataSourceController.getAdapter()?.getNodeByKey(key);
  }

  private getChildNodeKeys(parentKey) {
    return this.dataSourceController.getAdapter()?.getChildNodeKeys(parentKey);
  }

  private loadDescendants(keys, childrenOnly) {
    return this.dataSourceController.getAdapter()?.loadDescendants(keys, childrenOnly);
  }

  private forEachNode() {
    this.dataSourceController.getAdapter()!.forEachNode.apply(this, arguments as any);
  }

  // Collect keys by walking the loaded node tree (depth-first, parent before
  // children) — the order rows appear in when fully expanded.
  public getAllDataRowKeys(): Promise<RowKey[]> {
    const keys: RowKey[] = [];

    this.dataSourceController.getAdapter()?.forEachNode((node) => {
      keys.push(node.key);
    });

    return Promise.resolve(keys);
  }
}

treeListCore.registerModule('data', {
  defaultOptions() {
    return extend({}, (dataControllerModule as any).defaultOptions(), {
      itemsExpr: 'items',
      parentIdExpr: 'parentId',
      rootValue: 0,
      dataStructure: 'plain',
      expandedRowKeys: [],
      filterMode: 'withAncestors',
      expandNodesOnFiltering: true,
      autoExpandAll: false,
      maxFilterLengthInRequest: 1500,
      paging: {
        enabled: false,
      },
    });
  },
  controllers: {
    data: TreeListDataController,
  },
});
