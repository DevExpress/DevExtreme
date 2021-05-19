import dateUtils from 'core/utils/date';
import resizeCallbacks from 'core/utils/resize_callbacks';
import 'generic_light.css!';
import $ from 'jquery';
import dateLocalization from 'localization/date';
import { stubInvokeMethod } from '../../helpers/scheduler/workspaceTestHelper.js';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_month';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_day';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_week';
import 'ui/scheduler/workspaces/ui.scheduler.timeline_month';

const {
    test,
    module
} = QUnit;

module('Work Space Base', {
    beforeEach: function() {
        $('#qunit-fixture').html(`
            <div class="dx-scheduler">
                <div id="scheduler-work-space">
                </div>
            </div>
        `);
    }
}, () => {
    test('Workspace week should set first day by firstDayOfWeek option if it is setted and this is different in localization', function(assert) {
        const dateLocalizationSpy = sinon.spy(dateLocalization, 'firstDayOfWeekIndex');

        $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25),
            firstDayOfWeek: 0
        }).dxSchedulerWorkSpaceWeek('instance');

        assert.notOk(dateLocalizationSpy.called, 'dateLocalization.firstDayOfWeekIndex wasn\'t called');
    });

    [{
        viewName: 'Day',
        view: 'dxSchedulerWorkSpaceDay',
    }, {
        viewName: 'Week',
        view: 'dxSchedulerWorkSpaceWeek',
    }, {
        viewName: 'Month',
        view: 'dxSchedulerWorkSpaceMonth',
    }, {
        viewName: 'Timeline Day',
        view: 'dxSchedulerTimelineDay',
    }, {
        viewName: 'Timeline Week',
        view: 'dxSchedulerTimelineWeek',
    }, {
        viewName: 'Timeline Month',
        view: 'dxSchedulerTimelineMonth',
    }].forEach(({ viewName, view }) => {
        QUnit.module(viewName, {
            beforeEach: function() {
                this.instance = $('#scheduler-work-space')[view]()[view]('instance');
                stubInvokeMethod(this.instance);
            }
        }, () => {
            test('Scheduler workspace should have a right default intervalCount and startDate', function(assert) {
                assert.equal(this.instance.option('intervalCount'), 1, 'dxSchedulerWorkSpace intervalCount is right');
                assert.deepEqual(this.instance.option('startDate'), null, 'dxSchedulerWorkSpace startDate is right');
            });

            if(viewName === 'Day' || viewName === 'Week') {
                test('All day panel is invisible, if showAllDayPanel = false', function(assert) {

                    this.instance.option('showAllDayPanel', false);

                    const $element = this.instance.$element();
                    const $allDayPanel = $element.find('.dx-scheduler-all-day-panel');

                    assert.equal($allDayPanel.css('display'), 'none', 'allDay panel is invisible');

                    this.instance.option('showAllDayPanel', true);

                    assert.notEqual($allDayPanel.css('display'), 'none', 'allDay panel is visible');
                });

                test('Scheduler workspace scrollables should be updated after allDayExpanded option changed', function(assert) {
                    this.instance.option('allDayExpanded', false);
                    const stub = sinon.stub(this.instance, '_updateScrollable');

                    this.instance.option('allDayExpanded', true);

                    assert.ok(stub.calledOnce, 'Scrollables were updated');
                });

                test('Scheduler workspace scrollables should be updated after endDayHour option changed if allDayPanel is hided', function(assert) {
                    this.instance.option('showAllDayPanel', false);
                    this.instance.option('endDayHour', 18);
                    const stub = sinon.stub(this.instance, '_updateScrollable');

                    this.instance.option('endDayHour', 24);

                    assert.ok(stub.calledOnce, 'Scrollables were updated');
                });

                test('getWorkSpaceMinWidth should work correctly after width changing', function(assert) {
                    this.instance.option('crossScrollingEnabled', true);

                    this.instance.option('width', 400);
                    assert.equal(this.instance.getWorkSpaceMinWidth(), 300, 'minWidth is ok');

                    this.instance.option('width', 900);
                    assert.equal(this.instance.getWorkSpaceMinWidth(), 800, 'minWidth is ok');
                });

                test('Workspace should throw an error if target index is incorrect in getCoordinatesByDate method ', function(assert) {
                    const instance = this.instance;

                    assert.throws(
                        function() {
                            instance.getCoordinatesByDate(new Date(), 100, 0);
                        },
                        function(e) {
                            return /E1039/.test(e.message);
                        },
                        'Exception messages should be correct'
                    );
                });
            }

            test('Tables should be rerendered if dimension was changed and horizontal scrolling is enabled', function(assert) {
                this.instance.option('crossScrollingEnabled', true);
                const stub = sinon.stub(this.instance, '_setTableSizes');

                resizeCallbacks.fire();

                assert.ok(stub.calledOnce, 'Tables were updated');
            });

            test('Tables should not be rerendered if dimension was changed and horizontal scrolling isn\'t enabled', function(assert) {
                this.instance.option('crossScrollingEnabled', false);
                const stub = sinon.stub(this.instance, '_setTableSizes');

                resizeCallbacks.fire();

                assert.equal(stub.callCount, 0, 'Tables were not updated');
            });

            test('Tables should be rerendered if width was changed and horizontal scrolling is enabled', function(assert) {
                const stub = sinon.stub(this.instance, '_setTableSizes');
                this.instance.option('crossScrollingEnabled', true);
                this.instance.option('width', 777);

                assert.ok(stub.calledOnce, 'Tables were updated');
            });

            test('Tables should not be rerendered if width was changed and horizontal scrolling isn\'t enabled', function(assert) {
                const stub = sinon.stub(this.instance, '_setTableSizes');
                this.instance.option('crossScrollingEnabled', false);
                this.instance.option('width', 777);

                assert.equal(stub.callCount, 0, 'Tables were not updated');
            });

            test('dateUtils.getTimezonesDifference should be called when calculating interval between dates', function(assert) {
                const stub = sinon.stub(dateUtils, 'getTimezonesDifference');
                const minDate = new Date('Thu Mar 10 2016 00:00:00 GMT-0500');
                const maxDate = new Date('Mon Mar 15 2016 00:00:00 GMT-0400');

                // TODO: use public method instead
                this.instance._getIntervalBetween(minDate, maxDate, true);

                assert.ok(stub.calledOnce, 'getTimezonesDifference was called');

                dateUtils.getTimezonesDifference.restore();
            });

            test('Global cache should be cleared on dimension changed', function(assert) {
                const spy = sinon.spy(this.instance.cache, 'clear');

                this.instance.cache.set('test', 'value');

                this.instance._dimensionChanged();

                assert.ok(spy.callCount > 0, 'Cache clear was invoked');

                spy.restore();
            });

            test('Global cache should be cleared on _cleanView', function(assert) {
                const spy = sinon.spy(this.instance.cache, 'clear');

                this.instance.cache.set('test', 'value');

                this.instance._cleanView();

                assert.ok(spy.callCount > 0, 'Cache clear was invoked');

                assert.notOk(this.instance.cache.size, 'Global cache is empty');

                spy.restore();
            });
        });
    });
});
