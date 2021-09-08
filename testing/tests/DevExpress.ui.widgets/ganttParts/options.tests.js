import $ from 'jquery';
import 'ui/gantt';
import { Consts, data, options, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Options', moduleConfig, () => {
    test('taskListWidth', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        const treeListWrapperElement = this.$element.find(Consts.TREELIST_WRAPPER_SELECTOR);
        assert.roughEqual(treeListWrapperElement.width(), 300, 0.01, '300px');
        this.instance.option('taskListWidth', 500);
        assert.equal(treeListWrapperElement.width(), 500, '500px');
    });
    test('showResources', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, data.resourceAssignments.length);
        this.instance.option('showResources', false);
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, 0);
        this.instance.option('showResources', true);
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, data.resourceAssignments.length);
    });
    test('taskTitlePosition', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        const milestoneCount = data.tasks.reduce((count, t) => {
            return t.start.getTime() === t.end.getTime() ? count + 1 : count;
        }, 0);
        assert.equal(this.$element.find(Consts.TASK_TITLE_IN_SELECTOR).length, data.tasks.length - milestoneCount);
        assert.equal(this.$element.find(Consts.TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option('taskTitlePosition', 'none');
        assert.equal(this.$element.find(Consts.TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(Consts.TASK_TITLE_OUT_SELECTOR).length, 0);
        this.instance.option('taskTitlePosition', 'outside');
        assert.equal(this.$element.find(Consts.TASK_TITLE_IN_SELECTOR).length, 0);
        assert.equal(this.$element.find(Consts.TASK_TITLE_OUT_SELECTOR).length, data.tasks.length);
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
        const taskWrapperElements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(taskWrapperElements.length, tasksDS.length);
        const firstTitle = taskWrapperElements.first().children().children().first().text();
        assert.equal(firstTitle, tasksDS[0].t);
        const firstElementBackgroundColor = taskWrapperElements.first().children().css('background-color');
        assert.equal(firstElementBackgroundColor, tasksDS[0].c);
        const firstProgressElement = taskWrapperElements.first().children().children().last();
        assert.ok(firstProgressElement.width() > 0);
        const $firstTreeListRowText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('.dx-treelist-text-content').first().text();
        assert.equal($firstTreeListRowText, tasksDS[0].t, 'treeList has title text');

        const dependencyElements = this.$element.find(Consts.TASK_ARROW_SELECTOR);
        assert.equal(dependencyElements.length, dependenciesDS.length);

        const resourceElements = this.$element.find(Consts.TASK_RESOURCES_SELECTOR);
        assert.equal(resourceElements.length, resourceAssignmentsDS.length);
        assert.equal(resourceElements.first().text(), resourcesDS[0].t);
        assert.equal(resourceElements.first().css('background-color'), resourcesDS[0].c);
    });
    test('columns', function(assert) {
        const options = {
            tasks: { dataSource: data.tasks },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start Date' }
            ]
        };
        this.createInstance(options);
        this.clock.tick();
        let $treeListHeaderRow = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 2, 'treeList has 2 columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Subject', 'first column title is checked');
        assert.equal($treeListHeaderRow.children().eq(1).text(), 'Start Date', 'second column title is checked');

        this.instance.option('columns[0].visible', false);
        $treeListHeaderRow = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, 'treeList has 1 visible columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Start Date', 'first visible column title is checked');

        this.instance.option('columns', [{ dataField: 'title', caption: 'Task' }]);
        $treeListHeaderRow = this.$element.find(Consts.TREELIST_HEADER_ROW_SELECTOR);
        assert.equal($treeListHeaderRow.children().length, 1, 'treeList has 1 columns');
        assert.equal($treeListHeaderRow.children().eq(0).text(), 'Task', 'first column title is checked');
    });
    test('selectedRowKey', function(assert) {
        const selectedRowKey = 2;
        const options = {
            tasks: { dataSource: data.tasks },
            selectedRowKey: selectedRowKey
        };
        this.createInstance(options);
        this.clock.tick();
        const treeListSelectedRowKeys = this.instance._treeList.option('selectedRowKeys');
        assert.equal(treeListSelectedRowKeys.length, 1, 'only one treeList row is selected');
        assert.equal(treeListSelectedRowKeys, selectedRowKey, 'second treeList row is selected');
        this.instance.option('selectedRowKey', undefined);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 0);
        this.instance.option('selectedRowKey', 1);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        this.instance.option('selectedRowKey', undefined);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 0);
    });
    test('allowSelection', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        this.instance.option('selectedRowKey', 1);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 1);
        this.instance.option('allowSelection', false);
        assert.equal(this.$element.find(Consts.SELECTION_SELECTOR).length, 0);
    });
    test('showRowLines', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        assert.ok(this.$element.find(Consts.GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, 'ganttView has borders by default');
        assert.equal(this.instance._treeList.option('showRowLines'), true, 'treeList has borders by default');
        this.instance.option('showRowLines', false);
        assert.equal(this.$element.find(Consts.GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length, 0, 'ganttView has no borders');
        assert.equal(this.instance._treeList.option('showRowLines'), false, 'treeList has no borders');
        this.instance.option('showRowLines', true);
        assert.ok(this.$element.find(Consts.GANTT_VIEW_HORIZONTAL_BORDER_SELECTOR).length > 0, 'ganttView has borders');
        assert.equal(this.instance._treeList.option('showRowLines'), true, 'treeList has borders');
    });
    test('editing', function(assert) {
        this.createInstance(options.allSourcesOptions);
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
        this.createInstance(options.tasksOnlyOptions);
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
        this.createInstance(options.tasksOnlyOptions);
        this.instance.option('columns', [{ dataField: 'id' }]);
        this.clock.tick();

        const columns = this.instance._treeList.getVisibleColumns();

        assert.strictEqual(columns.length, 1);
        assert.strictEqual(columns[0].calculateCellValue({ id: '54' }), '54', 'number');
        assert.strictEqual(columns[0].calculateCellValue({ id: '54a' }), '54a', 'pseudo guid');
    });
});
