import $ from '../../core/renderer';
import dxTreeList from '../tree_list';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';
import { GanttHelper } from './ui.gantt.helper';

const GANTT_TASKS = 'tasks';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_DEFAULT_ROW_HEIGHT = 34;

export class GanttTreeList {
    constructor(gantt) {
        this._gantt = gantt;
        this._$treeList = this._gantt._$treeList;
    }

    getTreeList() {
        const { keyExpr, parentIdExpr } = this._gantt.option(GANTT_TASKS);
        this._treeList = this._gantt._createComponent(this._$treeList, dxTreeList, {
            dataSource: this._gantt._tasksRaw,
            keyExpr: keyExpr,
            parentIdExpr: parentIdExpr,
            columns: this.getColumns(),
            columnResizingMode: 'nextColumn',
            height: this._getHeight(),
            width: this._gantt.option('taskListWidth'),
            selection: { mode: GanttHelper.getSelectionMode(this._gantt.option('allowSelection')) },
            selectedRowKeys: GanttHelper.getArrayFromOneElement(this._gantt.option('selectedRowKey')),
            sorting: { mode: 'none' },
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
            onRowDblClick: (e) => { this.onRowDblClick(e); }
        });

        return this._treeList;
    }

    _onContentReady(e) {
        if(e.component.getDataSource()) {
            this._gantt._initGanttView();
            this._initScrollSync(e.component);
        }
    }

    _onSelectionChanged(e) {
        const selectedRowKey = e.currentSelectedRowKeys[0];
        this._gantt._setGanttViewOption('selectedRowKey', selectedRowKey);
        this._gantt._setOptionWithoutOptionChange('selectedRowKey', selectedRowKey);
        this._gantt._actionsManager.raiseSelectionChangedAction(selectedRowKey);
    }

    _onRowCollapsed(e) {
        this._gantt._ganttView.changeTaskExpanded(e.key, false);
        this._gantt._sizeHelper.adjustHeight();
    }

    _onRowExpanded(e) {
        this._gantt._ganttView.changeTaskExpanded(e.key, true);
        this._gantt._sizeHelper.adjustHeight();
    }

    _onRowPrepared(e) {
        if(e.rowType === 'data' && e.node.children.length > 0) {
            $(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
        }
    }

    _onContextMenuPreparing(e) {
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
        if(this._$treeList.height()) {
            return this._$treeList.height();
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
            if(diff !== 0) {
                treeListScrollable.scrollBy({ left: 0, top: diff });
            }
        }
    }

    updateDataSource(forceUpdate = false) {
        if(!this._skipUpdateTreeListDataSource()) {
            const dataSource = this._gantt.option('tasks.dataSource');
            const storeArray = this._gantt._tasksOption._getStore()._array || (dataSource.items && dataSource.items());
            this.setOption('dataSource', storeArray ? storeArray : dataSource);
        } else if(forceUpdate) {
            const data = this._treeList.option('dataSource');
            this._gantt._onParentTasksRecalculated(data);
        }
    }

    onRowClick(e) {
        this._gantt._actionsManager.raiseTaskClickAction(e.key, e.event);
    }

    onRowDblClick(e) {
        if(this._gantt._actionsManager.raiseTaskDblClickAction(e.key, e.event)) {
            this._gantt._ganttView._ganttViewCore.showTaskEditDialog();
        }
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

    setOption(optionName, value) {
        this._treeList && this._treeList.option(optionName, value);
    }

    getOption(optionName) {
        return this._treeList.option(optionName);
    }
}
