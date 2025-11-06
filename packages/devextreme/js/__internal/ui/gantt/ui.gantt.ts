/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import gridCoreUtils from '__internal/grids/grid_core/m_utils';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/gantt';
import SplitterControl from '@js/ui/splitter_control';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type TreeList from '@ts/grids/tree_list/m_widget_base';
import { GanttActionsManager } from '@ts/ui/gantt/ui.gantt.actions';
import { GanttContextMenuBar, GanttToolbar } from '@ts/ui/gantt/ui.gantt.bars';
import { GanttCustomFieldsManager } from '@ts/ui/gantt/ui.gantt.custom_fields';
import DataOption from '@ts/ui/gantt/ui.gantt.data.option';
import { GanttDataChangesProcessingHelper } from '@ts/ui/gantt/ui.gantt.data_changes_processing_helper';
import { GanttDialog } from '@ts/ui/gantt/ui.gantt.dialogs';
import { GanttExportHelper } from '@ts/ui/gantt/ui.gantt.export_helper';
import { GanttHelper } from '@ts/ui/gantt/ui.gantt.helper';
import { GanttMappingHelper } from '@ts/ui/gantt/ui.gantt.mapping_helper';
import { ModelChangesListener } from '@ts/ui/gantt/ui.gantt.model_changes_listener';
import { GanttSizeHelper } from '@ts/ui/gantt/ui.gantt.size_helper';
import { GanttTemplatesManager } from '@ts/ui/gantt/ui.gantt.templates';
import { GanttTreeList } from '@ts/ui/gantt/ui.gantt.treelist';
import { GanttView } from '@ts/ui/gantt/ui.gantt.view';
import LoadPanel from '@ts/ui/load_panel';

const window = getWindow();

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

interface SortFilterState {
  sort?: { sortIndex: number; sortOrder: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sieveColumn?: any;
}

class Gantt extends Widget<Properties> {
  _isGanttRendered?: boolean;

  _$toolbarWrapper!: dxElementWrapper;

  _$toolbar!: dxElementWrapper;

  _$mainWrapper!: dxElementWrapper;

  _$treeListWrapper!: dxElementWrapper;

  _$treeList!: dxElementWrapper;

  _$splitter!: dxElementWrapper;

  _$ganttView!: dxElementWrapper;

  _$dialog!: dxElementWrapper;

  _$loadPanel!: dxElementWrapper;

  _$contextMenu!: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _savedGanttViewState?: any;

  _ganttView?: GanttView;

  _dialogInstance?: GanttDialog;

  _loadPanel?: LoadPanel;

  _exportHelper?: GanttExportHelper;

  _contentReadyRaised?: boolean;

  _isMainElementVisible?: boolean;

  _ganttTreeList?: GanttTreeList;

  _treeList?: TreeList;

  isSieving?: boolean;

  _mappingHelper?: GanttMappingHelper;

  _customFieldsManager?: GanttCustomFieldsManager;

  _actionsManager?: GanttActionsManager;

  _ganttTemplatesManager?: GanttTemplatesManager;

  _sizeHelper?: GanttSizeHelper;

  _dataProcessingHelper?: GanttDataChangesProcessingHelper;

  _toolbar?: GanttToolbar;

  _contextMenuBar?: GanttContextMenuBar;

  _bars?: (GanttToolbar | GanttContextMenuBar)[];

  _splitter?: SplitterControl;

  _tasks?: Properties['tasks'];

  _dependencies?: Properties['dependencies'];

  _resources?: Properties['resources'];

  _resourceAssignments?: Properties['resourceAssignments'];

  _treeListParentRecalculatedDataUpdating?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _tasksRaw?: any;

  _savedSortFilterState?: SortFilterState;

  _lockRowExpandEvent?: boolean;

  _hasHeight?: boolean;

  _init(): void {
    super._init();

    gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);

    this._initGantt();
    this._isGanttRendered = false;
    this._initHelpers();
  }

  _initGantt(): void {
    this._refreshDataSources();
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(GANTT_CLASS);

    this._$toolbarWrapper = $('<div>')
      .addClass(GANTT_TOOLBAR_WRAPPER)
      .appendTo(this.$element());
    this._$toolbar = $('<div>').appendTo(this._$toolbarWrapper);

    this._$mainWrapper = $('<div>')
      .addClass(GANTT_MAIN_WRAPPER)
      .appendTo(this.$element());
    this._$treeListWrapper = $('<div>')
      .addClass(GANTT_TREE_LIST_WRAPPER)
      .appendTo(this._$mainWrapper);
    this._$treeList = $('<div>').appendTo(this._$treeListWrapper);
    this._$splitter = $('<div>').appendTo(this._$mainWrapper);
    this._$ganttView = $('<div>')
      .addClass(GANTT_VIEW_CLASS)
      .appendTo(this._$mainWrapper);
    this._$dialog = $('<div>').appendTo(this.$element());
    this._$loadPanel = $('<div>').appendTo(this.$element());
    this._$contextMenu = $('<div>').appendTo(this.$element());
  }

  _clean(): void {
    this._savedGanttViewState = this._ganttView?.getVisualStateToRestore();
    this._ganttView?._ganttViewCore.cleanMarkup();
    delete this._ganttView;
    delete this._dialogInstance;
    delete this._loadPanel;
    delete this._exportHelper;
    super._clean();
  }

  _refresh(): void {
    this._isGanttRendered = false;
    this._contentReadyRaised = false;
    super._refresh();
  }

  _fireContentReadyAction(): void {
    if (!this._contentReadyRaised) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      super._fireContentReadyAction();
    }
    this._contentReadyRaised = true;
  }

  _dimensionChanged(): void {
    this._ganttView?._onDimensionChanged();
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._refreshGantt();
    }
  }

  _refreshGantt(): void {
    this._refreshDataSources();
    // eslint-disable-next-line no-restricted-globals
    setTimeout((): void => this._refresh());
  }

  _refreshDataSources(): void {
    this._refreshDataSource(GANTT_TASKS);
    this._refreshDataSource(GANTT_DEPENDENCIES);
    this._refreshDataSource(GANTT_RESOURCES);
    this._refreshDataSource(GANTT_RESOURCE_ASSIGNMENTS);
  }

  _renderContent(): void {
    this._isMainElementVisible = this.$element().is(':visible');
    if (this._isMainElementVisible && !this._isGanttRendered) {
      this._isGanttRendered = true;
      this._renderBars();
      this._renderTreeList();
      this._renderSplitter();
    }
  }

  _renderTreeList(): void {
    this._ganttTreeList = new GanttTreeList(this);
    // @ts-expect-error ts-error
    this._treeList = this._ganttTreeList.getTreeList();
    this._ganttTreeList.onAfterTreeListCreate();
  }

  _renderSplitter(): void {
    this._splitter = this._createComponent(this._$splitter, SplitterControl, {
      container: this.$element(),
      leftElement: this._$treeListWrapper,
      rightElement: this._$ganttView,
      onApplyPanelSize: (e): void => {
        this._sizeHelper?.onApplyPanelSize(e);
      },
    });
    this._splitter.option(
      'initialLeftPanelWidth',
      this.option('taskListWidth'),
    );
  }

  _renderBars(): void {
    this._bars = [];
    this._toolbar = new GanttToolbar(this._$toolbar, this);
    this._updateToolbarContent();
    this._bars.push(this._toolbar);
    this._contextMenuBar = new GanttContextMenuBar(this._$contextMenu, this);
    this._updateContextMenu();
    this._bars.push(this._contextMenuBar);
  }

  _initHelpers(): void {
    this._mappingHelper = new GanttMappingHelper(this);
    this._customFieldsManager = new GanttCustomFieldsManager(this);
    this._actionsManager = new GanttActionsManager(this);
    this._ganttTemplatesManager = new GanttTemplatesManager(this);
    this._sizeHelper = new GanttSizeHelper(this);
    this._dataProcessingHelper = new GanttDataChangesProcessingHelper();
  }

  _initGanttView(): void {
    if (this._ganttView) {
      return;
    }

    const {
      allowSelection,
      selectedRowKey,
      showResources,
      showDependencies,
      startDateRange,
      endDateRange,
      taskTitlePosition,
      firstDayOfWeek,
      showRowLines,
      scaleType,
      scaleTypeRange,
      editing,
      validation,
      stripLines,
      taskTooltipContentTemplate,
      taskProgressTooltipContentTemplate,
      taskTimeTooltipContentTemplate,
      taskContentTemplate,
    } = this.option();

    this._ganttView = this._createComponent(this._$ganttView, GanttView, {
      width: '100%',
      height: this._ganttTreeList?.getOffsetHeight(),
      // @ts-expect-error ts-error
      rowHeight: this._ganttTreeList?.getRowHeight(),
      headerHeight: this._ganttTreeList?.getHeaderHeight(),
      tasks: this._tasks,
      dependencies: this._dependencies,
      resources: this._resources,
      resourceAssignments: this._resourceAssignments,
      allowSelection,
      selectedRowKey,
      showResources,
      showDependencies,
      startDateRange,
      endDateRange,
      taskTitlePosition,
      firstDayOfWeek,
      showRowLines,
      scaleType,
      scaleTypeRange,
      editing,
      validation,
      stripLines: stripLines?.map((item) => ({ ...item })),
      bars: this._bars,
      mainElement: this.$element(),
      onSelectionChanged: (e): void => {
        this._ganttTreeList?.selectRows(
          GanttHelper.getArrayFromOneElement(e.id),
        );
      },
      onViewTypeChanged: (e): void => {
        this._onViewTypeChanged(e.type);
      },
      onScroll: (e): void => {
        this._ganttTreeList?.scrollBy(e.scrollTop);
      },
      onDialogShowing: this._showDialog.bind(this),
      onPopupMenuShowing: this._showPopupMenu.bind(this),
      onPopupMenuHiding: this._hidePopupMenu.bind(this),
      onExpandAll: this._expandAll.bind(this),
      onCollapseAll: this._collapseAll.bind(this),
      modelChangesListener: ModelChangesListener.create(this),
      exportHelper: this._getExportHelper(),
      taskTooltipContentTemplate:
        this._ganttTemplatesManager?.getTaskTooltipContentTemplateFunc(
          taskTooltipContentTemplate,
        ),
      taskProgressTooltipContentTemplate:
        this._ganttTemplatesManager?.getTaskProgressTooltipContentTemplateFunc(
          taskProgressTooltipContentTemplate,
        ),
      taskTimeTooltipContentTemplate:
        this._ganttTemplatesManager?.getTaskTimeTooltipContentTemplateFunc(
          taskTimeTooltipContentTemplate,
        ),
      taskContentTemplate:
        this._ganttTemplatesManager?.getTaskContentTemplateFunc(
          taskContentTemplate,
        ),
      onTaskClick: (e): void => {
        this._ganttTreeList?.onRowClick(e);
      },
      onTaskDblClick: (e): void => {
        this._ganttTreeList?.onRowDblClick(e);
      },
      onAdjustControl: (): void => {
        this._sizeHelper?.onAdjustControl();
      },
      onContentReady: this._onGanttViewContentReady.bind(this),
      visualState: this._savedGanttViewState,
    });

    delete this._savedGanttViewState;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onGanttViewContentReady(e): void {
    if (!this._isParentAutoUpdateMode()) {
      this._fireContentReadyAction();
    }
  }

  _isParentAutoUpdateMode(): boolean | undefined {
    const { validation = {} } = this.option() ?? {};
    return validation?.autoUpdateParentTasks;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onTreeListContentReady(e): void {
    if (
      this._isParentAutoUpdateMode()
      && this._treeListParentRecalculatedDataUpdating
    ) {
      this._fireContentReadyAction();
    }
    delete this._treeListParentRecalculatedDataUpdating;

    this._dataProcessingHelper?.onTreeListReady();
  }

  _onViewTypeChanged(type: number): void {
    this.option('scaleType', this._actionsManager?._getScaleType(type));
  }

  _refreshDataSource(name: string): void {
    let dataOption = this[`_${name}Option`];
    if (dataOption) {
      dataOption.dispose();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this[`_${name}Option`];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this[`_${name}`];
    }

    dataOption = new DataOption(
      name,
      this._getLoadPanel.bind(this),
      (resultName, resultData): void => {
        this._dataSourceChanged(resultName, resultData);
      },
    );
    dataOption.option('dataSource', this._getSpecificDataSourceOption(name));
    dataOption._refreshDataSource();
    this[`_${name}Option`] = dataOption;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getSpecificDataSourceOption(name: string) {
    const dataSource = this.option(`${name}.dataSource`);
    if (!dataSource || Array.isArray(dataSource)) {
      return {
        store: {
          type: 'array',
          data: dataSource ?? [],
          key: this.option(`${name}.keyExpr`),
        },
      };
    }
    return dataSource;
  }

  _dataSourceChanged(dataSourceName: string, data): void {
    const getters = GanttHelper.compileGettersByOption(
      this.option(dataSourceName),
    );
    const validatedData = this._validateSourceData(dataSourceName, data);
    const mappedData = validatedData.map(
      GanttHelper.prepareMapHandler(getters),
    );

    this[`_${dataSourceName}`] = mappedData;
    this._setGanttViewOption(dataSourceName, mappedData);
    if (dataSourceName === GANTT_TASKS) {
      this._tasksRaw = validatedData;
      const forceUpdate = !this._ganttTreeList?.getDataSource() && !this._ganttView;
      this._ganttTreeList?.saveExpandedKeys();
      this._ganttTreeList?.updateDataSource(validatedData, forceUpdate);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _validateSourceData(dataSourceName: string, data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data && dataSourceName === GANTT_TASKS
      ? this._validateTaskData(data)
      : data;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _validateTaskData(data) {
    // @ts-expect-error ts-error
    const keyGetter = compileGetter(this.option(`${GANTT_TASKS}.keyExpr`));
    const parentIdGetter = compileGetter(
      // @ts-expect-error ts-error
      this.option(`${GANTT_TASKS}.parentIdExpr`),
    );
    const rootValue = this.option('rootValue') ?? 'dx_dxt_gantt_default_root_value';

    const validationTree = {};
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (item) {
        // @ts-expect-error ts-error
        const key = keyGetter(item);
        const isRootTask = key === rootValue;
        // eslint-disable-next-line no-multi-assign
        const treeItem = validationTree[key] ??= { key, children: [] };
        if (!isRootTask) {
          // @ts-expect-error ts-error
          const parentId = parentIdGetter(item) ?? rootValue;
          // eslint-disable-next-line no-multi-assign
          const parentTreeItem = validationTree[parentId] ??= {
            key: parentId,
            children: [],
          };
          parentTreeItem.children.push(treeItem);
          treeItem.parent = parentTreeItem;
        }
      }
    }
    const validKeys = [rootValue];
    // @ts-expect-error ts-error
    this._appendChildKeys(validationTree[rootValue], validKeys);

    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.filter((item): boolean => validKeys.includes(keyGetter(item)));
  }

  _appendChildKeys(treeItem, keys): void {
    const children = treeItem?.children;
    for (let i = 0; i < children?.length; i += 1) {
      const child = children[i];
      keys.push(child.key);
      this._appendChildKeys(child, keys);
    }
  }

  _onRecordInserted(optionName: string, record, callback): void {
    const dataOption = this[`_${optionName}Option`];
    if (dataOption) {
      const data = GanttHelper.getStoreObject(this.option(optionName), record);
      const isTaskInsert = optionName === GANTT_TASKS;
      if (isTaskInsert) {
        this._customFieldsManager?.addCustomFieldsDataFromCache(
          GANTT_NEW_TASK_CACHE_KEY,
          data,
        );
      }

      dataOption.insert(data, (response): void => {
        // @ts-expect-error ts-error
        const keyGetter = compileGetter(this.option(`${optionName}.keyExpr`));
        // @ts-expect-error ts-error
        const insertedId = keyGetter(response);
        callback(insertedId);
        this._executeFuncSetters(optionName, record, insertedId);
        this._dataProcessingHelper?.addCompletionAction(
          () => {
            this._actionsManager?.raiseInsertedAction(
              optionName,
              data,
              insertedId,
            );
          },
          true,
          isTaskInsert,
        );
        this._ganttTreeList?.saveExpandedKeys();
        dataOption._reloadDataSource().done((): void => {
          if (isTaskInsert) {
            this._ganttTreeList?.onTaskInserted(insertedId, record.parentId);
          }
        });
      });
    }
  }

  _onRecordUpdated(optionName: string, key, values): void {
    const dataOption = this[`_${optionName}Option`];
    const isTaskUpdated = optionName === GANTT_TASKS;
    if (dataOption) {
      const data = this._mappingHelper?.convertCoreToMappedData(
        optionName,
        values,
      );
      const hasCustomFieldsData = isTaskUpdated && this._customFieldsManager?.cache.hasData(key);
      if (hasCustomFieldsData) {
        this._customFieldsManager?.addCustomFieldsDataFromCache(key, data);
      }
      dataOption.update(key, data, (): void => {
        this._executeFuncSetters(optionName, values, key);
        this._ganttTreeList?.saveExpandedKeys();
        this._dataProcessingHelper?.addCompletionAction(
          (): void => {
            this._actionsManager?.raiseUpdatedAction(optionName, data, key);
          },
          true,
          isTaskUpdated,
        );
        dataOption._reloadDataSource();
      });
    }
  }

  _onRecordRemoved(optionName: string, key, data): void {
    const dataOption = this[`_${optionName}Option`];
    if (dataOption) {
      dataOption.remove(key, () => {
        this._ganttTreeList?.saveExpandedKeys();
        this._dataProcessingHelper?.addCompletionAction(
          () => {
            this._actionsManager?.raiseDeletedAction(
              optionName,
              key,
              this._mappingHelper?.convertCoreToMappedData(optionName, data),
            );
          },
          true,
          optionName === GANTT_TASKS,
        );
        dataOption._reloadDataSource();
      });
    }
  }

  _onParentTaskUpdated(data): void {
    const mappedData = this.getTaskDataByCoreData(data);
    this._actionsManager?.raiseUpdatedAction(GANTT_TASKS, mappedData, data.id);
  }

  _onParentTasksRecalculated(data): void {
    if (!this.isSieving) {
      const setters = GanttHelper.compileSettersByOption(
        this.option(GANTT_TASKS),
      );
      const treeDataSource = this._customFieldsManager?.appendCustomFields(
        data.map(GanttHelper.prepareSetterMapHandler(setters)),
      );
      // split threads for treelist filter|sort and datasource update (T1082108)
      // eslint-disable-next-line no-restricted-globals
      setTimeout((): void => {
        this._treeListParentRecalculatedDataUpdating = true;
        this._ganttTreeList?.setDataSource(treeDataSource);
      });
    }
    this.isSieving = false;
  }

  _onGanttViewCoreUpdated(): void {
    this._dataProcessingHelper?.onGanttViewReady();
  }

  _executeFuncSetters(optionName: string, coreData, key): void {
    const funcSetters = GanttHelper.compileFuncSettersByOption(
      this.option(optionName),
    );
    const keysToUpdate = Object.keys(funcSetters).filter((k): boolean => isDefined(coreData[k]));

    if (keysToUpdate.length > 0) {
      const dataObject = this._getDataSourceItem(optionName, key);
      keysToUpdate.forEach((k) => {
        const setter = funcSetters[k];
        setter(dataObject, coreData[k]);
      });
    }
  }

  _sortAndFilter(): void {
    const treeList = this._treeList;
    // @ts-expect-error ts-error
    const columns = treeList?.getColumns();

    const sortedColumns = columns.filter((c) => c.sortIndex > -1);
    const sortedState = sortedColumns.map((c) => ({
      sortIndex: c.sortIndex,
      sortOrder: c.sortOrder,
    }));
    const sortedStateChanged = !this._compareSortedState(
      this._savedSortFilterState?.sort,
      sortedState,
    );

    const filterValue = treeList?.option('filterValue');
    const filterChanged = treeList?.option('expandNodesOnFiltering')
      && filterValue !== this._savedSortFilterState?.filter;

    const sieveColumn = sortedColumns[0]
      || columns.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (c) => isDefined(c.filterValue) || c.filterValues?.length,
      )[0];
    const isClearSieving = this._savedSortFilterState?.sieveColumn && !sieveColumn;
    if (sieveColumn || isClearSieving) {
      const sieveOptions = sieveColumn && {
        sievedItems: this._ganttTreeList?.getSievedItems(),
        sieveColumn,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        expandTasks: filterChanged || (filterValue && sortedStateChanged),
      };
      this.isSieving = !isClearSieving;
      this._setGanttViewOption('sieve', sieveOptions);
    }
    this._savedSortFilterState = {
      sort: sortedState,
      filter: filterValue,
      sieveColumn,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _compareSortedState(state1?: any[], state2?: any[]): boolean {
    if (!state1 || !state2 || state1.length !== state2.length) {
      return false;
    }
    return state1.every(
      (c, i): boolean => c.sortIndex === state2[i].sortIndex
        && c.sortOrder === state2[i].sortOrder,
    );
  }

  _getToolbarItems(): NonNullable<Properties['toolbar']>['items'] {
    const { toolbar } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return toolbar?.items || [];
  }

  _updateToolbarContent(): void {
    const items = this._getToolbarItems();
    if (items?.length) {
      this._$toolbarWrapper.show();
    } else {
      this._$toolbarWrapper.hide();
    }
    this._toolbar?.createItems(items);
    this._updateBarItemsState();
  }

  _updateContextMenu(): void {
    const { contextMenu } = this.option();
    if (contextMenu?.enabled && this._contextMenuBar) {
      this._contextMenuBar.createItems(contextMenu?.items);
      this._updateBarItemsState();
    }
  }

  _updateBarItemsState(): void {
    this._ganttView?.updateBarItemsState();
  }

  _showDialog(e): void {
    if (!this._dialogInstance) {
      this._dialogInstance = new GanttDialog(this, this._$dialog);
    }
    this._dialogInstance.show(
      e.name,
      e.parameters,
      e.callback,
      e.afterClosing,
      this.option('editing'),
    );
  }

  _showPopupMenu(info): void {
    if (this.option('contextMenu.enabled')) {
      this._ganttView?.getBarManager().updateContextMenu();
      const args = {
        cancel: false,
        event: info.event,
        targetType: info.type,
        targetKey: info.key,
        items: extend(true, [], this._contextMenuBar?._items),
        data:
          info.type === 'task'
            ? this.getTaskData(info.key)
            : this.getDependencyData(info.key),
      };
      this._actionsManager?.raiseContextMenuPreparing(args);
      if (!args.cancel) {
        this._contextMenuBar?.show(info.position, args.items);
      }
    }
  }

  _hidePopupMenu(): void {
    this._contextMenuBar?.hide();
  }

  _getLoadPanel(): LoadPanel {
    if (!this._loadPanel) {
      this._loadPanel = this._createComponent(this._$loadPanel, LoadPanel, {
        position: {
          // @ts-expect-error ts-error
          of: this.$element(),
        },
      });
    }
    return this._loadPanel;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskKeyGetter() {
    return this._getDataSourceItemKeyGetter(GANTT_TASKS);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findTaskByKey(key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getDataSourceItem(GANTT_TASKS, key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDataSourceItem(dataOptionName: string, key) {
    const dataOption = this[`_${dataOptionName}Option`];
    const keyGetter = this._getDataSourceItemKeyGetter(dataOptionName);
    const items = dataOption?._getItems();
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items.find((t): boolean => keyGetter(t) === key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDataSourceItemKeyGetter(dataOptionName: string) {
    // @ts-expect-error ts-error
    return compileGetter(this.option(`${dataOptionName}.keyExpr`));
  }

  _setGanttViewOption(optionName: string, value): void {
    this._ganttView?.option(optionName, value);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
  _getGanttViewOption(optionName: string, value?) {
    return this._ganttView?.option(optionName);
  }

  _getExportHelper(): GanttExportHelper {
    this._exportHelper ??= new GanttExportHelper(this);
    return this._exportHelper;
  }

  _executeCoreCommand(id): void {
    this._ganttView?.executeCoreCommand(id);
  }

  _expandAll(): void {
    // @ts-expect-error ts-error
    this._changeExpandAll(true);
  }

  _collapseAll(): void {
    // @ts-expect-error ts-error
    this._changeExpandAll(false);
  }

  _onTreeListRowExpandChanged(e, expanded): void {
    if (!this._lockRowExpandEvent) {
      this._ganttView?.changeTaskExpanded(e.key, expanded);
      this._sizeHelper?.adjustHeight();
    }
  }

  _changeExpandAll(expanded: boolean, level, rowKey): void {
    const allExpandableNodes = [];
    const nodesToExpand = [];

    // @ts-expect-error ts-error
    this._treeList?.forEachNode((node): void => {
      if (node.children?.length) {
        // @ts-expect-error ts-error
        allExpandableNodes.push(node);
      }
    });
    if (rowKey) {
      // @ts-expect-error ts-error
      const node = this._treeList?.getNodeByKey(rowKey);
      GanttHelper.getAllParentNodesKeys(node, nodesToExpand);
    }

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let promise;
    this._lockRowExpandEvent = allExpandableNodes.length > 0;
    const state = allExpandableNodes.reduce((previous, node, index) => {
      if (rowKey) {
        // @ts-expect-error ts-error
        // eslint-disable-next-line no-param-reassign
        expanded = nodesToExpand.includes(node.key);
      } else if (level) {
        // @ts-expect-error ts-error
        // eslint-disable-next-line no-param-reassign
        expanded = node.level < level;
      }

      // @ts-expect-error ts-error
      previous[node.key] = expanded;
      const action = expanded
        // @ts-expect-error ts-error
        ? this._treeList?.expandRow
        // @ts-expect-error ts-error
        : this._treeList?.collapseRow;
      const isLast = index === allExpandableNodes.length - 1;
      if (isLast) {
        // @ts-expect-error ts-error
        promise = action(node.key);
      } else {
        // @ts-expect-error ts-error
        action(node.key);
      }
      return previous;
    }, {});

    promise?.then((): void => {
      this._ganttView?.applyTasksExpandedState(state);
      this._sizeHelper?.adjustHeight();
      delete this._lockRowExpandEvent;
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskResources(key) {
    if (!isDefined(key)) {
      return null;
    }
    const coreData = this._ganttView?._ganttViewCore.getTaskResources(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return coreData.map((r) => this._mappingHelper?.convertCoreToMappedData(GANTT_RESOURCES, r));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getVisibleTaskKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttView?._ganttViewCore.getVisibleTaskKeys();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getVisibleDependencyKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttView?._ganttViewCore.getVisibleDependencyKeys();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getVisibleResourceKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttView?._ganttViewCore.getVisibleResourceKeys();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getVisibleResourceAssignmentKeys() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._ganttView?._ganttViewCore.getVisibleResourceAssignmentKeys();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskData(key) {
    if (!isDefined(key)) {
      return null;
    }
    const coreData = this._ganttView?._ganttViewCore.getTaskData(key);
    const mappedData = this.getTaskDataByCoreData(coreData);
    return mappedData;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskDataByCoreData(coreData) {
    const mappedData = coreData
      ? this._mappingHelper?.convertCoreToMappedData(GANTT_TASKS, coreData)
      : null;
    this._customFieldsManager?.addCustomFieldsData(coreData?.id, mappedData);
    return mappedData;
  }

  insertTask(data): void {
    this._customFieldsManager?.saveCustomFieldsDataToCache(
      GANTT_NEW_TASK_CACHE_KEY,
      data,
    );
    this._ganttView?._ganttViewCore.insertTask(
      this._mappingHelper?.convertMappedToCoreData(GANTT_TASKS, data),
    );
  }

  deleteTask(key): void {
    this._ganttView?._ganttViewCore.deleteTask(key);
  }

  updateTask(key, data): void {
    const coreTaskData = this._mappingHelper?.convertMappedToCoreData(
      GANTT_TASKS,
      data,
    );
    // @ts-expect-error ts-error
    const isCustomFieldsUpdateOnly = !Object.keys(coreTaskData).length;
    this._customFieldsManager?.saveCustomFieldsDataToCache(
      key,
      data,
      true,
      isCustomFieldsUpdateOnly,
    );
    if (isCustomFieldsUpdateOnly) {
      const customFieldsData = this._customFieldsManager?._getCustomFieldsData(data);
      if (Object.keys(customFieldsData).length > 0) {
        this._actionsManager?.raiseUpdatingAction(GANTT_TASKS, {
          cancel: false,
          key,
          newValues: {},
        });
      }
    } else {
      this._ganttView?._ganttViewCore.updateTask(key, coreTaskData);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDependencyData(key) {
    if (!isDefined(key)) {
      return null;
    }
    const coreData = this._ganttView?._ganttViewCore.getDependencyData(key);
    return coreData
      ? this._mappingHelper?.convertCoreToMappedData(
        GANTT_DEPENDENCIES,
        coreData,
      )
      : null;
  }

  insertDependency(data): void {
    this._ganttView?._ganttViewCore.insertDependency(
      this._mappingHelper?.convertMappedToCoreData(GANTT_DEPENDENCIES, data),
    );
  }

  deleteDependency(key): void {
    this._ganttView?._ganttViewCore.deleteDependency(key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getResourceData(key) {
    const coreData = this._ganttView?._ganttViewCore.getResourceData(key);
    return coreData
      ? this._mappingHelper?.convertCoreToMappedData(GANTT_RESOURCES, coreData)
      : null;
  }

  deleteResource(key): void {
    this._ganttView?._ganttViewCore.deleteResource(key);
  }

  insertResource(data, taskKeys): void {
    this._ganttView?._ganttViewCore.insertResource(
      this._mappingHelper?.convertMappedToCoreData(GANTT_RESOURCES, data),
      taskKeys,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getResourceAssignmentData(key) {
    const coreData = this._ganttView?._ganttViewCore.getResourceAssignmentData(key);
    return coreData
      ? this._mappingHelper?.convertCoreToMappedData(
        GANTT_RESOURCE_ASSIGNMENTS,
        coreData,
      )
      : null;
  }

  assignResourceToTask(resourceKey, taskKey): void {
    this._ganttView?._ganttViewCore.assignResourceToTask(resourceKey, taskKey);
  }

  unassignResourceFromTask(resourceKey, taskKey): void {
    this._ganttView?._ganttViewCore.unassignResourceFromTask(
      resourceKey,
      taskKey,
    );
  }

  unassignAllResourcesFromTask(taskKey): void {
    this._ganttView?._ganttViewCore.unassignAllResourcesFromTask(taskKey);
  }

  updateDimensions(): void {
    this._sizeHelper?.onAdjustControl();
  }

  scrollToDate(date): void {
    this._ganttView?._ganttViewCore.scrollToDate(date);
  }

  showResourceManagerDialog(): void {
    this._ganttView?._ganttViewCore.showResourcesDialog();
  }

  showTaskDetailsDialog(taskKey): void {
    this._ganttView?._ganttViewCore.showTaskDetailsDialog(taskKey);
  }

  exportToPdf(options): Promise<unknown> {
    return this._exportToPdf(options);
  }

  _exportToPdf(options): Promise<unknown> {
    this._exportHelper?.reset();
    const fullOptions = extend({}, options);
    if (fullOptions.createDocumentMethod) {
      fullOptions.docCreateMethod = fullOptions.createDocumentMethod;
    }
    fullOptions.pdfDocument ??= fullOptions.jsPDFDocument;
    fullOptions.docCreateMethod
      // @ts-expect-error ts-error
      ??= window.jspdf?.jsPDF ?? window.jsPDF;
    fullOptions.format ??= 'a4';
    return new Promise((resolve) => {
      const doc = this._ganttView?._ganttViewCore.exportToPdf(fullOptions);
      resolve(doc);
    });
  }

  refresh(): Promise<unknown> {
    return new Promise((resolve, reject): void => {
      try {
        this._refreshGantt();
        // @ts-expect-error ts-error
        resolve();
      } catch (e) {
        // @ts-expect-error ts-error
        reject(e.message);
      }
    });
  }

  expandAll(): void {
    this._expandAll();
  }

  collapseAll(): void {
    this._collapseAll();
  }

  expandAllToLevel(level): void {
    // @ts-expect-error ts-error
    this._changeExpandAll(false, level);
  }

  expandToTask(key): void {
    // @ts-expect-error ts-error
    const node = this._treeList?.getNodeByKey(key);
    this._changeExpandAll(false, 0, node?.parent?.key);
  }

  collapseTask(key): void {
    // @ts-expect-error ts-error
    this._treeList?.collapseRow(key);
  }

  expandTask(key): void {
    // @ts-expect-error ts-error
    this._treeList?.expandRow(key);
  }

  showResources(value: boolean): void {
    this.option('showResources', value);
  }

  showDependencies(value: boolean): void {
    this.option('showDependencies', value);
  }

  zoomIn(): void {
    this._ganttView?._ganttViewCore.zoomIn();
  }

  zoomOut(): void {
    this._ganttView?._ganttViewCore.zoomOut();
  }

  _getDefaultOptions(): Properties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), GanttHelper.getDefaultOptions());
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, fullName, value } = args;

    switch (name) {
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
        this._ganttTreeList?.setOption(
          'columns',
          this._ganttTreeList.getColumns(),
        );
        break;
      case 'taskListWidth':
        this._sizeHelper?.setInnerElementsWidth();
        break;
      case 'showResources':
        this._setGanttViewOption('showResources', value);
        break;
      case 'showDependencies':
        this._setGanttViewOption('showDependencies', value);
        break;
      case 'taskTitlePosition':
        this._setGanttViewOption('taskTitlePosition', value);
        break;
      case 'firstDayOfWeek':
        this._setGanttViewOption('firstDayOfWeek', value);
        break;
      case 'startDateRange':
        this._setGanttViewOption('startDateRange', value);
        break;
      case 'endDateRange':
        this._setGanttViewOption('endDateRange', value);
        break;
      case 'selectedRowKey':
        this._ganttTreeList?.selectRows(
          GanttHelper.getArrayFromOneElement(value),
        );
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
        this._actionsManager?.createResourceUnassigningAction();
        break;
      case 'onResourceUnassigned':
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
        this._ganttTreeList?.setOption(
          'selection.mode',
          GanttHelper.getSelectionMode(value),
        );
        this._setGanttViewOption('allowSelection', value);
        break;
      case 'showRowLines':
        this._ganttTreeList?.setOption('showRowLines', value);
        this._setGanttViewOption('showRowLines', value);
        break;
      case 'stripLines':
        this._setGanttViewOption(fullName, value);
        break;
      case 'scaleType':
        this._setGanttViewOption('scaleType', value);
        break;
      case 'scaleTypeRange':
        this._setGanttViewOption('scaleTypeRange', this.option(name));
        break;
      case 'editing':
        this._setGanttViewOption('editing', this.option(name));
        break;
      case 'validation':
        this._setGanttViewOption('validation', this.option(name));
        break;
      case 'toolbar':
        this._updateToolbarContent();
        break;
      case 'contextMenu':
        this._updateContextMenu();
        break;
      case 'taskTooltipContentTemplate':
        this._setGanttViewOption(
          'taskTooltipContentTemplate',
          this._ganttTemplatesManager?.getTaskTooltipContentTemplateFunc(
            value,
          ),
        );
        break;
      case 'taskProgressTooltipContentTemplate':
        this._setGanttViewOption(
          'taskProgressTooltipContentTemplate',
          this._ganttTemplatesManager?.getTaskProgressTooltipContentTemplateFunc(
            value,
          ),
        );
        break;
      case 'taskTimeTooltipContentTemplate':
        this._setGanttViewOption(
          'taskTimeTooltipContentTemplate',
          this._ganttTemplatesManager?.getTaskTimeTooltipContentTemplateFunc(
            value,
          ),
        );
        break;
      case 'taskContentTemplate':
        this._setGanttViewOption(
          'taskContentTemplate',
          this._ganttTemplatesManager?.getTaskContentTemplateFunc(value),
        );
        break;
      case 'rootValue':
        this._ganttTreeList?.setOption('rootValue', value);
        break;
      case 'width':
        super._optionChanged(args);
        this._sizeHelper?.updateGanttWidth();
        break;
      case 'height':
        super._optionChanged(args);
        this._sizeHelper?.setGanttHeight(getHeight(this.$element()));
        break;
      case 'sorting':
        this._ganttTreeList?.setOption('sorting', this.option(name));
        break;
      case 'filterRow':
        this._ganttTreeList?.setOption('filterRow', this.option(name));
        break;
      case 'headerFilter':
        this._ganttTreeList?.setOption('headerFilter', this.option(name));
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxGantt', Gantt);
export default Gantt;
