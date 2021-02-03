import ViewDataProvider from 'ui/scheduler/workspaces/view_data_provider';

const {
    test,
    module
} = QUnit;

QUnit.dump.maxDepth = 10;

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

const testHeaderDataMap = {
    horizontalGrouping: [testViewDataMap.horizontalGrouping[0]],
    verticalGrouping: [testViewDataMap.verticalGrouping[1]],
};

const verticalWorkSpaceMock = {
    generateRenderOptions: () => ({
        startRowIndex: 0,
        startCellIndex: 0,
        rowCount: 4,
        cellCount: 2,
        topVirtualRowHeight: undefined,
        bottomVirtualRowHeight: undefined,
        cellCountInGroupRow: undefined,
        groupOrientation: 'vertical'
    }),
    _isVerticalGroupedWorkSpace: () => true,
    isAllDayPanelVisible: true,
    isGroupedAllDayPanel: () => true,
    isVirtualScrolling: () => false,
};
const horizontalWorkSpaceMock = {
    generateRenderOptions: () => ({
        startRowIndex: 0,
        startCellIndex: 0,
        rowCount: 2,
        cellCount: 4,
        topVirtualRowHeight: undefined,
        bottomVirtualRowHeight: undefined,
        cellCountInGroupRow: undefined,
        groupOrientation: 'horizontal'
    }),
    _isVerticalGroupedWorkSpace: () => false,
    isAllDayPanelVisible: true,
    isGroupedAllDayPanel: () => false,
    isVirtualScrolling: () => false,
};

const createViewDataProvider = (options) => {
    const viewDataProvider = new ViewDataProvider(options.workspaceMock);

    viewDataProvider.completeViewDataMap = options.completeViewDataMap;
    viewDataProvider.completeDateHeaderMap = options.completeDateHeaderMap;

    viewDataProvider.update(false);

    return viewDataProvider;
};

module('View Data Provider', () => {
    module('API', {
        beforeEach: function() {
            this.init = groupOrientation => {
                if(groupOrientation === 'vertical') {
                    this.viewDataProvider = createViewDataProvider({
                        workspaceMock: verticalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                    });
                } else if(groupOrientation === 'horizontal') {
                    this.viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.horizontalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.horizontalGrouping
                    });
                }
            };
        }
    }, () => {
        module('Vertical grouping', {
            beforeEach: function() {
                this.init('vertical');
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

            test('getCompletedGroupsInfo', function(assert) {
                const completeViewDataMap = [
                    [
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
                    ],
                    [
                        {
                            allDay: true,
                            startDate: new Date(2020, 7, 24),
                            endDate: new Date(2020, 7, 24),
                            groups: 'group_4',
                            groupIndex: 4,
                            index: 0
                        },
                        {
                            allDay: true,
                            startDate: new Date(2020, 7, 25),
                            endDate: new Date(2020, 7, 25),
                            groups: 'group_4',
                            groupIndex: 4,
                            index: 1
                        }
                    ]
                ];

                const completeDateHeaderMap = [completeViewDataMap[3]];
                const workspaceMock = {
                    ...verticalWorkSpaceMock,
                    generateRenderOptions: () => {
                        return {
                            ...verticalWorkSpaceMock.generateRenderOptions(),
                            rowCount: 5,
                        };
                    }
                };
                const viewDataProvider = createViewDataProvider({
                    workspaceMock,
                    completeViewDataMap,
                    completeDateHeaderMap
                });

                const groupsInfo = viewDataProvider.getCompletedGroupsInfo();

                assert.deepEqual(
                    groupsInfo,
                    [
                        {
                            allDay: true,
                            startDate: testViewDataMap.verticalGrouping[1][0].startDate,
                            endDate: testViewDataMap.verticalGrouping[1][1].endDate,
                            groupIndex: 2
                        },
                        {
                            allDay: true,
                            startDate: testViewDataMap.verticalGrouping[3][0].startDate,
                            endDate: testViewDataMap.verticalGrouping[3][1].endDate,
                            groupIndex: 3
                        }
                    ],
                    'Groups info is correct'
                );
            });
        });

        module('getGroupData', () => {
            module('Vertical grouping', {
                beforeEach: function() {
                    this.init('vertical');
                }
            }, () => {
                [
                    {
                        groupIndex: 2,
                        allDayPanelIndex: 0,
                        dateTableIndex: 1
                    },
                    {
                        groupIndex: 3,
                        allDayPanelIndex: 2,
                        dateTableIndex: 3
                    }
                ].forEach(({ groupIndex, allDayPanelIndex, dateTableIndex }) => {
                    test(`getGroupData if groupIndex=${groupIndex}`, function(assert) {
                        const groupData = this.viewDataProvider.getGroupData(groupIndex);

                        assert.deepEqual(
                            groupData,
                            {
                                allDayPanel: testViewDataMap.verticalGrouping[allDayPanelIndex],
                                dateTable: [testViewDataMap.verticalGrouping[dateTableIndex]],
                                groupIndex,
                                isGroupedAllDayPanel: true
                            },
                            'Group data is coorect'
                        );
                    });
                });
            });

            module('Horizontal grouping', {
                beforeEach: function() {
                    this.init('horizontal');
                }
            }, () => {
                [
                    {
                        groupIndex: 2,
                        allDayPanelIndex: 0,
                        dateTableIndex: 0
                    },
                    {
                        groupIndex: 3,
                        allDayPanelIndex: 2,
                        dateTableIndex: 2
                    }
                ].forEach(({ groupIndex, allDayPanelIndex, dateTableIndex }) => {
                    test(`getGroupData if groupIndex=${groupIndex}`, function(assert) {
                        const groupData = this.viewDataProvider.getGroupData(groupIndex);
                        const { horizontalGrouping: testData } = testViewDataMap;

                        assert.deepEqual(
                            groupData,
                            {
                                allDayPanel: [testData[0][allDayPanelIndex], testData[0][allDayPanelIndex + 1]],
                                dateTable: [[testData[1][dateTableIndex], testData[1][dateTableIndex + 1]]]
                            },
                            'Group data is coorect'
                        );
                    });
                });
            });
        });

        module('getAllDayPanel', () => {
            module('Vertical grouping', {
                beforeEach: function() {
                    this.init('vertical');
                }
            }, () => {
                [
                    {
                        groupIndex: 2,
                        allDayPanelIndex: 0
                    },
                    {
                        groupIndex: 3,
                        allDayPanelIndex: 2
                    }
                ].forEach(({ groupIndex, allDayPanelIndex }) => {
                    test(`it should return allDayPanel data correctly if groupIndex=${groupIndex}`, function(assert) {
                        const allDayPanel = this.viewDataProvider.getAllDayPanel(groupIndex);

                        assert.deepEqual(
                            allDayPanel,
                            testViewDataMap.verticalGrouping[allDayPanelIndex],
                            'All day panel is correct'
                        );
                    });
                });
            });

            module('Horizontal grouping', {
                beforeEach: function() {
                    this.init('horizontal');
                }
            }, () => {
                [
                    {
                        groupIndex: 2,
                        allDayPanelIndex: 0
                    },
                    {
                        groupIndex: 3,
                        allDayPanelIndex: 2
                    }
                ].forEach(({ groupIndex, allDayPanelIndex }) => {
                    test(`it should return allDayPanel data correctly if groupIndex=${groupIndex}`, function(assert) {
                        const allDayPanel = this.viewDataProvider.getAllDayPanel(groupIndex);
                        const testData = testViewDataMap.horizontalGrouping;

                        assert.deepEqual(
                            allDayPanel,
                            [
                                testData[0][allDayPanelIndex],
                                testData[0][allDayPanelIndex + 1]
                            ],
                            'All day panel is correct'
                        );
                    });
                });
            });
        });

        module('findGroupCellStartDate', {
            beforeEach: function() {
                this.init('vertical');
            }
        }, function() {
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
                this.init('vertical');

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

        module('getCellData', {
            beforeEach: function() {
                this.init('vertical');
            }
        }, function() {
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

        module('findCellPositionInMap', {
            beforeEach: function() {
                this.init('vertical');
            }
        }, function() {
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
                beforeEach: function() {
                    this.init('horizontal');
                }
            }, function() {
                test('Should return correct cell position for the allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    let position = viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                    position = viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24), true);
                    assert.deepEqual(position, { rowIndex: 0, cellIndex: 2 }, '2nd allDayPanel cell position is correct');
                });

                test('Should return correct cell position for the not allDay cell date', function(assert) {
                    const { viewDataProvider } = this;

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24), false),
                        { rowIndex: 0, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(2, new Date(2020, 7, 24, 0, 29), false),
                        { rowIndex: 0, cellIndex: 0 },
                        '1st cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1), false),
                        { rowIndex: 0, cellIndex: 2 },
                        '2nd cell position is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findCellPositionInMap(3, new Date(2020, 7, 24, 1, 29), false),
                        { rowIndex: 0, cellIndex: 2 },
                        '2nd cell position is correct'
                    );
                });
            });
        });
    });

    module('Data generation', () => {
        module('Standard scrolling', () => {
            const baseStartDate = new Date(2021, 0, 10);
            const dataGenerationWorkSpaceMock = {
                ...horizontalWorkSpaceMock,
                isAllDayPanelVisible: false,
                isGroupedByDate: () => false,
                generateRenderOptions: () => {
                    return {
                        ...horizontalWorkSpaceMock.generateRenderOptions(),
                        totalCellCount: 4,
                        totalRowCount: 2,
                        verticalGroupCount: 1,
                        horizontalGroupCount: 2,
                        getDateHeaderText: (index) => index,
                        today: baseStartDate,
                        groupByDate: false,
                        cellCountInGroupRow: 2,
                        rowCountInGroup: 2,
                        cellDataGetters: [(_, rowIndex, columnIndex) => {
                            const startDate = (new Date(baseStartDate));
                            startDate.setDate(10 + columnIndex);

                            const endDate = new Date(startDate);
                            endDate.setHours(2);

                            return ({
                                value: {
                                    startDate,
                                    endDate,
                                    groups: { groupId: 1 },
                                    groupIndex: 1,
                                },
                            });
                        }],
                    };
                },
            };

            module('groupedDataMap', () => {
                test('it should be generated correctly in vertical group orientation', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: verticalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                    });

                    const viewDataMap = testViewDataMap.verticalGrouping;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [],
                        dateTableGroupedMap: [
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
                        ]
                    };

                    assert.deepEqual(
                        viewDataProvider.groupedDataMap,
                        expectedGroupedDataMap,
                        'Grouped data is correct'
                    );
                });

                test('it should be generated correctly in horizontal group orientation', function(assert) {
                    this.viewDataProvider = new ViewDataProvider(horizontalWorkSpaceMock);

                    this.viewDataProvider.completeViewDataMap = testViewDataMap.horizontalGrouping;
                    this.viewDataProvider.completeDateHeaderMap = testHeaderDataMap.horizontalGrouping;

                    this.viewDataProvider.update(false);

                    const viewDataMap = testViewDataMap.horizontalGrouping;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [
                            undefined,
                            undefined,
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
                            [
                                {
                                    cellData: viewDataMap[0][2],
                                    position: {
                                        rowIndex: 0,
                                        cellIndex: 2
                                    }
                                },
                                {
                                    cellData: viewDataMap[0][3],
                                    position: {
                                        rowIndex: 0,
                                        cellIndex: 3
                                    }
                                }
                            ]
                        ],
                        dateTableGroupedMap: [
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
                        ]
                    };

                    assert.deepEqual(
                        this.viewDataProvider.groupedDataMap,
                        expectedGroupedDataMap,
                        'Grouped data is correct'
                    );
                });
            });

            test('completeDateHeaderMap should be generated correctly', function(assert) {
                const viewDataProvider = new ViewDataProvider(dataGenerationWorkSpaceMock);

                viewDataProvider.update(true);

                const expectedDateHeaderMap = [[{
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10),
                    endDate: new Date(2021, 0, 10, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    text: 0,
                    today: true,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11),
                    endDate: new Date(2021, 0, 11, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 12),
                    endDate: new Date(2021, 0, 12, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 2,
                    text: 0,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 13),
                    endDate: new Date(2021, 0, 13, 2),
                    groupIndex: 1,
                    groups: { groupId: 1, },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 3,
                    text: 1,
                    today: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly when groupin by date is used', function(assert) {
                const workSpaceMock = {
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => ({
                        ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                        groupByDate: true,
                    }),
                };
                const viewDataProvider = new ViewDataProvider(workSpaceMock);

                viewDataProvider.update(true);

                const expectedDateHeaderMap = [[{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10),
                    endDate: new Date(2021, 0, 10, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 0,
                    text: 0,
                    today: true,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11),
                    endDate: new Date(2021, 0, 11, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly in case of ti', function(assert) {
                const weekHeaderMock = {
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => {
                        return {
                            ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                            isGenerateWeekDaysHeaderData: true,
                            getWeekDaysHeaderText: () => 'week header text',
                            daysInView: 2,
                            cellCountInDay: 2,
                        };
                    },
                };
                const viewDataProvider = new ViewDataProvider(weekHeaderMock);

                viewDataProvider.update(true);

                const expectedDateHeaderMap = [[{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10),
                    endDate: new Date(2021, 0, 10, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    text: 'week header text',
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 12),
                    endDate: new Date(2021, 0, 12, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 2,
                    text: 'week header text',
                }], [{
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10),
                    endDate: new Date(2021, 0, 10, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    text: 0,
                    today: true,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11),
                    endDate: new Date(2021, 0, 11, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 12),
                    endDate: new Date(2021, 0, 12, 2),
                    groupIndex: 1,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 2,
                    text: 0,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 13),
                    endDate: new Date(2021, 0, 13, 2),
                    groupIndex: 1,
                    groups: { groupId: 1, },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 3,
                    text: 1,
                    today: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('dateHeaderMap shoul be generated correctly', function(assert) {
                const viewDataProvider = new ViewDataProvider(horizontalWorkSpaceMock);

                viewDataProvider.completeViewDataMap = testViewDataMap.horizontalGrouping;
                viewDataProvider.completeDateHeaderMap = testHeaderDataMap.horizontalGrouping;

                viewDataProvider.update(false);

                const dateHeaderMap = testHeaderDataMap.horizontalGrouping;

                assert.deepEqual(viewDataProvider.dateHeaderMap, dateHeaderMap, 'Correct dateHeaderMap');
            });
        });

        module('Vertical virtual scrolling', () => {
            const virtualVerticalWorkSpaceMock = {
                generateRenderOptions: () => ({
                    startCellIndex: 0,
                    startRowIndex: 1,
                    cellCount: 2,
                    rowCount: 2,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 2,
                    groupOrientation: 'vertical',
                    totalRowCount: 4,
                    totalCellCount: 2,
                }),
                _isVerticalGroupedWorkSpace: () => true,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => true,
                isVirtualScrolling: () => true,
            };
            const horizontalGroupedWorkspaceMock = {
                generateRenderOptions: () => ({
                    startCellIndex: 0,
                    startRowIndex: 1,
                    rowCount: 1,
                    cellCount: 4,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 1,
                    groupOrientation: 'horizontal',
                    totalRowCount: 4,
                    totalCellCount: 4,
                }),
                _isVerticalGroupedWorkSpace: () => false,
                isAllDayPanelVisible: true,
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
            const horizontalDateHeaderMap = [horizontalDataMap[1]];

            module('viewData', () => {
                test('viewData should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
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
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 1,
                        leftVirtualCellCount: 0,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        cellCountInGroupRow: 2,
                        isGroupedAllDayPanel: true,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('viewData should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: completeViewDataMap[0],
                            dateTable: [completeViewDataMap[2]],
                            groupIndex: 2,
                            isGroupedAllDayPanel: false,
                        }],
                        bottomVirtualRowCount: 2,
                        topVirtualRowCount: 1,
                        leftVirtualCellCount: 0,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        cellCountInGroupRow: 1,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });
            });

            module('viewDataMap', () => {
                test('viewDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
                    viewDataProvider.update(false);

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewDataMap = {
                        allDayPanelMap: [],
                        dateTableMap: [[{
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
                        }]]
                    };

                    const viewDataMap = viewDataProvider.viewDataMap;

                    assert.deepEqual(
                        viewDataMap,
                        expectedViewDataMap,
                        'View data map is correct'
                    );
                });

                test('viewDataMap should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewDataMap = {
                        allDayPanelMap: [{
                            cellData: completeViewDataMap[0][0],
                            position: { rowIndex: 0, cellIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[0][1],
                            position: { rowIndex: 0, cellIndex: 1 },
                        }],
                        dateTableMap: [[{
                            cellData: completeViewDataMap[2][0],
                            position: { rowIndex: 0, cellIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[2][1],
                            position: { rowIndex: 0, cellIndex: 1 },
                        }]]
                    };

                    const viewDataMap = viewDataProvider.viewDataMap;

                    assert.deepEqual(
                        viewDataMap,
                        expectedViewDataMap,
                        'View data map is correct'
                    );
                });
            });

            module('groupedDataMap', () => {
                test('groupedDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(virtualVerticalWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
                    viewDataProvider.update(false);

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [],
                        dateTableGroupedMap: [
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
                            }]]]
                    };

                    const groupedDataMap = viewDataProvider.groupedDataMap;

                    assert.deepEqual(
                        groupedDataMap,
                        expectedGroupedDataMap,
                        'View data map is correct'
                    );
                });

                test('groupedDataMap should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [
                            undefined,
                            undefined,
                            [{
                                cellData: completeViewDataMap[0][0],
                                position: { rowIndex: 0, cellIndex: 0 },
                            }],
                            [{
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, cellIndex: 1 },
                            }]
                        ],
                        dateTableGroupedMap: [
                            undefined,
                            undefined,
                            [
                                [{
                                    cellData: completeViewDataMap[2][0],
                                    position: { rowIndex: 0, cellIndex: 0 },
                                }]
                            ], [
                                [{
                                    cellData: completeViewDataMap[2][1],
                                    position: { rowIndex: 0, cellIndex: 1 },
                                }]
                            ]
                        ]
                    };

                    const groupedDataMap = viewDataProvider.groupedDataMap;

                    assert.deepEqual(
                        groupedDataMap,
                        expectedGroupedDataMap,
                        'View data map is correct'
                    );
                });
            });
        });

        module('Horizontal virtual scrolling', () => {
            const verticalGroupedWorkSpaceMock = {
                generateRenderOptions: () => ({
                    startCellIndex: 1,
                    cellCount: 1,
                    startRowIndex: 0,
                    rowCount: 2,
                    leftVirtualCellWidth: 20,
                    rightVirtualCellWidth: 30,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 2,
                    groupOrientation: 'vertical',
                    totalRowCount: 2,
                    totalCellCount: 3,
                }),
                _isVerticalGroupedWorkSpace: () => true,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => true,
                isVirtualScrolling: () => true,
                virtualScrollingDispatcher: {
                    horizontalScrollingAllowed: true
                }
            };

            const horizontalGroupedWorkspaceMock = {
                generateRenderOptions: () => ({
                    startCellIndex: 1,
                    cellCount: 1,
                    startRowIndex: 0,
                    rowCount: 2,
                    leftVirtualCellWidth: 20,
                    rightVirtualCellWidth: 30,
                    topVirtualRowHeight: 50,
                    bottomVirtualRowHeight: 50,
                    cellCountInGroupRow: 1,
                    groupOrientation: 'horizontal',
                    totalRowCount: 2,
                    totalCellCount: 3,
                }),
                _isVerticalGroupedWorkSpace: () => false,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => false,
                isVirtualScrolling: () => true,
                virtualScrollingDispatcher: {
                    horizontalScrollingAllowed: true
                }
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
            const horizontalDateHeaderMap = [horizontalDataMap[0]];

            module('viewData', () => {
                test('viewData should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(verticalGroupedWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
                    viewDataProvider.update(false);

                    const completeViewDataMap = testViewDataMap.verticalGrouping;
                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: [completeViewDataMap[0][1]],
                            dateTable: [[completeViewDataMap[1][1]]],
                            groupIndex: 2,
                            isGroupedAllDayPanel: true
                        }],
                        bottomVirtualRowCount: 0,
                        topVirtualRowCount: 0,
                        leftVirtualCellCount: 1,
                        rightVirtualCellCount: 1,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: 20,
                        rightVirtualCellWidth: 30,
                        topVirtualRowHeight: 50,
                        cellCountInGroupRow: 2,
                        isGroupedAllDayPanel: true,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('viewData should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: [completeViewDataMap[0][1]],
                            dateTable: [[completeViewDataMap[1][1]], [completeViewDataMap[2][1]]],
                            groupIndex: 3,
                            isGroupedAllDayPanel: false,
                        }],
                        bottomVirtualRowCount: 0,
                        topVirtualRowCount: 0,
                        leftVirtualCellCount: 1,
                        rightVirtualCellCount: 1,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: 20,
                        rightVirtualCellWidth: 30,
                        topVirtualRowHeight: 50,
                        cellCountInGroupRow: 1,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });
            });

            module('viewDataMap', () => {
                test('viewDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(verticalGroupedWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
                    viewDataProvider.update(false);

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewDataMap = {
                        allDayPanelMap: [],
                        dateTableMap: [
                            [{
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, cellIndex: 0 },
                            }], [{
                                cellData: completeViewDataMap[1][1],
                                position: { rowIndex: 1, cellIndex: 0 },
                            }]
                        ]
                    };

                    const viewDataMap = viewDataProvider.viewDataMap;

                    assert.deepEqual(
                        viewDataMap,
                        expectedViewDataMap,
                        'View data map is correct'
                    );
                });

                test('viewDataMap should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewDataMap = {
                        allDayPanelMap: [
                            {
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, cellIndex: 0 },
                            }
                        ],
                        dateTableMap: [
                            [{
                                cellData: completeViewDataMap[1][1],
                                position: { rowIndex: 0, cellIndex: 0 },
                            }], [{
                                cellData: completeViewDataMap[2][1],
                                position: { rowIndex: 1, cellIndex: 0 },
                            }]
                        ]
                    };

                    assert.deepEqual(
                        viewDataProvider.viewDataMap,
                        expectedViewDataMap,
                        'View data map is correct'
                    );
                });
            });

            module('groupedDataMap', () => {
                test('groupedDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(verticalGroupedWorkSpaceMock);
                    viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;
                    viewDataProvider.completeDateHeaderMap = testHeaderDataMap.verticalGrouping;
                    viewDataProvider.update(false);

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [],
                        dateTableGroupedMap: [
                            undefined,
                            undefined,
                            [
                                [{
                                    cellData: completeViewDataMap[0][1],
                                    position: { rowIndex: 0, cellIndex: 0 },
                                }],
                                [{
                                    cellData: completeViewDataMap[1][1],
                                    position: { rowIndex: 1, cellIndex: 0 },
                                }]
                            ]
                        ]
                    };

                    const groupedDataMap = viewDataProvider.groupedDataMap;

                    assert.deepEqual(
                        groupedDataMap,
                        expectedGroupedDataMap,
                        'View data map is correct'
                    );
                });

                test('groupedDataMap should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = new ViewDataProvider(horizontalGroupedWorkspaceMock);
                    viewDataProvider.completeViewDataMap = horizontalDataMap;
                    viewDataProvider.completeDateHeaderMap = horizontalDateHeaderMap;
                    viewDataProvider.update(false);

                    const completeViewDataMap = horizontalDataMap;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [
                            undefined,
                            undefined,
                            undefined,
                            [
                                {
                                    cellData: completeViewDataMap[0][1],
                                    position: { rowIndex: 0, cellIndex: 0 },
                                }
                            ]
                        ],
                        dateTableGroupedMap: [
                            undefined,
                            undefined,
                            undefined,
                            [
                                [{
                                    cellData: completeViewDataMap[1][1],
                                    position: { rowIndex: 0, cellIndex: 0 },
                                }],
                                [{
                                    cellData: completeViewDataMap[2][1],
                                    position: { rowIndex: 1, cellIndex: 0 },
                                }]
                            ]
                        ]
                    };

                    const groupedDataMap = viewDataProvider.groupedDataMap;

                    assert.deepEqual(
                        expectedGroupedDataMap,
                        groupedDataMap,
                        'View data map is correct'
                    );
                });
            });
        });
    });
});
