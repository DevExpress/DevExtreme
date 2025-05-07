import $ from 'jquery';
import { VirtualScrollingDispatcher } from '__internal/scheduler/workspaces/m_virtual_scrolling';
import domAdapter from '__internal/core/m_dom_adapter';
import eventsEngine from 'common/core/events/core/events_engine';
import { addNamespace } from 'common/core/events/utils/index';

const {
    module,
    test
} = QUnit;

module('Virtual Scrolling', {
    beforeEach: function() {
        this.prepareInstance = function(settings, workSpaceOptions = {}) {
            settings = settings || {};
            settings = $.extend(true, {
                height: 300,
                width: 600,
                totalRowCount: 100,
                totalCellCount: 200,
                scrolling: {
                    orientation: 'both',
                    mode: 'virtual',
                }
            }, settings);

            this.options = {
                getGroupCount: () => 0,
                getTotalRowCount: () => settings.totalRowCount,
                getTotalCellCount: () => settings.totalCellCount,
                isRTL: () => false,
                getScrolling: () => settings.scrolling,
                getSchedulerWidth: () => settings.width,
                getSchedulerHeight: () => settings.height,
                getCellWidth: () => { return 150; },
                getCellHeight: () => { return 50; },
                createAction: () => { return () => 'action'; },
                getViewHeight: () => settings.height,
                getViewWidth: () => settings.width,
                getScrollable: () => this.scrollableMock,
                isVerticalGrouping: () => false,
                getCellMinWidth: () => 1,
                updateRender: () => {},
                updateGrid: () => {},
                getWindowHeight: () => 500,
                getWindowWidth: () => 600,
                ...workSpaceOptions,
            };

            this.scrollableMock = {
                _options: {
                    onScroll: e => {},
                },
                option: function(name, value) {
                    if(arguments.length === 2) {
                        this._options[name] = value;
                    }
                    return this._options[name];
                },
            };

            this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this.options);
            this.virtualScrollingDispatcher.attachScrollableEvents();

            this.verticalVirtualScrolling = this.virtualScrollingDispatcher.verticalVirtualScrolling;
            this.horizontalVirtualScrolling = this.virtualScrollingDispatcher.horizontalVirtualScrolling;
        };
    },
    afterEach: function() {
        this.virtualScrollingDispatcher.dispose();

        if(typeof eventsEngine.on.restore === 'function') {
            eventsEngine.on.restore();
        }

        if(typeof eventsEngine.off.restore === 'function') {
            eventsEngine.off.restore();
        }
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

                assert.equal(viewportHeight, 500, 'viewport height is correct');
            });

            test('document scroll event should be subscribed correctly if heigth option is undefined', function(assert) {
                const SCROLL_EVENT_NAME = addNamespace('scroll', 'dxSchedulerVirtualScrolling');

                const spyEventsOn = sinon.spy(eventsEngine, 'on');

                this.prepareInstance({ height: null });

                assert.ok(spyEventsOn.calledOnce, 'scroll event subscribed once');
                assert.equal(spyEventsOn.args[0][0], domAdapter.getDocument(), 'scroll event subscribed for document');
                assert.equal(spyEventsOn.args[0][1], SCROLL_EVENT_NAME, 'scroll event name is correct');
            });

            test('document scroll event should be unsubscribed correctly if heigth option is undefined', function(assert) {
                const SCROLL_EVENT_NAME = addNamespace('scroll', 'dxSchedulerVirtualScrolling');
                const spyEventsOff = sinon.spy(eventsEngine, 'off');

                this.prepareInstance({ height: null });

                this.virtualScrollingDispatcher.dispose();

                assert.ok(spyEventsOff.calledOnce, 'scroll event unsubscribed once');
                assert.equal(spyEventsOff.args[0][0], domAdapter.getDocument(), 'scroll event unsubscribed from document');
                assert.equal(spyEventsOff.args[0][1], SCROLL_EVENT_NAME, 'scroll event name is correct');

                spyEventsOff.restore();
            });

            test('It should call getTotalRowCount with correct parameters', function(assert) {
                this.prepareInstance();

                const getTotalRowCountSpy = sinon.spy(this.verticalVirtualScrolling.options, 'getTotalRowCount');
                const isVerticalGroupingSpy = sinon.spy(this.verticalVirtualScrolling.options, 'isVerticalGrouping');

                // TODO
                this.verticalVirtualScrolling.updateState(200);

                assert.ok(isVerticalGroupingSpy.called, 'isVerticalGroupingSpy was called');
                assert.ok(getTotalRowCountSpy.called, 'getTotalRowCountSpy was called');
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
                    { isRTL: () => true }
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

                assert.equal(viewportWidth, 600, 'Viewport width is correct');
            });

            test('document scroll event should not been subscribed if the "width" option is not defined', function(assert) {
                const spyEventsOn = sinon.spy(eventsEngine, 'on');

                this.prepareInstance({ width: null });

                assert.notOk(spyEventsOn.calledOnce, 'scroll event subscribed once');
            });

            test('It should call getTotalCellCount with correct parameters', function(assert) {
                this.prepareInstance();

                const getTotalCellCountSpy = sinon.spy(this.horizontalVirtualScrolling.options, 'getTotalCellCount');
                const isVerticalGroupingSpy = sinon.spy(this.horizontalVirtualScrolling.options, 'isVerticalGrouping');

                this.horizontalVirtualScrolling.updateState(600);

                assert.ok(isVerticalGroupingSpy.called, 'isVerticalGroupingSpy was called');
                assert.ok(getTotalCellCountSpy.called, 'getTotalCellCountSpy was called');
                assert.equal(getTotalCellCountSpy.getCall(0).args[0], 0, 'Correct first parameter');
                assert.equal(getTotalCellCountSpy.getCall(0).args[1], false, 'Correct second parameter');
            });
        });

        module('Options', () => {
            [
                {
                    scrolling: { orientation: 'vertical', mode: 'virtual' },
                    expectScrolling: {
                        vertical: true,
                        horizontal: false
                    }
                }, {
                    scrolling: { orientation: 'horizontal', mode: 'virtual' },
                    expectScrolling: {
                        vertical: false,
                        horizontal: true
                    }
                }, {
                    scrolling: { orientation: 'both', mode: 'virtual' },
                    expectScrolling: {
                        vertical: true,
                        horizontal: true
                    }
                }, {
                    scrolling: { mode: 'standard' },
                    expectScrolling: {
                        vertical: false,
                        horizontal: false
                    }
                },
            ].forEach(option => {
                test(`Virtual scrolling objects should be created correctly if scrolling.orientation is ${option.scrolling.orientation || option.scrolling.mode} `, function(assert) {
                    this.prepareInstance({
                        scrolling: option.scrolling,
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

                    this.options.getCellWidth = () => testValue;
                    this.options.getCellMinWidth = () => testValue;
                    this.options.getCellHeight = () => testValue;

                    const dispatcher = new VirtualScrollingDispatcher(this.options);

                    assert.ok(dispatcher.rowHeight > 0, 'Row height is correct');
                    assert.ok(dispatcher.cellWidth > 0, 'Cell width is correct');
                });
            });
        });

        [null, undefined].forEach(offset => {
            test(`it should not call virtual scrolling instances if scrollOffset is "${offset}"`, function(assert) {
                this.prepareInstance();

                const spyUpdateVerticalState = sinon.spy(this.verticalVirtualScrolling, 'updateState');
                const spyUpdateHorizontalState = sinon.spy(this.horizontalVirtualScrolling, 'updateState');

                this.virtualScrollingDispatcher.handleOnScrollEvent({
                    left: offset,
                    top: offset
                });

                assert.ok(spyUpdateVerticalState.notCalled, 'Vertical virtual scrolling update state was not called');
                assert.ok(spyUpdateHorizontalState.notCalled, 'Horizontal virtual scrolling update state was not called');
            });
        });

        test('it should not update render if scroll position has not been changed', function(assert) {
            this.prepareInstance();

            const spy = sinon.spy(this.options, 'updateRender');

            const scrollOffset = { left: 300, top: 200 };

            this.virtualScrollingDispatcher.handleOnScrollEvent(scrollOffset);

            assert.ok(spy.calledOnce, 'Render was updated');
            assert.equal(this.verticalVirtualScrolling.position, scrollOffset.top, 'Vertical scroll position is correct');
            assert.equal(this.horizontalVirtualScrolling.position, scrollOffset.left, 'Horizontal scroll position is correct');

            this.virtualScrollingDispatcher.handleOnScrollEvent(scrollOffset);

            assert.ok(spy.calledOnce, 'Render was not updated');
            assert.equal(this.verticalVirtualScrolling.position, scrollOffset.top, 'Vertical scroll position is correct');
            assert.equal(this.horizontalVirtualScrolling.position, scrollOffset.left, 'Horizontal scroll position is correct');
        });

        test('it should reinitialize vertical virtual scrolling state if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'vertical' }
            });

            this.virtualScrollingDispatcher.getCellHeight = () => 200;

            const spy = sinon.spy(this.virtualScrollingDispatcher.verticalVirtualScrolling, 'reinitState');
            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spy.calledOnce, 'reinitState called once');
        });

        test('it should reinitialize horizontal virtual scrolling state if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'horizontal' }
            });

            this.virtualScrollingDispatcher.getCellWidth = () => 200;

            const spy = sinon.spy(this.virtualScrollingDispatcher.horizontalVirtualScrolling, 'reinitState');
            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spy.calledOnce, 'reinitState called once');
        });

        test('it should reinitialize virtual scrolling state on "updateDimensions" if virtualization is allowed', function(assert) {
            this.prepareInstance({
                scrolling: { orientation: 'both' }
            });

            this.virtualScrollingDispatcher.getCellWidth = () => 200;

            const spyHorizontalReinit = sinon.spy(this.horizontalVirtualScrolling, 'reinitState');
            const spyVerticalReinit = sinon.spy(this.verticalVirtualScrolling, 'reinitState');

            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spyHorizontalReinit.calledOnce, 'Horizintal scrolling reinitState called once');
            assert.ok(spyVerticalReinit.notCalled, 'Vertical scrolling reinitState not called');

            spyHorizontalReinit.resetHistory();
            spyVerticalReinit.resetHistory();

            this.virtualScrollingDispatcher.getCellHeight = () => 500;

            this.virtualScrollingDispatcher.updateDimensions();

            assert.ok(spyHorizontalReinit.notCalled, 'Horizintal scrolling reinitState not called');
            assert.ok(spyVerticalReinit.calledOnce, 'Vertical scrolling reinitState called once');
        });

        test('it should correctly round up cellHeight and cellWidth', function(assert) {
            this.prepareInstance();

            this.options.getCellHeight = () => 100.123;
            this.options.getCellWidth = () => 200.234;

            assert.equal(this.virtualScrollingDispatcher.getCellHeight(), 100, 'Cell height is correct');
            assert.equal(this.virtualScrollingDispatcher.getCellWidth(), 200, 'Cell width is correct');

            this.options.getCellHeight = () => 100.523;
            this.options.getCellWidth = () => 200.534;

            assert.equal(this.virtualScrollingDispatcher.getCellHeight(), 100, 'Cell height is correct');
            assert.equal(this.virtualScrollingDispatcher.getCellWidth(), 200, 'Cell width is correct');
        });

        test('it should return correct leftVirtualCellsCount if RTL', function(assert) {
            this.prepareInstance({}, { isRTL: () => true });

            assert.equal(this.virtualScrollingDispatcher.leftVirtualCellsCount, 1, 'leftVirtualCellsCount is correct');
        });

        test('update dimensions should updatee viewPort height and width', function(assert) {
            this.prepareInstance();

            const nextOptions = {
                ...this.virtualScrollingDispatcher.options,
                getSchedulerHeight: () => 1500,
                getSchedulerWidth: () => 2000,
                getViewHeight: () => 1400,
                getViewWidth: () => 2000,
            };

            this.virtualScrollingDispatcher.setViewOptions(nextOptions);
            this.virtualScrollingDispatcher.updateDimensions(true);

            assert.equal(this.verticalVirtualScrolling.viewportSize, 1400, 'Correct viewport size');
            assert.equal(this.horizontalVirtualScrolling.viewportSize, 2000, 'Correct viewport size');
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
                isRTL: () => true
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

        test('reinitState if outlineCount is set', function(assert) {
            this.prepareInstance({
                scrolling: { outlineCount: 1 }
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
                    itemCount: 2,
                    virtualItemCountBefore: 0,
                    virtualItemCountAfter: 98,
                    outlineCountBefore: 0,
                    outlineCountAfter: 1,
                    virtualItemSizeBefore: 0,
                    virtualItemSizeAfter: 29400,
                    outlineSizeBefore: 0,
                    outlineSizeAfter: 0
                },
                'Vertical scrolling state is correct'
            );

            this.prepareInstance({
                scrolling: { outlineCount: 2 }
            });

            this.horizontalVirtualScrolling.position = 800;
            this.horizontalVirtualScrolling.reinitState(400);

            assert.equal(this.horizontalVirtualScrolling.itemSize, 400, 'Horizontal scrolling item size is correct');
            assert.equal(this.horizontalVirtualScrolling.position, 800, 'Horizontal scrolling position is correct');
            assert.deepEqual(
                this.horizontalVirtualScrolling.state,
                {
                    itemCount: 6,
                    outlineCountAfter: 2,
                    outlineCountBefore: 2,
                    outlineSizeAfter: 0,
                    outlineSizeBefore: 0,
                    prevPosition: 800,
                    startIndex: 0,
                    virtualItemCountAfter: 194,
                    virtualItemCountBefore: 0,
                    virtualItemSizeAfter: 77600,
                    virtualItemSizeBefore: 0
                },
                'Horizontal scrolling state is correct'
            );
        });

        test('setViewOptions should chenge dispatcher\'s options', function(assert) {
            this.prepareInstance();

            const nextOptions = {
                ...this.options,
                getSchedulerHeight: () => 5,
                getSchedulerWidth: () => 6,
            };

            this.virtualScrollingDispatcher.setViewOptions(nextOptions);

            assert.equal(this.virtualScrollingDispatcher.options, nextOptions, 'Options were updated');
            assert.equal(this.verticalVirtualScrolling.options.getSchedulerHeight(), 5, 'Correct options');
            assert.equal(this.horizontalVirtualScrolling.options.getSchedulerWidth(), 6, 'Correct options');
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
                    this.virtualScrollingDispatcher.handleOnScrollEvent({ top: step.top });

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

                    this.virtualScrollingDispatcher.handleOnScrollEvent({ top: step.top });

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

                    this.virtualScrollingDispatcher.handleOnScrollEvent({ top: step.top });

                    const { state } = this.verticalVirtualScrolling;

                    assert.deepEqual(state.virtualItemSizeBefore, step.topVirtualRowHeight, 'Layout map topVirtualRowHeight');
                    assert.deepEqual(state.virtualItemSizeAfter, step.bottomVirtualRowHeight, 'Layout map bottomVirtualRowHeight');
                });
            });

            test('State should be updated after change itemSize', function(assert) {
                this.prepareInstance();

                this.verticalVirtualScrolling.itemSize = 123;
                this.virtualScrollingDispatcher.handleOnScrollEvent({ top: 0 });

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
                const spy = sinon.spy(this.verticalVirtualScrolling, 'needUpdateState');

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
                    this.virtualScrollingDispatcher.handleOnScrollEvent({ top: option.y });
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
                    this.virtualScrollingDispatcher.handleOnScrollEvent({ left: step.left });

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
                    this.virtualScrollingDispatcher.handleOnScrollEvent({ left: step.left });

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
                    this.virtualScrollingDispatcher.handleOnScrollEvent({ left: step.left });

                    const { state } = this.horizontalVirtualScrolling;

                    assert.ok(true, `Test for scroll left: ${step.left}`);

                    assert.deepEqual(state.virtualItemSizeBefore, step.leftVirtualCellWidth, 'Layout map leftVirtualCellWidth');
                    assert.deepEqual(state.virtualItemSizeAfter, step.rightVirtualCellWidth, 'Layout map rightVirtualCellWidth');
                });
            });

            test('Scroll event position should be checked correctly before update state11', function(assert) {

                this.prepareInstance();

                const spy = sinon.spy(this.horizontalVirtualScrolling, 'needUpdateState');

                [
                    { left: 0, expectedNeedUpdate: true },
                    { left: 50, expectedNeedUpdate: false },
                    { left: 150, expectedNeedUpdate: false },
                    { left: 300, expectedNeedUpdate: true },
                    { left: 450, expectedNeedUpdate: false },
                    { left: 600, expectedNeedUpdate: true },
                    { left: 30000, expectedNeedUpdate: true }
                ].forEach((option, index) => {

                    this.virtualScrollingDispatcher.handleOnScrollEvent({ left: option.left });

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
                            this.virtualScrollingDispatcher.handleOnScrollEvent({ top: offset });
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    for(; offset >= 0; offset -= 10) {
                        try {
                            this.virtualScrollingDispatcher.handleOnScrollEvent({ top: offset });
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
                            this.virtualScrollingDispatcher.handleOnScrollEvent({ top: offset });
                        } catch(e) {
                            assert.ok(false, e.message);
                        }
                    }

                    for(; offset >= 0; offset -= 10) {
                        try {
                            this.virtualScrollingDispatcher.handleOnScrollEvent({ top: offset });
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
