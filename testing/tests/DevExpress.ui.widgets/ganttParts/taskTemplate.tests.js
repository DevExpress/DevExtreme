import $ from 'jquery';
import 'ui/gantt';
import { Consts, options, data } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Task Template', moduleConfig, () => {
    test('common', function(assert) {
        this.createInstance(options.tasksOnlyOptions);
        this.clock.tick();
        const taskText = this.$element.find(Consts.TASK_SELECTOR)[0].textContent;
        const taskTitle = data.tasks[0].title;
        assert.equal(taskText.indexOf(taskTitle), 0, 'Default task works correctly');
    });
    test('custom text', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];

        const customTaskText = 'TestTaskText';
        const customTaskFunction = (item, container) => {
            return customTaskText;
        };
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick();
        const elements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        assert.equal(elements.length, customTasks.length, 'Should render task wrapper for each task');
        this.clock.tick();
        const taskText = this.$element.find(Consts.TASK_WRAPPER_SELECTOR).first().text();
        assert.equal(taskText, customTaskText, 'Custom task text works correctly');
    });
    test('custom jQuery', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const customTaskText = 'TestCustomTooltipJQuery';
        const customTaskFunction = $('<div>' + customTaskText + '</div>');
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick();
        const taskText = this.$element.find(Consts.TASK_WRAPPER_SELECTOR).first().text();
        assert.equal(taskText, customTaskText, 'Custom template with jQuery works correctly');
    });
    test('check default settings', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-23'), 'progress': 0 },
            { 'id': 3, 'parentId': 2, 'title': 'Determine project scope', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 },
            { 'id': 4, 'parentId': 2, 'title': 'Project scope 1', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-26'), 'progress': 50 }
        ];
        const customTaskText = 'TestTaskText';
        const customTaskFunction = (item, container) => {
            assert.ok(item.taskData, 'item.taskData');
            assert.ok(item.cellSize, 'item.cellSize');
            assert.ok(item.taskHTML, 'item.taskHTML');
            assert.ok(item.taskPosition, 'item.taskPosition');
            assert.ok(item.taskSize, 'item.taskSize');
            assert.notOk(item.isMilestone, 'item.isMilestone');
            assert.ok(item.taskResources, 'item.taskResources');
            if(item.taskData.id === 3 || item.taskData.id === 4) {
                return;
            }
            return customTaskText;
        };
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick();
        const taskWrapperElements = this.$element.find(Consts.TASK_WRAPPER_SELECTOR);
        const taskText = taskWrapperElements[1].textContent;
        assert.equal(taskText, customTaskText, 'Custom task text works correctly');
        assert.equal(this.instance.getVisibleTaskKeys().length, 2, 'task keys');
    });
});
