export const Consts = {
    TREELIST_SELECTOR: '.dx-treelist',
    TREELIST_DATA_ROW_SELECTOR: '.dx-data-row',
    TREELIST_WRAPPER_SELECTOR: '.dx-gantt-treelist-wrapper',
    TREELIST_HEADER_ROW_SELECTOR: '.dx-header-row',
    GANTT_VIEW_SELECTOR: '.dx-gantt-view',
    GANTT_VIEW_ROW_SELECTOR: '.dx-gantt-altRow',
    TASK_WRAPPER_SELECTOR: '.dx-gantt-taskWrapper',
    TASK_SELECTED_SELECTOR: '.dx-gantt-selectedTask',
    TASK_RESOURCES_SELECTOR: '.dx-gantt-taskRes',
    TASK_ARROW_SELECTOR: '.dx-gantt-arrow',
    TASK_TITLE_IN_SELECTOR: '.dx-gantt-titleIn',
    TASK_TITLE_OUT_SELECTOR: '.dx-gantt-titleOut',
    TREELIST_EXPANDED_SELECTOR: '.dx-treelist-expanded',
    TREELIST_COLLAPSED_SELECTOR: '.dx-treelist-collapsed',
    SELECTION_SELECTOR: '.dx-gantt-sel',
    SPLITTER_WRAPPER_SELECTOR: '.dx-splitter-wrapper',
    SPLITTER_SELECTOR: '.dx-splitter',
    POPUP_SELECTOR: '.dx-popup-normal',
    GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR: '.dx-gantt-hb',
    TIME_MARKER_SELECTOR: '.dx-gantt-tm',
    TIME_INTERVAL_SELECTOR: '.dx-gantt-ti',
    OVERLAY_WRAPPER_SELECTOR: '.dx-overlay-wrapper',
    CONTEXT_MENU_SELECTOR: '.dx-context-menu',
    CONTEXT_MENU_ITEM_SELECTOR: '.dx-menu-item-text',
    INPUT_TEXT_EDITOR_SELECTOR: '.dx-texteditor-input',
    TOOLBAR_ITEM_SELECTOR: '.dx-toolbar-item',
    PARENT_TASK_SELECTOR: '.dx-gantt-parent',
    TOOLBAR_SEPARATOR_SELECTOR: '.dx-gantt-toolbar-separator',
    TOOLTIP_SELECTOR: '.dx-gantt-task-edit-tooltip',
    TASK_SELECTOR: '.dx-gantt-task',
    TASK_EDIT_WRAPPER: '.dx-gantt-task-edit-wrapper',

};

export const data = {
    tasks: [
        { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
        { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
        { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
        { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
        { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
        { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
        { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
    ],
    dependencies: [
        { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 },
        { 'id': 1, 'predecessorId': 2, 'successorId': 3, 'type': 0 },
        { 'id': 2, 'predecessorId': 3, 'successorId': 4, 'type': 0 },
        { 'id': 3, 'predecessorId': 4, 'successorId': 5, 'type': 0 },
        { 'id': 4, 'predecessorId': 5, 'successorId': 6, 'type': 0 },
        { 'id': 5, 'predecessorId': 6, 'successorId': 7, 'type': 0 }
    ],
    resources: [
        { 'id': 1, 'text': 'Management' },
        { 'id': 2, 'text': 'Project Manager' },
        { 'id': 3, 'text': 'Deployment Team' }
    ],
    resourceAssignments: [
        { 'id': 0, 'taskId': 3, 'resourceId': 1 },
        { 'id': 1, 'taskId': 4, 'resourceId': 1 },
        { 'id': 2, 'taskId': 5, 'resourceId': 2 },
        { 'id': 3, 'taskId': 6, 'resourceId': 2 },
        { 'id': 4, 'taskId': 6, 'resourceId': 3 },
    ]
};
export const options = {
    tasksOnlyOptions: {
        tasks: { dataSource: data.tasks }
    },
    allSourcesOptions: {
        tasks: { dataSource: data.tasks },
        dependencies: { dataSource: data.dependencies },
        resources: { dataSource: data.resources },
        resourceAssignments: { dataSource: data.resourceAssignments }
    }
};

export const getGanttViewCore = (gantt) => {
    return gantt._ganttView._ganttViewCore;
};
export const showTaskEditDialog = (gantt) => {
    const ganttCore = getGanttViewCore(gantt);
    const task = ganttCore.viewModel.tasks.items[0];
    ganttCore.commandManager.showTaskEditDialog.execute(task);
};
export const getTask = (mainElement, index) => {
    return mainElement.find(`[task-index="${index}"]`);
};

