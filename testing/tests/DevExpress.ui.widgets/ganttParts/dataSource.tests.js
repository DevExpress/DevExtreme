import $ from 'jquery';
import 'ui/gantt';
import { options, data, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('DataSources', moduleConfig, () => {
    test('inserting', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const taskData = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New',
            progress: 0,
            parentId: '1'
        };
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(taskData);
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, taskData.title, 'new task title is right');
        assert.equal(createdTask.start, taskData.start, 'new task start is right');
        assert.equal(createdTask.end, taskData.end, 'new task end is right');
    });
    test('updating', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const updatedTaskId = 3;
        const dataToUpdate = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New'
        };
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), dataToUpdate);
        this.clock.tick(10);
        const updatedTask = data.tasks.filter((t) => t.id === updatedTaskId)[0];
        assert.equal(updatedTask.title, dataToUpdate.title, 'task title is updated');
        assert.equal(updatedTask.start, dataToUpdate.start, 'new task start is updated');
        assert.equal(updatedTask.end, dataToUpdate.end, 'new task end is updated');
    });
    test('removing', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 3);
        this.clock.tick(10);

        const removedTaskId = 3;
        const tasksCount = data.tasks.length;
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(removedTaskId.toString(), false);
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount - 1, 'tasks less');
        const removedTask = data.tasks.filter((t) => t.id === removedTaskId)[0];
        assert.equal(removedTask, undefined, 'task was removed');
        assert.equal(this.instance._treeList.getVisibleRows().length, tasksCount - 1, 'tree list row removed');
    });
    test('delayed loading', function(assert) {
        this.createInstance({
            tasks: { dataSource: [] },
            validation: { autoUpdateParentTasks: true }
        });
        this.clock.tick(10);

        this.instance.option('tasks.dataSource', data.tasks);
        this.clock.tick(10);
        assert.equal(this.instance._treeList.option('expandedRowKeys').length, 2, 'each task is loaded and expanded');
    });
    test('incorrect tasks data', function(assert) {
        const failTasks = [
            { 'id': 1, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 200, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 4, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 }
        ];
        this.createInstance({
            tasks: { dataSource: failTasks },
            validation: { autoUpdateParentTasks: true }
        });
        this.clock.tick(10);
        let keys = this.instance.getVisibleTaskKeys();
        assert.equal(keys.length, 3, 'incorrect keys filtered');
        assert.equal(keys[0], 1, 'correct key');
        assert.equal(keys[1], 2, 'correct key');
        assert.equal(keys[2], 3, 'correct key');

        this.instance.option('validation.autoUpdateParentTasks', false);
        this.clock.tick(10);
        keys = this.instance.getVisibleTaskKeys();
        assert.equal(keys.length, 3, 'incorrect keys filtered');
        assert.equal(keys[0], 1, 'correct key');
        assert.equal(keys[1], 2, 'correct key');
        assert.equal(keys[2], 3, 'correct key');
    });
    test('inserting - check treeList', function(assert) {
        const columns = [
            { dataField: 'title', caption: 'Subject' },
            { dataField: 'progress', caption: 'progress' },
            { dataField: 'end', caption: 'End Date' }
        ];
        this.createInstance(options.allSourcesOptions);
        this.instance.option('columns', columns);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        const taskData = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New',
            progress: 22,
            parentId: '1'
        };
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(taskData);
        this.clock.tick(10);
        const titleText = $(this.instance._treeList.getCellElement(data.tasks.length - 1, 0)).text();
        const progress = $(this.instance._treeList.getCellElement(data.tasks.length - 1, 1)).text();
        const endDate = new Date($(this.instance._treeList.getCellElement(data.tasks.length - 1, 2)).text());
        assert.equal(titleText, taskData.title, 'new task title is right');
        assert.equal(progress, taskData.progress, 'new task progress is right');
        assert.ok(endDate - taskData.end < 1, 'new task end is right');
    });
    test('updating - check treeList', function(assert) {
        const tasks = [
            { 'id': 1, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 }
        ];
        this.createInstance({
            tasks: { dataSource: tasks },
            editing: { enabled: true },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ]
        });
        this.clock.tick(10);

        const data = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New'
        };
        this.instance.updateTask(tasks[2].id, data);
        this.clock.tick(10);

        const titleText = $(this.instance._treeList.getCellElement(2, 0)).text();
        const startDate = new Date($(this.instance._treeList.getCellElement(2, 1)).text());
        const endDate = new Date($(this.instance._treeList.getCellElement(2, 2)).text());
        assert.equal(titleText, data.title, 'new task title is right');
        assert.ok(startDate - data.start < 1, 'new task start is right');
        assert.ok(endDate - data.end < 1, 'new task end is right');
    });
});
