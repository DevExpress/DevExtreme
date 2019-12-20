import $ from '../../core/renderer';
import typeUtils from '../../core/utils/type';
import Widget from '../widget/ui.widget';
import registerComponent from '../../core/component_registrator';
import dataCoreUtils from '../../core/utils/data';
import { GanttView } from './ui.gantt.view';
import GanttContextMenuBar from './ui.gantt.contextmenu';
import dxTreeList from '../tree_list';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';
import DataOption from './ui.gantt.data.option';
import SplitterControl from '../splitter';
import { GanttDialog } from './ui.gantt.dialogs';
import LoadPanel from '../load_panel';

const GANTT_CLASS = 'dx-gantt';
const GANTT_VIEW_CLASS = 'dx-gantt-view';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_TREE_LIST_WRAPPER = 'dx-gantt-treelist-wrapper';

const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';

const GANTT_DEFAULT_ROW_HEIGHT = 34;

class Gantt extends Widget {
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(GANTT_CLASS);

        this._$treeListWrapper = $('<div>')
            .addClass(GANTT_TREE_LIST_WRAPPER)
            .appendTo(this.$element());
        this._$treeList = $('<div>')
            .appendTo(this._$treeListWrapper);
        this._$splitter = $('<div>')
            .appendTo(this.$element());
        this._$ganttView = $('<div>')
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this.$element());
        this._$dialog = $('<div>')
            .appendTo(this.$element());
        this._$loadPanel = $('<div>')
            .appendTo(this.$element());
        this._$contextMenu = $('<div>')
            .appendTo(this.$element());

        this._refreshDataSource(GANTT_TASKS);
        this._refreshDataSource(GANTT_DEPENDENCIES);
        this._refreshDataSource(GANTT_RESOURCES);
        this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS);
    }

    _renderContent() {
        this._renderTreeList();
        this._renderSplitter();
        this._renderBars();
    }
    _renderTreeList() {
        const { keyExpr, parentIdExpr } = this.option(GANTT_TASKS);
        this._treeList = this._createComponent(this._$treeList, dxTreeList, {
            dataSource: this._tasksRaw,
            keyExpr: keyExpr,
            parentIdExpr: parentIdExpr,
            columns: this.option('columns'),
            columnResizingMode: 'nextColumn',
            height: '100%',
            width: this.option('taskListWidth'),
            selection: { mode: this._getSelectionMode(this.option('allowSelection')) },
            selectedRowKeys: this._getArrayFromOneElement(this.option('selectedRowKey')),
            sorting: { mode: 'none' },
            scrolling: { showScrollbar: 'onHover', mode: 'virtual' },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: this.option('showRowLines'),
            onContentReady: (e) => { this._onTreeListContentReady(e); },
            onSelectionChanged: (e) => { this._onTreeListSelectionChanged(e); },
            onRowCollapsed: (e) => this._ganttView.changeTaskExpanded(e.key, false),
            onRowExpanded: (e) => this._ganttView.changeTaskExpanded(e.key, true),
            onRowPrepared: (e) => { this._onTreeListRowPrepared(e); },
            onContextMenuPreparing: (e) => { this._onTreeListContextMenuPreparing(e); },
            onRowDblClick: () => { this._onTreeListRowDblClick(); }
        });
    }
    _renderSplitter() {
        this._splitter = this._createComponent(this._$splitter, SplitterControl, {
            container: this.$element(),
            leftElement: this._$treeListWrapper,
            rightElement: this._$ganttView,
            onApplyPanelSize: this._onApplyPanelSize.bind(this)
        });
        this._setInnerElementsWidth();
        this._splitter.option('initialLeftPanelWidth', this.option('taskListWidth'));
    }
    _renderBars() {
        this._contextMenuBar = new GanttContextMenuBar(this._$contextMenu, this);
        this._bars = [this._contextMenuBar];
    }

    _initGanttView() {
        if(this._ganttView) {
            return;
        }
        this._ganttView = this._createComponent(this._$ganttView, GanttView, {
            width: '100%',
            height: this._treeList._$element.get(0).offsetHeight,
            rowHeight: this._getTreeListRowHeight(),
            headerHeight: this._getTreeListHeaderHeight(),
            tasks: this._tasks,
            dependencies: this._dependencies,
            resources: this._resources,
            resourceAssignments: this._resourceAssignments,
            allowSelection: this.option('allowSelection'),
            selectedRowKey: this.option('selectedRowKey'),
            showResources: this.option('showResources'),
            taskTitlePosition: this.option('taskTitlePosition'),
            showRowLines: this.option('showRowLines'),
            scaleType: this.option('scaleType'),
            editing: this.option('editing'),
            bars: this._bars,
            onSelectionChanged: this._onGanttViewSelectionChanged.bind(this),
            onScroll: this._onGanttViewScroll.bind(this),
            onDialogShowing: this._showDialog.bind(this),
            onPopupMenuShowing: this._showPopupMenu.bind(this),
            modelChangesListener: this._createModelChangesListener()
        });
        this._fireContentReadyAction();
    }

    _onApplyPanelSize(e) {
        this._setInnerElementsWidth(e);
    }

    _onTreeListContentReady(e) {
        if(e.component.getDataSource()) {
            this._initGanttView();
            this._initScrollSync(e.component);
        }
    }
    _onTreeListRowPrepared(e) {
        if(e.rowType === 'data' && e.node.children.length > 0) {
            $(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW);
        }
    }
    _onTreeListContextMenuPreparing(e) {
        if(e.row && e.row.rowType === 'data') {
            this._setTreeListOption('selectedRowKeys', [e.row.data.id]);
            e.items = [];
            this._showPopupMenu({ position: { x: e.event.clientX, y: e.event.clientY } });
        }
    }
    _onTreeListRowDblClick() {
        this._ganttView._ganttViewCore.commandManager.showTaskEditDialog.execute();
    }
    _onTreeListSelectionChanged(e) {
        const selectedRowKey = e.currentSelectedRowKeys[0];
        this._setGanttViewOption('selectedRowKey', selectedRowKey);
        this.option('selectedRowKey', selectedRowKey);
        this._raiseSelectionChangedAction(selectedRowKey);
    }
    _onGanttViewSelectionChanged(e) {
        this._setTreeListOption('selectedRowKeys', this._getArrayFromOneElement(e.id));
    }
    _onGanttViewScroll(e) {
        const treeListScrollable = this._treeList.getScrollable();
        if(treeListScrollable) {
            const diff = e.scrollTop - treeListScrollable.scrollTop();
            if(diff !== 0) {
                treeListScrollable.scrollBy({ left: 0, top: diff });
            }
        }
    }
    _onTreeListScroll(treeListScrollView) {
        const ganttViewTaskAreaContainer = this._ganttView.getTaskAreaContainer();
        if(ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
            ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop();
        }
    }

    _initScrollSync(treeList) {
        const treeListScrollable = treeList.getScrollable();
        if(treeListScrollable) {
            treeListScrollable.off('scroll');
            treeListScrollable.on('scroll', (e) => { this._onTreeListScroll(e); });
        }
    }
    _getTreeListRowHeight() {
        const $row = this._treeList._$element.find('.dx-data-row');
        const height = $row.length ? $row.last().get(0).getBoundingClientRect().height : GANTT_DEFAULT_ROW_HEIGHT;
        return height ? height : GANTT_DEFAULT_ROW_HEIGHT;
    }
    _getTreeListHeaderHeight() {
        return this._treeList._$element.find('.dx-treelist-headers').get(0).getBoundingClientRect().height;
    }


    _setInnerElementsWidth(widths) {
        if(!hasWindow()) {
            return;
        }
        if(!widths) {
            widths = this._getPanelsWidthByOption();
        }

        const leftPanelWidth = widths.leftPanelWidth;
        const rightPanelWidth = widths.rightPanelWidth;

        this._$treeListWrapper.width(leftPanelWidth);

        const isPercentage = typeUtils.isString(leftPanelWidth) && leftPanelWidth.slice(-1) === '%';
        this._$treeList.width(isPercentage ? '100%' : leftPanelWidth);

        this._splitter.setSplitterPositionLeft(leftPanelWidth);

        this._$ganttView.width(rightPanelWidth);
        this._setGanttViewOption('width', this._$ganttView.width());
    }

    _getPanelsWidthByOption() {
        return {
            leftPanelWidth: this.option('taskListWidth'),
            rightPanelWidth: this._$element.width() - this.option('taskListWidth')
        };
    }

    _setGanttViewOption(optionName, value) {
        this._ganttView && this._ganttView.option(optionName, value);
    }
    _setTreeListOption(optionName, value) {
        this._treeList && this._treeList.option(optionName, value);
    }

    _refreshDataSource(name) {
        let dataOption = this[`_${name}Option`];
        if(dataOption) {
            dataOption._disposeDataSource();
            delete this[`_${name}Option`];
            delete this[`_${name}`];
        }
        if(this.option(`${name}.dataSource`)) {
            dataOption = new DataOption(name, this._getLoadPanel(), (name, data) => {
                this._dataSourceChanged(name, data);
            });
            dataOption.option('dataSource', this._getSpecificDataSourceOption(name));
            dataOption._refreshDataSource();
            this[`_${name}Option`] = dataOption;
        }
    }
    _getSpecificDataSourceOption(name) {
        var dataSource = this.option(`${name}.dataSource`);
        if(Array.isArray(dataSource)) {
            return {
                store: {
                    type: 'array',
                    data: dataSource,
                    key: this.option(`${name}.keyExpr`)
                }
            };
        }
        return dataSource;
    }
    _compileGettersByOption(optionName) {
        const getters = {};
        const optionValue = this.option(optionName);
        for(let field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                getters[exprMatches[1]] = dataCoreUtils.compileGetter(optionValue[exprMatches[0]]);
            }
        }
        return getters;
    }
    _compileSettersByOption(optionName) {
        const setters = {};
        const optionValue = this.option(optionName);
        for(let field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                setters[exprMatches[1]] = dataCoreUtils.compileSetter(optionValue[exprMatches[0]]);
            }
        }
        return setters;
    }
    _getStoreObject(optionName, modelObject) {
        const setters = this._compileSettersByOption(optionName);
        return Object.keys(setters)
            .reduce((previous, key) => {
                if(key !== 'key') {
                    setters[key](previous, modelObject[key]);
                }
                return previous;
            }, {});
    }
    _prepareMapHandler(getters) {
        return (data) => {
            return Object.keys(getters)
                .reduce((previous, key) => {
                    const resultKey = key === 'key' ? 'id' : key;
                    previous[resultKey] = getters[key](data);
                    return previous;
                }, {});
        };
    }
    _dataSourceChanged(dataSourceName, data) {
        const getters = this._compileGettersByOption(dataSourceName);
        const mappedData = data.map(this._prepareMapHandler(getters));

        this[`_${dataSourceName}`] = mappedData;
        this._setGanttViewOption(dataSourceName, mappedData);
        if(dataSourceName === GANTT_TASKS) {
            this._tasksRaw = data;
            this._setTreeListOption('dataSource', data);
        }
    }

    _createModelChangesListener() {
        return { // IModelChangesListener
            NotifyTaskCreated: (task, callback) => { this._onRecordInserted(GANTT_TASKS, task, callback); },
            NotifyTaskRemoved: (taskId) => { this._onRecordRemoved(GANTT_TASKS, taskId); },
            NotifyTaskTitleChanged: (taskId, newValue) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'title', newValue); },
            NotifyTaskDescriptionChanged: (taskId, newValue) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'description', newValue); },
            NotifyTaskStartChanged: (taskId, newValue) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'start', newValue); },
            NotifyTaskEndChanged: (taskId, newValue) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'end', newValue); },
            NotifyTaskProgressChanged: (taskId, newValue) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'progress', newValue); },

            NotifyDependencyInserted: (dependency, callback) => { this._onRecordInserted(GANTT_DEPENDENCIES, dependency, callback); },
            NotifyDependencyRemoved: (dependencyId) => { this._onRecordRemoved(GANTT_DEPENDENCIES, dependencyId); },

            NotifyResourceCreated: (resource, callback) => { this._onRecordInserted(GANTT_RESOURCES, resource, callback); },
            NotifyResourceRemoved: (resource) => { this._onRecordRemoved(GANTT_RESOURCES, resource); },

            NotifyResourceAssigned: (assignment, callback) => { this._onRecordInserted(GANTT_RESOURCE_ASSIGNMENTS, assignment, callback); },
            NotifyResourceUnassigned: (assignmentId) => { this._onRecordRemoved(GANTT_RESOURCE_ASSIGNMENTS, assignmentId); }
        };
    }
    _onRecordInserted(optionName, record, callback) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            const data = this._getStoreObject(optionName, record);
            dataOption.insert(data, (response) => {
                const keyGetter = dataCoreUtils.compileGetter(this.option(`${optionName}.keyExpr`));
                const insertedId = keyGetter(response);
                callback(insertedId);
                if(optionName === GANTT_TASKS) {
                    this._updateTreeListDataSource();
                    const parentId = record.parentId;
                    if(parentId !== undefined) {
                        const expandedRowKeys = this._treeList.option('expandedRowKeys');
                        expandedRowKeys.push(parentId);
                        this._treeList.option('expandedRowKeys', expandedRowKeys);
                    }
                }
            });
        }
    }
    _onRecordRemoved(optionName, key) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            dataOption.remove(key, () => {
                if(optionName === GANTT_TASKS) {
                    this._updateTreeListDataSource();
                }
            });
        }
    }
    _onRecordUpdated(optionName, key, fieldName, value) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            const setter = dataCoreUtils.compileSetter(this.option(`${optionName}.${fieldName}Expr`));
            const data = {};
            setter(data, value);
            dataOption.update(key, data, () => {
                if(optionName === GANTT_TASKS) {
                    this._updateTreeListDataSource();
                }
            });
        }
    }
    _updateTreeListDataSource() {
        const storeArray = this._tasksOption._getStore()._array;
        this._setTreeListOption('dataSource', storeArray ? storeArray : this.option('tasks.dataSource'));
    }

    _getLoadPanel() {
        if(!this._loadPanel) {
            this._loadPanel = this._createComponent(this._$loadPanel, LoadPanel, {
                position: {
                    of: this.$element()
                }
            });
        }
        return this._loadPanel;
    }

    _createSelectionChangedAction() {
        this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
    }
    _raiseSelectionChangedAction(selectedRowKey) {
        if(!this._selectionChangedAction) {
            this._createSelectionChangedAction();
        }
        this._selectionChangedAction({ selectedRowKey: selectedRowKey });
    }
    _getSelectionMode(allowSelection) {
        return allowSelection ? 'single' : 'none';
    }
    _getArrayFromOneElement(element) {
        return element === undefined || element === null ? [] : [element];
    }

    _showDialog(e) {
        if(!this._dialogInstance) {
            this._dialogInstance = new GanttDialog(this, this._$dialog);
        }
        this._dialogInstance.show(e.name, e.parameters, e.callback, this.option('editing'));
    }
    _showPopupMenu(e) {
        this._ganttView.getBarManager().updateContextMenu();
        this._contextMenuBar.show(e.position);
    }
    _executeCoreCommand(id) {
        this._ganttView.executeCoreCommand(id);
    }

    _clean() {
        delete this._ganttView;
        delete this._dialogInstance;
        super._clean();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxGanttOptions.rtlEnabled
            * @hidden
            */

            /**
            * @name dxGanttOptions.tasks
            * @type Object
            * @default null
            */
            tasks: {
                /**
                * @name dxGanttOptions.tasks.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.tasks.keyExpr
                * @type string|function
                * @default "id"
                */
                keyExpr: 'id',
                /**
                * @name dxGanttOptions.tasks.parentIdExpr
                * @type string|function
                * @default "parentId"
                */
                parentIdExpr: 'parentId',
                /**
                * @name dxGanttOptions.tasks.startExpr
                * @type string|function
                * @default "start"
                */
                startExpr: 'start',
                /**
                * @name dxGanttOptions.tasks.endExpr
                * @type string|function
                * @default "end"
                */
                endExpr: 'end',
                /**
                * @name dxGanttOptions.tasks.progressExpr
                * @type string|function
                * @default "progress"
                */
                progressExpr: 'progress',
                /**
                * @name dxGanttOptions.tasks.titleExpr
                * @type string|function
                * @default "title"
                */
                titleExpr: 'title'
            },
            /**
            * @name dxGanttOptions.dependencies
            * @type Object
            * @default null
            */
            dependencies: {
                /**
                * @name dxGanttOptions.dependencies.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.dependencies.keyExpr
                * @type string|function
                * @default "id"
                */
                keyExpr: 'id',
                /**
                * @name dxGanttOptions.dependencies.predecessorIdExpr
                * @type string|function
                * @default "predecessorId"
                */
                predecessorIdExpr: 'predecessorId',
                /**
                * @name dxGanttOptions.dependencies.successorIdExpr
                * @type string|function
                * @default "successorId"
                */
                successorIdExpr: 'successorId',
                /**
                * @name dxGanttOptions.dependencies.typeExpr
                * @type string|function
                * @default "type"
                */
                typeExpr: 'type'
            },
            /**
            * @name dxGanttOptions.resources
            * @type Object
            * @default null
            */
            resources: {
                /**
                * @name dxGanttOptions.resources.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.resources.keyExpr
                * @type string|function
                * @default "id"
                */
                keyExpr: 'id',
                /**
                * @name dxGanttOptions.resources.textExpr
                * @type string|function
                * @default "text"
                */
                textExpr: 'text'
            },
            /**
            * @name dxGanttOptions.resourceAssignments
            * @type Object
            * @default null
            */
            resourceAssignments: {
                /**
                * @name dxGanttOptions.resourceAssignments.dataSource
                * @type Array<Object>|DataSource|DataSourceOptions
                * @default null
                */
                dataSource: null,
                /**
                * @name dxGanttOptions.resourceAssignments.keyExpr
                * @type string|function
                * @default "id"
                */
                keyExpr: 'id',
                /**
                * @name dxGanttOptions.resourceAssignments.taskIdExpr
                * @type string|function
                * @default "taskId"
                */
                taskIdExpr: 'taskId',
                /**
                * @name dxGanttOptions.resourceAssignments.resourceIdExpr
                * @type string|function
                * @default "resourceId"
                */
                resourceIdExpr: 'resourceId'
            },
            /**
             * @name dxGanttOptions.columns
             * @type Array<dxTreeListColumn,string>
             * @default undefined
             */
            columns: undefined,
            /**
            * @name dxGanttOptions.taskListWidth
            * @type number
            * @default 300
            */
            taskListWidth: 300,
            /**
            * @name dxGanttOptions.showResources
            * @type boolean
            * @default true
            */
            showResources: true,
            /**
            * @name dxGanttOptions.taskTitlePosition
            * @type Enums.GanttTaskTitlePosition
            * @default "inside"
            */
            taskTitlePosition: 'inside',
            /**
            * @name dxGanttOptions.selectedRowKey
            * @type any
            * @default undefined
            */
            selectedRowKey: undefined,
            /**
            * @name dxGanttOptions.onSelectionChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 selectedRowKey:any
            * @action
            */
            onSelectionChanged: null,
            /**
            * @name dxGanttOptions.allowSelection
            * @type boolean
            * @default true
            */
            allowSelection: true,
            /**
            * @name dxGanttOptions.showRowLines
            * @type boolean
            * @default true
            */
            showRowLines: true,
            /**
            * @name dxGanttOptions.scaleType
            * @type Enums.GanttScaleType
            * @default "auto"
            */
            scaleType: 'auto',
            /**
            * @name dxGanttOptions.editing
            * @type Object
            */
            editing: {
                /**
                * @name dxGanttOptions.editing.enabled
                * @type boolean
                * @default false
                */
                enabled: false,
                /**
                * @name dxGanttOptions.editing.allowTaskAdding
                * @type boolean
                * @default true
                */
                allowTaskAdding: true,
                /**
                * @name dxGanttOptions.editing.allowTaskDeleting
                * @type boolean
                * @default true
                */
                allowTaskDeleting: true,
                /**
                * @name dxGanttOptions.editing.allowTaskUpdating
                * @type boolean
                * @default true
                */
                allowTaskUpdating: true,
                /**
                * @name dxGanttOptions.editing.allowDependencyAdding
                * @type boolean
                * @default true
                */
                allowDependencyAdding: true,
                /**
                 * @name dxGanttOptions.editing.allowDependencyDeleting
                 * @type boolean
                 * @default true
                 */
                allowDependencyDeleting: true,
                /**
                 * @name dxGanttOptions.editing.allowDependencyUpdating
                 * @type boolean
                 * @default true
                 */
                allowDependencyUpdating: true,
                /**
                * @name dxGanttOptions.editing.allowResourceAdding
                * @type boolean
                * @default true
                */
                allowResourceAdding: true,
                /**
                * @name dxGanttOptions.editing.allowResourceDeleting
                * @type boolean
                * @default true
                */
                allowResourceDeleting: true,
                /**
                * @name dxGanttOptions.editing.allowResourceUpdating
                * @type boolean
                * @default true
                */
                allowResourceUpdating: true
            }
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'tasks':
                this._refreshDataSource(GANTT_TASKS);
                break;
            case 'dependencies':
                this._refreshDataSource(GANTT_DEPENDENCIES);
                break;
            case 'resources':
                this._refreshDataSource(GANTT_RESOURCES);
                break;
            case 'resourceAssignments':
                this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS);
                break;
            case 'columns':
                this._setTreeListOption('columns', this.option(args.name));
                break;
            case 'taskListWidth':
                this._setInnerElementsWidth();
                break;
            case 'showResources':
                this._setGanttViewOption('showResources', args.value);
                break;
            case 'taskTitlePosition':
                this._setGanttViewOption('taskTitlePosition', args.value);
                break;
            case 'selectedRowKey':
                this._setTreeListOption('selectedRowKeys', this._getArrayFromOneElement(args.value));
                break;
            case 'onSelectionChanged':
                this._createSelectionChangedAction();
                break;
            case 'allowSelection':
                this._setTreeListOption('selection.mode', this._getSelectionMode(args.value));
                this._setGanttViewOption('allowSelection', args.value);
                break;
            case 'showRowLines':
                this._setTreeListOption('showRowLines', args.value);
                this._setGanttViewOption('showRowLines', args.value);
                break;
            case 'scaleType':
                this._setGanttViewOption('scaleType', args.value);
                break;
            case 'editing':
                this._setGanttViewOption('editing', this.option(args.name));
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxGantt', Gantt);
module.exports = Gantt;
