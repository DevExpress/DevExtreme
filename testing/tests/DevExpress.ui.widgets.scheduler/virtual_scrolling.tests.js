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
            renderRWorkspace: noop
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
    }
},
() => {
    test('Init', function(assert) {
        const state = this.virtualScrolling.getState();

        assert.equal(state.pageSize, 6, 'PageSize');
        assert.equal(state.topVirtualRowCount, 0, 'Top virtual row count');
        assert.equal(state.rowCount, 6, 'Data row count');
        assert.equal(state.bottomVirtualRowCount, 94, 'Bottom virtual row count');
    });

    test('State if scrolling Down', function(assert) {
        [
            { top: 10, topVirtualRowCount: 0, bottomVirtualRowCount: 94, rowCount: 6 },
            { top: 13, topVirtualRowCount: 0, bottomVirtualRowCount: 94, rowCount: 6 },
            { top: 66, topVirtualRowCount: 1, bottomVirtualRowCount: 93, rowCount: 6 },
            { top: 120, topVirtualRowCount: 2, bottomVirtualRowCount: 92, rowCount: 6 },
            { top: 150, topVirtualRowCount: 3, bottomVirtualRowCount: 91, rowCount: 6 },
            { top: 3980, topVirtualRowCount: 79, bottomVirtualRowCount: 15, rowCount: 6 },
            { top: 4950, topVirtualRowCount: 99, bottomVirtualRowCount: 0, rowCount: 1 }
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
            { top: 4950, topVirtualRowCount: 99, bottomVirtualRowCount: 0, rowCount: 1 },
            { top: 3980, topVirtualRowCount: 79, bottomVirtualRowCount: 15, rowCount: 6 },
            { top: 150, topVirtualRowCount: 3, bottomVirtualRowCount: 91, rowCount: 6 },
            { top: 120, topVirtualRowCount: 2, bottomVirtualRowCount: 92, rowCount: 6 },
            { top: 66, topVirtualRowCount: 1, bottomVirtualRowCount: 93, rowCount: 6 },
            { top: 13, topVirtualRowCount: 0, bottomVirtualRowCount: 94, rowCount: 6 },
            { top: 10, topVirtualRowCount: 0, bottomVirtualRowCount: 94, rowCount: 6 }
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
            { top: 10, bottomVirtualRowHeight: 4700, topVirtualRowHeight: 0 },
            { top: 13, bottomVirtualRowHeight: 4700, topVirtualRowHeight: 0 },
            { top: 66, bottomVirtualRowHeight: 4650, topVirtualRowHeight: 50 },
            { top: 120, bottomVirtualRowHeight: 4600, topVirtualRowHeight: 100 },
            { top: 150, bottomVirtualRowHeight: 4550, topVirtualRowHeight: 150 },
            { top: 3980, bottomVirtualRowHeight: 750, topVirtualRowHeight: 3950 },
            { top: 4950, bottomVirtualRowHeight: 0, topVirtualRowHeight: 4950 }
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
});
