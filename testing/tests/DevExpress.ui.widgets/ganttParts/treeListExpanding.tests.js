import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
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
    },
};

QUnit.module('Expand state T1105252', moduleConfig, () => {
    test('check state after task edit', function(assert) {
        const options = {
            tasks: { dataSource: tasks.slice() },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        this.instance.updateTask(1, { progress: tasks[0].progress + 1 });
        this.clock.tick(1000);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
    });
    test('check state after datasource update (T1125635)', function(assert) {
        const options = {
            tasks: { dataSource: tasks.slice() },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        this.instance.option('tasks', { dataSource: tasks.slice() });
        this.clock.tick(1000);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
    });
    test('check state after datasource update with 1 parent level (T1125635)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        this.instance.option('tasks', { dataSource: my_tasks.slice(0, my_tasks.length) });
        this.clock.tick(1000);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
    });
    test('check state after datasource update with changed task inside collapsed (T1151048)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        this.instance.option('tasks', { dataSource: my_tasks.slice(0, my_tasks.length - 1) });
        this.clock.tick(1000);

        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 3);
        assert.equal(this.instance._treeList.getVisibleRows().length, 3);
    });
    test('check state after datasource update with dynamically added tasks in source  (T1151048)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        my_tasks.push({ 'id': 5, 'parentId': 0, 'title': 'New task 1', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        my_tasks.push({ 'id': 6, 'parentId': 5, 'title': 'New task 2', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        my_tasks.push({ 'id': 7, 'parentId': 6, 'title': 'New task 3', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        this.instance.option('tasks', { dataSource: my_tasks });
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 4);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4);
    });
    test('check state after datasource update with dynamically added tasks in source without collapse  (T1151048)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 4);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4);
        this.clock.tick();
        my_tasks.push({ 'id': 5, 'parentId': 0, 'title': 'New task 1', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        my_tasks.push({ 'id': 6, 'parentId': 5, 'title': 'New task 2', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        my_tasks.push({ 'id': 7, 'parentId': 6, 'title': 'New task 3', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' });
        this.instance.option('tasks', { dataSource: my_tasks });
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 7);
        assert.equal(this.instance._treeList.getVisibleRows().length, 7);
    });
    test('check state after datasource update with dynamically added tasks in source and change hierarchy  (T1151048)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 4);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4);
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        const new_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 1, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 1, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 },
            { 'id': 5, 'parentId': 1, 'title': 'New task 1', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 6, 'parentId': 0, 'title': 'New task 2', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 7, 'parentId': 6, 'title': 'New task 3', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' }
        ];
        this.instance.option('tasks', { dataSource: new_tasks });
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 7);
        assert.equal(this.instance._treeList.getVisibleRows().length, 7);
    });
    test('check state after change task order in datasource (T1151048)', function(assert) {
        const my_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 3, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        const options = {
            tasks: { dataSource: my_tasks },
            editing: { enabled: true }
        };

        this.createInstance(options);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 4);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4);
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
        assert.equal(this.instance._treeList.getVisibleRows().length, 1);
        this.clock.tick();
        const new_tasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red' },
            { 'id': 3, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-26T09:00:00.000Z'), 'progress': 60 },
            { 'id': 2, 'parentId': 3, 'title': 'Determine project scope', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-02-21T09:00:00.000Z'), 'progress': 100 },
            { 'id': 4, 'parentId': 2, 'title': 'Secure project sponsorship', 'start': new Date('2019-02-21T10:00:00.000Z'), 'end': new Date('2019-02-22T09:00:00.000Z'), 'progress': 100 }
        ];
        this.instance.option('tasks', { dataSource: new_tasks });
        this.clock.tick(1000);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 4);
        assert.equal(this.instance._treeList.getVisibleRows().length, 4);
    });
});

