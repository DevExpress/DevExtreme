/* eslint-disable @stylistic/max-len,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars */
import type Gantt from '@ts/ui/gantt/ui.gantt';

const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';

export const ModelChangesListener = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  create(gantt: Gantt) {
    return { // IModelChangesListener
      NotifyTaskCreated: (task, callback, errorCallback): void => { gantt._onRecordInserted(GANTT_TASKS, task, callback); },
      NotifyTaskRemoved: (taskId, errorCallback, task): void => { gantt._onRecordRemoved(GANTT_TASKS, taskId, task); },
      NotifyTaskUpdated: (taskId, newValues, errorCallback): void => { gantt._onRecordUpdated(GANTT_TASKS, taskId, newValues); },
      NotifyParentTaskUpdated: (task, errorCallback): void => { gantt._onParentTaskUpdated(task); },
      NotifyDependencyInserted: (dependency, callback, errorCallback): void => { gantt._onRecordInserted(GANTT_DEPENDENCIES, dependency, callback); },
      NotifyDependencyRemoved: (dependencyId, errorCallback, dependency): void => { gantt._onRecordRemoved(GANTT_DEPENDENCIES, dependencyId, dependency); },

      NotifyResourceCreated: (resource, callback, errorCallback): void => { gantt._onRecordInserted(GANTT_RESOURCES, resource, callback); },
      NotifyResourceRemoved: (resourceId, errorCallback, resource): void => { gantt._onRecordRemoved(GANTT_RESOURCES, resourceId, resource); },

      NotifyResourceAssigned: (assignment, callback, errorCallback): void => { gantt._onRecordInserted(GANTT_RESOURCE_ASSIGNMENTS, assignment, callback); },
      NotifyResourceUnassigned: (assignmentId, errorCallback, assignment): void => { gantt._onRecordRemoved(GANTT_RESOURCE_ASSIGNMENTS, assignmentId, assignment); },
      NotifyParentDataRecalculated: (data): void => { gantt._onParentTasksRecalculated(data); },

      NotifyTaskCreating: (args): void => { gantt._actionsManager?.raiseInsertingAction(GANTT_TASKS, args); },
      NotifyTaskRemoving: (args): void => { gantt._actionsManager?.raiseDeletingAction(GANTT_TASKS, args); },
      NotifyTaskUpdating: (args): void => { gantt._actionsManager?.raiseUpdatingAction(GANTT_TASKS, args); },
      NotifyTaskMoving: (args): void => { gantt._actionsManager?.raiseUpdatingAction(GANTT_TASKS, args, gantt._actionsManager?.getTaskMovingAction()); },
      NotifyTaskEditDialogShowing: (args): void => { gantt._actionsManager?.raiseTaskEditDialogShowingAction(args); },
      NotifyResourceManagerDialogShowing: (args): void => { gantt._actionsManager?.raiseResourceManagerDialogShowingAction(args); },
      NotifyDependencyInserting: (args): void => { gantt._actionsManager?.raiseInsertingAction(GANTT_DEPENDENCIES, args); },
      NotifyDependencyRemoving: (args): void => { gantt._actionsManager?.raiseDeletingAction(GANTT_DEPENDENCIES, args); },
      NotifyResourceCreating: (args): void => { gantt._actionsManager?.raiseInsertingAction(GANTT_RESOURCES, args); },
      NotifyResourceRemoving: (args): void => { gantt._actionsManager?.raiseDeletingAction(GANTT_RESOURCES, args); },
      NotifyResourceAssigning: (args): void => { gantt._actionsManager?.raiseInsertingAction(GANTT_RESOURCE_ASSIGNMENTS, args); },
      NotifyResourceUnassigning: (args): void => { gantt._actionsManager?.raiseDeletingAction(GANTT_RESOURCE_ASSIGNMENTS, args); },
      NotifyScaleCellPrepared: (args): void => { gantt._actionsManager?.raiseScaleCellPreparedAction(args); },
      NotifyGanttViewUpdated: (): void => { gantt._onGanttViewCoreUpdated(); },
    };
  },
};
