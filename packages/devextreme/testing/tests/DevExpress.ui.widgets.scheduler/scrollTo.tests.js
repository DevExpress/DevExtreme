import fx from 'common/core/animation/fx';
import 'generic_light.css!';
import $ from 'jquery';
import errors from 'ui/widget/ui.errors';
import { createWrapper } from '../../helpers/scheduler/helpers.js';

const { test, module, testStart } = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

module('ScrollTo', {
    beforeEach: function() {
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
    [{
        mode: 'standard',
        text: 'Standard Scrolling',
    }, {
        mode: 'virtual',
        type: 'both',
        text: 'Virtual Scrolling in Both Directions',
    }, {
        mode: 'virtual',
        type: 'vertical',
        text: 'Virtual Scrolling in Vertical Direction',
    }, {
        mode: 'virtual',
        type: 'horizontal',
        text: 'Virtual Scrolling in Horizontal Direction',
    }].forEach((scrolling) => {
        const baseProps = {
            showCurrentTimeIndicator: false,
            scrolling,
            currentDate: new Date(2020, 8, 6),
            currentView: 'week',
            height: 500,
            width: 500,
            crossScrollingEnabled: true,
            resources: [{
                fieldExpr: 'ownerId',
                dataSource: [{
                    id: 1, text: 'A',
                }, {
                    id: 2, text: 'B',
                }]
            }],
        };
        const createScheduler = (options = {}) => {
            return createWrapper({
                ...baseProps,
                ...options,
            });
        };

        const checkScrollTo = (assert, scheduler, topCellCount, leftCellCount, date, groups, allDay) => {
            const $scrollable = scheduler.workSpace.getDateTableScrollable();
            const scrollableInstance = $scrollable.dxScrollable('instance');
            const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

            const rtlInitialPosition = scrollableInstance.option('rtlEnabled')
                ? scrollableInstance.scrollLeft()
                : 0;

            scheduler.instance.scrollTo(date, groups, allDay);

            const scrollableHeight = $scrollable.height();
            const scrollableWidth = $scrollable.width();
            const $schedulerCell = scheduler.workSpace.getCells().eq(0);
            const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
            const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

            assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
            assert.roughEqual(
                scrollByStub.getCall(0).args[0].top,
                topCellCount * cellHeight - (scrollableHeight - cellHeight) / 2,
                2.01,
                'Correct top parameter',
            );
            assert.roughEqual(
                rtlInitialPosition + scrollByStub.getCall(0).args[0].left,
                leftCellCount * cellWidth - (scrollableWidth - cellWidth) / 2,
                3.01,
                'Correct left parameter',
            );
        };

        test(`A warning should be thrown when scrolling to an invalid date when ${scrolling.text} is used`, function(assert) {
            const scheduler = createScheduler();

            scheduler.instance.scrollTo(new Date(2020, 8, 5));

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1008', 'warning has correct error id');

            scheduler.instance.scrollTo(new Date(2020, 8, 14));

            assert.equal(errors.log.callCount, 2, 'warning has been called once');
            assert.equal(errors.log.getCall(1).args[0], 'W1008', 'warning has correct error id');
        });

        test(`A warning should not be thrown when scrolling to a valid date when ${scrolling.text} is used`, function(assert) {
            const scheduler = createScheduler();

            scheduler.instance.scrollTo(new Date(2020, 8, 7));

            assert.equal(errors.log.callCount, 0, 'warning has been called once');
        });

        [{
            view: { type: 'week' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 1,
            topCellCount: 18,
        }, {
            view: { type: 'month', intervalCount: 5 },
            date: new Date(2020, 8, 25),
            leftCellCount: 5,
            topCellCount: 3,
        }, {
            view: { type: 'timelineWeek' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 66,
            topCellCount: 0,
        }, {
            view: { type: 'timelineMonth' },
            date: new Date(2020, 8, 7),
            leftCellCount: 6,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work in basic case in ${view.type} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    views: [view],
                    currentView: view.type,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
            });
        });

        [{
            view: { type: 'week' },
            date: new Date(2020, 8, 7, 9, 15),
            leftCellCount: 1,
            topCellCount: 18.5,
        }, {
            view: { type: 'month', intervalCount: 5 },
            date: new Date(2020, 8, 25, 12),
            leftCellCount: 5,
            topCellCount: 3,
        }, {
            view: { type: 'timelineWeek' },
            date: new Date(2020, 8, 7, 9, 15),
            leftCellCount: 66.5,
            topCellCount: 0,
        }, {
            view: { type: 'timelineMonth' },
            date: new Date(2020, 8, 7, 12),
            leftCellCount: 6,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work when date is between a cell's startDate and endDate in ${view.type} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    views: [view],
                    currentView: view.type,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
            });
        });

        [{
            view: { type: 'week' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 8,
            topCellCount: 18,
        }, {
            view: { type: 'month', intervalCount: 5 },
            date: new Date(2020, 8, 25, 12),
            leftCellCount: 12,
            topCellCount: 3,
        }, {
            view: { type: 'timelineWeek' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 402,
            topCellCount: 0,
        }, {
            view: { type: 'timelineMonth' },
            date: new Date(2020, 8, 7, 12),
            leftCellCount: 36,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work with horizontal grouping in ${view.type} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        ...view,
                        groupOrientation: 'horizontal',
                        groupByDate: false,
                    }],
                    currentView: view.type,
                    groups: ['ownerId'],
                    width: 400,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
            });
        });

        [{
            view: { type: 'week' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 3,
            topCellCount: 18,
        }, {
            view: { type: 'month', intervalCount: 5 },
            date: new Date(2020, 8, 25, 12),
            leftCellCount: 11,
            topCellCount: 3,
        }, {
            view: { type: 'timelineWeek' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 133,
            topCellCount: 0,
        }, {
            view: { type: 'timelineMonth' },
            date: new Date(2020, 8, 7, 12),
            leftCellCount: 13,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work when grouped by date in ${view.type} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        ...view,
                        groupOrientation: 'horizontal',
                        groupByDate: true,
                    }],
                    currentView: view.type,
                    groups: ['ownerId'],
                    width: 400,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
            });
        });

        [{
            view: { type: 'week' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 1,
            topCellCount: 66,
        }, {
            view: { type: 'month' },
            date: new Date(2020, 8, 25, 12),
            leftCellCount: 5,
            topCellCount: 9,
        }, {
            view: { type: 'timelineWeek' },
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 66,
            topCellCount: 1,
        }, {
            view: { type: 'timelineMonth' },
            date: new Date(2020, 8, 7, 12),
            leftCellCount: 6,
            topCellCount: 1,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work with vertical grouping in ${view.type} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    views: [{
                        ...view,
                        groupOrientation: 'vertical',
                    }],
                    currentView: view.type,
                    groups: ['ownerId'],
                    showAllDayPanel: false,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
            });
        });

        test(`ScrollTo should work with vertical grouping in week view when all-day panel is enabled when ${scrolling.text} is used`, function(assert) {
            const leftCellCount = 1;
            const topCellCount = 68;
            const date = new Date(2020, 8, 7, 9);

            const scheduler = createScheduler({
                views: [{
                    type: 'week',
                    groupOrientation: 'vertical',
                }],
                currentView: 'week',
                groups: ['ownerId'],
                showAllDayPanel: true,
            });

            checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
        });

        test(`ScrollTo should work with vertical grouping when scrolling to an all-day cell when ${scrolling.text} is used`, function(assert) {
            const leftCellCount = 1;
            const topCellCount = 49;
            const date = new Date(2020, 8, 7, 9);

            const scheduler = createScheduler({
                views: [{
                    type: 'week',
                    groupOrientation: 'vertical',
                }],
                currentView: 'week',
                groups: ['ownerId'],
                showAllDayPanel: true,
            });

            checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 }, true);
        });

        [{
            view: 'week',
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 1,
            topCellCount: 18,
        }, {
            view: 'month',
            date: new Date(2020, 8, 25),
            leftCellCount: 5,
            topCellCount: 3,
        }, {
            view: 'timelineWeek',
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 66,
            topCellCount: 0,
        }, {
            view: 'timelineMonth',
            date: new Date(2020, 8, 7),
            leftCellCount: 6,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo to all-day cells should work in ${view} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    currentView: view,
                    height: 400,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.stub(scrollableInstance, 'scrollBy');

                scheduler.instance.scrollTo(date, undefined, true);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const top = view === 'week'
                    ? 0
                    : topCellCount * cellHeight - (scrollableHeight - cellHeight) / 2;

                assert.ok(scrollBy.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollBy.getCall(0).args[0].top,
                    top,
                    2.01,
                    'Correct top parameter',
                );
                assert.equal(
                    scrollBy.getCall(0).args[0].left,
                    leftCellCount * cellWidth - (scrollableWidth - cellWidth) / 2,
                    'Correct left parameter',
                );
            });
        });

        [{
            view: 'week',
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 5,
            topCellCount: 18,
        }, {
            view: 'month',
            date: new Date(2020, 8, 25),
            leftCellCount: 1,
            topCellCount: 3,
        }, {
            view: 'timelineWeek',
            date: new Date(2020, 8, 7, 9),
            leftCellCount: 269,
            topCellCount: 0,
        }, {
            view: 'timelineMonth',
            date: new Date(2020, 8, 7),
            leftCellCount: 23,
            topCellCount: 0,
        }].forEach(({ view, date, leftCellCount, topCellCount }) => {
            test(`ScrollTo should work correctly when RTL is enabled in ${view} view when ${scrolling.text} is used`, function(assert) {
                const scheduler = createScheduler({
                    rtlEnabled: true,
                    currentView: view,
                    height: 400,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
            });
        });
    });
});
