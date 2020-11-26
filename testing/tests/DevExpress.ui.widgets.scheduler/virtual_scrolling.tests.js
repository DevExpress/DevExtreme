import $ from 'jquery';
import VirtualScrollingDispatcher from 'ui/scheduler/workspaces/ui.scheduler.virtual_scrolling';
import { getWindow } from 'core/utils/window';
import { noop } from 'core/utils/common';
import domAdapter from 'core/dom_adapter';
import eventsEngine from 'events/core/events_engine';
import { addNamespace } from 'events/utils/index';

const { test, module } = QUnit;

module('Virtual Scrolling', {
    beforeEach: function() {
        this.prepareInstance = function(settings) {
            settings = settings || {};
            settings = $.extend(true, {
                height: 300,
                totalRowCount: 100,
                totalCellCount: 200
            }, settings);

            this.workspaceMock = {
                _getGroupCount: () => 0,
                _getTotalRowCount: () => settings.totalRowCount,
                _getTotalCellCount: () => settings.totalCellCount,
                _getDateTableCellClass: () => 'fake-cell-class',
                _getDateTableRowClass: () => 'fake-row-class',
                _options: {
                    dataCellTemplate: noop,
                    groupByDate: false,
                },
                option: name => this.worksSpaceMock._options[name],
                _getCellData: noop,
                _insertAllDayRowsIntoDateTable: noop,
                _allDayPanels: undefined,
                isGroupedAllDayPanel: noop,
                renderRWorkspace: noop,
                renderRAppointments: noop,
                _createAction: () => { return () => 'action'; },
                $element: () => {
                    return {
                        height: () => settings.height
                    };
                },
                getScrollable: () => this.scrollableMock,
                invoke: (name, arg0) => {
                    const options = {
                        getOption: { height: settings.height }
                    };
                    return options[name] && options[name][arg0];
                },
                _isVerticalGroupedWorkSpace: () => false,
                updateAppointments: () => {},
            };

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

            this.scrollDown = position => {
                this.scrollableMock.option('onScroll')({
                    scrollOffset: { top: position }
                });
            };

            this.virtualScrollingDispatcher = new VirtualScrollingDispatcher(this.workspaceMock);
            this.virtualScrollingDispatcher.getRenderTimeout = () => -1;
            this.virtualScrollingDispatcher.getHeight = () => settings.height;
            this.virtualScrolling = this.virtualScrollingDispatcher.virtualScrolling;
        };
    },
    afterEach: function() {
        this.virtualScrollingDispatcher.dispose();
    }
},
() => {
    module('Initialization', function() {
        test('Init', function(assert) {
            this.prepareInstance();

            const state = this.virtualScrolling.getState();

            assert.equal(state.pageSize, 6, 'PageSize');
            assert.equal(state.topVirtualRowCount, 0, 'Top virtual row count');
            assert.equal(state.rowCount, 9, 'Data row count');
            assert.equal(state.bottomVirtualRowCount, 91, 'Bottom virtual row count');
        });

        test('"viewportHeight" should be correct if heigth option is undefined', function(assert) {
            this.prepareInstance({ height: null });

            const { viewportHeight } = this.virtualScrollingDispatcher;
            const expectedHeight = getWindow().innerHeight;

            assert.equal(viewportHeight, expectedHeight, 'viewport height is correct');
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
        });

        test('It should call _getTotalRowCount with correct parameters', function(assert) {
            this.prepareInstance();

            const getTotalRowCountSpy = sinon.spy(this.workspaceMock, '_getTotalRowCount');
            const isVerticalGroupedWorkSpaceSpy = sinon.spy(this.workspaceMock, '_isVerticalGroupedWorkSpace');
            const isGroupedAllDayPanelSpy = sinon.spy(this.workspaceMock, 'isGroupedAllDayPanel');

            this.virtualScrolling.updateState({ top: 200 });

            assert.ok(isVerticalGroupedWorkSpaceSpy.called, '_isVerticalGroupedWorkSpaceSpy was called');
            assert.ok(getTotalRowCountSpy.called, 'getTotalRowCountSpy was called');
            assert.notOk(isGroupedAllDayPanelSpy.called, 'isGroupedAllDayPanel was not called');
            assert.equal(getTotalRowCountSpy.getCall(0).args[0], 0, 'Correct first parameter');
            assert.equal(getTotalRowCountSpy.getCall(0).args[1], false, 'Correct second parameter');
        });
    });

    module('Scrolling', function() {
        test('State should be correct on scrolling Down', function(assert) {
            this.prepareInstance();

            [
                { top: 10, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                { top: 66, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                { top: 120, stateTop: 0, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
                { top: 200, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                { top: 3980, stateTop: 3980, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
                { top: 4950, stateTop: 4950, topVirtualRowCount: 96, bottomVirtualRowCount: 0, rowCount: 4 }
            ].forEach(step => {
                this.scrollDown(step.top);

                const state = this.virtualScrolling.getState();

                assert.equal(state.pageSize, 6, 'pageSize');
                assert.equal(state.rowCount, step.rowCount, 'rowCount');

                assert.equal(state.startIndex, state.topVirtualRowCount, 'startIndex');
                assert.deepEqual(state.prevScrollPosition.top, step.stateTop, 'scroll top');
                assert.equal(state.topVirtualRowCount, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
                assert.equal(state.bottomVirtualRowCount, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
            });
        });

        test('State should be correct on scrolling Up', function(assert) {
            this.prepareInstance();

            [
                { top: 4950, stateTop: 4950, topVirtualRowCount: 96, bottomVirtualRowCount: 0, rowCount: 4 },
                { top: 3980, stateTop: 3980, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
                { top: 200, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                { top: 120, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                { top: 66, stateTop: 200, topVirtualRowCount: 1, bottomVirtualRowCount: 87, rowCount: 12 },
                { top: 10, stateTop: 10, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 }
            ].forEach(step => {
                this.scrollDown(step.top);

                const state = this.virtualScrolling.getState();

                assert.equal(state.pageSize, 6, 'pageSize');
                assert.equal(state.rowCount, step.rowCount, 'rowCount');

                assert.equal(state.startIndex, state.topVirtualRowCount, 'startIndex');
                assert.deepEqual(state.prevScrollPosition.top, step.stateTop, 'scroll top');
                assert.equal(state.topVirtualRowCount, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
                assert.equal(state.bottomVirtualRowCount, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
            });
        });

        test('Check virtual rows height', function(assert) {
            this.prepareInstance();

            [
                { top: 10, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                { top: 13, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                { top: 66, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                { top: 120, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                { top: 150, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
                { top: 3980, bottomVirtualRowHeight: 600, topVirtualRowHeight: 3800 },
                { top: 4950, bottomVirtualRowHeight: 0, topVirtualRowHeight: 4800 }
            ].forEach(step => {
                this.scrollDown(step.top);

                const state = this.virtualScrolling.getState();

                assert.deepEqual(state.topVirtualRowHeight, step.topVirtualRowHeight, 'Layout map topVirtualRowHeight');
                assert.deepEqual(state.bottomVirtualRowHeight, step.bottomVirtualRowHeight, 'Layout map bottomVirtualRowHeight');
            });
        });

        test('Scroll event position should be checked correctly before update state', function(assert) {
            this.prepareInstance();
            const spy = sinon.spy(this.virtualScrolling, 'needUpdateState');

            [
                { y: 50, expectedNeedUpdate: false },
                { y: 100, expectedNeedUpdate: false },
                { y: 150, expectedNeedUpdate: false },
                { y: 200, expectedNeedUpdate: true },
                { y: 300, expectedNeedUpdate: false },
                { y: 400, expectedNeedUpdate: true }
            ].forEach((option, index) => {
                this.scrollDown(option.y);
                assert.equal(
                    spy.getCall(index).returnValue,
                    option.expectedNeedUpdate,
                    `State updated ${option.expectedNeedUpdate} if scrollY: ${option.y}`
                );
            });
        });
    });

    module('Validation', function() {
        [5, 15, 25, 50, 100, 150, 200].forEach(totalRowCount => {
            test(`Check virtual scrolling state where totalRowCount: ${totalRowCount}`, function(assert) {
                let offset;

                this.prepareInstance({ totalRowCount });

                for(offset = 0; offset <= 825; offset += 15) {
                    try {
                        this.scrollDown(offset);
                    } catch(e) {
                        assert.ok(false, e.message);
                    }
                }

                for(; offset >= 0; offset -= 10) {
                    try {
                        this.scrollDown(offset);
                    } catch(e) {
                        assert.ok(false, e.message);
                    }
                }

                assert.ok(true, 'State validation checked');
            });
        });
    });
});
