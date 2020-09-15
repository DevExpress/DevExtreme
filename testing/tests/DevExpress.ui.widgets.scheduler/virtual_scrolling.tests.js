import VirtualScrolling from 'ui/scheduler/workspaces/ui.scheduler.virtual_scrolling';
import { noop } from 'core/utils/common';

const { test, module } = QUnit;

module('Virtual Scrolling model', {
    beforeEach: function() {
        this.worksSpaceMock = {
            _getGroupCount: () => 0,
            _getTotalRowCount: () => 100,
            _getTotalCellCount: () => 200,
            _getDateTableCellClass: () => 'fake-cell-class',
            _getDateTableRowClass: () => 'fake-row-class',
            _options: {
                dataCellTemplate: noop,
                groupByDate: false
            },
            option: name => this.worksSpaceMock._options[name],
            _getCellData: noop,
            _insertAllDayRowsIntoDateTable: noop,
            _allDayPanels: undefined,
            isGroupedAllDayPanel: noop,
            renderRWorkspace: noop,
            renderRAppointments: noop,
            invoke: noop,
            _isVerticalGroupedWorkSpace: () => false,
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

        this.viewportHeight = 300;
        this.virtualScrolling = new VirtualScrolling(this.worksSpaceMock, this.viewportHeight, this.scrollableMock);
        this.virtualScrolling._getRenderTimeout = () => -1;
    }
},
() => {
    test('Init', function(assert) {
        const state = this.virtualScrolling.getState();

        assert.equal(state.pageSize, 6, 'PageSize');
        assert.equal(state.topVirtualRowCount, 0, 'Top virtual row count');
        assert.equal(state.rowCount, 9, 'Data row count');
        assert.equal(state.bottomVirtualRowCount, 91, 'Bottom virtual row count');
    });

    test('State if scrolling Down', function(assert) {
        [
            { top: 10, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
            { top: 13, topVirtualRowCount: 0, bottomVirtualRowCount: 91, rowCount: 9 },
            { top: 66, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 },
            { top: 120, topVirtualRowCount: 0, bottomVirtualRowCount: 89, rowCount: 11 },
            { top: 150, topVirtualRowCount: 0, bottomVirtualRowCount: 88, rowCount: 12 },
            { top: 3980, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
            { top: 4950, topVirtualRowCount: 96, bottomVirtualRowCount: 0, rowCount: 4 }
        ].forEach(step => {
            this.scrollDown(step.top);

            const state = this.virtualScrolling.getState();

            assert.equal(state.pageSize, 6, 'pageSize');
            assert.equal(state.rowCount, step.rowCount, 'rowCount');

            assert.equal(state.startIndex, state.topVirtualRowCount, 'startIndex');
            assert.deepEqual(state.scrollOffset, { top: step.top }, 'ScrollOffset');
            assert.equal(state.topVirtualRowCount, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
            assert.equal(state.bottomVirtualRowCount, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
        });
    });

    test('State if scrolling Up', function(assert) {
        [
            { top: 4950, topVirtualRowCount: 96, bottomVirtualRowCount: 0, rowCount: 4 },
            { top: 3980, topVirtualRowCount: 76, bottomVirtualRowCount: 12, rowCount: 12 },
            { top: 150, topVirtualRowCount: 0, bottomVirtualRowCount: 88, rowCount: 12 },
            { top: 120, topVirtualRowCount: 0, bottomVirtualRowCount: 89, rowCount: 11 },
            { top: 66, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 },
            { top: 13, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 },
            { top: 10, topVirtualRowCount: 0, bottomVirtualRowCount: 90, rowCount: 10 }
        ].forEach(step => {
            this.scrollDown(step.top);

            const state = this.virtualScrolling.getState();

            assert.equal(state.pageSize, 6, 'pageSize');
            assert.equal(state.rowCount, step.rowCount, 'rowCount');

            assert.equal(state.startIndex, state.topVirtualRowCount, 'startIndex');
            assert.deepEqual(state.scrollOffset, { top: step.top }, 'ScrollOffset');
            assert.equal(state.topVirtualRowCount, step.topVirtualRowCount, `Top virtual row count: ${step.topVirtualRowCount}`);
            assert.equal(state.bottomVirtualRowCount, step.bottomVirtualRowCount, `Bottom virtual row count: ${step.bottomVirtualRowCount}`);
        });
    });

    test('Virtual heights', function(assert) {
        [
            { top: 10, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
            { top: 13, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 0 },
            { top: 66, bottomVirtualRowHeight: 4500, topVirtualRowHeight: 0 },
            { top: 120, bottomVirtualRowHeight: 4450, topVirtualRowHeight: 0 },
            { top: 150, bottomVirtualRowHeight: 4400, topVirtualRowHeight: 0 },
            { top: 3980, bottomVirtualRowHeight: 600, topVirtualRowHeight: 3800 },
            { top: 4950, bottomVirtualRowHeight: 0, topVirtualRowHeight: 4800 }
        ].forEach(step => {
            this.scrollDown(step.top);

            const state = this.virtualScrolling.getState();

            assert.deepEqual(state.topVirtualRowHeight, step.topVirtualRowHeight, 'Layout map topVirtualRowHeight');
            assert.deepEqual(state.bottomVirtualRowHeight, step.bottomVirtualRowHeight, 'Layout map bottomVirtualRowHeight');
        });
    });

    test('State validation', function(assert) {
        let offset;

        this.worksSpaceMock._getTotalRowCount = () => 25;

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

    test('It should call _getTotalRowCount with correct parameters', function(assert) {
        const getTotalRowCountSpy = sinon.spy(this.worksSpaceMock, '_getTotalRowCount');
        const isVerticalGroupedWorkSpaceSpy = sinon.spy(this.worksSpaceMock, '_isVerticalGroupedWorkSpace');
        const isGroupedAllDayPanelSpy = sinon.spy(this.worksSpaceMock, 'isGroupedAllDayPanel');

        this.virtualScrolling._updateState(0);

        assert.ok(isVerticalGroupedWorkSpaceSpy.called, '_isVerticalGroupedWorkSpaceSpy was called');
        assert.ok(getTotalRowCountSpy.called, 'getTotalRowCountSpy was called');
        assert.notOk(isGroupedAllDayPanelSpy.called, 'isGroupedAllDayPanel was not called');
        assert.equal(getTotalRowCountSpy.getCall(0).args[0], 0, 'Correct first parameter');
        assert.equal(getTotalRowCountSpy.getCall(0).args[1], false, 'Correct second parameter');
    });
});
