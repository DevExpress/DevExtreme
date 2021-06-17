import $ from 'jquery';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';
import 'ui/gantt';
import { getGanttViewCore } from '../../../helpers/ganttHelpers.js';
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
        this.clock.tick();

        const updatedTaskId = 3;
        const updatedStart = new Date('2019-02-21');
        getGanttViewCore(this.instance).commandManager.changeTaskStartCommand.execute(updatedTaskId.toString(), updatedStart);
        this.instance._ganttTreeList.updateDataSource();
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
        this.instance._ganttTreeList.updateDataSource();
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
        this.instance._ganttTreeList.updateDataSource();
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
        this.instance._ganttTreeList.updateDataSource();
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
        this.instance._ganttTreeList.updateDataSource();
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
        this.instance._ganttTreeList.updateDataSource();
        this.clock.tick();

        const updatedTask = tasks.filter((t) => t.my_id === updatedTaskId)[0];
        assert.equal(updatedTask.start, updatedStart, 'new task start is updated');
    });
});
