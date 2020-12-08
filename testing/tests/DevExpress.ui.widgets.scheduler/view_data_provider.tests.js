import ViewDataProvider from 'ui/scheduler/workspaces/view_data_provider';

const { test, module } = QUnit;

const testViewDataMap = {
    horizontalGrouping: [[
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_2',
            groupIndex: 2
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_2',
            groupIndex: 2
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_3',
            groupIndex: 3
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_3',
            groupIndex: 3
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 0, 0),
            endDate: new Date(2020, 7, 24, 0, 30),
            groups: 'group_2',
            groupIndex: 2
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 0, 0),
            endDate: new Date(2020, 7, 25, 0, 30),
            groups: 'group_2',
            groupIndex: 2
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 1, 0),
            endDate: new Date(2020, 7, 24, 1, 30),
            groups: 'group_3',
            groupIndex: 3
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 1, 0),
            endDate: new Date(2020, 7, 25, 1, 30),
            groups: 'group_3',
            groupIndex: 3
        },
    ]],
    verticalGrouping: [[
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_2',
            groupIndex: 2,
            index: 0
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_2',
            groupIndex: 2,
            index: 1
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 0, 0),
            endDate: new Date(2020, 7, 24, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            index: 0
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 0, 0),
            endDate: new Date(2020, 7, 25, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            index: 1
        }
    ],
    [
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_3',
            groupIndex: 3,
            index: 0
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_3',
            groupIndex: 3,
            index: 1
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 1, 0),
            endDate: new Date(2020, 7, 24, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            index: 0
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 1, 0),
            endDate: new Date(2020, 7, 25, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            index: 1
        }
    ]]
};

const verticalWorkSpaceMock = {
    generateRenderOptions: () => ({
        startRowIndex: 0,
        rowCount: 4,
        topVirtualRowHeight: undefined,
        bottomVirtualRowHeight: undefined,
        cellCountInGroupRow: undefined,
        groupOrientation: 'vertical'
    }),
    _isVerticalGroupedWorkSpace: () => true,
    _isShowAllDayPanel: () => true,
    isGroupedAllDayPanel: () => true,
    isVirtualScrolling: () => false,
};
const horizontalWorkSpaceMock = {
    generateRenderOptions: () => ({
        startRowIndex: 0,
        rowCount: 2,
        topVirtualRowHeight: undefined,
        bottomVirtualRowHeight: undefined,
        cellCountInGroupRow: undefined,
        groupOrientation: 'horizontal'
    }),
    _isVerticalGroupedWorkSpace: () => false,
    _isShowAllDayPanel: () => true,
    isGroupedAllDayPanel: () => false,
    isVirtualScrolling: () => false,
};

module('View Data Provider', () => {
    module('API', {
        beforeEach: function() {
            this.viewDataProvider = new ViewDataProvider(verticalWorkSpaceMock);

            this.viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;

            this.viewDataProvider.update(false);
        }
    }, () => {
        test('getStartDate', function(assert) {
            const startDate = this.viewDataProvider.getStartDate();

            assert.deepEqual(startDate, new Date(2020, 7, 24), 'Start date is correct');
        });

        test('getGroupStartDate', function(assert) {
            const group2StartDate = this.viewDataProvider.getGroupStartDate(2);

            assert.deepEqual(group2StartDate, new Date(2020, 7, 24), 'Group 2 start date is correct');

            const group3StartDate = this.viewDataProvider.getGroupStartDate(3);

            assert.deepEqual(group3StartDate, new Date(2020, 7, 24, 1), 'Group 3 start date is correct');
        });

        test('getGroupEndDate', function(assert) {
            const group2EndDate = this.viewDataProvider.getGroupEndDate(2);

            assert.deepEqual(group2EndDate, new Date(2020, 7, 25, 0, 30), 'Group 2 end date is correct');

            const group3EndDate = this.viewDataProvider.getGroupEndDate(3);

            assert.deepEqual(group3EndDate, new Date(2020, 7, 25, 1, 30), 'Group 3 end date is correct');
        });

        module('findGroupCellStartDate', function() {

            test('Simple appointments', function(assert) {
                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 24, 0, 10), new Date(2020, 7, 24, 1, 10)),
                    new Date(2020, 7, 24),
                    'Group 2 cell 0 start date is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 20)),
                    new Date(2020, 7, 25),
                    'Group 2 cell 1 start date is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 24, 0, 11), new Date(2020, 7, 24, 1, 22)),
                    new Date(2020, 7, 24, 1),
                    'Group 3 cell 0 start date is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 30)),
                    new Date(2020, 7, 25, 1),
                    'Group 3 cell 1 start date is correct'
                );
            });

            test('AllDay appointments', function(assert) {
                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                    new Date(2020, 7, 25, 0, 11),
                    'Group 2 cell 1 allDay start date is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                    new Date(2020, 7, 25, 0, 11),
                    'Group 2 cell 1 allDay start date is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 23, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                    new Date(2020, 7, 24),
                    'Group 2 cell 1 allDay start date is correct when startDate is out of view'
                );
            });
        });

        test('getCellsGroup', function(assert) {
            const group2Info = this.viewDataProvider.getCellsGroup(2);

            assert.deepEqual(group2Info, 'group_2', 'Group 2 cells group is correct');

            const group3Info = this.viewDataProvider.getCellsGroup(3);

            assert.deepEqual(group3Info, 'group_3', 'Group 3 cells group is correct');
        });

        test('getGroupIndices', function(assert) {
            const groupIndices = this.viewDataProvider.getGroupIndices();

            assert.deepEqual(groupIndices, [2, 3], 'Indices are correct');
        });

        test('getLasGroupCellPosition', function(assert) {
            assert.deepEqual(
                this.viewDataProvider.getLasGroupCellPosition(2),
                { rowIndex: 1, cellIndex: 0 },
                'Last position for the group 2 is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getLasGroupCellPosition(3),
                { rowIndex: 3, cellIndex: 0 },
                'Last position for the group 3 is correct'
            );
        });

        test('getLasGroupCellIndex', function(assert) {
            assert.deepEqual(
                this.viewDataProvider.getLasGroupCellPosition(2),
                { rowIndex: 1, cellIndex: 0 },
                'Last position for the group 2 is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getLasGroupCellPosition(3),
                { rowIndex: 3, cellIndex: 0 },
                'Last position for the group 3 is correct'
            );
        });

        test('getRowCountInGroup', function(assert) {
            assert.deepEqual(
                this.viewDataProvider.getRowCountInGroup(2),
                1,
                'Row count in group 2 is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getRowCountInGroup(3),
                1,
                'Row count in group 3 is correct'
            );
        });

        module('getCellData', function() {
            test('Cell data of the allDayPanel', function(assert) {
                assert.deepEqual(
                    this.viewDataProvider.getCellData(0, 0),
                    testViewDataMap.verticalGrouping[0][0],
                    'Cell data [0, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(0, 1),
                    testViewDataMap.verticalGrouping[0][1],
                    'Cell data [0, 1] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(2, 0),
                    testViewDataMap.verticalGrouping[2][0],
                    'Cell data [2, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(2, 1),
                    testViewDataMap.verticalGrouping[2][1],
                    'Cell data [2, 1] is correct'
                );
            });

            test('Cell data of the dateTable', function(assert) {
                assert.deepEqual(
                    this.viewDataProvider.getCellData(1, 0),
                    testViewDataMap.verticalGrouping[1][0],
                    'Cell data [1, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(1, 1),
                    testViewDataMap.verticalGrouping[1][1],
                    'Cell data [1, 1] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(3, 0),
                    testViewDataMap.verticalGrouping[3][0],
                    'Cell data [3, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(3, 1),
                    testViewDataMap.verticalGrouping[3][1],
                    'Cell data [3, 1] is correct'
                );
            });

            test('isGroupIntersectDateInterval', function(assert) {
                assert.ok(
                    this.viewDataProvider.isGroupIntersectDateInterval(2, new Date(2020, 7, 24), new Date(2020, 7, 24, 15)),
                    'View date interval intersected'
                );

                assert.notOk(
                    this.viewDataProvider.isGroupIntersectDateInterval(2, new Date(2020, 7, 23), new Date(2020, 7, 23, 15)),
                    'View date interval is not Intersected'
                );

                assert.notOk(
                    this.viewDataProvider.isGroupIntersectDateInterval(2, new Date(2020, 7, 26), new Date(2020, 7, 26, 15)),
                    'View date interval is not Intersected'
                );
            });
        });

        module('findCellPositionInMap', function() {
            module('Vertical Grouping', function() {
                test('Should return correct cell position for the allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    let position = viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                    position = viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                });

                test('Should return correct cell position for the not allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24)),
                        { rowIndex: 1, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24, 0, 29)),
                        { rowIndex: 1, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1)),
                        { rowIndex: 3, cellIndex: 0 },
                        '2nd cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1, 29)),
                        { rowIndex: 3, cellIndex: 0 },
                        '2nd cell position is correct'
                    );
                });
            });

            module('Horizontal Grouping', {
                before: function() {
                    this.viewDataProvider = new ViewDataProvider(horizontalWorkSpaceMock);

                    this.viewDataProvider.completeViewDataMap = testViewDataMap.horizontalGrouping;
                    this.viewDataProvider.update(false);
                }
            }, function() {
                test('Should return correct cell position for the allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    let position = viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                    position = viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                });

                test('Should return correct cell position for the not allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24)),
                        { rowIndex: 1, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24, 0, 29)),
                        { rowIndex: 1, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1)),
                        { rowIndex: 3, cellIndex: 0 },
                        '2nd cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1, 29)),
                        { rowIndex: 3, cellIndex: 0 },
                        '2nd cell position is correct'
                    );
                });
            });
        });
    });

    module('Generator', () => {
        test('Should generate correct groupedDataMap if vertical group orientation', function(assert) {
            this.viewDataProvider = new ViewDataProvider(verticalWorkSpaceMock);

            this.viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;

            this.viewDataProvider.update(false);

            const viewDataMap = testViewDataMap.verticalGrouping;

            const expectedGroupedDataMap = [
                undefined,
                undefined,
                [
                    [
                        {
                            cellData: viewDataMap[0][0],
                            position: {
                                rowIndex: 0,
                                cellIndex: 0
                            }
                        },
                        {
                            cellData: viewDataMap[0][1],
                            position: {
                                rowIndex: 0,
                                cellIndex: 1
                            }
                        }
                    ],
                    [{
                        cellData: viewDataMap[1][0],
                        position: {
                            rowIndex: 1,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: viewDataMap[1][1],
                        position: {
                            rowIndex: 1,
                            cellIndex: 1
                        }
                    }]
                ],
                [
                    [
                        {
                            cellData: viewDataMap[2][0],
                            position: {
                                rowIndex: 2,
                                cellIndex: 0
                            }
                        },
                        {
                            cellData: viewDataMap[2][1],
                            position: {
                                rowIndex: 2,
                                cellIndex: 1
                            }
                        }
                    ],
                    [{
                        cellData: viewDataMap[3][0],
                        position: {
                            rowIndex: 3,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: viewDataMap[3][1],
                        position: {
                            rowIndex: 3,
                            cellIndex: 1
                        }
                    }]
                ]
            ];

            assert.deepEqual(
                this.viewDataProvider.groupedDataMap,
                expectedGroupedDataMap,
                'Grouped data is correct'
            );
        });

        test('Should generate correct groupedDataMap if horizontal group orientation', function(assert) {
            this.viewDataProvider = new ViewDataProvider(horizontalWorkSpaceMock);

            this.viewDataProvider.completeViewDataMap = testViewDataMap.horizontalGrouping;

            this.viewDataProvider.update(false);

            const viewDataMap = testViewDataMap.horizontalGrouping;

            const expectedGroupedDataMap = [
                undefined,
                undefined,
                [
                    [{
                        cellData: viewDataMap[1][0],
                        position: {
                            rowIndex: 0,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: viewDataMap[1][1],
                        position: {
                            rowIndex: 0,
                            cellIndex: 1
                        }
                    }]
                ],
                [
                    [{
                        cellData: viewDataMap[1][2],
                        position: {
                            rowIndex: 0,
                            cellIndex: 2
                        }
                    },
                    {
                        cellData: viewDataMap[1][3],
                        position: {
                            rowIndex: 0,
                            cellIndex: 3
                        }
                    }]
                ]
            ];

            assert.deepEqual(
                this.viewDataProvider.groupedDataMap,
                expectedGroupedDataMap,
                'Grouped data is correct'
            );
        });

        module('Data Generation with virtual scrolling', () => {
            const virtualVerticalWorkSpaceMock = {
                generateRenderOptions: () => ({
                    startRowIndex: 1,
                    rowCount: 2,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 2,
                    groupOrientation: 'vertical'
                }),
                _isVerticalGroupedWorkSpace: () => true,
                _isShowAllDayPanel: () => true,
                isGroupedAllDayPanel: () => true,
                isVirtualScrolling: () => true,
            };
            const virtualHorizontalWorkSpaceMock = {
                generateRenderOptions: () => ({
                    startRowIndex: 1,
                    rowCount: 1,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 1,
                    groupOrientation: 'horizontal'
                }),
                _isVerticalGroupedWorkSpace: () => false,
                _isShowAllDayPanel: () => true,
                isGroupedAllDayPanel: () => false,
                isVirtualScrolling: () => true,
            };
            const horizontalDataMap = [[
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_2',
                    groupIndex: 2
                },
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_3',
                    groupIndex: 3
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 0),
                    endDate: new Date(2020, 7, 24, 0, 30),
                    groups: 'group_2',
                    groupIndex: 2
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 1, 0),
                    endDate: new Date(2020, 7, 24, 1, 30),
                    groups: 'group_3',
                    groupIndex: 3
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_2',
                    groupIndex: 2
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_3',
                    groupIndex: 3
                },
            ]];

            test('Should generate correct viewData in virtual scrolling mode if vertical grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                viewDataProvider.update(false);

                const completeViewDataMap = testViewDataMap.verticalGrouping;

                const expectedViewData = {
                    groupedData: [{
                        dateTable: [completeViewDataMap[1]],
                        groupIndex: 2,
                        isGroupedAllDayPanel: true,
                    }, {
                        allDayPanel: completeViewDataMap[2],
                        dateTable: [],
                        groupIndex: 3,
                        isGroupedAllDayPanel: true,
                    }],
                };

                const viewData = viewDataProvider.viewData;

                assert.deepEqual(
                    viewData.groupedData,
                    expectedViewData.groupedData,
                    'View data is correct'
                );
                assert.equal(viewData.topVirtualRowHeight, 50, 'Correct topVirtualRowHeight');
                assert.equal(viewData.bottomVirtualRowHeight, 50, 'Correct bottomVirtualRowHeight');
                assert.equal(viewData.cellCountInGroupRow, 2, 'Correct cellCountInGroupRow');
            });

            test('Should generate correct viewDataMap in virtual scrolling mode if vertical grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                viewDataProvider.update(false);

                const completeViewDataMap = testViewDataMap.verticalGrouping;

                const expectedViewDataMap = [[{
                    cellData: completeViewDataMap[1][0],
                    position: { rowIndex: 0, cellIndex: 0 },
                }, {
                    cellData: completeViewDataMap[1][1],
                    position: { rowIndex: 0, cellIndex: 1 },
                }], [{
                    cellData: completeViewDataMap[2][0],
                    position: { rowIndex: 1, cellIndex: 0 },
                }, {
                    cellData: completeViewDataMap[2][1],
                    position: { rowIndex: 1, cellIndex: 1 },
                }]];

                const viewDataMap = viewDataProvider.viewDataMap;

                assert.deepEqual(
                    viewDataMap,
                    expectedViewDataMap,
                    'View data map is correct'
                );
            });

            test('Should generate correct groupedDataMap in virtual scrolling mode if vertical grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                viewDataProvider.update(false);

                const completeViewDataMap = testViewDataMap.verticalGrouping;

                const expectedGroupedDataMap = [
                    undefined,
                    undefined,
                    [[{
                        cellData: completeViewDataMap[1][0],
                        position: { rowIndex: 0, cellIndex: 0 },
                    }, {
                        cellData: completeViewDataMap[1][1],
                        position: { rowIndex: 0, cellIndex: 1 },
                    }]], [[{
                        cellData: completeViewDataMap[2][0],
                        position: { rowIndex: 1, cellIndex: 0 },
                    }, {
                        cellData: completeViewDataMap[2][1],
                        position: { rowIndex: 1, cellIndex: 1 },
                    }]]];

                const groupedDataMap = viewDataProvider.groupedDataMap;

                assert.deepEqual(
                    groupedDataMap,
                    expectedGroupedDataMap,
                    'View data map is correct'
                );
            });

            test('Should generate correct viewData in virtual scrolling mode if horizontal grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualHorizontalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = horizontalDataMap;
                viewDataProvider.update(false);

                const completeViewDataMap = horizontalDataMap;

                const expectedViewData = {
                    groupedData: [{
                        allDayPanel: completeViewDataMap[0],
                        dateTable: [completeViewDataMap[2]],
                        groupIndex: 2,
                        isGroupedAllDayPanel: false,
                    }],
                };

                const viewData = viewDataProvider.viewData;

                assert.deepEqual(
                    viewData.groupedData,
                    expectedViewData.groupedData,
                    'View data is correct'
                );
                assert.equal(viewData.topVirtualRowHeight, 50, 'Correct topVirtualRowHeight');
                assert.equal(viewData.bottomVirtualRowHeight, 50, 'Correct bottomVirtualRowHeight');
                assert.equal(viewData.cellCountInGroupRow, 1, 'Correct cellCountInGroupRow');
            });

            test('Should generate correct viewDataMap in virtual scrolling mode if horizontal grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualHorizontalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = horizontalDataMap;
                viewDataProvider.update(false);

                const completeViewDataMap = horizontalDataMap;

                const expectedViewDataMap = [[{
                    cellData: completeViewDataMap[2][0],
                    position: { rowIndex: 0, cellIndex: 0 },
                }, {
                    cellData: completeViewDataMap[2][1],
                    position: { rowIndex: 0, cellIndex: 1 },
                }]];

                const viewDataMap = viewDataProvider.viewDataMap;

                assert.deepEqual(
                    viewDataMap,
                    expectedViewDataMap,
                    'View data map is correct'
                );
            });

            test('Should generate correct groupedDataMap in virtual scrolling mode if horizontal grouping is used', function(assert) {
                const viewDataProvider = new ViewDataProvider(virtualHorizontalWorkSpaceMock);
                viewDataProvider.completeViewDataMap = horizontalDataMap;
                viewDataProvider.update(false);

                const completeViewDataMap = horizontalDataMap;

                const expectedGroupedDataMap = [
                    undefined,
                    undefined,
                    [[{
                        cellData: completeViewDataMap[2][0],
                        position: { rowIndex: 0, cellIndex: 0 },
                    }]], [[{
                        cellData: completeViewDataMap[2][1],
                        position: { rowIndex: 0, cellIndex: 1 },
                    }]]];

                const groupedDataMap = viewDataProvider.groupedDataMap;

                assert.deepEqual(
                    groupedDataMap,
                    expectedGroupedDataMap,
                    'View data map is correct'
                );
            });
        });
    });
});
