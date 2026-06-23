import CellsSelectionState from '__internal/scheduler/workspaces/cells_selection_state';

const { test, module } = QUnit;

const testViewDataMap = {
    horizontalGrouping: [[
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                groups: 'group_2',
                groupIndex: 2,
                index: 1,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_2',
                groupIndex: 2,
                index: 2,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                groups: 'group_3',
                groupIndex: 3,
                index: 5,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_3',
                groupIndex: 3,
                index: 6,
            },
        },
    ],
    [
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 24, 0, 0),
                endDate: new Date(2020, 7, 24, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
                index: 2,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 0, 0),
                endDate: new Date(2020, 7, 25, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
                index: 4,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 24, 1, 0),
                endDate: new Date(2020, 7, 24, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
                index: 6,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 1, 0),
                endDate: new Date(2020, 7, 25, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
                index: 7,
            },
        },
    ]],
    verticalGrouping: [[
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                groups: 'group_2',
                groupIndex: 2,
                index: 1,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_2',
                groupIndex: 2,
                index: 2,
            },
        },
    ],
    [
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 24, 0, 0),
                endDate: new Date(2020, 7, 24, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
                index: 3,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 0, 0),
                endDate: new Date(2020, 7, 25, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
                index: 4,
            },
        },
    ],
    [
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                groups: 'group_3',
                groupIndex: 3,
                index: 6,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_3',
                groupIndex: 3,
                index: 7,
            },
        },
    ],
    [
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 24, 1, 0),
                endDate: new Date(2020, 7, 24, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
                index: 8,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 1, 0),
                endDate: new Date(2020, 7, 25, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
                index: 9,
            },
        },
    ]],
};

const horizontalGroupingViewDataProviderMock = {
    getCellData: (rowIndex, columnIndex) => testViewDataMap
        .horizontalGrouping[rowIndex][columnIndex].cellData,
    viewDataMap: testViewDataMap.horizontalGrouping,
    findCellPositionInMap: () => ({ columnIndex: 1, rowIndex: 1 }),
};

module('Cells Selection State', () => {
    test('Focused cell should be set correctly', async function(assert) {
        const cellsSelectionState = new CellsSelectionState(horizontalGroupingViewDataProviderMock);

        cellsSelectionState.setFocusedCell(1, 1, false);

        const focusedCellData = cellsSelectionState.focusedCell;

        assert.deepEqual(
            focusedCellData,
            testViewDataMap.horizontalGrouping[1][1].cellData,
            'Correct focused cell data',
        );
    });

    test('"getFocusedCell" should work correctly', async function(assert) {
        const cellsSelectionState = new CellsSelectionState(horizontalGroupingViewDataProviderMock);

        cellsSelectionState.setFocusedCell(1, 1, false);

        const focusedCell = cellsSelectionState.getFocusedCell();

        assert.deepEqual(
            focusedCell,
            {
                cellData: testViewDataMap.horizontalGrouping[1][1].cellData,
                coordinates: { columnIndex: 1, rowIndex: 1 },
            },
            'Correct focused cell',
        );
    });

    test('"setSelectedCells" should work correctly', async function(assert) {
        const cellsSelectionState = new CellsSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsBetween: () => [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData
            ],
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        cellsSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        const selectedCells = cellsSelectionState.getSelectedCells();

        assert.deepEqual(
            selectedCells,
            [testViewDataMap.horizontalGrouping[1][0].cellData, testViewDataMap.horizontalGrouping[1][1].cellData],
            'Correct focused cell',
        );
    });

    test('"setSelectedCellsByData" should work correctly', async function(assert) {
        const cellsSelectionState = new CellsSelectionState();

        cellsSelectionState.setSelectedCellsByData([{
            startDate: new Date(2021, 5, 2),
            endDate: new Date(2021, 5, 3),
            allDay: true,
            groups: { resourceId: 1 },
            groupIndex: 1,
        }]);

        const selectedCells = cellsSelectionState.getSelectedCells();

        assert.deepEqual(
            selectedCells,
            [{
                startDate: new Date(2021, 5, 2),
                endDate: new Date(2021, 5, 3),
                allDay: true,
                groups: { resourceId: 1 },
                groupIndex: 1,
            }],
            'Correct focused cell',
        );
    });

    test('"releaseSelectedAndFocusedCells" should save current values as previous', async function(assert) {
        const cellsSelectionState = new CellsSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsBetween: () => [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        cellsSelectionState.setFocusedCell(1, 1, false);
        cellsSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        cellsSelectionState.releaseSelectedAndFocusedCells();

        assert.deepEqual(
            cellsSelectionState.prevFocusedCell,
            testViewDataMap.horizontalGrouping[1][1].cellData,
            'Correct cached focused cell data',
        );
        assert.deepEqual(
            cellsSelectionState.prevSelectedCells,
            [testViewDataMap.horizontalGrouping[1][0].cellData, testViewDataMap.horizontalGrouping[1][1].cellData],
            'Correct cachedfocused cell',
        );

        const prevFocusedCellData = cellsSelectionState.focusedCell;
        const prevSelectedCells = cellsSelectionState.selectedCells;

        assert.deepEqual(
            prevFocusedCellData,
            null,
            'Correct focused cell data',
        );
        assert.deepEqual(
            prevSelectedCells,
            null,
            'Correct selected cells',
        );
    });

    test('"clearSelectedAndFocusedCells" should not save current values as previous', async function(assert) {
        const cellsSelectionState = new CellsSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsBetween: () => [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        cellsSelectionState.setFocusedCell(1, 1, false);
        cellsSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        cellsSelectionState.clearSelectedAndFocusedCells();

        assert.deepEqual(
            cellsSelectionState.prevFocusedCell,
            null,
            'Correct cached focused cell data',
        );
        assert.deepEqual(
            cellsSelectionState.prevSelectedCells,
            null,
            'Correct cachedfocused cell',
        );

        const prevFocusedCellData = cellsSelectionState.focusedCell;
        const prevSelectedCells = cellsSelectionState.selectedCells;

        assert.deepEqual(
            prevFocusedCellData,
            null,
            'Correct focused cell data',
        );
        assert.deepEqual(
            prevSelectedCells,
            null,
            'Correct selected cells',
        );
    });

    test('"restoreSelectedAndFocusedCells" should restore cells correctly when previous state was saved', async function(assert) {
        const cellsSelectionState = new CellsSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsBetween: () => [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        cellsSelectionState.setFocusedCell(1, 1, false);
        cellsSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        cellsSelectionState.releaseSelectedAndFocusedCells();
        cellsSelectionState.restoreSelectedAndFocusedCells();

        assert.deepEqual(
            cellsSelectionState.getFocusedCell().cellData,
            testViewDataMap.horizontalGrouping[1][1].cellData,
            'Correct focused cell data',
        );
        assert.deepEqual(
            cellsSelectionState.getSelectedCells(),
            [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            'Correct selected cells',
        );
    });

    test('"restoreSelectedAndFocusedCells" should restore cells correctly when previous state was not saved', async function(assert) {
        const cellsSelectionState = new CellsSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsBetween: () => [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        cellsSelectionState.setFocusedCell(1, 1, false);
        cellsSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        cellsSelectionState.restoreSelectedAndFocusedCells();

        assert.deepEqual(
            cellsSelectionState.getFocusedCell().cellData,
            testViewDataMap.horizontalGrouping[1][1].cellData,
            'Correct focused cell data',
        );
        assert.deepEqual(
            cellsSelectionState.getSelectedCells(),
            [
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ],
            'Correct selected cells',
        );
    });
});
