import ViewDataProvider from 'ui/scheduler/workspaces/view_model/view_data_provider';

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
        groupOrientation: 'vertical',
        isProvideVirtualCellsWidth: true,
        isVerticalGrouping: true,
        isStandaloneAllDayPanel: false,
        isGroupedAllDayPanel: true,
        isAllDayPanelVisible: true,
    }),
    _isVerticalGroupedWorkSpace: () => true,
    isAllDayPanelVisible: true,
    isDateAndTimeView: true
};
const horizontalWorkSpaceMock = {
    generateRenderOptions: () => ({
        startRowIndex: 0,
        startCellIndex: 0,
        rowCount: 2,
        cellCount: 4,
        totalCellCount: 4,
        topVirtualRowHeight: undefined,
        bottomVirtualRowHeight: undefined,
        cellCountInGroupRow: undefined,
        groupOrientation: 'horizontal',
        isProvideVirtualCellsWidth: true,
        isVerticalGrouping: false,
        isAllDayPanelVisible: true,
        isGroupedAllDayPanel: false,
        isStandaloneAllDayPanel: true,
    }),
    _isVerticalGroupedWorkSpace: () => false,
    isAllDayPanelVisible: true,
    isDateAndTimeView: true
};

const createViewDataProvider = ({
    workspaceMock = verticalWorkSpaceMock,
    completeViewDataMap = testViewDataMap.verticalGrouping,
    completeDateHeaderMap = testHeaderDataMap.verticalGrouping,
    completeTimePanelMap = [],
}) => {
    const viewDataProvider = new ViewDataProvider(workspaceMock);

    viewDataProvider.completeViewDataMap = completeViewDataMap;
    viewDataProvider.completeDateHeaderMap = completeDateHeaderMap;
    viewDataProvider.completeTimePanelMap = completeTimePanelMap;

    viewDataProvider.update(false);

    return viewDataProvider;
};

module('View Data Provider', {
    beforeEach: function() {
        this.init = groupOrientation => {
            if(groupOrientation === 'vertical') {
                this.viewDataProvider = createViewDataProvider({
                    workspaceMock: verticalWorkSpaceMock,
                    completeViewDataMap: testViewDataMap.verticalGrouping,
                    completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    completeTimePanelMap: [],
                });
            } else if(groupOrientation === 'horizontal') {
                this.viewDataProvider = createViewDataProvider({
                    workspaceMock: horizontalWorkSpaceMock,
                    completeViewDataMap: testViewDataMap.horizontalGrouping,
                    completeDateHeaderMap: testHeaderDataMap.horizontalGrouping,
                    completeTimePanelMap: [],
                });
            }

            return this.viewDataProvider;
        };
    }
}, () => {
    module('API', () => {
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

            test('getLastGroupCellPosition', function(assert) {
                assert.deepEqual(
                    this.viewDataProvider.getLastGroupCellPosition(2),
                    { rowIndex: 1, cellIndex: 1 },
                    'Last position for the group 2 is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getLastGroupCellPosition(3),
                    { rowIndex: 3, cellIndex: 1 },
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
                    completeDateHeaderMap,
                    completeTimePanelMap: [],
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
            module('Date and time views', () => {
                test('it should return correct cell start date', function(assert) {
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

                test('it should return correct all day cell start date', function(assert) {
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

            module('Date views', () => {
                const workSpaceMock = {
                    ...verticalWorkSpaceMock,
                    isDateAndTimeView: false
                };

                test('it should return correct cell start date', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: workSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                    });

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 24, 0, 10), new Date(2020, 7, 24, 1, 10)),
                        new Date(2020, 7, 24, 0),
                        'Group 2 cell 0 start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 20)),
                        new Date(2020, 7, 25, 0),
                        'Group 2 cell 1 start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 24, 0, 11), new Date(2020, 7, 24, 1, 22)),
                        new Date(2020, 7, 24, 1),
                        'Group 3 cell 0 start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 30)),
                        new Date(2020, 7, 25, 1),
                        'Group 3 cell 1 start date is correct'
                    );
                });


                test('it should return correct all day cell start date', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: workSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                    });

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 23, 0, 11), new Date(2020, 7, 26, 1, 30), true),
                        new Date(2020, 7, 24),
                        'Group 2 cell 1 allDay start date is correct when startDate is out of view'
                    );
                });

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
            module('Date and time views', () => {
                module('Vertical Grouping', function() {
                    test('Should return correct cell position for the allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, cellIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, cellIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });

                    test('Should return correct cell position if index is provided', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, cellIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24), true, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 0 },
                            '1st allDayPanel cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24), true, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, cellIndex: 0 },
                            '2st allDayPanel cell position is correct'
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

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 2 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 2 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 2 },
                            '2nd cell position is correct'
                        );
                    });
                });
            });

            module('Date views', () => {
                module('Vertical Grouping', function() {
                    const workSpaceMock = {
                        ...verticalWorkSpaceMock,
                        isDateAndTimeView: false
                    };

                    test('Should return correct cell position for the allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            workspaceMock: workSpaceMock,
                            completeViewDataMap: testViewDataMap.verticalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                        });

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 2, cellIndex: 0 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            workspaceMock: workSpaceMock,
                            completeViewDataMap: testViewDataMap.verticalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                        });

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, cellIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, cellIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });
                });

                module('Horizontal Grouping', function() {
                    const workSpaceMock = {
                        ...horizontalWorkSpaceMock,
                        isDateAndTimeView: false
                    };

                    test('Should return correct cell position for the allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            workspaceMock: workSpaceMock,
                            completeViewDataMap: testViewDataMap.horizontalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.horizontalGrouping
                        });

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, cellIndex: 2 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, cellIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, cellIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, cellIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });
                });
            });
        });
    });

    function createCellInfo(groupIndex, startDate, isAllDay, index) {
        return { groupIndex, startDate, isAllDay, index };
    }

    module('Data generation', () => {
        module('Standard scrolling', () => {
            const baseStartDate = new Date(2021, 0, 10);
            const dataGenerationWorkSpaceMock = {
                ...horizontalWorkSpaceMock,
                generateRenderOptions: () => {
                    return {
                        ...horizontalWorkSpaceMock.generateRenderOptions(),
                        totalCellCount: 4,
                        totalRowCount: 2,
                        verticalGroupCount: 1,
                        horizontalGroupCount: 2,
                        getDateHeaderText: (index) => index,
                        getDateHeaderDate: (index) => {
                            const date = new Date(baseStartDate);
                            date.setDate(10 + index);

                            return date;
                        },
                        getTimeCellDate: (rowIndex) => {
                            const date = new Date(baseStartDate);
                            date.setHours(rowIndex);

                            return date;
                        },
                        today: baseStartDate,
                        groupByDate: false,
                        isHorizontalGrouping: true,
                        isVerticalGrouping: false,
                        groupsList: [{ groupId: 1 }, { groupId: 2 }],
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
                                    groupIndex: 0,
                                },
                            });
                        }],
                        isAllDayPanelVisible: false,
                        isGroupedByDate: false,
                    };
                },
            };

            module('groupedDataMap', () => {
                test('it should be generated correctly in vertical group orientation', function(assert) {
                    const viewDataProvider = this.init('vertical');

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
                    this.init('horizontal');

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
                    groupIndex: 0,
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
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 2,
                    text: 0,
                    today: true,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11),
                    groupIndex: 1,
                    groups: { groupId: 2, },
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

            test('completeDateHeaderMap should be generated correctly when grouping by date is used', function(assert) {
                const workSpaceMock = {
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => ({
                        ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                        groupByDate: true,
                        isHorizontalGrouping: true,
                    }),
                };
                const viewDataProvider = new ViewDataProvider(workSpaceMock);

                viewDataProvider.update(true);

                const expectedDateHeaderMap = [[{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
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
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: true,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly when it is necessary to generate week days header', function(assert) {
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
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    text: 'week header text',
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10),
                    endDate: new Date(2021, 0, 10, 2),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 2,
                    text: 'week header text',
                }], [{
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
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
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 1,
                    text: 1,
                    today: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 2,
                    text: 0,
                    today: true,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11),
                    groupIndex: 1,
                    groups: { groupId: 2, },
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

            test('dateHeaderMap should be generated correctly', function(assert) {
                const viewDataProvider = this.init('horizontal');

                const dateHeaderMap = testHeaderDataMap.horizontalGrouping;
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 0,
                    leftVirtualCellWidth: 0,
                    rightVirtualCellCount: 0,
                    rightVirtualCellWidth: 0,
                    weekDayLeftVirtualCellCount: undefined,
                    weekDayLeftVirtualCellWidth: undefined,
                    weekDayRightVirtualCellCount: undefined,
                    weekDayRightVirtualCellWidth: undefined,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('completeTimePanelMap should be generated correctly', function(assert) {
                const viewDataProvider = new ViewDataProvider(dataGenerationWorkSpaceMock);

                viewDataProvider.update(true);

                const expectedCompleteTimePanelMap = [{
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: undefined,
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when all-day panel is enabled', function(assert) {
                const viewDataProvider = new ViewDataProvider({
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => ({
                        ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                        getAllDayCellData: () => {
                            return ({
                                value: {
                                    allDay: true,
                                    startDate: new Date(2021, 0, 10),
                                    groupIndex: 0,
                                    groups: { groupId: 1 },
                                },
                            });
                        },
                        isAllDayPanelVisible: true,
                    }),
                });

                viewDataProvider.update(true);

                const expectedCompleteTimePanelMap = [{
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                }, {
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: undefined,
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when vertical grouping is enabled', function(assert) {
                const viewDataProvider = new ViewDataProvider({
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => {
                        return ({
                            ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                            isVerticalGrouping: true,
                            groupsList: [{ groupId: 1 }, { groupId: 2 }],
                            isAllDayPanelVisible: true,
                            getAllDayCellData: () => {
                                return ({
                                    value: {
                                        allDay: true,
                                        startDate: new Date(2021, 0, 10),
                                        groupIndex: 0,
                                        groups: { groupId: 1 },
                                    },
                                });
                            },
                        });
                    }
                });

                viewDataProvider.update(true);

                const expectedCompleteTimePanelMap = [{
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                }, {
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: undefined,
                }, {
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 8,
                }, {
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 8,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 12,
                    allDay: undefined,
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when vertical grouping is enabled and all-day panel is absent', function(assert) {
                const viewDataProvider = new ViewDataProvider({
                    ...dataGenerationWorkSpaceMock,
                    generateRenderOptions: () => {
                        return ({
                            ...dataGenerationWorkSpaceMock.generateRenderOptions(),
                            isVerticalGrouping: true,
                            groupsList: [{ groupId: 1 }, { groupId: 2 }],
                            isAllDayPanelVisible: false,
                            getAllDayCellData: () => {
                                return ({
                                    value: {
                                        allDay: true,
                                        startDate: new Date(2021, 0, 10),
                                        groupIndex: 0,
                                        groups: { groupId: 1 },
                                    },
                                });
                            },
                        });
                    }
                });

                viewDataProvider.update(true);

                const expectedCompleteTimePanelMap = [{
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 8,
                    allDay: undefined,
                }, {
                    startDate: new Date(2021, 0, 10, 1),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 12,
                    allDay: undefined,
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('timePanelData should be generated correctly', function(assert) {
                const completeTimePanelMap = [{
                    startDate: new Date(2021, 1, 2, 0),
                    edDate: new Date(2021, 1, 2, 1),
                    groupIndex: 0,
                }, {
                    startDate: new Date(2021, 1, 2, 1),
                    edDate: new Date(2021, 1, 2, 2),
                    groupIndex: 0,
                }, {
                    startDate: new Date(2021, 1, 2, 0),
                    edDate: new Date(2021, 1, 2, 1),
                    groupIndex: 1,
                }, {
                    startDate: new Date(2021, 1, 2, 1),
                    edDate: new Date(2021, 1, 2, 2),
                    groupIndex: 1,
                }];

                const viewDataProvider = createViewDataProvider({
                    completeTimePanelMap,
                });

                const expectedTimePanelMap = {
                    groupedData: [{
                        dateTable: [
                            completeTimePanelMap[0],
                            completeTimePanelMap[1],
                        ],
                        groupIndex: 0,
                        isGroupedAllDayPanel: true,
                    }, {
                        dateTable: [
                            completeTimePanelMap[2],
                            completeTimePanelMap[3],
                        ],
                        groupIndex: 1,
                        isGroupedAllDayPanel: true,
                    }],
                    bottomVirtualRowHeight: undefined,
                    topVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: true,
                    cellCountInGroupRow: undefined,
                };

                assert.deepEqual(viewDataProvider.timePanelData, expectedTimePanelMap, 'Correct time panel data');
            });

            test('timePanelData should be generated correctly when all-day panel is present', function(assert) {
                const completeTimePanelMap = [{
                    startDate: new Date(2021, 1, 2, 0),
                    edDate: new Date(2021, 1, 2, 1),
                    groupIndex: 0,
                    allDay: true,
                }, {
                    startDate: new Date(2021, 1, 2, 1),
                    edDate: new Date(2021, 1, 2, 2),
                    groupIndex: 0,
                }];

                const viewDataProvider = createViewDataProvider({
                    completeTimePanelMap,
                });

                const expectedTimePanelMap = {
                    groupedData: [{
                        allDayPanel: completeTimePanelMap[0],
                        dateTable: [
                            completeTimePanelMap[1],
                        ],
                        groupIndex: 0,
                        isGroupedAllDayPanel: true,
                    }],
                    bottomVirtualRowHeight: undefined,
                    topVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: true,
                    cellCountInGroupRow: undefined,
                };

                assert.deepEqual(viewDataProvider.timePanelData, expectedTimePanelMap, 'Correct time panel data');
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
                    isProvideVirtualCellsWidth: true,
                    isVerticalGrouping: true,
                    isAllDayPanelVisible: true,
                    isGroupedAllDayPanel: true,
                }),
                _isVerticalGroupedWorkSpace: () => true,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => true,
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
                    isProvideVirtualCellsWidth: true,
                    isVerticalGrouping: false,
                    isAllDayPanelVisible: true,
                    isGroupedAllDayPanel: false,
                    isStandaloneAllDayPanel: true,
                }),
                _isVerticalGroupedWorkSpace: () => false,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => false,
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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: virtualVerticalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: virtualVerticalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: virtualVerticalWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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

            test('timePanelData should be generated correctly when virtual scrolling is used', function(assert) {
                const completeTimePanelMap = [{
                    startDate: new Date(2021, 1, 2, 0),
                    edDate: new Date(2021, 1, 2, 1),
                    groupIndex: 0,
                }, {
                    startDate: new Date(2021, 1, 2, 1),
                    edDate: new Date(2021, 1, 2, 2),
                    groupIndex: 0,
                }, {
                    startDate: new Date(2021, 1, 2, 0),
                    edDate: new Date(2021, 1, 2, 1),
                    groupIndex: 1,
                }, {
                    startDate: new Date(2021, 1, 2, 1),
                    edDate: new Date(2021, 1, 2, 2),
                    groupIndex: 1,
                }];

                const viewDataProvider = createViewDataProvider({
                    completeTimePanelMap,
                    workspaceMock: virtualVerticalWorkSpaceMock,
                });

                const expectedTimePanelMap = {
                    groupedData: [{
                        dateTable: [
                            completeTimePanelMap[1],
                        ],
                        groupIndex: 0,
                        isGroupedAllDayPanel: true,
                    }, {
                        dateTable: [
                            completeTimePanelMap[2],
                        ],
                        groupIndex: 1,
                        isGroupedAllDayPanel: true,
                    }],
                    bottomVirtualRowHeight: 50,
                    topVirtualRowHeight: 50,
                    isGroupedAllDayPanel: true,
                    cellCountInGroupRow: 2,
                };

                assert.deepEqual(viewDataProvider.timePanelData, expectedTimePanelMap, 'Correct time panel data');
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
                    isProvideVirtualCellsWidth: true,
                    isVerticalGrouping: true,
                    isAllDayPanelVisible: true,
                    isGroupedAllDayPanel: true,
                }),
                _isVerticalGroupedWorkSpace: () => true,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => true,
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
                    isProvideVirtualCellsWidth: true,
                    isVerticalGrouping: false,
                    isAllDayPanelVisible: true,
                    isGroupedAllDayPanel: false,
                    isStandaloneAllDayPanel: true,
                }),
                _isVerticalGroupedWorkSpace: () => false,
                isAllDayPanelVisible: true,
                isGroupedAllDayPanel: () => false,
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
            const timelineCompleteDateHeaderMap = [[{
                startDate: new Date(2021, 0, 1),
                endDate: new Date(2021, 0, 2),
            }, {
                startDate: new Date(2021, 0, 2),
                endDate: new Date(2021, 0, 3),
            }, {
                startDate: new Date(2021, 0, 3),
                endDate: new Date(2021, 0, 4),
            }], [{
                startDate: new Date(2021, 0, 1, 0, 0),
                endDate: new Date(2021, 0, 1, 0, 30),
            }, {
                startDate: new Date(2021, 0, 1, 0, 30),
                endDate: new Date(2021, 0, 1, 1, 0),
            }, {
                startDate: new Date(2021, 0, 1, 1, 0),
                endDate: new Date(2021, 0, 1, 1, 30),
            }, {
                startDate: new Date(2021, 0, 1, 1, 30),
                endDate: new Date(2021, 0, 1, 2, 0),
            }, {
                startDate: new Date(2021, 0, 2, 0, 0),
                endDate: new Date(2021, 0, 2, 0, 30),
            }, {
                startDate: new Date(2021, 0, 2, 0, 30),
                endDate: new Date(2021, 0, 2, 1, 0),
            }, {
                startDate: new Date(2021, 0, 2, 1, 0),
                endDate: new Date(2021, 0, 2, 1, 30),
            }, {
                startDate: new Date(2021, 0, 2, 1, 30),
                endDate: new Date(2021, 0, 2, 2, 0),
            }, {
                startDate: new Date(2021, 0, 3, 0, 0),
                endDate: new Date(2021, 0, 3, 0, 30),
            }, {
                startDate: new Date(2021, 0, 3, 0, 30),
                endDate: new Date(2021, 0, 3, 1, 0),
            }, {
                startDate: new Date(2021, 0, 3, 1, 0),
                endDate: new Date(2021, 0, 3, 1, 30),
            }, {
                startDate: new Date(2021, 0, 3, 1, 30),
                endDate: new Date(2021, 0, 3, 2, 0),
            }]];

            module('viewData', () => {
                test('viewData should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: verticalGroupedWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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

                test('viewData should be generated correctly when virtual widths should not be passed', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: {
                            ...horizontalGroupedWorkspaceMock,
                            generateRenderOptions: () => ({
                                ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                                isProvideVirtualCellsWidth: false,
                            }),
                        },
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: verticalGroupedWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });
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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: verticalGroupedWorkSpaceMock,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

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
                    const viewDataProvider = createViewDataProvider({
                        workspaceMock: horizontalGroupedWorkspaceMock,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

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

            test('dateHeaderMap should be generated correctly', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    workspaceMock: {
                        ...horizontalGroupedWorkspaceMock,
                        generateRenderOptions: () => ({
                            ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                            cellWidth: 100,
                        }),
                    },
                    completeViewDataMap: horizontalDataMap,
                    completeDateHeaderMap: horizontalDateHeaderMap,
                });

                const dateHeaderMap = [[horizontalDateHeaderMap[0][1]]];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 1,
                    leftVirtualCellWidth: 100,
                    rightVirtualCellCount: 1,
                    rightVirtualCellWidth: 100,
                    weekDayLeftVirtualCellCount: undefined,
                    weekDayLeftVirtualCellWidth: undefined,
                    weekDayRightVirtualCellCount: undefined,
                    weekDayRightVirtualCellWidth: undefined,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly when width should not be provided', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    workspaceMock: {
                        ...horizontalGroupedWorkspaceMock,
                        generateRenderOptions: () => ({
                            ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                            cellWidth: 100,
                            isProvideVirtualCellsWidth: false,
                        }),
                    },
                    completeViewDataMap: horizontalDataMap,
                    completeDateHeaderMap: horizontalDateHeaderMap,
                });

                const dateHeaderMap = [[horizontalDateHeaderMap[0][1]]];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 1,
                    leftVirtualCellWidth: undefined,
                    rightVirtualCellCount: 1,
                    rightVirtualCellWidth: undefined,
                    weekDayLeftVirtualCellCount: undefined,
                    weekDayLeftVirtualCellWidth: undefined,
                    weekDayRightVirtualCellCount: undefined,
                    weekDayRightVirtualCellWidth: undefined,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when one week-day cell is visible', function(assert) {
                const completeViewDataMap = [timelineCompleteDateHeaderMap[1], timelineCompleteDateHeaderMap[1]];

                const viewDataProvider = createViewDataProvider({
                    workspaceMock: {
                        ...horizontalGroupedWorkspaceMock,
                        generateRenderOptions: () => ({
                            ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                            isGenerateWeekDaysHeaderData: true,
                            startCellIndex: 2,
                            cellCount: 2,
                            startRowIndex: 0,
                            rowCount: 1,
                            leftVirtualCellWidth: 200,
                            rightVirtualCellWidth: 800,
                            cellCountInGroupRow: 12,
                            totalCellCount: 12,
                            horizontalGroupCount: 1,
                            cellCountInDay: 4,
                            groupByDate: false,
                            cellWidth: 100,
                        }),
                    },
                    completeViewDataMap,
                    completeDateHeaderMap: timelineCompleteDateHeaderMap,
                });

                const dateHeaderMap = [
                    [timelineCompleteDateHeaderMap[0][0]],
                    [timelineCompleteDateHeaderMap[1][2], timelineCompleteDateHeaderMap[1][3]],
                ];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 2,
                    leftVirtualCellWidth: 200,
                    rightVirtualCellCount: 8,
                    rightVirtualCellWidth: 800,
                    weekDayLeftVirtualCellCount: 0,
                    weekDayLeftVirtualCellWidth: 0,
                    weekDayRightVirtualCellCount: 8,
                    weekDayRightVirtualCellWidth: 800,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when several week-day cells фку visible', function(assert) {
                const completeViewDataMap = [timelineCompleteDateHeaderMap[1], timelineCompleteDateHeaderMap[1]];

                const viewDataProvider = createViewDataProvider({
                    workspaceMock: {
                        ...horizontalGroupedWorkspaceMock,
                        generateRenderOptions: () => ({
                            ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                            isGenerateWeekDaysHeaderData: true,
                            startCellIndex: 2,
                            cellCount: 4,
                            startRowIndex: 0,
                            rowCount: 1,
                            leftVirtualCellWidth: 200,
                            rightVirtualCellWidth: 600,
                            cellCountInGroupRow: 12,
                            totalCellCount: 12,
                            horizontalGroupCount: 1,
                            cellCountInDay: 4,
                            groupByDate: false,
                            cellWidth: 100,
                        }),
                    },
                    completeViewDataMap,
                    completeDateHeaderMap: timelineCompleteDateHeaderMap,
                });

                const dateHeaderMap = [
                    [timelineCompleteDateHeaderMap[0][0], timelineCompleteDateHeaderMap[0][1]],
                    [
                        timelineCompleteDateHeaderMap[1][2], timelineCompleteDateHeaderMap[1][3],
                        timelineCompleteDateHeaderMap[1][4], timelineCompleteDateHeaderMap[1][5],
                    ],
                ];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 2,
                    leftVirtualCellWidth: 200,
                    rightVirtualCellCount: 6,
                    rightVirtualCellWidth: 600,
                    weekDayLeftVirtualCellCount: 0,
                    weekDayLeftVirtualCellWidth: 0,
                    weekDayRightVirtualCellCount: 4,
                    weekDayRightVirtualCellWidth: 400,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when grouping by date is used', function(assert) {
                const completeViewDataMap = [
                    timelineCompleteDateHeaderMap[1],
                    timelineCompleteDateHeaderMap[1],
                ];

                const viewDataProvider = createViewDataProvider({
                    workspaceMock: {
                        ...horizontalGroupedWorkspaceMock,
                        generateRenderOptions: () => ({
                            ...horizontalGroupedWorkspaceMock.generateRenderOptions(),
                            isGenerateWeekDaysHeaderData: true,
                            startCellIndex: 5,
                            cellCount: 10,
                            startRowIndex: 0,
                            rowCount: 1,
                            leftVirtualCellWidth: 500,
                            rightVirtualCellWidth: 900,
                            cellCountInGroupRow: 12,
                            totalCellCount: 24,
                            horizontalGroupCount: 2,
                            cellCountInDay: 4,
                            groupByDate: true,
                            cellWidth: 100,
                        }),
                    },
                    completeViewDataMap,
                    completeDateHeaderMap: timelineCompleteDateHeaderMap,
                });

                const dateHeaderMap = [
                    [timelineCompleteDateHeaderMap[0][0], timelineCompleteDateHeaderMap[0][1]],
                    [
                        timelineCompleteDateHeaderMap[1][2], timelineCompleteDateHeaderMap[1][3],
                        timelineCompleteDateHeaderMap[1][4], timelineCompleteDateHeaderMap[1][5],
                        timelineCompleteDateHeaderMap[1][6], timelineCompleteDateHeaderMap[1][7],
                    ],
                ];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 4,
                    leftVirtualCellWidth: 400,
                    rightVirtualCellCount: 8,
                    rightVirtualCellWidth: 800,
                    weekDayLeftVirtualCellCount: 0,
                    weekDayLeftVirtualCellWidth: 0,
                    weekDayRightVirtualCellCount: 8,
                    weekDayRightVirtualCellWidth: 800,
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });
        });
    });
});
