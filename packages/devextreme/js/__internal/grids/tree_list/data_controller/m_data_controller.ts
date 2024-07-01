import { equalByValue } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { DataController, dataControllerModule } from '@ts/grids/grid_core/data_controller/m_data_controller';

import dataSourceAdapterProvider from '../data_source_adapter/m_data_source_adapter';
import treeListCore from '../m_core';

export class TreeListDataController extends DataController {
  protected _getDataSourceAdapter() {
    return dataSourceAdapterProvider;
  }

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

  protected _generateDataItem(node, options) {
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
    this._dataSource.load();
  }

  protected _isItemEquals(item1, item2) {
    if (item1.isSelected !== item2.isSelected) {
      return false;
    }

    if (item1.node && item2.node && item1.node.hasChildren !== item2.node.hasChildren) {
      return false;
    }

    if (item1.level !== item2.level || item1.isExpanded !== item2.isExpanded) {
      return false;
    }

    return super._isItemEquals.apply(this, arguments as any);
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

  public keyOf(data) {
    const dataSource = this._dataSource;

    if (dataSource) {
      return dataSource.keyOf(data);
    }
  }

  public key() {
    const dataSource = this._dataSource;

    if (dataSource) {
      return dataSource.getKeyExpr();
    }
  }

  public publicMethods() {
    return super.publicMethods().concat(['expandRow', 'collapseRow', 'isRowExpanded', 'getRootNode', 'getNodeByKey', 'loadDescendants', 'forEachNode']);
  }

  private changeRowExpand(key) {
    if (this._dataSource) {
      const args: any = {
        key,
      };
      const isExpanded = this.isRowExpanded(key);

      this.executeAction(isExpanded ? 'onRowCollapsing' : 'onRowExpanding', args);

      if (!args.cancel) {
        return this._dataSource.changeRowExpand(key).done(() => {
          this.executeAction(isExpanded ? 'onRowCollapsed' : 'onRowExpanded', args);
        });
      }
    }

    // @ts-expect-error
    return new Deferred().resolve();
  }

  private isRowExpanded(key, cache?) {
    return this._dataSource && this._dataSource.isRowExpanded(key, cache);
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
    return this._dataSource && this._dataSource.getRootNode();
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
        this._refreshDataSource();
        args.handled = true;
        break;
      case 'expandedRowKeys':
      case 'onNodesInitialized':
        if (this._dataSource && !this._dataSource._isNodesInitializing && !equalByValue(args.value, args.previousValue)) {
          this._loadOnOptionChange();
        }
        args.handled = true;
        break;
      case 'maxFilterLengthInRequest':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  private getNodeByKey(key) {
    if (!this._dataSource) {
      return;
    }

    return this._dataSource.getNodeByKey(key);
  }

  private getChildNodeKeys(parentKey) {
    if (!this._dataSource) {
      return;
    }

    return this._dataSource.getChildNodeKeys(parentKey);
  }

  private loadDescendants(keys, childrenOnly) {
    if (!this._dataSource) {
      return;
    }

    return this._dataSource.loadDescendants(keys, childrenOnly);
  }

  private forEachNode() {
    this._dataSource.forEachNode.apply(this, arguments);
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

      onNodesInitialized: null,
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
