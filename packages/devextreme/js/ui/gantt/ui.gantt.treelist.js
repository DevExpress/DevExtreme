import { getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import dxTreeList from '../tree_list';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';
import { GanttHelper } from './ui.gantt.helper';
import DataSource from '../../common/data/data_source';
import ArrayStore from '../../common/data/array_store';
import { compileGetter } from '../../core/utils/data';
import { GanttTreeListNodesState } from './ui.gantt.treelist.nodes_state';

const GANTT_TASKS = 'tasks';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_DEFAULT_ROW_HEIGHT = 34;
const GANTT_SCROLL_ACTIVATION_LEVEL = 2;

export class GanttTreeList {
    constructor(gantt) {
        this._gantt = gantt;
        this._$treeList = this._gantt._$treeList;
    }

    getTreeList() {
        const { keyExpr, parentIdExpr } = this._gantt.option(GANTT_TASKS);
        this._treeList = this._gantt._createComponent(this._$treeList, dxTreeList, {
            dataSource: this.createDataSource(this._gantt._tasksRaw, keyExpr),
            keyExpr: keyExpr,
            filterSyncEnabled: true,
            parentIdExpr: parentIdExpr,
            columns: this.getColumns(),
            columnResizingMode: 'nextColumn',
            height: this._getHeight(),
            width: this._gantt.option('taskListWidth'),
            selection: { mode: GanttHelper.getSelectionMode(this._gantt.option('allowSelection')) },
            selectedRowKeys: GanttHelper.getArrayFromOneElement(this._gantt.option('selectedRowKey')),
            sorting: this._gantt.option('sorting'),
            filterRow: this._gantt.option('filterRow'),
            headerFilter: this._gantt.option('headerFilter'),
            scrolling: { showScrollbar: 'onHover', mode: 'virtual' },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: this._gantt.option('showRowLines'),
            rootValue: this._gantt.option('rootValue'),
            onContentReady: (e) => { this._onContentReady(e); },
            onSelectionChanged: (e) => { this._onSelectionChanged(e); },
            onRowCollapsed: (e) => { this._onRowCollapsed(e); },
            onRowExpanded: (e) => { this._onRowExpanded(e); },
            onRowPrepared: (e) => { this._onRowPrepared(e); },
            onContextMenuPreparing: (e) => { this._onContextMenuPreparing(e); },
            onRowClick: (e) => { this.onRowClick(e); },
            onRowDblClick: (e) => { this.onRowDblClick(e); },
            onNodesInitialized: (e) => { this._onNodesInitialized(e); },
            _disableDeprecationWarnings: true
        });

        return this._treeList;
    }
    onAfterTreeListCreate() {
        if(this._postponedGanttInitRequired) {
            this._initGanttOnContentReady({ component: this._treeList });
            delete this._postponedGanttInitRequired;
        }
    }

    _onContentReady(e) {
        const hasTreeList = !!this._treeList;
        if(hasTreeList) {
            this._initGanttOnContentReady(e);
        } else {
            this._postponedGanttInitRequired = true;
        }
        this._gantt._onTreeListContentReady(e);
    }

    _initGanttOnContentReady(e) {
        if(e.component.getDataSource()) {
            this._gantt._initGanttView();
            this._initScrollSync(e.component);
        }
        this._gantt._sortAndFilter();
        this._gantt._sizeHelper.updateGanttRowHeights();
    }

    _onSelectionChanged(e) {
        const selectedRowKey = e.currentSelectedRowKeys[0];
        this._gantt._setGanttViewOption('selectedRowKey', selectedRowKey);
        this._gantt._setOptionWithoutOptionChange('selectedRowKey', selectedRowKey);
        this._gantt._actionsManager.raiseSelectionChangedAction(selectedRowKey);
    }

    _onRowCollapsed(e) {
        this._gantt._onTreeListRowExpandChanged(e, false);
    }

    _onRowExpanded(e) {
        this._gantt._onTreeListRowExpandChanged(e, true);
    }

    _onRowPrepared(e) {
        if(e.rowType === 'data' && e.node.children.length > 0) {
            $(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
        }
    }

    _onContextMenuPreparing(e) {
        if(e.target === 'header') {
            return;
        }
        if(e.row?.rowType === 'data') {
            this.setOption('selectedRowKeys', [e.row.data[this._gantt.option('tasks.keyExpr')]]);
        }
        e.items = [];
        const info = {
            cancel: false,
            event: e.event,
            type: 'task',
            key: e.row?.key,
            position: { x: e.event.pageX, y: e.event.pageY }
        };
        this._gantt._showPopupMenu(info);
    }

    _getHeight() {
        if(getHeight(this._$treeList)) {
            return getHeight(this._$treeList);
        }
        this._gantt._hasHeight = isDefined(this._gantt.option('height')) && this._gantt.option('height') !== '';
        return this._gantt._hasHeight ? '100%' : '';
    }

    _initScrollSync(treeList) {
        const treeListScrollable = treeList.getScrollable();
        if(treeListScrollable) {
            treeListScrollable.off('scroll');
            treeListScrollable.on('scroll', (e) => { this._onScroll(e); });
        }
    }

    _onScroll(treeListScrollView) {
        const ganttViewTaskAreaContainer = this._gantt._ganttView.getTaskAreaContainer();
        if(ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
            ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
        }
    }

    _correctRowsViewRowHeight(height) {
        const view = this._treeList._views && this._treeList._views['rowsView'];
        if(view?._rowHeight !== height) {
            view._rowHeight = height;
        }
    }

    _skipUpdateTreeListDataSource() {
        return this._gantt.option('validation.autoUpdateParentTasks');
    }

    selectRows(keys) {
        this.setOption('selectedRowKeys', keys);
    }

    scrollBy(scrollTop) {
        const treeListScrollable = this._treeList.getScrollable();
        if(treeListScrollable) {
            const diff = scrollTop - treeListScrollable.scrollTop();
            if(Math.abs(diff) >= GANTT_SCROLL_ACTIVATION_LEVEL) {
                treeListScrollable.scrollBy({ left: 0, top: diff });
            }
        }
    }

    updateDataSource(data, forceUpdate = false, forceCustomData = false) {
        if(!this._skipUpdateTreeListDataSource() || forceUpdate) {
            this.setDataSource(data);
        } else if(forceCustomData) {
            const data = this._treeList.option('dataSource');
            this._gantt._onParentTasksRecalculated(data);
        }
    }
    setDataSource(data) {
        this.setOption('dataSource', this.createDataSource(data));
    }
    createDataSource(data, key) {
        return data && new DataSource({
            store: new ArrayStore({
                data: data,
                key: key || this.getOption('keyExpr')
            })
        });
    }

    onRowClick(e) {
        this._gantt._actionsManager.raiseTaskClickAction(e.key, e.event);
    }

    onRowDblClick(e) {
        if(this._gantt._actionsManager.raiseTaskDblClickAction(e.key, e.event)) {
            this._gantt._ganttView._ganttViewCore.showTaskEditDialog();
        }
    }
    saveExpandedKeys() {
        const treeList = this._treeList;
        const visibleRowCount = treeList?.getVisibleRows().length;
        if(visibleRowCount > 0) {
            const nodes = this.getAllNodes();
            const keys = this.getOption('expandedRowKeys');
            const hasExpandedRows = keys && nodes.length !== visibleRowCount;
            if(hasExpandedRows) {
                const state = this.getNodesState();
                state.applyNodes(nodes, this.getOption('rootValue'));
                state.saveExpandedState(keys);
            }
        }
    }
    _onNodesInitialized(e) {
        const state = this.getNodesState();
        const savedKeys = state.getExpandedKeys();
        const nodes = this.getAllNodes();
        state.applyNodes(nodes, this.getOption('rootValue'));
        const expandedKeys = state.getExpandedKeys();
        if(expandedKeys) {
            this.setOption('expandedRowKeys', expandedKeys);
        }

        if(this.isExpandedStateChanged(savedKeys, expandedKeys)) {
            const expandedState = nodes.reduce((previous, node) => {
                previous[node.key] = expandedKeys ? expandedKeys.includes(node.key) : true;
                return previous;
            }, {});
            this._gantt._ganttView.applyTasksExpandedState(expandedState);
        }
        state.clear();
    }
    getNodesState() {
        if(!this._nodeState) {
            this._nodeState = new GanttTreeListNodesState();
        }
        return this._nodeState;
    }
    getAllNodes() {
        const store = this._treeList?.getDataSource()?.store();
        if(!store || !this._treeList?.getNodeByKey) {
            return [];
        }

        const keyGetter = compileGetter(store.key());
        return store._array
            .map(item => this._treeList.getNodeByKey(keyGetter(item)))
            .filter(item => !!item);
    }
    isExpandedStateChanged(keys1, keys2) {
        if(keys1 === null && keys2 === null) {
            return false;
        }
        if(keys1?.length !== keys2?.length) {
            return true;
        }
        return keys1.some((key, index) => key !== keys2[index]);
    }

    getOffsetHeight() {
        return this._gantt._treeList._$element.get(0).offsetHeight;
    }

    getRowHeight() {
        const $row = this._treeList._$element.find('.dx-data-row');
        let height = $row.length ? getBoundingRect($row.last().get(0)).height : GANTT_DEFAULT_ROW_HEIGHT;
        if(!height) {
            height = GANTT_DEFAULT_ROW_HEIGHT;
        }
        this._correctRowsViewRowHeight(height);
        return height;
    }

    getHeaderHeight() {
        return getBoundingRect(this._treeList._$element.find('.dx-treelist-headers').get(0)).height;
    }

    getColumns() {
        const columns = this._gantt.option('columns');
        if(columns) {
            for(let i = 0; i < columns.length; i++) {
                const column = columns[i];
                const isKeyColumn = column.dataField === this._gantt.option(`${GANTT_TASKS}.keyExpr`) || column.dataField === this._gantt.option(`${GANTT_TASKS}.parentIdExpr`);
                if(isKeyColumn && !column.dataType) {
                    column.dataType = 'object';
                }
            }
        }
        return columns;
    }

    getSievedItems() {
        const rootNode = this._treeList.getRootNode();
        if(!rootNode) { return undefined; }
        const resultArray = [];
        GanttHelper.convertTreeToList(rootNode, resultArray);

        const getters = GanttHelper.compileGettersByOption(this._gantt.option(GANTT_TASKS));
        const validatedData = this._gantt._validateSourceData(GANTT_TASKS, resultArray);
        const mappedData = validatedData.map(GanttHelper.prepareMapHandler(getters));

        return mappedData;
    }

    setOption(optionName, value) {
        this._treeList && this._treeList.option(optionName, value);
    }

    getOption(optionName) {
        return this._treeList?.option(optionName);
    }
    onTaskInserted(insertedId, parentId) {
        if(isDefined(parentId)) {
            const expandedRowKeys = this.getOption('expandedRowKeys');
            if(expandedRowKeys.indexOf(parentId) === -1) {
                expandedRowKeys.push(parentId);
                this.setOption('expandedRowKeys', expandedRowKeys);
            }
        }
        this.selectRows(GanttHelper.getArrayFromOneElement(insertedId));
        this.setOption('focusedRowKey', insertedId);
    }
    getDataSource() {
        return this._treeList?.getDataSource();
    }
}
