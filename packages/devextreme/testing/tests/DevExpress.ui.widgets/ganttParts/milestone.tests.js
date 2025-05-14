import $ from 'jquery';
import 'ui/gantt';
import { Consts } from '../../../helpers/ganttHelpers.js';
const { test } = QUnit;

const moduleConfig = {
    _customTasks: [
        { 'id': 1, 'parentId': 0, 'title': 'Software Development', 'start': new Date('2019-02-21'), 'end': new Date('2019-03-26'), 'progress': 0 },
        { 'id': 2, 'parentId': 1, 'title': 'Milestone', 'start': new Date('2019-02-21'), 'end': new Date('2019-02-21'), 'progress': 0 },
    ],
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt({
                tasks: { dataSource: this._customTasks },
                ...settings
            }).dxGantt('instance');
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
        const options = { taskTitlePosition: 'outside' };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        const children = milestoneWrapper.children();
        assert.equal(children.length, 2, 'milestone wrapper has 2 children');
        assert.true(children.eq(0).hasClass(Consts.TASK_TITLE_SELECTOR), 'first child is task title');
        assert.true(children.eq(1).hasClass(Consts.MILESTONE_SELECTOR), 'second child is milestone');
    });

    test('custom template, default html', function(assert) {
        const customHtml = $(document.createElement('div'));
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                const title = $(item.taskHTML[0].cloneNode(true));
                const milestone = $(item.taskHTML[1].cloneNode(true));
                assert.true(title.hasClass(Consts.TASK_TITLE_SELECTOR), 'taskHTML has task title');
                assert.true(milestone.hasClass(Consts.MILESTONE_SELECTOR), 'taskHTML has milestone');
                assert.equal(item.taskHTML.length, 2, 'taskHTML has 2 children');

                title.appendTo(customHtml);
                milestone.appendTo(customHtml);
            }
            return item.taskHTML;
        };
        const options = { taskContentTemplate: customTaskFunction };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.children().length, 1, 'milestone wrapper has 1 child');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });

    test('custom template, custom html', function(assert) {
        const customHtml = $(document.createElement('div')).text('milestone');
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                return customHtml.text();
            }
            return item.taskHTML;
        };
        const options = { taskContentTemplate: customTaskFunction };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });

    test('custom template, custom html + task html', function(assert) {
        const customHtml = $(document.createElement('div')).text('milestone');
        const customTaskFunction = (item, container) => {
            if(item.isMilestone) {
                $(item.taskHTML[1].cloneNode(true)).appendTo(customHtml);
                return customHtml.html();
            }
            return item.taskHTML;
        };
        const options = { taskContentTemplate: customTaskFunction };
        this.createInstance(options);
        this.clock.tick(10);
        const milestoneWrapper = this.$element.find(Consts.MILESTONE_WRAPPER_SELECTOR);
        assert.equal(milestoneWrapper.length, 1, 'milestone wrapper exists');
        assert.equal(milestoneWrapper.html(), customHtml[0].outerHTML, 'milestone html matches custom html');
    });
});
