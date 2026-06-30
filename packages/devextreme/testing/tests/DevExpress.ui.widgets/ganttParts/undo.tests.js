import $ from 'jquery';
import 'ui/gantt';
import { Consts, getGanttViewCore } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

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

let data;
let options;

const moduleConfig = {
    beforeEach: function() {
        data = {
            tasks: tasks.slice(),
            dependencies: dependencies.slice(),
            resources: resources.slice(),
            resourceAssignments: resourceAssignments.slice()
        };
        options = {
            tasks: { dataSource: data.tasks },
            dependencies: { dataSource: data.dependencies },
            resources: { dataSource: data.resources },
            resourceAssignments: { dataSource: data.resourceAssignments },
            toolbar: { items: [ 'undo', 'redo' ] },
            editing: { enabled: true }
        };

        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    },
    fireRedo: function() {
        getGanttViewCore(this.instance).commandManager.commands[7].execute();
    }
};

QUnit.module('Undo tests (T1099868)', moduleConfig, () => {
    test('task insert', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const taskData = {
            title: 'My text',
            start: new Date('2019-02-23'),
            end: new Date('2019-02-23'),
            parentId: 2
        };

        const tasksCount = data.tasks.length;
        this.instance.insertTask(taskData);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        assert.equal($items.length, 2, 'All items were rendered');
        assert.equal($items.last().children().children().attr('aria-label'), 'dx-gantt-i dx-gantt-i-redo', 'Last button is redo button');

        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'new task removed');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount + 1, 'new task restored');
    });
    test('task delete', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const taskToDelete = data.tasks[tasksCount - 1];
        this.instance.deleteTask(taskToDelete.id);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount - 1, 'new task was deleted');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'task restored');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount - 1, 'task restored');
    });
    test('insertDependency', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const count = data.dependencies.length;
        const dependencyData = { 'predecessorId': 2, 'successorId': 4, 'type': 0 };
        this.instance.insertDependency(dependencyData);
        this.clock.tick(10);

        assert.equal(data.dependencies.length, count + 1, 'new dependency was  created');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count, 'dependency removed');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count + 1, 'dependency restored');
    });
    test('deleteDependency', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const count = data.dependencies.length;
        const dependencyToDelete = data.dependencies[count - 1];
        this.instance.deleteDependency(dependencyToDelete.id);
        this.clock.tick(10);

        const $confirmDialog = $('body').find(Consts.POPUP_SELECTOR);
        const $yesButton = $confirmDialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $yesButton.trigger('dxclick');
        this.clock.tick(10);

        assert.equal(data.dependencies.length, count - 1, 'new dependency was deleted');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count, 'dependency restored');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.dependencies.length, count - 1, 'dependency removed');
    });
    test('deleteResource + unassign', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const count = data.resources.length;
        const resourceToDelete = data.resources[1];
        const assignmentCount = data.resourceAssignments.length;
        const assignmentToDelete = data.resourceAssignments.filter(a => a.resourceId === resourceToDelete.id).length;
        this.instance.deleteResource(resourceToDelete.id);
        this.clock.tick(10);

        assert.equal(data.resources.length, count - 1, 'resources was deleted');
        assert.equal(data.resourceAssignments.length, assignmentCount - assignmentToDelete, 'resources was unassigned');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.resources.length, count, 'resource restored');
        assert.equal(data.resourceAssignments.length, assignmentCount, 'assignments restored');
        assert.equal(data.resources[data.resources.length - 1].id, data.resourceAssignments[data.resourceAssignments.length - 1].resourceId, 'checl restored key');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.resources.length, count - 1, 'resources was deleted');
        assert.equal(data.resourceAssignments.length, assignmentCount - assignmentToDelete, 'resources was unassigned');
    });
    test('task delete with relations', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const taskToDelete = data.tasks[5];
        const dependencyCount = data.dependencies.length;
        const assignmentCount = data.resourceAssignments.length;
        const assignmentToDelete = data.resourceAssignments.filter(a => a.taskId === taskToDelete.id).length;
        const dependenciesToDelete = data.dependencies.filter(d => d.predecessorId === taskToDelete.id || d.successorId === taskToDelete.id).length;

        this.instance.deleteTask(taskToDelete.id);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount - 1, 'new task was deleted');
        assert.equal(data.resourceAssignments.length, assignmentCount - assignmentToDelete, 'tasks was unassigned');
        assert.equal(data.dependencies.length, dependencyCount - dependenciesToDelete, 'dependency deleted');
        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'task restored');
        assert.equal(data.resourceAssignments.length, assignmentCount, 'assignments restored');
        assert.equal(data.dependencies.length, dependencyCount, 'dependency restored');
        assert.equal(data.tasks[data.tasks.length - 1].id, data.resourceAssignments[data.resourceAssignments.length - 1].taskId, 'check assignment restored key');
        assert.equal(data.tasks[data.tasks.length - 1].id, data.dependencies[data.dependencies.length - 1].successorId, 'check dependency restored task key');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount - 1, 'new task was deleted');
        assert.equal(data.resourceAssignments.length, assignmentCount - assignmentToDelete, 'tasks was unassigned');
        assert.equal(data.dependencies.length, dependencyCount - dependenciesToDelete, 'dependency deleted');
    });

    test('task delete with relations and children', function(assert) {
        this.createInstance(options);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const taskToDelete = data.tasks[1];
        const oldTasks = data.tasks.slice();
        const dependencyCount = data.dependencies.length;
        const assignmentCount = data.resourceAssignments.length;

        this.instance.deleteTask(taskToDelete.id);
        this.clock.tick(10);

        assert.equal(data.tasks.length, 1, 'task deleted with children');
        assert.ok(data.resourceAssignments.length < assignmentCount, 'tasks was unassigned');
        assert.ok(data.dependencies.length < dependencyCount, 'dependency deleted');

        const $items = this.$element.find(Consts.TOOLBAR_ITEM_SELECTOR);
        const $undo = $items.first();
        $undo.children().first().trigger('dxclick');
        this.clock.tick(10);
        assert.equal(data.tasks.length, tasksCount, 'tasks restored');
        assert.equal(data.resourceAssignments.length, assignmentCount, 'assignments restored');
        assert.equal(data.dependencies.length, dependencyCount, 'dependency restored');
        assert.equal(data.tasks[1].title, oldTasks[1].title, 'check data');
        assert.equal(data.tasks[2].title, oldTasks[2].title, 'check data');
        assert.equal(data.tasks[3].title, oldTasks[3].title, 'check data');
        assert.notEqual(data.tasks[1].id, oldTasks[1].id, 'check key');

        this.fireRedo();
        this.clock.tick(10);
        assert.equal(data.tasks.length, 1, 'task deleted with children');
        assert.ok(data.resourceAssignments.length < assignmentCount, 'tasks was unassigned');
        assert.ok(data.dependencies.length < dependencyCount, 'dependency deleted');
    });
});

