import ViewDataProvider from 'ui/scheduler/workspaces/view_model/view_data_provider';
import { supportedViews } from '../../helpers/scheduler/helpers.js';

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
            groupIndex: 2,
            key: 0,
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_2',
            groupIndex: 2,
            key: 1,
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_3',
            groupIndex: 3,
            key: 2,
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_3',
            groupIndex: 3,
            key: 3,
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 0, 0),
            endDate: new Date(2020, 7, 24, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            key: 0,
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 0, 0),
            endDate: new Date(2020, 7, 25, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            key: 1,
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 1, 0),
            endDate: new Date(2020, 7, 24, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            key: 2,
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 1, 0),
            endDate: new Date(2020, 7, 25, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            key: 3,
        },
    ]],
    verticalGrouping: [[
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_2',
            groupIndex: 2,
            index: 0,
            key: 0,
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_2',
            groupIndex: 2,
            index: 1,
            key: 1,
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 0, 0),
            endDate: new Date(2020, 7, 24, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            index: 0,
            key: 0,
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 0, 0),
            endDate: new Date(2020, 7, 25, 0, 30),
            groups: 'group_2',
            groupIndex: 2,
            index: 1,
            key: 1,
        }
    ],
    [
        {
            allDay: true,
            startDate: new Date(2020, 7, 24),
            endDate: new Date(2020, 7, 24),
            groups: 'group_3',
            groupIndex: 3,
            index: 0,
            key: 2,
        },
        {
            allDay: true,
            startDate: new Date(2020, 7, 25),
            endDate: new Date(2020, 7, 25),
            groups: 'group_3',
            groupIndex: 3,
            index: 1,
            key: 3,
        }
    ],
    [
        {
            allDay: false,
            startDate: new Date(2020, 7, 24, 1, 0),
            endDate: new Date(2020, 7, 24, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            index: 0,
            key: 2,
        },
        {
            allDay: false,
            startDate: new Date(2020, 7, 25, 1, 0),
            endDate: new Date(2020, 7, 25, 1, 30),
            groups: 'group_3',
            groupIndex: 3,
            index: 1,
            key: 3,
        }
    ]]
};

const testHeaderDataMap = {
    horizontalGrouping: [testViewDataMap.horizontalGrouping[0]],
    verticalGrouping: [testViewDataMap.verticalGrouping[1]],
};

const verticalGroupingRenderOptions = {
    startRowIndex: 0,
    startCellIndex: 0,
    rowCount: 4,
    cellCount: 2,
    topVirtualRowHeight: undefined,
    bottomVirtualRowHeight: undefined,
    groupOrientation: 'vertical',
    isProvideVirtualCellsWidth: true,
    isAllDayPanelVisible: true,
    isGenerateTimePanelData: true,
    viewType: 'day',
    groups: [{
        name: 'groupId',
        items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    }],
};
const horizontalGroupingRenderOptions = {
    startRowIndex: 0,
    startCellIndex: 0,
    rowCount: 2,
    topVirtualRowHeight: undefined,
    bottomVirtualRowHeight: undefined,
    groupOrientation: 'horizontal',
    isProvideVirtualCellsWidth: true,
    isAllDayPanelVisible: true,
    isGenerateTimePanelData: true,
    viewType: 'day',
    groups: [],
};

const createViewDataProvider = ({
    renderOptions = verticalGroupingRenderOptions,
    completeViewDataMap = testViewDataMap.verticalGrouping,
    completeDateHeaderMap = testHeaderDataMap.verticalGrouping,
    completeTimePanelMap = [],
}) => {
    const viewDataProvider = new ViewDataProvider();

    viewDataProvider.completeViewDataMap = completeViewDataMap;
    viewDataProvider.completeDateHeaderMap = completeDateHeaderMap;
    viewDataProvider.completeTimePanelMap = completeTimePanelMap;

    viewDataProvider.update(renderOptions, false);

    return viewDataProvider;
};

module('View Data Provider', {
    beforeEach: function() {
        this.init = groupOrientation => {
            if(groupOrientation === 'vertical') {
                this.viewDataProvider = createViewDataProvider({
                    renderOptions: verticalGroupingRenderOptions,
                    completeViewDataMap: testViewDataMap.verticalGrouping,
                    completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    completeTimePanelMap: [],
                });
            } else if(groupOrientation === 'horizontal') {
                this.viewDataProvider = createViewDataProvider({
                    renderOptions: horizontalGroupingRenderOptions,
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
                    { rowIndex: 1, columnIndex: 1 },
                    'Last position for the group 2 is correct'
                );

                assert.deepEqual(
                    this.viewDataProvider.getLastGroupCellPosition(3),
                    { rowIndex: 3, columnIndex: 1 },
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
                const renderOptions = {
                    ...verticalGroupingRenderOptions,
                    rowCount: 5,
                };
                const viewDataProvider = createViewDataProvider({
                    renderOptions,
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

        module('hasGroupAllDayPanel', () => {
            test('it should work with vertical grouping', function(assert) {
                this.init('vertical');
                this.viewDataProvider.createGroupedDataMapProvider();

                assert.equal(this.viewDataProvider.hasGroupAllDayPanel(2), true, 'Correct value');
                assert.equal(this.viewDataProvider.hasGroupAllDayPanel(3), true, 'Correct value');
            });

            test('it should work with horizontal grouping', function(assert) {
                this.init('horizontal');
                this.viewDataProvider.createGroupedDataMapProvider();

                assert.equal(this.viewDataProvider.hasGroupAllDayPanel(2), true, 'Correct value');
                assert.equal(this.viewDataProvider.hasGroupAllDayPanel(3), true, 'Correct value');
            });

            test('it should work with vertical grouping when all-day panel is not visible', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    renderOptions: { ...verticalGroupingRenderOptions, isAllDayPanelVisible: false },
                    completeViewDataMap: [testViewDataMap.verticalGrouping[1], testViewDataMap.verticalGrouping[3]],
                });
                viewDataProvider.createGroupedDataMapProvider();

                assert.equal(viewDataProvider.hasGroupAllDayPanel(2), false, 'Correct value');
                assert.equal(viewDataProvider.hasGroupAllDayPanel(3), false, 'Correct value');
            });

            test('it should work with horizontal grouping all-day panel is not visible', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    renderOptions: { ...horizontalGroupingRenderOptions, isAllDayPanelVisible: false },
                    completeViewDataMap: testViewDataMap.verticalGrouping.slice(1),
                });
                viewDataProvider.createGroupedDataMapProvider();

                assert.equal(viewDataProvider.hasGroupAllDayPanel(2), false, 'Correct value');
                assert.equal(viewDataProvider.hasGroupAllDayPanel(3), false, 'Correct value');
            });
        });

        module('findGroupCellStartDate', {
            beforeEach: function() {
                this.init('vertical');
            }
        }, () => {
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

                test('it should return correct cell start date if find by date', function(assert) {
                    assert.deepEqual(
                        this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 24, 0, 10), new Date(2020, 7, 24, 1, 10), true),
                        new Date(2020, 7, 24),
                        'Group 2 cell 0 start date is correct'
                    );

                    assert.deepEqual(
                        this.viewDataProvider.findGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 20), true),
                        new Date(2020, 7, 25),
                        'Group 2 cell 1 start date is correct'
                    );

                    assert.deepEqual(
                        this.viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 24, 0, 11), new Date(2020, 7, 24, 1, 22), true),
                        new Date(2020, 7, 24),
                        'Group 3 cell 0 start date is correct'
                    );

                    assert.deepEqual(
                        this.viewDataProvider.findGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11), new Date(2020, 7, 25, 1, 30), true),
                        new Date(2020, 7, 25),
                        'Group 3 cell 1 start date is correct'
                    );
                });
            });

            module('Date views', () => {
                const renderOptions = {
                    ...verticalGroupingRenderOptions,
                    viewType: 'month',
                };

                test('it should return correct cell start date', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions,
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
            });
        });

        module('findAllDayGroupCellStartDate', {
            beforeEach: function() {
                this.init('vertical');
            }
        }, () => {
            module('Date and time views', () => {
                test('it should return correct all day cell start date', function(assert) {
                    this.init('vertical');

                    assert.deepEqual(
                        this.viewDataProvider.findAllDayGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11)),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        this.viewDataProvider.findAllDayGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11)),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        this.viewDataProvider.findAllDayGroupCellStartDate(2, new Date(2020, 7, 23, 0, 11)),
                        new Date(2020, 7, 24),
                        'Group 2 cell 1 allDay start date is correct when startDate is out of view'
                    );
                });
            });

            module('Date views', () => {
                const renderOptions = {
                    ...verticalGroupingRenderOptions,
                    viewType: 'month',
                };

                test('it should return correct cell start date', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                    });

                    assert.deepEqual(
                        viewDataProvider.findAllDayGroupCellStartDate(2, new Date(2020, 7, 25, 0, 11)),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findAllDayGroupCellStartDate(3, new Date(2020, 7, 25, 0, 11)),
                        new Date(2020, 7, 25, 0, 11),
                        'Group 2 cell 1 allDay start date is correct'
                    );

                    assert.deepEqual(
                        viewDataProvider.findAllDayGroupCellStartDate(2, new Date(2020, 7, 23, 0, 11)),
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
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 2, columnIndex: 0 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, columnIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, columnIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });

                    test('Should return correct cell position if index is provided', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, columnIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24), true, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 0 },
                            '1st allDayPanel cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24), true, 0);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, columnIndex: 0 },
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
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 2 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 2 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 2 },
                            '2nd cell position is correct'
                        );
                    });
                });
            });

            module('Date views', () => {
                module('Vertical Grouping', function() {
                    const renderOptions = {
                        ...verticalGroupingRenderOptions,
                        viewType: 'month',
                    };

                    test('Should return correct cell position for the allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            renderOptions,
                            completeViewDataMap: testViewDataMap.verticalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                        });

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 2, columnIndex: 0 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            renderOptions,
                            completeViewDataMap: testViewDataMap.verticalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.verticalGrouping
                        });

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 0, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, columnIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29));
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 2, columnIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });
                });

                module('Horizontal Grouping', function() {
                    const renderOptions = {
                        ...horizontalGroupingRenderOptions,
                        viewType: 'month',
                    };

                    test('Should return correct cell position for the allDay cell date', function(assert) {
                        const viewDataProvider = createViewDataProvider({
                            renderOptions,
                            completeViewDataMap: testViewDataMap.horizontalGrouping,
                            completeDateHeaderMap: testHeaderDataMap.horizontalGrouping
                        });

                        const firstCellInfo = createCellInfo(2, new Date(2020, 7, 24), true);
                        let position = viewDataProvider.findCellPositionInMap(firstCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 0 }, '1st allDayPanel cell position is correct');

                        const secondCellInfo = createCellInfo(3, new Date(2020, 7, 24), true);
                        position = viewDataProvider.findCellPositionInMap(secondCellInfo);
                        assert.deepEqual(position, { rowIndex: 0, columnIndex: 2 }, '2nd allDayPanel cell position is correct');
                    });

                    test('Should return correct cell position for the not allDay cell date', function(assert) {
                        const { viewDataProvider } = this;

                        let cellInfo = createCellInfo(2, new Date(2020, 7, 24), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(2, new Date(2020, 7, 24, 0, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 1, columnIndex: 0 },
                            '1st cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, columnIndex: 0 },
                            '2nd cell position is correct'
                        );

                        cellInfo = createCellInfo(3, new Date(2020, 7, 24, 1, 29), false);
                        assert.deepEqual(
                            viewDataProvider.findCellPositionInMap(cellInfo),
                            { rowIndex: 3, columnIndex: 0 },
                            '2nd cell position is correct'
                        );
                    });
                });
            });
        });

        module('isSkippedDate', () => {
            test('it should return correct value for the weekend', function(assert) {
                [
                    { viewType: 'day', expected: false },
                    { viewType: 'week', expected: false },
                    { viewType: 'workWeek', expected: true },
                    { viewType: 'month', expected: false },
                    { viewType: 'timelineDay', expected: false },
                    { viewType: 'timelineWeek', expected: false },
                    { viewType: 'timelineWorkWeek', expected: true },
                    { viewType: 'timelineMonth', expected: false },
                ].forEach(({ viewType, expected }) => {
                    const viewDataProvider = new ViewDataProvider(viewType);
                    const result = viewDataProvider.isSkippedDate(new Date(2021, 8, 4));

                    assert.equal(result, expected, `isSkippedDate is correct for the ${viewType} view type`);
                });
            });

            test('it should return correct value for the week day', function(assert) {
                supportedViews.forEach((viewType) => {
                    const viewDataProvider = new ViewDataProvider(viewType);
                    const result = viewDataProvider.isSkippedDate(new Date(2021, 8, 3));

                    assert.notOk(result, `isSkippedDate is correct for the ${viewType} view type`);
                });
            });
        });

        module('createGroupedDataMapProvider', () => {
            test('it should create groupedDataMapProvider', function(assert) {
                const viewDataProvider = new ViewDataProvider('day');

                viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;

                viewDataProvider.viewDataMap = viewDataProvider.viewDataGenerator
                    .generateViewDataMap(testViewDataMap.verticalGrouping, verticalGroupingRenderOptions);
                viewDataProvider.setViewOptions(verticalGroupingRenderOptions);

                viewDataProvider.createGroupedDataMapProvider();

                assert.ok(viewDataProvider.groupedDataMap, 'GroupedDataMap was created');
            });
        });

        module('getViewPortGroupCount', () => {
            test('it should return correct value if vertical grouping', function(assert) {
                const viewDataProvider = new ViewDataProvider('day');

                viewDataProvider.completeViewDataMap = testViewDataMap.verticalGrouping;

                viewDataProvider.viewDataMap = viewDataProvider.viewDataGenerator
                    .generateViewDataMap(testViewDataMap.verticalGrouping, verticalGroupingRenderOptions);
                viewDataProvider.setViewOptions(verticalGroupingRenderOptions);

                viewDataProvider.createGroupedDataMapProvider();

                assert.equal(viewDataProvider.getViewPortGroupCount(), 4, 'Viewport group cout is correct');
            });

            test('it should return correct value if horizontal grouping', function(assert) {
                const viewDataProvider = new ViewDataProvider('day');

                viewDataProvider.completeViewDataMap = testViewDataMap.horizontalGrouping;

                viewDataProvider.viewDataMap = viewDataProvider.viewDataGenerator
                    .generateViewDataMap(testViewDataMap.horizontalGrouping, horizontalGroupingRenderOptions);
                viewDataProvider.setViewOptions(horizontalGroupingRenderOptions);

                viewDataProvider.createGroupedDataMapProvider();

                assert.equal(viewDataProvider.getViewPortGroupCount(), 4, 'Viewport group cout is correct');
            });
        });
    });

    function createCellInfo(groupIndex, startDate, isAllDay, index) {
        return { groupIndex, startDate, isAllDay, index };
    }

    module('Data generation', () => {
        module('Standard scrolling', () => {
            const baseStartDate = new Date(2021, 0, 10, 5);
            const dataGenerationRenderOptions = {
                ...horizontalGroupingRenderOptions,
                verticalGroupCount: 1,
                today: baseStartDate,
                groupByDate: false,
                groups: [{
                    name: 'groupId',
                    items: [{
                        id: 1,
                        color: 'red',
                        text: 'First group',
                    }, {
                        id: 2,
                        color: 'green',
                        text: 'Second group',
                    }]
                }],
                isAllDayPanelVisible: false,
                isGroupedByDate: false,
                headerCellTextFormat: 'shorttime',
                getDateForHeaderText: (_, date) => date,
                isGenerateTimePanelData: true,
                startDayHour: 5,
                endDayHour: 7,
                hoursInterval: 1,
                currentDate: new Date(baseStartDate),
                firstDayOfWeek: 0,
                intervalCount: 2,
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
                                            columnIndex: 0
                                        }
                                    },
                                    {
                                        cellData: viewDataMap[0][1],
                                        position: {
                                            rowIndex: 0,
                                            columnIndex: 1
                                        }
                                    }
                                ],
                                [{
                                    cellData: viewDataMap[1][0],
                                    position: {
                                        rowIndex: 1,
                                        columnIndex: 0
                                    }
                                },
                                {
                                    cellData: viewDataMap[1][1],
                                    position: {
                                        rowIndex: 1,
                                        columnIndex: 1
                                    }
                                }]
                            ],
                            [
                                [
                                    {
                                        cellData: viewDataMap[2][0],
                                        position: {
                                            rowIndex: 2,
                                            columnIndex: 0
                                        }
                                    },
                                    {
                                        cellData: viewDataMap[2][1],
                                        position: {
                                            rowIndex: 2,
                                            columnIndex: 1
                                        }
                                    }
                                ],
                                [{
                                    cellData: viewDataMap[3][0],
                                    position: {
                                        rowIndex: 3,
                                        columnIndex: 0
                                    }
                                },
                                {
                                    cellData: viewDataMap[3][1],
                                    position: {
                                        rowIndex: 3,
                                        columnIndex: 1
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
                                        columnIndex: 0
                                    }
                                },
                                {
                                    cellData: viewDataMap[0][1],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 1
                                    }
                                }
                            ],
                            [
                                {
                                    cellData: viewDataMap[0][2],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 2
                                    }
                                },
                                {
                                    cellData: viewDataMap[0][3],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 3
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
                                        columnIndex: 0
                                    }
                                },
                                {
                                    cellData: viewDataMap[1][1],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 1
                                    }
                                }]
                            ],
                            [
                                [{
                                    cellData: viewDataMap[1][2],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 2
                                    }
                                },
                                {
                                    cellData: viewDataMap[1][3],
                                    position: {
                                        rowIndex: 0,
                                        columnIndex: 3
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
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(dataGenerationRenderOptions, true);

                const expectedDateHeaderMap = [[{
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    text: '5:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 1,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 2,
                    text: '5:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 1,
                    groups: { groupId: 2, },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 3,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly when grouping by date is used', function(assert) {
                const completeDateHeaderMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    groupByDate: true,
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeDateHeaderMapRenderOptions, true);

                const expectedDateHeaderMap = [[{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 0,
                    text: '5:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 2,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly when it is necessary to generate week days header', function(assert) {
                const completeDateHeaderMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    isGenerateWeekDaysHeaderData: true,
                    getWeekDaysHeaderText: () => 'week header text',
                    intervalCount: 2,
                    viewType: 'timelineDay',
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeDateHeaderMapRenderOptions, true);

                const expectedDateHeaderMap = [[{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10, 5),
                    endDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    text: 'Sun 10',
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11, 5),
                    endDate: new Date(2021, 0, 11, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 2,
                    text: 'Mon 11',
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10, 5),
                    endDate: new Date(2021, 0, 10, 6),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 4,
                    text: 'Sun 10',
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11, 5),
                    endDate: new Date(2021, 0, 11, 6),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 2,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 6,
                    text: 'Mon 11',
                    allDay: false,
                }], [{
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    text: '5:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 1,
                    text: '6:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 2,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 3,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 3,
                    text: '6:00 AM',
                    today: false,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    text: '5:00 AM',
                    key: 4,
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 1,
                    groups: { groupId: 2, },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 5,
                    text: '6:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 2,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 6,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }, {
                    colSpan: 1,
                    startDate: new Date(2021, 0, 11, 6),
                    groupIndex: 1,
                    groups: { groupId: 2, },
                    index: 3,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 7,
                    text: '6:00 AM',
                    today: false,
                    allDay: false,
                }]];

                const completeDateHeaderMap = viewDataProvider.completeDateHeaderMap;

                assert.deepEqual(completeDateHeaderMap, expectedDateHeaderMap, 'Correct Date Header map');
            });

            test('completeDateHeaderMap should be generated correctly when it is necessary to generate week days header and groupByDate is true', function(assert) {
                const completeDateHeaderMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    isGenerateWeekDaysHeaderData: true,
                    getWeekDaysHeaderText: () => 'week header text',
                    groupByDate: true,
                    intervalCount: 2,
                    viewType: 'timelineDay',
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeDateHeaderMapRenderOptions, true);

                const expectedDateHeaderMap = [[{
                    colSpan: 4,
                    startDate: new Date(2021, 0, 10, 5),
                    endDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    text: 'Sun 10',
                    allDay: false,
                }, {
                    colSpan: 4,
                    startDate: new Date(2021, 0, 11, 5),
                    endDate: new Date(2021, 0, 11, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 4,
                    text: 'Mon 11',
                    allDay: false,
                }], [{
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 0,
                    text: '5:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 2,
                    text: '6:00 AM',
                    today: true,
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 2,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 4,
                    text: '5:00 AM',
                    today: false,
                    allDay: false,
                }, {
                    colSpan: 2,
                    startDate: new Date(2021, 0, 11, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 3,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 6,
                    text: '6:00 AM',
                    today: false,
                    allDay: false,
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
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('completeTimePanelMap should be generated correctly', function(assert) {
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(dataGenerationRenderOptions, true);

                const expectedCompleteTimePanelMap = [{
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: undefined,
                    groups: undefined,
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: undefined,
                    groups: undefined,
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: false,
                    text: '',
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when all-day panel is enabled', function(assert) {
                const completeTimePanelMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    isAllDayPanelVisible: true,
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeTimePanelMapRenderOptions, true);

                const expectedCompleteTimePanelMap = [{
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: undefined,
                    groups: undefined,
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    text: '',
                }, {
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: undefined,
                    groups: undefined,
                    index: 0,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: undefined,
                    groups: undefined,
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: false,
                    text: '',
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when vertical grouping is enabled', function(assert) {
                const completeTimePanelMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    groupOrientation: 'vertical',
                    groups: [{
                        name: 'groupId',
                        items: [{ id: 1 }, { id: 2 }],
                    }],
                    isAllDayPanelVisible: true,
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeTimePanelMapRenderOptions, true);

                const expectedCompleteTimePanelMap = [{
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    text: '',
                }, {
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 2,
                    allDay: false,
                    text: '',
                }, {
                    allDay: true,
                    startDate: new Date(2021, 0, 10),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    text: '',
                }, {
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 6,
                    allDay: false,
                    text: '',
                }];

                const completeTimePanelMap = viewDataProvider.completeTimePanelMap;

                assert.deepEqual(completeTimePanelMap, expectedCompleteTimePanelMap, 'Correct Time Panel map');
            });

            test('completeTimePanelMap should be generated correctly when vertical grouping is enabled and all-day panel is absent', function(assert) {
                const completeTimePanelMapRenderOptions = {
                    ...dataGenerationRenderOptions,
                    groupOrientation: 'vertical',
                    groups: [{
                        name: 'groupId',
                        items: [{ id: 1 }, { id: 2 }],
                    }],
                    isAllDayPanelVisible: false,
                };
                const viewDataProvider = new ViewDataProvider();

                viewDataProvider.update(completeTimePanelMapRenderOptions, true);

                const expectedCompleteTimePanelMap = [{
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 0,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 0,
                    groups: { groupId: 1 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 2,
                    allDay: false,
                    text: '',
                }, {
                    startDate: new Date(2021, 0, 10, 5),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 0,
                    isFirstGroupCell: true,
                    isLastGroupCell: false,
                    key: 4,
                    allDay: false,
                    text: '5:00 AM',
                }, {
                    startDate: new Date(2021, 0, 10, 6),
                    groupIndex: 1,
                    groups: { groupId: 2 },
                    index: 1,
                    isFirstGroupCell: false,
                    isLastGroupCell: true,
                    key: 6,
                    allDay: false,
                    text: '',
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
                        isGroupedAllDayPanel: false,
                        key: '0',
                    }, {
                        dateTable: [
                            completeTimePanelMap[2],
                            completeTimePanelMap[3],
                        ],
                        groupIndex: 1,
                        isGroupedAllDayPanel: false,
                        key: '1',
                    }],
                    bottomVirtualRowHeight: undefined,
                    topVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: true,
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
                        key: '0'
                    }],
                    bottomVirtualRowHeight: undefined,
                    topVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: true,
                };

                assert.deepEqual(viewDataProvider.timePanelData, expectedTimePanelMap, 'Correct time panel data');
            });

            test('groupPanelData should be generated correctly', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    renderOptions: dataGenerationRenderOptions,
                });

                const expectedGroupPanelData = {
                    baseColSpan: 2,
                    groupPanelItems: [[{
                        color: 'red',
                        data: undefined,
                        id: 1,
                        key: '0_groupId_1',
                        resourceName: 'groupId',
                        text: 'First group'
                    }, {
                        color: 'green',
                        data: undefined,
                        id: 2,
                        key: '0_groupId_2',
                        resourceName: 'groupId',
                        text: 'Second group'
                    }]]
                };

                const groupPanelData = viewDataProvider.getGroupPanelData(dataGenerationRenderOptions);

                assert.deepEqual(groupPanelData, expectedGroupPanelData, 'Correct group panel data');
            });
        });

        module('Vertical virtual scrolling', () => {
            const virtualVerticalGroupingRenderOptions = {
                startCellIndex: 0,
                startRowIndex: 1,
                cellCount: 2,
                rowCount: 2,
                topVirtualRowHeight: 50,
                bottomVirtualRowHeight: 50,
                groupOrientation: 'vertical',
                isProvideVirtualCellsWidth: true,
                isAllDayPanelVisible: true,
                isGenerateTimePanelData: true,
                viewType: 'day',
                groups: [{
                    name: 'groupId',
                    items: [{ id: 1 }, { id: 2 }],
                }],
            };
            const virtualHorizontalGroupingRenderOptions = {
                startCellIndex: 0,
                startRowIndex: 1,
                rowCount: 1,
                cellCount: 2,
                topVirtualRowHeight: 50,
                bottomVirtualRowHeight: 50,
                groupOrientation: 'horizontal',
                isProvideVirtualCellsWidth: true,
                isAllDayPanelVisible: true,
                viewType: 'day',
                groups: [{
                    name: 'groupId',
                    items: [{ id: 1 }, { id: 2 }],
                }],
            };
            const horizontalDataMap = [[
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_2',
                    groupIndex: 2,
                    index: 0,
                    key: 0,
                },
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_3',
                    groupIndex: 3,
                    index: 0,
                    key: 1,
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 0),
                    endDate: new Date(2020, 7, 24, 0, 30),
                    groups: 'group_2',
                    groupIndex: 2,
                    index: 0,
                    key: 0,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 1, 0),
                    endDate: new Date(2020, 7, 24, 1, 30),
                    groups: 'group_3',
                    groupIndex: 3,
                    index: 0,
                    key: 1,
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_2',
                    groupIndex: 2,
                    index: 1,
                    key: 2,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_3',
                    groupIndex: 3,
                    index: 1,
                    key: 3,
                },
            ]];
            const horizontalDateHeaderMap = [horizontalDataMap[1]];

            module('viewData', () => {
                test('viewData should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: virtualVerticalGroupingRenderOptions,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewData = {
                        groupedData: [{
                            dateTable: [{
                                cells: completeViewDataMap[1],
                                key: 0,
                            }],
                            groupIndex: 2,
                            isGroupedAllDayPanel: false,
                            key: '2',
                        }, {
                            allDayPanel: completeViewDataMap[2],
                            dateTable: [],
                            groupIndex: 3,
                            isGroupedAllDayPanel: true,
                            key: '3'
                        }],
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 1,
                        leftVirtualCellCount: 0,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: true,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('viewData should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: virtualHorizontalGroupingRenderOptions,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: completeViewDataMap[0],
                            dateTable: [{
                                cells: completeViewDataMap[2],
                                key: 2,
                            }],
                            groupIndex: 2,
                            isGroupedAllDayPanel: false,
                            key: '0',
                        }],
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 1,
                        leftVirtualCellCount: 0,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('selected and focused cells should be marked in viewData', function(assert) {
                    const completeViewDataMap = horizontalDataMap;
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: {
                            ...virtualHorizontalGroupingRenderOptions,
                            selectedCells: [completeViewDataMap[2][0], completeViewDataMap[2][1]],
                            focusedCell: {
                                cellData: completeViewDataMap[2][0],
                            },
                        },
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: completeViewDataMap[0],
                            dateTable: [{
                                cells: [{
                                    ...completeViewDataMap[2][0],
                                    isSelected: true,
                                    isFocused: true,
                                }, {
                                    ...completeViewDataMap[2][1],
                                    isSelected: true,
                                    isFocused: false,
                                }],
                                key: 2,
                            }],
                            groupIndex: 2,
                            key: '0',
                            isGroupedAllDayPanel: false,
                        }],
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 1,
                        leftVirtualCellCount: 0,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });
            });

            module('viewDataMap', () => {
                test('viewDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: virtualVerticalGroupingRenderOptions,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewDataMap = {
                        allDayPanelMap: [],
                        dateTableMap: [[{
                            cellData: completeViewDataMap[1][0],
                            position: { rowIndex: 0, columnIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[1][1],
                            position: { rowIndex: 0, columnIndex: 1 },
                        }], [{
                            cellData: completeViewDataMap[2][0],
                            position: { rowIndex: 1, columnIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[2][1],
                            position: { rowIndex: 1, columnIndex: 1 },
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
                        renderOptions: virtualHorizontalGroupingRenderOptions,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewDataMap = {
                        allDayPanelMap: [{
                            cellData: completeViewDataMap[0][0],
                            position: { rowIndex: 0, columnIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[0][1],
                            position: { rowIndex: 0, columnIndex: 1 },
                        }],
                        dateTableMap: [[{
                            cellData: completeViewDataMap[2][0],
                            position: { rowIndex: 0, columnIndex: 0 },
                        }, {
                            cellData: completeViewDataMap[2][1],
                            position: { rowIndex: 0, columnIndex: 1 },
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
                        renderOptions: virtualVerticalGroupingRenderOptions,
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
                                position: { rowIndex: 0, columnIndex: 0 },
                            }, {
                                cellData: completeViewDataMap[1][1],
                                position: { rowIndex: 0, columnIndex: 1 },
                            }]], [[{
                                cellData: completeViewDataMap[2][0],
                                position: { rowIndex: 1, columnIndex: 0 },
                            }, {
                                cellData: completeViewDataMap[2][1],
                                position: { rowIndex: 1, columnIndex: 1 },
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
                        renderOptions: virtualHorizontalGroupingRenderOptions,
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
                                position: { rowIndex: 0, columnIndex: 0 },
                            }],
                            [{
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, columnIndex: 1 },
                            }]
                        ],
                        dateTableGroupedMap: [
                            undefined,
                            undefined,
                            [
                                [{
                                    cellData: completeViewDataMap[2][0],
                                    position: { rowIndex: 0, columnIndex: 0 },
                                }]
                            ], [
                                [{
                                    cellData: completeViewDataMap[2][1],
                                    position: { rowIndex: 0, columnIndex: 1 },
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
                    renderOptions: virtualVerticalGroupingRenderOptions,
                });

                const expectedTimePanelMap = {
                    groupedData: [{
                        dateTable: [
                            completeTimePanelMap[1],
                        ],
                        groupIndex: 0,
                        key: '0',
                        isGroupedAllDayPanel: false,
                    }, {
                        dateTable: [
                            completeTimePanelMap[2],
                        ],
                        groupIndex: 1,
                        key: '1',
                        isGroupedAllDayPanel: false,
                    }],
                    bottomVirtualRowHeight: 50,
                    topVirtualRowHeight: 50,
                    isGroupedAllDayPanel: true,
                };

                assert.deepEqual(viewDataProvider.timePanelData, expectedTimePanelMap, 'Correct time panel data');
            });
        });

        module('Horizontal virtual scrolling', () => {
            const virtualVerticalGroupingRenderOptions = {
                startCellIndex: 1,
                cellCount: 1,
                startRowIndex: 0,
                rowCount: 2,
                leftVirtualCellWidth: 20,
                rightVirtualCellWidth: 30,
                topVirtualRowHeight: 50,
                bottomVirtualRowHeight: 50,
                groupOrientation: 'vertical',
                isProvideVirtualCellsWidth: true,
                isAllDayPanelVisible: true,
                viewType: 'day',
                groups: [{
                    name: 'groupId',
                    items: [{ id: 1 }, { id: 2 }],
                }],
            };

            const virtualHorizontalGroupingRenderOptions = {
                startCellIndex: 1,
                cellCount: 1,
                startRowIndex: 0,
                rowCount: 2,
                leftVirtualCellWidth: 20,
                rightVirtualCellWidth: 30,
                topVirtualRowHeight: 50,
                bottomVirtualRowHeight: 50,
                groupOrientation: 'horizontal',
                isProvideVirtualCellsWidth: true,
                isAllDayPanelVisible: true,
                viewType: 'day',
                groups: [{
                    name: 'groupId',
                    items: [{ id: 1 }, { id: 2 }],
                }],
            };
            const horizontalDataMap = [[
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_1',
                    groupIndex: 1,
                    key: 0,
                },
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_2',
                    groupIndex: 2,
                    key: 1,
                },
                {
                    allDay: true,
                    startDate: new Date(2020, 7, 24),
                    endDate: new Date(2020, 7, 24),
                    groups: 'group_3',
                    groupIndex: 3,
                    key: 2,
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 0),
                    endDate: new Date(2020, 7, 24, 0, 30),
                    groups: 'group_1',
                    groupIndex: 1,
                    key: 0,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 1, 0),
                    endDate: new Date(2020, 7, 24, 1, 30),
                    groups: 'group_1',
                    groupIndex: 2,
                    key: 1,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 1, 0),
                    endDate: new Date(2020, 7, 24, 1, 30),
                    groups: 'group_3',
                    groupIndex: 3,
                    key: 2,
                },
            ],
            [
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_1',
                    groupIndex: 1,
                    key: 3,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_2',
                    groupIndex: 2,
                    key: 4,
                },
                {
                    allDay: false,
                    startDate: new Date(2020, 7, 24, 0, 30),
                    endDate: new Date(2020, 7, 24, 1, 0),
                    groups: 'group_3',
                    groupIndex: 3,
                    key: 5,
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
                        renderOptions: virtualVerticalGroupingRenderOptions,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: [completeViewDataMap[0][1]],
                            dateTable: [{
                                cells: [completeViewDataMap[1][1]],
                                key: 0,
                            }],
                            groupIndex: 2,
                            isGroupedAllDayPanel: true,
                            key: '2',
                        }],
                        bottomVirtualRowCount: 2,
                        topVirtualRowCount: 0,
                        leftVirtualCellCount: 1,
                        rightVirtualCellCount: 0,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: 20,
                        rightVirtualCellWidth: 30,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: true,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('viewData should be generated correctly if horizontal grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: virtualHorizontalGroupingRenderOptions,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: [completeViewDataMap[0][1]],
                            dateTable: [{
                                cells: [completeViewDataMap[1][1]],
                                key: 0,
                            }, {
                                cells: [completeViewDataMap[2][1]],
                                key: 3,
                            }],
                            groupIndex: 2,
                            isGroupedAllDayPanel: false,
                            key: '0',
                        }],
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 0,
                        leftVirtualCellCount: 1,
                        rightVirtualCellCount: 1,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: 20,
                        rightVirtualCellWidth: 30,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });

                test('viewData should be generated correctly when virtual widths should not be passed', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: {
                            ...virtualHorizontalGroupingRenderOptions,
                            isProvideVirtualCellsWidth: false,
                        },
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewData = {
                        groupedData: [{
                            allDayPanel: [completeViewDataMap[0][1]],
                            dateTable: [{
                                cells: [completeViewDataMap[1][1]],
                                key: 0,
                            }, {
                                cells: [completeViewDataMap[2][1]],
                                key: 3,
                            }],
                            groupIndex: 2,
                            isGroupedAllDayPanel: false,
                            key: '0',
                        }],
                        bottomVirtualRowCount: 1,
                        topVirtualRowCount: 0,
                        leftVirtualCellCount: 1,
                        rightVirtualCellCount: 1,
                        bottomVirtualRowHeight: 50,
                        leftVirtualCellWidth: undefined,
                        rightVirtualCellWidth: undefined,
                        topVirtualRowHeight: 50,
                        isGroupedAllDayPanel: false,
                    };

                    const viewData = viewDataProvider.viewData;

                    assert.deepEqual(viewData, expectedViewData, 'View data is correct');
                });
            });

            module('viewDataMap', () => {
                test('viewDataMap should be generated correctly if vertical grouping', function(assert) {
                    const viewDataProvider = createViewDataProvider({
                        renderOptions: virtualVerticalGroupingRenderOptions,
                        completeViewDataMap: testViewDataMap.verticalGrouping,
                        completeDateHeaderMap: testHeaderDataMap.verticalGrouping,
                    });

                    const completeViewDataMap = testViewDataMap.verticalGrouping;

                    const expectedViewDataMap = {
                        allDayPanelMap: [],
                        dateTableMap: [
                            [{
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, columnIndex: 0 },
                            }], [{
                                cellData: completeViewDataMap[1][1],
                                position: { rowIndex: 1, columnIndex: 0 },
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
                        renderOptions: virtualHorizontalGroupingRenderOptions,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });
                    const completeViewDataMap = horizontalDataMap;

                    const expectedViewDataMap = {
                        allDayPanelMap: [
                            {
                                cellData: completeViewDataMap[0][1],
                                position: { rowIndex: 0, columnIndex: 0 },
                            }
                        ],
                        dateTableMap: [
                            [{
                                cellData: completeViewDataMap[1][1],
                                position: { rowIndex: 0, columnIndex: 0 },
                            }], [{
                                cellData: completeViewDataMap[2][1],
                                position: { rowIndex: 1, columnIndex: 0 },
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
                        renderOptions: virtualVerticalGroupingRenderOptions,
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
                                    position: { rowIndex: 0, columnIndex: 0 },
                                }],
                                [{
                                    cellData: completeViewDataMap[1][1],
                                    position: { rowIndex: 1, columnIndex: 0 },
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
                        renderOptions: virtualHorizontalGroupingRenderOptions,
                        completeViewDataMap: horizontalDataMap,
                        completeDateHeaderMap: horizontalDateHeaderMap,
                    });

                    const completeViewDataMap = horizontalDataMap;

                    const expectedGroupedDataMap = {
                        allDayPanelGroupedMap: [
                            undefined,
                            undefined,
                            [
                                {
                                    cellData: completeViewDataMap[0][1],
                                    position: { rowIndex: 0, columnIndex: 0 },
                                }
                            ]
                        ],
                        dateTableGroupedMap: [
                            undefined,
                            undefined,
                            [
                                [{
                                    cellData: completeViewDataMap[1][1],
                                    position: { rowIndex: 0, columnIndex: 0 },
                                }],
                                [{
                                    cellData: completeViewDataMap[2][1],
                                    position: { rowIndex: 1, columnIndex: 0 },
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
                    renderOptions: {
                        ...virtualHorizontalGroupingRenderOptions,
                        cellWidth: 100,
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
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly when width should not be provided', function(assert) {
                const viewDataProvider = createViewDataProvider({
                    renderOptions: {
                        ...virtualHorizontalGroupingRenderOptions,
                        cellWidth: 100,
                        isProvideVirtualCellsWidth: false,
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
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when one week-day cell is visible', function(assert) {
                const completeViewDataMap = [timelineCompleteDateHeaderMap[1], timelineCompleteDateHeaderMap[1]];

                const viewDataProvider = createViewDataProvider({
                    renderOptions: {
                        ...virtualHorizontalGroupingRenderOptions,
                        isGenerateWeekDaysHeaderData: true,
                        startCellIndex: 2,
                        cellCount: 2,
                        startRowIndex: 0,
                        rowCount: 1,
                        leftVirtualCellWidth: 200,
                        rightVirtualCellWidth: 800,
                        groups: [{
                            name: 'groupId',
                            items: [{ id: 1 }],
                        }],
                        groupByDate: false,
                        cellWidth: 100,
                        startDayHour: 0,
                        endDayHour: 4,
                        hoursInterval: 1,
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
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when several week-day cells are visible', function(assert) {
                const completeViewDataMap = [timelineCompleteDateHeaderMap[1], timelineCompleteDateHeaderMap[1]];

                const viewDataProvider = createViewDataProvider({
                    renderOptions: {
                        ...virtualHorizontalGroupingRenderOptions,
                        isGenerateWeekDaysHeaderData: true,
                        startCellIndex: 2,
                        cellCount: 4,
                        startRowIndex: 0,
                        rowCount: 1,
                        leftVirtualCellWidth: 200,
                        rightVirtualCellWidth: 600,
                        groups: [{
                            name: 'groupId',
                            items: [{ id: 1 }],
                        }],
                        groupByDate: false,
                        cellWidth: 100,
                        startDayHour: 0,
                        endDayHour: 4,
                        hoursInterval: 1,
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
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });

            test('dateHeaderMap should be generated correctly in timelines when grouping by date is used', function(assert) {
                const validTimelineCompleteDateHeaderMap = [[
                    ...timelineCompleteDateHeaderMap[0],
                    {
                        startDate: new Date(2021, 0, 4),
                        endDate: new Date(2021, 0, 5),
                    },
                    {
                        startDate: new Date(2021, 0, 5),
                        endDate: new Date(2021, 0, 6),
                    },
                ], [
                    ...timelineCompleteDateHeaderMap[1],
                    {
                        startDate: new Date(2021, 0, 4, 0, 0),
                        endDate: new Date(2021, 0, 4, 0, 30),
                    },
                    {
                        startDate: new Date(2021, 0, 4, 0, 30),
                        endDate: new Date(2021, 0, 4, 1, 0),
                    },
                    {
                        startDate: new Date(2021, 0, 4, 1, 0),
                        endDate: new Date(2021, 0, 4, 1, 30),
                    },
                    {
                        startDate: new Date(2021, 0, 4, 1, 30),
                        endDate: new Date(2021, 0, 4, 2, 0),
                    },
                    {
                        startDate: new Date(2021, 0, 5, 0, 0),
                        endDate: new Date(2021, 0, 5, 0, 30),
                    },
                    {
                        startDate: new Date(2021, 0, 5, 0, 30),
                        endDate: new Date(2021, 0, 5, 1, 0),
                    },
                    {
                        startDate: new Date(2021, 0, 5, 1, 0),
                        endDate: new Date(2021, 0, 5, 1, 30),
                    },
                    {
                        startDate: new Date(2021, 0, 5, 1, 30),
                        endDate: new Date(2021, 0, 5, 2, 0),
                    }
                ]];
                const completeViewDataMap = [
                    validTimelineCompleteDateHeaderMap[1],
                    validTimelineCompleteDateHeaderMap[1],
                ];

                const viewDataProvider = createViewDataProvider({
                    renderOptions: {
                        ...virtualHorizontalGroupingRenderOptions,
                        isGenerateWeekDaysHeaderData: true,
                        startCellIndex: 5,
                        cellCount: 10,
                        startRowIndex: 0,
                        rowCount: 1,
                        leftVirtualCellWidth: 500,
                        rightVirtualCellWidth: 900,
                        groups: [{
                            name: 'groupId',
                            items: [{ id: 1 }, { id: 2 }],
                        }],
                        groupByDate: true,
                        cellWidth: 100,
                        startDayHour: 0,
                        endDayHour: 4,
                        hoursInterval: 1,
                    },
                    completeViewDataMap,
                    completeDateHeaderMap: validTimelineCompleteDateHeaderMap,
                });

                const dateHeaderMap = [
                    [validTimelineCompleteDateHeaderMap[0][0], validTimelineCompleteDateHeaderMap[0][1]],
                    [
                        validTimelineCompleteDateHeaderMap[1][2], validTimelineCompleteDateHeaderMap[1][3],
                        validTimelineCompleteDateHeaderMap[1][4], validTimelineCompleteDateHeaderMap[1][5],
                        validTimelineCompleteDateHeaderMap[1][6], validTimelineCompleteDateHeaderMap[1][7],
                    ],
                ];
                const dateHeaderData = {
                    dataMap: dateHeaderMap,
                    leftVirtualCellCount: 4,
                    leftVirtualCellWidth: 400,
                    rightVirtualCellCount: 4,
                    rightVirtualCellWidth: 400,
                    weekDayLeftVirtualCellCount: 0,
                    weekDayLeftVirtualCellWidth: 0,
                    weekDayRightVirtualCellCount: 4,
                    weekDayRightVirtualCellWidth: 400,
                    isMonthDateHeader: undefined
                };

                assert.deepEqual(viewDataProvider.dateHeaderData, dateHeaderData, 'Correct dateHeaderData');
            });
        });
    });
});
