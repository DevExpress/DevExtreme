import fx from 'animation/fx';
import errors from 'ui/widget/ui.errors';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

initTestMarkup();

QUnit.module('Scrolling to time', () => {
    ['standard', 'virtual'].forEach((scrollingMode) => {
        const moduleName = scrollingMode === 'virtual'
            ? 'Virtual Scrolling'
            : 'Standard Scrolling';
        QUnit.module(moduleName, {
            beforeEach: function() {
                this.createScheduler = (options) => {
                    return createWrapper({
                        showCurrentTimeIndicator: false,
                        scrolling: { mode: scrollingMode },
                        ...options,
                    });
                };

                this.clock = sinon.useFakeTimers();
                sinon.spy(errors, 'log');
                fx.off = true;
            },
            afterEach: function() {
                this.clock.restore();
                errors.log.restore();
                fx.off = false;
            }
        }, () => {
            QUnit.test('Check scrolling to time', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * (18 + 1 / 6);

                assert.roughEqual(scrollBy.getCall(0).args[0].top, expectedTop, 1.001, 'scrollBy was called with right distance');
                assert.equal(scrollBy.getCall(0).args[0].left, 0, 'scrollBy was called with right distance');
            });

            QUnit.test('Check scrolling to time, if startDayHour is not 0', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500,
                    startDayHour: 3
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(2, 0);

                assert.roughEqual(scrollBy.getCall(0).args[0].top, 0, 2.001, 'scrollBy was called with right distance');

                scheduler.instance.scrollToTime(5, 0);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * 4;

                assert.roughEqual(
                    scrollBy.getCall(1).args[0].top,
                    expectedTop,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time, if \'hours\' argument greater than the \'endDayHour\' option', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500,
                    endDayHour: 10
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(12, 0);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * 18;

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].top,
                    expectedTop,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Scrolling to date which doesn\'t locate on current view should call console warning', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500
                });

                scheduler.instance.scrollToTime(12, 0, new Date(2015, 1, 16));

                assert.equal(errors.log.callCount, 1, 'warning has been called once');
                assert.equal(errors.log.getCall(0).args[0], 'W1008', 'warning has correct error id');
            });

            QUnit.test('Check scrolling to time for timeline view', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5);

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view, rtl mode', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    rtlEnabled: true,
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollLeft = scrollable.scrollLeft();
                const scrollBy = sinon.spy(scrollable, 'scrollBy');
                const offset = scheduler.instance.getWorkSpace().getScrollableContainer().outerWidth();

                scheduler.instance.scrollToTime(9, 5);

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left - scrollLeft - offset,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view if date was set', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    firstDayOfWeek: 1,
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view if date was set, rtl mode', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    firstDayOfWeek: 1,
                    rtlEnabled: true,
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollLeft = scrollable.scrollLeft();
                const scrollBy = sinon.spy(scrollable, 'scrollBy');
                const offset = scheduler.workSpace.getDataTableScrollableContainer().outerWidth();

                scheduler.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left - scrollLeft - offset,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });
        });
    });
});
