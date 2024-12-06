import $ from 'jquery';
import messageLocalization from 'common/core/localization/message';
import 'ui/gantt';
import { Consts, options, data, getGanttViewCore, showTaskEditDialog, getDependencyElements } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Client side edit events', moduleConfig, () => {
    test('task inserting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        this.instance.option('onTaskInserting', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(null);
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'new task was not created in ds');
    });
    test('task inserting - update args', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const newStart = new Date('2019-02-23');
        const newEnd = new Date('2019-02-24');
        const taskData = {
            start: '2019-02-21',
            end: '2019-02-22',
            title: 'New',
            progress: 0,
            parentId: '1'
        };
        this.instance.option('onTaskInserting', (e) => {
            e.values['title'] = 'My text';
            e.values['start'] = newStart;
            e.values['end'] = newEnd;
            e.values['color'] = 'red';
        });

        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(taskData);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, 'My text', 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');
        assert.equal(createdTask.color, 'red', 'new task color is right');
    });
    test('task inserted', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const text = 'My text';
        const newStart = new Date('2019-02-23');
        const newEnd = new Date('2019-02-24');
        const data = {
            start: newStart,
            end: newEnd,
            title: text,
            progress: 0,
            parentId: '1'
        };
        let values;
        let keyExists = false;
        this.instance.option('onTaskInserted', (e) => {
            values = e.values;
            keyExists = !!e.key;
        });
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(data);
        this.clock.tick(500);

        assert.ok(keyExists, 'key created');
        assert.equal(values['title'], text, 'new task title is right');
        assert.equal(values['start'], newStart, 'new task start is right');
        assert.equal(values['end'], newEnd, 'new task end is right');
    });
    test('inserting with custom field', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);

        const tasks = [ {
            Id: 1,
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        } ];
        const tasksMap = {
            dataSource: tasks,
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

        this.instance.option('onTaskInserting', (e) => {
            e.values['ItemName'] = 'new item text';
            e.values['CustomText'] = 'new custom text';
        });
        this.clock.tick(10);

        const data = {
            ParentId: 0,
            ItemName: 'custom text',
            CustomText: 'test',
            SprintStartDate: new Date('2019-02-11T05:00:00.000Z'),
            SprintEndDate: new Date('2019-02-14T05:00:00.000Z'),
            TaskColor: 'red',
            TaskProgress: 31
        };

        this.instance.insertTask(data);
        this.clock.tick(10);
        assert.equal(tasks[1].CustomText, 'new custom text', 'task cust field  is updated');
        assert.equal(tasks[1].ItemName, 'new item text', 'task cust field  is updated');
        assert.equal(tasks[1].TaskColor, 'red', 'task color field  is updated');
    });
    test('task deleting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        let values;
        let key;
        this.instance.option('onTaskDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        const taskToDelete = data.tasks[data.tasks.length - 1];
        this.instance.option('selectedRowKey', taskToDelete.id.toString());
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(taskToDelete.id.toString(), false);
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'new task was not deleted');
        assert.equal(values['parentId'], taskToDelete.parentId, 'check values parentId');
        assert.equal(values['title'], taskToDelete.title, 'check values title');
        assert.equal(values['start'], taskToDelete.start, 'check values start');
        assert.equal(values['end'], taskToDelete.end, 'check values end');
        assert.equal(key, taskToDelete.id, 'check key');
    });
    test('task deleted', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        let key;
        let values;
        this.instance.option('onTaskDeleted', (e) => {
            key = e.key;
            values = e.values;
        });
        const taskToDelete = data.tasks[data.tasks.length - 1];
        this.instance.option('selectedRowKey', taskToDelete.id.toString());
        getGanttViewCore(this.instance).commandManager.removeTaskCommand.execute(taskToDelete.id.toString(), false);
        this.clock.tick(500);
        assert.equal(values['parentId'], taskToDelete.parentId, 'check values parentId');
        assert.equal(values['title'], taskToDelete.title, 'check values title');
        assert.equal(values['start'], taskToDelete.start, 'check values start');
        assert.equal(values['end'], taskToDelete.end, 'check values end');
        assert.equal(key, taskToDelete.id, 'check key');
    });
    test('task updating - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const taskToUpdate = data.tasks[0];
        const dataToUpdate = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New'
        };

        this.instance.option('onTaskUpdating', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(taskToUpdate.id.toString(), dataToUpdate);
        this.clock.tick(10);
        assert.notEqual(taskToUpdate.title, dataToUpdate.title, 'task title is not updated');
        assert.notEqual(taskToUpdate.start, dataToUpdate.start, 'new task start is not updated');
        assert.notEqual(taskToUpdate.end, dataToUpdate.end, 'new task end is not updated');
    });
    test('task updating - change args', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const taskToUpdate = data.tasks[0];
        const newStart = new Date('2019-02-25');
        const newEnd = new Date('2019-02-26');
        const newTitle = 'New_2';

        const dataToUpdate = {
            start: new Date('2019-02-21'),
            end: new Date('2019-02-22'),
            title: 'New'
        };

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

        getGanttViewCore(this.instance).commandManager.updateTaskCommand.execute(taskToUpdate.id.toString(), dataToUpdate);
        assert.ok(keyIsDefined, 'key defined');

        this.clock.tick(10);
        assert.equal(taskToUpdate.title, newTitle, 'task title is updated');
        assert.equal(taskToUpdate.start, newStart, 'new task start is updated');
        assert.equal(taskToUpdate.end, newEnd, 'new task end is updated');
    });
    test('updating with custom field', function(assert) {
        this.createInstance(options.allSourcesOptions);
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
        this.clock.tick(10);

        const data = {
            CustomText: 'new',
            ItemName: 'new'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick(10);
        assert.equal(task.CustomText, 'new custom text', 'task cust field  is updated');
        assert.equal(task.ItemName, 'new item text', 'task cust field  is updated');
    });
    test('task updated', function(assert) {
        this.createInstance(options.allSourcesOptions);
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

        let values;
        this.instance.option('onTaskUpdated', (e) => { values = e.values; });
        this.clock.tick(10);

        const data = {
            CustomText: 'new',
            ItemName: 'new'
        };

        this.instance.updateTask(task.Id, data);
        this.clock.tick(10);
        assert.equal(data.CustomText, values.CustomText, 'task cust field  is updated');
        assert.equal(data.ItemName, values.ItemName, 'task cust field  is updated');
    });

    test('task dialog showing - cancel', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);

        this.instance.option('onTaskEditDialogShowing', (e) => { e.cancel = true; });

        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });
    test('task dialog showing - change editor values', function(assert) {
        this.createInstance(options.allSourcesOptions);
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

        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const $inputs = $dialog.find('.dx-texteditor-input');
        assert.equal($inputs.eq(0).val(), newTitle, 'title text is shown');
        assert.equal((new Date($inputs.eq(1).val())).getTime(), newStart.getTime(), 'start task text is shown');
        assert.equal((new Date($inputs.eq(2).val())).getTime(), newEnd.getTime(), 'end task text is shown');
        assert.equal($inputs.eq(3).val(), newProgress + '%', 'progress text is shown');
        assert.ok(keyIsDefined, 'key defined');
    });
    test('task dialog showing - disable fields', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);

        this.instance.option('onTaskEditDialogShowing', (e) => {
            e.readOnlyFields.push('title');
            e.readOnlyFields.push('start');
            e.readOnlyFields.push('end');
            e.readOnlyFields.push('progress');
        });

        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.attr('readOnly'), 'readonly', 'all inputs is readOnly');
    });
    test('task dialog showing - hide fields', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('selectedRowKey', 1);
        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        let inputs = $dialog.find('.dx-texteditor-input');
        const count = inputs.length;
        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        this.clock.tick(10);

        this.instance.option('onTaskEditDialogShowing', (e) => {
            e.hiddenFields.push('title');
            e.hiddenFields.push('start');
            e.hiddenFields.push('end');
            e.hiddenFields.push('progress');
        });
        this.clock.tick(10);
        showTaskEditDialog(this.instance);
        this.clock.tick(10);

        inputs = $dialog.find('.dx-texteditor-input');
        assert.equal(inputs.length, count - 4, 'all inputs is hidden');
    });

    test('dependency inserting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        const count = data.dependencies.length;
        this.instance.option('onDependencyInserting', (e) => { e.cancel = true; });
        getGanttViewCore(this.instance).commandManager.createDependencyCommand.execute('0', '1', '2');
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count, 'new dependency was not created');
    });
    test('dependency inserted', function(assert) {
        const dependenciesOptions = {
            tasks: {
                dataSource: [
                    { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
                    { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
                    { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
                ]
            },
            dependencies: { dataSource: [ { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 } ] }
        };

        this.createInstance(dependenciesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        let values;
        let key;
        this.instance.option('onDependencyInserted', (e) => {
            values = e.values;
            key = e.key;
        });

        const data = { 'predecessorId': 2, 'successorId': 3, 'type': 0 };
        this.instance.insertDependency(data);
        this.clock.tick(10);

        assert.ok(!!key, 'key created');
        assert.equal(values['predecessorId'], data['predecessorId'], 'new predecessorId is right');
        assert.equal(values['successorId'], data['successorId'], 'new successorId is right');
        assert.equal(values['type'], data['type'], 'new type is right');
    });
    test('dependency deleting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.dependencies.length;
        const dependencyToDelete = data.dependencies[count - 1];
        let values;
        let key;
        this.instance.option('onDependencyDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        getGanttViewCore(this.instance).commandManager.removeDependencyCommand.execute(dependencyToDelete.id.toString(), false);
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count, 'new dependency was not deleted');
        assert.equal(values['predecessorId'], dependencyToDelete.predecessorId, 'check values predecessorId');
        assert.equal(values['successorId'], dependencyToDelete.successorId, 'check values successorId');
        assert.equal(values['type'], dependencyToDelete.type, 'check values type');
        assert.equal(key, dependencyToDelete.id, 'check key');
    });
    test('dependency deleted', function(assert) {
        const dependenciesOptions = {
            tasks: {
                dataSource: [
                    { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
                    { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
                    { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
                ]
            },
            dependencies: { dataSource: [ { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 } ] }
        };

        this.createInstance(dependenciesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        let key;
        let values;
        this.instance.option('onDependencyDeleted', (e) => {
            key = e.key;
            values = e.values;
        });
        const dependencyToDelete = data.dependencies[0];
        this.instance.deleteDependency(dependencyToDelete.id);

        const $confirmDialog = $('body').find(Consts.POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(key, 0, 'key is right');
        assert.equal(values.predecessorId, dependencyToDelete.predecessorId, 'check values predecessorId');
        assert.equal(values.successorId, dependencyToDelete.successorId, 'check values successorId');
        assert.equal(values.type, dependencyToDelete.type, 'check values type');
    });
    test('resource inserting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.resources.length;
        this.instance.option('onResourceInserting', (e) => {
            e.cancel = true;
        });

        getGanttViewCore(this.instance).commandManager.createResourceCommand.execute('text');
        this.clock.tick(10);
        assert.equal(data.resources.length, count, 'new resource was not created');
    });
    test('resource inserting - update text', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.resources.length;
        this.instance.option('onResourceInserting', (e) => { e.values['text'] = 'My text'; });

        getGanttViewCore(this.instance).commandManager.createResourceCommand.execute('text');
        this.clock.tick(10);
        assert.equal(data.resources.length, count + 1, 'new resource was created');
        const newResource = data.resources[data.resources.length - 1];
        this.instance.option('onResourceAssigning', (e) => { });
        assert.equal(newResource.text, 'My text', 'new resource text is right');
    });
    test('resource deleting - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.resources.length;
        const resourceToDelete = data.resources[count - 1];
        let values;
        let key;
        this.instance.option('onResourceDeleting', (e) => {
            e.cancel = true;
            values = e.values;
            key = e.key;
        });
        getGanttViewCore(this.instance).commandManager.removeResourceCommand.execute(resourceToDelete.id.toString());
        this.clock.tick(10);
        assert.equal(data.resources.length, count, 'resource was not deleted');
        assert.equal(values['text'], resourceToDelete.text, 'check values text');
        assert.equal(key, resourceToDelete.id, 'check key');
    });
    test('resource assigning - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.resourceAssignments.length;
        this.instance.option('onResourceAssigning', (e) => { e.cancel = true; });

        getGanttViewCore(this.instance).commandManager.assignResourceCommand.execute('1', '2');
        this.clock.tick(10);
        assert.equal(data.resourceAssignments.length, count, 'new resource was not assigned');
    });
    test('resource un assigning - canceling', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const count = data.resourceAssignments.length;
        const toDelete = data.resourceAssignments[count - 1];
        this.instance.option('onResourceUnassigning', (e) => { e.cancel = true; });

        // eslint-disable-next-line spellcheck/spell-checker
        getGanttViewCore(this.instance).commandManager.deassignResourceCommand.execute(toDelete.id.toString());
        this.clock.tick(10);
        assert.equal(data.resourceAssignments.length, count, 'resource was not deassigned');
    });
    test('resource manager showing', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);
        this.instance.showResourceManagerDialog();
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        const expectedResourceTitleText = messageLocalization.format('dxGantt-dialogResourceManagerTitle');
        const popupTitleText = $dialog.find('.dx-popup-title').text();
        assert.equal(expectedResourceTitleText, popupTitleText, 'ResourceManager dialog is shown');
    });
    test('resource manager showing - cancel', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onResourceManagerDialogShowing', (e) => { e.cancel = true; });
        this.clock.tick(10);
        this.instance.showResourceManagerDialog();
        this.clock.tick(10);
        const $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 0, 'dialog is not shown');
    });
    test('updating with custom field shouldnt restore dependencies', function(assert) {
        const dependenciesOptions = {
            tasks: {
                dataSource: [
                    { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red', 'CustomText': 'c1' },
                    { 'id': 2, 'parentId': 0, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60, 'CustomText': 'c2' }
                ]
            },
            dependencies: { dataSource: [ { 'id': 0, 'predecessorId': 1, 'successorId': 2, 'type': 0 } ] }
        };

        this.createInstance(dependenciesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);

        this.instance.option('onTaskUpdating', (e) => {
            e.newValues['CustomText'] = 'new custom text';
        });
        this.clock.tick(10);

        const data = {
            title: 'new'
        };
        let dependencies = getDependencyElements(this.$element, 0);
        assert.equal(dependencies.length, 6);
        getGanttViewCore(this.instance).commandManager.removeDependencyCommand.execute('0', false);

        this.clock.tick(10);
        dependencies = getDependencyElements(this.$element, 0);
        assert.equal(dependencies.length, 0, 'dependency has been deleted');
        this.instance.updateTask('1', data);
        this.clock.tick(500);
        dependencies = getDependencyElements(this.$element, 0);
        assert.equal(dependencies.length, 0, 'dependency is still deleted');
    });
    test('update task with only custom field shouldnt restore dependencies', function(assert) {
        const dependenciesOptions = {
            tasks: {
                dataSource: [
                    { 'id': '1', 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red', 'CustomText': 'c1' },
                    { 'id': '2', 'parentId': 0, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60, 'CustomText': 'c2' }
                ]
            },
            dependencies: { dataSource: [ { 'id': '1', 'predecessorId': '1', 'successorId': '1', 'type': '0' } ] },
            validation: { autoUpdateParentTasks: true }
        };

        this.createInstance(dependenciesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('columns', [{ dataField: 'CustomText', caption: 'Task' }]);
        this.clock.tick(10);

        const data = {
            'CustomText': 'new'
        };
        let dependencies = getDependencyElements(this.$element, '1');
        assert.equal(dependencies.length, 6);
        getGanttViewCore(this.instance).commandManager.removeDependencyCommand.execute('1', false);

        this.clock.tick(10);
        dependencies = getDependencyElements(this.$element, '1');
        assert.equal(dependencies.length, 0, 'dependency has been deleted');
        this.instance.updateTask('1', data);
        this.clock.tick(500);
        dependencies = getDependencyElements(this.$element, '1');
        assert.equal(dependencies.length, 0, 'dependency is still deleted');
    });
    test('update task with only custom field should update treelist', function(assert) {
        const taskOptions = {
            tasks: {
                dataSource: [
                    { 'id': '1', 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red', 'CustomText': 'c1' },
                    { 'id': '2', 'parentId': 1, 'title': 'Scope', 'start': new Date('2020-02-21T05:00:00.000Z'), 'end': new Date('2020-02-26T09:00:00.000Z'), 'progress': 60, 'CustomText': 'c2' }
                ]
            },
            validation: { autoUpdateParentTasks: true },
            editing: { enabled: true },
            columns: [
                { dataField: 'CustomText', caption: 'Task' },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End' }
            ]
        };

        this.createInstance(taskOptions);
        this.clock.tick(10);
        const customText = 'new';
        const data = {
            'CustomText': customText
        };
        let treeListTaskCustomText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(0).text();
        const treeListDataSourceOld = this.instance._treeList.option('dataSource').store()._array;
        assert.equal(treeListTaskCustomText, 'c1');
        assert.equal(treeListDataSourceOld[0].CustomText, 'c1');

        this.instance.updateTask('1', data);
        this.clock.tick(500);
        treeListTaskCustomText = this.$element.find(Consts.TREELIST_DATA_ROW_SELECTOR).first().find('td').eq(0).text();
        const treeListDataSourceNew = this.instance._treeList.option('dataSource').store()._array;
        assert.equal(treeListTaskCustomText, customText);
        assert.equal(treeListDataSourceNew[0].CustomText, customText);
        assert.equal(treeListDataSourceOld[0].start, treeListDataSourceNew[0].start);
        assert.equal(treeListDataSourceOld[0].end, treeListDataSourceNew[0].end);
    });
    test('collapse all on TaskUpdated', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('onTaskUpdated', (e) => { e.component.collapseAll(); });
        this.clock.tick(10);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, data.tasks.length);
        this.instance.updateTask('1', { title: 'New' });
        this.clock.tick(500);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
    });
    test('collapse all on TaskUpdated in auto parent mode', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('validation.autoUpdateParentTasks', true);
        this.instance.option('onTaskUpdated', (e) => { e.component.collapseAll(); });
        this.clock.tick(10);

        assert.ok(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length > 5);
        assert.ok(this.instance._treeList.getVisibleRows().length, data.tasks.length > 5);
        this.instance.updateTask('2', { title: 'New' });
        this.clock.tick(500);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
    });
});
