import $ from 'jquery';
import 'ui/gantt';
import { Consts, data, options } from '../../../helpers/ganttHelpers.js';
import localization from 'localization';
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

QUnit.module('Markup', moduleConfig, () => {
    test('should render treeList', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        const treeListElements = this.$element.find(Consts.TREELIST_SELECTOR);
        assert.strictEqual(treeListElements.length, 1);
    });
    test('should render task wrapper for each task', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const elements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, data.tasks.length - 1);
    });
    test('should render dependencies', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const element = this.$element.find(Consts.TASK_ARROW_SELECTOR);
        assert.equal(element.length, data.dependencies.length);
    });
    test('should render resources', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const element = this.$element.find(Consts.TASK_RESOURCES_SELECTOR);
        assert.equal(element.length, data.resourceAssignments.length);
    });
    test('row heights', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const treeListRowElement = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).last().get(0);
        const ganttViewRowElement = this.$element.find(Consts.GANTT_VIEW_ROW_SELECTOR).get(0);
        assert.roughEqual(treeListRowElement.getBoundingClientRect().height, ganttViewRowElement.getBoundingClientRect().height, 0.01, 'row heights are equal');
    });
    test('auto height', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        const initHeight = this.$element.height();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.ok(initHeight > this.$element.height(), 'collapsed height');
    });
    test('fixed height', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('height', 800);
        this.clock.tick(10);
        const initHeight = this.$element.height();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.roughEqual(initHeight, this.$element.height(), 1, 'collapsed height');
    });
    test('invalid start or end dates', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope 0', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 1, 'title': 'Scope 1', 'start': null, 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 4, 'parentId': 2, 'title': 'Scope 2', 'start': new Date('2019-02-21'), 'end': null, 'progress': 50 },
            { 'id': 5, 'parentId': 2, 'title': 'Scope 3', 'start': null, 'end': null, 'progress': 25 }
        ];
        const customDependencies = [
            { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 },
            { 'id': 1, 'predecessorId': 2, 'successorId': 3, 'type': 0 },
            { 'id': 2, 'predecessorId': 3, 'successorId': 4, 'type': 0 }
        ];
        const options = {
            tasks: { dataSource: customTasks },
            dependencies: { dataSource: customDependencies }
        };
        this.createInstance(options);
        this.clock.tick(10);
        const treeListElements = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR);
        assert.strictEqual(treeListElements.length, 5);

        const taskElements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(taskElements.length, 2);

        const dependenciesElements = this.$element.find(Consts.TASK_ARROW_SELECTOR);
        assert.equal(dependenciesElements.length, 1);

        assert.equal(this.instance.getVisibleTaskKeys().length, 2, 'task keys');
        assert.equal(this.instance.getVisibleDependencyKeys().length, 1, 'dependencies keys');
    });
    test('add task to empty gantt - row height', function(assert) {
        const testTasks = [];
        this.createInstance({
            tasks: { dataSource: testTasks }
        });
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        const data = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New',
            progress: 0,
            parentId: '0'
        };

        this.instance.insertTask(data);
        this.clock.tick(10);
        $('.dx-gantt .dx-row').css({ height: '63px' });
        this.instance._sizeHelper.updateGanttRowHeights();
        assert.equal(testTasks.length, 1, 'first new task was created in ds');
        let rowHeight = this.instance._getGanttViewOption('rowHeight');
        let treeListRowElement = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).last().get(0);
        let treeListRowElementHeight = treeListRowElement.getBoundingClientRect().height;
        assert.roughEqual(treeListRowElementHeight, rowHeight, 1.1, 'row heights are equal');
        this.instance.insertTask(data);
        this.clock.tick(10);
        $('.dx-gantt .dx-row').css({ height: '63px' });
        this.instance._sizeHelper.updateGanttRowHeights();
        this.clock.tick(10);
        assert.equal(testTasks.length, 2, 'second new task was created in ds');
        rowHeight = this.instance._getGanttViewOption('rowHeight');
        treeListRowElement = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).last().get(0);
        treeListRowElementHeight = treeListRowElement.getBoundingClientRect().height;
        assert.roughEqual(treeListRowElementHeight, rowHeight, 0.1, 'row heights are equal');
    });
    test('new added task should be selected', function(assert) {
        const testTasks = [{
            id: 1,
            start: new Date('2021-04-21'),
            end: new Date('2021-04-22'),
            title: 'New',
            progress: 0,
            parentId: '0'
        },
        {
            id: 2,
            start: new Date('2021-04-21'),
            end: new Date('2021-04-22'),
            title: 'New',
            progress: 0,
            parentId: '0'
        }];
        this.createInstance({
            tasks: { dataSource: testTasks }
        });
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        const data = {
            start: new Date('2021-04-21'),
            end: new Date('2021-04-22'),
            title: 'New',
            progress: 0,
            parentId: '0'
        };

        this.instance.insertTask(data);
        this.clock.tick(10);
        assert.equal(testTasks.length, 3, 'first new task was created in ds');
        let selectedTask = this.$element.find(Consts.TASK_SELECTED_SELECTOR);
        let selectedTaskIndex = selectedTask.eq(0).attr('task-index');
        assert.equal(selectedTaskIndex, 2, 'first new added task is selected');
        this.instance.insertTask(data);
        this.clock.tick(10);
        selectedTask = this.$element.find(Consts.TASK_SELECTED_SELECTOR);
        selectedTaskIndex = selectedTask.eq(0).attr('task-index');
        assert.equal(selectedTaskIndex, 3, 'second new added task is selected');

    });
    test('24 format check (T1130809)', function(assert) {
        localization.locale('fr');
        const my_options = {
            tasks: { dataSource: data.tasks },
            scaleType: 'hours',
            onScaleCellPrepared: (e) => {
                const scaleElement = $(e.scaleElement);
                if(e.scaleIndex === 0) {
                    assert.equal(!!scaleElement.text().match(/am|pm/i), false, 'correct format');
                }
            }
        };
        this.createInstance(my_options);
        this.clock.tick(10);
    });
    test('12 format check (T1130809)', function(assert) {
        localization.locale('en-US');
        const my_options = {
            tasks: { dataSource: data.tasks },
            scaleType: 'hours',
            onScaleCellPrepared: (e) => {
                const scaleElement = $(e.scaleElement);
                if(e.scaleIndex === 0) {
                    assert.equal(!!scaleElement.text().match(/am|pm/i), true, 'correct format');
                }
            }
        };
        this.createInstance(my_options);
        this.clock.tick(10);
    });
});
