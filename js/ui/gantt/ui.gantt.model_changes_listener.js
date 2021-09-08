const GANTT_TASKS = 'tasks';
const GANTT_DEPENDENCIES = 'dependencies';
const GANTT_RESOURCES = 'resources';
const GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';

export const ModelChangesListener = {
    create(gantt) {
        return { // IModelChangesListener
            NotifyTaskCreated: (task, callback, errorCallback) => { gantt._onRecordInserted(GANTT_TASKS, task, callback); },
            NotifyTaskRemoved: (taskId, errorCallback, task) => { gantt._onRecordRemoved(GANTT_TASKS, taskId, task); },
            NotifyTaskTitleChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'title', newValue); },
            NotifyTaskDescriptionChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'description', newValue); },
            NotifyTaskStartChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'start', newValue); },
            NotifyTaskEndChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'end', newValue); },
            NotifyTaskProgressChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'progress', newValue); },
            NotifyTaskColorChanged: (taskId, newValue, errorCallback) => { gantt._onRecordUpdated(GANTT_TASKS, taskId, 'color', newValue); },
            NotifyParentTaskUpdated: (task, errorCallback) => { gantt._onParentTaskUpdated(task); },
            NotifyDependencyInserted: (dependency, callback, errorCallback) => { gantt._onRecordInserted(GANTT_DEPENDENCIES, dependency, callback); },
            NotifyDependencyRemoved: (dependencyId, errorCallback, dependency) => { gantt._onRecordRemoved(GANTT_DEPENDENCIES, dependencyId, dependency); },

            NotifyResourceCreated: (resource, callback, errorCallback) => { gantt._onRecordInserted(GANTT_RESOURCES, resource, callback); },
            NotifyResourceRemoved: (resourceId, errorCallback, resource) => { gantt._onRecordRemoved(GANTT_RESOURCES, resourceId, resource); },

            NotifyResourceAssigned: (assignment, callback, errorCallback) => { gantt._onRecordInserted(GANTT_RESOURCE_ASSIGNMENTS, assignment, callback); },
            NotifyResourceUnassigned: (assignmentId, errorCallback, assignment) => { gantt._onRecordRemoved(GANTT_RESOURCE_ASSIGNMENTS, assignmentId, assignment); },
            NotifyParentDataRecalculated: (data) => { gantt._onParentTasksRecalculated(data); },

            NotifyTaskCreating: (args) => { gantt._actionsManager.raiseInsertingAction(GANTT_TASKS, args); },
            NotifyTaskRemoving: (args) => { gantt._actionsManager.raiseDeletingAction(GANTT_TASKS, args); },
            NotifyTaskUpdating: (args) => { gantt._actionsManager.raiseUpdatingAction(GANTT_TASKS, args); },
            NotifyTaskMoving: (args) => { gantt._actionsManager.raiseUpdatingAction(GANTT_TASKS, args, gantt._actionsManager.getTaskMovingAction()); },
            NotifyTaskEditDialogShowing: (args) => { gantt._actionsManager.raiseTaskEditDialogShowingAction(args); },
            NotifyResourceManagerDialogShowing: (args) => { gantt._actionsManager.raiseResourceManagerDialogShowingAction(args); },
            NotifyDependencyInserting: (args) => { gantt._actionsManager.raiseInsertingAction(GANTT_DEPENDENCIES, args); },
            NotifyDependencyRemoving: (args) => { gantt._actionsManager.raiseDeletingAction(GANTT_DEPENDENCIES, args); },
            NotifyResourceCreating: (args) => { gantt._actionsManager.raiseInsertingAction(GANTT_RESOURCES, args); },
            NotifyResourceRemoving: (args) => { gantt._actionsManager.raiseDeletingAction(GANTT_RESOURCES, args); },
            NotifyResourceAssigning: (args) => { gantt._actionsManager.raiseInsertingAction(GANTT_RESOURCE_ASSIGNMENTS, args); },
            // eslint-disable-next-line spellcheck/spell-checker
            NotifyResourceUnassigning: (args) => { gantt._actionsManager.raiseDeletingAction(GANTT_RESOURCE_ASSIGNMENTS, args); }
        };
    }

};
