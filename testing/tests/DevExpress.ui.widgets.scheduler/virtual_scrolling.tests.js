import $ from 'jquery';
import VirtualScrollingDispatcher from 'ui/scheduler/workspaces/ui.scheduler.virtual_scrolling';
import { getWindow } from 'core/utils/window';
import { noop } from 'core/utils/common';
import domAdapter from 'core/dom_adapter';
import eventsEngine from 'events/core/events_engine';
import { addNamespace } from 'events/utils/index';
import browser from 'core/utils/browser';

const {
    module
} = QUnit;

const test = (description, callback) => {
    const isIE11 = browser.msie && parseInt(browser.version) <= 11;
    const testFunc = isIE11
        ? QUnit.skip
        : QUnit.test;

    return testFunc(description, sinon.test(callback));
};

module('Virtual Scrolling', {
    beforeEach: function() {
        this.prepareInstance = function(settings, workspaceSettings) {
            settings = settings || {};
            settings = $.extend(true, {
                height: 300,
                width: 600,
                totalRowCount: 100,
                totalCellCount: 200,
                scrolling: {
                    orientation: 'both'
                }
            }, settings);

            workspaceSettings = workspaceSettings || {};
            this.workspaceMock = $.extend(true, {
                _getGroupCount: () => 0,
                _getTotalRowCount: () => settings.totalRowCount,
                _getTotalCellCount: () => settings.totalCellCount,
                _getDateTableCellClass: () => 'fake-cell-class',
                _getDateTableRowClass: () => 'fake-row-class',
                _isRTL: () => false,
                _options: {
                    dataCellTemplate: noop,
                    groupByDate: false,
                    'scrolling.orientation': settings.scrolling.orientation
                },
                getCellWidth: () => { return 150; },
                getCellHeight: () => { return 50; },
                option: name => this.workspaceMock._options[name],
                _getCellData: noop,
                _insertAllDayRowsIntoDateTable: noop,
                _allDayPanels: undefined,
                isGroupedAllDayPanel: noop,
                renderRWorkspace: noop,
                renderRAppointments: noop,
                _createAction: () => { return () => 'action'; },
                $element: () => {
                    return {
                        height: () => settings.height,
                        width: () => settings.width
                    };
                },
                getScrollable: () => this.scrollableMock,
                invoke: (name, arg0) => {
                    const options = {
                        getOption: {
                            width: settings.width,
                            height: settings.height
                        }
                    };
                    return options[name] && options[name][arg0];
                },
                _isVerticalGroupedWorkSpace: () => {
                    return false;
                },
                updateAppointments: () => {},
                getCellMinWidth: () => 1,
            }, workspaceSettings);

            this.scrollableMock = {
                _options: {
                    onScroll: e => {
                    }
                },
                option: function(name, value) {
                    if(arguments.length === 2) {
                        this._options[name] = value;
                    }
                    return this._options[name];
                },
                scrollTo: e => this.scrollableMock.option('onScroll')(e)
            };

            this.scrollTo = scrollOffset => {
                this.scrollableMock.option('onScroll')(
                    { scrollOffset }
                );
            };

            this.scrollVertical = top => {
                this.scrollTo({ top });
            };

            this.scrollHorizontal = left => {
                this.scrollTo({ left });
            };

            this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this.workspaceMock);

            this.virtualScrollingDispatcher.renderer.getRenderTimeout = () => -1;

            this.verticalVirtualScrolling = this.virtualScrollingDispatcher.verticalVirtualScrolling;
            this.horizontalVirtualScrolling = this.virtualScrollingDispatcher.horizontalVirtualScrolling;
        };
    },
    afterEach: function() {
        this.virtualScrollingDispatcher.dispose();
    }
},
() => {
    module('Initialization', function() {
        module('Vertical', () => {
            test('Init', function(assert) {
                this.prepareInstance();

                const { verticalVirtualScrolling } = this;

                assert.equal(verticalVirtualScrolling.pageSize, 6, 'PageSize');
                assert.equal(verticalVirtualScrolling.topVirtualRowCount, 0, 'Top virtual row count');
                assert.equal(verticalVirtualScrolling.rowCount, 9, 'Data row count');
                assert.equal(verticalVirtualScrolling.bottomVirtualRowCount, 91, 'Bottom virtual row count');
            });

            test('"viewportHeight" should be correct if heigth option is undefined', function(assert) {
                this.prepareInstance({ height: null });

                const { viewportHeight } = this.virtualScrollingDispatcher;
                const expectedHeight = getWindow().innerHeight;

                assert.equal(viewportHeight, expectedHeight, 'viewport height is correct');
            });

            test('document scroll event should be subscribed correctly if heigth option is undefined', function(assert) {
                const SCROLL_EVENT_NAME = addNamespace('scroll', 'dxSchedulerVirtualScrolling');

                const spyEventsOn = this.spy(eventsEngine, 'on');

                this.prepareInstance({ height: null });

                assert.ok(spyEventsOn.calledOnce, 'scroll event subscribed once');
                assert.equal(spyEventsOn.args[0][0], domAdapter.getDocument(), 'scroll event subscribed for document');
                assert.equal(spyEventsOn.args[0][1], SCROLL_EVENT_NAME, 'scroll event name is correct');
            });

            test('document scroll event should be unsubscribed correctly if heigth option is undefined', function(assert) {
                const SCROLL_EVENT_NAME = addNamespace('scroll', 'dxSchedulerVirtualScrolling');
                const spyEventsOff = this.spy(eventsEngine, 'off');

                this.prepareInstance({ height: null });

                this.virtualScrollingDispatcher.dispose();

                assert.ok(spyEventsOff.calledOnce, 'scroll event unsubscribed once');
                assert.equal(spyEventsOff.args[0][0], domAdapter.getDocument(), 'scroll event unsubscribed from document');
                assert.equal(spyEventsOff.args[0][1], SCROLL_EVENT_NAME, 'scroll event name is correct');

                spyEventsOff.restore();
            });

            test('It should call _getTotalRowCount with correct parameters', function(assert) {
                this.prepareInstance();

                const getTotalRowCountSpy = this.spy(this.workspaceMock, '_getTotalRowCount');
                const isVerticalGroupedWorkSpaceSpy = this.spy(this.workspaceMock, '_isVerticalGroupedWorkSpace');
                const isGroupedAllDayPanelSpy = this.spy(this.workspaceMock, 'isGroupedAllDayPanel');

                // TODO
                this.verticalVirtualScrolling.updateState(200);

                assert.ok(isVerticalGroupedWorkSpaceSpy.called, '_isVerticalGroupedWorkSpaceSpy was called');
                assert.ok(getTotalRowCountSpy.called, 'getTotalRowCountSpy was called');
                assert.notOk(isGroupedAllDayPanelSpy.called, 'isGroupedAllDayPanel was not called');
                assert.equal(getTotalRowCountSpy.getCall(0).args[0], 0, 'Correct first parameter');
                assert.equal(getTotalRowCountSpy.getCall(0).args[1], false, 'Correct second parameter');
            });
        });

        module('Horizontal', function() {
            test('Init', function(assert) {
                this.prepareInstance();

                const { horizontalVirtualScrolling } = this;
                const { state } = horizontalVirtualScrolling;

                assert.equal(horizontalVirtualScrolling.pageSize, 4, 'PageSize');
                assert.equal(state.virtualItemCountBefore, 0, 'Virtual item count before viewport');
                assert.equal(state.itemCount, 6, 'Item count');
                assert.equal(state.virtualItemCountAfter, 194, 'Virtual item count after viewport');
            });

            test('Init with RTL', function(assert) {
                this.prepareInstance(
                    { },
                    { _isRTL: () => true }
                );

                const { horizontalVirtualScrolling } = this;
                const { state } = horizontalVirtualScrolling;

                assert.equal(horizontalVirtualScrolling.pageSize, 4, 'PageSize');
                assert.equal(state.virtualItemSizeBefore, 29100, 'Virtual item size before viewport');
                assert.equal(state.itemCount, 6, 'Item count');
                assert.equal(state.virtualItemSizeAfter, 0, 'Virtual item size after viewport');
            });

            test('Viewport width should be correct if the "width" option is undefined', function(assert) {
                this.prepareInstance({ width: null });

                const { viewportWidth } = this.virtualScrollingDispatcher;
                const expectedWidth = getWindow().innerWidth;

                assert.equal(viewportWidth, expectedWidth, 'Viewport width is correct');
            });

            test('document scroll event should not been subscribed if the "width" option is not defined', function(assert) {
                const spyEventsOn = this.spy(eventsEngine, 'on');

                this.prepareInstance({ width: null });

                assert.notOk(spyEventsOn.calledOnce, 'scroll event subscribed once');
            });

            test('It should call _getTotalCellCount with correct parameters', function(assert) {
                this.prepareInstance();

                const getTotalCellCountSpy = this.spy(this.workspaceMock, '_getTotalCellCount');
                const isVerticalGroupedWorkSpaceSpy = this.spy(this.workspaceMock, '_isVerticalGroupedWorkSpace');
                const isGroupedAllDayPanelSpy = this.spy(this.workspaceMock, 'isGroupedAllDayPanel');

                this.horizontalVirtualScrolling.updateState(600);

                assert.ok(isVerticalGroupedWorkSpaceSpy.called, '_isVerticalGroupedWorkSpaceSpy was called');
                assert.ok(getTotalCellCountSpy.called, 'getTotalCellCountSpy was called');
                assert.notOk(isGroupedAllDayPanelSpy.called, 'isGroupedAllDayPanel was not called');
                assert.equal(getTotalCellCountSpy.getCall(0).args[0], 0, 'Correct first parameter');
                assert.equal(getTotalCellCountSpy.getCall(0).args[1], false, 'Correct second parameter');
            });
        });

        module('Options', () => {
            [
                {
                    scrollingOrientation: 'vertical',
                    expectScrolling: {
                        vertical: true,
                        horizontal: false
                    }
                }, {
                    scrollingOrientation: 'horizontal',
                    expectScrolling: {
                        vertical: false,
                        horizontal: true
                    }
                }, {
                    scrollingOrientation: 'both',
                    expectScrolling: {
                        vertical: true,
                        horizontal: true
                    }
                }
            ].forEach(option => {
                test(`Virtual scrolling objects should be created correctly if scrolling.orientation is ${option.scrollingOrientation} `, function(assert) {
                    this.prepareInstance({
                        scrolling: {
                            orientation: option.scrollingOrientation
                        }
                    });

                    assert.equal(!!this.horizontalVirtualScrolling, option.expectScrolling.horizontal);
                    assert.equal(!!this.verticalVirtualScrolling, option.expectScrolling.vertical);
                });
            });
        });
    });

    module('Dispatcher', () => {
        [
            {
                orientation: 'vertical',
                expectedRenderState: {
                    bottomVirtualRowHeight: 4550,
                    rowCount: 9,
                    startIndex: 0,
                    startRowIndex: 0,
                    topVirtualRowHeight: 0,
                }
            }, {
                orientation: 'horizontal',
                expectedRenderState: {
                    cellCount: 6,
                    cellWidth: 150,
                    leftVirtualCellWidth: 0,
                    rightVirtualCellWidth: 29100,
                    startCellIndex: 0
                }
            }, {
                orientation: 'both',
                expectedRenderState: {
                    bottomVirtualRowHeight: 4550,
                    rowCount: 9,
                    startIndex: 0,
                    startRowIndex: 0,
                    topVirtualRowHeight: 0,
                    cellCount: 6,
                    cellWidth: 150,
                    leftVirtualCellWidth: 0,
                    rightVirtualCellWidth: 29100,
                    startCellIndex: 0,
                }
            }
        ].forEach(({ orientation, expectedRenderState }) => {
            test(`it should return correct render state if scrolling orientation: ${orientation}`, function(assert) {
                this.prepareInstance({
                    scrolling: {
                        orientation
                    }
                });

                const state = this.virtualScrollingDispatcher.getRenderState();

                assert.deepEqual(state, expectedRenderState, 'Render state is correct');
            });
        });

        [{
            orientation: 'vertical',
            verticalAllowed: true,
            horizontalAllowed: false
        }, {
            orientation: 'horizontal',
            verticalAllowed: false,
            horizontalAllowed: true
        }, {
            orientation: 'both',
            verticalAllowed: true,
            horizontalAllowed: true
        }].forEach(({ orientation, verticalAllowed, horizontalAllowed }) => {
            test(`it should correctly create virtual scrolling instances if scrolling orientation is ${orientation}`, function(assert) {
                this.prepareInstance({
                    scrolling: {
                        orientation
                    }
                });

                const {
                    horizontalVirtualScrolling,
                    verticalVirtualScrolling,
                    horizontalScrollingAllowed,
                    verticalScrollingAllowed
                } = this.virtualScrollingDispatcher;

                assert.equal(horizontalScrollingAllowed, horizontalAllowed, 'horizontalScrollingAllowed is correct');
                assert.equal(verticalScrollingAllowed, verticalAllowed, 'verticalScrollingAllowed is correct');
                assert.equal(!!horizontalVirtualScrolling, horizontalAllowed, 'Horizontal virtual scrolling created correctly');
                assert.equal(!!verticalVirtualScrolling, verticalAllowed, 'Horizontal virtual scrolling created correctly');
            });
        });


        [
            'both',
            'vertical',
            'horizontal'
        ].forEach(orientation => {
            [
                0,
                -1,
                undefined,
                NaN,
                null
            ].forEach(testValue => {
                test(`it should get correct cell sizes if virtual scrolling orientation: ${orientation} and testValue: ${testValue}`, function(assert) {
                    this.prepareInstance({
                        scrolling: {
                            orientation
                        }
                    });

                    this.workspaceMock.getCellWidth = () => testValue;
                    this.workspaceMock.getCellMinWidth = () => testValue;
                    this.workspaceMock.getCellHeight = () => testValue;

                    const dispatcher = new VirtualScrollingDispatcher(this.workspaceMock);

                    assert.ok(dispatcher.rowHeight > 0, 'Row height is correct');
                    assert.ok(dispatcher.cellWidth > 0, 'Cell width is correct');
                });
            });
        });

        [null, undefined].forEach(offset => {
            test(`it should not call virtual scrolling instances if scrollOffset is "${offset}"`, function(assert) {
                this.prepareInstance();

                const spyUpdateVerticalState = this.spy(this.verticalVirtualScrolling, 'updateState');
                const spyUpdateHorizontalState = this.spy(this.horizontalVirtualScrolling, 'updateState');

                this.scrollTo({
                    left: offset,
                    top: offset
                });

                assert.ok(spyUpdateVerticalState.notCalled, 'Vertical virtual scrolling update state was not called');
                assert.ok(spyUpdateHorizontalState.notCalled, 'Horizontal virtual scrolling update state was not called');
            });
        });

        test('it should not update render if scroll position has not been changed', function(assert) {
            this.prepareInstance();

            const spy = this.spy(this.virtualScrollingDispatcher.renderer, 'updateRender');

            const scrollOffset = { left: 300, top: 200 };

            this.scrollTo(scrollOffset);

            assert.ok(spy.calledOnce, 'Render was updated');
            assert.equal(this.verticalVirtualScrolling.position, scrollOffset.top, 'Vertical scroll position is correct');
            assert.equal(this.horizontalVirtualScrolling.position, scrollOffset.left, 'Horizontal scroll position is correct');

            this.scrollTo(scrollOffset);

            assert.ok(spy.calledOnce, 'Render was not updated');
            assert.equal(this.verticalVirtualScrolling.position, scrollOffset.top, 'Vertical scroll position is correct');
            assert.equal(this.horizontalVirtualScrolling.position, scrollOffset.left, 'Horizontal scroll position is correct');
        });

        test('it should reinitialize vertical virtual scrolling state if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'vertical' }
            });

            this.virtualScrollingDispatcher.getCellHeight = () => 200;

            const spy = this.spy(this.virtualScrollingDispatcher.verticalVirtualScrolling, 'reinitState');
            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spy.calledOnce, 'reinitState called once');
        });

        test('it should reinitialize horizontal virtual scrolling state if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'horizontal' }
            });

            this.virtualScrollingDispatcher.getCellWidth = () => 200;

            const spy = this.spy(this.virtualScrollingDispatcher.horizontalVirtualScrolling, 'reinitState');
            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spy.calledOnce, 'reinitState called once');
        });

        test('it should reinitialize virtual scrolling state on "updateDimensions" if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'both' }
            });

            this.virtualScrollingDispatcher.getCellWidth = () => 200;

            const spyHorizontalReinit = this.spy(this.horizontalVirtualScrolling, 'reinitState');
            const spyVerticalReinit = this.spy(this.verticalVirtualScrolling, 'reinitState');

            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spyHorizontalReinit.calledOnce, 'Horizintal scrolling reinitState called once');
            assert.ok(spyVerticalReinit.notCalled, 'Vertical scrolling reinitState not called');

            spyHorizontalReinit.reset();
            spyVerticalReinit.reset();

            this.virtualScrollingDispatcher.getCellHeight = () => 500;

            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spyHorizontalReinit.notCalled, 'Horizintal scrolling reinitState not called');
            assert.ok(spyVerticalReinit.calledOnce, 'Vertical scrolling reinitState called once');
        });

        test('it should correctly round up cellHeight and cellWidth', function(assert) {
            this.prepareInstance();

            this.workspaceMock.getCellHeight = () => 100.123;
            this.workspaceMock.getCellWidth = () => 200.234;

            assert.equal(this.virtualScrollingDispatcher.getCellHeight(), 100, 'Cell height is correct');
            assert.equal(this.virtualScrollingDispatcher.getCellWidth(), 200, 'Cell width is correct');

            this.workspaceMock.getCellHeight = () => 100.523;
            this.workspaceMock.getCellWidth = () => 200.534;

            assert.equal(this.virtualScrollingDispatcher.getCellHeight(), 100, 'Cell height is correct');
            assert.equal(this.virtualScrollingDispatcher.getCellWidth(), 200, 'Cell width is correct');
        });

        test('it should return correct leftVirtualCellsCount if RTL', function(assert) {
            this.prepareInstance({}, { _isRTL: () => true });

            assert.equal(this.virtualScrollingDispatcher.leftVirtualCellsCount, 1, 'leftVirtualCellsCount is correct');
        });
    });

    module('API', () => {
        test('reinitState', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'both' }
            });

            this.verticalVirtualScrolling.position = 200;
            this.verticalVirtualScrolling.reinitState(300);

            assert.equal(this.verticalVirtualScrolling.itemSize, 300, 'Vertical scrolling item size is correct');
            assert.equal(this.verticalVirtualScrolling.position, 200, 'Vertical scrolling position is correct');
            assert.deepEqual(
                this.verticalVirtualScrolling.state,
                {
                    prevPosition: 0,
                    startIndex: 0,
                    itemCount: 1,
                    virtualItemCountBefore: 0,
                    virtualItemCountAfter: 99,
                    outlineCountBefore: 0,
                    outlineCountAfter: 0,
                    virtualItemSizeBefore: 0,
                    virtualItemSizeAfter: 29700,
                    outlineSizeBefore: 0,
                    outlineSizeAfter: 0
                },
                'Vertical scrolling state is correct'
            );

            this.horizontalVirtualScrolling.position = 500;
            this.horizontalVirtualScrolling.reinitState(400);

            assert.equal(this.horizontalVirtualScrolling.itemSize, 400, 'Horizontal scrolling item size is correct');
            assert.equal(this.horizontalVirtualScrolling.position, 500, 'Horizontal scrolling position is correct');
            assert.deepEqual(
                this.horizontalVirtualScrolling.state,
                {
                    itemCount: 4,
                    outlineCountAfter: 1,
                    outlineCountBefore: 1,
                    outlineSizeAfter: 0,
                    outlineSizeBefore: 0,
                    prevPosition: 400,
                    startIndex: 0,
                    virtualItemCountAfter: 196,
                    virtualItemCountBefore: 0,
                    virtualItemSizeAfter: 78400,
                    virtualItemSizeBefore: 0
                },
                'Horizontal scrolling state is correct'
            );
        });

        test('reinitState if RTL', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'both' }
            }, {
                _isRTL: () => true
            });

            this.verticalVirtualScrolling.position = 200;
            this.verticalVirtualScrolling.reinitState(300);

            assert.equal(this.verticalVirtualScrolling.itemSize, 300, 'Vertical scrolling item size is correct');
            assert.equal(this.verticalVirtualScrolling.position, 200, 'Vertical scrolling position is correct');
            assert.deepEqual(
                this.verticalVirtualScrolling.state,
                {
                    prevPosition: 0,
                    startIndex: 0,
                    itemCount: 1,
                    virtualItemCountBefore: 0,
                    virtualItemCountAfter: 99,
                    outlineCountBefore: 0,
                    outlineCountAfter: 0,
                    virtualItemSizeBefore: 0,
                    virtualItemSizeAfter: 29700,
                    outlineSizeBefore: 0,
                    outlineSizeAfter: 0
                },
                'Vertical scrolling state is correct'
            );

            this.horizontalVirtualScrolling.position = 500;
            this.horizontalVirtualScrolling.reinitState(400);

            assert.equal(this.horizontalVirtualScrolling.itemSize, 400, 'Horizontal scrolling item size is correct');
            assert.equal(this.horizontalVirtualScrolling.position, 500, 'Horizontal scrolling position is correct');
            assert.deepEqual(
                this.horizontalVirtualScrolling.state,
                {
                    itemCount: 4,
                    outlineCountAfter: 1,
                    outlineCountBefore: 1,
                    outlineSizeAfter: 0,
                    outlineSizeBefore: 0,
                    prevPosition: 400,
                    startIndex: 196,
                    virtualItemCountAfter: 196,
                    virtualItemCountBefore: 0,
                    virtualItemSizeAfter: 0,
                    virtualItemSizeBefore: 78400
                },
                'Horizontal scrolling state is correct'
            );
        });

        test('outlineCount should depends on viewport appointment count', function(assert) {

            this.prepareInstance();

            let viewPortApptCount = 0;
            Object.defineProperty(
                this.verticalVirtualScrolling,
                'filteredApptCount',
                {
                    get: () => viewPortApptCount
                }
            );

            [
                { apptCount: 0, expectedOutlineCount: 3 },
                { apptCount: 40, expectedOutlineCount: 2 },
                { apptCount: 50, expectedOutlineCount: 1 },
                { apptCount: 100, expectedOutlineCount: 0 }
            ].forEach(({ apptCount, expectedOutlineCount }) => {

                viewPortApptCount = apptCount;

                assert.equal(
                    this.verticalVirtualScrolling.outlineCount,
                    expectedOutlineCount,
                    `Outline count is correct if ${apptCount} appointments in viewPort`
                );
            });
        });
    });

    module('Scrolling', () => {
        module('Vertical', () => {
            test('State should be correct on scrolling Down', function(assert) {
                this.prepareInstance();

                [
                    { top: 10, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                    { top: 66, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                    { top: 120, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                    { top: 200, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                    { top: 3980, stateTop: 3950, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
                    { top: 4950, stateTop: 4700, topVirtualRowCount: 91, bottomVirtualRowCount: 0, rowCount: 9 }
                ].forEach(step => {
                    this.scrollVertical(step.top);

                    const { state } = this.verticalVirtualScrolling;

                    assert.ok(true, `Step ${step.top}`);

                    assert.equal(this.verticalVirtualScrolling.pageSize, 6, 'pageSize');
                    assert.equal(state.itemCount, step.rowCount, 'rowCount');

                    assert.equal(state.startIndex, state.virtualItemCountBefore, 'startIndex');
                    assert.deepEqual(state.prevPosition, step.stateTop, 'scroll top');
                    assert.equal(state.virtualItemCountBefore, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
                    assert.equal(state.virtualItemCountAfter, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
                });
            });

            test('State should be correct on scrolling Up', function(assert) {
                this.prepareInstance({ scrolling: { orientation: 'vertical' } });

                [
                    { top: 4950, stateTop: 4700, topVirtualRowCount: 91, bottomVirtualRowCount: 0, rowCount: 9 },
                    { top: 3980, stateTop: 3950, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
                    { top: 200, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                    { top: 120, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                    { top: 66, stateTop: 50, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 },
                    { top: 10, stateTop: 50, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 },
                    { top: 0, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                ].forEach(step => {
                    assert.ok(true, `Scroll top ${step.top}`);

                    this.scrollVertical(step.top);

                    const { state } = this.verticalVirtualScrolling;

                    assert.equal(this.verticalVirtualScrolling.pageSize, 6, 'pageSize');
                    assert.equal(state.itemCount, step.rowCount, 'rowCount');

                    assert.equal(state.startIndex, state.virtualItemCountBefore, 'startIndex');
                    assert.deepEqual(state.prevPosition, step.stateTop, 'scroll top');
                    assert.equal(state.virtualItemCountBefore, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
                    assert.equal(state.virtualItemCountAfter, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
                });
            });

            test('Check virtual rows height', function(assert) {
                this.prepareInstance();

                [
                    { top: 10, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                    { top: 13, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                    { top: 66, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                    { top: 120, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                    { top: 150, bottomVirtualRowHeight: 4400, topVirtualRowHeight: 0 },
                    { top: 3980, bottomVirtualRowHeight: 600, topVirtualRowHeight: 3800 },
                    { top: 4950, bottomVirtualRowHeight: 0, topVirtualRowHeight: 4550 }
                ].forEach(step => {
                    assert.ok(true, `Scroll top ${step.top}`);

                    this.scrollVertical(step.top);

                    const { state } = this.verticalVirtualScrolling;

                    assert.deepEqual(state.virtualItemSizeBefore, step.topVirtualRowHeight, 'Layout map topVirtualRowHeight');
                    assert.deepEqual(state.virtualItemSizeAfter, step.bottomVirtualRowHeight, 'Layout map bottomVirtualRowHeight');
                });
            });

            test('State should be updated after change itemSize', function(assert) {
                this.prepareInstance();

                this.verticalVirtualScrolling.itemSize = 123;
                this.scrollVertical(0);

                const {
                    itemCount,
                    virtualItemCountAfter,
                    virtualItemSizeAfter
                } = this.verticalVirtualScrolling.state;

                assert.equal(itemCount, 4, 'Item count is correct');
                assert.equal(virtualItemCountAfter, 96, 'virtualItemCountAfter count is correct');
                assert.equal(virtualItemSizeAfter, 11808, 'virtualItemSizeAfter count is correct');
            });

            test('Scroll event position should be checked correctly before update state', function(assert) {
                this.prepareInstance();
                const spy = this.spy(this.verticalVirtualScrolling, 'needUpdateState');

                [
                    { y: 0, expectedNeedUpdate: true },
                    { y: 50, expectedNeedUpdate: false },
                    { y: 100, expectedNeedUpdate: false },
                    { y: 150, expectedNeedUpdate: true },
                    { y: 200, expectedNeedUpdate: false },
                    { y: 300, expectedNeedUpdate: true },
                    { y: 400, expectedNeedUpdate: false },
                    { y: 5000, expectedNeedUpdate: true }
                ].forEach((option, index) => {
                    this.scrollVertical(option.y);
                    assert.equal(
                        spy.getCall(index).returnValue,
                        option.expectedNeedUpdate,
                        `State updated ${option.expectedNeedUpdate} if scrollY: ${option.y}`
                    );
                });
            });
        });

        module('Horizontal', () => {
            test('Check state while scrolling to the Right', function(assert) {
                this.prepareInstance();

                [
                    { left: 10, stateLeft: 0, leftOutlineCount: 0, leftVirtualCellCount: 0, rightVirtualCellCount: 194, rightOutlineCount: 2, cellCount: 6 },
                    { left: 290, stateLeft: 0, leftOutlineCount: 0, leftVirtualCellCount: 0, rightVirtualCellCount: 194, rightOutlineCount: 2, cellCount: 6 },
                    { left: 300, stateLeft: 300, leftOutlineCount: 2, leftVirtualCellCount: 0, rightVirtualCellCount: 192, rightOutlineCount: 2, cellCount: 8 },
                    { left: 450, stateLeft: 300, leftOutlineCount: 2, leftVirtualCellCount: 0, rightVirtualCellCount: 192, rightOutlineCount: 2, cellCount: 8 },
                    { left: 600, stateLeft: 600, leftOutlineCount: 2, leftVirtualCellCount: 2, rightVirtualCellCount: 190, rightOutlineCount: 2, cellCount: 8 },
                    { left: 900, stateLeft: 900, leftOutlineCount: 2, leftVirtualCellCount: 4, rightVirtualCellCount: 188, rightOutlineCount: 2, cellCount: 8 },
                    { left: 12345, stateLeft: 12300, leftOutlineCount: 2, leftVirtualCellCount: 80, rightVirtualCellCount: 112, rightOutlineCount: 2, cellCount: 8 },
                    { left: 29000, stateLeft: 28950, leftOutlineCount: 2, leftVirtualCellCount: 191, rightVirtualCellCount: 1, rightOutlineCount: 2, cellCount: 8 },
                    { left: 30000, stateLeft: 29400, leftOutlineCount: 2, leftVirtualCellCount: 194, rightVirtualCellCount: 0, rightOutlineCount: 0, cellCount: 6 },
                ].forEach(step => {
                    this.scrollHorizontal(step.left);

                    const { state } = this.horizontalVirtualScrolling;

                    assert.equal(this.horizontalVirtualScrolling.pageSize, 4, `pageSize is correct if scrollLeft: ${step.left}`);
                    assert.equal(state.itemCount, step.cellCount, 'cellCount');

                    assert.equal(state.startIndex, state.virtualItemCountBefore, 'startIndex');
                    assert.deepEqual(state.prevPosition, step.stateLeft, 'scroll left');
                    assert.equal(state.outlineCountBefore, step.leftOutlineCount, `Left outline count: ${step.leftOutlineCount}`);
                    assert.equal(state.virtualItemCountBefore, step.leftVirtualCellCount, `Left virtual cell count: ${step.leftVirtualCellCount}`);
                    assert.equal(state.virtualItemCountAfter, step.rightVirtualCellCount, `Right virtual cell count: ${step.rightVirtualCellCount}`);
                    assert.equal(state.outlineCountAfter, step.rightOutlineCount, `Rigth outline count: ${step.rightOutlineCount}`);
                });
            });

            test('Check state while scrolling to the Left', function(assert) {
                this.prepareInstance();

                [
                    { left: 30000, stateLeft: 29400, leftOutlineCount: 2, leftVirtualCellCount: 194, rightVirtualCellCount: 0, rightOutlineCount: 0, cellCount: 6 },
                    { left: 29000, stateLeft: 28950, leftOutlineCount: 2, leftVirtualCellCount: 191, rightVirtualCellCount: 1, rightOutlineCount: 2, cellCount: 8 },
                    { left: 12345, stateLeft: 12300, leftOutlineCount: 2, leftVirtualCellCount: 80, rightVirtualCellCount: 112, rightOutlineCount: 2, cellCount: 8 },
                    { left: 900, stateLeft: 900, leftOutlineCount: 2, leftVirtualCellCount: 4, rightVirtualCellCount: 188, rightOutlineCount: 2, cellCount: 8 },
                    { left: 600, stateLeft: 600, leftOutlineCount: 2, leftVirtualCellCount: 2, rightVirtualCellCount: 190, rightOutlineCount: 2, cellCount: 8 },
                    { left: 450, stateLeft: 600, leftOutlineCount: 2, leftVirtualCellCount: 2, rightVirtualCellCount: 190, rightOutlineCount: 2, cellCount: 8 },
                    { left: 300, stateLeft: 300, leftOutlineCount: 2, leftVirtualCellCount: 0, rightVirtualCellCount: 192, rightOutlineCount: 2, cellCount: 8 },
                    { left: 290, stateLeft: 300, leftOutlineCount: 2, leftVirtualCellCount: 0, rightVirtualCellCount: 192, rightOutlineCount: 2, cellCount: 8 },
                    { left: 10, stateLeft: 0, leftOutlineCount: 0, leftVirtualCellCount: 0, rightVirtualCellCount: 194, rightOutlineCount: 2, cellCount: 6 },
                    { left: 0, stateLeft: 0, leftOutlineCount: 0, leftVirtualCellCount: 0, rightVirtualCellCount: 194, rightOutlineCount: 2, cellCount: 6 }
                ].forEach(step => {
                    this.scrollHorizontal(step.left);

                    const { state } = this.horizontalVirtualScrolling;

                    assert.equal(this.horizontalVirtualScrolling.pageSize, 4, `pageSize is correct if scrollLeft: ${step.left}`);
                    assert.equal(state.itemCount, step.cellCount, 'cellCount');

                    assert.equal(state.startIndex, state.virtualItemCountBefore, 'startIndex');
                    assert.deepEqual(state.prevPosition, step.stateLeft, 'scroll left');
                    assert.equal(state.outlineCountBefore, step.leftOutlineCount, `Left outline count: ${step.leftOutlineCount}`);
                    assert.equal(state.virtualItemCountBefore, step.leftVirtualCellCount, `Left virtual cell count: ${step.leftVirtualCellCount}`);
                    assert.equal(state.virtualItemCountAfter, step.rightVirtualCellCount, `Right virtual cell count: ${step.rightVirtualCellCount}`);
                    assert.equal(state.outlineCountAfter, step.rightOutlineCount, `Rigth outline count: ${step.rightOutlineCount}`);
                });
            });

            test('Check virtual cells width', function(assert) {
                this.prepareInstance();

                [
                    { left: 10, leftVirtualCellWidth: 0, rightVirtualCellWidth: 29100 },
                    { left: 290, leftVirtualCellWidth: 0, rightVirtualCellWidth: 29100 },
                    { left: 300, leftVirtualCellWidth: 0, rightVirtualCellWidth: 28800 },
                    { left: 450, leftVirtualCellWidth: 0, rightVirtualCellWidth: 28800 },
                    { left: 600, leftVirtualCellWidth: 300, rightVirtualCellWidth: 28500 },
                    { left: 900, leftVirtualCellWidth: 600, rightVirtualCellWidth: 28200 },
                    { left: 29000, leftVirtualCellWidth: 28650, rightVirtualCellWidth: 150 },
                    { left: 30000, leftVirtualCellWidth: 29100, rightVirtualCellWidth: 0 }
                ].forEach(step => {
                    this.scrollHorizontal(step.left);

                    const { state } = this.horizontalVirtualScrolling;

                    assert.ok(true, `Test for scroll left: ${step.left}`);

                    assert.deepEqual(state.virtualItemSizeBefore, step.leftVirtualCellWidth, 'Layout map leftVirtualCellWidth');
                    assert.deepEqual(state.virtualItemSizeAfter, step.rightVirtualCellWidth, 'Layout map rightVirtualCellWidth');
                });
            });

            test('Scroll event position should be checked correctly before update state11', function(assert) {

                this.prepareInstance();

                const spy = this.spy(this.horizontalVirtualScrolling, 'needUpdateState');

                [
                    { left: 0, expectedNeedUpdate: true },
                    { left: 50, expectedNeedUpdate: false },
                    { left: 150, expectedNeedUpdate: false },
                    { left: 300, expectedNeedUpdate: true },
                    { left: 450, expectedNeedUpdate: false },
                    { left: 600, expectedNeedUpdate: true },
                    { left: 30000, expectedNeedUpdate: true }
                ].forEach((option, index) => {

                    this.scrollHorizontal(option.left);

                    assert.equal(
                        spy.getCall(index).returnValue,
                        option.expectedNeedUpdate,
                        `State updated "${option.expectedNeedUpdate}" if scrollLeft: ${option.left}`
                    );
                });
            });
        });
    });

    module('Validation', function() {
        module('Vertical', function() {
            [5, 15, 25, 50, 100, 150, 200].forEach(totalRowCount => {
                test(`Check virtual scrolling state where totalRowCount: ${totalRowCount}`, function(assert) {
                    let offset;

                    this.prepareInstance({ totalRowCount });

                    for(offset = 0; offset <= 5000; offset += 15) {
                        try {
                            this.scrollVertical(offset);
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    for(; offset >= 0; offset -= 10) {
                        try {
                            this.scrollVertical(offset);
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    assert.ok(true, 'State validation checked');
                });
            });
        });

        module('Horizontal', function() {
            [5, 15, 25, 50, 100].forEach(totalCellCount => {
                test(`Check virtual scrolling state where totalCellCount: ${totalCellCount}`, function(assert) {
                    let offset;

                    this.prepareInstance({ totalCellCount });

                    for(offset = 0; offset <= 15000; offset += 45) {
                        try {
                            this.scrollVertical(offset);
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    for(; offset >= 0; offset -= 10) {
                        try {
                            this.scrollVertical(offset);
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    assert.ok(true, 'State validation checked');
                });
            });
        });
    });
});
