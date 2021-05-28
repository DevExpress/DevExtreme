import { noop } from 'core/utils/common';
import 'generic_light.css!';
import $ from 'jquery';

import { stubInvokeMethod } from '../../helpers/scheduler/workspaceTestHelper.js';
import { supportedScrollingModes } from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_month';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';

import keyboardMock from '../../helpers/keyboardMock.js';
import { extend } from 'core/utils/extend';
import { createInstances } from 'ui/scheduler/instanceFactory';

const CELL_CLASS = 'dx-scheduler-date-table-cell';
const DATE_TABLE_CLASS = 'dx-scheduler-date-table';

const WORKSPACE_WEEK = { class: 'dxSchedulerWorkSpaceWeek', name: 'SchedulerWorkSpaceWeek' };
const WORKSPACE_MONTH = { class: 'dxSchedulerWorkSpaceMonth', name: 'SchedulerWorkSpaceMonth' };

QUnit.dump.maxDepth = 10;

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('Renovated Render', {
    before() {
        this.qUnitMaxDepth = QUnit.dump.maxDepth;
        QUnit.dump.maxDepth = 10;
    },
    beforeEach() {
        this.createInstance = (options = {}, workSpace = 'dxSchedulerWorkSpaceDay') => {
            createInstances({
                scheduler: {
                    isVirtualScrolling: () => false,
                    getAppointmentDurationInMinutes: () => 60
                }
            });

            this.instance = $('#scheduler-work-space')[workSpace](extend({
                renovateRender: true,
                currentDate: new Date(2020, 6, 29),
                startDayHour: 0,
                endDayHour: 1,
                focusStateEnabled: true,
                onContentReady: function(e) {
                    const scrollable = e.component.getScrollable();
                    scrollable.option('scrollByContent', false);
                    e.component._attachTablesEvents();
                }
            }, options))[workSpace]('instance');
            stubInvokeMethod(this.instance);
        };
    },
    after() {
        QUnit.dump.maxDepth = this.qUnitMaxDepth;
    }
}, () => {
    module('Generate View Data', () => {
        module('Standard Scrolling', () => {
            test('should work in basic case', function(assert) {
                this.createInstance();

                this.instance.viewDataProvider.update();

                const { viewData, viewDataMap } = this.instance.viewDataProvider;

                const expectedViewData = {
                    groupedData: [{
                        allDayPanel: [{
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groupIndex: 0,
                            index: 0,
                            allDay: true,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 0,
                        }],
                        dateTable: [[{
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            groupIndex: 0,
                            index: 0,
                            text: '12:00 AM',
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 0,
                        }], [{
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            groupIndex: 0,
                            index: 1,
                            allDay: false,
                            text: '',
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 1,
                        }]],
                        groupIndex: 0,
                        isGroupedAllDayPanel: false
                    }],
                    cellCountInGroupRow: 1,
                    bottomVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: false,
                    topVirtualRowHeight: undefined,
                    leftVirtualCellWidth: undefined,
                    rightVirtualCellWidth: undefined,
                    bottomVirtualRowCount: 0,
                    topVirtualRowCount: 0,
                    leftVirtualCellCount: 0,
                    rightVirtualCellCount: 0,
                };
                const expectedViewDataMap = {
                    allDayPanelMap: [{
                        cellData: {
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            allDay: true,
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 0,
                        },
                        position: { cellIndex: 0, rowIndex: 0 }
                    }],
                    dateTableMap: [
                        [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 0),
                                endDate: new Date(2020, 6, 29, 0, 30),
                                allDay: false,
                                groupIndex: 0,
                                index: 0,
                                text: '12:00 AM',
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 0,
                            },
                            position: { cellIndex: 0, rowIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 30),
                                endDate: new Date(2020, 6, 29, 1, 0),
                                allDay: false,
                                groupIndex: 0,
                                index: 1,
                                text: '',
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 1,
                            },
                            position: { cellIndex: 0, rowIndex: 1 }
                        }]
                    ]
                };

                assert.deepEqual(viewData, expectedViewData, 'correct view data');
                assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct view data map');
            });

            test('should work with horizontal grouping', function(assert) {
                this.createInstance({
                    groupOrientation: 'horizontal',
                });
                this.instance.option('groups', [
                    {
                        name: 'res',
                        items: [
                            { id: 1, text: 'one' }, { id: 2, text: 'two' }
                        ]
                    }
                ]);

                this.instance.viewDataProvider.update();

                const { viewData, viewDataMap } = this.instance.viewDataProvider;

                const expectedViewData = {
                    cellCountInGroupRow: 1,
                    groupedData: [{
                        allDayPanel: [{
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 0,
                        },
                        {
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 1,
                        }],
                        dateTable: [[{
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 0,
                        }, {
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 1,
                        }], [{
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 1,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 2,
                        }, {
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 1,
                            isFirstGroupCell: true,
                            isLastGroupCell: true,
                            key: 3,
                        }]],
                        groupIndex: 0,
                        isGroupedAllDayPanel: false,
                    }],
                    bottomVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: false,
                    topVirtualRowHeight: undefined,
                    leftVirtualCellWidth: undefined,
                    rightVirtualCellWidth: undefined,
                    bottomVirtualRowCount: 0,
                    topVirtualRowCount: 0,
                    leftVirtualCellCount: 0,
                    rightVirtualCellCount: 0,
                };

                const expectedViewDataMap = {
                    allDayPanelMap: [
                        {
                            cellData: {
                                startDate: new Date(2020, 6, 29),
                                endDate: new Date(2020, 6, 29),
                                allDay: true,
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 0,
                            },
                            position: { cellIndex: 0, rowIndex: 0 }
                        }, {
                            cellData: {
                                startDate: new Date(2020, 6, 29),
                                endDate: new Date(2020, 6, 29),
                                allDay: true,
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 1,
                            },
                            position: { cellIndex: 1, rowIndex: 0 }
                        }
                    ],
                    dateTableMap: [
                        [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 0),
                                endDate: new Date(2020, 6, 29, 0, 30),
                                allDay: false,
                                text: '12:00 AM',
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 0,
                            },
                            position: { cellIndex: 0, rowIndex: 0 }
                        }, {
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 0),
                                endDate: new Date(2020, 6, 29, 0, 30),
                                allDay: false,
                                text: '12:00 AM',
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 1,
                            },
                            position: { cellIndex: 1, rowIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 30),
                                endDate: new Date(2020, 6, 29, 1, 0),
                                allDay: false,
                                text: '',
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 1,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 2,
                            },
                            position: { cellIndex: 0, rowIndex: 1 }
                        }, {
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 30),
                                endDate: new Date(2020, 6, 29, 1, 0),
                                allDay: false,
                                text: '',
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 1,
                                isFirstGroupCell: true,
                                isLastGroupCell: true,
                                key: 3,
                            },
                            position: { cellIndex: 1, rowIndex: 1 }
                        }]
                    ]
                };

                assert.deepEqual(viewData, expectedViewData, 'correct view data');
                assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct viewDataMap');
            });

            test('should work with grouping by date', function(assert) {
                this.createInstance({
                    groupOrientation: 'horizontal',
                    groupByDate: true,
                    intervalCount: 2,
                });
                this.instance.option('groups', [
                    {
                        name: 'res',
                        items: [
                            { id: 1, text: 'one' }, { id: 2, text: 'two' }
                        ]
                    }
                ]);

                this.instance.viewDataProvider.update();

                const { viewData } = this.instance.viewDataProvider;

                const expectedViewData = {
                    cellCountInGroupRow: 2,
                    groupedData: [{
                        allDayPanel: [{
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 0,
                        }, {
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 1,
                        }, {
                            allDay: true,
                            startDate: new Date(2020, 6, 30),
                            endDate: new Date(2020, 6, 30),
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 1,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 2,
                        }, {
                            allDay: true,
                            startDate: new Date(2020, 6, 30),
                            endDate: new Date(2020, 6, 30),
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 1,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 3,
                        }],
                        dateTable: [[{
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 0,
                        }, {
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 1,
                        }, {
                            startDate: new Date(2020, 6, 30, 0, 0),
                            endDate: new Date(2020, 6, 30, 0, 30),
                            allDay: false,
                            text: '',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 1,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 2,
                        }, {
                            startDate: new Date(2020, 6, 30, 0, 0),
                            endDate: new Date(2020, 6, 30, 0, 30),
                            allDay: false,
                            text: '',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 1,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 3,
                        }], [{
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 2,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 4,
                        }, {
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 2,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 5,
                        }, {
                            startDate: new Date(2020, 6, 30, 0, 30),
                            endDate: new Date(2020, 6, 30, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 3,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 6,
                        }, {
                            startDate: new Date(2020, 6, 30, 0, 30),
                            endDate: new Date(2020, 6, 30, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 3,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 7,
                        }]],
                        groupIndex: 0,
                        isGroupedAllDayPanel: false,
                    }],
                    bottomVirtualRowHeight: undefined,
                    isGroupedAllDayPanel: false,
                    topVirtualRowHeight: undefined,
                    leftVirtualCellWidth: undefined,
                    rightVirtualCellWidth: undefined,
                    bottomVirtualRowCount: 0,
                    topVirtualRowCount: 0,
                    leftVirtualCellCount: 0,
                    rightVirtualCellCount: 0,
                };

                assert.deepEqual(viewData, expectedViewData, 'correct view data');
            });

            test('should work with vertical grouping', function(assert) {
                this.createInstance();
                this.instance.option('groups', [
                    {
                        name: 'res',
                        items: [
                            { id: 1, text: 'one' }, { id: 2, text: 'two' }
                        ]
                    }
                ]);
                this.instance.option('groupOrientation', 'vertical');

                this.instance.viewDataProvider.update();

                const { viewData, viewDataMap } = this.instance.viewDataProvider;

                const expectedViewData = {
                    groupedData: [{
                        allDayPanel: [{
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: {
                                res: 1
                            },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 0,
                        }],
                        dateTable: [[{
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 0,
                        }], [{
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 1 },
                            groupIndex: 0,
                            index: 1,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 1,
                        }]]
                    }, {
                        allDayPanel: [{
                            allDay: true,
                            startDate: new Date(2020, 6, 29),
                            endDate: new Date(2020, 6, 29),
                            groups: {
                                res: 2
                            },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 2,
                        }],
                        dateTable: [[{
                            startDate: new Date(2020, 6, 29, 0, 0),
                            endDate: new Date(2020, 6, 29, 0, 30),
                            allDay: false,
                            text: '12:00 AM',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 0,
                            isFirstGroupCell: true,
                            isLastGroupCell: false,
                            key: 2,
                        }], [{
                            startDate: new Date(2020, 6, 29, 0, 30),
                            endDate: new Date(2020, 6, 29, 1, 0),
                            allDay: false,
                            text: '',
                            groups: { res: 2 },
                            groupIndex: 1,
                            index: 1,
                            isFirstGroupCell: false,
                            isLastGroupCell: true,
                            key: 3,
                        }]]
                    }],
                };

                const expectedViewDataMap = {
                    allDayPanelMap: [],
                    dateTableMap:
                    [
                        [{
                            cellData: {
                                allDay: true,
                                startDate: new Date(2020, 6, 29),
                                endDate: new Date(2020, 6, 29),
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: false,
                                key: 0,
                            },
                            position: { rowIndex: 0, cellIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 0),
                                endDate: new Date(2020, 6, 29, 0, 30),
                                allDay: false,
                                text: '12:00 AM',
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: false,
                                key: 0,
                            },
                            position: { rowIndex: 1, cellIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 30),
                                endDate: new Date(2020, 6, 29, 1, 0),
                                allDay: false,
                                text: '',
                                groups: { res: 1 },
                                groupIndex: 0,
                                index: 1,
                                isFirstGroupCell: false,
                                isLastGroupCell: true,
                                key: 1,
                            },
                            position: { rowIndex: 2, cellIndex: 0 }
                        }], [{
                            cellData: {
                                allDay: true,
                                startDate: new Date(2020, 6, 29),
                                endDate: new Date(2020, 6, 29),
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: false,
                                key: 2,
                            },
                            position: { rowIndex: 3, cellIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 0),
                                endDate: new Date(2020, 6, 29, 0, 30),
                                allDay: false,
                                text: '12:00 AM',
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 0,
                                isFirstGroupCell: true,
                                isLastGroupCell: false,
                                key: 2,
                            },
                            position: { rowIndex: 4, cellIndex: 0 }
                        }], [{
                            cellData: {
                                startDate: new Date(2020, 6, 29, 0, 30),
                                endDate: new Date(2020, 6, 29, 1, 0),
                                allDay: false,
                                text: '',
                                groups: { res: 2 },
                                groupIndex: 1,
                                index: 1,
                                isFirstGroupCell: false,
                                isLastGroupCell: true,
                                key: 3,
                            },
                            position: { rowIndex: 5, cellIndex: 0 }
                        }]
                    ]
                };

                assert.deepEqual(viewData.groupedData[0].allDayPanel, expectedViewData.groupedData[0].allDayPanel, 'correct allDayPanel');
                assert.deepEqual(viewData.groupedData[0].dateTable, expectedViewData.groupedData[0].dateTable, 'correct dateTable');
                assert.deepEqual(viewData.groupedData[1].allDayPanel, expectedViewData.groupedData[1].allDayPanel, 'correct allDayPanel');
                assert.deepEqual(viewData.groupedData[1].dateTable, expectedViewData.groupedData[1].dateTable, 'correct dateTable');
                assert.deepEqual(viewDataMap, expectedViewDataMap, 'correct viewDataMap');
            });
        });
    });

    test('should generate text correctly in week view', function(assert) {
        this.createInstance({
            showAllDayPanel: false,
        }, WORKSPACE_WEEK.class);

        this.instance.viewDataProvider.update();

        const { viewData } = this.instance.viewDataProvider;
        const { dateTable } = viewData.groupedData[0];

        assert.equal(dateTable[0][0].text, '12:00 AM', 'correct text');
        assert.equal(dateTable[1][0].text, '', 'correct text');
    });

    test('should generate correct data for month view', function(assert) {
        this.createInstance({
            startDayHour: 0,
            endDayHour: 0
        }, 'dxSchedulerWorkSpaceMonth');

        this.instance.viewDataProvider.update();

        const { viewData } = this.instance.viewDataProvider;
        const { dateTable } = viewData.groupedData[0];

        const firstExpectedCell = {
            allDay: undefined,
            startDate: new Date(2020, 5, 28, 0, 0),
            endDate: new Date(2020, 5, 28, 0, 0),
            firstDayOfMonth: false,
            groupIndex: 0,
            index: 0,
            isFirstGroupCell: true,
            isLastGroupCell: false,
            key: 0,
            otherMonth: true,
            text: '28',
            today: false,
        };
        const firstDayOfMonthCell = {
            allDay: undefined,
            startDate: new Date(2020, 6, 1, 0, 0),
            endDate: new Date(2020, 6, 1, 0, 0),
            firstDayOfMonth: false,
            groupIndex: 0,
            index: 3,
            isFirstGroupCell: false,
            isLastGroupCell: false,
            key: 3,
            otherMonth: false,
            text: '01',
            today: false,
        };
        const firstDayOfNextMonthCell = {
            allDay: undefined,
            startDate: new Date(2020, 7, 1, 0, 0),
            endDate: new Date(2020, 7, 1, 0, 0),
            firstDayOfMonth: false,
            groupIndex: 0,
            index: 34,
            isFirstGroupCell: false,
            isLastGroupCell: true,
            key: 34,
            otherMonth: true,
            text: '01',
            today: false,
        };

        assert.deepEqual(dateTable[0][0], firstExpectedCell, 'Correct first cell');
        assert.deepEqual(dateTable[0][3], firstDayOfMonthCell, 'Correct first cell of the month');
        assert.deepEqual(dateTable[4][6], firstDayOfNextMonthCell, 'Correct first cell of the next month');
    });

    test('should not generate all-day panel in month view', function(assert) {
        this.createInstance({
            showAllDayPanel: true,
            startDayHour: 0,
            endDayHour: 24,
        }, WORKSPACE_MONTH.class);

        this.instance.viewDataProvider.update(true);

        const { viewData } = this.instance.viewDataProvider;
        const { allDayPanel } = viewData.groupedData[0];

        assert.notOk(allDayPanel, 'All-day panel data was not generated');
    });

    module('getCellData', () => {
        supportedScrollingModes.forEach(scrollingMode => {
            test(`should return cell data in basic case if ${scrollingMode} scrolling mode`, function(assert) {
                this.createInstance({
                    showAllDayPanel: false,
                    scrolling: {
                        mode: scrollingMode
                    }
                });
                const $cell = this.instance.$element().find(`.${CELL_CLASS}`).eq(0);
                const result = this.instance.getCellData($cell);
                const expected = {
                    startDate: new Date(2020, 6, 29, 0, 0),
                    endDate: new Date(2020, 6, 29, 0, 30),
                    allDay: false,
                    groupIndex: 0,
                };

                assert.deepEqual(result, expected, 'correct cell data');
            });

            test(`should return cell data when all-day-panel is enabled if ${scrollingMode} scrolling mode`, function(assert) {
                this.createInstance({
                    showAllDayPanel: true,
                    scrolling: {
                        mode: scrollingMode
                    }
                });
                const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(0);
                const result = this.instance.getCellData($cell);
                const expected = {
                    startDate: new Date(2020, 6, 29, 0, 0),
                    endDate: new Date(2020, 6, 29, 0, 30),
                    allDay: false,
                    groupIndex: 0,
                };

                assert.deepEqual(result, expected, 'correct cell data');
            });

            test(`should return cell data when appointments are grouped horizontally if ${scrollingMode} scrolling mode`, function(assert) {
                this.createInstance({
                    groupOrientation: 'horizontal',
                    scrolling: {
                        mode: scrollingMode
                    },
                    width: 800
                });
                this.instance.option('groups', [
                    {
                        name: 'res',
                        items: [
                            { id: 1, text: 'one' }, { id: 2, text: 'two' }
                        ]
                    }
                ]);
                const $cell = this.instance.$element().find(`.${CELL_CLASS}`).eq(1);
                const result = this.instance.getCellData($cell);
                const expected = {
                    startDate: new Date(2020, 6, 29, 0, 0),
                    endDate: new Date(2020, 6, 29, 0, 30),
                    allDay: false,
                    groups: { res: 2 },
                    groupIndex: 1,
                };

                assert.deepEqual(result, expected, 'correct cell data');
            });

            test(`should return cell data when appointments are grouped vertically if ${scrollingMode} scrolling mode`, function(assert) {
                this.createInstance({
                    groupOrientation: 'vertical',
                    showAllDayPanel: false,
                    scrolling: {
                        mode: scrollingMode
                    }
                });
                this.instance.option('groups', [
                    {
                        name: 'res',
                        items: [
                            { id: 1, text: 'one' }, { id: 2, text: 'two' }
                        ]
                    }
                ]);
                const $cell = this.instance.$element().find('.' + CELL_CLASS).eq(1);
                const result = this.instance.getCellData($cell);
                const expected = {
                    startDate: new Date(2020, 6, 29, 0, 30),
                    endDate: new Date(2020, 6, 29, 1, 0),
                    allDay: false,
                    groups: { res: 1 },
                    groupIndex: 0,
                };

                assert.deepEqual(result, expected, 'correct cell data');
            });
        });
    });

    test('should call showAddAppointmentPopup with correct parameters', function(assert) {
        this.createInstance({
            groupOrientation: 'vertical',
            showAllDayPanel: false,
        });
        const $element = this.instance.$element();

        const keyboard = keyboardMock($element);
        const invokeSpy = sinon.spy(noop);
        this.instance.invoke = invokeSpy;

        $($element.find('.' + CELL_CLASS).eq(0)).trigger('focusin');
        $($element).trigger('focusin');
        keyboard.keyDown('enter');

        assert.equal(invokeSpy.getCall(0).args[0], 'showAddAppointmentPopup', 'Correct method of observer is called');
        assert.deepEqual(invokeSpy.getCall(0).args[1], {
            allDay: false,
            startDate: new Date(2020, 6, 29, 0, 0),
            endDate: new Date(2020, 6, 29, 0, 30),
        }, 'showAddAppointmentPopup has been called with correct parameters');
    });

    test('getDataByDroppableCell should work correctly', function(assert) {
        this.createInstance();

        this.instance.$element().find('.' + CELL_CLASS).eq(1).addClass('dx-scheduler-date-table-droppable-cell');

        const data = this.instance.getDataByDroppableCell();
        assert.deepEqual(data, {
            allDay: false,
            startDate: new Date(2020, 6, 29, 0, 30),
            endDate: new Date(2020, 6, 29, 1, 30),
            groups: undefined,
        }, 'Cell Data is correct');
    });

    module('Renovated Components Disposing', () => {
        test('Renovated Comonents should not be disposed on currentDate change', function(assert) {
            this.createInstance({
                currentDate: new Date(2020, 8, 1),
            });

            const disposeRenovatedComponentsStub = sinon.spy(noop);

            this.instance._disposeRenovatedComponents = disposeRenovatedComponentsStub;

            this.instance.option('currentDate', new Date(2020, 8, 2));

            assert.notOk(disposeRenovatedComponentsStub.called, 'Renovated components weren\'t disposed');
        });

        test('Renovated Comonents should be disposed on showAllDayPanel change when vertical grouping is used', function(assert) {
            this.createInstance({
                showAllDayPanel: false,
                groupOrientation: 'vertical',
            });
            this.instance.option('groups', [
                {
                    name: 'res',
                    items: [
                        { id: 1, text: 'one' }, { id: 2, text: 'two' }
                    ]
                }
            ]);

            const disposeRenovatedComponentsStub = sinon.spy(noop);

            this.instance._disposeRenovatedComponents = disposeRenovatedComponentsStub;

            this.instance.option('showAllDayPanel', true);

            assert.ok(disposeRenovatedComponentsStub.called, 'Renovated components weren\'t disposed');
        });

        test('Renovated Comonents should be disposed on groups change', function(assert) {
            this.createInstance({
                groupOrientation: 'vertical',
            });

            const disposeRenovatedComponentsStub = sinon.spy(noop);
            this.instance._disposeRenovatedComponents = disposeRenovatedComponentsStub;

            this.instance.option('groups', [
                {
                    name: 'res',
                    items: [
                        { id: 1, text: 'one' }, { id: 2, text: 'two' }
                    ]
                }
            ]);

            assert.ok(disposeRenovatedComponentsStub.called, 'Renovated components weren\'t disposed');
        });
    });

    test('Workspace should not have dx-scheduler-work-space-odd-cells class when scrolling mode is "virtual"', function(assert) {
        this.createInstance({
            scrolling: { mode: 'virtual' },
        });

        assert.notOk(this.instance.$element().hasClass('dx-scheduler-work-space-odd-cells'), 'Workspace does not have odd-cells class');
    });

    test('Cells should not differ in width when crossscrolling and virtual scrolling are enabled', function(assert) {
        this.createInstance({
            scrolling: { mode: 'virtual' },
            width: 800,
            startDayHour: 0,
            endDayHour: 1,
            crossScrollingEnabled: true,
            intervalCount: 2,
        });

        const $element = this.instance.$element();
        const cells = $element.find(`.${CELL_CLASS}`);
        const dateTableWidth = $element.find(`.${DATE_TABLE_CLASS}`).outerWidth();

        cells.each(function() {
            assert.equal($(this).outerWidth(), dateTableWidth / 2, 'Correct cell width');
        });
    });

    test('AllDayTable should be initialized', function(assert) {
        this.createInstance({
            showAllDayPanel: true,
        }, 'dxSchedulerWorkSpaceWeek');

        assert.ok(this.instance._$allDayTable, 'All-day panel has been initialized');
    });
});
