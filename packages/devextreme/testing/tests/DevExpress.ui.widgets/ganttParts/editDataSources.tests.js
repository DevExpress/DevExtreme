import $ from 'jquery';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import ArrayStore from 'common/data/array_store';
import 'ui/gantt';
import { Consts, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

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
        this.clock.tick(10);

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { start: updatedStart });
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick(10);

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
    test('remove task when filtering (T1015311)', function(assert) {
        const tasks = [
            { 'id': 1, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 3, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 4, 'title': 'Define preliminary resources', 'start': new Date('2019-02-22T10:00:00.000Z'), 'end': new Date('2019-02-25T09:00:00.000Z'), 'progress': 60 }
        ];
        const tasksDataSource = new DataSource({
            store: new ArrayStore({
                data: tasks,
                key: 'id'
            }),
            paginate: false,
            filter: ['id', '<', 5]
        });
        this.createInstance({
            tasks: { dataSource: tasksDataSource },
            editing: { enabled: true }
        });
        this.clock.tick(10);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4, 'tasks filtered');
        this.instance.deleteTask('4');
        this.clock.tick(10);
        assert.equal(this.instance._treeList.getVisibleRows().length, 3, 'tasks removed');
    });
    test('check render for ds with delay T1024748', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progress': 50 }
        ];
        const ds = new CustomStore({
            key: 'id',
            load: function(loadOptions) {
                const d = $.Deferred();
                setTimeout(() => {
                    d.resolve(tasks);
                }, 100);
                return d.promise();
            },
        });

        const options = {
            tasks: {
                dataSource: ds
            },
            columns: [
                { dataField: 'title', caption: 'Subject' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End Date' }
            ],
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true }
        };
        this.createInstance(options);
        this.clock.tick(300);

        const titleText = $(this.instance._treeList.getCellElement(0, 0)).text();
        assert.equal(titleText, tasks[0].title, 'title cell text is right');

        this.clock.tick(200);
        const taskText = this.$element.find(Consts.TASK_WRAPPER_SELECTOR).first().text();
        assert.equal(taskText, tasks[0].title, 'Custom task text works correctly');
    });
    test('insert and update task with func field setter (T1163857)', function(assert) {
        const start = new Date('2019-02-19');
        const end = new Date('2019-02-26');

        const tasks = [
            { 'my_id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-22'), 'progressFake': 0 },
            { 'my_id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-20'), 'end': new Date('2019-02-20'), 'progressFake': 0 },
            { 'my_id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': start, 'end': end, 'progressFake': 50 }
        ];

        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks,
                progressExpr: (data, value) => {
                    if(value) {
                        data.progressFake = value;
                    } else {
                        return data.progressFake;
                    }
                }
            },
            editing: { enabled: true },
        };
        this.createInstance(options);
        this.clock.tick(10);

        const updatedTaskId = 3;
        let updatedProgress = 23;
        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(updatedTaskId.toString(), { progress: updatedProgress });
        this.clock.tick(10);

        let updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.progressFake, updatedProgress, 'task progress is updated');

        updatedProgress = 69;
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute({ progress: updatedProgress });
        updatedTask = tasks[tasks.length - 1];
        assert.equal(tasks.length, 4, 'new task is inserted');
        assert.equal(updatedTask.progressFake, updatedProgress, 'new task progress is updated');
    });
});
