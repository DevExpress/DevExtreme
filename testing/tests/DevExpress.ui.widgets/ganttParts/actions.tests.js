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
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).first();
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 1);
    });
    test('collapse', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });
    test('collapse and expand after inserting', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.clock.tick();

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
        this.clock.tick();

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });

    test('collapse and expand after inserting in auto update mode', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.instance.option('editing.enabled', true);
        this.instance.option('validation.autoUpdateParentTasks', true);
        this.clock.tick();

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
        this.clock.tick();

        assert.equal(data.tasks.length, tasksCount + 1, 'new task was created in ds');
        const createdTask = data.tasks[data.tasks.length - 1];
        assert.equal(createdTask.title, newTitle, 'new task title is right');
        assert.equal(createdTask.start, newStart, 'new task start is right');
        assert.equal(createdTask.end, newEnd, 'new task end is right');

        const expandedElement = this.$element.find(Consts.TREELIST_EXPANDED_SELECTOR).eq(1);
        expandedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, 2);

        const collapsedElement = this.$element.find(Consts.TREELIST_COLLAPSED_SELECTOR).first();
        collapsedElement.trigger('dxclick');
        this.clock.tick();
        assert.equal(this.$element.find(Consts.TASK_WRAPPER_SELECTOR).length, data.tasks.length - 1);
    });

    test('move splitter', function(assert) {
        this.createInstance(options.allSourcesOptions);
        this.clock.tick();

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
});
