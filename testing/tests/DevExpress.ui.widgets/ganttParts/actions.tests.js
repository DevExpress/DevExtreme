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

QUnit.module('Actions', moduleConfig, () => {
    test('expand', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
    });
    test('collapse', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });
    test('expand/collapse All', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        this.instance._collapseAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);

        this.clock.tick(10);
        this.instance._expandAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });
    test('collapse and expand after inserting', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        const taskData = {
            start: newStart,
            end: newEnd,
            title: newTitle,
            progress: 0,
            parentId: '2'
        };
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(taskData);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });

    test('collapse and expand after inserting in auto update mode', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('validation.autoUpdateParentTasks', true);
        this.clock.tick(10);

        const tasksCount = data.tasks.length;
        const newStart = new Date('2019-02-21');
        const newEnd = new Date('2019-02-22');
        const newTitle = 'New';
        const taskData = {
            start: newStart,
            end: newEnd,
            title: newTitle,
            progress: 0,
            parentId: '2'
        };
        getGanttViewCore(this.instance).commandManager.createTaskCommand.execute(taskData);
        this.clock.tick(10);

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });

    test('collapse and check state after validation option changed (T997932)', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick(10);

        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        this.instance.option('validation.autoUpdateParentTasks', true);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        let $parentTasks = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.ok($parentTasks.length > 0, 'parent tasks has className');

        this.instance.option('validation.autoUpdateParentTasks', false);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        $parentTasks = this.$element.find(Consts.PARENT_TASK_SELECTOR);
        assert.strictEqual($parentTasks.length, 0, 'not parent tasks');
    });

    test('move splitter', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);

        const splitterWrapper = this.$element.find(Consts.SPLITTER_WRAPPER_SELECTOR);
        const splitter = this.$element.find(Consts.SPLITTER_SELECTOR);

        const treeListWrapperElement = this.$element.find(Consts.TREELIST_WRAPPER_SELECTOR);
        const treeListWrapperLeftOffset = treeListWrapperElement.offset().left;
        const treeListWrapperTopOffset = treeListWrapperElement.offset().top;

        const ganttView = this.$element.find(Consts.GANTT_VIEW_SELECTOR);

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
    test('splitter should resize panels with 2 gantts (T1091934)', function(assert) {
        this.createInstance(options.allSourcesOptions);
        const $element2 = $('<div>').attr('id', 'gantt2').appendTo('#qunit-fixture');
        const instance2 = $element2.dxGantt().dxGantt('instance');
        this.clock.tick(10);

        [this.$element, $element2].forEach(($element, index) => {
            const splitterWrapper = $element.find(Consts.SPLITTER_WRAPPER_SELECTOR);
            const splitter = $element.find(Consts.SPLITTER_SELECTOR);

            const treeListWrapperElement = $element.find(Consts.TREELIST_WRAPPER_SELECTOR);
            const treeListWrapperLeftOffset = treeListWrapperElement.offset().left;
            const treeListWrapperTopOffset = treeListWrapperElement.offset().top;

            const ganttView = $element.find(Consts.GANTT_VIEW_SELECTOR);

            const splitterContainerWrapperWidth = $(treeListWrapperElement).parent().width();

            assert.ok(splitterWrapper, `Splitter ${index} wrapper has been found`);
            assert.ok(splitter, `Splitter ${index} has been found`);

            splitter.trigger($.Event('dxpointerdown', { pointerType: 'mouse' }));
            splitter.trigger($.Event('dxpointermove', {
                pointerType: 'mouse',
                pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 100,
                pageY: treeListWrapperTopOffset + 100 }));
            splitter.trigger($.Event('dxpointerup', { pointerType: 'mouse' }));

            assert.equal(treeListWrapperElement.width(), 100);
            assert.equal(ganttView.width(), splitterContainerWrapperWidth - 100);
            assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 100, `Splitter ${index} has been moved by mouse`);

            splitter.trigger($.Event('dxpointerdown', { pointerType: 'touch' }));
            splitter.trigger($.Event('dxpointermove', {
                pointerType: 'touch',
                pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) + 300,
                pageY: treeListWrapperTopOffset + 100 }));
            splitter.trigger($.Event('dxpointerup', { pointerType: 'touch' }));

            assert.equal(treeListWrapperElement.width(), 300);
            assert.equal(ganttView.width(), splitterContainerWrapperWidth - 300);
            assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 300, `Splitter ${index} has been moved by touch`);

            splitter.trigger($.Event('dxpointerdown'));
            splitter.trigger($.Event('dxpointermove', {
                pageX: treeListWrapperLeftOffset - parseFloat(splitter.css('margin-left')) - 10,
                pageY: treeListWrapperTopOffset + 100 }));
            splitter.trigger($.Event('dxpointerup'));

            assert.equal(treeListWrapperElement.width(), 0);
            assert.equal(ganttView.width(), splitterContainerWrapperWidth);
            assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), 0, `Splitter ${index} has not cross the left side`);

            splitter.trigger($.Event('dxpointerdown'));
            splitter.trigger($.Event('dxpointermove', {
                pageX: splitterContainerWrapperWidth - parseFloat(splitter.css('margin-left')) + 10,
                pageY: treeListWrapperTopOffset + 100 }));
            splitter.trigger($.Event('dxpointerup'));

            assert.equal(treeListWrapperElement.width(), splitterContainerWrapperWidth - splitter.width());
            assert.equal(ganttView.width(), splitter.width());
            assert.equal(parseFloat(splitterWrapper.css('left')) + parseFloat(splitter.css('margin-left')), splitterContainerWrapperWidth - splitter.width(), `Splitter ${index} has not cross the right side`);
        });

        instance2.dispose();
        $element2.remove();
    });
    test('expand api', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        this.clock.tick(10);
        this.instance.collapseAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);

        this.clock.tick(10);
        this.instance.expandAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);

        this.instance.expandAllToLevel(1);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        this.instance.expandToTask(7);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);

        this.instance.expandToTask(2);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        this.instance.expandTask(2);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);

        this.instance.collapseTask(2);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
    });
    test('showResources()', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, data.resourceAssignments.length);
        this.instance.showResources(false);
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, 0);
        this.instance.showResources(true);
        assert.equal(this.$element.find(Consts.TASK_RESOURCES_SELECTOR).length, data.resourceAssignments.length);
    });
    test('showDependencies()', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_ARROW_SELECTOR).length, data.dependencies.length);
        this.instance.showDependencies(false);
        assert.equal(this.$element.find(Consts.TASK_ARROW_SELECTOR).length, 0);
        this.instance.showDependencies(true);
        assert.equal(this.$element.find(Consts.TASK_ARROW_SELECTOR).length, data.dependencies.length);
    });

    test('collapse and check state after custom field updating', function(assert) {
        const taskOptions = {
            tasks: {
                dataSource: [
                    { 'id': '1', 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21T05:00:00.000Z'), 'end': new Date('2019-07-04T12:00:00.000Z'), 'progress': 31, 'color': 'red', 'CustomText': 'c1' },
                    { 'id': '2', 'parentId': 1, 'title': 'Scope', 'start': new Date('2020-02-21T05:00:00.000Z'), 'end': new Date('2020-02-26T09:00:00.000Z'), 'progress': 60, 'CustomText': 'c2' }
                ]
            },
            validation: { autoUpdateParentTasks: false },
            editing: { enabled: true },
            columns: [
                { dataField: 'CustomText', caption: 'Task', visible: false },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End' }
            ]
        };

        this.createInstance(taskOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        this.instance._collapseAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);

        const customText = 'new';
        const data = {
            'CustomText': customText
        };

        this.instance.updateTask('1', data);
        this.clock.tick(500);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
    });

    test('collapse and check state after custom field updating (autoUpdateParentTasks=true)', function(assert) {
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
                { dataField: 'CustomText', caption: 'Task', visible: false },
                { dataField: 'start', caption: 'Start' },
                { dataField: 'end', caption: 'End' }
            ]
        };

        this.createInstance(taskOptions);
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);
        this.instance._collapseAll();
        this.clock.tick(10);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);

        const customText = 'new';
        const data = {
            'CustomText': customText
        };

        this.instance.updateTask('1', data);
        this.clock.tick(500);
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
    });
});
