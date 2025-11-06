/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type {
  ContextMenuPreparingEvent,
  CustomCommandEvent,
  DependencyDeletedEvent,
  DependencyDeletingEvent,
  DependencyInsertedEvent,
  DependencyInsertingEvent,
  GanttRenderScaleType,
  Properties,
  ResourceAssignedEvent,
  ResourceAssigningEvent,
  ResourceDeletedEvent,
  ResourceDeletingEvent,
  ResourceInsertedEvent,
  ResourceInsertingEvent,
  ResourceManagerDialogShowingEvent,
  ResourceUnassignedEvent,
  ResourceUnassigningEvent,
  ScaleCellPreparedEvent,
  SelectionChangedEvent,
  TaskClickEvent,
  TaskDblClickEvent,
  TaskDeletedEvent,
  TaskDeletingEvent,
  TaskEditDialogShowingEvent,
  TaskInsertedEvent,
  TaskInsertingEvent,
  TaskMovingEvent,
  TaskUpdatedEvent,
  TaskUpdatingEvent,
} from '@js/ui/gantt';
import type Gantt from '@ts/ui/gantt/ui.gantt';
import type { GanttCustomFieldsManager } from '@ts/ui/gantt/ui.gantt.custom_fields';
import type { GanttMappingHelper } from '@ts/ui/gantt/ui.gantt.mapping_helper';

const Actions: Record<string, keyof Properties> = {
  onContextMenuPreparing: 'onContextMenuPreparing',
  onCustomCommand: 'onCustomCommand',
  onDependencyDeleted: 'onDependencyDeleted',
  onDependencyDeleting: 'onDependencyDeleting',
  onDependencyInserted: 'onDependencyInserted',
  onDependencyInserting: 'onDependencyInserting',
  onResourceAssigned: 'onResourceAssigned',
  onResourceAssigning: 'onResourceAssigning',
  onResourceDeleted: 'onResourceDeleted',
  onResourceDeleting: 'onResourceDeleting',
  onResourceInserted: 'onResourceInserted',
  onResourceInserting: 'onResourceInserting',
  onResourceManagerDialogShowing: 'onResourceManagerDialogShowing',
  onResourceUnassigned: 'onResourceUnassigned',
  onResourceUnassigning: 'onResourceUnassigning',
  onSelectionChanged: 'onSelectionChanged',
  onTaskClick: 'onTaskClick',
  onTaskDblClick: 'onTaskDblClick',
  onTaskDeleted: 'onTaskDeleted',
  onTaskDeleting: 'onTaskDeleting',
  onTaskEditDialogShowing: 'onTaskEditDialogShowing',
  onTaskInserted: 'onTaskInserted',
  onTaskInserting: 'onTaskInserting',
  onTaskMoving: 'onTaskMoving',
  onTaskUpdated: 'onTaskUpdated',
  onTaskUpdating: 'onTaskUpdating',
  onScaleCellPrepared: 'onScaleCellPrepared',
};

const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';
const GANTT_NEW_TASK_CACHE_KEY = 'gantt_new_task_key';

export class GanttActionsManager {
  _gantt: Gantt;

  _mappingHelper?: GanttMappingHelper;

  _customFieldsManager?: GanttCustomFieldsManager;

  _taskDblClickAction?: (e: Partial<TaskDblClickEvent>) => void;

  _taskClickAction?: (e: Partial<TaskClickEvent>) => void;

  _selectionChangedAction?: (e: Partial<SelectionChangedEvent>) => void;

  _customCommandAction?: (e: Partial<CustomCommandEvent>) => void;

  _contextMenuPreparingAction?: (e: Partial<ContextMenuPreparingEvent>) => void;

  _taskInsertingAction?: (e: Partial<TaskInsertingEvent>) => void;

  _dependencyInsertingAction?: (e: Partial<DependencyInsertingEvent>) => void;

  _resourceInsertingAction?: (e: Partial<ResourceInsertingEvent>) => void;

  _resourceAssigningAction?: (e: Partial<ResourceAssigningEvent>) => void;

  _taskInsertedAction?: (e: Partial<TaskInsertedEvent>) => void;

  _dependencyInsertedAction?: (e: Partial<DependencyInsertedEvent>) => void;

  _resourceInsertedAction?: (e: Partial<ResourceInsertedEvent>) => void;

  _resourceAssignedAction?: (e: Partial<ResourceAssignedEvent>) => void;

  _taskDeletingAction?: (e: Partial<TaskDeletingEvent>) => void;

  _dependencyDeletingAction?: (e: Partial<DependencyDeletingEvent>) => void;

  _resourceDeletingAction?: (e: Partial<ResourceDeletingEvent>) => void;

  _resourceUnassigningAction?: (e: Partial<ResourceUnassigningEvent>) => void;

  _taskDeletedAction?: (e: Partial<TaskDeletedEvent>) => void;

  _dependencyDeletedAction?: (e: Partial<DependencyDeletedEvent>) => void;

  _resourceDeletedAction?: (e: Partial<ResourceDeletedEvent>) => void;

  _resourceUnassignedAction?: (e: Partial<ResourceUnassignedEvent>) => void;

  _taskUpdatingAction?: (e: Partial<TaskUpdatingEvent>) => void;

  _taskUpdatedAction?: (e: Partial<TaskUpdatedEvent>) => void;

  _taskEditDialogShowingAction?: (e: Partial<TaskEditDialogShowingEvent>) => void;

  _resourceManagerDialogShowingAction?: (e: Partial<ResourceManagerDialogShowingEvent>) => void;

  _taskMovingAction?: (e: Partial<TaskMovingEvent>) => void;

  _scaleCellPreparedAction?: (e: Partial<ScaleCellPreparedEvent>) => void;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
    this._mappingHelper = gantt._mappingHelper;
    this._customFieldsManager = gantt._customFieldsManager;
  }

  _createActionByOption(optionName: keyof Properties): (e: unknown) => void {
    return this._gantt?._createActionByOption(optionName);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskData(key) {
    return this._gantt.getTaskData(key);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _convertCoreToMappedData(optionName: string, coreData) {
    return this._mappingHelper?.convertCoreToMappedData(optionName, coreData);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _convertMappedToCoreData(optionName: string, mappedData) {
    return this._mappingHelper?.convertMappedToCoreData(optionName, mappedData);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _convertMappedToCoreFields(optionName: string, fields) {
    return this._mappingHelper?.convertMappedToCoreFields(optionName, fields);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _convertCoreToMappedFields(optionName: string, fields) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._mappingHelper?.convertCoreToMappedFields(optionName, fields);
  }

  _saveCustomFieldsDataToCache(
    key,
    data,
    forceUpdateOnKeyExpire = false,
    isCustomFieldsUpdateOnly = false,
  ): void {
    this._customFieldsManager?.saveCustomFieldsDataToCache(
      key,
      data,
      forceUpdateOnKeyExpire,
      isCustomFieldsUpdateOnly,
    );
  }

  createTaskDblClickAction(): void {
    this._taskDblClickAction = this._createActionByOption(
      Actions.onTaskDblClick,
    );
  }

  taskDblClickAction(args): void {
    if (!this._taskDblClickAction) {
      this.createTaskDblClickAction();
    }
    this._taskDblClickAction?.(args);
  }

  raiseTaskDblClickAction(key, event): boolean {
    const args = {
      cancel: false,
      data: this._getTaskData(key),
      event,
      key,
    };
    this.taskDblClickAction(args);
    return !args.cancel;
  }

  createTaskClickAction(): void {
    this._taskClickAction = this._createActionByOption(Actions.onTaskClick);
  }

  taskClickAction(args): void {
    if (!this._taskClickAction) {
      this.createTaskClickAction();
    }
    this._taskClickAction?.(args);
  }

  raiseTaskClickAction(key, event): void {
    const args = {
      key,
      event,
      data: this._getTaskData(key),
    };
    this.taskClickAction(args);
  }

  createSelectionChangedAction(): void {
    this._selectionChangedAction = this._createActionByOption(
      Actions.onSelectionChanged,
    );
  }

  selectionChangedAction(args): void {
    if (!this._selectionChangedAction) {
      this.createSelectionChangedAction();
    }
    this._selectionChangedAction?.(args);
  }

  raiseSelectionChangedAction(selectedRowKey): void {
    this.selectionChangedAction({ selectedRowKey });
  }

  createCustomCommandAction(): void {
    this._customCommandAction = this._createActionByOption(
      Actions.onCustomCommand,
    );
  }

  customCommandAction(args): void {
    if (!this._customCommandAction) {
      this.createCustomCommandAction();
    }
    this._customCommandAction?.(args);
  }

  raiseCustomCommand(commandName): void {
    this.customCommandAction({ name: commandName });
  }

  createContextMenuPreparingAction(): void {
    this._contextMenuPreparingAction = this._createActionByOption(
      Actions.onContextMenuPreparing,
    );
  }

  contextMenuPreparingAction(args): void {
    if (!this._contextMenuPreparingAction) {
      this.createContextMenuPreparingAction();
    }
    this._contextMenuPreparingAction?.(args);
  }

  raiseContextMenuPreparing(options): void {
    this.contextMenuPreparingAction(options);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getInsertingAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskInsertingAction();
      case GANTT_DEPENDENCIES:
        return this._getDependencyInsertingAction();
      case GANTT_RESOURCES:
        return this._getResourceInsertingAction();
      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceAssigningAction();
      default:
        return (): void => {};
    }
  }

  raiseInsertingAction(optionName: string, coreArgs): void {
    const action = this._getInsertingAction(optionName);
    if (action) {
      const args = {
        cancel: false,
        values: this._convertCoreToMappedData(optionName, coreArgs.values),
      };
      action(args);
      coreArgs.cancel = args.cancel;
      extend(
        coreArgs.values,
        this._convertMappedToCoreData(optionName, args.values),
      );
      if (optionName === GANTT_TASKS) {
        this._saveCustomFieldsDataToCache(
          GANTT_NEW_TASK_CACHE_KEY,
          args.values,
        );
      }
    }
  }

  createTaskInsertingAction(): void {
    this._taskInsertingAction = this._createActionByOption(
      Actions.onTaskInserting,
    );
  }

  taskInsertingAction(args): void {
    const action = this._getTaskInsertingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskInsertingAction() {
    if (!this._taskInsertingAction) {
      this.createTaskInsertingAction();
    }
    return this._taskInsertingAction;
  }

  createDependencyInsertingAction(): void {
    this._dependencyInsertingAction = this._createActionByOption(
      Actions.onDependencyInserting,
    );
  }

  dependencyInsertingAction(args): void {
    const action = this._getDependencyInsertingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDependencyInsertingAction() {
    if (!this._dependencyInsertingAction) {
      this.createDependencyInsertingAction();
    }
    return this._dependencyInsertingAction;
  }

  createResourceInsertingAction(): void {
    this._resourceInsertingAction = this._createActionByOption(
      Actions.onResourceInserting,
    );
  }

  resourceInsertingAction(args): void {
    const action = this._getResourceInsertingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceInsertingAction() {
    if (!this._resourceInsertingAction) {
      this.createResourceInsertingAction();
    }
    return this._resourceInsertingAction;
  }

  createResourceAssigningAction(): void {
    this._resourceAssigningAction = this._createActionByOption(
      Actions.onResourceAssigning,
    );
  }

  resourceAssigningAction(args): void {
    const action = this._getResourceAssigningAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceAssigningAction() {
    if (!this._resourceAssigningAction) {
      this.createResourceAssigningAction();
    }
    return this._resourceAssigningAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getInsertedAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskInsertedAction();
      case GANTT_DEPENDENCIES:
        return this._getDependencyInsertedAction();
      case GANTT_RESOURCES:
        return this._getResourceInsertedAction();
      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceAssignedAction();
      default:
        return (): void => {};
    }
  }

  raiseInsertedAction(optionName: string, data, key): void {
    const action = this._getInsertedAction(optionName);
    if (action) {
      const args = { values: data, key };
      action(args);
    }
  }

  createTaskInsertedAction(): void {
    this._taskInsertedAction = this._createActionByOption(
      Actions.onTaskInserted,
    );
  }

  taskInsertedAction(args): void {
    const action = this._getTaskInsertedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskInsertedAction() {
    if (!this._taskInsertedAction) {
      this.createTaskInsertedAction();
    }
    return this._taskInsertedAction;
  }

  createDependencyInsertedAction(): void {
    this._dependencyInsertedAction = this._createActionByOption(
      Actions.onDependencyInserted,
    );
  }

  dependencyInsertedAction(args): void {
    const action = this._getDependencyInsertedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDependencyInsertedAction() {
    if (!this._dependencyInsertedAction) {
      this.createDependencyInsertedAction();
    }
    return this._dependencyInsertedAction;
  }

  createResourceInsertedAction(): void {
    this._resourceInsertedAction = this._createActionByOption(
      Actions.onResourceInserted,
    );
  }

  resourceInsertedAction(args): void {
    const action = this._getResourceInsertedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceInsertedAction() {
    if (!this._resourceInsertedAction) {
      this.createResourceInsertedAction();
    }
    return this._resourceInsertedAction;
  }

  createResourceAssignedAction(): void {
    this._resourceAssignedAction = this._createActionByOption(
      Actions.onResourceAssigned,
    );
  }

  resourceAssignedAction(args): void {
    const action = this._getResourceAssignedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceAssignedAction() {
    if (!this._resourceAssignedAction) {
      this.createResourceAssignedAction();
    }
    return this._resourceAssignedAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDeletingAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskDeletingAction();
      case GANTT_DEPENDENCIES:
        return this._getDependencyDeletingAction();
      case GANTT_RESOURCES:
        return this._getResourceDeletingAction();
      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceUnassigningAction();
      default:
        return (): void => {};
    }
  }

  raiseDeletingAction(optionName, coreArgs): void {
    const action = this._getDeletingAction(optionName);
    if (action) {
      const args = {
        cancel: false,
        key: coreArgs.key,
        values: this._convertCoreToMappedData(optionName, coreArgs.values),
      };
      action(args);
      coreArgs.cancel = args.cancel;
    }
  }

  createTaskDeletingAction(): void {
    this._taskDeletingAction = this._createActionByOption(
      Actions.onTaskDeleting,
    );
  }

  taskDeletingAction(args): void {
    const action = this._getTaskDeletingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskDeletingAction() {
    if (!this._taskDeletingAction) {
      this.createTaskDeletingAction();
    }
    return this._taskDeletingAction;
  }

  createDependencyDeletingAction(): void {
    this._dependencyDeletingAction = this._createActionByOption(
      Actions.onDependencyDeleting,
    );
  }

  dependencyDeletingAction(args): void {
    const action = this._getDependencyDeletingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDependencyDeletingAction() {
    if (!this._dependencyDeletingAction) {
      this.createDependencyDeletingAction();
    }
    return this._dependencyDeletingAction;
  }

  createResourceDeletingAction(): void {
    this._resourceDeletingAction = this._createActionByOption(
      Actions.onResourceDeleting,
    );
  }

  resourceDeletingAction(args): void {
    const action = this._getResourceDeletingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceDeletingAction() {
    if (!this._resourceDeletingAction) {
      this.createResourceDeletingAction();
    }
    return this._resourceDeletingAction;
  }

  createResourceUnassigningAction(): void {
    this._resourceUnassigningAction = this._createActionByOption(
      Actions.onResourceUnassigning,
    );
  }

  resourceUnassigningAction(args): void {
    const action = this._getResourceUnassigningAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceUnassigningAction() {
    if (!this._resourceUnassigningAction) {
      this.createResourceUnassigningAction();
    }
    return this._resourceUnassigningAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDeletedAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskDeletedAction();
      case GANTT_DEPENDENCIES:
        return this._getDependencyDeletedAction();
      case GANTT_RESOURCES:
        return this._getResourceDeletedAction();
      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceUnassignedAction();
      default:
        return (): void => {};
    }
  }

  raiseDeletedAction(optionName: string, key, data): void {
    const action = this._getDeletedAction(optionName);
    if (action) {
      const args = { key, values: data };
      action(args);
    }
  }

  createTaskDeletedAction(): void {
    this._taskDeletedAction = this._createActionByOption(Actions.onTaskDeleted);
  }

  taskDeletedAction(args): void {
    const action = this._getTaskDeletedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskDeletedAction() {
    if (!this._taskDeletedAction) {
      this.createTaskDeletedAction();
    }
    return this._taskDeletedAction;
  }

  createDependencyDeletedAction(): void {
    this._dependencyDeletedAction = this._createActionByOption(
      Actions.onDependencyDeleted,
    );
  }

  dependencyDeletedAction(args): void {
    const action = this._getDependencyDeletedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDependencyDeletedAction() {
    if (!this._dependencyDeletedAction) {
      this.createDependencyDeletedAction();
    }
    return this._dependencyDeletedAction;
  }

  createResourceDeletedAction(): void {
    this._resourceDeletedAction = this._createActionByOption(
      Actions.onResourceDeleted,
    );
  }

  resourceDeletedAction(args): void {
    const action = this._getResourceDeletedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceDeletedAction() {
    if (!this._resourceDeletedAction) {
      this.createResourceDeletedAction();
    }
    return this._resourceDeletedAction;
  }

  createResourceUnassignedAction(): void {
    this._resourceUnassignedAction = this._createActionByOption(
      Actions.onResourceUnassigned,
    );
  }

  resourceUnassignedAction(args): void {
    const action = this._getResourceUnassignedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceUnassignedAction() {
    if (!this._resourceUnassignedAction) {
      this.createResourceUnassignedAction();
    }
    return this._resourceUnassignedAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getUpdatingAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskUpdatingAction();
      default:
        return (): void => {};
    }
  }

  raiseUpdatingAction(optionName: string, coreArgs, action?): void {
    // eslint-disable-next-line no-param-reassign
    action = action || this._getUpdatingAction(optionName);
    if (action) {
      const isTaskUpdating = optionName === GANTT_TASKS;
      const args = {
        cancel: false,
        key: coreArgs.key,
        newValues: this._convertCoreToMappedData(
          optionName,
          coreArgs.newValues,
        ),
        values: isTaskUpdating
          ? this._getTaskData(coreArgs.key)
          : this._convertCoreToMappedData(optionName, coreArgs.values),
      };
      if (isTaskUpdating && this._customFieldsManager?.cache.hasData(args.key)) {
        this._customFieldsManager?.addCustomFieldsDataFromCache(
          args.key,
          args.newValues,
        );
      }
      action(args);
      coreArgs.cancel = args.cancel;
      extend(
        coreArgs.newValues,
        this._convertMappedToCoreData(optionName, args.newValues),
      );
      if (isTaskUpdating) {
        if (args.cancel) {
          this._customFieldsManager?.resetCustomFieldsDataCache(args.key);
        } else {
          const forceUpdateOnKeyExpire = !Object.keys(coreArgs.newValues)
            .length;
          this._saveCustomFieldsDataToCache(
            args.key,
            args.newValues,
            forceUpdateOnKeyExpire,
          );
        }
      }
    }
  }

  createTaskUpdatingAction(): void {
    this._taskUpdatingAction = this._createActionByOption(
      Actions.onTaskUpdating,
    );
  }

  taskUpdatingAction(args): void {
    const action = this._getTaskUpdatingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskUpdatingAction() {
    if (!this._taskUpdatingAction) {
      this.createTaskUpdatingAction();
    }
    return this._taskUpdatingAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getUpdatedAction(optionName: string) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskUpdatedAction();
      default:
        return (): void => {};
    }
  }

  raiseUpdatedAction(optionName: string, data, key): void {
    const action = this._getUpdatedAction(optionName);
    if (action) {
      const args = { values: data, key };
      action(args);
    }
  }

  createTaskUpdatedAction(): void {
    this._taskUpdatedAction = this._createActionByOption(Actions.onTaskUpdated);
  }

  taskUpdatedAction(args): void {
    const action = this._getTaskUpdatedAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskUpdatedAction() {
    if (!this._taskUpdatedAction) {
      this.createTaskUpdatedAction();
    }
    return this._taskUpdatedAction;
  }

  createTaskEditDialogShowingAction(): void {
    this._taskEditDialogShowingAction = this._createActionByOption(
      Actions.onTaskEditDialogShowing,
    );
  }

  taskEditDialogShowingAction(args): void {
    const action = this._getTaskEditDialogShowingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskEditDialogShowingAction() {
    if (!this._taskEditDialogShowingAction) {
      this.createTaskEditDialogShowingAction();
    }
    return this._taskEditDialogShowingAction;
  }

  raiseTaskEditDialogShowingAction(coreArgs): void {
    const action = this._getTaskEditDialogShowingAction();
    if (action) {
      const args = {
        cancel: false,
        key: coreArgs.key,
        values: this._convertCoreToMappedData(GANTT_TASKS, coreArgs.values),
        readOnlyFields: this._convertCoreToMappedFields(
          GANTT_TASKS,
          coreArgs.readOnlyFields,
        ),
        hiddenFields: this._convertCoreToMappedFields(
          GANTT_TASKS,
          coreArgs.hiddenFields,
        ),
      };
      action(args);
      coreArgs.cancel = args.cancel;
      extend(
        coreArgs.values,
        this._convertMappedToCoreData(GANTT_TASKS, args.values),
      );
      coreArgs.readOnlyFields = this._convertMappedToCoreFields(
        GANTT_TASKS,
        args.readOnlyFields,
      );
      coreArgs.hiddenFields = this._convertMappedToCoreFields(
        GANTT_TASKS,
        args.hiddenFields,
      );
    }
  }

  createResourceManagerDialogShowingAction(): void {
    this._resourceManagerDialogShowingAction = this._createActionByOption(
      Actions.onResourceManagerDialogShowing,
    );
  }

  resourceManagerDialogShowingAction(args): void {
    const action = this._getResourceManagerDialogShowingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getResourceManagerDialogShowingAction() {
    if (!this._resourceManagerDialogShowingAction) {
      this.createResourceManagerDialogShowingAction();
    }
    return this._resourceManagerDialogShowingAction;
  }

  raiseResourceManagerDialogShowingAction(coreArgs): void {
    const action = this._getResourceManagerDialogShowingAction();
    if (action) {
      const mappedResources = coreArgs.values.resources.items
        .map((r) => this._convertMappedToCoreData(GANTT_RESOURCES, r));
      const args = {
        cancel: false,
        values: mappedResources,
      };
      action(args);
      coreArgs.cancel = args.cancel;
    }
  }

  createTaskMovingAction(): void {
    this._taskMovingAction = this._createActionByOption(Actions.onTaskMoving);
  }

  taskMovingAction(args): void {
    const action = this.getTaskMovingAction();
    action?.(args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskMovingAction() {
    if (!this._taskMovingAction) {
      this.createTaskMovingAction();
    }
    return this._taskMovingAction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getScaleCellPreparedAction() {
    if (!this._scaleCellPreparedAction) {
      this.createScaleCellPreparedAction();
    }
    return this._scaleCellPreparedAction;
  }

  createScaleCellPreparedAction(): void {
    this._scaleCellPreparedAction = this._createActionByOption(
      Actions.onScaleCellPrepared,
    );
  }

  raiseScaleCellPreparedAction(data): void {
    const action = this.getScaleCellPreparedAction();
    if (action) {
      const args = {
        scaleIndex: data.scaleIndex,
        scaleType: this._getScaleType(data.scaleType),
        scaleElement: getPublicElement($(data.scaleElement)),
        separatorElement: getPublicElement($(data.separatorElement)),
        startDate: new Date(data.start),
        endDate: new Date(data.end),
      };
      // @ts-expect-error ts-error
      action?.(args);
    }
  }

  _getScaleType(viewType): GanttRenderScaleType | undefined {
    switch (viewType) {
      case 0:
        return 'minutes';
      case 1:
        return 'hours';
      case 2:
        return 'sixHours';
      case 3:
        return 'days';
      case 4:
        return 'weeks';
      case 5:
        return 'months';
      case 6:
        return 'quarters';
      case 7:
        return 'years';
      case 8:
        return 'fiveYears';
      default:
        return undefined;
    }
  }
}
