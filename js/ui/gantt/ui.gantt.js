import $ from '../../core/renderer';
import { compileGetter, compileSetter } from '../../core/utils/data';
import { extend } from '../../core/utils/extend';
import { getWindow } from '../../core/utils/window';
import { isDefined } from '../../core/utils/type';
import { ModelChangesListener } from './ui.gantt.model_changes_listener';
import DataOption from './ui.gantt.data.option';
import LoadPanel from '../load_panel';
import registerComponent from '../../core/component_registrator';
import SplitterControl from '../splitter';
import Widget from '../widget/ui.widget';
import { GanttActionsManager } from './ui.gantt.actions';
import { GanttCustomFieldsManager } from './ui.gantt.custom_fields';
import { GanttDialog } from './ui.gantt.dialogs';
import { GanttExportHelper } from './ui.gantt.export_helper';
import { GanttHelper } from './ui.gantt.helper';
import { GanttMappingHelper } from './ui.gantt.mapping_helper';
import { GanttSizeHelper } from './ui.gantt.size_helper';
import { GanttTemplatesManager } from './ui.gantt.templates';
import { GanttToolbar, GanttContextMenuBar } from './ui.gantt.bars';
import { GanttTreeList } from './ui.gantt.treelist';
import { GanttView } from './ui.gantt.view';


const window = getWindow();

// STYLE gantt
const GANTT_CLASS = 'dx-gantt';
const GANTT_VIEW_CLASS = 'dx-gantt-view';
const GANTT_TREE_LIST_WRAPPER = 'dx-gantt-treelist-wrapper';
const GANTT_TOOLBAR_WRAPPER = 'dx-gantt-toolbar-wrapper';
const GANTT_MAIN_WRAPPER = 'dx-gantt-main-wrapper';

const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';

const GANTT_NEW_TASK_CACHE_KEY = 'gantt_new_task_key';

class Gantt extends Widget {
    _init() {
        super._init();
        this._isGanttRendered = false;
        this._initHelpers();
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
    _clean() {
        this._ganttView?._ganttViewCore.cleanMarkup();
        delete this._ganttView;
        delete this._dialogInstance;
        super._clean();
    }
    _refresh() {
        this._isGanttRendered = false;
        super._refresh();
    }

    _renderContent() {
        this._isMainElementVisible = this.$element().is(':visible');
        if(this._isMainElementVisible && !this._isGanttRendered) {
            this._isGanttRendered = true;
            this._initHelpers();
            this._renderBars();
            this._renderTreeList();
            this._renderSplitter();
        }
    }
    _renderTreeList() {
        this._ganttTreeList = new GanttTreeList(this);
        this._treeList = this._ganttTreeList.getTreeList();
    }
    _renderSplitter() {
        this._splitter = this._createComponent(this._$splitter, SplitterControl, {
            container: this.$element(),
            leftElement: this._$treeListWrapper,
            rightElement: this._$ganttView,
            onApplyPanelSize: (e) => { this._sizeHelper.onApplyPanelSize(e); }
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
    _initHelpers() {
        this._mappingHelper = new GanttMappingHelper(this);
        this._customFieldsManager = new GanttCustomFieldsManager(this);
        this._actionsManager = new GanttActionsManager(this);
        this._ganttTemplatesManager = new GanttTemplatesManager(this);
        this._sizeHelper = new GanttSizeHelper(this);
    }
    _initGanttView() {
        if(this._ganttView) {
            return;
        }
        this._ganttView = this._createComponent(this._$ganttView, GanttView, {
            width: '100%',
            height: this._ganttTreeList.getOffsetHeight(),
            rowHeight: this._ganttTreeList.getRowHeight(),
            headerHeight: this._ganttTreeList.getHeaderHeight(),
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
            onSelectionChanged: (e) => { this._ganttTreeList.selectRows(GanttHelper.getArrayFromOneElement(e.id)); },
            onScroll: (e) => { this._ganttTreeList.scrollBy(e.scrollTop); },
            onDialogShowing: this._showDialog.bind(this),
            onPopupMenuShowing: this._showPopupMenu.bind(this),
            onExpandAll: this._expandAll.bind(this),
            onCollapseAll: this._collapseAll.bind(this),
            modelChangesListener: ModelChangesListener.create(this),
            exportHelper: this._getExportHelper(),
            taskTooltipContentTemplate: this._ganttTemplatesManager.getTaskTooltipContentTemplateFunc(this.option('taskTooltipContentTemplate')),
            taskProgressTooltipContentTemplate: this._ganttTemplatesManager.getTaskProgressTooltipContentTemplateFunc(this.option('taskProgressTooltipContentTemplate')),
            taskTimeTooltipContentTemplate: this._ganttTemplatesManager.getTaskTimeTooltipContentTemplateFunc(this.option('taskTimeTooltipContentTemplate')),
            taskContentTemplate: this._ganttTemplatesManager.getTaskContentTemplateFunc(this.option('taskContentTemplate')),
            onTaskClick: (e) => { this._ganttTreeList.onRowClick(e); },
            onTaskDblClick: (e) => { this._ganttTreeList.onRowDblClick(e); },
            onAdjustControl: () => { this._sizeHelper.onAdjustControl(); }
        });
        this._fireContentReadyAction();
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
    _dataSourceChanged(dataSourceName, data) {
        const getters = GanttHelper.compileGettersByOption(this.option(dataSourceName));
        const mappedData = data.map(GanttHelper.prepareMapHandler(getters));

        this[`_${dataSourceName}`] = mappedData;
        this._setGanttViewOption(dataSourceName, mappedData);
        if(dataSourceName === GANTT_TASKS) {
            this._tasksRaw = data;
            const expandedRowKeys = data.map(t => t[this.option('tasks.parentIdExpr')]).filter((value, index, self) => value && self.indexOf(value) === index);
            this._ganttTreeList?.setOption('expandedRowKeys', expandedRowKeys);
            this._ganttTreeList?.setOption('dataSource', data);
        }
    }

    _onRecordInserted(optionName, record, callback) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            const data = GanttHelper.getStoreObject(this.option(optionName), record);
            if(optionName === GANTT_TASKS) {
                this._customFieldsManager.addCustomFieldsDataFromCache(GANTT_NEW_TASK_CACHE_KEY, data);
            }

            dataOption.insert(data, (response) => {
                const keyGetter = compileGetter(this.option(`${optionName}.keyExpr`));
                const insertedId = keyGetter(response);
                callback(insertedId);
                if(optionName === GANTT_TASKS) {
                    this._ganttTreeList.updateDataSource();
                    const parentId = record.parentId;
                    if(parentId !== undefined) {
                        const expandedRowKeys = this._ganttTreeList?.getOption('expandedRowKeys');
                        if(expandedRowKeys.indexOf(parentId) === -1) {
                            expandedRowKeys.push(parentId);
                            this._ganttTreeList?.setOption('expandedRowKeys', expandedRowKeys);
                        }
                    }
                    this._ganttTreeList.selectRows(GanttHelper.getArrayFromOneElement(insertedId));
                    this._ganttTreeList?.setOption('focusedRowKey', insertedId);
                    setTimeout(() => {
                        this._sizeHelper.updateGanttRowHeights();
                    }, 300);
                }
                dataOption._reloadDataSource();
                this._actionsManager.raiseInsertedAction(optionName, data, insertedId);
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
            const hasCustomFieldsData = isTaskUpdated && this._customFieldsManager.cache.hasData(key);
            if(hasCustomFieldsData) {
                this._customFieldsManager.addCustomFieldsDataFromCache(key, data);
            }
            dataOption.update(key, data, () => {
                if(isTaskUpdated) {
                    this._ganttTreeList.updateDataSource();
                }
                dataOption._reloadDataSource();
                this._actionsManager.raiseUpdatedAction(optionName, data, key);
            });
        }
    }
    _onRecordRemoved(optionName, key, data) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            dataOption.remove(key, () => {
                if(optionName === GANTT_TASKS) {
                    this._ganttTreeList.updateDataSource();
                }
                dataOption._reloadDataSource();
                this._actionsManager.raiseDeletedAction(optionName, key, this._mappingHelper.convertCoreToMappedData(optionName, data));
            });
        }
    }
    _onParentTaskUpdated(data) {
        const mappedData = this.getTaskDataByCoreData(data);
        this._actionsManager.raiseUpdatedAction(GANTT_TASKS, mappedData, data.id);
    }
    _onParentTasksRecalculated(data) {
        const setters = GanttHelper.compileSettersByOption(this.option(GANTT_TASKS));
        const treeDataSource = this._customFieldsManager.appendCustomFields(data.map(GanttHelper.prepareSetterMapHandler(setters)));
        this._ganttTreeList?.setOption('dataSource', treeDataSource);
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
            this._actionsManager.raiseContextMenuPreparing(args);
            if(!args.cancel) {
                this._contextMenuBar.show(info.position, args.items);
            }
        }
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

    _getTaskKeyGetter() {
        return compileGetter(this.option(`${GANTT_TASKS}.keyExpr`));
    }
    _setGanttViewOption(optionName, value) {
        this._ganttView && this._ganttView.option(optionName, value);
    }
    _getGanttViewOption(optionName, value) {
        return this._ganttView?.option(optionName);
    }

    _getExportHelper() {
        this._exportHelper ??= new GanttExportHelper(this);
        return this._exportHelper;
    }

    _executeCoreCommand(id) {
        this._ganttView.executeCoreCommand(id);
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

    getTaskResources(key) {
        if(!isDefined(key)) {
            return null;
        }
        const coreData = this._ganttView._ganttViewCore.getTaskResources(key);
        return coreData.map(r => this._mappingHelper.convertCoreToMappedData(GANTT_RESOURCES, r));
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
        const mappedData = coreData ? this._mappingHelper.convertCoreToMappedData(GANTT_TASKS, coreData) : null;
        this._customFieldsManager.addCustomFieldsData(coreData.id, mappedData);
        return mappedData;
    }
    insertTask(data) {
        this._customFieldsManager.saveCustomFieldsDataToCache(GANTT_NEW_TASK_CACHE_KEY, data);
        this._ganttView._ganttViewCore.insertTask(this._mappingHelper.convertMappedToCoreData(GANTT_TASKS, data));
    }
    deleteTask(key) {
        this._ganttView._ganttViewCore.deleteTask(key);
    }
    updateTask(key, data) {
        const coreTaskData = this._mappingHelper.convertMappedToCoreData(GANTT_TASKS, data);
        const isCustomFieldsUpdateOnly = !Object.keys(coreTaskData).length;
        this._customFieldsManager.saveCustomFieldsDataToCache(key, data, true, isCustomFieldsUpdateOnly);
        this._ganttView._ganttViewCore.updateTask(key, coreTaskData);
    }
    getDependencyData(key) {
        if(!isDefined(key)) {
            return null;
        }
        const coreData = this._ganttView._ganttViewCore.getDependencyData(key);
        return coreData ? this._mappingHelper.convertCoreToMappedData(GANTT_DEPENDENCIES, coreData) : null;
    }
    insertDependency(data) {
        this._ganttView._ganttViewCore.insertDependency(this._mappingHelper.convertMappedToCoreData(GANTT_DEPENDENCIES, data));
    }
    deleteDependency(key) {
        this._ganttView._ganttViewCore.deleteDependency(key);
    }
    getResourceData(key) {
        const coreData = this._ganttView._ganttViewCore.getResourceData(key);
        return coreData ? this._mappingHelper.convertCoreToMappedData(GANTT_RESOURCES, coreData) : null;
    }
    deleteResource(key) {
        this._ganttView._ganttViewCore.deleteResource(key);
    }
    insertResource(data, taskKeys) {
        this._ganttView._ganttViewCore.insertResource(this._mappingHelper.convertMappedToCoreData(GANTT_RESOURCES, data), taskKeys);
    }
    getResourceAssignmentData(key) {
        const coreData = this._ganttView._ganttViewCore.getResourceAssignmentData(key);
        return coreData ? this._mappingHelper.convertCoreToMappedData(GANTT_RESOURCE_ASSIGNMENTS, coreData) : null;
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
        this._sizeHelper.onAdjustControl();
    }
    scrollToDate(date) {
        this._ganttView._ganttViewCore.scrollToDate(date);
    }
    showResourceManagerDialog() {
        this._ganttView._ganttViewCore.showResourcesDialog();
    }
    exportToPdf(options) {
        this._exportHelper.reset();
        const fullOptions = extend({}, options);
        if(fullOptions.createDocumentMethod) {
            fullOptions.docCreateMethod = fullOptions.createDocumentMethod;
        }
        fullOptions.docCreateMethod ??= window['jspdf']?.['jsPDF'] ?? window['jsPDF'];
        fullOptions.format ??= 'a4';
        return new Promise((resolve) => {
            const doc = this._ganttView?._ganttViewCore.exportToPdf(fullOptions);
            resolve(doc);
        });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), GanttHelper.getDefaultOptions());
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
                this._ganttTreeList?.setOption('columns', this._ganttTreeList.getColumns());
                break;
            case 'taskListWidth':
                this._sizeHelper?.setInnerElementsWidth();
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
                this._ganttTreeList?.selectRows(GanttHelper.getArrayFromOneElement(args.value));
                break;
            case 'onSelectionChanged':
                this._actionsManager?.createSelectionChangedAction();
                break;
            case 'onTaskClick':
                this._actionsManager?.createTaskClickAction();
                break;
            case 'onTaskDblClick':
                this._actionsManager?.createTaskDblClickAction();
                break;
            case 'onTaskInserting':
                this._actionsManager?.createTaskInsertingAction();
                break;
            case 'onTaskInserted':
                this._actionsManager?.createTaskInsertedAction();
                break;
            case 'onTaskDeleting':
                this._actionsManager?.createTaskDeletingAction();
                break;
            case 'onTaskDeleted':
                this._actionsManager?.createTaskDeletedAction();
                break;
            case 'onTaskUpdating':
                this._actionsManager?.createTaskUpdatingAction();
                break;
            case 'onTaskUpdated':
                this._actionsManager?.createTaskUpdatedAction();
                break;
            case 'onTaskMoving':
                this._actionsManager?.createTaskMovingAction();
                break;
            case 'onTaskEditDialogShowing':
                this._actionsManager?.createTaskEditDialogShowingAction();
                break;
            case 'onResourceManagerDialogShowing':
                this._actionsManager?.createResourceManagerDialogShowingAction();
                break;
            case 'onDependencyInserting':
                this._actionsManager?.createDependencyInsertingAction();
                break;
            case 'onDependencyInserted':
                this._actionsManager?.createDependencyInsertedAction();
                break;
            case 'onDependencyDeleting':
                this._actionsManager?.createDependencyDeletingAction();
                break;
            case 'onDependencyDeleted':
                this._actionsManager?.createDependencyDeletedAction();
                break;
            case 'onResourceInserting':
                this._actionsManager?.createResourceInsertingAction();
                break;
            case 'onResourceInserted':
                this._actionsManager?.createResourceInsertedAction();
                break;
            case 'onResourceDeleting':
                this._actionsManager?.createResourceDeletingAction();
                break;
            case 'onResourceDeleted':
                this._actionsManager?.createResourceDeletedAction();
                break;
            case 'onResourceAssigning':
                this._actionsManager?.createResourceAssigningAction();
                break;
            case 'onResourceAssigned':
                this._actionsManager?.createResourceAssignedAction();
                break;
            case 'onResourceUnassigning':
                // eslint-disable-next-line spellcheck/spell-checker
                this._actionsManager?.createResourceUnassigningAction();
                break;
            case 'onResourceUnassigned':
                // eslint-disable-next-line spellcheck/spell-checker
                this._actionsManager?.createResourceUnassignedAction();
                break;
            case 'onCustomCommand':
                this._actionsManager?.createCustomCommandAction();
                break;
            case 'onContextMenuPreparing':
                this._actionsManager?.createContextMenuPreparingAction();
                break;
            case 'allowSelection':
                this._ganttTreeList?.setOption('selection.mode', GanttHelper.getSelectionMode(args.value));
                this._setGanttViewOption('allowSelection', args.value);
                break;
            case 'showRowLines':
                this._ganttTreeList?.setOption('showRowLines', args.value);
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
                this._setGanttViewOption('taskTooltipContentTemplate', this._ganttTemplatesManager?.getTaskTooltipContentTemplateFunc(args.value));
                break;
            case 'taskProgressTooltipContentTemplate':
                this._setGanttViewOption('taskProgressTooltipContentTemplate', this._ganttTemplatesManager?.getTaskProgressTooltipContentTemplateFunc(args.value));
                break;
            case 'taskTimeTooltipContentTemplate':
                this._setGanttViewOption('taskTimeTooltipContentTemplate', this._ganttTemplatesManager?.getTaskTimeTooltipContentTemplateFunc(args.value));
                break;
            case 'taskContentTemplate':
                this._setGanttViewOption('taskContentTemplate', this._ganttTemplatesManager?.getTaskContentTemplateFunc(args.value));
                break;
            case 'rootValue':
                this._ganttTreeList?.setOption('rootValue', args.value);
                break;
            case 'width':
                super._optionChanged(args);
                this._sizeHelper?.updateGanttWidth();
                break;
            case 'height':
                super._optionChanged(args);
                this._sizeHelper?.setGanttHeight(this._$element.height());
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxGantt', Gantt);
export default Gantt;
