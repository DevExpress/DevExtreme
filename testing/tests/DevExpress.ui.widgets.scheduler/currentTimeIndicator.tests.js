import $ from 'jquery';
import SchedulerResourcesManager from 'ui/scheduler/ui.scheduler.resource_manager';
import resizeCallbacks from 'core/utils/resize_callbacks';

const SCHEDULER_DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';
const SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const SCHEDULER_DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';
const SCHEDULER_DATE_TIME_INDICATOR_CLASS = 'dx-scheduler-date-time-indicator';

import 'common.css!';
import 'generic_light.css!';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_day';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_work_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_month';

QUnit.testStart(function() {
    $('#qunit-fixture').html('</div><div id="scheduler-work-space-rtl"></div><div id="scheduler-work-space">');
});

const stubInvokeMethod = function(instance, options) {
    options = options || {};
    sinon.stub(instance, 'invoke', function() {
        const subscribe = arguments[0];
        if(subscribe === 'createResourcesTree') {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === 'getResourceTreeLeaves') {
            const resources = instance.resources || [{ field: 'one', dataSource: [{ id: 1 }, { id: 2 }] }];
            return new SchedulerResourcesManager(resources).getResourceTreeLeaves(arguments[1], arguments[2]);
        }
    });
};

(function() {
    QUnit.module('DateTime indicator on Day View', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceDay('instance');
            stubInvokeMethod(this.instance);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should be wrapped by scrollable, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });
        const $element = this.instance.$element();

        assert.ok($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).parent().hasClass('dx-scrollable-content'), 'Scrollable contains time indicator');
    });

    QUnit.test('Indication should be updated by some timer', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorUpdateInterval: 20
        });

        const timer = setTimeout(function() {
            assert.ok(renderIndicatorStub.calledTwice, 'Indicator was updated');
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test('Indication should not be updated by some timer if indicatorUpdateInterval = 0', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorUpdateInterval: 0
        });

        const timer = setTimeout(function() {
            assert.equal(renderIndicatorStub.callCount, 0, 'Indicator wasn\'t updated');
        }, 40);

        this.clock.tick(40);
        clearTimeout(timer);
    });

    QUnit.test('Indication should be updated on dimensionChanged', function(assert) {
        const renderIndicatorStub = sinon.stub(this.instance, '_renderDateTimeIndication');

        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        resizeCallbacks.fire();

        assert.ok(renderIndicatorStub.calledTwice, 'Indicator was updated');
    });

    QUnit.test('DateTimeIndicator should not be renderd after currentDate changing, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');

        this.instance.option('currentDate', new Date(2017, 8, 6));

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should not be renderd if indicatorTime < startDayHour, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 10, 45),
            startDayHour: 11,
            intervalCount: 3
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');

        this.instance.option('startDayHour', 8);
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;
        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 0);
        assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, this.instance.getRoundedCellWidth(1) + 1);
        assert.equal($indicators.eq(1).position().top, 9.5 * cellHeight);
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups without shader', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: false
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;

        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 0);
        assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, this.instance.getRoundedCellWidth(1) + 1);
        assert.equal($indicators.eq(1).position().top, 9.5 * cellHeight);
    });

    QUnit.test('Shader should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: false
        });

        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 0, 'Shader wasn\'t rendered');

        this.instance.option('shadeUntilCurrentTime', true);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).length, 1, 'Shader was rendered');
    });

    QUnit.test('Shader should have pointer-events = none', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            shadeUntilCurrentTime: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS).css('pointerEvents'), 'none', 'Shader has correct pointer-events');
    });

    QUnit.test('Shader on allDayPanel should be rendered if needed, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: false
        });
        const $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 0, 'Shader wasn\'t rendered');

        this.instance.option('showAllDayPanel', true);

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).length, 1, 'Shader is rendered');
    });

    QUnit.test('AllDay Shader should be wrapped by allDay panel, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true
        });
        const $element = this.instance.$element();

        assert.ok($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).parent().hasClass('dx-scheduler-all-day-panel'), 'AllDay panel contains time indicator');
    });

    QUnit.test('Shader on allDayPanel should have correct height, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        const $element = this.instance.$element();

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 25, 1, 'Indicator has correct height');

        this.instance.option('allDayExpanded', true);

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 75, 1, 'Indicator has correct height');
    });

    QUnit.test('Shader should have correct height, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $indicator = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;

        assert.roughEqual($indicator.outerHeight(), 9.5 * cellHeight, 1, 'Indicator has correct height');
    });

    QUnit.test('Shader should have limited height, Day view', function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        let $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;

        assert.roughEqual($shader.outerHeight(), 20 * cellHeight, 1.5, 'Indicator has correct height');

        this.instance.option('endDayHour', 24);

        $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        assert.roughEqual($shader.outerHeight(), 23.5 * cellHeight, 1.5, 'Indicator has correct height');
    });

    QUnit.test('Shader should have correct height & width, Day view with intervalCount', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1.5, 'Shader has correct height');
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1.5, 'Top shader has correct height');
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1.5, 'Bottom shader has correct height');
        assert.roughEqual($shader.outerWidth(), 3 * cellWidth, 2, 'Shader has correct width');
        assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 1.5, 'Top shader has correct width');
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1, 'Bottom shader has correct width');
    });

    QUnit.test('Shader should have correct height & width, Day view with intervalCount, different months', function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 30),
            indicatorTime: new Date(2017, 9, 1, 12, 45),
            intervalCount: 3
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1.5, 'Indicator has correct height');
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1.5, 'Top shader has correct height');
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1.5, 'Bottom shader has correct height');

        assert.roughEqual($shader.outerWidth(), 3 * cellWidth, 2, 'Indicator has correct width');
        assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 1.5, 'Top shader has correct width');
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1, 'Bottom shader has correct width');
    });

    QUnit.test('Shader should have correct height & width, Day view with intervalCount, indicatorTime = startDayHour', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 0),
            startDayHour: 12,
            intervalCount: 3
        });

        const $element = this.instance.$element();
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = $cell.outerWidth();

        assert.roughEqual($topShader.outerHeight(), 0, 1.5, 'Top shader has correct height');
        assert.roughEqual($bottomShader.outerHeight(), 24 * cellHeight, 1.5, 'Bottom shader has correct height');
        assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1.5, 'Bottom shader has correct width');
    });

    QUnit.test('Shader should be rendered correctly, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }]);

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = this.instance.getRoundedCellWidth(1);

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, 'Shader has correct height');
        assert.roughEqual($shader.outerWidth(), 9 * cellWidth, 5, 'Shader has correct width');

        for(let i = 0; i <= 2; i++) {
            const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS).eq(i);
            const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS).eq(i);
            const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(i);

            assert.roughEqual($topShader.position().top, i > 0 ? this.instance._dateTableScrollable.$content().outerHeight() : 0, 2.5, 'Shader has correct position');

            assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 2.5, 'Top shader has correct height');
            assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 2.5, 'Bottom shader has correct height');
            assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 2.5, 'Top shader has correct width');
            assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1.5, 'Bottom shader has correct width');
            assert.roughEqual($allDayShader.outerWidth(), 2 * cellWidth, 2.5, 'AllDay shader has correct width');
        }
    });

    QUnit.test('Shader should be rendered correctly, Day view with crossScrollingEnabled', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            crossScrollingEnabled: true
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const containerHeight = $shader.parent().outerHeight();

        assert.roughEqual($shader.outerHeight(), containerHeight, 1, 'Shader has correct height');
        assert.roughEqual(parseInt($shader.css('marginTop')), -containerHeight, 1.5, 'Shader has correct margin');
    });

    QUnit.test('Shader parts should be rendered correctly, Day view with crossScrollingEnabled', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            crossScrollingEnabled: true
        });

        const $element = this.instance.$element();
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);

        assert.equal($topShader.length, 1, 'Top shaders count is OK');
        assert.equal($bottomShader.length, 1, 'Bottom shaders count is OK');
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Day view with intervalCount', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on Day View');

(function() {
    QUnit.module('DateTime indicator on Day View, vertical grouping', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceDay({
                showCurrentTimeIndicator: true,
                groupOrientation: 'vertical',
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
                endDayHour: 14
            }).dxSchedulerWorkSpaceDay('instance');
            stubInvokeMethod(this.instance);
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups, verticalGrouping', function(assert) {
        this.instance.option({
            shadeUntilCurrentTime: false,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;
        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 100);
        assert.equal($indicators.eq(0).position().top, 10.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, 100);
        assert.equal($indicators.eq(1).position().top, 23.5 * cellHeight);
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups and allDay customization, verticalGrouping (T737095)', function(assert) {
        const $style = $('<style>').text('.dx-scheduler-work-space-vertical-grouped .dx-scheduler-all-day-table-row { height: 150px } .dx-scheduler-work-space-vertical-grouped.dx-scheduler-work-space-day .dx-scheduler-all-day-title { height: 150px !important } ');

        try {
            $style.appendTo('head');

            this.instance.option({
                shadeUntilCurrentTime: false,
                indicatorTime: new Date(2017, 8, 5, 12, 45)
            });

            this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

            const $element = this.instance.$element();
            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;

            assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight + 150, 'Indicator top is 9.5 cells + allDay panel height');

            assert.equal($indicators.eq(1).position().top, 21.5 * cellHeight + 2 * 150, 'Second indicator top is 21.5 cells + two allDay panel height');
        } finally {
            $style.remove();
        }
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups without allDay panels, verticalGrouping', function(assert) {
        this.instance.option({
            showAllDayPanel: false,
            shadeUntilCurrentTime: false,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;
        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 100);
        assert.equal($indicators.eq(0).position().top, 9.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, 100);
        assert.equal($indicators.eq(1).position().top, 21.5 * cellHeight);
    });

    QUnit.test('DateTimeIndicator should have correct positions, Day view with groups with shader', function(assert) {
        this.instance.option({
            shadeUntilCurrentTime: true,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).get(0).getBoundingClientRect().height;
        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 100);
        assert.equal($indicators.eq(0).position().top, 10.5 * cellHeight);
        assert.equal($indicators.eq(1).position().left, 100);
        assert.equal($indicators.eq(1).position().top, 23.5 * cellHeight);
    });

    QUnit.test('AllDay Shader should be wrapped by allDay panel', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            showAllDayPanel: true
        });
        const $element = this.instance.$element();

        assert.ok($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).parent().hasClass('dx-scheduler-all-day-panel'), 'AllDay panel contains shader');
    });

    QUnit.test('Shader should be rendered correctly, Day view with groups', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45),
            intervalCount: 3
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }]);

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.outerHeight();
        const cellWidth = this.instance.getRoundedCellWidth(0);

        assert.roughEqual($shader.outerHeight(), 10.5 * cellHeight, 1, 'Shader has correct height');
        assert.roughEqual($shader.outerWidth(), 3 * cellWidth + 100, 5, 'Shader has correct width');

        for(let i = 0; i <= 2; i++) {
            const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS).eq(i);
            const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS).eq(i);

            assert.roughEqual($topShader.position().top, i * 13 * cellHeight, 2, 'Shader has correct position');

            assert.roughEqual($topShader.outerHeight(), 10.5 * cellHeight, 2.5, 'Top shader has correct height');
            assert.roughEqual($bottomShader.outerHeight(), 2.5 * cellHeight, 2.5, 'Bottom shader has correct height');
            assert.roughEqual($topShader.outerWidth(), 2 * cellWidth, 2.5, 'Top shader has correct width');
            assert.roughEqual($bottomShader.outerWidth(), cellWidth, 1.5, 'Bottom shader has correct width');
        }
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Day view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-time-panel-current-time-cell');

        assert.equal($cell.length, 2, 'Cells has specific class');
    });
})('DateTime indicator on Day View, vertical grouping');

(function() {
    QUnit.module('DateTime indicator on Week View', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
            }).dxSchedulerWorkSpaceWeek('instance');
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, Week view', function(assert) {
        this.instance.option({
            currentDate: new Date(),
            startDayHour: 0
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('DateTimeIndicator should not be renderd after currentDate changing, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 19, 45),
            showAllDayPanel: true
        });

        const $element = this.instance.$element();
        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered');

        this.instance.option('currentDate', new Date(2017, 8, 15));

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('Indicator should have correct positions after dimensionChanged', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            crossScrollingEnabled: true,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]
        });

        resizeCallbacks.fire();

        const $element = this.instance.$element();
        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).position().top, 475, 2, 'Indicator has correct position');
    });

    QUnit.test('Shader on allDayPanel should have correct height & width, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45),
            showAllDayPanel: true,
            allDayExpanded: false
        });
        const $element = this.instance.$element();

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 24, 1.5, 'Indicator has correct height');
        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).outerWidth(), 640, 1.5, 'Indicator has correct height');

        this.instance.option('allDayExpanded', true);

        assert.roughEqual($element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS).eq(0).get(0).getBoundingClientRect().height, 74, 1.5, 'Indicator has correct height');
    });

    QUnit.test('Shader should have correct height & width, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 9.5 * cellHeight, 1, 'Indicator has correct height');
        assert.roughEqual($topShader.outerHeight(), 9.5 * cellHeight, 1, 'Top indicator has correct height');
        assert.roughEqual($bottomShader.outerHeight(), 22.5 * cellHeight, 1.5, 'Bottom indicator has correct height');

        assert.roughEqual($shader.outerWidth(), 898, 1, 'Indicator has correct width');
        assert.roughEqual($topShader.outerWidth(), 4 * cellWidth, 1.5, 'Top indicator has correct width');
        assert.roughEqual($bottomShader.outerWidth(), 3 * cellWidth, 1.5, 'Bottom indicator has correct width');
    });

    [{
        startDayHour: 9,
        endDayHour: 20,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is between startDayHour and endDayHour',
        bottomShaderWidth: 2,
        topShaderWidth: 3,
        indicatorCount: 1
    },
    {
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 7, 30),
        testDescription: 'indicatorTime is less than startDateHour',
        bottomShaderWidth: 2,
        topShaderWidth: 2,
        indicatorCount: 0
    },
    {
        startDayHour: 0,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 15, 30),
        testDescription: 'indicatorTime is greater than endDayHour',
        bottomShaderWidth: 0,
        topShaderWidth: 3,
        indicatorCount: 0
    }].forEach(testCase => {
        QUnit.test(`Shader should have correct width on week view, ${testCase.testDescription}, (T923329)`, function(assert) {
            const instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
                currentDate: new Date(2017, 8, 5),
                height: 600,
                indicatorTime: testCase.indicatorTime,
                startDayHour: testCase.startDayHour,
                endDayHour: testCase.endDayHour,
                hoursInterval: 1
            }).dxSchedulerWorkSpaceWeek('instance');

            const $element = instance.$element();
            const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
            const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
            const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

            testCase.bottomShaderWidth !== 0 && assert.roughEqual($bottomShader.outerWidth(), testCase.bottomShaderWidth * cellWidth, 1.5, 'Bottom shader has correct width');
            assert.roughEqual($topShader.outerWidth(), testCase.topShaderWidth * cellWidth, 1.5, 'Top shader has correct width');

            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            assert.equal($indicators.length, testCase.indicatorCount, 'Indicator count is correct');
        });
    });

    QUnit.test('Shader should have limited height, Week view', function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerHeight(), 1000, 1.5, 'Shader has correct height');
    });

    QUnit.test('Shader should be rendered for \'overdue\' views', function(assert) {
        this.instance.option({
            endDayHour: 18,
            currentDate: new Date(2017, 7, 5),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellWidth = $cell.outerWidth();

        assert.roughEqual($shader.outerHeight(), 1000, 1.5, 'Shader has correct height');
        assert.roughEqual($topShader.outerWidth(), 7 * cellWidth, 2.5, 'TopShader has correct width');
        assert.roughEqual($allDayShader.outerWidth(), 7 * cellWidth, 2.5, 'AllDayShader has correct width');

        assert.roughEqual($topShader.outerHeight(), 1000, 1.5, 'TopShader has correct height');

        assert.equal($bottomShader.length, 0, 'BottomShader wasn\'t rendered for overdue view');
    });

    QUnit.test('TimePanel currentTime cell should have specific class, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 6, 12, 30)
        });

        const $element = this.instance.$element();
        const $firstCell = $element.find('.dx-scheduler-time-panel-cell').eq(8);
        const $secondCell = $element.find('.dx-scheduler-time-panel-cell').eq(9);
        const $thirdCell = $element.find('.dx-scheduler-time-panel-cell').eq(10);

        assert.ok($firstCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
        assert.ok($secondCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell has specific class');
        assert.notOk($thirdCell.hasClass('dx-scheduler-time-panel-current-time-cell'), 'Cell hasn\'t specific class');
    });

    QUnit.test('DateHeader currentTime cell should have specific class, Week view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 7, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(4);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });

    QUnit.test('DateTimeIndicator and shader should have correct positions, Week view with intervalCount, rtl mode', function(assert) {
        const workspace = $('#scheduler-work-space-rtl').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            rtlEnabled: true,
            intervalCount: 2
        }).dxSchedulerWorkSpaceWeek('instance');

        const $element = workspace.$element();
        const $indicator = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);

        assert.equal($indicator.length, 1, 'Indicator count is correct');
        assert.roughEqual($indicator.eq(0).position().left, 706, 1.5, 'Indicator left is OK');
        assert.roughEqual(parseInt($topShader.css('left')), 706, 1.5, 'Top indicator has correct left');
        assert.roughEqual(parseInt($bottomShader.css('left')), 770, 1.5, 'Bottom indicator has correct left');
    });
})('DateTime indicator on Week View');

const moduleConfig = {
    beforeEach() {
        this.instance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
        }).dxSchedulerWorkSpaceWeek('instance');
        stubInvokeMethod(this.instance);
    }
};

QUnit.module('DateTime indicator on grouped Week View', moduleConfig, () => {
    QUnit.test('Shader should be rendered for \'overdue\' grouped view', function(assert) {
        this.instance.option({
            endDayHour: 18,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
            currentDate: new Date(2017, 8, 2),
            indicatorTime: new Date(2017, 7, 30, 19, 45)
        });

        const $element = this.instance.$element();
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellWidth = $cell.outerWidth();

        assert.equal($topShader.length, 2, 'Shader top parts count is correct');
        assert.equal($allDayShader.length, 2, 'Shader allDay parts count is correct');
        assert.equal($bottomShader.length, 0, 'BottomShader wasn\'t rendered for overdue view');

        $topShader.each((index, element) => {
            assert.roughEqual($(element).outerWidth(), 4 * cellWidth, 2, 'TopShader has correct width');
            assert.roughEqual($(element).outerHeight(), 1000, 2, 'TopShader has correct height');
            assert.roughEqual(parseInt($(element).css('left')), index * 7 * cellWidth, 2, 'TopShader has correct left');
        });

        $allDayShader.each((index, element) => {
            assert.roughEqual($(element).outerWidth(), 4 * cellWidth, 2, 'AllDay has correct width');
        });
    });

    QUnit.test('Shader should be rendered for \'overdue\' grouped view, groupByDate = true', function(assert) {
        this.instance.option({
            endDayHour: 18,
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
            groupByDate: true,
            currentDate: new Date(2017, 8, 2),
            indicatorTime: new Date(2017, 7, 30, 19, 45)
        });

        const $element = this.instance.$element();
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const cellWidth = $cell.outerWidth();

        assert.equal($topShader.length, 1, 'Shader top parts count is correct');
        assert.equal($allDayShader.length, 1, 'Shader allDay parts count is correct');
        assert.equal($bottomShader.length, 0, 'BottomShader wasn\'t rendered for overdue view');

        assert.roughEqual($topShader.outerWidth(), 8 * cellWidth, 2, 'TopShader has correct width');
        assert.roughEqual($topShader.outerHeight(), 1000, 2, 'TopShader has correct height');
        assert.roughEqual($allDayShader.outerWidth(), 8 * cellWidth, 2, 'AllDay has correct width');
    });

    QUnit.test('DateTimeIndicator should have correct position and size, Week view with groupByDate = true', function(assert) {
        this.instance.option({
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }],
            groupByDate: true,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $indicator = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

        assert.equal($indicator.length, 1, 'Indicator count is correct');
        assert.roughEqual($indicator.eq(0).position().left, 256, 1.5, 'Indicator left is OK');
        assert.roughEqual($indicator.outerWidth(), 2 * cellWidth, 1, 'Indicator has correct width');
    });

    QUnit.test('Shader should have correct position and size, Week view with groupByDate = true', function(assert) {
        this.instance.option({
            groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }, { id: 3, text: 'a.3' }] }],
            groupByDate: true,
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $topShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_TOP_CLASS);
        const $allDayShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_ALL_DAY_CLASS);
        const $bottomShader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_BOTTOM_CLASS);
        const $cell = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0);
        const $allDayCell = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0);
        const cellHeight = $cell.get(0).getBoundingClientRect().height;
        const cellWidth = $cell.outerWidth();

        const shaderConfigs = [
            { type: 'allDay', element: $allDayShader, height: $allDayCell.outerHeight(), width: 9 * cellWidth, left: 0 },
            { type: 'top', element: $topShader, height: 9.5 * cellHeight, width: 9 * cellWidth, left: 0 },
            { type: 'bottom', element: $bottomShader, height: 22.5 * cellHeight, width: 6 * cellWidth, left: 0 }
        ];

        shaderConfigs.forEach(config => {
            assert.roughEqual(config.element.outerHeight(), config.height, 2.5, `${config.type} shader has correct height`);
            assert.roughEqual(config.element.outerWidth(), config.width, 2.5, `${config.type} shader has correct width`);
            assert.roughEqual(parseInt(config.element.css('left')), config.left, 2.5, `${config.type} shader has correct left`);
        });
    });
});

(function() {
    QUnit.module('DateTime indicator on TimelineDay View', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                startDayHour: 8,
                height: 307
            }).dxSchedulerTimelineDay('instance');
        }
    });

    QUnit.test('DateTimeIndicator should be rendered if needed, TimelineDay view', function(assert) {
        this.instance.option({
            currentDate: new Date(),
            startDayHour: 0
        });
        let $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 1, 'Indicator is rendered correctly');

        this.instance.option('showCurrentTimeIndicator', false);
        $element = this.instance.$element();

        assert.equal($element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS).length, 0, 'Indicator wasn\'t rendered');
    });

    QUnit.test('Shader should have correct height & width, TimelineDay view', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

        assert.roughEqual($shader.outerHeight(), 200, 1, 'Shader has correct height');

        assert.roughEqual($shader.outerWidth(), 9.5 * cellWidth, 1, 'Shader has correct width');
    });

    QUnit.test('Shader should have limited width, TimelineDay view', function(assert) {
        this.instance.option({
            endDayHour: 18,
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerWidth(), 4000, 1, 'Shader has correct width');
    });

    QUnit.test('Shader should be rendered for \'overdue\' views, TimelineDay view', function(assert) {
        this.instance.option({
            currentDate: new Date(2017, 8, 3),
            indicatorTime: new Date(2017, 8, 5, 19, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.roughEqual($shader.outerWidth(), 6400, 1, 'Shader has correct width');
    });

    QUnit.test('DateHeader currentTime cell should have specific class', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(9);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on TimelineDay View');

(function() {
    QUnit.module('DateTime indicator on TimelineDay View, horizontal grouping', {
        beforeEach: function() {
            this.instance = $('#scheduler-work-space').dxSchedulerTimelineDay({
                showCurrentTimeIndicator: true,
                currentDate: new Date(2017, 8, 5),
                groupOrientation: 'horizontal',
                startDayHour: 8,
                endDayHour: 14,
                hoursInterval: 1,
                height: 307
            }).dxSchedulerTimelineDay('instance');
            stubInvokeMethod(this.instance);
        }
    });

    QUnit.test('DateTimeIndicator should be rendered correctly', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);

        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, 950);
        assert.equal($indicators.eq(0).position().top, 0);
        assert.equal($indicators.eq(1).position().left, 2150);
        assert.equal($indicators.eq(1).position().top, 0);
    });

    [true, false].forEach(groupByDate => {
        QUnit.test(`Shader should have correct marginTop, when crossScrollingEnabled = true and groupByDate = ${groupByDate}`, function(assert) {
            this.instance.option({
                indicatorTime: new Date(2017, 8, 5, 12, 45),
                groupByDate: groupByDate,
                startDayHour: 11,
                crossScrollingEnabled: true
            });

            this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

            const $element = this.instance.$element();
            const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
            const containerHeight = $shader.parent().outerHeight();

            assert.roughEqual(parseInt($shader.eq(0).css('marginTop')), -containerHeight, 1.5, 'First shader part has correct margin');
            assert.roughEqual(parseInt($shader.eq(1).css('marginTop')), -containerHeight, 1.5, 'Second shader part  has correct margin');
        });
    });

    QUnit.test('DateTimeIndicator should be rendered correctly, groupByDate = true', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            groupByDate: true,
            startDayHour: 11
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
        const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
        const indicationWidth = 50;

        assert.equal($indicators.length, 2, 'Indicator count is correct');
        assert.equal($indicators.eq(0).position().left, cellWidth * 2.5 + indicationWidth, 'First indicator left is Ok');
        assert.equal($indicators.eq(0).position().top, 0);
        assert.equal($indicators.eq(1).position().left, cellWidth * 3.5 + indicationWidth, 'Second indicator left is Ok');
        assert.equal($indicators.eq(1).position().top, 0);
    });

    QUnit.test('Shader should have correct height, width and position, groupByDate = true', function(assert) {
        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45),
            groupByDate: true,
            startDayHour: 11
        });

        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const cellHeight = $element.find('.dx-scheduler-date-table-cell').eq(0).outerHeight();
        const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
        const indicationWidth = 50;

        assert.equal($shader.length, 2, 'Shaders count is correct');

        assert.roughEqual($shader.eq(0).outerHeight(), cellHeight, 1, 'Shader has correct height');
        assert.roughEqual($shader.eq(0).outerWidth(), cellWidth * 2.5 + indicationWidth, 1, 'Shader has correct width');

        assert.roughEqual($shader.eq(1).outerHeight(), cellHeight, 1, 'Shader has correct height');
        assert.roughEqual($shader.eq(1).outerWidth(), cellWidth / 2 + indicationWidth, 1, 'Shader has correct width');

        assert.roughEqual($shader.eq(0).position().left, 0, 1, 'Shader has correct left');
        assert.roughEqual($shader.eq(1).position().left, cellWidth * 3, 1, 'Shader has correct left');
    });

    QUnit.test('Shader should have correct height, width and position', function(assert) {
        this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

        this.instance.option({
            indicatorTime: new Date(2017, 8, 5, 12, 45)
        });

        const $element = this.instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);

        assert.equal($shader.length, 2, 'Shaders count is correct');

        assert.roughEqual($shader.eq(0).outerHeight(), 160, 1, 'Shader has correct height');
        assert.roughEqual($shader.eq(0).outerWidth(), 950, 1, 'Shader has correct width');

        assert.roughEqual($shader.eq(1).outerHeight(), 160, 1, 'Shader has correct height');
        assert.roughEqual($shader.eq(1).outerWidth(), 950, 1, 'Shader has correct width');

        assert.roughEqual($shader.eq(0).position().left, 0, 1, 'Shader has correct left');
        assert.roughEqual($shader.eq(1).position().left, 1200, 1, 'Shader has correct left');
    });

})('DateTime indicator on TimelineDay View, horizontal grouping');

(function() {
    QUnit.module('DateTime indicator on other timelines');

    [{
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is between startDayHour and endDayHour',
        expectedCellCount: 13.5,
        indicatorCount: 1
    },
    {
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 7, 30),
        testDescription: 'indicatorTime is less than startDateHour',
        expectedCellCount: 10,
        indicatorCount: 0
    },
    {
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 15, 30),
        testDescription: 'indicatorTime is greater than endDayHour',
        expectedCellCount: 15,
        indicatorCount: 0
    }].forEach(testCase => {
        QUnit.test(`Shader should have correct height & width on timelineWeek, ${testCase.testDescription}, (T923329)`, function(assert) {
            const instance = $('#scheduler-work-space').dxSchedulerTimelineWeek({
                currentDate: new Date(2017, 8, 5),
                height: 307,
                indicatorTime: testCase.indicatorTime,
                startDayHour: testCase.startDayHour,
                endDayHour: testCase.endDayHour,
                hoursInterval: 1
            }).dxSchedulerTimelineWeek('instance');

            const $element = instance.$element();
            const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
            const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

            assert.roughEqual($shader.outerHeight(), 160, 1, 'Shader has correct height');
            assert.roughEqual($shader.outerWidth(), testCase.expectedCellCount * cellWidth, 1, 'Shader has correct width');

            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            assert.equal($indicators.length, testCase.indicatorCount, 'Indicator count is correct');
        });
    });

    [{
        startDayHour: 9,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is between startDayHour and endDayHour'
    },
    {
        startDayHour: 13,
        endDayHour: 14,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is less than startDateHour'
    },
    {
        startDayHour: 0,
        endDayHour: 11,
        indicatorTime: new Date(2017, 8, 5, 12, 30),
        testDescription: 'indicatorTime is greater than endDayHour'
    }].forEach(testCase => {
        QUnit.test(`Shader should have correct height & width on timelineMonth, ${testCase.testDescription}, (T923329)`, function(assert) {
            const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
                currentDate: new Date(2017, 8, 5),
                height: 307,
                indicatorTime: testCase.indicatorTime,
                startDayHour: testCase.startDayHour,
                endDayHour: testCase.endDayHour,
                hoursInterval: 1
            }).dxSchedulerTimelineMonth('instance');
            const $element = instance.$element();
            const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
            const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

            assert.roughEqual($shader.outerHeight(), 200, 1, 'Shader has correct height');
            assert.roughEqual($shader.outerWidth(), 4.5 * cellWidth, 6, 'Shader has correct width');

            const $indicators = $element.find('.' + SCHEDULER_DATE_TIME_INDICATOR_CLASS);
            assert.equal($indicators.length, 1, 'Indicator count is correct');
        });
    });

    QUnit.test('DateHeader currentTime cell should have specific class, TimelineWeek view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineWeek({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 5, 12, 30),
            hoursInterval: 1
        }).dxSchedulerTimelineWeek('instance');

        const $element = instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(43);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });

    QUnit.test('Shader should have correct height & width, TimelineMonth view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 16, 12, 0),
            hoursInterval: 1
        }).dxSchedulerTimelineMonth('instance');

        const $element = instance.$element();
        const $shader = $element.find('.' + SCHEDULER_DATE_TIME_SHADER_CLASS);
        const cellWidth = $element.find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

        assert.roughEqual($shader.outerHeight(), 200, 1, 'Shader has correct height');

        assert.roughEqual($shader.outerWidth(), 15.5 * cellWidth, 1, 'Shader has correct width');
    });

    QUnit.test('DateHeader currentTime cell should have specific class, TimelineMonth view', function(assert) {
        const instance = $('#scheduler-work-space').dxSchedulerTimelineMonth({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 8, 5),
            startDayHour: 8,
            height: 307,
            indicatorTime: new Date(2017, 8, 15, 12, 30)
        }).dxSchedulerTimelineMonth('instance');

        const $element = instance.$element();
        const $cell = $element.find('.dx-scheduler-header-panel-cell').eq(14);

        assert.ok($cell.hasClass('dx-scheduler-header-panel-current-time-cell'), 'Cell has specific class');
    });
})('DateTime indicator on other timelines');

