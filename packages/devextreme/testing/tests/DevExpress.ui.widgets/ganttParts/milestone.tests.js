import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
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

QUnit.module('Milestone', moduleConfig, () => {
    test('default', function(assert) {
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Milestone', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-21'), 'progress': 0 },
        ];
        const options = { tasks: { dataSource: customTasks }, taskTitlePosition: 'outside' };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.children().length, 2, 'milestone wrapper has 2 children');
        const hasTitle = milestoneWrapper.children(Consts.TASK_TITLE_SELECTOR).length > 0;
        const hasMilestone = milestoneWrapper.children(Consts.MILESTONE_SELECTOR).length > 0;
        assert.true(hasTitle, 'milestone wrapper has task title');
        assert.true(hasMilestone, 'milestone wrapper has milestone');
    });

    test('custom template, default html', function(assert) {
        const customHtml = $(document.createElement('div'));
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Milestone', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-21'), 'progress': 0 },
        ];
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                const title = $(item.taskHTML[0].cloneNode(true));
                const milestone = $(item.taskHTML[1].cloneNode(true));
                assert.true(title.hasClass(Consts.TASK_TITLE_SELECTOR.slice(1)), 'taskHTML has task title');
                assert.true(milestone.hasClass(Consts.MILESTONE_SELECTOR.slice(1)), 'taskHTML has milestone');
                assert.equal(item.taskHTML.length, 2, 'taskHTML has 2 children');

                title.appendTo(customHtml);
                milestone.appendTo(customHtml);
            }
            return item.taskHTML;
        };
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.children().length, 1, 'milestone wrapper has 1 child');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });

    test('custom template, custom html', function(assert) {
        const customHtml = $(document.createElement('div')).text('milestone');
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Milestone', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-21'), 'progress': 0 },
        ];
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                return customHtml.text();
            }
            return item.taskHTML;
        };
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });

    test('custom template, custom html + task html', function(assert) {
        const customHtml = $(document.createElement('div')).text('milestone');
        const customTasks = [
            { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
            { 'id': 2, 'parentId': 1, 'title': 'Milestone', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-21'), 'progress': 0 },
        ];
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                $(item.taskHTML[1].cloneNode(true)).appendTo(customHtml);
                return customHtml.html();
            }
            return item.taskHTML;
        };
        const options = {
            tasks: { dataSource: customTasks },
            taskContentTemplate: customTaskFunction
        };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });
});
