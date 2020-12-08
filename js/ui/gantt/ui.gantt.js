import $ from '../../core/renderer';
import { isString, isDefined } from '../../core/utils/type';
import Widget from '../widget/ui.widget';
import registerComponent from '../../core/component_registrator';
import { compileGetter, compileSetter } from '../../core/utils/data';
import { GanttView } from './ui.gantt.view';
import { GanttToolbar, GanttContextMenuBar } from './ui.gantt.bars';
import dxTreeList from '../tree_list';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { hasWindow } from '../../core/utils/window';
import DataOption from './ui.gantt.data.option';
import SplitterControl from '../splitter';
import { GanttDialog } from './ui.gantt.dialogs';
import LoadPanel from '../load_panel';
import { getPublicElement } from '../../core/element';
import { GanttDataCache } from './ui.gantt.cache';

// STYLE gantt

const GANTT_CLASS = 'dx-gantt';
const GANTT_VIEW_CLASS = 'dx-gantt-view';
const GANTT_COLLAPSABLE_ROW = 'dx-gantt-collapsable-row';
const GANTT_TREE_LIST_WRAPPER = 'dx-gantt-treelist-wrapper';
const GANTT_TOOLBAR_WRAPPER = 'dx-gantt-toolbar-wrapper';
const GANTT_MAIN_WRAPPER = 'dx-gantt-main-wrapper';

const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';

const GANTT_NEW_TASK_CACHE_KEY = 'gantt_new_task_key';

const GANTT_DEFAULT_ROW_HEIGHT = 34;

const GANTT_MAPPED_FIELD_REGEX = /(\w*)Expr/;

class Gantt extends Widget {
    _init() {
        super._init();
        this._cache = new GanttDataCache();
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(GANTT_CLASS);

        this._$toolbarWrapper = $('<div>')
            .addClass(GANTT_TOOLBAR_WRAPPER)
            .appendTo(this.$element());
        this._$toolbar = $('<div>')
            .appendTo(this._$toolbarWrapper);

        this._$mainWrapper = $('<div>')
            .addClass(GANTT_MAIN_WRAPPER)
            .appendTo(this.$element());
        this._$treeListWrapper = $('<div>')
            .addClass(GANTT_TREE_LIST_WRAPPER)
            .appendTo(this._$mainWrapper);
        this._$treeList = $('<div>')
            .appendTo(this._$treeListWrapper);
        this._$splitter = $('<div>')
            .appendTo(this._$mainWrapper);
        this._$ganttView = $('<div>')
            .addClass(GANTT_VIEW_CLASS)
            .appendTo(this._$mainWrapper);
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
        this._renderBars();
        this._renderTreeList();
        this._renderSplitter();
    }
    _renderTreeList() {
        const { keyExpr, parentIdExpr } = this.option(GANTT_TASKS);
        this._treeList = this._createComponent(this._$treeList, dxTreeList, {
            dataSource: this._tasksRaw,
            keyExpr: keyExpr,
            parentIdExpr: parentIdExpr,
            columns: this._getTreeListColumns(),
            columnResizingMode: 'nextColumn',
            height: this._getTreeListHeight(),
            width: this.option('taskListWidth'),
            selection: { mode: this._getSelectionMode(this.option('allowSelection')) },
            selectedRowKeys: this._getArrayFromOneElement(this.option('selectedRowKey')),
            sorting: { mode: 'none' },
            scrolling: { showScrollbar: 'onHover', mode: 'virtual' },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: this.option('showRowLines'),
            rootValue: this.option('rootValue'),
            onContentReady: (e) => { this._onTreeListContentReady(e); },
            onSelectionChanged: (e) => { this._onTreeListSelectionChanged(e); },
            onRowCollapsed: (e) => { this._onTreeListRowCollapsed(e); },
            onRowExpanded: (e) => { this._onTreeListRowExpanded(e); },
            onRowPrepared: (e) => { this._onTreeListRowPrepared(e); },
            onContextMenuPreparing: (e) => { this._onTreeListContextMenuPreparing(e); },
            onRowClick: (e) => { this._onTreeListRowClick(e); },
            onRowDblClick: (e) => { this._onTreeListRowDblClick(e); }
        });
    }
    _renderSplitter() {
        this._splitter = this._createComponent(this._$splitter, SplitterControl, {
            container: this.$element(),
            leftElement: this._$treeListWrapper,
            rightElement: this._$ganttView,
            onApplyPanelSize: this._onApplyPanelSize.bind(this)
        });
        this._splitter.option('initialLeftPanelWidth', this.option('taskListWidth'));
    }
    _renderBars() {
        this._bars = [];
        this._toolbar = new GanttToolbar(this._$toolbar, this);
        this._updateToolbarContent();
        this._bars.push(this._toolbar);
        this._contextMenuBar = new GanttContextMenuBar(this._$contextMenu, this);
        this._updateContextMenu();
        this._bars.push(this._contextMenuBar);
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
            firstDayOfWeek: this.option('firstDayOfWeek'),
            showRowLines: this.option('showRowLines'),
            scaleType: this.option('scaleType'),
            editing: this.option('editing'),
            validation: this.option('validation'),
            stripLines: this.option('stripLines'),
            bars: this._bars,
            mainElement: this.$element(),
            onSelectionChanged: this._onGanttViewSelectionChanged.bind(this),
            onScroll: this._onGanttViewScroll.bind(this),
            onDialogShowing: this._showDialog.bind(this),
            onPopupMenuShowing: this._showPopupMenu.bind(this),
            onExpandAll: this._expandAll.bind(this),
            onCollapseAll: this._collapseAll.bind(this),
            modelChangesListener: this._createModelChangesListener(),
            taskTooltipContentTemplate: this._getTaskTooltipContentTemplateFunc(this.option('taskTooltipContentTemplate')),
            onTaskClick: (e) => { this._onTreeListRowClick(e); },
            onTaskDblClick: (e) => { this._onTreeListRowDblClick(e); }
        });
        this._fireContentReadyAction();
    }

    _onApplyPanelSize(e) {
        this._setInnerElementsWidth(e);
        const rowHeight = this._getTreeListRowHeight();
        this._ganttView?._ganttViewCore.updateRowHeights(rowHeight);
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

        if(e.row?.rowType === 'data') {
            this._setTreeListOption('selectedRowKeys', [e.row.data[this.option('tasks.keyExpr')]]);
        }
        e.items = [];
        const info = {
            cancel: false,
            event: e.event,
            type: 'task',
            key: e.row?.key,
            position: { x: e.event.pageX, y: e.event.pageY }
        };
        this._showPopupMenu(info);
    }
    _onTreeListRowClick(e) {
        this._raiseTaskClickAction(e.key, e.event);
    }
    _onTreeListRowDblClick(e) {
        if(this._raiseTaskDblClickAction(e.key, e.event)) {
            this._ganttView._ganttViewCore.commandManager.showTaskEditDialog.execute();
        }
    }
    _onTreeListSelectionChanged(e) {
        const selectedRowKey = e.currentSelectedRowKeys[0];
        this._setGanttViewOption('selectedRowKey', selectedRowKey);
        this.option('selectedRowKey', selectedRowKey);
        this._raiseSelectionChangedAction(selectedRowKey);
    }
    _onTreeListRowCollapsed(e) {
        this._ganttView.changeTaskExpanded(e.key, false);
        this._adjustHeight();
    }
    _onTreeListRowExpanded(e) {
        this._ganttView.changeTaskExpanded(e.key, true);
        this._adjustHeight();
    }
    _adjustHeight() {
        if(!this._hasHeight) {
            this._setGanttViewOption('height', 0);
            this._setGanttViewOption('height', this._treeList._$element.get(0).offsetHeight);
        }
    }
    _getTreeListHeight() {
        if(this._$treeList.height()) {
            return this._$treeList.height();
        }
        this._hasHeight = isDefined(this.option('height')) && this.option('height') !== '';
        return this._hasHeight ? '100%' : '';
    }
    _getTreeListColumns() {
        const columns = this.option('columns');
        if(columns) {
            for(let i = 0; i < columns.length; i++) {
                const column = columns[i];
                const isKeyColumn = column.dataField === this.option(`${GANTT_TASKS}.keyExpr`) || column.dataField === this.option(`${GANTT_TASKS}.parentIdExpr`);
                if(isKeyColumn && !column.dataType) {
                    column.dataType = 'object';
                }
            }
        }
        return columns;
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
    _expandAll() {
        this._treeList.forEachNode(node => {
            if(node.children && node.children.length) {
                this._treeList.expandRow(node.key);
                this._ganttView.changeTaskExpanded(node.key, true);
            }
        });
    }
    _collapseAll() {
        this._treeList.forEachNode(node => {
            if(node.children && node.children.length) {
                this._treeList.collapseRow(node.key);
                this._ganttView.changeTaskExpanded(node.key, false);
            }
        });
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
        let height = $row.length ? getBoundingRect($row.last().get(0)).height : GANTT_DEFAULT_ROW_HEIGHT;
        if(!height) {
            height = GANTT_DEFAULT_ROW_HEIGHT;
        }
        this._correctRowsViewRowHeight(height);
        return height;
    }
    _correctRowsViewRowHeight(height) {
        const view = this._treeList._views && this._treeList._views['rowsView'];
        if(view?._rowHeight !== height) {
            view._rowHeight = height;
        }
    }
    _getTreeListHeaderHeight() {
        return getBoundingRect(this._treeList._$element.find('.dx-treelist-headers').get(0)).height;
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

        const isPercentage = isString(leftPanelWidth) && leftPanelWidth.slice(-1) === '%';
        this._$treeList.width(isPercentage ? '100%' : leftPanelWidth);

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
        const dataSource = this.option(`${name}.dataSource`);
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
        for(const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                getters[exprMatches[1]] = compileGetter(optionValue[exprMatches[0]]);
            }
        }
        return getters;
    }
    _compileSettersByOption(optionName) {
        const setters = {};
        const optionValue = this.option(optionName);
        for(const field in optionValue) {
            const exprMatches = field.match(/(\w*)Expr/);
            if(exprMatches) {
                setters[exprMatches[1]] = compileSetter(optionValue[exprMatches[0]]);
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
    _prepareSetterMapHandler(setters) {
        return (data) => {
            return Object.keys(setters)
                .reduce((previous, key) => {
                    const resultKey = key === 'key' ? 'id' : key;
                    setters[key](previous, data[resultKey]);
                    return previous;
                }, {});
        };
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
            const expandedRowKeys = data.map(t => t[this.option('tasks.parentIdExpr')]).filter((value, index, self) => value && self.indexOf(value) === index);
            this._setTreeListOption('expandedRowKeys', expandedRowKeys);
            this._setTreeListOption('dataSource', data);
        }
    }

    _createModelChangesListener() {
        return { // IModelChangesListener
            NotifyTaskCreated: (task, callback, errorCallback) => { this._onRecordInserted(GANTT_TASKS, task, callback); },
            NotifyTaskRemoved: (taskId, errorCallback) => { this._onRecordRemoved(GANTT_TASKS, taskId); },
            NotifyTaskTitleChanged: (taskId, newValue, errorCallback) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'title', newValue); },
            NotifyTaskDescriptionChanged: (taskId, newValue, errorCallback) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'description', newValue); },
            NotifyTaskStartChanged: (taskId, newValue, errorCallback) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'start', newValue); },
            NotifyTaskEndChanged: (taskId, newValue, errorCallback) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'end', newValue); },
            NotifyTaskProgressChanged: (taskId, newValue, errorCallback) => { this._onRecordUpdated(GANTT_TASKS, taskId, 'progress', newValue); },

            NotifyDependencyInserted: (dependency, callback, errorCallback) => { this._onRecordInserted(GANTT_DEPENDENCIES, dependency, callback); },
            NotifyDependencyRemoved: (dependencyId, errorCallback) => { this._onRecordRemoved(GANTT_DEPENDENCIES, dependencyId); },

            NotifyResourceCreated: (resource, callback, errorCallback) => { this._onRecordInserted(GANTT_RESOURCES, resource, callback); },
            NotifyResourceRemoved: (resource, errorCallback) => { this._onRecordRemoved(GANTT_RESOURCES, resource); },

            NotifyResourceAssigned: (assignment, callback, errorCallback) => { this._onRecordInserted(GANTT_RESOURCE_ASSIGNMENTS, assignment, callback); },
            NotifyResourceUnassigned: (assignmentId, errorCallback) => { this._onRecordRemoved(GANTT_RESOURCE_ASSIGNMENTS, assignmentId); },
            NotifyParentDataRecalculated: (data) => { this._onParentTasksRecalculated(data); },

            NotifyTaskCreating: (args) => { this._raiseInsertingAction(GANTT_TASKS, args); },
            NotifyTaskRemoving: (args) => { this._raiseDeletingAction(GANTT_TASKS, args); },
            NotifyTaskUpdating: (args) => { this._raiseUpdatingAction(GANTT_TASKS, args); },
            NotifyTaskMoving: (args) => { this._raiseUpdatingAction(GANTT_TASKS, args, this._getTaskMovingAction()); },
            NotifyTaskEditDialogShowing: (args) => { this._raiseTaskEditDialogShowingAction(args); },
            NotifyDependencyInserting: (args) => { this._raiseInsertingAction(GANTT_DEPENDENCIES, args); },
            NotifyDependencyRemoving: (args) => { this._raiseDeletingAction(GANTT_DEPENDENCIES, args); },
            NotifyResourceCreating: (args) => { this._raiseInsertingAction(GANTT_RESOURCES, args); },
            NotifyResourceRemoving: (args) => { this._raiseDeletingAction(GANTT_RESOURCES, args); },
            NotifyResourceAssigning: (args) => { this._raiseInsertingAction(GANTT_RESOURCE_ASSIGNMENTS, args); },
            // eslint-disable-next-line spellcheck/spell-checker
            NotifyResourceUnassigning: (args) => { this._raiseDeletingAction(GANTT_RESOURCE_ASSIGNMENTS, args); }
        };
    }
    _onRecordInserted(optionName, record, callback) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            const data = this._getStoreObject(optionName, record);
            if(optionName === GANTT_TASKS) {
                this._addCustomFieldsDataFromCache(GANTT_NEW_TASK_CACHE_KEY, data);
            }

            dataOption.insert(data, (response) => {
                const keyGetter = compileGetter(this.option(`${optionName}.keyExpr`));
                const insertedId = keyGetter(response);
                callback(insertedId);
                if(optionName === GANTT_TASKS) {
                    this._updateTreeListDataSource();
                    const parentId = record.parentId;
                    if(parentId !== undefined) {
                        const expandedRowKeys = this._treeList.option('expandedRowKeys');
                        if(expandedRowKeys.indexOf(parentId) === -1) {
                            expandedRowKeys.push(parentId);
                            this._treeList.option('expandedRowKeys', expandedRowKeys);
                        }
                    }
                    this._setTreeListOption('selectedRowKeys', this._getArrayFromOneElement(insertedId));
                    this._setTreeListOption('focusedRowKey', insertedId);
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
        const isTaskUpdated = optionName === GANTT_TASKS;
        if(dataOption) {
            const setter = compileSetter(this.option(`${optionName}.${fieldName}Expr`));
            const data = {};
            setter(data, value);
            const hasCustomFieldsData = isTaskUpdated && this._cache.hasData(key);
            if(hasCustomFieldsData) {
                this._addCustomFieldsDataFromCache(key, data);
            }
            dataOption.update(key, data, () => {
                if(isTaskUpdated) {
                    if(hasCustomFieldsData) {
                        dataOption._refreshDataSource();
                    }
                    this._updateTreeListDataSource();
                }
            });
        }
    }
    _onParentTasksRecalculated(data) {
        const setters = this._compileSettersByOption(GANTT_TASKS);
        const treeDataSource = this._appendCustomFields(data.map(this._prepareSetterMapHandler(setters)));
        this._setTreeListOption('dataSource', treeDataSource);
    }
    _appendCustomFields(data) {
        const modelData = this._tasksOption && this._tasksOption._getItems();
        const keyGetter = compileGetter(this.option(`${GANTT_TASKS}.keyExpr`));
        return data.reduce((previous, item) => {
            const modelItem = modelData && modelData.filter((obj) => keyGetter(obj) === keyGetter(item))[0];
            if(!modelItem) {
                previous.push(item);
            } else {
                const updatedItem = {};
                for(const field in modelItem) {
                    updatedItem[field] = Object.prototype.hasOwnProperty.call(item, field) ? item[field] : modelItem[field];
                }
                previous.push(updatedItem);
            }
            return previous;
        }, []);
    }
    _updateTreeListDataSource() {
        if(!this._skipUpdateTreeListDataSource()) {
            const dataSource = this.option('tasks.dataSource');
            const storeArray = this._tasksOption._getStore()._array || (dataSource.items && dataSource.items());
            this._setTreeListOption('dataSource', storeArray ? storeArray : dataSource);
        }
    }
    _skipUpdateTreeListDataSource() {
        return this.option('validation.autoUpdateParentTasks');
    }
    // custom fields cache updating
    _addCustomFieldsDataFromCache(key, data) {
        this._cache.pullDataFromCache(key, data);
    }
    _saveCustomFieldsDataToCache(key, data, forceUpdateOnKeyExpire = false) {
        const customFieldsData = this._getCustomFieldsData(data);
        if(Object.keys(customFieldsData).length > 0) {
            const updateCallback = (key, data) => {
                const dataOption = this[`_${GANTT_TASKS}Option`];
                if(dataOption && data) {
                    dataOption.update(key, data, () => {
                        this._updateTreeListDataSource();
                        dataOption._refreshDataSource();
                    });
                }
            };
            this._cache.saveData(key, customFieldsData, forceUpdateOnKeyExpire ? updateCallback : null);
        }
    }
    // end custom fields cache updating

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
    _createTaskClickAction() {
        this._taskClickAction = this._createActionByOption('onTaskClick');
    }
    _createTaskDblClickAction() {
        this._taskDblClickAction = this._createActionByOption('onTaskDblClick');
    }
    _createCustomCommandAction() {
        this._customCommandAction = this._createActionByOption('onCustomCommand');
    }
    _createContextMenuPreparingAction() {
        this._contextMenuPreparingAction = this._createActionByOption('onContextMenuPreparing');
    }
    _raiseSelectionChangedAction(selectedRowKey) {
        if(!this._selectionChangedAction) {
            this._createSelectionChangedAction();
        }
        this._selectionChangedAction({ selectedRowKey: selectedRowKey });
    }
    _raiseCustomCommand(commandName) {
        if(!this._customCommandAction) {
            this._createCustomCommandAction();
        }
        this._customCommandAction({ name: commandName });
    }
    _raiseContextMenuPreparing(options) {
        if(!this._contextMenuPreparingAction) {
            this._createContextMenuPreparingAction();
        }
        this._contextMenuPreparingAction(options);
    }

    _raiseInsertingAction(optionName, coreArgs) {
        const action = this._getInsertingAction(optionName);
        if(action) {
            const args = { cancel: false, values: this._convertCoreToMappedData(optionName, coreArgs.values) };
            action(args);
            coreArgs.cancel = args.cancel;
            coreArgs.values = this._convertMappedToCoreData(optionName, args.values);
            if(optionName === GANTT_TASKS) {
                this._saveCustomFieldsDataToCache(GANTT_NEW_TASK_CACHE_KEY, args.newValues);
            }
        }
    }
    _raiseDeletingAction(optionName, coreArgs) {
        const action = this._getDeletingAction(optionName);
        if(action) {
            const args = { cancel: false, key: coreArgs.key, values: this._convertCoreToMappedData(optionName, coreArgs.values) };
            action(args);
            coreArgs.cancel = args.cancel;
        }
    }
    _raiseUpdatingAction(optionName, coreArgs, action) {
        action = action || this._getUpdatingAction(optionName);
        if(action) {
            const args = {
                cancel: false,
                key: coreArgs.key,
                newValues: this._convertCoreToMappedData(optionName, coreArgs.newValues),
                values: this._convertCoreToMappedData(optionName, coreArgs.values)
            };
            action(args);
            coreArgs.cancel = args.cancel;
            coreArgs.newValues = this._convertMappedToCoreData(optionName, args.newValues);
            if(optionName === GANTT_TASKS) {
                this._saveCustomFieldsDataToCache(args.key, args.newValues);
            }
        }
    }
    _raiseTaskEditDialogShowingAction(coreArgs) {
        const action = this._getTaskEditDialogShowingAction();
        if(action) {
            const args = {
                cancel: false,
                key: coreArgs.key,
                values: this._convertCoreToMappedData(GANTT_TASKS, coreArgs.values),
                readOnlyFields: this._convertCoreToMappedFields(GANTT_TASKS, coreArgs.readOnlyFields),
                hiddenFields: this._convertCoreToMappedFields(GANTT_TASKS, coreArgs.hiddenFields)
            };
            action(args);
            coreArgs.cancel = args.cancel;
            coreArgs.values = this._convertMappedToCoreData(GANTT_TASKS, args.values);
            coreArgs.readOnlyFields = this._convertMappedToCoreFields(GANTT_TASKS, args.readOnlyFields);
            coreArgs.hiddenFields = this._convertMappedToCoreFields(GANTT_TASKS, args.hiddenFields);
        }
    }
    _raiseTaskClickAction(key, event) {
        if(!this._taskClickAction) {
            this._createTaskClickAction();
        }
        const args = {
            key: key,
            event: event,
            data: this.getTaskData(key)
        };
        this._taskClickAction(args);
    }
    _raiseTaskDblClickAction(key, event) {
        if(!this._taskDblClickAction) {
            this._createTaskDblClickAction();
        }
        const args = {
            cancel: false,
            data: this.getTaskData(key),
            event: event,
            key: key
        };
        this._taskDblClickAction(args);
        return !args.cancel;
    }
    _getInsertingAction(optionName) {
        switch(optionName) {
            case GANTT_TASKS:
                return this._getTaskInsertingAction();
            case GANTT_DEPENDENCIES:
                return this._getDependencyInsertingAction();
            case GANTT_RESOURCES:
                return this._getResourceInsertingAction();
            case GANTT_RESOURCE_ASSIGNMENTS:
                return this._getResourceAssigningAction();
        }
        return () => { };
    }
    _getDeletingAction(optionName) {
        switch(optionName) {
            case GANTT_TASKS:
                return this._getTaskDeletingAction();
            case GANTT_DEPENDENCIES:
                return this._getDependencyDeletingAction();
            case GANTT_RESOURCES:
                return this._getResourceDeletingAction();
            case GANTT_RESOURCE_ASSIGNMENTS:
                // eslint-disable-next-line spellcheck/spell-checker
                return this._getResourceUnassigningAction();
        }
        return () => { };
    }
    _getUpdatingAction(optionName) {
        switch(optionName) {
            case GANTT_TASKS:
                return this._getTaskUpdatingAction();
        }
        return () => { };
    }
    _getTaskInsertingAction() {
        if(!this._taskInsertingAction) {
            this._createTaskInsertingAction();
        }
        return this._taskInsertingAction;
    }
    _getTaskDeletingAction() {
        if(!this._taskDeletingAction) {
            this._createTaskDeletingAction();
        }
        return this._taskDeletingAction;
    }
    _getTaskUpdatingAction() {
        if(!this._taskUpdatingAction) {
            this._createTaskUpdatingAction();
        }
        return this._taskUpdatingAction;
    }
    _getTaskMovingAction() {
        if(!this._taskMovingAction) {
            this._createTaskMovingAction();
        }
        return this._taskMovingAction;
    }
    _getTaskEditDialogShowingAction() {
        if(!this._taskEditDialogShowingAction) {
            this._createTaskEditDialogShowingAction();
        }
        return this._taskEditDialogShowingAction;
    }
    _getDependencyInsertingAction() {
        if(!this._dependencyInsertingAction) {
            this._createDependencyInsertingAction();
        }
        return this._dependencyInsertingAction;
    }
    _getDependencyDeletingAction() {
        if(!this._dependencyDeletingAction) {
            this._createDependencyDeletingAction();
        }
        return this._dependencyDeletingAction;
    }
    _getResourceInsertingAction() {
        if(!this._resourceInsertingAction) {
            this._createResourceInsertingAction();
        }
        return this._resourceInsertingAction;
    }
    _getResourceDeletingAction() {
        if(!this._resourceDeletingAction) {
            this._createResourceDeletingAction();
        }
        return this._resourceDeletingAction;
    }
    _getResourceAssigningAction() {
        if(!this._resourceAssigningAction) {
            this._createResourceAssigningAction();
        }
        return this._resourceAssigningAction;
    }
    /* eslint-disable */
    _getResourceUnassigningAction() {
        if(!this._resourceUnassigningAction) {
            this._createResourceUnassigningAction();
        }
        return this._resourceUnassigningAction;
    }
    _createResourceUnassigningAction() {
        this._resourceUnassigningAction = this._createActionByOption('onResourceUnassigning');
    }
    /* eslint-enable */
    _createTaskInsertingAction() {
        this._taskInsertingAction = this._createActionByOption('onTaskInserting');
    }
    _createTaskDeletingAction() {
        this._taskDeletingAction = this._createActionByOption('onTaskDeleting');
    }
    _createTaskUpdatingAction() {
        this._taskUpdatingAction = this._createActionByOption('onTaskUpdating');
    }
    _createTaskMovingAction() {
        this._taskMovingAction = this._createActionByOption('onTaskMoving');
    }
    _createTaskEditDialogShowingAction() {
        this._taskEditDialogShowingAction = this._createActionByOption('onTaskEditDialogShowing');
    }
    _createDependencyInsertingAction() {
        this._dependencyInsertingAction = this._createActionByOption('onDependencyInserting');
    }
    _createDependencyDeletingAction() {
        this._dependencyDeletingAction = this._createActionByOption('onDependencyDeleting');
    }
    _createResourceInsertingAction() {
        this._resourceInsertingAction = this._createActionByOption('onResourceInserting');
    }
    _createResourceDeletingAction() {
        this._resourceDeletingAction = this._createActionByOption('onResourceDeleting');
    }
    _createResourceAssigningAction() {
        this._resourceAssigningAction = this._createActionByOption('onResourceAssigning');
    }
    _convertCoreToMappedData(optionName, coreData) {
        return Object.keys(coreData).reduce((previous, f) => {
            const mappedField = this._getMappedFieldName(optionName, f);
            if(mappedField) {
                const setter = compileSetter(mappedField);
                setter(previous, coreData[f]);
            }
            return previous;
        }, {});
    }
    _convertMappedToCoreData(optionName, mappedData) {
        const coreData = {};
        if(mappedData) {
            const mappedFields = this.option(optionName);
            for(const field in mappedFields) {
                const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
                const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
                if(mappedFieldName && mappedData[mappedFieldName] !== undefined) {
                    const getter = compileGetter(mappedFieldName);
                    const coreFieldName = exprMatches[1];
                    coreData[coreFieldName] = getter(mappedData);
                }
            }
        }
        return coreData;
    }
    _getMappedFieldName(optionName, coreField) {
        let coreFieldName = coreField;
        if(coreField === 'id') {
            coreFieldName = 'key';
        }
        return this.option(`${optionName}.${coreFieldName}Expr`);
    }
    _convertCoreToMappedFields(optionName, fields) {
        return fields.reduce((previous, f) => {
            const mappedField = this._getMappedFieldName(optionName, f);
            if(mappedField) {
                previous.push(mappedField);
            }
            return previous;
        }, []);
    }
    _convertMappedToCoreFields(optionName, fields) {
        const coreFields = [];
        const mappedFields = this.option(optionName);
        for(const field in mappedFields) {
            const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
            const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
            if(mappedFieldName && fields.indexOf(mappedFieldName) > -1) {
                const coreFieldName = exprMatches[1];
                coreFields.push(coreFieldName);
            }
        }
        return coreFields;
    }
    _getTaskMappedFieldNames() {
        const mappedFields = [ ];
        const mappedFieldsData = this.option(GANTT_TASKS);
        for(const field in mappedFieldsData) {
            const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
            const mappedFieldName = exprMatches && mappedFieldsData[exprMatches[0]];
            if(mappedFieldName) {
                mappedFields.push(mappedFieldName);
            }
        }
        return mappedFields;
    }
    _getTaskCustomFields() {
        const columns = this.option('columns');
        const columnFields = columns && columns.map(c => c.dataField);
        const mappedFields = this._getTaskMappedFieldNames();
        return columnFields ? columnFields.filter(f => mappedFields.indexOf(f) < 0) : [];
    }
    _getCustomFieldsData(data) {
        return this._getTaskCustomFields()
            .reduce((previous, field) => {
                if(data && data[field] !== undefined) {
                    previous[field] = data[field];
                }
                return previous;
            }, {});
    }
    _addCustomFieldsData(key, data) {
        if(data) {
            const modelData = this._tasksOption && this._tasksOption._getItems();
            const keyGetter = compileGetter(this.option(`${GANTT_TASKS}.keyExpr`));
            const modelItem = modelData && modelData.filter((obj) => keyGetter(obj) === key)[0];
            const customFields = this._getTaskCustomFields();
            for(let i = 0; i < customFields.length; i++) {
                const field = customFields[i];
                if(Object.prototype.hasOwnProperty.call(modelItem, field)) {
                    data[field] = modelItem[field];
                }
            }
        }
    }

    _getSelectionMode(allowSelection) {
        return allowSelection ? 'single' : 'none';
    }
    _getArrayFromOneElement(element) {
        return element === undefined || element === null ? [] : [element];
    }

    _getToolbarItems() {
        const items = this.option('toolbar.items');
        return items ? items : [];
    }
    _updateToolbarContent() {
        const items = this._getToolbarItems();
        if(items.length) {
            this._$toolbarWrapper.show();
        } else {
            this._$toolbarWrapper.hide();
        }
        this._toolbar && this._toolbar.createItems(items);
        this._updateBarItemsState();
    }
    _updateContextMenu() {
        const contextMenuOptions = this.option('contextMenu');
        if(contextMenuOptions.enabled && this._contextMenuBar) {
            this._contextMenuBar.createItems(contextMenuOptions.items);
            this._updateBarItemsState();
        }
    }
    _updateBarItemsState() {
        this._ganttView && this._ganttView.updateBarItemsState();
    }

    _showDialog(e) {
        if(!this._dialogInstance) {
            this._dialogInstance = new GanttDialog(this, this._$dialog);
        }
        this._dialogInstance.show(e.name, e.parameters, e.callback, e.afterClosing, this.option('editing'));
    }
    _showPopupMenu(info) {
        if(this.option('contextMenu.enabled')) {
            this._ganttView.getBarManager().updateContextMenu();
            const args = {
                cancel: false,
                event: info.event,
                targetType: info.type,
                targetKey: info.key,
                items: extend(true, [], this._contextMenuBar._items),
                data: info.type === 'task' ? this.getTaskData(info.key) : this.getDependencyData(info.key)
            };
            this._raiseContextMenuPreparing(args);
            if(!args.cancel) {
                this._contextMenuBar.show(info.position, args.items);
            }
        }
    }
    _executeCoreCommand(id) {
        this._ganttView.executeCoreCommand(id);
    }

    _clean() {
        delete this._ganttView;
        delete this._dialogInstance;
        super._clean();
    }

    _getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
        const isTooltipShowing = true;
        const template = taskTooltipContentTemplateOption && this._getTemplate(taskTooltipContentTemplateOption);
        const createTemplateFunction = template && ((container, item) => {
            template.render({
                model: this.getTaskDataByCoreData(item),
                container: getPublicElement($(container))
            });
            return isTooltipShowing;
        });
        return createTemplateFunction;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxGanttStripLine
            * @type object
            */

            /**
            * @name dxGanttOptions.rtlEnabled
            * @hidden
            */

            /**
            * @name dxGanttToolbar
            * @type object
            */

            /**
            * @name dxGanttToolbarItem
            * @inherits dxToolbarItem
            */

            /**
            * @name dxGanttContextMenu
            * @type object
            */

            /**
            * @name dxGanttContextMenuItem
            * @inherits dxContextMenuItem
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
                titleExpr: 'title',
                /**
                * @name dxGanttOptions.tasks.colorExpr
                * @type string|function
                * @default "color"
                */
                colorExpr: 'color'
            },
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
                textExpr: 'text',
                /**
                * @name dxGanttOptions.resources.colorExpr
                * @type string|function
                * @default "color"
                */
                colorExpr: 'color'
            },
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
            columns: undefined,
            taskListWidth: 300,
            showResources: true,
            taskTitlePosition: 'inside',
            firstDayOfWeek: undefined,
            selectedRowKey: undefined,
            onSelectionChanged: null,
            onTaskClick: null,
            onTaskDblClick: null,
            onTaskInserting: null,
            onTaskDeleting: null,
            onTaskUpdating: null,
            onTaskMoving: null,
            onTaskEditDialogShowing: null,
            onDependencyInserting: null,
            onDependencyDeleting: null,
            onResourceInserting: null,
            onResourceDeleting: null,
            onResourceAssigning: null,
            // eslint-disable-next-line spellcheck/spell-checker
            onResourceUnassigning: null,
            onCustomCommand: null,
            onContextMenuPreparing: null,
            allowSelection: true,
            showRowLines: true,
            stripLines: undefined,
            scaleType: 'auto',
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
                allowResourceUpdating: true,
                /**
                * @name dxGanttOptions.editing.allowTaskResourceUpdating
                * @type boolean
                * @default true
                */
                allowTaskResourceUpdating: true
            },
            validation: {
                /**
                * @name dxGanttOptions.validation.validateDependencies
                * @type boolean
                * @default false
                */
                validateDependencies: false,
                /**
                * @name dxGanttOptions.validation.autoUpdateParentTasks
                * @type boolean
                * @default false
                */
                autoUpdateParentTasks: false
            },
            toolbar: null,
            contextMenu: {
                enabled: true,
                items: undefined
            },
            taskTooltipContentTemplate: null,
            rootValue: 0
        });
    }

    getTaskResources(key) {
        if(!isDefined(key)) {
            return null;
        }
        const coreData = this._ganttView._ganttViewCore.getTaskResources(key);
        return coreData.map(r => this._convertCoreToMappedData(GANTT_RESOURCES, r));
    }
    getVisibleTaskKeys() {
        return this._ganttView._ganttViewCore.getVisibleTaskKeys();
    }
    getVisibleDependencyKeys() {
        return this._ganttView._ganttViewCore.getVisibleDependencyKeys();
    }
    getVisibleResourceKeys() {
        return this._ganttView._ganttViewCore.getVisibleResourceKeys();
    }
    getVisibleResourceAssignmentKeys() {
        return this._ganttView._ganttViewCore.getVisibleResourceAssignmentKeys();
    }

    getTaskData(key) {
        if(!isDefined(key)) {
            return null;
        }
        const coreData = this._ganttView._ganttViewCore.getTaskData(key);
        const mappedData = this.getTaskDataByCoreData(coreData);
        return mappedData;
    }
    getTaskDataByCoreData(coreData) {
        const mappedData = coreData ? this._convertCoreToMappedData(GANTT_TASKS, coreData) : null;
        this._addCustomFieldsData(coreData.id, mappedData);
        return mappedData;
    }
    insertTask(data) {
        this._saveCustomFieldsDataToCache(GANTT_NEW_TASK_CACHE_KEY, data);
        this._ganttView._ganttViewCore.insertTask(this._convertMappedToCoreData(GANTT_TASKS, data));
    }
    deleteTask(key) {
        this._ganttView._ganttViewCore.deleteTask(key);
    }
    updateTask(key, data) {
        this._saveCustomFieldsDataToCache(key, data, true);
        this._ganttView._ganttViewCore.updateTask(key, this._convertMappedToCoreData(GANTT_TASKS, data));
    }
    getDependencyData(key) {
        if(!isDefined(key)) {
            return null;
        }
        const coreData = this._ganttView._ganttViewCore.getDependencyData(key);
        return coreData ? this._convertCoreToMappedData(GANTT_DEPENDENCIES, coreData) : null;
    }
    insertDependency(data) {
        this._ganttView._ganttViewCore.insertDependency(this._convertMappedToCoreData(GANTT_DEPENDENCIES, data));
    }
    deleteDependency(key) {
        this._ganttView._ganttViewCore.deleteDependency(key);
    }
    getResourceData(key) {
        const coreData = this._ganttView._ganttViewCore.getResourceData(key);
        return coreData ? this._convertCoreToMappedData(GANTT_RESOURCES, coreData) : null;
    }
    deleteResource(key) {
        this._ganttView._ganttViewCore.deleteResource(key);
    }
    insertResource(data, taskKeys) {
        this._ganttView._ganttViewCore.insertResource(this._convertMappedToCoreData(GANTT_RESOURCES, data), taskKeys);
    }
    getResourceAssignmentData(key) {
        const coreData = this._ganttView._ganttViewCore.getResourceAssignmentData(key);
        return coreData ? this._convertCoreToMappedData(GANTT_RESOURCE_ASSIGNMENTS, coreData) : null;
    }
    assignResourceToTask(resourceKey, taskKey) {
        this._ganttView._ganttViewCore.assignResourceToTask(resourceKey, taskKey);
    }
    // eslint-disable-next-line spellcheck/spell-checker
    unassignResourceFromTask(resourceKey, taskKey) {
        // eslint-disable-next-line spellcheck/spell-checker
        this._ganttView._ganttViewCore.unassignResourceFromTask(resourceKey, taskKey);
    }

    updateDimensions() {
        this._setInnerElementsWidth();
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
                this._setTreeListOption('columns', this._getTreeListColumns());
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
            case 'firstDayOfWeek':
                this._setGanttViewOption('firstDayOfWeek', args.value);
                break;
            case 'selectedRowKey':
                this._setTreeListOption('selectedRowKeys', this._getArrayFromOneElement(args.value));
                break;
            case 'onSelectionChanged':
                this._createSelectionChangedAction();
                break;
            case 'onTaskClick':
                this._createTaskClickAction();
                break;
            case 'onTaskDblClick':
                this._createTaskDblClickAction();
                break;
            case 'onTaskInserting':
                this._createTaskInsertingAction();
                break;
            case 'onTaskDeleting':
                this._createTaskDeletingAction();
                break;
            case 'onTaskUpdating':
                this._createTaskUpdatingAction();
                break;
            case 'onTaskMoving':
                this._createTaskMovingAction();
                break;
            case 'onTaskEditDialogShowing':
                this._createTaskEditDialogShowingAction();
                break;
            case 'onDependencyInserting':
                this._createDependencyInsertingAction();
                break;
            case 'onDependencyDeleting':
                this._createDependencyDeletingAction();
                break;
            case 'onResourceInserting':
                this._createResourceInsertingAction();
                break;
            case 'onResourceDeleting':
                this._createResourceDeletingAction();
                break;
            case 'onResourceAssigning':
                this._createResourceAssigningAction();
                break;
            case 'onResourceUnassigning':
                // eslint-disable-next-line spellcheck/spell-checker
                this._createResourceUnassigningAction();
                break;
            case 'onCustomCommand':
                this._createCustomCommandAction();
                break;
            case 'onContextMenuPreparing':
                this._createContextMenuPreparingAction();
                break;
            case 'allowSelection':
                this._setTreeListOption('selection.mode', this._getSelectionMode(args.value));
                this._setGanttViewOption('allowSelection', args.value);
                break;
            case 'showRowLines':
                this._setTreeListOption('showRowLines', args.value);
                this._setGanttViewOption('showRowLines', args.value);
                break;
            case 'stripLines':
                this._setGanttViewOption('stripLines', args.value);
                break;
            case 'scaleType':
                this._setGanttViewOption('scaleType', args.value);
                break;
            case 'editing':
                this._setGanttViewOption('editing', this.option(args.name));
                break;
            case 'validation':
                this._setGanttViewOption('validation', this.option(args.name));
                break;
            case 'toolbar':
                this._updateToolbarContent();
                break;
            case 'contextMenu':
                this._updateContextMenu();
                break;
            case 'taskTooltipContentTemplate':
                this._setGanttViewOption('taskTooltipContentTemplate', this._getTaskTooltipContentTemplateFunc(args.value));
                break;
            case 'rootValue':
                this._setTreeListOption('rootValue', args.value);
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxGantt', Gantt);
export default Gantt;
