import $ from 'jquery';
const { test } = QUnit;
import 'common.css!';
import 'ui/gantt';

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
const INPUT_TEXT_EDITOR_SELECTOR = '.dx-texteditor-input';
const TOOLBAR_ITEM_SELECTOR = '.dx-toolbar-item';
const PARENT_TASK_SELECTOR = '.dx-gantt-parent';
const TOOLBAR_SEPARATOR_SELECTOR = '.dx-gantt-toolbar-separator';


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
});

QUnit.module('Options', moduleConfig, () => {
    test('taskListWidth', function(assert) {
        this.createInstance(tasksOnlyOptions);
        this.clock.tick();
        const treeListWrapperElement = this.$element.find(TREELIST_WRAPPER_SELECTOR);
        assert.equal(treeListWrapperElement.width(), 300, '300px');
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
        assert.equal(coreEditingSettings.allowTaskAdding, true, 'task adding allowed by default');
        assert.equal(coreEditingSettings.allowTaskDeleting, true, 'task deleting allowed by default');
        assert.equal(coreEditingSettings.allowTaskUpdating, true, 'task updating allowed by default');
        assert.equal(coreEditingSettings.allowDependencyAdding, true, 'dependency adding allowed by default');
        assert.equal(coreEditingSettings.allowDependencyDeleting, true, 'dependency deleting allowed by default');
        assert.equal(coreEditingSettings.allowDependencyUpdating, true, 'dependency updating allowed by default');
        assert.equal(coreEditingSettings.allowResourceAdding, true, 'resource adding allowed by default');
        assert.equal(coreEditingSettings.allowResourceDeleting, true, 'resource deleting allowed by default');
        assert.equal(coreEditingSettings.allowResourceUpdating, true, 'resource updating allowed by default');
        this.instance.option('editing', {
            enabled: true,
            allowTaskAdding: false,
            allowTaskDeleting: false,
            allowTaskUpdating: false,
            allowDependencyAdding: false,
            allowDependencyDeleting: false,
            allowDependencyUpdating: false,
            allowResourceAdding: false,
            allowResourceDeleting: false,
            allowResourceUpdating: false,
        });
        coreEditingSettings = getGanttViewCore(this.instance).settings.editing;
        assert.equal(coreEditingSettings.enabled, true, 'editing allowed');
        assert.equal(coreEditingSettings.allowTaskAdding, false, 'task adding is prohibited');
        assert.equal(coreEditingSettings.allowTaskDeleting, false, 'task deleting is prohibited');
        assert.equal(coreEditingSettings.allowTaskUpdating, false, 'task updating is prohibited');
        assert.equal(coreEditingSettings.allowDependencyAdding, false, 'dependency adding is prohibited');
        assert.equal(coreEditingSettings.allowDependencyDeleting, false, 'dependency deleting is prohibited');
        assert.equal(coreEditingSettings.allowDependencyUpdating, false, 'dependency updating is prohibited');
        assert.equal(coreEditingSettings.allowResourceAdding, false, 'resource adding is prohibited');
        assert.equal(coreEditingSettings.allowResourceDeleting, false, 'resource deleting is prohibited');
        assert.equal(coreEditingSettings.allowResourceUpdating, false, 'resource updating is prohibited');
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
});

QUnit.module('Events', moduleConfig, () => {
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
        assert.equal($items.first().children().children().attr('aria-label'), 'undo', 'First button is undo button');
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
                formatName: 'zoomIn',
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
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(newStart, newEnd, newTitle, '1');
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
        this.clock.tick();

        const removedTaskId = 3;
        const tasksCount = tasks.length;
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(removedTaskId.toString(), false);
        this.clock.tick();
        assert.equal(tasks.length, tasksCount - 1, 'tasks less');
        const removedTask = tasks.filter((t) => t.id === removedTaskId)[0];
        assert.equal(removedTask, undefined, 'task was removed');
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
});
