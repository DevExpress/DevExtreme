import $ from 'jquery';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';
const { test } = QUnit;
import 'common.css!';
import 'generic_light.css!';
import 'ui/gantt';
import { extend } from 'core/utils/extend';
import messageLocalization from 'localization/message';

QUnit.testStart(() => {
    const markup = '<div id="gantt"></div>';
    $('#qunit-fixture').html(markup);
});

const TREELIST_SELECTOR = '.dx-treelist';
const TREELIST_DATA_ROW_SELECTOR = '.dx-data-row';
const TREELIST_WRAPPER_SELECTOR = '.dx-gantt-treelist-wrapper';
const TREELIST_HEADER_ROW_SELECTOR = '.dx-header-row';
const GANTT_VIEW_SELECTOR = '.dx-gantt-view';
const GANTT_VIEW_ROW_SELECTOR = '.dx-gantt-altRow';
const TASK_WRAPPER_SELECTOR = '.dx-gantt-taskWrapper';
const TASK_RESOURCES_SELECTOR = '.dx-gantt-taskRes';
const TASK_ARROW_SELECTOR = '.dx-gantt-arrow';
const TASK_TITLE_IN_SELECTOR = '.dx-gantt-titleIn';
const TASK_TITLE_OUT_SELECTOR = '.dx-gantt-titleOut';
const TREELIST_EXPANDED_SELECTOR = '.dx-treelist-expanded';
const TREELIST_COLLAPSED_SELECTOR = '.dx-treelist-collapsed';
const SELECTION_SELECTOR = '.dx-gantt-sel';
const SPLITTER_WRAPPER_SELECTOR = '.dx-splitter-wrapper';
const SPLITTER_SELECTOR = '.dx-splitter';
const POPUP_SELECTOR = '.dx-popup-normal';
const GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR = '.dx-gantt-hb';
const TIME_MARKER_SELECTOR = '.dx-gantt-tm';
const TIME_INTERVAL_SELECTOR = '.dx-gantt-ti';
const OVERLAY_WRAPPER_SELECTOR = '.dx-overlay-wrapper';
const CONTEXT_MENU_SELECTOR = '.dx-context-menu';
const CONTEXT_MENU_ITEM_SELECTOR = '.dx-menu-item-text';
const INPUT_TEXT_EDITOR_SELECTOR = '.dx-texteditor-input';
const TOOLBAR_ITEM_SELECTOR = '.dx-toolbar-item';
const PARENT_TASK_SELECTOR = '.dx-gantt-parent';
const TOOLBAR_SEPARATOR_SELECTOR = '.dx-gantt-toolbar-separator';
const TOOLTIP_SELECTOR = '.dx-gantt-task-edit-tooltip';

const tasks = [
    { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
    { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
    { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
    { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
    { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
    { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
    { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
];
const dependencies = [
    { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 },
    { 'id': 1, 'predecessorId': 2, 'successorId': 3, 'type': 0 },
    { 'id': 2, 'predecessorId': 3, 'successorId': 4, 'type': 0 },
    { 'id': 3, 'predecessorId': 4, 'successorId': 5, 'type': 0 },
    { 'id': 4, 'predecessorId': 5, 'successorId': 6, 'type': 0 },
    { 'id': 5, 'predecessorId': 6, 'successorId': 7, 'type': 0 }
];
const resources = [
    { 'id': 1, 'text': 'Management' },
    { 'id': 2, 'text': 'Project Manager' },
    { 'id': 3, 'text': 'Deployment Team' }
];
const resourceAssignments = [
    { 'id': 0, 'taskId': 3, 'resourceId': 1 },
    { 'id': 1, 'taskId': 4, 'resourceId': 1 },
    { 'id': 2, 'taskId': 5, 'resourceId': 2 },
    { 'id': 3, 'taskId': 6, 'resourceId': 2 },
    { 'id': 4, 'taskId': 6, 'resourceId': 3 },
];
const tasksOnlyOptions = {
    tasks: { dataSource: tasks }
};
const allSourcesOptions = {
    tasks: { dataSource: tasks },
    dependencies: { dataSource: dependencies },
    resources: { dataSource: resources },
    resourceAssignments: { dataSource: resourceAssignments }
};
const getGanttViewCore = (gantt) => {
    return gantt._ganttView._ganttViewCore;
};
const showTaskEditDialog = (gantt) => {
    const ganttCore = getGanttViewCore(gantt);
    const task = ganttCore.viewModel.tasks.items[0];
    ganttCore.commandManager.showTaskEditDialog.execute(task);
};

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (options) => {
            this.instance = this.$element.dxGantt(options).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Markup', moduleConfig, () => {
    test('should render treeList', function(assert) {
        this.createInstance(tasksOnlyOptions);
        const treeListElements = this.$element.find(TREELIST_SELECTOR);
        assert.strictEqual(treeListElements.length, 1);
    });
    test('should render task wrapper for each task', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const elements = this.$element.find(TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, tasks.length - 1);
    });
    test('should render dependencies', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const element = this.$element.find(TASK_ARROW_SELECTOR);
        assert.equal(element.length, dependencies.length);
    });
    test('should render resources', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const element = this.$element.find(TASK_RESOURCES_SELECTOR);
        assert.equal(element.length, resourceAssignments.length);
    });
    test('row heights', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const treeListRowElement = this.$element.find(TREELIST_DATA_ROW_SELECTOR).last().get(0);
        const ganttViewRowElement = this.$element.find(GANTT_VIEW_ROW_SELECTOR).get(0);
        assert.roughEqual(treeListRowElement.getBoundingClientRect().height, ganttViewRowElement.getBoundingClientRect().height, 0.001, 'row heights are equal');
    });
    test('auto height', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const initHeight = this.$element.height();
        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.ok(initHeight > this.$element.height(), 'collapsed height');
    });
    test('fixed height', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('height', 800);
        this.clock.tick();
        const initHeight = this.$element.height();
        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.roughEqual(initHeight, this.$element.height(), 1, 'collapsed height');
    });
});

QUnit.module('Options', moduleConfig, () => {
    test('taskListWidth', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const treeListWrapperElement = this.$element.find(TREELIST_WRAPPER_SELECTOR);
        assert.roughEqual(treeListWrapperElement.width(), 300, 0.01, '300px');
        this.instance.option('taskListWidth', 500);
        assert.equal(treeListWrapperElement.width(), 500, '500px');
    });
    test('showResources', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, resourceAssignments.length);
        this.instance.option('showResources', false);
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, 0);
        this.instance.option('showResources', true);
        assert.equal(this.$element.find(TASK_RESOURCES_SELECTOR).length, resourceAssignments.length);
    });
    test('taskTitlePosition', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        const milestoneCount = tasks.reduce((count, t) => {
            return t.start.getTime() === t.end.getTime() ? count + 1 : count;
        }, 0);
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, tasks.length - milestoneCount);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option('taskTitlePosition', 'none');
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option('taskTitlePosition', 'outside');
        assert.equal(this.$element.find(TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(TASK_TITLE_OUT_SELECTOR).length, tasks.length);
    });
    test('expr', function(assert) {
        const tasksDS = [
            { 'i': 1, 'pid': 0, 't': 'Software Development', 's': new Date('2019-02-21T05:00:00.000Z'), 'e': new Date('2019-07-04T12:00:00.000Z'), 'p': 31, 'c': 'rgb(255, 0, 0)' },
            { 'i': 2, 'pid': 1, 't': 'Scope', 's': new Date('2019-02-21T05:00:00.000Z'), 'e': new Date('2019-02-26T09:00:00.000Z'), 'p': 60 },
            { 'i': 3, 'pid': 2, 't': 'Determine project scope', 's': new Date('2019-02-21T05:00:00.000Z'), 'e': new Date('2019-02-21T09:00:00.000Z'), 'p': 100 }
        ];
        const dependenciesDS = [{ 'i': 0, 'pid': 1, 'sid': 2, 't': 0 }];
        const resourcesDS = [{ 'i': 1, 't': 'Management', 'c': 'rgb(0, 255, 0)' }];
        const resourceAssignmentsDS = [{ 'i': 0, 'tid': 3, 'rid': 1 }];
        const options = {
            tasks: {
                dataSource: tasksDS,
                keyExpr: 'i',
                parentIdExpr: 'pid',
                startExpr: 's',
                endExpr: 'e',
                progressExpr: 'p',
                titleExpr: 't',
                colorExpr: 'c'
            },
            dependencies: {
                dataSource: dependenciesDS,
                keyExpr: 'i',
                predecessorIdExpr: 'pid',
                successorIdExpr: 'sid',
                typeExpr: 't',
            },
            resources: {
                dataSource: resourcesDS,
                keyExpr: 'i',
                textExpr: 't',
                colorExpr: 'c'
            },
            resourceAssignments: {
                dataSource: resourceAssignmentsDS,
                keyExpr: 'i',
                taskIdExpr: 'tid',
                resourceIdExpr: 'rid'
            },
            columns: ['t']
        };
        this.createInstance(options);
        this.clock.tick();
        const taskWrapperElements = this.$element.find(TASK_WRAPPER_SELECTOR);
        assert.equal(taskWrapperElements.length, tasksDS.length);
        const firstTitle = taskWrapperElements.first().children().children().first().text();
        assert.equal(firstTitle, tasksDS[0].t);
        const firstElementBackgroundColor = taskWrapperElements.first().children().css('background-color');
        assert.equal(firstElementBackgroundColor, tasksDS[0].c);
        const firstProgressElement = taskWrapperElements.first().children().children().last();
        assert.ok(firstProgressElement.width() > 0);
        const $firstTreeListRowText = this.$element.find(TREELIST_DATA_ROW_SELECTOR).first().find('.dx-treelist-text-content').first().text();
        assert.equal($firstTreeListRowText, tasksDS[0].t, 'treeList has title text');

        const dependencyElements = this.$element.find(TASK_ARROW_SELECTOR);
        assert.equal(dependencyElements.length, dependenciesDS.length);

        const resourceElements = this.$element.find(TASK_RESOURCES_SELECTOR);
        assert.equal(resourceElements.length, resourceAssignmentsDS.length);
        assert.equal(resourceElements.first().text(), resourcesDS[0].t);
        assert.equal(resourceElements.first().css('background-color'), resourcesDS[0].c);
    });
    test('columns', function(assert) {
        const options = {
            tasks: { dataSource: tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start Date' }
            ]
        };
        this.createInstance(options);
        this.clock.tick();
        let $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 2, 'treeList has 2 columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Subject', 'first column title is checked');
        assert.equal($treeListHeaderRow.children().eq(1).text(), 'Start Date', 'second column title is checked');

        this.instance.option('columns[0].visible', false);
        $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, 'treeList has 1 visible columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Start Date', 'first visible column title is checked');

        this.instance.option('columns', [{ dataField: 'title', caption: 'Task' }]);
        $treeListHeaderRow = this.$element.find(TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, 'treeList has 1 columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Task', 'first column title is checked');
    });
    test('selectedRowKey', function(assert) {
        const selectedRowKey = 2;
        const options = {
            tasks: { dataSource: tasks },
            selectedRowKey: selectedRowKey
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListSelectedRowKeys = this.instance._treeList.option('selectedRowKeys');
        assert.equal(treeListSelectedRowKeys.length, 1, 'only one treeList row is selected');
        assert.equal(treeListSelectedRowKeys, selectedRowKey, 'second treeList row is selected');
        this.instance.option('selectedRowKey', undefined);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
        this.instance.option('selectedRowKey', 1);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 1);
        this.instance.option('selectedRowKey', undefined);
        this.clock.tick();
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
    });
    test('allowSelection', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        this.instance.option('selectedRowKey', 1);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 1);
        this.instance.option('allowSelection', false);
        assert.equal(this.$element.find(SELECTION_SELECTOR).length, 0);
    });
    test('showRowLines', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.ok(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, 'ganttView has borders by default');
        assert.equal(this.instance._treeList.option('showRowLines'), true, 'treeList has borders by default');
        this.instance.option('showRowLines', false);
        assert.equal(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length, 0, 'ganttView has no borders');
        assert.equal(this.instance._treeList.option('showRowLines'), false, 'treeList has no borders');
        this.instance.option('showRowLines', true);
        assert.ok(this.$element.find(GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, 'ganttView has borders');
        assert.equal(this.instance._treeList.option('showRowLines'), true, 'treeList has borders');
    });
    test('editing', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        let coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, false, 'editing is prohibited by default');
        assert.equal(coreEditingSettings.allowTaskInsert, true, 'task adding allowed by default');
        assert.equal(coreEditingSettings.allowTaskDelete, true, 'task deleting allowed by default');
        assert.equal(coreEditingSettings.allowTaskUpdate, true, 'task updating allowed by default');
        assert.equal(coreEditingSettings.allowDependencyInsert, true, 'dependency adding allowed by default');
        assert.equal(coreEditingSettings.allowDependencyDelete, true, 'dependency deleting allowed by default');
        assert.equal(coreEditingSettings.allowResourceInsert, true, 'resource adding allowed by default');
        assert.equal(coreEditingSettings.allowResourceDelete, true, 'resource deleting allowed by default');
        assert.equal(coreEditingSettings.allowResourceUpdate, true, 'resource updating allowed by default');
        this.instance.option('editing', {
            enabled: true,
            allowTaskAdding: false,
            allowTaskDeleting: false,
            allowTaskUpdating: false,
            allowDependencyAdding: false,
            allowDependencyDeleting: false,
            allowResourceAdding: false,
            allowResourceDeleting: false,
            allowResourceUpdating: false,
            allowTaskResourceUpdating: false
        });
        coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, true, 'editing allowed');
        assert.equal(coreEditingSettings.allowTaskInsert, false, 'task adding is prohibited');
        assert.equal(coreEditingSettings.allowTaskDelete, false, 'task deleting is prohibited');
        assert.equal(coreEditingSettings.allowTaskUpdate, false, 'task updating is prohibited');
        assert.equal(coreEditingSettings.allowDependencyInsert, false, 'dependency adding is prohibited');
        assert.equal(coreEditingSettings.allowDependencyDelete, false, 'dependency deleting is prohibited');
        assert.equal(coreEditingSettings.allowResourceInsert, false, 'resource adding is prohibited');
        assert.equal(coreEditingSettings.allowResourceDelete, false, 'resource deleting is prohibited');
        assert.equal(coreEditingSettings.allowResourceUpdate, false, 'resource updating is prohibited');
        assert.equal(coreEditingSettings.allowTaskResourceUpdate, false, 'task resource updating is prohibited');
        this.instance.option('editing.enabled', false);
        coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, false, 'editing is prohibited');
    });
    test('scaleType', function(assert) {
        const isHeaderContainsText = text => {
            return this.$element.find('.dx-gantt-tsa').eq(1).find('.dx-gantt-si').text().indexOf(text) > -1;
        };
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        assert.ok(isHeaderContainsText('January'), 'is months scale type (auto)');
        this.instance.option('scaleType', 'minutes');
        assert.ok(isHeaderContainsText('30'), 'is minutes scale type');
        this.instance.option('scaleType', 'hours');
        assert.ok(isHeaderContainsText('9:00 PM'), 'is hours scale type');
        this.instance.option('scaleType', 'days');
        assert.ok(isHeaderContainsText('Sat, 23 Feb'), 'is days scale type');
        this.instance.option('scaleType', 'weeks');
        assert.ok(isHeaderContainsText('Sun, 20 Jan - Sat, 26 Jan'), 'is weeks scale type');
        this.instance.option('scaleType', 'months');
        assert.ok(isHeaderContainsText('January'), 'is months scale type');
        this.instance.option('scaleType', 'quarters');
        assert.ok(isHeaderContainsText('Q1'), 'is quarters scale type');
        this.instance.option('scaleType', 'years');
        assert.ok(isHeaderContainsText('2008'), 'is years scale type');

        this.instance.option('tasks.dataSource', [{ 'id': 0, 'title': 't', 'start': '2019-02-21', 'end': '2019-02-26' }]);
        assert.ok(isHeaderContainsText('2008'), 'is still years scale type');
        this.instance.option('scaleType', 'auto');
        assert.ok(isHeaderContainsText('Sun, 10 Feb'), 'is days scale type (auto)');
    });
    test('calculateCellValue for key', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.instance.option('columns', [{ dataField: 'id' }]);
        this.clock.tick();

        const columns = this.instance._treeList.getVisibleColumns();

        assert.strictEqual(columns.length, 1);
        assert.strictEqual(columns[0].calculateCellValue({ id: '54' }), '54', 'number');
        assert.strictEqual(columns[0].calculateCellValue({ id: '54a' }), '54a', 'pseudo guid');
    });
});

QUnit.module('Events', moduleConfig, () => {
    test('onCustomCommand', function(assert) {
        let executedCommandName;
        const options = {
            contextMenu: {
                items: [{ name: 'custom', text: 'customItem' }]
            },
            onCustomCommand: (e) => {
                executedCommandName = e.name;
            }
        };
        this.createInstance(extend(tasksOnlyOptions, options));
        this.clock.tick();

        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const popupItem = $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR).find(CONTEXT_MENU_ITEM_SELECTOR).eq(0);
        popupItem.trigger('dxclick');

        this.clock.tick();
        assert.equal(executedCommandName, options.contextMenu.items[0].name, 'onCustomCommand was raised');
    });
    test('selection changed', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onSelectionChanged', (e) => {
            keyFromEvent = e.selectedRowKey;
        });
        this.instance.option('selectedRowKey', key);
        this.clock.tick();
        assert.equal(keyFromEvent, key);
    });
    test('onContentReady', function(assert) {
        const onContentReadyHandler = sinon.stub();
        const options = {
            tasks: {
                dataSource: tasks
            },
            onContentReady: onContentReadyHandler
        };
        this.createInstance(options);
        this.clock.tick();

        assert.equal(onContentReadyHandler.callCount, 1, 'onContentReadyHandler was called 1 times');
    });
    test('task click', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskClick', (e) => {
            keyFromEvent = e.key;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(keyFromEvent, key);
    });

    test('task double click', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const key = 2;
        let keyFromEvent;
        this.instance.option('onTaskDblClick', (e) => {
            keyFromEvent = e.key;
            e.cancel = true;
        });
        const $cellElement = $(this.instance._treeList.getCellElement(key - 1, 0));
        $cellElement.trigger('dxdblclick');
        this.clock.tick();
        assert.equal(keyFromEvent, key);
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });
});

QUnit.module('Actions', moduleConfig, () => {
    test('expand', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length - 1);
        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, 1);
    });
    test('collapse', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length - 1);
        const collapsedElement = this.$element.find(TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length - 1);
    });
    test('collapse and expand after inserting', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, 0, '2');
        this.clock.tick();

        assert.equal(tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length - 1);
    });

    test('collapse and expand after inserting in auto update mode', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('validation.autoUpdateParentTasks', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, 0, '2');
        this.clock.tick();

        assert.equal(tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(TASK_WRAPPER_SELECTOR).length, tasks.length - 1);
    });

    test('move splitter', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const splitterWrapper = this.$element.find(SPLITTER_WRAPPER_SELECTOR);
        const splitter = this.$element.find(SPLITTER_SELECTOR);

        const treeListWrapperElement = this.$element.find(TREELIST_WRAPPER_SELECTOR);
        const treeListWrapperLeftOffset = treeListWrapperElement.offset().left;
        const treeListWrapperTopOffset = treeListWrapperElement.offset().top;

        const ganttView = this.$element.find(GANTT_VIEW_SELECTOR);

        const splitterContainerWrapperWidth = $(treeListWrapperElement).parent().width();

        assert.ok(splitterWrapper, 'Splitter wrapper has been found');
        assert.ok(splitter, 'Splitter has been found');

        splitter.trigger($.Event('dxpointerdown', { pointerType: 'mouse' }));
        splitter.trigger($.Event('dxpointermove', {
            pointerType: 'mouse',
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 100,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup', { pointerType: 'mouse' }));

        assert.equal(treeListWrapperElement.width(), 100);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth - 100);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 100, 'Splitter has been moved by mouse');

        splitter.trigger($.Event('dxpointerdown', { pointerType: 'touch' }));
        splitter.trigger($.Event('dxpointermove', {
            pointerType: 'touch',
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 300,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup', { pointerType: 'touch' }));

        assert.equal(treeListWrapperElement.width(), 300);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth - 300);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 300, 'Splitter has been moved by touch');

        splitter.trigger($.Event('dxpointerdown'));
        splitter.trigger($.Event('dxpointermove', {
            pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) - 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup'));

        assert.equal(treeListWrapperElement.width(), 0);
        assert.equal(ganttView.width(), splitterContainerWrapperWidth);
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 0, 'Splitter has not cross the left side');

        splitter.trigger($.Event('dxpointerdown'));
        splitter.trigger($.Event('dxpointermove', {
            pageX: splitterContainerWrapperWidth - parseFloat(splitter.css('margin-left')) + 10,
            pageY: treeListWrapperTopOffset + 100 }));
        splitter.trigger($.Event('dxpointerup'));

        assert.equal(treeListWrapperElement.width(), splitterContainerWrapperWidth - splitter.width());
        assert.equal(ganttView.width(), splitter.width());
        assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), splitterContainerWrapperWidth - splitter.width(), 'Splitter has not cross the right side');
    });
});

QUnit.module('Dialogs', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        assert.equal($('body').find(POPUP_SELECTOR).length, 1, 'dialog is shown');
        this.instance.repaint();
        assert.equal($('body').find(POPUP_SELECTOR).length, 0, 'dialog is missed after widget repainting');
        this.clock.tick();

        showTaskEditDialog(this.instance);
        assert.equal($('body').find(POPUP_SELECTOR).length, 1, 'dialog is shown');
        this.instance.dispose();
        assert.equal($('body').find(POPUP_SELECTOR).length, 0, 'dialog is missed after widget disposing');
    });
    test('task editing', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        let $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const $inputs = $dialog.find(INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), tasks[0].title, 'title text is shown');
        assert.equal((new Date($inputs.eq(1).val())).getTime(), tasks[0].start.getTime(), 'start task text is shown');
        assert.equal((new Date($inputs.eq(2).val())).getTime(), tasks[0].end.getTime(), 'end task text is shown');
        assert.equal($inputs.eq(3).val(), tasks[0].progress + '%', 'progress text is shown');

        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();
        const firstTreeListTitleText = this.$element.find(TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');

        this.instance.option('editing.enabled', false);
        showTaskEditDialog(this.instance);
        assert.equal($dialog.find('.dx-popup-bottom').find('.dx-button').length, 1, 'only cancel button in toolbar');
        $dialog = $('body').find(POPUP_SELECTOR);
        const inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.attr('readOnly'), 'readonly', 'all inputs is readOnly');
    });
    test('resources editing', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();
        getGanttViewCore(this.instance).commandManager.showResourcesDialog.execute();
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        let $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, resources.length, 'dialog has all resources');

        const $deleteButtons = $dialog.find('.dx-list-static-delete-button');
        $deleteButtons.eq(0).trigger('dxclick');
        $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, resources.length - 1, 'first resource removed from list');

        const secondResourceText = resources[1].text;
        const thirdResourceText = resources[2].text;
        const newResourceText = 'newResource';
        const textBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        textBox.option('text', newResourceText);
        const $addButton = $dialog.find('.dx-button-has-text').eq(0);
        $addButton.dxButton('instance').option('disabled', false);
        $addButton.trigger('dxclick');
        $resources = $dialog.find('.dx-list-item');
        assert.equal($resources.length, resources.length, 'added resource to list');

        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();

        const $confirmDialog = $('body').find(POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick();

        assert.equal(resources[0].text, secondResourceText, 'first resource removed from ds');
        assert.equal(resources[1].text, thirdResourceText, 'second resource ds');
        assert.equal(resources[2].text, newResourceText, 'new resource ds');
    });
    test('task progress not reset check (T890805)', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const $inputs = $dialog.find(INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), tasks[0].title, 'title text is shown');
        assert.equal($inputs.eq(3).val(), tasks[0].progress + '%', 'progress text is shown');

        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();
        assert.equal(tasks[0].progress, 31, 'progress reset');
    });
    test('showing taskEditDialog after resources dialog is closed', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const expectedTaskEditTitleText = messageLocalization.format('dxGantt-dialogTaskDetailsTitle');
        let popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedTaskEditTitleText, popupTitleText, 'taskEditPopup title');

        const $showResourcesButton = $dialog.find('.dx-texteditor-buttons-container').find('.dx-button').eq(0);
        $showResourcesButton.trigger('dxclick');
        this.clock.tick();

        const expectedResourceTitleText = messageLocalization.format('dxGantt-dialogResourceManagerTitle');
        popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedResourceTitleText, popupTitleText, 'resourcePopup title');

        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();

        popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedTaskEditTitleText, popupTitleText, 'taskEditPopup title shown again');
    });
    test('assign resource dxTagBox is disabled when allowTaskResourceUpdating is false', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('editing.allowTaskResourceUpdating', false);

        this.instance.option('selectedRowKey', 1);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(POPUP_SELECTOR);
        const tagBox = $dialog.find('.dx-tag-container > .dx-texteditor-input');
        assert.ok(tagBox.attr('aria-readOnly'), 'resource tagBox is readOnly');
    });
    test('show edit resource dialog button is disabled when allowResourceAdding and allowResourceDeleting are false ', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('editing.allowResourceAdding', false);
        this.instance.option('editing.allowResourceDeleting', false);

        this.instance.option('selectedRowKey', 1);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        const $dialog = $('body').find(POPUP_SELECTOR);
        const button = $dialog.find('.dx-texteditor-buttons-container > .dx-button');
        assert.ok(button.attr('aria-disabled'), 'button is disabled');
    });
});

QUnit.module('Toolbar', moduleConfig, () => {
    test('common', function(assert) {
        const items = [
            'undo',
            'redo',
            'separator',
            'zoomIn',
            'zoomOut',
            'separator',
            {
                widget: 'dxButton',
                options: {
                    text: 'Custom item',
                    stylingMode: 'text'
                }
            }
        ];
        const options = {
            tasks: { dataSource: tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        const $items = this.$element.find(TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');
        assert.equal($items.find(TOOLBAR_SEPARATOR_SELECTOR).length, 2, 'Both separators were rendered');
        assert.equal($items.last().text(), 'Custom item', 'Custom item has custom text');
        assert.equal($items.first().children().children().attr('aria-label'), 'dx-gantt-i dx-gantt-i-undo', 'First button is undo button');
    });
    test('changing', function(assert) {
        const items = [
            'undo',
            'redo'
        ];
        const options = {
            tasks: { dataSource: tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        let $items = this.$element.find(TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');

        this.instance.option('toolbar.items', []);
        $items = this.$element.find(TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, 0, 'Toolbar is empty');

        this.instance.option('toolbar.items', ['zoomIn', 'zoomOut']);
        $items = this.$element.find(TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, 2, 'All items were rendered again');
    });
    test('different item types', function(assert) {
        const items = [
            'undo',
            'redo',
            'separator',
            {
                name: 'zoomIn',
                options: {
                    text: 'test'
                }
            },
            'separator',
            {
                widget: 'dxButton',
                options: {
                    text: 'Custom item',
                    stylingMode: 'text'
                }
            }
        ];
        const options = {
            tasks: { dataSource: tasks },
            toolbar: { items: items }
        };
        this.createInstance(options);
        this.clock.tick();

        const $items = this.$element.find(TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, items.length, 'All items were rendered');
        assert.equal($items.find(TOOLBAR_SEPARATOR_SELECTOR).length, 2, 'Both separators were rendered');
        assert.equal($items.last().text(), 'Custom item', 'Custom item has custom text');
        assert.equal($items.eq(3).text(), 'test', 'Custom zoomIn button was rendered with custom text');
    });
});

QUnit.module('DataSources', moduleConfig, () => {
    test('inserting', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, 0, '1');
        this.clock.tick();
        assert.equal(tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');
    });
    test('updating', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        const updatedEnd = new Date('2019-02-22');
        const updatedTitle = 'New';
        getGanttViewCore(this.instance).commandManager.changeTaskTitleCommand.execute(updatedTaskId.toString(), updatedTitle);
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        getGanttViewCore(this.instance).commandManager.changeTaskEndCommand.execute(updatedTaskId.toString(), updatedEnd);
        this.clock.tick();
        const updatedTask = tasks.filter((t) => t.id === updatedTaskId)[0];
        assert.equal(updatedTask.title, updatedTitle, 'task title is updated');
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
        assert.equal(updatedTask.end, updatedEnd, 'new task end is updated');
    });
    test('removing', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 3);
        this.clock.tick();

        const removedTaskId = 3;
        const tasksCount = tasks.length;
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(removedTaskId.toString(), false);
        this.clock.tick();
        assert.equal(tasks.length, tasksCount - 1, 'tasks less');
        const removedTask = tasks.filter((t) => t.id === removedTaskId)[0];
        assert.equal(removedTask, undefined, 'task was removed');
    });
    test('delayed loading', function(assert) {
        this.createInstance({
            tasks: { dataSource: [] },
            validation: { autoUpdateParentTasks: true }
        });
        this.clock.tick();

        this.instance.option('tasks.dataSource', tasks);
        this.clock.tick();
        assert.equal(this.instance._treeList.option('expandedRowKeys').length, 2, 'each task is loaded and expanded');
    });
});

QUnit.module('Client side edit events', moduleConfig, () => {
    test('task inserting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        this.instance.option('onTaskInserting', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, 0, '1');
        this.clock.tick();
        assert.equal(tasks.length, tasksCount, 'new task was not created in ds');
    });
    test('task inserting - update args', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const newStart = new Date('2019-02-23');
        const newEnd = new Date('2019-02-24');
        this.instance.option('onTaskInserting', (e) => {
            e.values['title'] = 'My text';
            e.values['start'] = newStart;
            e.values['end'] = newEnd;
        });

        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute('2019-02-21', '2019-02-22', 'New', 0, '1');
        this.clock.tick();
        assert.equal(tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, 'My text', 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');
    });
    test('task deleting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        let values;
        let key;
        this.instance.option('onTaskDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        const taskToDelete = tasks[tasks.length - 1];
        this.instance.option('selectedRowKey', taskToDelete.id.toString());
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(taskToDelete.id.toString(), false);
        this.clock.tick();
        assert.equal(tasks.length, tasksCount, 'new task was not deleted');
        assert.equal(values['parentId'], taskToDelete.parentId, 'check values parentId');
        assert.equal(values['title'], taskToDelete.title, 'check values title');
        assert.equal(values['start'], taskToDelete.start, 'check values start');
        assert.equal(values['end'], taskToDelete.end, 'check values end');
        assert.equal(key, taskToDelete.id, 'check key');
    });
    test('task updating - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const taskToUpdate = tasks[0];
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        this.instance.option('onTaskUpdating', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.changeTaskTitleCommand.execute(taskToUpdate.id.toString(), newTitle);
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(taskToUpdate.id.toString(), newStart);
        getGanttViewCore(this.instance).commandManager.changeTaskEndCommand.execute(taskToUpdate.id.toString(), newEnd);

        this.clock.tick();
        assert.notEqual(taskToUpdate.title, newTitle, 'task title is not updated');
        assert.notEqual(taskToUpdate.start, newStart, 'new task start is not updated');
        assert.notEqual(taskToUpdate.end, newEnd, 'new task end is not updated');
    });
    test('task updating - change args', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const taskToUpdate = tasks[0];
        const newStart = new Date('2019-02-25');
        const newEnd = new Date('2019-02-26');
        const newTitle = 'New';
        let keyIsDefined = false;
        this.instance.option('onTaskUpdating', (e) => {
            if(e.newValues['title']) {
                e.newValues['title'] = newTitle;
            }
            if(e.newValues['start']) {
                e.newValues['start'] = newStart;
            }
            if(e.newValues['end']) {
                e.newValues['end'] = newEnd;
            }
            keyIsDefined = taskToUpdate.id === e.key;
        });

        getGanttViewCore(this.instance).commandManager.changeTaskTitleCommand.execute(taskToUpdate.id.toString(), '1');
        assert.ok(keyIsDefined, 'key defined');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(taskToUpdate.id.toString(), '2');
        assert.ok(keyIsDefined, 'key defined');
        getGanttViewCore(this.instance).commandManager.changeTaskEndCommand.execute(taskToUpdate.id.toString(), '3');
        assert.ok(keyIsDefined, 'key defined');

        this.clock.tick();
        assert.equal(taskToUpdate.title, newTitle, 'task title is updated');
        assert.equal(taskToUpdate.start, newStart, 'new task start is updated');
        assert.equal(taskToUpdate.end, newEnd, 'new task end is updated');
    });
    test('updating with custom field', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);

        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);

        this.instance.option('onTaskUpdating', (e) => {
            e.newValues['ItemName'] = 'new item text';
            e.newValues['CustomText'] = 'new custom text';
        });
        this.clock.tick();

        const data = {
            CustomText: 'new',
            ItemName: 'new'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick();
        assert.equal(task.CustomText, 'new custom text', 'task cust field  is updated');
        assert.equal(task.ItemName, 'new item text', 'task cust field  is updated');
    });

    test('task dialog showing - cancel', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);

        this.instance.option('onTaskEditDialogShowing', (e) => { e.cancel = true; });

        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });
    test('task dialog showing - change editor values', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);

        const newStart = new Date('2019-02-25');
        const newEnd = new Date('2019-02-26');
        const newTitle = 'New';
        const newProgress = 73;
        let keyIsDefined = false;

        this.instance.option('onTaskEditDialogShowing', (e) => {
            e.values['title'] = newTitle;
            e.values['start'] = newStart;
            e.values['end'] = newEnd;
            e.values['progress'] = newProgress;
            keyIsDefined = !!e.key;
        });

        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $inputs = $dialog.find('.dx-texteditor-input');
        assert.equal($inputs.eq(0).val(), newTitle, 'title text is shown');
        assert.equal((new Date($inputs.eq(1).val())).getTime(), newStart.getTime(), 'start task text is shown');
        assert.equal((new Date($inputs.eq(2).val())).getTime(), newEnd.getTime(), 'end task text is shown');
        assert.equal($inputs.eq(3).val(), newProgress + '%', 'progress text is shown');
        assert.ok(keyIsDefined, 'key defined');
    });
    test('task dialog showing - disable fields', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);

        this.instance.option('onTaskEditDialogShowing', (e) => {
            e.readOnlyFields.push('title');
            e.readOnlyFields.push('start');
            e.readOnlyFields.push('end');
            e.readOnlyFields.push('progress');
        });

        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.attr('readOnly'), 'readonly', 'all inputs is readOnly');
    });
    test('task dialog showing - hide fields', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        let inputs = $dialog.find('.dx-texteditor-input');
        const count = inputs.length;
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();

        this.instance.option('onTaskEditDialogShowing', (e) => {
            e.hiddenFields.push('title');
            e.hiddenFields.push('start');
            e.hiddenFields.push('end');
            e.hiddenFields.push('progress');
        });
        this.clock.tick();
        showTaskEditDialog(this.instance);
        this.clock.tick();

        inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.length, count - 4, 'all inputs is hidden');
    });

    test('dependency inserting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();
        const count = dependencies.length;
        this.instance.option('onDependencyInserting', (e) => { e.cancel = true; });
        getGanttViewCore(this.instance).commandManager.createDependencyCommand.execute('0', '1', '2');
        this.clock.tick();
        assert.equal(dependencies.length, count, 'new dependency was not created');
    });
    test('dependency deleting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = dependencies.length;
        const dependencyToDelete = dependencies[count - 1];
        let values;
        let key;
        this.instance.option('onDependencyDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        getGanttViewCore(this.instance).commandManager.removeDependencyCommand.execute(dependencyToDelete.id.toString(), false);
        this.clock.tick();
        assert.equal(dependencies.length, count, 'new dependency was not deleted');
        assert.equal(values['predecessorId'], dependencyToDelete.predecessorId, 'check values predecessorId');
        assert.equal(values['successorId'], dependencyToDelete.successorId, 'check values successorId');
        assert.equal(values['type'], dependencyToDelete.type, 'check values type');
        assert.equal(key, dependencyToDelete.id, 'check key');
    });
    test('resource inserting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resources.length;
        this.instance.option('onResourceInserting', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.createResourceCommand.execute('text');
        this.clock.tick();
        assert.equal(resources.length, count, 'new resource was not created');
    });
    test('resource inserting - update text', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resources.length;
        this.instance.option('onResourceInserting', (e) => { e.values['text'] = 'My text'; });

        getGanttViewCore(this.instance).commandManager.createResourceCommand.execute('text');
        this.clock.tick();
        assert.equal(resources.length, count + 1, 'new resource was created');
        const newResource = resources[resources.length - 1];
        this.instance.option('onResourceAssigning', (e) => { });
        assert.equal(newResource.text, 'My text', 'new resource text is right');
    });
    test('resource deleting - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resources.length;
        const resourceToDelete = resources[count - 1];
        let values;
        let key;
        this.instance.option('onResourceDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        getGanttViewCore(this.instance).commandManager.removeResourceCommand.execute(resourceToDelete.id.toString());
        this.clock.tick();
        assert.equal(resources.length, count, 'resource was not deleted');
        assert.equal(values['text'], resourceToDelete.text, 'check values text');
        assert.equal(key, resourceToDelete.id, 'check key');
    });
    test('resource assigning - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resourceAssignments.length;
        this.instance.option('onResourceAssigning', (e) => { e.cancel = true; });

        getGanttViewCore(this.instance).commandManager.assignResourceCommand.execute('1', '2');
        this.clock.tick();
        assert.equal(resourceAssignments.length, count, 'new resource was not assigned');
    });
    test('resource un assigning - canceling', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resourceAssignments.length;
        const toDelete = resourceAssignments[count - 1];
        this.instance.option('onResourceUnassigning', (e) => { e.cancel = true; });

        // eslint-disable-next-line spellcheck/spell-checker
        getGanttViewCore(this.instance).commandManager.deassignResourceCommand.execute(toDelete.id.toString());
        this.clock.tick();
        assert.equal(resourceAssignments.length, count, 'resource was not deassigned');
    });
});

QUnit.module('Edit api', moduleConfig, () => {
    test('task insert', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const data = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
            parentId: 2
        };

        const tasksCount = tasks.length;
        this.instance.insertTask(data);
        this.clock.tick();

        assert.equal(tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = tasks[tasks.length - 1];
        assert.equal(createdTask.title, data.title, 'new task title is right');
        assert.equal(createdTask.start, data.start, 'new task start is right');
        assert.equal(createdTask.end, data.end, 'new task end is right');
        assert.equal(createdTask.parentId, data.parentId, 'new task parentId is right');
    });
    test('task delete', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const tasksCount = tasks.length;
        const taskToDelete = tasks[tasksCount - 1];
        this.instance.deleteTask(taskToDelete.id);
        this.clock.tick();

        const $confirmDialog = $('body').find(POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick();


        assert.equal(tasks.length, tasksCount - 1, 'new task was deleted');
        const removedTask = tasks.filter((t) => t.id === taskToDelete.id)[0];
        assert.equal(removedTask, undefined, 'task was removed');
    });
    test('taskUpdate', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const taskToUpdate = tasks[0];
        const data = {
            title: 'New',
            start: new Date('2019-02-25'),
            end: new Date('2019-02-26'),
            progress: 73
        };

        this.instance.updateTask(taskToUpdate.id, data);
        this.clock.tick();

        assert.equal(taskToUpdate.title, data.title, 'task title is updated');
        assert.equal(taskToUpdate.start, data.start, 'new task start is updated');
        assert.equal(taskToUpdate.end, data.end, 'new task end is updated');
        assert.equal(taskToUpdate.progress, data.progress, 'new task progress is updated');
    });
    test('taskUpdate with custom and core fields', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);

        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);
        this.clock.tick();

        const data = {
            ItemName: 'New',
            CustomText: 'new text'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick();

        assert.equal(task.ItemName, data.ItemName, 'task title is updated');
        assert.equal(task.CustomText, data.CustomText, 'task cust field  is updated');
    });
    test('taskUpdate with only custom field', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);

        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);
        this.clock.tick();

        const data = {
            CustomText: 'new text'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick(300);

        assert.equal(task.CustomText, data.CustomText, 'task cust field  is updated');
    });
    test('insertDependency', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = dependencies.length;
        const data = { 'predecessorId': 2, 'successorId': 4, 'type': 0 };
        this.instance.insertDependency(data);
        this.clock.tick();

        assert.equal(dependencies.length, count + 1, 'new dependency was not created');
        const createdDependency = dependencies[dependencies.length - 1];
        assert.equal(createdDependency.predecessorId, data.predecessorId, 'new predecessorId is right');
        assert.equal(createdDependency.successorId, data.successorId, 'new successorId is right');
        assert.equal(createdDependency.type, data.type, 'new type is right');
    });
    test('deleteDependency', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = dependencies.length;
        const dependencyToDelete = dependencies[count - 1];
        this.instance.deleteDependency(dependencyToDelete.id);
        this.clock.tick();

        const $confirmDialog = $('body').find(POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick();

        assert.equal(dependencies.length, count - 1, 'new dependency was deleted');
        const removedDependency = dependencies.filter((t) => t.id === dependencyToDelete.id)[0];
        assert.equal(removedDependency, undefined, 'dependency was removed');
    });
    test('insertResource', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const resourcesCount = resources.length;
        const assignmentsCount = resourceAssignments.length;
        const data = { text: 'My text' };
        this.instance.insertResource(data, [2]);
        this.clock.tick();

        assert.equal(resources.length, resourcesCount + 1, 'new resource was created');
        assert.equal(resourceAssignments.length, assignmentsCount + 1, 'new assignment was created');
        const newResource = resources[resources.length - 1];
        assert.equal(newResource.text, 'My text', 'new resource text is right');
        const newAssignment = resourceAssignments[resourceAssignments.length - 1];
        assert.equal(newAssignment.resourceId, newResource.id, 'new assignment resource id is right');
        assert.equal(newAssignment.taskId, 2, 'new assignment task id is right');
    });
    test('deleteResource', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resources.length;
        const resourceToDelete = resources[count - 1];
        this.instance.deleteResource(resourceToDelete.id);
        this.clock.tick();

        assert.equal(resources.length, count - 1, 'resources was deleted');
        const removedResource = resources.filter((t) => t.id === resourceToDelete.id)[0];
        assert.equal(removedResource, undefined, 'dependency was removed');
    });
    test('assignResourceToTask', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resourceAssignments.length;
        const taskToAssign = tasks[tasks.length - 1];
        const resourceToAssign = resources[resources.length - 1];
        this.instance.assignResourceToTask(resourceToAssign.id, taskToAssign.id);
        this.clock.tick();

        assert.equal(resourceAssignments.length, count + 1, 'resource was assigned');
        const newAssignment = resourceAssignments[resourceAssignments.length - 1];
        assert.equal(newAssignment.resourceId, resourceToAssign.id, 'new assignment resource id is right');
        assert.equal(newAssignment.taskId, taskToAssign.id, 'new assignment task id is right');
    });
    test('unassignResourceFromTask', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

        const count = resourceAssignments.length;
        const toDelete = resourceAssignments[count - 1];
        // eslint-disable-next-line spellcheck/spell-checker
        this.instance.unassignResourceFromTask(toDelete.resourceId, toDelete.taskId);
        this.clock.tick();

        assert.equal(resourceAssignments.length, count - 1, 'resource was not deassigned');
        const removedAssignment = resourceAssignments.filter((t) => t.id === toDelete.id)[0];
        assert.equal(removedAssignment, undefined, 'assigmnent was removed');
    });
    test('getTaskData', function(assert) {
        this.createInstance(allSourcesOptions);
        const task = {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };
        const tasksMap = {
            dataSource: [ task ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        this.clock.tick();

        const taskData = this.instance.getTaskData(1);
        assert.equal(taskData['ItemName'], task['ItemName'], 'title');
        assert.equal(taskData['SprintStartDate'], task['SprintStartDate'], 'start');
        assert.equal(taskData['SprintEndDate'], task['SprintEndDate'], 'end');
        assert.equal(taskData['TaskProgress'], task['TaskProgress'], 'progress');
    });
    test('getDependencyData', function(assert) {
        const dependency = {
            Id: 1,
            PredecessorTask: 1,
            SuccessorTask: 4,
            DependencyType: 0,
        };
        const dependencyMap = {
            dataSource: [ dependency ],
            keyExpr: 'Id',
            predecessorIdExpr: 'PredecessorTask',
            successorIdExpr: 'SuccessorTask',
            typeExpr: 'DependencyType',
        };
        this.createInstance(tasksOnlyOptions);
        this.instance.option('dependencies', dependencyMap);
        this.clock.tick();

        const dependencyData = this.instance.getDependencyData(1);
        this.clock.tick();
        assert.equal(dependencyData['PredecessorTask'], dependency['PredecessorTask'], 'PredecessorTask');
        assert.equal(dependencyData['SuccessorTask'], dependency['SuccessorTask'], 'SuccessorTask');
        assert.equal(dependencyData['DependencyType'], dependency['DependencyType'], 'DependencyType');
    });
    test('getResourceData', function(assert) {
        this.createInstance(allSourcesOptions);
        const resource = { Id: 1, ResourceText: 'My text', ResourceColor: 'black' };
        const resourceMap = {
            dataSource: [ resource ],
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };
        this.instance.option('resources', resourceMap);
        this.clock.tick();

        const resourceData = this.instance.getResourceData(1);
        assert.equal(resourceData['ResourceText'], resource['ResourceText'], 'ResourceText');
        assert.equal(resourceData['ResourceColor'], resource['ResourceColor'], 'ResourceColor');
    });
    test('getResourceAssignmentData', function(assert) {
        this.createInstance(allSourcesOptions);
        const assignment = { Id: 1, TaskKey: 1, ResourceKey: 2 };
        const assignmentMap = {
            dataSource: [ assignment ],
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };
        this.instance.option('resourceAssignments', assignmentMap);
        this.clock.tick();

        const assignmentData = this.instance.getResourceAssignmentData(1);
        assert.equal(assignmentData['TaskKey'], assignment['TaskKey'], 'TaskKey');
        assert.equal(assignmentData['ResourceKey'], assignment['ResourceKey'], 'ResourceKey');
    });
    test('getTaskResources', function(assert) {
        this.createInstance(allSourcesOptions);
        const resources = [
            { Id: 1, ResourceText: 'My text', ResourceColor: 'black' },
            { Id: 2, ResourceText: 'My text2', ResourceColor: 'black' }
        ];
        const resourceMap = {
            dataSource: resources,
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };
        const assignments = [
            { Id: 1, TaskKey: 1, ResourceKey: 1 },
            { Id: 2, TaskKey: 1, ResourceKey: 2 }
        ];
        const assignmentMap = {
            dataSource: assignments,
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };
        this.instance.option('resources', resourceMap);
        this.instance.option('resourceAssignments', assignmentMap);
        this.clock.tick();

        const taskResources = this.instance.getTaskResources(1);
        assert.equal(taskResources.length, 2, 'length');
        assert.equal(taskResources[0]['ResourceText'], resources[0]['ResourceText'], 'ResourceText 1');
        assert.equal(taskResources[1]['ResourceText'], resources[1]['ResourceText'], 'ResourceText 2');
    });
    test('getVisibleKeys', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 2, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 },
            { 'id': 6, 'parentId': 2, 'title': 'Secure core resources', 'start': new Date('2019-02-25T10:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 },
            { 'id': 7, 'parentId': 2, 'title': 'Scope complete', 'start': new Date('2019-02-26T09:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 0 }
        ];
        const my_dependencies = [
            { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 },
            { 'id': 1, 'predecessorId': 2, 'successorId': 3, 'type': 0 },
            { 'id': 2, 'predecessorId': 3, 'successorId': 4, 'type': 0 },
            { 'id': 3, 'predecessorId': 4, 'successorId': 5, 'type': 0 },
            { 'id': 4, 'predecessorId': 5, 'successorId': 6, 'type': 0 },
            { 'id': 5, 'predecessorId': 6, 'successorId': 7, 'type': 0 }
        ];
        const my_resources = [
            { 'id': 1, 'text': 'Management' },
            { 'id': 2, 'text': 'Project Manager' },
            { 'id': 3, 'text': 'Deployment Team' }
        ];
        const my_resourceAssignments = [
            { 'id': 0, 'taskId': 3, 'resourceId': 1 },
            { 'id': 1, 'taskId': 4, 'resourceId': 1 },
            { 'id': 2, 'taskId': 5, 'resourceId': 2 },
            { 'id': 3, 'taskId': 6, 'resourceId': 2 },
            { 'id': 4, 'taskId': 6, 'resourceId': 3 },
        ];

        const my_allSourcesOptions = {
            tasks: { dataSource: my_tasks },
            dependencies: { dataSource: my_dependencies },
            resources: { dataSource: my_resources },
            resourceAssignments: { dataSource: my_resourceAssignments }
        };

        this.createInstance(my_allSourcesOptions);
        this.clock.tick();

        assert.equal(this.instance.getVisibleTaskKeys().length, my_tasks.length, 'task keys');
        assert.equal(this.instance.getVisibleDependencyKeys().length, my_dependencies.length, 'dependencies keys');
        assert.equal(this.instance.getVisibleResourceKeys().length, my_resources.length, 'resources keys');
        assert.equal(this.instance.getVisibleResourceAssignmentKeys().length, my_resourceAssignments.length, 'resource assignments keys');

        this.instance.option('tasks', { dataSource: [] });
        this.instance.option('dependencies', { dataSource: [] });
        this.instance.option('resources', { dataSource: [] });
        this.instance.option('resourceAssignments', { dataSource: [] });
        this.clock.tick();

        assert.equal(this.instance.getVisibleTaskKeys().length, 0, 'task keys');
        assert.equal(this.instance.getVisibleDependencyKeys().length, 0, 'dependencies keys');
        assert.equal(this.instance.getVisibleResourceKeys().length, 0, 'resources keys');
        assert.equal(this.instance.getVisibleResourceAssignmentKeys().length, 0, 'resource assignments keys');
    });
});

QUnit.module('Mappings convert', moduleConfig, () => {
    test('Task data convert', function(assert) {
        this.createInstance(allSourcesOptions);
        const tasksMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            parentIdExpr: 'ParentId',
            titleExpr: 'ItemName',
            startExpr: 'SprintStartDate',
            colorExpr: 'TaskColor',
            endExpr: 'SprintEndDate',
            progressExpr: 'TaskProgress'
        };
        this.instance.option('tasks', tasksMap);
        const start = new Date('2019-02-11T05:00:00.000Z');
        const end = new Date('2019-02-14T05:00:00.000Z');
        const data = {
            title: 'custom text',
            start: start,
            end: end,
            progress: 31,
            color: 'red'
        };

        const mappedData = this.instance._convertCoreToMappedData('tasks', data);
        assert.equal(mappedData['ItemName'], 'custom text', 'title was mapped');
        assert.equal(mappedData['SprintStartDate'], start, 'start was mapped');
        assert.equal(mappedData['SprintEndDate'], end, 'end was mapped');
        assert.equal(mappedData['TaskProgress'], 31, 'progress was mapped');
        assert.equal(mappedData['TaskColor'], 'red', 'color was mapped');

        const coreData = this.instance._convertMappedToCoreData('tasks', mappedData);
        assert.equal(coreData['title'], 'custom text', 'title was mapped');
        assert.equal(coreData['start'], start, 'start was mapped');
        assert.equal(coreData['end'], end, 'end was mapped');
        assert.equal(coreData['progress'], 31, 'progress was mapped');
        assert.equal(coreData['color'], 'red', 'color was mapped');

        const fields = ['title', 'start', 'end', 'progress', 'color'];
        const mappedFields = this.instance._convertCoreToMappedFields('tasks', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('ItemName') > -1, 'title was mapped');
        assert.ok(mappedFields.indexOf('SprintStartDate') > -1, 'start was mapped');
        assert.ok(mappedFields.indexOf('SprintEndDate') > -1, 'end was mapped');
        assert.ok(mappedFields.indexOf('TaskProgress') > -1, 'progress was mapped');
        assert.ok(mappedFields.indexOf('TaskColor') > -1, 'color was mapped');

        const coreFields = this.instance._convertMappedToCoreFields('tasks', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('title') > -1, 'title in list');
        assert.ok(coreFields.indexOf('start') > -1, 'start in list');
        assert.ok(coreFields.indexOf('end') > -1, 'end in list');
        assert.ok(coreFields.indexOf('progress') > -1, 'progress in list');
        assert.ok(coreFields.indexOf('color') > -1, 'color in list');
    });
    test('Dependency data convert', function(assert) {
        this.createInstance(allSourcesOptions);
        const dependencyMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            predecessorIdExpr: 'PredecessorTask',
            successorIdExpr: 'SuccessorTask',
            typeExpr: 'DependencyType',
        };

        this.instance.option('dependencies', dependencyMap);
        const data = { predecessorId: 3, successorId: 4, type: 0 };

        const mappedData = this.instance._convertCoreToMappedData('dependencies', data);
        assert.equal(mappedData['PredecessorTask'], 3, 'predecessorId was mapped');
        assert.equal(mappedData['SuccessorTask'], 4, 'successorId was mapped');
        assert.equal(mappedData['DependencyType'], 0, 'type was mapped');

        const coreData = this.instance._convertMappedToCoreData('dependencies', mappedData);
        assert.equal(coreData['predecessorId'], 3, 'predecessorId was mapped');
        assert.equal(coreData['successorId'], 4, 'successorId was mapped');
        assert.equal(coreData['type'], 0, 'type was mapped');

        const fields = ['predecessorId', 'successorId', 'type'];
        const mappedFields = this.instance._convertCoreToMappedFields('dependencies', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('PredecessorTask') > -1, 'PredecessorTask was mapped');
        assert.ok(mappedFields.indexOf('SuccessorTask') > -1, 'SuccessorTask was mapped');
        assert.ok(mappedFields.indexOf('DependencyType') > -1, 'DependencyType was mapped');

        const coreFields = this.instance._convertMappedToCoreFields('dependencies', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('predecessorId') > -1, 'predecessorId in list');
        assert.ok(coreFields.indexOf('successorId') > -1, 'successorId in list');
        assert.ok(coreFields.indexOf('type') > -1, 'type in list');
    });
    test('Resource data convert', function(assert) {
        this.createInstance(allSourcesOptions);
        const resourceMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            textExpr: 'ResourceText',
            colorExpr: 'ResourceColor'
        };

        this.instance.option('resources', resourceMap);
        const data = { text: 'My text', color: 'black' };

        const mappedData = this.instance._convertCoreToMappedData('resources', data);
        assert.equal(mappedData['ResourceText'], 'My text', 'ResourceText was mapped');
        assert.equal(mappedData['ResourceColor'], 'black', 'ResourceColor was mapped');

        const coreData = this.instance._convertMappedToCoreData('resources', mappedData);
        assert.equal(coreData['text'], 'My text', 'text was mapped');
        assert.equal(coreData['color'], 'black', 'color was mapped');

        const fields = ['text', 'color'];
        const mappedFields = this.instance._convertCoreToMappedFields('resources', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('ResourceText') > -1, 'ResourceText was mapped');
        assert.ok(mappedFields.indexOf('ResourceColor') > -1, 'ResourceColor was mapped');

        const coreFields = this.instance._convertMappedToCoreFields('resources', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('text') > -1, 'text in list');
        assert.ok(coreFields.indexOf('color') > -1, 'color in list');
    });
    test('Assignment data convert', function(assert) {
        this.createInstance(allSourcesOptions);
        const assignmentMap = {
            dataSource: [ ],
            keyExpr: 'Id',
            taskIdExpr: 'TaskKey',
            resourceIdExpr: 'ResourceKey'
        };

        this.instance.option('resourceAssignments', assignmentMap);
        const data = { taskId: 1, resourceId: 2 };

        const mappedData = this.instance._convertCoreToMappedData('resourceAssignments', data);
        assert.equal(mappedData['TaskKey'], 1, 'TaskKey was mapped');
        assert.equal(mappedData['ResourceKey'], 2, 'ResourceKey was mapped');

        const coreData = this.instance._convertMappedToCoreData('resourceAssignments', mappedData);
        assert.equal(coreData['taskId'], 1, 'taskId was mapped');
        assert.equal(coreData['resourceId'], 2, 'resourceId was mapped');

        const fields = ['taskId', 'resourceId'];
        const mappedFields = this.instance._convertCoreToMappedFields('resourceAssignments', fields);
        assert.equal(mappedFields.length, fields.length, 'length ok');
        assert.ok(mappedFields.indexOf('TaskKey') > -1, 'TaskKey was mapped');
        assert.ok(mappedFields.indexOf('ResourceKey') > -1, 'ResourceKey was mapped');

        const coreFields = this.instance._convertMappedToCoreFields('resourceAssignments', mappedFields);
        assert.equal(coreFields.length, fields.length, 'length ok');
        assert.ok(coreFields.indexOf('taskId') > -1, 'taskId in list');
        assert.ok(coreFields.indexOf('resourceId') > -1, 'resourceId in list');
    });
});


QUnit.module('Context Menu', moduleConfig, () => {
    test('showing', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden on create');
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 1, 'menu is visible after right click');
    });
    test('tree list context menu', function(assert) {
        this.createInstance(allSourcesOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden on create');
        const $cellElement = $(this.instance._treeList.getCellElement(0, 0));
        $cellElement.trigger('contextmenu');
        assert.equal(getContextMenuElement().length, 2, 'menu is visible after right click in tree list');
    });
    test('enabled', function(assert) {
        this.createInstance(extend(tasksOnlyOptions, { contextMenu: { enabled: false } }));
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden after right click');
        this.instance.option('contextMenu.enabled', true);
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 1, 'menu is visible after right click');
    });
    test('customization', function(assert) {
        const contextMenuOptions = {
            contextMenu: {
                items: [
                    'undo',
                    'redo',
                    'taskDetails',
                    'zoomIn',
                    'zoomOut',
                    { name: 'custom', text: 'customItem', icon: 'blockquote', beginGroup: true }
                ]
            }
        };
        this.createInstance(extend(tasksOnlyOptions, contextMenuOptions));
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        const getItems = () => {
            return getContextMenuElement().find(CONTEXT_MENU_ITEM_SELECTOR);
        };
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const items = getItems();
        assert.equal(items.length, 6, 'there are 6 items');
        assert.equal(items.eq(0).text().toLowerCase(), contextMenuOptions.contextMenu.items[0].toLowerCase(), 'undo item was rendered');
        assert.equal(items.eq(5).text(), contextMenuOptions.contextMenu.items[5].text, 'custom item was rendered');
        this.instance.option('contextMenu.items', []);
        assert.equal(getItems().length, 4, 'there are 4 items by default');
    });
    test('cancel ContextMenuPreparing', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        this.instance.option('onContextMenuPreparing', (e) => {
            e.cancel = true;
        });
        this.clock.tick();
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        assert.equal(getContextMenuElement().length, 0, 'menu is hidden after right click');
    });
    test('add item in ContextMenuPreparing', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();

        const getContextMenuElement = () => {
            return $('body').find(OVERLAY_WRAPPER_SELECTOR).find(CONTEXT_MENU_SELECTOR);
        };
        this.instance.option('onContextMenuPreparing', (e) => {
            e.items.push({ text: 'My Command', name: 'Custom' });
        });
        this.instance._showPopupMenu({ position: { x: 0, y: 0 } });
        const items = getContextMenuElement().find(CONTEXT_MENU_ITEM_SELECTOR);
        assert.equal(items.eq(items.length - 1).text(), 'My Command', 'custom item was rendered');
    });
});
QUnit.module('Strip Lines', moduleConfig, () => {
    test('render', function(assert) {
        const stripLines = [
            { start: tasks[0].start, title: 'First' },
            { start: new Date(2019, 2, 1) },
            { start: new Date(2019, 5, 5), end: () => tasks[tasks.length - 1].end, title: 'Interval', cssClass: 'end' }
        ];
        const options = {
            tasks: { dataSource: tasks },
            stripLines: stripLines
        };
        this.createInstance(options);
        this.clock.tick();

        const $stripLines = this.$element.find(TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 2, 'all strip lines are rendered');
        const $timeIntervals = this.$element.find(TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 1, 'all time intervals are rendered');
        assert.ok($timeIntervals.eq(0).hasClass(stripLines[2].cssClass), 'custom cssClass rendered');
        assert.equal($stripLines.eq(0).attr('title'), stripLines[0].title, 'title rendered');
    });
    test('changing', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();

        let $stripLines = this.$element.find(TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 0, 'gantt has no strip lines');
        let $timeIntervals = this.$element.find(TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 0, 'gantt has no time intervals');

        this.instance.option('stripLines', [
            { start: tasks[0].start },
            { start: tasks[tasks.length - 1].start, end: tasks[tasks.length - 1].end }
        ]);
        $stripLines = this.$element.find(TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 1, 'gantt has strip line');
        $timeIntervals = this.$element.find(TIME_INTERVAL_SELECTOR);
        assert.equal($timeIntervals.length, 1, 'gantt has time interval');

        this.instance.option('stripLines', []);
        $stripLines = this.$element.find(TIME_MARKER_SELECTOR);
        assert.equal($stripLines.length, 0, 'gantt has no strip lines');
    });
});
QUnit.module('Parent auto calculation', moduleConfig, () => {
    test('render', function(assert) {
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const $stripLines = this.$element.find(PARENT_TASK_SELECTOR);
        assert.ok($stripLines.length > 0, 'parent tasks has className');
    });

    test('first load data', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        let dataToCheck = [];
        this.instance._onParentTasksRecalculated = (data) => {
            dataToCheck = data;
        };
        getGanttViewCore(this.instance).viewModel.updateModel();
        this.clock.tick();

        assert.equal(dataToCheck.length, 3, 'length');
        assert.equal(dataToCheck[0].start, start, 'parent 0 start date');
        assert.equal(dataToCheck[0].end, end, 'parent 0 end date');
        assert.ok(dataToCheck[0].progress > 0, 'parent 0 progress eq 0');
        assert.equal(dataToCheck[1].start, start, 'parent 1 start date');
        assert.equal(dataToCheck[1].end, end, 'parent 1 end date');
        assert.ok(dataToCheck[1].progress > 0, 'parent 1 progress eq 0');
        assert.equal(dataToCheck[2].start, start, 'child start date');
        assert.equal(dataToCheck[2].end, end, 'child 1 end date');
        assert.equal(dataToCheck[2].progress, 50, 'child progress');
    });

    test('mode changing', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: tasks }
        };
        this.createInstance(options);
        let dataToCheck = [];
        this.instance._onParentTasksRecalculated = (data) => {
            dataToCheck = data;
        };
        this.clock.tick();
        let $parentTasks = this.$element.find(PARENT_TASK_SELECTOR);
        assert.equal(dataToCheck.length, 0, 'length');
        assert.equal($parentTasks.length, 0, 'parent tasks exists');

        this.instance.option('validation.autoUpdateParentTasks', true);
        this.clock.tick();
        $parentTasks = this.$element.find(PARENT_TASK_SELECTOR);
        assert.equal($parentTasks.length, 2, 'parent tasks not exists');
        assert.equal(dataToCheck.length, 3, 'length');
        assert.equal(dataToCheck[0].start, start, 'parent 0 start date');
        assert.equal(dataToCheck[0].end, end, 'parent 0 end date');
        assert.ok(dataToCheck[0].progress > 0, 'parent 0 progress eq 0');
        assert.equal(dataToCheck[1].start, start, 'parent 1 start date');
        assert.equal(dataToCheck[1].end, end, 'parent 1 end date');
        assert.ok(dataToCheck[1].progress > 0, 'parent 1 progress eq 0');
        assert.equal(dataToCheck[2].start, start, 'child start date');
        assert.equal(dataToCheck[2].end, end, 'child 1 end date');
        assert.equal(dataToCheck[2].progress, 50, 'child progress');

        dataToCheck = [];
        this.instance.option('validation.autoUpdateParentTasks', false);
        this.clock.tick();
        $parentTasks = this.$element.find(PARENT_TASK_SELECTOR);
        assert.equal(dataToCheck.length, 0, 'length');
        assert.equal($parentTasks.length, 0, 'parent tasks exists');
    });

    test('custom fields load', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'idKey': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'customField': 'test0' },
            { 'idKey': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0, 'customField': 'test1' },
            { 'idKey': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'customField': 'test2' }
        ];
        const options = {
            tasks: { dataSource: tasks, keyExpr: 'idKey', },
            validation: { autoUpdateParentTasks: true },
            columns: [{
                dataField: 'customField',
                caption: 'custom'
            }]
        };
        this.createInstance(options);
        this.clock.tick();

        const customCellText0 = this.$element.find(TREELIST_DATA_ROW_SELECTOR).first().find('td').first().text();
        const customCellText1 = this.$element.find(TREELIST_DATA_ROW_SELECTOR).eq(1).find('td').first().text();
        const customCellText2 = this.$element.find(TREELIST_DATA_ROW_SELECTOR).last().find('td').first().text();
        assert.equal(customCellText0, 'test0', 'custom fields text not shown');
        assert.equal(customCellText1, 'test1', 'custom fields text not shown');
        assert.equal(customCellText2, 'test2', 'custom fields text not shown');
    });

    test('edit title (T891411)', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');
        const tasks = [
            { 'idKey': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0, 'customField': 'test0' },
            { 'idKey': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0, 'customField': 'test1' },
            { 'idKey': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50, 'customField': 'test2' }
        ];
        const options = {
            tasks: { dataSource: tasks, keyExpr: 'idKey', },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick();

        showTaskEditDialog(this.instance);
        this.clock.tick();
        const $dialog = $('body').find(POPUP_SELECTOR);
        const $inputs = $dialog.find(INPUT_TEXT_EDITOR_SELECTOR);
        assert.equal($inputs.eq(0).val(), tasks[0].title, 'title text is shown');
        const testTitle = 'text';
        const titleTextBox = $dialog.find('.dx-textbox').eq(0).dxTextBox('instance');
        titleTextBox.option('value', testTitle);
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick();
        const firstTreeListTitleText = this.$element.find(TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(2).text();
        assert.equal(firstTreeListTitleText, testTitle, 'title text was modified');
    });
});

QUnit.module('Edit data sources (T887281)', moduleConfig, () => {
    test('array, auto update parents on', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('array, auto update parents off', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: false }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('user data source with load/update, auto update parents on', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];

        const ds = new DataSource({
            key: 'my_id',
            load: function(loadOptions) {
                return tasks;
            },

            update: function(key, values) {
                let row = {};
                const k = this.key();

                for(let i = 0; i < tasks.length; i++) {
                    const r = tasks[i];
                    if(r[k] === key) {
                        row = r;
                        break;
                    }
                }
                for(const val in values) {
                    row[val] = values[val];
                }
            }
        });

        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: ds
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('user data source with load/update, auto update parents off', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];

        const ds = new DataSource({
            key: 'my_id',
            load: function(loadOptions) {
                return tasks;
            },

            update: function(key, values) {
                let row = {};
                const k = this.key();

                for(let i = 0; i < tasks.length; i++) {
                    const r = tasks[i];
                    if(r[k] === key) {
                        row = r;
                        break;
                    }
                }
                for(const val in values) {
                    row[val] = values[val];
                }
            }
        });

        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: ds
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: false }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('user custom store with load/update, auto update parents on', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];

        const ds = new CustomStore({
            key: 'my_id',
            load: function(loadOptions) {
                return tasks;
            },

            update: function(key, values) {
                let row = {};
                const k = this.key();

                for(let i = 0; i < tasks.length; i++) {
                    const r = tasks[i];
                    if(r[k] === key) {
                        row = r;
                        break;
                    }
                }
                for(const val in values) {
                    row[val] = values[val];
                }
            }
        });

        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: ds
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('user dcustom store with load/update, auto update parents off', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];

        const ds = new CustomStore({
            key: 'my_id',
            load: function(loadOptions) {
                return tasks;
            },

            update: function(key, values) {
                let row = {};
                const k = this.key();

                for(let i = 0; i < tasks.length; i++) {
                    const r = tasks[i];
                    if(r[k] === key) {
                        row = r;
                        break;
                    }
                }
                for(const val in values) {
                    row[val] = values[val];
                }
            }
        });

        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: ds
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: false }
        };
        this.createInstance(options);
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._updateTreeListDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
});

QUnit.module('First day of week', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(allSourcesOptions);
        this.instance.option('scaleType', 'days');
        this.instance.option('firstDayOfWeek', 0);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 0, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 1);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 1, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 2);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 2, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 3);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 3, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 4);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 4, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 5);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 5, 'incorrect first day');

        this.instance.option('firstDayOfWeek', 6);
        this.clock.tick();
        assert.equal(getGanttViewCore(this.instance).range.start.getDay(), 6, 'incorrect first day');
    });
});

QUnit.module('Tooltip Template', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();

        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltipText = this.$element.find(TOOLTIP_SELECTOR).text();
        const taskTitle = tasks[0].title;
        assert.equal(tooltipText.indexOf(taskTitle), 0, 'Default template works correctly');
    });
    test('custom text', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestTooltipText';
        const customTooltipFunction = (task, container) => {
            $(container).empty();
            return customTooltipText;
        };
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipFunction);
        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltipText = this.$element.find(TOOLTIP_SELECTOR).text();
        assert.equal(tooltipText, customTooltipText, 'Custom template text works correctly');
    });
    test('custom jQuery', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestCustomTooltipJQuery';
        const customTooltipJQuery = $('<div>TestCustomTooltipJQuery</div>');
        const customTooltipFunction = (task, container) => {
            $(container).empty();
            return customTooltipJQuery;
        };
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipFunction);
        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);

        this.clock.tick();
        const tooltipText = this.$element.find(TOOLTIP_SELECTOR).text();
        assert.equal(tooltipText, customTooltipText, 'Custom template with jQuery works correctly');
    });
    test('different tooltips for tasks', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const customTooltipText = 'TestTooltipText';
        const customTooltipFunction = (task, container) => {
            if(task.id === 1) {
                return;
            }
            const template = container.innerHTML;
            $(container).empty();
            if(task.id === 2) {
                return;
            }
            if(task.id === 3 || task.id === 4) {
                return customTooltipText;
            }
            return template;
        };
        this.clock.tick();
        this.instance.option('taskTooltipContentTemplate', customTooltipFunction);
        this.clock.tick();
        const ganttCore = getGanttViewCore(this.instance);
        this.clock.tick();
        ganttCore.taskEditController.show(0);
        ganttCore.taskEditController.showTaskInfo(0, 0);
        this.clock.tick();
        const tooltipTitleText = this.$element.find(TOOLTIP_SELECTOR).text();
        const taskTitle = tasks[0].title;
        assert.equal(tooltipTitleText.indexOf(taskTitle), 0, 'Default template works correctly');
        ganttCore.taskEditController.tooltip.hide();
        this.clock.tick();
        ganttCore.taskEditController.show(1);
        ganttCore.taskEditController.showTaskInfo(0, 0);
        this.clock.tick();
        const tooltipDisplayStyle = this.$element.find(TOOLTIP_SELECTOR)[0].style.display;
        assert.equal(tooltipDisplayStyle, 'none', 'Empty content template doesnt show tooltip');
        ganttCore.taskEditController.tooltip.hide();
        this.clock.tick();
        ganttCore.taskEditController.show(2);
        ganttCore.taskEditController.showTaskInfo(0, 0);
        this.clock.tick();
        const tooltipText = this.$element.find(TOOLTIP_SELECTOR).text();
        assert.equal(tooltipText, customTooltipText, 'Custom template text works correctly');
    });
});

QUnit.module('Root Value', moduleConfig, () => {
    test('Default value with parentId as 0', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks }
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Default value with parentId as undefined', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': undefined, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks }
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is 0', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: 0
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is undefined', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': undefined, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: undefined
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
    test('Root Value is null', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': null, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            rootValue: null
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListElements = this.$element.find(TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 3);
    });
});
