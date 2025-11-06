/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ArrayStore from '@js/common/data/array_store';
import DataSource from '@js/common/data/data_source';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter } from '@js/core/utils/data';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { Properties as GanttProperties } from '@js/ui/gantt';
import TreeList from '@js/ui/tree_list';
import type Gantt from '@ts/ui/gantt/ui.gantt';
import { GanttHelper } from '@ts/ui/gantt/ui.gantt.helper';
import { GanttTreeListNodesState } from '@ts/ui/gantt/ui.gantt.treelist.nodes_state';

const GANTT_TASKS = 'tasks';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_DEFAULT_ROW_HEIGHT = 34;
const GANTT_SCROLL_ACTIVATION_LEVEL = 2;

export class GanttTreeList {
  _gantt: Gantt;

  _$treeList: dxElementWrapper;

  _treeList?: TreeList;

  _nodeState?: GanttTreeListNodesState;

  _postponedGanttInitRequired?: boolean;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._$treeList = this._gantt._$treeList;
  }

  getTreeList(): TreeList {
    // @ts-expect-error ts-error
    const { keyExpr, parentIdExpr } = this._gantt.option(GANTT_TASKS);
    this._treeList = this._gantt._createComponent(this._$treeList, TreeList, {
      dataSource: this.createDataSource(this._gantt._tasksRaw, keyExpr),
      keyExpr,
      filterSyncEnabled: true,
      parentIdExpr,
      columns: this.getColumns(),
      columnResizingMode: 'nextColumn',
      height: this._getHeight(),
      width: this._gantt.option('taskListWidth'),
      selection: {
        mode: GanttHelper.getSelectionMode(
          this._gantt.option('allowSelection'),
        ),
      },
      selectedRowKeys: GanttHelper.getArrayFromOneElement(
        this._gantt.option('selectedRowKey'),
      ),
      sorting: this._gantt.option('sorting'),
      filterRow: this._gantt.option('filterRow'),
      headerFilter: this._gantt.option('headerFilter'),
      scrolling: { showScrollbar: 'onHover', mode: 'virtual' },
      allowColumnResizing: true,
      autoExpandAll: true,
      showRowLines: this._gantt.option('showRowLines'),
      rootValue: this._gantt.option('rootValue'),
      onContentReady: (e): void => {
        this._onContentReady(e);
      },
      onSelectionChanged: (e): void => {
        this._onSelectionChanged(e);
      },
      onRowCollapsed: (e): void => {
        this._onRowCollapsed(e);
      },
      onRowExpanded: (e): void => {
        this._onRowExpanded(e);
      },
      onRowPrepared: (e): void => {
        this._onRowPrepared(e);
      },
      onContextMenuPreparing: (e): void => {
        this._onContextMenuPreparing(e);
      },
      onRowClick: (e): void => {
        this.onRowClick(e);
      },
      onRowDblClick: (e): void => {
        this.onRowDblClick(e);
      },
      onNodesInitialized: (): void => {
        this._onNodesInitialized();
      },
      _disableDeprecationWarnings: true,
    });

    return this._treeList;
  }

  onAfterTreeListCreate(): void {
    if (this._postponedGanttInitRequired) {
      this._initGanttOnContentReady({ component: this._treeList });
      delete this._postponedGanttInitRequired;
    }
  }

  _onContentReady(e): void {
    const hasTreeList = !!this._treeList;
    if (hasTreeList) {
      this._initGanttOnContentReady(e);
    } else {
      this._postponedGanttInitRequired = true;
    }
    this._gantt._onTreeListContentReady(e);
  }

  _initGanttOnContentReady(e): void {
    if (e.component.getDataSource()) {
      this._gantt._initGanttView();
      this._initScrollSync(e.component);
    }
    this._gantt._sortAndFilter();
    this._gantt._sizeHelper?.updateGanttRowHeights();
  }

  _onSelectionChanged(e): void {
    const selectedRowKey = e.currentSelectedRowKeys[0];
    this._gantt._setGanttViewOption('selectedRowKey', selectedRowKey);
    this._gantt._setOptionWithoutOptionChange('selectedRowKey', selectedRowKey);
    this._gantt._actionsManager?.raiseSelectionChangedAction(selectedRowKey);
  }

  _onRowCollapsed(e): void {
    this._gantt._onTreeListRowExpandChanged(e, false);
  }

  _onRowExpanded(e): void {
    this._gantt._onTreeListRowExpandChanged(e, true);
  }

  _onRowPrepared(e): void {
    if (e.rowType === 'data' && e.node.children.length > 0) {
      $(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
    }
  }

  _onContextMenuPreparing(e): void {
    if (e.target === 'header') {
      return;
    }
    if (e.row?.rowType === 'data') {
      this.setOption('selectedRowKeys', [
        // @ts-expect-error ts-error
        e.row.data[this._gantt.option('tasks.keyExpr')],
      ]);
    }

    const info = {
      cancel: false,
      event: e.event,
      type: 'task',
      key: e.row?.key,
      position: { x: e.event.pageX, y: e.event.pageY },
    };
    this._gantt._showPopupMenu(info);
    e.event.preventDefault();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getHeight() {
    if (getHeight(this._$treeList)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return getHeight(this._$treeList);
    }
    this._gantt._hasHeight = isDefined(this._gantt.option('height'))
      // @ts-expect-error ts-error
      && this._gantt.option('height') !== '';
    return this._gantt._hasHeight ? '100%' : '';
  }

  _initScrollSync(treeList): void {
    const treeListScrollable = treeList.getScrollable();
    if (treeListScrollable) {
      treeListScrollable.off('scroll');
      treeListScrollable.on('scroll', (e): void => {
        this._onScroll(e);
      });
    }
  }

  _onScroll(treeListScrollView): void {
    const ganttViewTaskAreaContainer = this._gantt._ganttView?.getTaskAreaContainer();
    if (
      ganttViewTaskAreaContainer.scrollTop
      !== treeListScrollView.component.scrollTop()
    ) {
      ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
    }
  }

  _correctRowsViewRowHeight(height): void {
    // @ts-expect-error ts-error
    const view = this._treeList?._views?.rowsView;
    if (view?._rowHeight !== height) {
      view._rowHeight = height;
    }
  }

  _skipUpdateTreeListDataSource(): boolean | undefined {
    const { validation } = this._gantt.option();
    return validation?.autoUpdateParentTasks;
  }

  selectRows(keys): void {
    this.setOption('selectedRowKeys', keys);
  }

  scrollBy(scrollTop): void {
    const treeListScrollable = this._treeList?.getScrollable();
    if (treeListScrollable) {
      const diff = scrollTop - treeListScrollable.scrollTop();
      if (Math.abs(diff) >= GANTT_SCROLL_ACTIVATION_LEVEL) {
        treeListScrollable.scrollBy({ left: 0, top: diff });
      }
    }
  }

  updateDataSource(data, forceUpdate = false, forceCustomData = false): void {
    if (!this._skipUpdateTreeListDataSource() || forceUpdate) {
      this.setDataSource(data);
    } else if (forceCustomData) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const data = this._treeList?.option('dataSource');
      this._gantt._onParentTasksRecalculated(data);
    }
  }

  setDataSource(data): void {
    // @ts-expect-error ts-error
    this.setOption('dataSource', this.createDataSource(data));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createDataSource(data, key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      data
      && new DataSource({
        store: new ArrayStore({
          data,
          key: key || this.getOption('keyExpr'),
        }),
      })
    );
  }

  onRowClick(e): void {
    this._gantt._actionsManager?.raiseTaskClickAction(e.key, e.event);
  }

  onRowDblClick(e): void {
    if (this._gantt._actionsManager?.raiseTaskDblClickAction(e.key, e.event)) {
      this._gantt._ganttView?._ganttViewCore.showTaskEditDialog();
    }
  }

  saveExpandedKeys(): void {
    const treeList = this._treeList;
    const visibleRowCount = treeList?.getVisibleRows().length;
    // @ts-expect-error ts-error
    if (visibleRowCount > 0) {
      const nodes = this.getAllNodes();
      const keys = this.getOption('expandedRowKeys');
      const hasExpandedRows = keys && nodes.length !== visibleRowCount;
      if (hasExpandedRows) {
        const state = this.getNodesState();
        state.applyNodes(nodes, this.getOption('rootValue'));
        state.saveExpandedState(keys);
      }
    }
  }

  _onNodesInitialized(): void {
    const state = this.getNodesState();
    const savedKeys = state.getExpandedKeys();
    const nodes = this.getAllNodes();
    state.applyNodes(nodes, this.getOption('rootValue'));
    const expandedKeys = state.getExpandedKeys();
    if (expandedKeys) {
      this.setOption('expandedRowKeys', expandedKeys);
    }

    if (this.isExpandedStateChanged(savedKeys, expandedKeys)) {
      const expandedState = nodes.reduce((previous, node) => {
        previous[node.key] = expandedKeys
          // @ts-expect-error ts-error
          ? expandedKeys.includes(node.key)
          : true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return previous;
      }, {});
      this._gantt._ganttView?.applyTasksExpandedState(expandedState);
    }
    state.clear();
  }

  getNodesState(): GanttTreeListNodesState {
    if (!this._nodeState) {
      this._nodeState = new GanttTreeListNodesState();
    }
    return this._nodeState;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getAllNodes() {
    const store = this._treeList?.getDataSource()?.store();
    if (!store || !this._treeList?.getNodeByKey) {
      return [];
    }

    // @ts-expect-error ts-error
    const keyGetter = compileGetter(store.key());
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return store._array
      // @ts-expect-error ts-error
      .map((item) => this._treeList?.getNodeByKey(keyGetter(item)))
      .filter((item) => !!item);
  }

  isExpandedStateChanged(keys1, keys2): boolean {
    if (keys1 === null && keys2 === null) {
      return false;
    }
    if (keys1?.length !== keys2?.length) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return keys1.some((key, index): boolean => key !== keys2[index]);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getOffsetHeight() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._gantt._treeList?.$element().get(0).offsetHeight;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getRowHeight() {
    const $row = this._treeList?.$element().find('.dx-data-row');
    let height = $row?.length
      ? getBoundingRect($row?.last().get(0)).height
      : GANTT_DEFAULT_ROW_HEIGHT;
    if (!height) {
      height = GANTT_DEFAULT_ROW_HEIGHT;
    }
    this._correctRowsViewRowHeight(height);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return height;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getHeaderHeight() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getBoundingRect(
      this._treeList?.$element().find('.dx-treelist-headers').get(0),
    ).height;
  }

  getColumns(): GanttProperties['columns'] {
    const { columns } = this._gantt.option();
    if (columns) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < columns.length; i += 1) {
        const column = columns[i];
        // @ts-expect-error ts-error
        const isKeyColumn = column.dataField === this._gantt.option(`${GANTT_TASKS}.keyExpr`)
          // @ts-expect-error ts-error
          || column.dataField
          === this._gantt.option(`${GANTT_TASKS}.parentIdExpr`);
        // @ts-expect-error ts-error
        if (isKeyColumn && !column.dataType) {
          // @ts-expect-error ts-error
          column.dataType = 'object';
        }
      }
    }
    return columns;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSievedItems() {
    const rootNode = this._treeList?.getRootNode();
    if (!rootNode) {
      return undefined;
    }
    const resultArray = [];
    GanttHelper.convertTreeToList(rootNode, resultArray);

    const getters = GanttHelper.compileGettersByOption(
      this._gantt.option(GANTT_TASKS),
    );
    const validatedData = this._gantt._validateSourceData(
      GANTT_TASKS,
      resultArray,
    );
    const mappedData = validatedData.map(
      GanttHelper.prepareMapHandler(getters),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return mappedData;
  }

  setOption(optionName: string, value): void {
    this._treeList?.option(optionName, value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getOption(optionName: string) {
    return this._treeList?.option(optionName);
  }

  onTaskInserted(insertedId, parentId): void {
    if (isDefined(parentId)) {
      const expandedRowKeys = this.getOption('expandedRowKeys');
      // @ts-expect-error ts-error
      if (expandedRowKeys.indexOf(parentId) === -1) {
        // @ts-expect-error ts-error
        expandedRowKeys.push(parentId);
        this.setOption('expandedRowKeys', expandedRowKeys);
      }
    }
    this.selectRows(GanttHelper.getArrayFromOneElement(insertedId));
    this.setOption('focusedRowKey', insertedId);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDataSource() {
    return this._treeList?.getDataSource();
  }
}
