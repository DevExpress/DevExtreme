import VirtualSelectionState from 'ui/scheduler/workspaces/virtual_selection_state';

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
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_2',
                groupIndex: 2,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                groups: 'group_3',
                groupIndex: 3,
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_3',
                groupIndex: 3,
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
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 0, 0),
                endDate: new Date(2020, 7, 25, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 24, 1, 0),
                endDate: new Date(2020, 7, 24, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 1, 0),
                endDate: new Date(2020, 7, 25, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
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
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_2',
                groupIndex: 2,
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
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 0, 0),
                endDate: new Date(2020, 7, 25, 0, 30),
                groups: 'group_2',
                groupIndex: 2,
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
            },
        },
        {
            cellData: {
                allDay: true,
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                groups: 'group_3',
                groupIndex: 3,
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
                groupIndex: 3
            },
        },
        {
            cellData: {
                allDay: false,
                startDate: new Date(2020, 7, 25, 1, 0),
                endDate: new Date(2020, 7, 25, 1, 30),
                groups: 'group_3',
                groupIndex: 3,
            },
        },
    ]],
};

const horizontalGroupingViewDataProviderMock = {
    getCellData: (rowIndex, columnIndex) => testViewDataMap
        .horizontalGrouping[rowIndex][columnIndex].cellData,
    viewDataMap: testViewDataMap.horizontalGrouping,
};
const verticalGroupingViewDataProviderMock = {
    getCellData: (rowIndex, columnIndex) => testViewDataMap
        .verticalGrouping[rowIndex][columnIndex].cellData,
    viewDataMap: testViewDataMap.verticalGrouping,
};

module('Virtual Selection State', () => {
    test('Focused cell should be set correctly', function(assert) {
        const virtualSelectionState = new VirtualSelectionState(horizontalGroupingViewDataProviderMock);

        virtualSelectionState.setFocusedCell(1, 1, false);

        const focusedCellData = virtualSelectionState._focusedCell;

        assert.deepEqual(
            focusedCellData,
            testViewDataMap.horizontalGrouping[1][1].cellData,
            'Correct focused cell data',
        );
    });

    test('"getFocusedCell" should work correctly when horizontal groupin is used', function(assert) {
        const virtualSelectionState = new VirtualSelectionState(horizontalGroupingViewDataProviderMock);

        virtualSelectionState.setFocusedCell(1, 1, false);

        const focusedCell = virtualSelectionState.getFocusedCell(false);

        assert.deepEqual(
            focusedCell,
            {
                cellData: testViewDataMap.horizontalGrouping[1][1].cellData,
                coordinates: { cellIndex: 1, rowIndex: 1 },
            },
            'Correct focused cell',
        );
    });

    test('"getFocusedCell" should work correctly when vertical grouping is used', function(assert) {
        const virtualSelectionState = new VirtualSelectionState(verticalGroupingViewDataProviderMock);

        virtualSelectionState.setFocusedCell(1, 1, false);

        const focusedCell = virtualSelectionState.getFocusedCell(true);

        assert.deepEqual(
            focusedCell,
            {
                cellData: testViewDataMap.verticalGrouping[1][1].cellData,
                coordinates: { cellIndex: 1, rowIndex: 1 },
            },
            'Correct focused cell',
        );
    });

    test('"setSelectedCells" should work correctly', function(assert) {
        const virtualSelectionState = new VirtualSelectionState({
            ...horizontalGroupingViewDataProviderMock,
            getCellsByGroupIndexAndAllDay: () => [[
                testViewDataMap.horizontalGrouping[1][0].cellData,
                testViewDataMap.horizontalGrouping[1][1].cellData,
            ]],
        });

        virtualSelectionState.setSelectedCells({
            rowIndex: 1,
            columnIndex: 0,
            allDay: false,
        }, {
            rowIndex: 1,
            columnIndex: 1,
            allDay: false,
        });

        const selectedCells = virtualSelectionState.getSelectedCells();

        assert.deepEqual(
            selectedCells,
            [testViewDataMap.horizontalGrouping[1][0].cellData, testViewDataMap.horizontalGrouping[1][1].cellData],
            'Correct focused cell',
        );
    });
});
