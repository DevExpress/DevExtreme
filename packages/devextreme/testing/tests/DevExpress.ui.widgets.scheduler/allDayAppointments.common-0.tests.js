import { getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import ArrayStore from 'common/data/array_store';
import { CustomStore } from 'common/data/custom_store';
import Query from 'common/data/query';
import dataUtils from 'core/element_data';
import {
    CLASSES,
    supportedScrollingModes,
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const { module, test, testStart } = QUnit;

testStart(() => initTestMarkup());

const createInstanceBase = options => createWrapper({ _draggingMode: 'default', ...options });

const config = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

module('All day appointments common', config, () => {
    supportedScrollingModes.forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, () => {

            const createInstance = options => {
                return createInstanceBase($.extend(true, options, {
                    scrolling: {
                        mode: scrollingMode
                    },
                    height: 600
                }));
            };

            test('AllDay tasks should not be filtered by start day hour', function(assert) {
                const tasks = [
                    {
                        text: 'One',
                        startDate: new Date(2015, 2, 16, 5),
                        endDate: new Date(2015, 2, 16, 5, 30),
                        allDay: true
                    },
                    {
                        text: 'Two',
                        startDate: new Date(2015, 2, 16, 2),
                        endDate: new Date(2015, 2, 16, 2, 30),
                        allDay: true
                    }
                ];

                const dataSource = new DataSource({
                    store: tasks
                });

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 6,
                    currentView: 'week'
                });

                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');

                assert.equal($appointments.length, 2, 'There are two appointments');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'The first appointment is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment is OK');
            });

            test('AllDay tasks should not be filtered by end day hour', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 5), allDay: true, endDate: new Date(2015, 2, 16, 5, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 10), allDay: true, endDate: new Date(2015, 2, 16, 10, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    endDayHour: 8,
                    currentView: 'week'
                });

                assert.deepEqual(dataSource.items(), [tasks[0], tasks[1]], 'Items are OK');
            });

            test('AllDay appointments should not be filtered by start & end day hour (day view)', function(assert) {
                const tasks = [
                    {
                        key: 1,
                        text: 'One',
                        startDate: new Date(2015, 2, 16),
                        endDate: new Date(2015, 2, 16, 2), allDay: true
                    }
                ];

                const dataSource = new DataSource({
                    store: new ArrayStore({
                        data: tasks,
                        key: 'key'
                    }),
                });

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 3,
                    endDayHour: 7,
                    views: ['month', 'day'],
                    currentView: 'month',
                    firstDayOfWeek: 1
                });

                scheduler.instance.option('currentView', 'day');
                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');

                assert.equal($appointments.length, 1, 'There are one appointment');
            });

            test('All-day appointment should be resized correctly', function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    views: ['week'],
                    currentView: 'week',
                    allDayExpr: 'AllDay',
                    width: 700,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9),
                        endDate: new Date(2015, 1, 10),
                        AllDay: true
                    }]
                });

                const cellWidth = scheduler.workSpace.getCellWidth();
                let pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.right)).start();

                pointer.dragStart().drag(cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 11), 'End date is OK');

                pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.right)).start();
                pointer.dragStart().drag(-cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 10), 'End date is OK');
            });

            test('All-day appointment endDate should not be affected by startDayHour & endDayHour after resize', function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    views: ['week'],
                    currentView: 'week',
                    startDayHour: 8,
                    endDayHour: 19,
                    allDayExpr: 'AllDay',
                    width: 700,
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 9),
                        endDate: new Date(2015, 1, 10),
                        AllDay: true
                    }]
                });

                const cellWidth = scheduler.workSpace.getCellWidth();
                let pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.right)).start();

                pointer.dragStart().drag(cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 11, 0), 'End date is OK');

                pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.right)).start();
                pointer.dragStart().drag(-cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 10, 0), 'End date is OK');
            });

            test('All-day appointment startDate should not be affected by startDayHour & endDayHour after resize', function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 1, 9),
                    editing: true,
                    views: ['week'],
                    currentView: 'week',
                    startDayHour: 8,
                    endDayHour: 19,
                    allDayExpr: 'AllDay',
                    dataSource: [{
                        text: 'a',
                        startDate: new Date(2015, 1, 10),
                        endDate: new Date(2015, 1, 11),
                        AllDay: true
                    }]
                });

                const cellWidth = scheduler.workSpace.getCellWidth();
                let pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.left)).start();

                pointer.dragStart().drag(-(cellWidth - 10), 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].startDate, new Date(2015, 1, 9, 0), 'Start date is OK');

                pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.left)).start();
                pointer.dragStart().drag(cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].startDate, new Date(2015, 1, 10, 0), 'Start date is OK');
            });

            test('Height of allDay appointment should be correct, 3 appts in cell', function(assert) {
                const data = new DataSource({
                    store: [
                        {
                            text: 'Task 1',
                            allDay: true,
                            startDate: new Date(2015, 1, 9, 1, 0),
                            endDate: new Date(2015, 1, 9, 2, 0)
                        },
                        {
                            text: 'Task 2',
                            allDay: true,
                            startDate: new Date(2015, 1, 9, 11, 0),
                            endDate: new Date(2015, 1, 9, 12, 0)
                        },
                        {
                            text: 'Task 3',
                            allDay: true,
                            startDate: new Date(2015, 1, 9, 1, 0),
                            endDate: new Date(2015, 1, 9, 2, 0)
                        }
                    ]
                });

                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: data,
                    currentView: 'week',
                    editing: true,
                    maxAppointmentsPerCell: 2
                });

                assert.roughEqual(scheduler.appointments.getAppointmentHeight(0), 25, 1.5, 'Appointment has correct height');
                assert.roughEqual(scheduler.appointments.getAppointmentHeight(1), 25, 1.5, 'Appointment has correct height');
                assert.roughEqual(scheduler.appointments.getAppointmentPosition(0).top, 25, 1.5, 'Appointment has correct top');

                assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Appointment collector is rendered');
            });


            test('Tail of long appointment should have a right width', function(assert) {
                const scheduler = createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 8, 12), endDate: new Date(2015, 8, 22, 10) }
                    ],
                    currentDate: new Date(2015, 8, 22),
                    views: ['week'],
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    height: 400
                });

                const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-appointment').eq(0);
                const $cell = $(scheduler.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-date-table-cell').eq(0);

                assert.roughEqual(getOuterWidth($appointment), getOuterWidth($cell) * 2, 1.001, 'Task has a right width');
            });

            test('AllDay appointment width should be decreased if it greater than work space width (grouped mode, day view)', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 10),
                    views: ['day'],
                    currentView: 'day',
                    dataSource: [{
                        startDate: new Date(2015, 4, 10),
                        endDate: new Date(2015, 4, 12),
                        ownerId: [1, 2],
                        allDay: true
                    }],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            label: 'o',
                            allowMultiple: true,
                            dataSource: [
                                {
                                    text: 'a',
                                    id: 1
                                },
                                {
                                    text: 'b',
                                    id: 2
                                }
                            ]
                        }
                    ],
                    width: 600
                });

                const $appointment1 = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
                const $appointment2 = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(1);
                const $cell = $(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell');

                assert.roughEqual(getOuterWidth($appointment1), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
                assert.roughEqual(getOuterWidth($appointment2), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
            });

            test('Long AllDay appointment should be separated (grouped mode, week view, groupByDate = true)', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 10),
                    views: ['week'],
                    currentView: 'week',
                    groupByDate: true,
                    dataSource: [{
                        startDate: new Date(2015, 4, 10),
                        endDate: new Date(2015, 4, 12),
                        ownerId: [2],
                        allDay: true
                    }],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            label: 'o',
                            allowMultiple: true,
                            dataSource: [
                                {
                                    text: 'a',
                                    id: 1
                                },
                                {
                                    text: 'b',
                                    id: 2
                                }
                            ]
                        }
                    ]
                });

                const $appointment1 = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
                const $appointment2 = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(1);
                const $cell = $(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell');

                assert.roughEqual(getOuterWidth($appointment1), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
                assert.roughEqual(getOuterWidth($appointment2), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
            });

            test('All-day appointment inside grouped view should have a right resizable area', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 6, 10),
                    views: ['week'],
                    currentView: 'week',
                    editing: true,
                    dataSource: [{
                        text: 'a',
                        allDay: true,
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: 1
                    }, {
                        text: 'b',
                        allDay: true,
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: 2
                    }, {
                        text: 'c',
                        startDate: new Date(2015, 6, 10, 2),
                        endDate: new Date(2015, 6, 10, 2, 30),
                        ownerId: 2
                    }
                    ],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    scrolling: {
                        orientation: 'vertical'
                    },
                    height: 600
                });

                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
                const area1 = $appointments.eq(0).dxResizable('instance').option('area');
                const area2 = $appointments.eq(1).dxResizable('instance').option('area');
                const area3 = $appointments.eq(2).dxResizable('instance').option('area');
                const $cells = $(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell');
                const halfOfCellWidth = 0.5 * getOuterWidth($cells.eq(0));

                assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

                assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area2.right, $cells.eq(13).offset().left + 3 * halfOfCellWidth - 1, 1.5);

                assert.deepEqual(area3.get(0), scheduler.instance.getWorkSpace().$element().find('.dx-scrollable-content').get(0), 'Area is OK');
            });

            test('All-day appointment inside grouped view should have a right resizable area: rtl mode', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 6, 10),
                    views: ['week'],
                    currentView: 'week',
                    editing: true,
                    rtlEnabled: true,
                    dataSource: [{
                        text: 'a',
                        allDay: true,
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30),
                        ownerId: 1
                    }],
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ],
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
                const area = $appointments.eq(0).dxResizable('instance').option('area');
                const $cells = $(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell');
                const halfOfCellWidth = 0.5 * getOuterWidth($cells.eq(0));

                assert.roughEqual(area.left, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);
                assert.roughEqual(area.right, $cells.eq(0).offset().left + 3 * halfOfCellWidth, 1.001);
            });

            test('Many grouped allDay dropDown appts should be grouped correctly (T489535)', function(assert) {
                const scheduler = createInstanceBase({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week',
                    groups: ['ownerId'],
                    resources: [
                        {
                            field: 'ownerId',
                            dataSource: [
                                { id: 1, text: 'one' },
                                { id: 2, text: 'two' }
                            ]
                        }
                    ]
                });

                scheduler.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
                    { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
                    { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1 },
                    { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
                    { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
                    { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
                    { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 },
                    { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2 }
                ]);

                scheduler.appointments.compact.click();
                assert.equal(scheduler.tooltip.getItemCount(), 3, 'There are 3 drop down appts in 1st group');

                scheduler.appointments.compact.click(1);
                assert.equal(scheduler.tooltip.getItemCount(), 3, 'There are 3 drop down appts in 2d group');
            });

            test('DropDown appointment should be removed correctly when needed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week'
                });

                const items = [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ];

                scheduler.instance.option('dataSource', items);

                let $dropDown = scheduler.instance.$element().find('.dx-scheduler-appointment-collector');
                assert.equal($dropDown.length, 1, 'Dropdown appointment was rendered');

                scheduler.instance.deleteAppointment(items[2]);

                $dropDown = scheduler.instance.$element().find('.dx-scheduler-appointment-collector');
                assert.equal($dropDown.length, 0, 'Dropdown appointment was removed');
            });

            test('If there are not groups, ".dx-scrollable-content" should be a resizable area for all-day appointment', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 6, 10),
                    views: ['week'],
                    currentView: 'week',
                    editing: true,
                    rtlEnabled: true,
                    dataSource: [{
                        text: 'a',
                        allDay: true,
                        startDate: new Date(2015, 6, 10, 0),
                        endDate: new Date(2015, 6, 10, 0, 30)
                    }],
                    scrolling: {
                        orientation: 'vertical'
                    }
                });

                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-appointment');
                const $area = $appointments.eq(0).dxResizable('instance').option('area');

                assert.deepEqual($area.get(0), scheduler.instance.getWorkSpace().$element().find('.dx-scrollable-content').get(0), 'Area is OK');
            });

            test('New allDay appointment should have correct height', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: data,
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited'
                });

                const newItem = { startDate: new Date(2015, 2, 10, 1), allDay: true, text: 'caption', endDate: new Date(2015, 2, 10, 1, 30) };

                scheduler.instance.showAppointmentPopup(newItem, true);
                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const $addedAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0);
                const $allDayCell = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0);

                assert.roughEqual(getOuterHeight($addedAppointment), $allDayCell.get(0).getBoundingClientRect().height, 0.501, 'Appointment has correct height');
            });

            test('showAllDayPanel option of workSpace should be updated after adding allDay appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });
                const newItem = { startDate: new Date(2015, 1, 9, 1), allDay: true, text: 'caption' };

                const scheduler = createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
                scheduler.instance.showAppointmentPopup(newItem);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const workspace = $(scheduler.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

                assert.equal(workspace.option('showAllDayPanel'), true, 'allDay panel is visible after adding allDay task');
            });

            test('all-day-collapsed class of workSpace should be removed after adding allDay appointment', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    dataSource: new DataSource({
                        store: this.tasks
                    }),
                    height: 600
                });

                const newItem = {
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30),
                    allDay: true,
                    text: 'caption'
                };

                const $workspace = $(scheduler.instance.$element()).find('.dx-scheduler-work-space');

                assert.ok($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work space has specific class');

                scheduler.instance.showAppointmentPopup(newItem, true);
                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                assert.notOk($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work space has not specific class');
            });

            test('AllDay appointment is visible on month view, if showAllDayPanel = false ', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: [{
                        startDate: new Date(2015, 2, 10, 1),
                        allDay: true,
                        text: 'caption',
                        endDate: new Date(2015, 2, 10, 1, 30)
                    }],
                    currentView: 'week',
                    views: ['day', 'week', 'month'],
                    showAllDayPanel: false,
                    maxAppointmentsPerCell: 1
                });

                assert.equal(scheduler.instance.$element().find('.dx-scheduler-all-day-appointment').length, 0, 'AllDay appointments are not visible on \'week\' view');

                scheduler.instance.option('currentView', 'month');

                assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'AllDay appointments are visible on \'month\' view');
            });

            test('AllDay appointment should have correct height', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok(true, 'This test is for the standard scrolling mode');
                    return;
                }

                const appointment = {
                    startDate: new Date(2015, 2, 10, 1),
                    endDate: new Date(2015, 2, 10, 1, 30),
                    allDay: true,
                    text: 'caption'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited',
                    height: 600
                });

                const appointmentHeight = getOuterHeight($(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointment'));
                const allDayPanelHeight = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                assert.roughEqual(appointmentHeight, allDayPanelHeight, 1, 'Appointment height is correct on init');

                scheduler.instance.option('currentDate', new Date(2015, 2, 17));
                scheduler.instance.option('currentDate', new Date(2015, 2, 10));

                assert.roughEqual(getOuterHeight(scheduler.instance.$element().find('.dx-scheduler-all-day-appointment')), appointmentHeight, 0.501, 'Appointment height is correct');
            });

            test('Multi-day appointment parts should be displayed correctly in allDay panel', function(assert) {
                const appointment = { startDate: new Date(2015, 3, 5, 0), endDate: new Date(2015, 3, 6, 7), text: 'caption' };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 3, 6),
                    dataSource: [appointment],
                    firstDayOfWeek: 1,
                    endDayHour: 10,
                    currentView: 'day',
                    showAllDayPanel: true
                });

                const $appointments = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

                assert.ok($appointments.length, 'Appointment is displayed correctly in right place');
            });

            test('AllDay appointment should have correct height after changing view', function(assert) {
                const appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 1, 30), allDay: true, text: 'caption' };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited'
                });

                const allDayPanelHeight = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                scheduler.instance.option('currentView', 'day');
                scheduler.instance.option('currentView', 'week');

                assert.roughEqual(getOuterHeight(scheduler.instance.$element().find('.dx-scheduler-all-day-appointment')), allDayPanelHeight, 1, 'Appointment height is correct');
            });

            test('allDay panel should be expanded when there are long appointments without allDay', function(assert) {
                const appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 3), text: 'caption' };
                const newAppointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 8, 3), text: 'caption' };

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true
                });

                scheduler.instance.updateAppointment(appointment, newAppointment);
                const $workspace = $(scheduler.instance.$element()).find('.dx-scheduler-work-space');

                assert.notOk($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'AllDay panel is expanded');
            });

            test('allDay panel should be expanded after adding allDay appointment via api', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: []
                });

                scheduler.instance.addAppointment({
                    text: 'a',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 1, 11, 0, 30)
                });

                const workspace = scheduler.instance.getWorkSpace();
                assert.notOk(workspace.option('allDayExpanded'), 'allDay panel is not expanded');

                scheduler.instance.addAppointment({
                    text: 'b',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 1, 11, 0, 30),
                    allDay: true
                });

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            test('allDay panel should be expanded after adding long appointment via api', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: []
                });

                const workspace = scheduler.instance.getWorkSpace();

                scheduler.instance.addAppointment({
                    text: 'b',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 4, 11, 0)
                });

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            test('all-day-appointment should have a correct height when the \'showAllDayPanel\' option was changed', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{ startDate: new Date(2015, 1, 9), allDay: true }]
                });

                const appointmentHeight = getOuterHeight($(scheduler.instance.$element()).find('.dx-scheduler-appointment').first());
                scheduler.instance.option('showAllDayPanel', false);
                scheduler.instance.option('showAllDayPanel', true);

                assert.roughEqual(getOuterHeight(scheduler.instance.$element().find('.dx-scheduler-appointment').first()), appointmentHeight, 0.501, 'appointment height is correct');
            });

            test('long appointment should not be rendered if "showAllDayPanel" = false', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 12) }]
                });

                scheduler.instance.option('showAllDayPanel', false);

                assert.notOk(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 'long appointment was not rendered');
            });

            test('AllDay panel should be displayed correctly on init with custom store', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 17)
                }];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 3, 16),
                    firstDayOfWeek: 1,
                    currentView: 'week',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function() {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve(data);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                const workspace = scheduler.instance.getWorkSpace();
                this.clock.tick(300);

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            test('AllDay panel should be displayed correctly after changing view with custom store', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 2, 5)
                }];

                const scheduler = createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'week',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve(Query([data[0]]).filter(options.filter).toArray());
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                this.clock.tick(300);
                scheduler.instance.option('currentView', 'day');
                this.clock.tick(300);

                const workspace = scheduler.instance.getWorkSpace();
                assert.notOk(workspace.option('allDayExpanded'), 'allDay panel is not expanded');
            });
        });
    });
});
