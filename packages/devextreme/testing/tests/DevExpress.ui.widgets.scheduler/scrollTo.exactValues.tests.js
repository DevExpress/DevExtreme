import fx from 'common/core/animation/fx';
import 'generic_light.css!';
import $ from 'jquery';
import errors from 'ui/widget/ui.errors';
import { createWrapper } from '../../helpers/scheduler/helpers.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

const { module, testStart } = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

module('ScrollTo - Exact Values', {
    beforeEach: function() {
        sinon.spy(errors, 'log');
        fx.off = true;
    },
    afterEach: function() {
        errors.log.restore();
        fx.off = false;
    }
}, () => {
    ['standard', 'virtual'].forEach((scrollingMode) => {
        const timeout = scrollingMode === 'virtual' ? 50 : 0;
        const moduleName = scrollingMode === 'virtual'
            ? 'Virtual Scrolling'
            : 'Standard Scrolling';

        QUnit.module(moduleName, {
            beforeEach: function() {
                this.createScheduler = async(options) => {
                    const scheduler = await createWrapper({
                        showCurrentTimeIndicator: false,
                        scrolling: { mode: scrollingMode },
                        ...options,
                    });
                    const workSpace = scheduler.instance.getWorkSpace();

                    workSpace.renderer.getRenderTimeout = () => -1;

                    return scheduler;
                };
            }
        }, () => {
            QUnit.test('ScrollTo should scroll to exact pixel values in week view', async function(assert) {
                const scheduler = await this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2020, 8, 7),
                    height: 500,
                    width: 800,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = $scrollable.dxScrollable('instance');
                const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

                const date = new Date(2020, 8, 7, 9, 30);
                scheduler.instance.scrollTo(date);
                await waitAsync(timeout);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const coordinates = scheduler.instance._workSpace._getScrollCoordinates(9, 30, date);

                const xShift = (scrollableWidth - cellWidth) / 2;
                const yShift = (scrollableHeight - cellHeight) / 2;
                const expectedLeft = coordinates.left - scrollableInstance.scrollLeft() - xShift;
                const expectedTop = coordinates.top - scrollableInstance.scrollTop() - yShift;

                assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].top,
                    expectedTop,
                    2.01,
                    'Correct top pixel value',
                );
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].left,
                    expectedLeft,
                    2.01,
                    'Correct left pixel value',
                );
            });

            QUnit.test('ScrollTo should scroll to exact pixel values in timeline view', async function(assert) {
                const scheduler = await this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2020, 8, 7),
                    height: 500,
                    width: 800,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = $scrollable.dxScrollable('instance');
                const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

                const date = new Date(2020, 8, 7, 9, 30);
                scheduler.instance.scrollTo(date);
                await waitAsync(timeout);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const coordinates = scheduler.instance._workSpace._getScrollCoordinates(9, 30, date);

                const xShift = (scrollableWidth - cellWidth) / 2;
                const yShift = (scrollableHeight - cellHeight) / 2;
                const expectedLeft = coordinates.left - scrollableInstance.scrollLeft() - xShift;
                const expectedTop = coordinates.top - scrollableInstance.scrollTop() - yShift;

                assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].top,
                    expectedTop,
                    2.01,
                    'Correct top pixel value for timeline',
                );
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].left,
                    expectedLeft,
                    2.01,
                    'Correct left pixel value for timeline',
                );
            });

            QUnit.test('ScrollTo should scroll to exact pixel values with grouping', async function(assert) {
                const scheduler = await this.createScheduler({
                    views: [{
                        type: 'week',
                        groupOrientation: 'horizontal',
                        groupByDate: false,
                    }],
                    currentView: 'week',
                    groups: ['ownerId'],
                    currentDate: new Date(2020, 8, 7),
                    height: 500,
                    width: 800,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = $scrollable.dxScrollable('instance');
                const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

                const date = new Date(2020, 8, 7, 9, 30);
                scheduler.instance.scrollTo(date, { ownerId: 2 });
                await waitAsync(timeout);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const groupIndex = scheduler.instance._workSpace._getGroupIndexByGroupValues({ ownerId: 2 });
                const coordinates = scheduler.instance._workSpace._getScrollCoordinates(9, 30, date, groupIndex);

                const xShift = (scrollableWidth - cellWidth) / 2;
                const yShift = (scrollableHeight - cellHeight) / 2;
                const expectedLeft = coordinates.left - scrollableInstance.scrollLeft() - xShift;
                const expectedTop = coordinates.top - scrollableInstance.scrollTop() - yShift;

                assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].top,
                    expectedTop,
                    2.01,
                    'Correct top pixel value with grouping',
                );
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].left,
                    expectedLeft,
                    2.01,
                    'Correct left pixel value with grouping',
                );
            });

            QUnit.test('ScrollTo should scroll to exact pixel values with RTL', async function(assert) {
                const scheduler = await this.createScheduler({
                    rtlEnabled: true,
                    currentView: 'week',
                    currentDate: new Date(2020, 8, 7),
                    height: 500,
                    width: 800,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = $scrollable.dxScrollable('instance');
                const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

                const date = new Date(2020, 8, 7, 9, 30);
                scheduler.instance.scrollTo(date);
                await waitAsync(timeout);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const coordinates = scheduler.instance._workSpace._getScrollCoordinates(9, 30, date);

                const xShift = (scrollableWidth - cellWidth) / 2;
                const yShift = (scrollableHeight - cellHeight) / 2;
                const offset = scheduler.instance.option('rtlEnabled') ? cellWidth : 0;
                const expectedLeft = coordinates.left - scrollableInstance.scrollLeft() - xShift - offset;
                const expectedTop = coordinates.top - scrollableInstance.scrollTop() - yShift;

                assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].top,
                    expectedTop,
                    2.01,
                    'Correct top pixel value with RTL',
                );
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].left,
                    expectedLeft,
                    2.01,
                    'Correct left pixel value with RTL',
                );
            });

            QUnit.test('ScrollTo should scroll to exact pixel values for all-day panel', async function(assert) {
                const scheduler = await this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2020, 8, 7),
                    height: 500,
                    width: 800,
                    showAllDayPanel: true,
                });

                const $scrollable = scheduler.workSpace.getDateTableScrollable();
                const scrollableInstance = $scrollable.dxScrollable('instance');
                const scrollByStub = sinon.stub(scrollableInstance, 'scrollBy');

                const date = new Date(2020, 8, 7, 9, 30);
                scheduler.instance.scrollTo(date, undefined, true);
                await waitAsync(timeout);

                const scrollableHeight = $scrollable.height();
                const scrollableWidth = $scrollable.width();
                const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                const coordinates = scheduler.instance._workSpace._getScrollCoordinates(9, 30, date, 0, true);

                const xShift = (scrollableWidth - cellWidth) / 2;
                const yShift = (scrollableHeight - cellHeight) / 2;
                const expectedLeft = coordinates.left - scrollableInstance.scrollLeft() - xShift;
                let expectedTop = coordinates.top - scrollableInstance.scrollTop() - yShift;

                if(scheduler.instance._workSpace.isAllDayPanelVisible && !scheduler.instance._workSpace._isVerticalGroupedWorkSpace()) {
                    expectedTop = 0;
                }

                assert.ok(scrollByStub.calledOnce, 'ScrollBy was called');
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].top,
                    expectedTop,
                    2.01,
                    'Correct top pixel value for all-day panel',
                );
                assert.roughEqual(
                    scrollByStub.getCall(0).args[0].left,
                    expectedLeft,
                    2.01,
                    'Correct left pixel value for all-day panel',
                );
            });
        });
    });
});
