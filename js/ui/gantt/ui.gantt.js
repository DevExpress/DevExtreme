import { getHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { compileGetter } from '../../core/utils/data';
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
import { GanttDataChangesProcessingHelper } from './ui.gantt.data_changes_processing_helper';
import gridCoreUtils from '../grid_core/ui.grid_core.utils';

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

        gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);

        this._initGantt();
        this._isGanttRendered = false;
        this._initHelpers();
    }
    _initGantt() {
        this._refreshDataSources();
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
    }
    _clean() {
        this._ganttView?._ganttViewCore.cleanMarkup();
        delete this._ganttView;
        delete this._dialogInstance;
        delete this._loadPanel;
        delete this._exportHelper;
        super._clean();
    }
    _refresh() {
        this._isGanttRendered = false;
        this._contentReadyRaised = false;
        super._refresh();
    }
    _fireContentReadyAction() {
        if(!this._contentReadyRaised) {
            super._fireContentReadyAction();
        }
        this._contentReadyRaised = true;
    }
    _dimensionChanged() {
        this._ganttView?._onDimensionChanged();
    }
    _visibilityChanged(visible) {
        if(visible) {
            this._refreshGantt();
        }
    }
    _refreshGantt() {
        this._refreshDataSources();
        this._refresh();
    }
    _refreshDataSources() {
        this._refreshDataSource(GANTT_TASKS);
        this._refreshDataSource(GANTT_DEPENDENCIES);
        this._refreshDataSource(GANTT_RESOURCES);
        this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS);
    }

    _renderContent() {
        this._isMainElementVisible = this.$element().is(':visible');
        if(this._isMainElementVisible && !this._isGanttRendered) {
            this._isGanttRendered = true;
            this._renderBars();
            this._renderTreeList();
            this._renderSplitter();
        }
    }
    _renderTreeList() {
        this._ganttTreeList = new GanttTreeList(this);
        this._treeList = this._ganttTreeList.getTreeList();
        this._ganttTreeList.onAfterTreeListCreate();
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
        this._dataProcessingHelper = new GanttDataChangesProcessingHelper();
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
            showDependencies: this.option('showDependencies'),
            startDateRange: this.option('startDateRange'),
            endDateRange: this.option('endDateRange'),
            taskTitlePosition: this.option('taskTitlePosition'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            showRowLines: this.option('showRowLines'),
            scaleType: this.option('scaleType'),
            scaleTypeRange: this.option('scaleTypeRange'),
            editing: this.option('editing'),
            validation: this.option('validation'),
            stripLines: this.option('stripLines'),
            bars: this._bars,
            mainElement: this.$element(),
            onSelectionChanged: (e) => { this._ganttTreeList.selectRows(GanttHelper.getArrayFromOneElement(e.id)); },
            onScroll: (e) => { this._ganttTreeList.scrollBy(e.scrollTop); },
            onDialogShowing: this._showDialog.bind(this),
            onPopupMenuShowing: this._showPopupMenu.bind(this),
            onPopupMenuHiding: this._hidePopupMenu.bind(this),
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
            onAdjustControl: () => { this._sizeHelper.onAdjustControl(); },
            onContentReady: this._onGanttViewContentReady.bind(this)
        });
    }
    _onGanttViewContentReady(e) {
        if(!this._isParentAutoUpdateMode()) {
            this._fireContentReadyAction();
        }
    }
    _isParentAutoUpdateMode() {
        return this.option('validation.autoUpdateParentTasks');
    }
    _onTreeListContentReady(e) {
        if(this._isParentAutoUpdateMode() && this._treeListParentRecalculatedDataUpdating) {
            this._fireContentReadyAction();
        }
        delete this._treeListParentRecalculatedDataUpdating;

        this._dataProcessingHelper.onTreeListReady();
    }
    _refreshDataSource(name) {
        let dataOption = this[`_${name}Option`];
        if(dataOption) {
            dataOption.dispose();
            delete this[`_${name}Option`];
            delete this[`_${name}`];
        }

        dataOption = new DataOption(name, this._getLoadPanel.bind(this), (name, data) => {
            this._dataSourceChanged(name, data);
        });
        dataOption.option('dataSource', this._getSpecificDataSourceOption(name));
        dataOption._refreshDataSource();
        this[`_${name}Option`] = dataOption;
    }
    _getSpecificDataSourceOption(name) {
        const dataSource = this.option(`${name}.dataSource`);
        if(!dataSource || Array.isArray(dataSource)) {
            return {
                store: {
                    type: 'array',
                    data: dataSource ?? [],
                    key: this.option(`${name}.keyExpr`)
                }
            };
        }
        return dataSource;
    }
    _dataSourceChanged(dataSourceName, data) {
        const getters = GanttHelper.compileGettersByOption(this.option(dataSourceName));
        const validatedData = this._validateSourceData(dataSourceName, data);
        const mappedData = validatedData.map(GanttHelper.prepareMapHandler(getters));

        this[`_${dataSourceName}`] = mappedData;
        this._setGanttViewOption(dataSourceName, mappedData);
        if(dataSourceName === GANTT_TASKS) {
            this._tasksRaw = validatedData;
            const forceUpdate = !this._ganttTreeList?.getDataSource() && !this._ganttView;
            this._ganttTreeList?.saveExpandedKeys();
            this._ganttTreeList?.updateDataSource(validatedData, forceUpdate);
        }
    }
    _validateSourceData(dataSourceName, data) {
        return data && dataSourceName === GANTT_TASKS ? this._validateTaskData(data) : data;
    }
    _validateTaskData(data) {
        const keyGetter = compileGetter(this.option(`${GANTT_TASKS}.keyExpr`));
        const parentIdGetter = compileGetter(this.option(`${GANTT_TASKS}.parentIdExpr`));
        const rootValue = this.option('rootValue') ?? 'dx_dxt_gantt_default_root_value';

        const validationTree = { };
        for(let i = 0; i < data.length; i++) {
            const item = data[i];
            if(item) {
                const key = keyGetter(item);
                const isRootTask = key === rootValue;
                const treeItem = validationTree[key] ??= { key: key, children: [ ] };
                if(!isRootTask) {
                    const parentId = parentIdGetter(item) ?? rootValue;
                    const parentTreeItem = validationTree[parentId] ??= { key: parentId, children: [ ] };
                    parentTreeItem.children.push(treeItem);
                    treeItem.parent = parentTreeItem;
                }
            }
        }
        const validKeys = [ rootValue ];
        this._appendChildKeys(validationTree[rootValue], validKeys);

        return data.filter(item => validKeys.indexOf(keyGetter(item)) > -1);
    }
    _appendChildKeys(treeItem, keys) {
        const children = treeItem?.children;
        for(let i = 0; i < children?.length; i++) {
            const child = children[i];
            keys.push(child.key);
            this._appendChildKeys(child, keys);
        }
    }

    _onRecordInserted(optionName, record, callback) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            const data = GanttHelper.getStoreObject(this.option(optionName), record);
            const isTaskInsert = optionName === GANTT_TASKS;
            if(isTaskInsert) {
                this._customFieldsManager.addCustomFieldsDataFromCache(GANTT_NEW_TASK_CACHE_KEY, data);
            }

            dataOption.insert(data, (response) => {
                const keyGetter = compileGetter(this.option(`${optionName}.keyExpr`));
                const insertedId = keyGetter(response);
                callback(insertedId);
                this._dataProcessingHelper.addCompletionAction(() => { this._actionsManager.raiseInsertedAction(optionName, data, insertedId); }, true, isTaskInsert);
                this._ganttTreeList.saveExpandedKeys();
                dataOption._reloadDataSource().done(data => {
                    if(isTaskInsert) {
                        this._ganttTreeList.onTaskInserted(insertedId, record.parentId);
                    }
                });
            });
        }
    }
    _onRecordUpdated(optionName, key, values) {
        const dataOption = this[`_${optionName}Option`];
        const isTaskUpdated = optionName === GANTT_TASKS;
        if(dataOption) {
            const data = this._mappingHelper.convertCoreToMappedData(optionName, values);
            const hasCustomFieldsData = isTaskUpdated && this._customFieldsManager.cache.hasData(key);
            if(hasCustomFieldsData) {
                this._customFieldsManager.addCustomFieldsDataFromCache(key, data);
            }
            dataOption.update(key, data, () => {
                this._ganttTreeList.saveExpandedKeys();
                this._dataProcessingHelper.addCompletionAction(() => { this._actionsManager.raiseUpdatedAction(optionName, data, key); }, true, isTaskUpdated);
                dataOption._reloadDataSource();
            });
        }
    }
    _onRecordRemoved(optionName, key, data) {
        const dataOption = this[`_${optionName}Option`];
        if(dataOption) {
            dataOption.remove(key, () => {
                this._ganttTreeList.saveExpandedKeys();
                this._dataProcessingHelper.addCompletionAction(() => { this._actionsManager.raiseDeletedAction(optionName, key, this._mappingHelper.convertCoreToMappedData(optionName, data)); }, true, optionName === GANTT_TASKS);
                dataOption._reloadDataSource();
            });
        }
    }
    _onParentTaskUpdated(data) {
        const mappedData = this.getTaskDataByCoreData(data);
        this._actionsManager.raiseUpdatedAction(GANTT_TASKS, mappedData, data.id);
    }
    _onParentTasksRecalculated(data) {
        if(!this.isSieving) {
            const setters = GanttHelper.compileSettersByOption(this.option(GANTT_TASKS));
            const treeDataSource = this._customFieldsManager.appendCustomFields(data.map(GanttHelper.prepareSetterMapHandler(setters)));
            // split threads for treelist filter|sort and datasource update (T1082108)
            setTimeout(() => {
                this._treeListParentRecalculatedDataUpdating = true;
                this._ganttTreeList?.setDataSource(treeDataSource);
            });
        }
        this.isSieving = false;
    }
    _onGanttViewCoreUpdated() {
        this._dataProcessingHelper.onGanttViewReady();
    }

    _sortAndFilter() {
        const treeList = this._treeList;
        const columns = treeList.getVisibleColumns();

        const sortedColumns = columns.filter(c => c.sortIndex > -1);
        const sortedState = sortedColumns.map(c => ({ sortIndex: c.sortIndex, sortOrder: c.sortOrder }));
        const sortedStateChanged = !this._compareSortedState(this._savedSortFilterState?.sort, sortedState);

        const filterValue = treeList.option('filterValue');
        const filterChanged = treeList.option('expandNodesOnFiltering') && filterValue !== this._savedSortFilterState?.filter;

        const sieveColumn = sortedColumns[0] || columns.filter(c => isDefined(c.filterValue) || c.filterValues?.length)[0];
        const isClearSieving = (this._savedSortFilterState?.sieveColumn && !sieveColumn);
        if(sieveColumn || isClearSieving) {
            const sieveOptions = sieveColumn && {
                sievedItems: this._ganttTreeList.getSievedItems(),
                sieveColumn: sieveColumn,
                expandTasks: filterChanged || (filterValue && sortedStateChanged)
            };
            this.isSieving = !isClearSieving;
            this._setGanttViewOption('sieve', sieveOptions);
        }
        this._savedSortFilterState = { sort: sortedState, filter: filterValue, sieveColumn: sieveColumn };
    }
    _compareSortedState(state1, state2) {
        if(!state1 || !state2 || state1.length !== state2.length) { return false; }
        return state1.every((c, i) => c.sortIndex === state2[i].sortIndex && c.sortOrder === state2[i].sortOrder);
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
    _hidePopupMenu() {
        this._contextMenuBar.hide();
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
    _findTaskByKey(key) {
        const tasks = this._tasksOption?._getItems();
        const keyGetter = this._getTaskKeyGetter();
        return tasks.find(t => keyGetter(t) === key);
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
        this._changeExpandAll(true);
    }
    _collapseAll() {
        this._changeExpandAll(false);
    }

    _onTreeListRowExpandChanged(e, expanded) {
        if(!this._lockRowExpandEvent) {
            this._ganttView.changeTaskExpanded(e.key, expanded);
            this._sizeHelper.adjustHeight();
        }
    }

    _changeExpandAll(expanded, level, rowKey) {
        const allExpandableNodes = [ ];
        const nodesToExpand = [ ];

        this._treeList.forEachNode(node => {
            if(node.children?.length) {
                allExpandableNodes.push(node);
            }
        });
        if(rowKey) {
            const node = this._treeList.getNodeByKey(rowKey);
            GanttHelper.getAllParentNodesKeys(node, nodesToExpand);
        }

        let promise;
        this._lockRowExpandEvent = allExpandableNodes.length > 0;
        const state = allExpandableNodes.reduce((previous, node, index) => {
            if(rowKey) {
                expanded = nodesToExpand.includes(node.key);
            } else if(level) {
                expanded = node.level < level;
            }

            previous[node.key] = expanded;
            const action = expanded ? this._treeList.expandRow : this._treeList.collapseRow;
            const isLast = index === allExpandableNodes.length - 1;
            if(isLast) {
                promise = action(node.key);
            } else {
                action(node.key);
            }
            return previous;
        }, {});

        promise?.then(() => {
            this._ganttView.applyTasksExpandedState(state);
            this._sizeHelper.adjustHeight();
            delete this._lockRowExpandEvent;
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
        if(isCustomFieldsUpdateOnly) {
            const customFieldsData = this._customFieldsManager._getCustomFieldsData(data);
            if(Object.keys(customFieldsData).length > 0) {
                this._actionsManager.raiseUpdatingAction(GANTT_TASKS, { cancel: false, key: key, newValues: { } });
            }
        } else {
            this._ganttView._ganttViewCore.updateTask(key, coreTaskData);
        }
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
    unassignAllResourcesFromTask(taskKey) {
        this._ganttView._ganttViewCore.unassignAllResourcesFromTask(taskKey);
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
    showTaskDetailsDialog(taskKey) {
        this._ganttView._ganttViewCore.showTaskDetailsDialog(taskKey);
    }
    exportToPdf(options) {
        return this._exportToPdf(options);
    }
    _exportToPdf(options) {
        this._exportHelper.reset();
        const fullOptions = extend({}, options);
        if(fullOptions.createDocumentMethod) {
            fullOptions.docCreateMethod = fullOptions.createDocumentMethod;
        }
        fullOptions.pdfDocument ??= fullOptions.jsPDFDocument;
        fullOptions.docCreateMethod ??= window['jspdf']?.['jsPDF'] ?? window['jsPDF'];
        fullOptions.format ??= 'a4';
        return new Promise((resolve) => {
            const doc = this._ganttView?._ganttViewCore.exportToPdf(fullOptions);
            resolve(doc);
        });
    }
    refresh() {
        return new Promise((resolve, reject) => {
            try {
                this._refreshGantt();
                resolve();
            } catch(e) {
                reject(e.message);
            }
        });
    }
    expandAll() {
        this._expandAll();
    }
    collapseAll() {
        this._collapseAll();
    }
    expandAllToLevel(level) {
        this._changeExpandAll(false, level);
    }
    expandToTask(key) {
        const node = this._treeList.getNodeByKey(key);
        this._changeExpandAll(false, 0, node?.parent?.key);
    }
    collapseTask(key) {
        this._treeList.collapseRow(key);
    }
    expandTask(key) {
        this._treeList.expandRow(key);
    }

    showResources(value) {
        this.option('showResources', value);
    }

    showDependencies(value) {
        this.option('showDependencies', value);
    }

    zoomIn() {
        this._ganttView._ganttViewCore.zoomIn();
    }
    zoomOut() {
        this._ganttView._ganttViewCore.zoomOut();
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
            case 'showDependencies':
                this._setGanttViewOption('showDependencies', args.value);
                break;
            case 'taskTitlePosition':
                this._setGanttViewOption('taskTitlePosition', args.value);
                break;
            case 'firstDayOfWeek':
                this._setGanttViewOption('firstDayOfWeek', args.value);
                break;
            case 'startDateRange':
                this._setGanttViewOption('startDateRange', args.value);
                break;
            case 'endDateRange':
                this._setGanttViewOption('endDateRange', args.value);
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
            case 'onScaleCellPrepared':
                this._actionsManager?.createScaleCellPreparedAction();
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
            case 'scaleTypeRange':
                this._setGanttViewOption('scaleTypeRange', this.option(args.name));
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
                this._sizeHelper?.setGanttHeight(getHeight(this._$element));
                break;
            case 'sorting':
                this._ganttTreeList?.setOption('sorting', this.option(args.name));
                break;
            case 'filterRow':
                this._ganttTreeList?.setOption('filterRow', this.option(args.name));
                break;
            case 'headerFilter':
                this._ganttTreeList?.setOption('headerFilter', this.option(args.name));
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent('dxGantt', Gantt);
export default Gantt;
