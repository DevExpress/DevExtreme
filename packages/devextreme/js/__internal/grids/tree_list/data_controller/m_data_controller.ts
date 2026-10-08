import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { DataController, dataControllerModule } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { RowKey } from '@ts/grids/grid_core/types';
import type { NodeCallback, OperationTypes, TreeNode } from '@ts/grids/tree_list/data_source_adapter/types';

import type { TreeListColumnsController } from '../columns_controller';
import treeListCore from '../core';
import type { TreeListDataSourceController } from '../data_source/data_source_controller';
import type {
  ExpandedKeysCache,
  RowExpandArgs,
  TreeListDataControllerOptionChanged,
  TreeListGeneratedItem,
  TreeListItemProcessingOptions,
  TreeListProcessedItem,
} from './types';

export class TreeListDataController extends DataController {
  protected declare dataSourceController: TreeListDataSourceController;

  public declare _columnsController: TreeListColumnsController;

  private _getNodeLevel(node: TreeNode): number {
    let level = -1;
    let current = node;
    while (current.parent) {
      if (current.visible) {
        level += 1;
      }
      current = current.parent;
    }
    return level;
  }

  protected _generateDataItem(
    node: TreeNode,
    options?: TreeListItemProcessingOptions,
  ): TreeListGeneratedItem {
    return {
      rowType: 'data',
      node,
      key: node.key,
      // @ts-expect-error a data node always has data, only the root node has none
      data: node.data,
      isExpanded: this.isRowExpanded(node.key, options),
      level: this._getNodeLevel(node),
    };
  }

  private _loadOnOptionChange(): void {
    // @ts-expect-error called only after optionChanged checked the adapter
    this.dataSourceController.getAdapter().load();
  }

  protected isSameRowState(item1: TreeListProcessedItem, item2: TreeListProcessedItem): boolean {
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

  protected _isCellChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    visibleRowIndex: number,
    columnIndex: number,
    isLiveUpdate?: boolean,
  ): boolean {
    const firstDataColumnIndex = this._columnsController.getFirstDataColumnIndex();

    if (columnIndex === firstDataColumnIndex && oldRow.isSelected !== newRow.isSelected) {
      return true;
    }

    return super._isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate);
  }

  public init(): void {
    this.createAction('onRowExpanding');
    this.createAction('onRowExpanded');
    this.createAction('onRowCollapsing');
    this.createAction('onRowCollapsed');

    super.init();
  }

  public publicMethods(): string[] {
    return super.publicMethods().concat([
      'expandRow', 'collapseRow', 'isRowExpanded', 'getRootNode',
      'getNodeByKey', 'loadDescendants', 'forEachNode',
    ]);
  }

  protected override needUpdateDimensions(operationTypes?: OperationTypes): boolean {
    return super.needUpdateDimensions(operationTypes) || Boolean(operationTypes?.nodeExpanding);
  }

  private changeRowExpand(key: RowKey): DeferredObj<unknown> {
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (dataSourceAdapter) {
      const args: RowExpandArgs = {
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

    return Deferred<unknown>().resolve();
  }

  private isRowExpanded(key: RowKey, cache?: ExpandedKeysCache): boolean | undefined {
    return this.dataSourceController.getAdapter()?.isRowExpanded(key, cache);
  }

  private expandRow(key: RowKey): DeferredObj<unknown> {
    if (!this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    return Deferred<unknown>().resolve();
  }

  private collapseRow(key: RowKey): DeferredObj<unknown> {
    if (this.isRowExpanded(key)) {
      return this.changeRowExpand(key);
    }
    return Deferred<unknown>().resolve();
  }

  private getRootNode(): TreeNode | undefined {
    return this.dataSourceController.getAdapter()?.getRootNode();
  }

  public optionChanged(args: TreeListDataControllerOptionChanged): void {
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
        const isReloadNeeded = dataSourceAdapter
          && !dataSourceAdapter._isNodesInitializing
          && !equalByValue(args.value, args.previousValue);

        if (isReloadNeeded) {
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

  private getNodeByKey(key: RowKey): TreeNode | undefined {
    return this.dataSourceController.getAdapter()?.getNodeByKey(key);
  }

  private getChildNodeKeys(parentKey: RowKey): RowKey[] | undefined {
    return this.dataSourceController.getAdapter()?.getChildNodeKeys(parentKey);
  }

  private loadDescendants(
    keys?: RowKey | RowKey[],
    childrenOnly?: boolean,
  ): DeferredObj<unknown> | undefined {
    return this.dataSourceController.getAdapter()?.loadDescendants(keys, childrenOnly);
  }

  private forEachNode(...args: [NodeCallback] | [TreeNode | TreeNode[], NodeCallback]): void {
    // @ts-expect-error adapter is set; a spread argument can't match the overloads of forEachNode()
    this.dataSourceController.getAdapter().forEachNode(...args);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend() returns any
    return extend({}, dataControllerModule.defaultOptions?.(), {
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
