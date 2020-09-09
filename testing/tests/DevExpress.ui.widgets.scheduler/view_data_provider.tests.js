import ViewDataProvider from 'ui/scheduler/workspaces/view_data_provider';

const { test, module } = QUnit;

const testViewData = {
    horizontalGrouping: {
        groupedData: [{
            groupIndex: 0,
            isGroupedAllDayPanel: false,
            allDayPanel: [
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
            dateTable: [
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
                    }
                ]
            ]
        }]
    },
    verticalGrouping: {
        groupedData: [{
            groupIndex: 2,
            isGroupedAllDayPanel: true,
            allDayPanel: [
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
                }
            ],
            dateTable: [
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
                    }
                ]
            ]
        },
        {
            groupIndex: 3,
            isGroupedAllDayPanel: true,
            allDayPanel: [
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
            dateTable: [
                [
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
                    }
                ]
            ]
        }]
    }
};

module('View Data Provider', () => {
    module('API', {
        beforeEach: function() {
            this.viewDataProvider = new ViewDataProvider();

            this.viewData = testViewData.verticalGrouping;

            this.viewDataProvider.viewData = this.viewData;
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

        test('getGroupCellStartDate', function(assert) {
            assert.deepEqual(
                this.viewDataProvider.getGroupCellStartDate(2, new Date(2020, 7, 24, 11, 11)),
                new Date(2020, 7, 24),
                'Group 2 cell 0 start date is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getGroupCellStartDate(2, new Date(2020, 7, 25, 11, 11)),
                new Date(2020, 7, 25),
                'Group 2 cell 1 start date is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getGroupCellStartDate(2, new Date(2020, 7, 24, 11, 11)),
                new Date(2020, 7, 24),
                'Group 3 cell 0 start date is correct'
            );

            assert.deepEqual(
                this.viewDataProvider.getGroupCellStartDate(2, new Date(2020, 7, 25, 11, 11)),
                new Date(2020, 7, 25),
                'Group 3 cell 1 start date is correct'
            );
        });

        test('getCellsGroup', function(assert) {
            const group2Info = this.viewDataProvider.getCellsGroup(2);

            assert.deepEqual(group2Info, 'group_2', 'Group 2 cells group is correct');

            const group3Info = this.viewDataProvider.getCellsGroup(3);

            assert.deepEqual(group3Info, 'group_3', 'Group 3 cells group is correct');
        });

        module('getCellData', function() {
            test('Cell data of the allDayPanel', function(assert) {
                this.viewDataProvider._generateMaps();

                const { groupedData } = this.viewData;

                assert.deepEqual(
                    this.viewDataProvider.getCellData(0, 0),
                    groupedData[0].allDayPanel[0],
                    'Cell data [0, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(0, 1),
                    groupedData[0].allDayPanel[1],
                    'Cell data [0, 1] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(2, 0),
                    groupedData[1].allDayPanel[0],
                    'Cell data [2, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(2, 1),
                    groupedData[1].allDayPanel[1],
                    'Cell data [2, 1] is correct'
                );
            });

            test('Cell data of the dateTable', function(assert) {
                this.viewDataProvider._generateMaps();

                const { groupedData } = this.viewData;

                assert.deepEqual(
                    this.viewDataProvider.getCellData(1, 0),
                    groupedData[0].dateTable[0][0],
                    'Cell data [1, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(1, 1),
                    groupedData[0].dateTable[0][1],
                    'Cell data [1, 1] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(3, 0),
                    groupedData[1].dateTable[0][0],
                    'Cell data [3, 0] is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getCellData(3, 1),
                    groupedData[1].dateTable[0][1],
                    'Cell data [3, 1] is correct'
                );
            });
        });

        module('findCellPositionInMap', function() {
            module('Vertical Grouping', function() {
                test('Should return correct cell position for the allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    viewDataProvider._generateMaps();

                    let position = viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                    position = viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                });

                test('Should return correct cell position for the not allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    viewDataProvider._generateMaps();

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
                    this.viewDataProvider = new ViewDataProvider();

                    this.viewData = testViewData.horizontalGrouping;

                    this.viewDataProvider.viewData = this.viewData;
                }
            }, function() {
                test('Should return correct cell position for the allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    viewDataProvider._generateMaps();

                    let position = viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                    position = viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                });

                test('Should return correct cell position for the not allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    viewDataProvider._generateMaps();

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
            this.viewDataProvider = new ViewDataProvider();

            this.viewDataProvider.viewData = testViewData.verticalGrouping;

            this.viewDataProvider._generateMaps();

            const { groupedData } = testViewData.verticalGrouping;

            const expectedGroupedDataMap = [
                undefined,
                undefined,
                [
                    [
                        {
                            cellData: groupedData[0].allDayPanel[0],
                            position: {
                                rowIndex: 0,
                                cellIndex: 0
                            }
                        },
                        {
                            cellData: groupedData[0].allDayPanel[1],
                            position: {
                                rowIndex: 0,
                                cellIndex: 1
                            }
                        }
                    ],
                    [{
                        cellData: groupedData[0].dateTable[0][0],
                        position: {
                            rowIndex: 1,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: groupedData[0].dateTable[0][1],
                        position: {
                            rowIndex: 1,
                            cellIndex: 1
                        }
                    }]
                ],
                [
                    [
                        {
                            cellData: groupedData[1].allDayPanel[0],
                            position: {
                                rowIndex: 2,
                                cellIndex: 0
                            }
                        },
                        {
                            cellData: groupedData[1].allDayPanel[1],
                            position: {
                                rowIndex: 2,
                                cellIndex: 1
                            }
                        }
                    ],
                    [{
                        cellData: groupedData[1].dateTable[0][0],
                        position: {
                            rowIndex: 3,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: groupedData[1].dateTable[0][1],
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
            this.viewDataProvider = new ViewDataProvider();

            this.viewDataProvider.viewData = testViewData.horizontalGrouping;

            this.viewDataProvider._generateMaps();

            const { groupedData } = testViewData.horizontalGrouping;

            const expectedGroupedDataMap = [
                undefined,
                undefined,
                [
                    [{
                        cellData: groupedData[0].dateTable[0][0],
                        position: {
                            rowIndex: 0,
                            cellIndex: 0
                        }
                    },
                    {
                        cellData: groupedData[0].dateTable[0][1],
                        position: {
                            rowIndex: 0,
                            cellIndex: 1
                        }
                    }]
                ],
                [
                    [{
                        cellData: groupedData[0].dateTable[0][2],
                        position: {
                            rowIndex: 0,
                            cellIndex: 2
                        }
                    },
                    {
                        cellData: groupedData[0].dateTable[0][3],
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
    });
});
