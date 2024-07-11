"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _data = require("../../core/utils/data");
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _type = require("../../core/utils/type");
var _uiGantt = require("./ui.gantt.model_changes_listener");
var _uiGanttData = _interopRequireDefault(require("./ui.gantt.data.option"));
var _load_panel = _interopRequireDefault(require("../load_panel"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _splitter = _interopRequireDefault(require("../splitter"));
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _uiGantt2 = require("./ui.gantt.actions");
var _uiGantt3 = require("./ui.gantt.custom_fields");
var _uiGantt4 = require("./ui.gantt.dialogs");
var _uiGantt5 = require("./ui.gantt.export_helper");
var _uiGantt6 = require("./ui.gantt.helper");
var _uiGantt7 = require("./ui.gantt.mapping_helper");
var _uiGantt8 = require("./ui.gantt.size_helper");
var _uiGantt9 = require("./ui.gantt.templates");
var _uiGantt10 = require("./ui.gantt.bars");
var _uiGantt11 = require("./ui.gantt.treelist");
var _uiGantt12 = require("./ui.gantt.view");
var _uiGantt13 = require("./ui.gantt.data_changes_processing_helper");
var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();

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
class Gantt extends _ui.default {
  _init() {
    super._init();
    _uiGrid_core.default.logHeaderFilterDeprecatedWarningIfNeed(this);
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
    this._$toolbarWrapper = (0, _renderer.default)('<div>').addClass(GANTT_TOOLBAR_WRAPPER).appendTo(this.$element());
    this._$toolbar = (0, _renderer.default)('<div>').appendTo(this._$toolbarWrapper);
    this._$mainWrapper = (0, _renderer.default)('<div>').addClass(GANTT_MAIN_WRAPPER).appendTo(this.$element());
    this._$treeListWrapper = (0, _renderer.default)('<div>').addClass(GANTT_TREE_LIST_WRAPPER).appendTo(this._$mainWrapper);
    this._$treeList = (0, _renderer.default)('<div>').appendTo(this._$treeListWrapper);
    this._$splitter = (0, _renderer.default)('<div>').appendTo(this._$mainWrapper);
    this._$ganttView = (0, _renderer.default)('<div>').addClass(GANTT_VIEW_CLASS).appendTo(this._$mainWrapper);
    this._$dialog = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._$loadPanel = (0, _renderer.default)('<div>').appendTo(this.$element());
    this._$contextMenu = (0, _renderer.default)('<div>').appendTo(this.$element());
  }
  _clean() {
    var _this$_ganttView, _this$_ganttView2;
    this._savedGanttViewState = (_this$_ganttView = this._ganttView) === null || _this$_ganttView === void 0 ? void 0 : _this$_ganttView.getVisualStateToRestore();
    (_this$_ganttView2 = this._ganttView) === null || _this$_ganttView2 === void 0 || _this$_ganttView2._ganttViewCore.cleanMarkup();
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
    if (!this._contentReadyRaised) {
      super._fireContentReadyAction();
    }
    this._contentReadyRaised = true;
  }
  _dimensionChanged() {
    var _this$_ganttView3;
    (_this$_ganttView3 = this._ganttView) === null || _this$_ganttView3 === void 0 || _this$_ganttView3._onDimensionChanged();
  }
  _visibilityChanged(visible) {
    if (visible) {
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
    if (this._isMainElementVisible && !this._isGanttRendered) {
      this._isGanttRendered = true;
      this._renderBars();
      this._renderTreeList();
      this._renderSplitter();
    }
  }
  _renderTreeList() {
    this._ganttTreeList = new _uiGantt11.GanttTreeList(this);
    this._treeList = this._ganttTreeList.getTreeList();
    this._ganttTreeList.onAfterTreeListCreate();
  }
  _renderSplitter() {
    this._splitter = this._createComponent(this._$splitter, _splitter.default, {
      container: this.$element(),
      leftElement: this._$treeListWrapper,
      rightElement: this._$ganttView,
      onApplyPanelSize: e => {
        this._sizeHelper.onApplyPanelSize(e);
      }
    });
    this._splitter.option('initialLeftPanelWidth', this.option('taskListWidth'));
  }
  _renderBars() {
    this._bars = [];
    this._toolbar = new _uiGantt10.GanttToolbar(this._$toolbar, this);
    this._updateToolbarContent();
    this._bars.push(this._toolbar);
    this._contextMenuBar = new _uiGantt10.GanttContextMenuBar(this._$contextMenu, this);
    this._updateContextMenu();
    this._bars.push(this._contextMenuBar);
  }
  _initHelpers() {
    this._mappingHelper = new _uiGantt7.GanttMappingHelper(this);
    this._customFieldsManager = new _uiGantt3.GanttCustomFieldsManager(this);
    this._actionsManager = new _uiGantt2.GanttActionsManager(this);
    this._ganttTemplatesManager = new _uiGantt9.GanttTemplatesManager(this);
    this._sizeHelper = new _uiGantt8.GanttSizeHelper(this);
    this._dataProcessingHelper = new _uiGantt13.GanttDataChangesProcessingHelper();
  }
  _initGanttView() {
    if (this._ganttView) {
      return;
    }
    this._ganttView = this._createComponent(this._$ganttView, _uiGantt12.GanttView, {
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
      onSelectionChanged: e => {
        this._ganttTreeList.selectRows(_uiGantt6.GanttHelper.getArrayFromOneElement(e.id));
      },
      onViewTypeChanged: e => {
        this._onViewTypeChanged(e.type);
      },
      onScroll: e => {
        this._ganttTreeList.scrollBy(e.scrollTop);
      },
      onDialogShowing: this._showDialog.bind(this),
      onPopupMenuShowing: this._showPopupMenu.bind(this),
      onPopupMenuHiding: this._hidePopupMenu.bind(this),
      onExpandAll: this._expandAll.bind(this),
      onCollapseAll: this._collapseAll.bind(this),
      modelChangesListener: _uiGantt.ModelChangesListener.create(this),
      exportHelper: this._getExportHelper(),
      taskTooltipContentTemplate: this._ganttTemplatesManager.getTaskTooltipContentTemplateFunc(this.option('taskTooltipContentTemplate')),
      taskProgressTooltipContentTemplate: this._ganttTemplatesManager.getTaskProgressTooltipContentTemplateFunc(this.option('taskProgressTooltipContentTemplate')),
      taskTimeTooltipContentTemplate: this._ganttTemplatesManager.getTaskTimeTooltipContentTemplateFunc(this.option('taskTimeTooltipContentTemplate')),
      taskContentTemplate: this._ganttTemplatesManager.getTaskContentTemplateFunc(this.option('taskContentTemplate')),
      onTaskClick: e => {
        this._ganttTreeList.onRowClick(e);
      },
      onTaskDblClick: e => {
        this._ganttTreeList.onRowDblClick(e);
      },
      onAdjustControl: () => {
        this._sizeHelper.onAdjustControl();
      },
      onContentReady: this._onGanttViewContentReady.bind(this),
      visualState: this._savedGanttViewState
    });
    delete this._savedGanttViewState;
  }
  _onGanttViewContentReady(e) {
    if (!this._isParentAutoUpdateMode()) {
      this._fireContentReadyAction();
    }
  }
  _isParentAutoUpdateMode() {
    return this.option('validation.autoUpdateParentTasks');
  }
  _onTreeListContentReady(e) {
    if (this._isParentAutoUpdateMode() && this._treeListParentRecalculatedDataUpdating) {
      this._fireContentReadyAction();
    }
    delete this._treeListParentRecalculatedDataUpdating;
    this._dataProcessingHelper.onTreeListReady();
  }
  _onViewTypeChanged(type) {
    this.option('scaleType', this._actionsManager._getScaleType(type));
  }
  _refreshDataSource(name) {
    let dataOption = this[`_${name}Option`];
    if (dataOption) {
      dataOption.dispose();
      delete this[`_${name}Option`];
      delete this[`_${name}`];
    }
    dataOption = new _uiGanttData.default(name, this._getLoadPanel.bind(this), (name, data) => {
      this._dataSourceChanged(name, data);
    });
    dataOption.option('dataSource', this._getSpecificDataSourceOption(name));
    dataOption._refreshDataSource();
    this[`_${name}Option`] = dataOption;
  }
  _getSpecificDataSourceOption(name) {
    const dataSource = this.option(`${name}.dataSource`);
    if (!dataSource || Array.isArray(dataSource)) {
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
    const getters = _uiGantt6.GanttHelper.compileGettersByOption(this.option(dataSourceName));
    const validatedData = this._validateSourceData(dataSourceName, data);
    const mappedData = validatedData.map(_uiGantt6.GanttHelper.prepareMapHandler(getters));
    this[`_${dataSourceName}`] = mappedData;
    this._setGanttViewOption(dataSourceName, mappedData);
    if (dataSourceName === GANTT_TASKS) {
      var _this$_ganttTreeList, _this$_ganttTreeList2, _this$_ganttTreeList3;
      this._tasksRaw = validatedData;
      const forceUpdate = !((_this$_ganttTreeList = this._ganttTreeList) !== null && _this$_ganttTreeList !== void 0 && _this$_ganttTreeList.getDataSource()) && !this._ganttView;
      (_this$_ganttTreeList2 = this._ganttTreeList) === null || _this$_ganttTreeList2 === void 0 || _this$_ganttTreeList2.saveExpandedKeys();
      (_this$_ganttTreeList3 = this._ganttTreeList) === null || _this$_ganttTreeList3 === void 0 || _this$_ganttTreeList3.updateDataSource(validatedData, forceUpdate);
    }
  }
  _validateSourceData(dataSourceName, data) {
    return data && dataSourceName === GANTT_TASKS ? this._validateTaskData(data) : data;
  }
  _validateTaskData(data) {
    const keyGetter = (0, _data.compileGetter)(this.option(`${GANTT_TASKS}.keyExpr`));
    const parentIdGetter = (0, _data.compileGetter)(this.option(`${GANTT_TASKS}.parentIdExpr`));
    const rootValue = this.option('rootValue') ?? 'dx_dxt_gantt_default_root_value';
    const validationTree = {};
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item) {
        const key = keyGetter(item);
        const isRootTask = key === rootValue;
        const treeItem = validationTree[key] ?? (validationTree[key] = {
          key: key,
          children: []
        });
        if (!isRootTask) {
          const parentId = parentIdGetter(item) ?? rootValue;
          const parentTreeItem = validationTree[parentId] ?? (validationTree[parentId] = {
            key: parentId,
            children: []
          });
          parentTreeItem.children.push(treeItem);
          treeItem.parent = parentTreeItem;
        }
      }
    }
    const validKeys = [rootValue];
    this._appendChildKeys(validationTree[rootValue], validKeys);
    return data.filter(item => validKeys.indexOf(keyGetter(item)) > -1);
  }
  _appendChildKeys(treeItem, keys) {
    const children = treeItem === null || treeItem === void 0 ? void 0 : treeItem.children;
    for (let i = 0; i < (children === null || children === void 0 ? void 0 : children.length); i++) {
      const child = children[i];
      keys.push(child.key);
      this._appendChildKeys(child, keys);
    }
  }
  _onRecordInserted(optionName, record, callback) {
    const dataOption = this[`_${optionName}Option`];
    if (dataOption) {
      const data = _uiGantt6.GanttHelper.getStoreObject(this.option(optionName), record);
      const isTaskInsert = optionName === GANTT_TASKS;
      if (isTaskInsert) {
        this._customFieldsManager.addCustomFieldsDataFromCache(GANTT_NEW_TASK_CACHE_KEY, data);
      }
      dataOption.insert(data, response => {
        const keyGetter = (0, _data.compileGetter)(this.option(`${optionName}.keyExpr`));
        const insertedId = keyGetter(response);
        callback(insertedId);
        this._executeFuncSetters(optionName, record, insertedId);
        this._dataProcessingHelper.addCompletionAction(() => {
          this._actionsManager.raiseInsertedAction(optionName, data, insertedId);
        }, true, isTaskInsert);
        this._ganttTreeList.saveExpandedKeys();
        dataOption._reloadDataSource().done(data => {
          if (isTaskInsert) {
            this._ganttTreeList.onTaskInserted(insertedId, record.parentId);
          }
        });
      });
    }
  }
  _onRecordUpdated(optionName, key, values) {
    const dataOption = this[`_${optionName}Option`];
    const isTaskUpdated = optionName === GANTT_TASKS;
    if (dataOption) {
      const data = this._mappingHelper.convertCoreToMappedData(optionName, values);
      const hasCustomFieldsData = isTaskUpdated && this._customFieldsManager.cache.hasData(key);
      if (hasCustomFieldsData) {
        this._customFieldsManager.addCustomFieldsDataFromCache(key, data);
      }
      dataOption.update(key, data, () => {
        this._executeFuncSetters(optionName, values, key);
        this._ganttTreeList.saveExpandedKeys();
        this._dataProcessingHelper.addCompletionAction(() => {
          this._actionsManager.raiseUpdatedAction(optionName, data, key);
        }, true, isTaskUpdated);
        dataOption._reloadDataSource();
      });
    }
  }
  _onRecordRemoved(optionName, key, data) {
    const dataOption = this[`_${optionName}Option`];
    if (dataOption) {
      dataOption.remove(key, () => {
        this._ganttTreeList.saveExpandedKeys();
        this._dataProcessingHelper.addCompletionAction(() => {
          this._actionsManager.raiseDeletedAction(optionName, key, this._mappingHelper.convertCoreToMappedData(optionName, data));
        }, true, optionName === GANTT_TASKS);
        dataOption._reloadDataSource();
      });
    }
  }
  _onParentTaskUpdated(data) {
    const mappedData = this.getTaskDataByCoreData(data);
    this._actionsManager.raiseUpdatedAction(GANTT_TASKS, mappedData, data.id);
  }
  _onParentTasksRecalculated(data) {
    if (!this.isSieving) {
      const setters = _uiGantt6.GanttHelper.compileSettersByOption(this.option(GANTT_TASKS));
      const treeDataSource = this._customFieldsManager.appendCustomFields(data.map(_uiGantt6.GanttHelper.prepareSetterMapHandler(setters)));
      // split threads for treelist filter|sort and datasource update (T1082108)
      setTimeout(() => {
        var _this$_ganttTreeList4;
        this._treeListParentRecalculatedDataUpdating = true;
        (_this$_ganttTreeList4 = this._ganttTreeList) === null || _this$_ganttTreeList4 === void 0 || _this$_ganttTreeList4.setDataSource(treeDataSource);
      });
    }
    this.isSieving = false;
  }
  _onGanttViewCoreUpdated() {
    this._dataProcessingHelper.onGanttViewReady();
  }
  _executeFuncSetters(optionName, coreData, key) {
    const funcSetters = _uiGantt6.GanttHelper.compileFuncSettersByOption(this.option(optionName));
    const keysToUpdate = Object.keys(funcSetters).filter(k => (0, _type.isDefined)(coreData[k]));
    if (keysToUpdate.length > 0) {
      const dataObject = this._getDataSourceItem(optionName, key);
      keysToUpdate.forEach(k => {
        const setter = funcSetters[k];
        setter(dataObject, coreData[k]);
      });
    }
  }
  _sortAndFilter() {
    var _this$_savedSortFilte, _this$_savedSortFilte2, _this$_savedSortFilte3;
    const treeList = this._treeList;
    const columns = treeList.getVisibleColumns();
    const sortedColumns = columns.filter(c => c.sortIndex > -1);
    const sortedState = sortedColumns.map(c => ({
      sortIndex: c.sortIndex,
      sortOrder: c.sortOrder
    }));
    const sortedStateChanged = !this._compareSortedState((_this$_savedSortFilte = this._savedSortFilterState) === null || _this$_savedSortFilte === void 0 ? void 0 : _this$_savedSortFilte.sort, sortedState);
    const filterValue = treeList.option('filterValue');
    const filterChanged = treeList.option('expandNodesOnFiltering') && filterValue !== ((_this$_savedSortFilte2 = this._savedSortFilterState) === null || _this$_savedSortFilte2 === void 0 ? void 0 : _this$_savedSortFilte2.filter);
    const sieveColumn = sortedColumns[0] || columns.filter(c => {
      var _c$filterValues;
      return (0, _type.isDefined)(c.filterValue) || ((_c$filterValues = c.filterValues) === null || _c$filterValues === void 0 ? void 0 : _c$filterValues.length);
    })[0];
    const isClearSieving = ((_this$_savedSortFilte3 = this._savedSortFilterState) === null || _this$_savedSortFilte3 === void 0 ? void 0 : _this$_savedSortFilte3.sieveColumn) && !sieveColumn;
    if (sieveColumn || isClearSieving) {
      const sieveOptions = sieveColumn && {
        sievedItems: this._ganttTreeList.getSievedItems(),
        sieveColumn: sieveColumn,
        expandTasks: filterChanged || filterValue && sortedStateChanged
      };
      this.isSieving = !isClearSieving;
      this._setGanttViewOption('sieve', sieveOptions);
    }
    this._savedSortFilterState = {
      sort: sortedState,
      filter: filterValue,
      sieveColumn: sieveColumn
    };
  }
  _compareSortedState(state1, state2) {
    if (!state1 || !state2 || state1.length !== state2.length) {
      return false;
    }
    return state1.every((c, i) => c.sortIndex === state2[i].sortIndex && c.sortOrder === state2[i].sortOrder);
  }
  _getToolbarItems() {
    const items = this.option('toolbar.items');
    return items ? items : [];
  }
  _updateToolbarContent() {
    const items = this._getToolbarItems();
    if (items.length) {
      this._$toolbarWrapper.show();
    } else {
      this._$toolbarWrapper.hide();
    }
    this._toolbar && this._toolbar.createItems(items);
    this._updateBarItemsState();
  }
  _updateContextMenu() {
    const contextMenuOptions = this.option('contextMenu');
    if (contextMenuOptions.enabled && this._contextMenuBar) {
      this._contextMenuBar.createItems(contextMenuOptions.items);
      this._updateBarItemsState();
    }
  }
  _updateBarItemsState() {
    this._ganttView && this._ganttView.updateBarItemsState();
  }
  _showDialog(e) {
    if (!this._dialogInstance) {
      this._dialogInstance = new _uiGantt4.GanttDialog(this, this._$dialog);
    }
    this._dialogInstance.show(e.name, e.parameters, e.callback, e.afterClosing, this.option('editing'));
  }
  _showPopupMenu(info) {
    if (this.option('contextMenu.enabled')) {
      this._ganttView.getBarManager().updateContextMenu();
      const args = {
        cancel: false,
        event: info.event,
        targetType: info.type,
        targetKey: info.key,
        items: (0, _extend.extend)(true, [], this._contextMenuBar._items),
        data: info.type === 'task' ? this.getTaskData(info.key) : this.getDependencyData(info.key)
      };
      this._actionsManager.raiseContextMenuPreparing(args);
      if (!args.cancel) {
        this._contextMenuBar.show(info.position, args.items);
      }
    }
  }
  _hidePopupMenu() {
    this._contextMenuBar.hide();
  }
  _getLoadPanel() {
    if (!this._loadPanel) {
      this._loadPanel = this._createComponent(this._$loadPanel, _load_panel.default, {
        position: {
          of: this.$element()
        }
      });
    }
    return this._loadPanel;
  }
  _getTaskKeyGetter() {
    return this._getDataSourceItemKeyGetter(GANTT_TASKS);
  }
  _findTaskByKey(key) {
    return this._getDataSourceItem(GANTT_TASKS, key);
  }
  _getDataSourceItem(dataOptionName, key) {
    const dataOption = this[`_${dataOptionName}Option`];
    const keyGetter = this._getDataSourceItemKeyGetter(dataOptionName);
    const items = dataOption === null || dataOption === void 0 ? void 0 : dataOption._getItems();
    return items.find(t => keyGetter(t) === key);
  }
  _getDataSourceItemKeyGetter(dataOptionName) {
    return (0, _data.compileGetter)(this.option(`${dataOptionName}.keyExpr`));
  }
  _setGanttViewOption(optionName, value) {
    this._ganttView && this._ganttView.option(optionName, value);
  }
  _getGanttViewOption(optionName, value) {
    var _this$_ganttView4;
    return (_this$_ganttView4 = this._ganttView) === null || _this$_ganttView4 === void 0 ? void 0 : _this$_ganttView4.option(optionName);
  }
  _getExportHelper() {
    this._exportHelper ?? (this._exportHelper = new _uiGantt5.GanttExportHelper(this));
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
    if (!this._lockRowExpandEvent) {
      this._ganttView.changeTaskExpanded(e.key, expanded);
      this._sizeHelper.adjustHeight();
    }
  }
  _changeExpandAll(expanded, level, rowKey) {
    var _promise;
    const allExpandableNodes = [];
    const nodesToExpand = [];
    this._treeList.forEachNode(node => {
      var _node$children;
      if ((_node$children = node.children) !== null && _node$children !== void 0 && _node$children.length) {
        allExpandableNodes.push(node);
      }
    });
    if (rowKey) {
      const node = this._treeList.getNodeByKey(rowKey);
      _uiGantt6.GanttHelper.getAllParentNodesKeys(node, nodesToExpand);
    }
    let promise;
    this._lockRowExpandEvent = allExpandableNodes.length > 0;
    const state = allExpandableNodes.reduce((previous, node, index) => {
      if (rowKey) {
        expanded = nodesToExpand.includes(node.key);
      } else if (level) {
        expanded = node.level < level;
      }
      previous[node.key] = expanded;
      const action = expanded ? this._treeList.expandRow : this._treeList.collapseRow;
      const isLast = index === allExpandableNodes.length - 1;
      if (isLast) {
        promise = action(node.key);
      } else {
        action(node.key);
      }
      return previous;
    }, {});
    (_promise = promise) === null || _promise === void 0 || _promise.then(() => {
      this._ganttView.applyTasksExpandedState(state);
      this._sizeHelper.adjustHeight();
      delete this._lockRowExpandEvent;
    });
  }
  getTaskResources(key) {
    if (!(0, _type.isDefined)(key)) {
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
    if (!(0, _type.isDefined)(key)) {
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
    if (isCustomFieldsUpdateOnly) {
      const customFieldsData = this._customFieldsManager._getCustomFieldsData(data);
      if (Object.keys(customFieldsData).length > 0) {
        this._actionsManager.raiseUpdatingAction(GANTT_TASKS, {
          cancel: false,
          key: key,
          newValues: {}
        });
      }
    } else {
      this._ganttView._ganttViewCore.updateTask(key, coreTaskData);
    }
  }
  getDependencyData(key) {
    if (!(0, _type.isDefined)(key)) {
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
    var _window$jspdf;
    this._exportHelper.reset();
    const fullOptions = (0, _extend.extend)({}, options);
    if (fullOptions.createDocumentMethod) {
      fullOptions.docCreateMethod = fullOptions.createDocumentMethod;
    }
    fullOptions.pdfDocument ?? (fullOptions.pdfDocument = fullOptions.jsPDFDocument);
    fullOptions.docCreateMethod ?? (fullOptions.docCreateMethod = ((_window$jspdf = window['jspdf']) === null || _window$jspdf === void 0 ? void 0 : _window$jspdf['jsPDF']) ?? window['jsPDF']);
    fullOptions.format ?? (fullOptions.format = 'a4');
    return new Promise(resolve => {
      var _this$_ganttView5;
      const doc = (_this$_ganttView5 = this._ganttView) === null || _this$_ganttView5 === void 0 ? void 0 : _this$_ganttView5._ganttViewCore.exportToPdf(fullOptions);
      resolve(doc);
    });
  }
  refresh() {
    return new Promise((resolve, reject) => {
      try {
        this._refreshGantt();
        resolve();
      } catch (e) {
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
    var _node$parent;
    const node = this._treeList.getNodeByKey(key);
    this._changeExpandAll(false, 0, node === null || node === void 0 || (_node$parent = node.parent) === null || _node$parent === void 0 ? void 0 : _node$parent.key);
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
    return (0, _extend.extend)(super._getDefaultOptions(), _uiGantt6.GanttHelper.getDefaultOptions());
  }
  _optionChanged(args) {
    var _this$_ganttTreeList5, _this$_sizeHelper, _this$_ganttTreeList6, _this$_actionsManager, _this$_actionsManager2, _this$_actionsManager3, _this$_actionsManager4, _this$_actionsManager5, _this$_actionsManager6, _this$_actionsManager7, _this$_actionsManager8, _this$_actionsManager9, _this$_actionsManager10, _this$_actionsManager11, _this$_actionsManager12, _this$_actionsManager13, _this$_actionsManager14, _this$_actionsManager15, _this$_actionsManager16, _this$_actionsManager17, _this$_actionsManager18, _this$_actionsManager19, _this$_actionsManager20, _this$_actionsManager21, _this$_actionsManager22, _this$_actionsManager23, _this$_actionsManager24, _this$_actionsManager25, _this$_actionsManager26, _this$_actionsManager27, _this$_ganttTreeList7, _this$_ganttTreeList8, _this$_ganttTemplates, _this$_ganttTemplates2, _this$_ganttTemplates3, _this$_ganttTemplates4, _this$_ganttTreeList9, _this$_sizeHelper2, _this$_sizeHelper3, _this$_ganttTreeList10, _this$_ganttTreeList11, _this$_ganttTreeList12;
    switch (args.name) {
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
        (_this$_ganttTreeList5 = this._ganttTreeList) === null || _this$_ganttTreeList5 === void 0 || _this$_ganttTreeList5.setOption('columns', this._ganttTreeList.getColumns());
        break;
      case 'taskListWidth':
        (_this$_sizeHelper = this._sizeHelper) === null || _this$_sizeHelper === void 0 || _this$_sizeHelper.setInnerElementsWidth();
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
        (_this$_ganttTreeList6 = this._ganttTreeList) === null || _this$_ganttTreeList6 === void 0 || _this$_ganttTreeList6.selectRows(_uiGantt6.GanttHelper.getArrayFromOneElement(args.value));
        break;
      case 'onSelectionChanged':
        (_this$_actionsManager = this._actionsManager) === null || _this$_actionsManager === void 0 || _this$_actionsManager.createSelectionChangedAction();
        break;
      case 'onTaskClick':
        (_this$_actionsManager2 = this._actionsManager) === null || _this$_actionsManager2 === void 0 || _this$_actionsManager2.createTaskClickAction();
        break;
      case 'onTaskDblClick':
        (_this$_actionsManager3 = this._actionsManager) === null || _this$_actionsManager3 === void 0 || _this$_actionsManager3.createTaskDblClickAction();
        break;
      case 'onTaskInserting':
        (_this$_actionsManager4 = this._actionsManager) === null || _this$_actionsManager4 === void 0 || _this$_actionsManager4.createTaskInsertingAction();
        break;
      case 'onTaskInserted':
        (_this$_actionsManager5 = this._actionsManager) === null || _this$_actionsManager5 === void 0 || _this$_actionsManager5.createTaskInsertedAction();
        break;
      case 'onTaskDeleting':
        (_this$_actionsManager6 = this._actionsManager) === null || _this$_actionsManager6 === void 0 || _this$_actionsManager6.createTaskDeletingAction();
        break;
      case 'onTaskDeleted':
        (_this$_actionsManager7 = this._actionsManager) === null || _this$_actionsManager7 === void 0 || _this$_actionsManager7.createTaskDeletedAction();
        break;
      case 'onTaskUpdating':
        (_this$_actionsManager8 = this._actionsManager) === null || _this$_actionsManager8 === void 0 || _this$_actionsManager8.createTaskUpdatingAction();
        break;
      case 'onTaskUpdated':
        (_this$_actionsManager9 = this._actionsManager) === null || _this$_actionsManager9 === void 0 || _this$_actionsManager9.createTaskUpdatedAction();
        break;
      case 'onTaskMoving':
        (_this$_actionsManager10 = this._actionsManager) === null || _this$_actionsManager10 === void 0 || _this$_actionsManager10.createTaskMovingAction();
        break;
      case 'onTaskEditDialogShowing':
        (_this$_actionsManager11 = this._actionsManager) === null || _this$_actionsManager11 === void 0 || _this$_actionsManager11.createTaskEditDialogShowingAction();
        break;
      case 'onResourceManagerDialogShowing':
        (_this$_actionsManager12 = this._actionsManager) === null || _this$_actionsManager12 === void 0 || _this$_actionsManager12.createResourceManagerDialogShowingAction();
        break;
      case 'onDependencyInserting':
        (_this$_actionsManager13 = this._actionsManager) === null || _this$_actionsManager13 === void 0 || _this$_actionsManager13.createDependencyInsertingAction();
        break;
      case 'onDependencyInserted':
        (_this$_actionsManager14 = this._actionsManager) === null || _this$_actionsManager14 === void 0 || _this$_actionsManager14.createDependencyInsertedAction();
        break;
      case 'onDependencyDeleting':
        (_this$_actionsManager15 = this._actionsManager) === null || _this$_actionsManager15 === void 0 || _this$_actionsManager15.createDependencyDeletingAction();
        break;
      case 'onDependencyDeleted':
        (_this$_actionsManager16 = this._actionsManager) === null || _this$_actionsManager16 === void 0 || _this$_actionsManager16.createDependencyDeletedAction();
        break;
      case 'onResourceInserting':
        (_this$_actionsManager17 = this._actionsManager) === null || _this$_actionsManager17 === void 0 || _this$_actionsManager17.createResourceInsertingAction();
        break;
      case 'onResourceInserted':
        (_this$_actionsManager18 = this._actionsManager) === null || _this$_actionsManager18 === void 0 || _this$_actionsManager18.createResourceInsertedAction();
        break;
      case 'onResourceDeleting':
        (_this$_actionsManager19 = this._actionsManager) === null || _this$_actionsManager19 === void 0 || _this$_actionsManager19.createResourceDeletingAction();
        break;
      case 'onResourceDeleted':
        (_this$_actionsManager20 = this._actionsManager) === null || _this$_actionsManager20 === void 0 || _this$_actionsManager20.createResourceDeletedAction();
        break;
      case 'onResourceAssigning':
        (_this$_actionsManager21 = this._actionsManager) === null || _this$_actionsManager21 === void 0 || _this$_actionsManager21.createResourceAssigningAction();
        break;
      case 'onResourceAssigned':
        (_this$_actionsManager22 = this._actionsManager) === null || _this$_actionsManager22 === void 0 || _this$_actionsManager22.createResourceAssignedAction();
        break;
      case 'onResourceUnassigning':
        // eslint-disable-next-line spellcheck/spell-checker
        (_this$_actionsManager23 = this._actionsManager) === null || _this$_actionsManager23 === void 0 || _this$_actionsManager23.createResourceUnassigningAction();
        break;
      case 'onResourceUnassigned':
        // eslint-disable-next-line spellcheck/spell-checker
        (_this$_actionsManager24 = this._actionsManager) === null || _this$_actionsManager24 === void 0 || _this$_actionsManager24.createResourceUnassignedAction();
        break;
      case 'onCustomCommand':
        (_this$_actionsManager25 = this._actionsManager) === null || _this$_actionsManager25 === void 0 || _this$_actionsManager25.createCustomCommandAction();
        break;
      case 'onContextMenuPreparing':
        (_this$_actionsManager26 = this._actionsManager) === null || _this$_actionsManager26 === void 0 || _this$_actionsManager26.createContextMenuPreparingAction();
        break;
      case 'onScaleCellPrepared':
        (_this$_actionsManager27 = this._actionsManager) === null || _this$_actionsManager27 === void 0 || _this$_actionsManager27.createScaleCellPreparedAction();
        break;
      case 'allowSelection':
        (_this$_ganttTreeList7 = this._ganttTreeList) === null || _this$_ganttTreeList7 === void 0 || _this$_ganttTreeList7.setOption('selection.mode', _uiGantt6.GanttHelper.getSelectionMode(args.value));
        this._setGanttViewOption('allowSelection', args.value);
        break;
      case 'showRowLines':
        (_this$_ganttTreeList8 = this._ganttTreeList) === null || _this$_ganttTreeList8 === void 0 || _this$_ganttTreeList8.setOption('showRowLines', args.value);
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
        this._setGanttViewOption('taskTooltipContentTemplate', (_this$_ganttTemplates = this._ganttTemplatesManager) === null || _this$_ganttTemplates === void 0 ? void 0 : _this$_ganttTemplates.getTaskTooltipContentTemplateFunc(args.value));
        break;
      case 'taskProgressTooltipContentTemplate':
        this._setGanttViewOption('taskProgressTooltipContentTemplate', (_this$_ganttTemplates2 = this._ganttTemplatesManager) === null || _this$_ganttTemplates2 === void 0 ? void 0 : _this$_ganttTemplates2.getTaskProgressTooltipContentTemplateFunc(args.value));
        break;
      case 'taskTimeTooltipContentTemplate':
        this._setGanttViewOption('taskTimeTooltipContentTemplate', (_this$_ganttTemplates3 = this._ganttTemplatesManager) === null || _this$_ganttTemplates3 === void 0 ? void 0 : _this$_ganttTemplates3.getTaskTimeTooltipContentTemplateFunc(args.value));
        break;
      case 'taskContentTemplate':
        this._setGanttViewOption('taskContentTemplate', (_this$_ganttTemplates4 = this._ganttTemplatesManager) === null || _this$_ganttTemplates4 === void 0 ? void 0 : _this$_ganttTemplates4.getTaskContentTemplateFunc(args.value));
        break;
      case 'rootValue':
        (_this$_ganttTreeList9 = this._ganttTreeList) === null || _this$_ganttTreeList9 === void 0 || _this$_ganttTreeList9.setOption('rootValue', args.value);
        break;
      case 'width':
        super._optionChanged(args);
        (_this$_sizeHelper2 = this._sizeHelper) === null || _this$_sizeHelper2 === void 0 || _this$_sizeHelper2.updateGanttWidth();
        break;
      case 'height':
        super._optionChanged(args);
        (_this$_sizeHelper3 = this._sizeHelper) === null || _this$_sizeHelper3 === void 0 || _this$_sizeHelper3.setGanttHeight((0, _size.getHeight)(this._$element));
        break;
      case 'sorting':
        (_this$_ganttTreeList10 = this._ganttTreeList) === null || _this$_ganttTreeList10 === void 0 || _this$_ganttTreeList10.setOption('sorting', this.option(args.name));
        break;
      case 'filterRow':
        (_this$_ganttTreeList11 = this._ganttTreeList) === null || _this$_ganttTreeList11 === void 0 || _this$_ganttTreeList11.setOption('filterRow', this.option(args.name));
        break;
      case 'headerFilter':
        (_this$_ganttTreeList12 = this._ganttTreeList) === null || _this$_ganttTreeList12 === void 0 || _this$_ganttTreeList12.setOption('headerFilter', this.option(args.name));
        break;
      default:
        super._optionChanged(args);
    }
  }
}
(0, _component_registrator.default)('dxGantt', Gantt);
var _default = exports.default = Gantt;
module.exports = exports.default;
module.exports.default = exports.default;