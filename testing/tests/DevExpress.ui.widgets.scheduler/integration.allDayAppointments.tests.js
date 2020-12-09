import $ from 'jquery';
import translator from 'animation/translator';
import dblclickEvent from 'events/dblclick';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'events/drag';
import { DataSource } from 'data/data_source/data_source';
import ArrayStore from 'data/array_store';
import CustomStore from 'data/custom_store';
import Query from 'data/query';
import dataUtils from 'core/element_data';
import { SchedulerTestWrapper, CLASSES } from '../../helpers/scheduler/helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

const APPOINTMENT_DEFAULT_LEFT_OFFSET = 26;

const createInstance = function(options) {
    const instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
    return new SchedulerTestWrapper(instance);
};

const triggerDragEnter = function($element, $appointment) {
    const appointmentOffset = $appointment.offset();

    $element.trigger($.Event(dragEvents.enter, {
        pageX: appointmentOffset.left,
        pageY: appointmentOffset.top
    }));
};

QUnit.module('Integration: allDay appointments', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };

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
}, function() {
    QUnit.module('Dragging', function() {
        QUnit.test('Task dragging into the allDay container', function(assert) {
            const data = new DataSource({
                store: this.tasks
            });

            this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });
            const $element = $(this.instance.$element());
            const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

            let pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
            pointer.up();
            this.clock.tick();

            const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

            assert.equal($allDayAppointment.length, 1, 'allDayContainer has 1 item');
            assert.ok(this.instance.option('dataSource').items()[0].allDay, 'New data is correct');

            pointer = pointerMock($allDayAppointment).start().down().move(10, 10);
            triggerDragEnter($(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5), $allDayAppointment);
            pointer.up();

            assert.ok(!this.instance.option('dataSource').items()[0].allDay, 'New data is correct');
            assert.deepEqual(this.instance.option('dataSource').items()[0].endDate, new Date(2015, 1, 9, 3), 'New data is correct');
            assert.equal($element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 0, 'allDayContainer is empty');
        });

        QUnit.test('Task dragging into the allDay container when allDay-cell is exactly top', function(assert) {
            const data = new DataSource({
                store: [{
                    text: 'Task 1',
                    startDate: new Date(2015, 2, 4, 0, 0),
                    endDate: new Date(2015, 2, 4, 0, 30)
                }]
            });

            this.createInstance({ currentDate: new Date(2015, 2, 4), dataSource: data, currentView: 'week', editing: true });
            const $element = $(this.instance.$element());
            const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

            let pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell').eq(3), $appointment);
            pointer.up();
            this.clock.tick();

            const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

            assert.equal($allDayAppointment.length, 1, 'allDayContainer has 1 item');
            assert.ok(this.instance.option('dataSource').items()[0].allDay, 'New data is correct');

            pointer = pointerMock($allDayAppointment).start().down().move(10, 10);
            triggerDragEnter($(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(3), $allDayAppointment);
            pointer.up();

            assert.ok(!this.instance.option('dataSource').items()[0].allDay, 'New data is correct');
            assert.deepEqual(this.instance.option('dataSource').items()[0].endDate, new Date(2015, 2, 4, 0, 30), 'New data is correct');
            assert.equal($element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 0, 'allDayContainer is empty');
        });

        QUnit.test('End date of appointment should be calculated if it\'s dragged off from the all day container', function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                editing: true,
                currentView: 'week',
                firstDayOfWeek: 0,
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 0),
                    endDate: new Date(2015, 1, 11, 0)
                }]
            });

            const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0), $appointment);
            pointer.up();

            this.clock.tick();
            const appointmentData = dataUtils.data($(this.instance.$element()).find('.dx-scheduler-appointment').get(0), 'dxItemData');

            assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 8, 0, 0), 'Start date is correct');
            assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 8, 0, 30), 'End date is correct');
        });

        QUnit.test('allDayExpanded option of workspace should be updated after dragged into the all day container', function(assert) {
            const data = new DataSource({
                store: this.tasks
            });

            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                dataSource: data,
                currentView: 'week',
                editing: true
            });

            const $element = $(this.instance.$element());
            const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

            const workspace = $(this.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance');

            assert.equal(workspace.option('allDayExpanded'), false);

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
            pointer.up();
            this.clock.tick();

            assert.equal(workspace.option('allDayExpanded'), true);
        });

        QUnit.test('Height of appointment should be correct after dragged into the all day container', function(assert) {
            const data = new DataSource({
                store: this.tasks
            });

            this.createInstance({
                currentDate: new Date(2015, 1, 9),
                dataSource: data,
                currentView: 'week',
                editing: true,
                maxAppointmentsPerCell: 'unlimited'
            });

            const $element = $(this.instance.$element());
            const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
            pointer.up();
            this.clock.tick();

            const $allDayCell = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0);
            const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointment').eq(0);

            assert.equal($allDayAppointment.outerHeight(), $allDayCell.outerHeight(), 'Appointment has correct height');
        });

        QUnit.test('allDayExpanded option of workspace should be updated after dragged off from the all day container', function(assert) {
            this.createInstance({
                showAllDayPanel: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                editing: true,
                firstDayOfWeek: 0,
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 0),
                    allDay: true
                }]
            });

            const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            triggerDragEnter($(this.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0), $appointment);
            pointer.up();

            this.clock.tick();
            const workspace = $(this.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance');

            assert.equal(workspace.option('allDayExpanded'), false);
        });


        QUnit.test('Appointment should have right position while dragging, after change allDay property', function(assert) {
            const appointment = {
                text: 'a',
                startDate: new Date(2015, 1, 9, 7),
                allDay: true
            };
            const newAppointment = {
                text: 'a',
                startDate: new Date(2015, 1, 9, 7),
                endDate: new Date(2015, 1, 9, 8),
                allDay: false
            };

            this.createInstance({
                height: 500,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                editing: true,
                dataSource: [appointment]
            });

            this.instance.updateAppointment(appointment, newAppointment);

            const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
            const scrollable = this.instance.getWorkSpace().$element().find('.dx-scrollable').dxScrollable('instance');
            const scrollDistance = 400;
            const dragDistance = -300;

            scrollable.scrollBy(scrollDistance);

            const pointer = pointerMock($appointment).start();
            const startPosition = $appointment.offset();

            pointer.down().move(0, dragDistance);

            const $draggedAppointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
            const currentPosition = $draggedAppointment.offset();

            assert.roughEqual(startPosition.top, currentPosition.top - dragDistance, 2.1, 'Appointment position is correct');
            pointer.up();
        });

        QUnit.test('AllDay appointment should have right position while dragging from allDay panel', function(assert) {
            const appointment = {
                text: 'a',
                startDate: new Date(2015, 1, 9, 7),
                endDate: new Date(2015, 1, 9, 7, 30),
                allDay: true
            };

            this.createInstance({
                height: 500,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                editing: true,
                dataSource: [appointment]
            });

            const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
            const dragDistance = 300;

            const pointer = pointerMock($appointment).start();
            const startPosition = $appointment.offset();

            pointer.down().move(0, dragDistance);

            const $draggedAppointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
            const currentPosition = $draggedAppointment.offset();

            assert.equal(startPosition.top, currentPosition.top - dragDistance, 'Appointment position is correct');
            pointer.up();
        });
    });

    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        QUnit.module(`Scrolling mode ${scrollingMode}`, {
            beforeEach: function() {
                const createInstance = this.createInstance.bind(this);
                this.createInstance = function(options) {
                    $.extend(true, options, {
                        scrolling: {
                            mode: scrollingMode
                        },
                        height: 600
                    });
                    createInstance(options);
                };
            }
        }, function() {
            QUnit.test('AllDay tasks should not be filtered by start day hour', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 5), endDate: new Date(2015, 2, 16, 5, 30), allDay: true },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 2), endDate: new Date(2015, 2, 16, 2, 30), allDay: true }];

                const dataSource = new DataSource({
                    store: tasks
                });

                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 6,
                    currentView: 'week'
                });

                const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

                assert.equal($appointments.length, 2, 'There are two appointments');
                assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData'), tasks[0], 'The first appointment is OK');
                assert.deepEqual(dataUtils.data($appointments.get(1), 'dxItemData'), tasks[1], 'The second appointment is OK');
            });

            QUnit.test('AllDay tasks should not be filtered by end day hour', function(assert) {
                const tasks = [
                    { text: 'One', startDate: new Date(2015, 2, 16, 5), allDay: true, endDate: new Date(2015, 2, 16, 5, 30) },
                    { text: 'Two', startDate: new Date(2015, 2, 16, 10), allDay: true, endDate: new Date(2015, 2, 16, 10, 30) }
                ];
                const dataSource = new DataSource({
                    store: tasks
                });
                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    endDayHour: 8,
                    currentView: 'week'
                });

                assert.deepEqual(dataSource.items(), [tasks[0], tasks[1]], 'Items are OK');
            });

            QUnit.test('AllDay appointments should not be filtered by start & end day hour (day view)', function(assert) {
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

                this.createInstance({
                    currentDate: new Date(2015, 2, 16),
                    dataSource: dataSource,
                    startDayHour: 3,
                    endDayHour: 7,
                    views: ['month', 'day'],
                    currentView: 'month',
                    firstDayOfWeek: 1
                });

                this.instance.option('currentView', 'day');
                const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

                assert.equal($appointments.length, 1, 'There are one appointment');
            });

            QUnit.test('All-day appointment should be resized correctly', function(assert) {
                const scheduler = createInstance({
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

            QUnit.test('All-day appointment endDate should be correct after resize when startDayHour & endDayHour', function(assert) {
                const scheduler = createInstance({
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
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 11), 'End date is OK');

                pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.right)).start();
                pointer.dragStart().drag(-cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].endDate, new Date(2015, 1, 10), 'End date is OK');
            });

            QUnit.test('All-day appointment startDate should be correct after resize when startDayHour & endDayHour', function(assert) {
                const scheduler = createInstance({
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
                assert.deepEqual(scheduler.instance.option('dataSource')[0].startDate, new Date(2015, 1, 9, 8), 'Start date is OK');

                pointer = pointerMock(scheduler.appointments.getAppointment(0).find(CLASSES.resizableHandle.left)).start();
                pointer.dragStart().drag(cellWidth, 0).dragEnd();
                assert.deepEqual(scheduler.instance.option('dataSource')[0].startDate, new Date(2015, 1, 10, 8), 'Start date is OK');
            });

            QUnit.test('Height of allDay appointment should be correct, 3 appts in cell', function(assert) {
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

                const scheduler = createInstance({
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


            QUnit.test('Tail of long appointment should have a right width', function(assert) {
                this.createInstance({
                    dataSource: [
                        { text: 'Task 1', startDate: new Date(2015, 8, 12), endDate: new Date(2015, 8, 22, 10) }
                    ],
                    currentDate: new Date(2015, 8, 22),
                    views: ['week'],
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    height: 400
                });

                const $appointment = $(this.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-appointment').eq(0);
                const $cell = $(this.instance.$element()).find('.dx-scheduler-work-space .dx-scheduler-date-table-cell').eq(0);

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 2, 1.001, 'Task has a right width');
            });

            QUnit.test('AllDay appointment width should be decreased if it greater than work space width (grouped mode, day view)', function(assert) {
                this.createInstance({
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
                    ]
                });

                const $appointment1 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
                const $appointment2 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);
                const $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

                assert.roughEqual($appointment1.outerWidth(), Math.floor($cell.outerWidth()), 1.001, 'Appointment width is OK');
                assert.roughEqual($appointment2.outerWidth(), Math.floor($cell.outerWidth()), 1.001, 'Appointment width is OK');
            });

            QUnit.test('Long AllDay appointment should be separated (grouped mode, week view, groupByDate = true)', function(assert) {
                this.createInstance({
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

                const $appointment1 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
                const $appointment2 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);
                const $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

                assert.roughEqual($appointment1.outerWidth(), Math.floor($cell.outerWidth()), 1.001, 'Appointment width is OK');
                assert.roughEqual($appointment2.outerWidth(), Math.floor($cell.outerWidth()), 1.001, 'Appointment width is OK');
            });

            QUnit.test('All-day appointment inside grouped view should have a right resizable area', function(assert) {
                this.createInstance({
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
                    height: 600
                });

                const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
                const area1 = $appointments.eq(0).dxResizable('instance').option('area');
                const area2 = $appointments.eq(1).dxResizable('instance').option('area');
                const area3 = $appointments.eq(2).dxResizable('instance').option('area');
                const $cells = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');
                const halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

                assert.roughEqual(area1.left, $cells.eq(0).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area1.right, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);

                assert.roughEqual(area2.left, $cells.eq(7).offset().left - halfOfCellWidth, 1.001);
                assert.roughEqual(area2.right, $cells.eq(13).offset().left + 3 * halfOfCellWidth - 1, 1.5);

                assert.deepEqual(area3.get(0), this.instance.getWorkSpace().$element().find('.dx-scrollable-content').get(0), 'Area is OK');
            });

            QUnit.test('All-day appointment inside grouped view should have a right resizable area: rtl mode', function(assert) {
                this.createInstance({
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
                    ]
                });

                const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
                const area = $appointments.eq(0).dxResizable('instance').option('area');
                const $cells = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');
                const halfOfCellWidth = 0.5 * $cells.eq(0).outerWidth();

                assert.roughEqual(area.left, $cells.eq(7).offset().left + halfOfCellWidth, 1.001);
                assert.roughEqual(area.right, $cells.eq(0).offset().left + 3 * halfOfCellWidth, 1.001);
            });

            QUnit.test('Many grouped allDay dropDown appts should be grouped correctly (T489535)', function(assert) {
                const scheduler = createInstance({
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

            QUnit.test('DropDown appointment should be removed correctly when needed', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week'
                });

                const items = [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ];

                this.instance.option('dataSource', items);

                let $dropDown = this.instance.$element().find('.dx-scheduler-appointment-collector');
                assert.equal($dropDown.length, 1, 'Dropdown appointment was rendered');

                this.instance.deleteAppointment(items[2]);

                $dropDown = this.instance.$element().find('.dx-scheduler-appointment-collector');
                assert.equal($dropDown.length, 0, 'Dropdown appointment was removed');
            });

            QUnit.test('If there are not groups, \'.dx-scrollable-content\' should be a resizable area for all-day appointment', function(assert) {
                this.createInstance({
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
                    }]
                });

                const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
                const $area = $appointments.eq(0).dxResizable('instance').option('area');

                assert.deepEqual($area.get(0), this.instance.getWorkSpace().$element().find('.dx-scrollable-content').get(0), 'Area is OK');
            });

            QUnit.test('New allDay appointment should have correct height', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });

                this.createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: data,
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited'
                });

                const newItem = { startDate: new Date(2015, 2, 10, 1), allDay: true, text: 'caption', endDate: new Date(2015, 2, 10, 1, 30) };

                this.instance.showAppointmentPopup(newItem, true);
                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const $addedAppointment = $(this.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0);
                const $allDayCell = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0);

                assert.roughEqual($addedAppointment.outerHeight(), $allDayCell.get(0).getBoundingClientRect().height, 0.501, 'Appointment has correct height');
            });

            QUnit.test('showAllDayPanel option of workSpace should be updated after adding allDay appointment', function(assert) {
                const data = new DataSource({
                    store: this.tasks
                });
                const newItem = { startDate: new Date(2015, 1, 9, 1), allDay: true, text: 'caption' };

                this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data });
                this.instance.showAppointmentPopup(newItem);

                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                const workspace = $(this.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceDay('instance');

                assert.equal(workspace.option('showAllDayPanel'), true, 'allDay panel is visible after adding allDay task');
            });

            QUnit.test('all-day-collapsed class of workSpace should be removed after adding allDay appointment', function(assert) {
                this.createInstance({
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

                const $workspace = $(this.instance.$element()).find('.dx-scheduler-work-space');

                assert.ok($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work space has specific class');

                this.instance.showAppointmentPopup(newItem, true);
                $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

                assert.notOk($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'Work space has not specific class');
            });

            QUnit.test('AllDay appointment is visible on month view, if showAllDayPanel = false ', function(assert) {
                this.createInstance({
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

                assert.equal(this.instance.$element().find('.dx-scheduler-all-day-appointment').length, 0, 'AllDay appointments are not visible on \'week\' view');

                this.instance.option('currentView', 'month');

                assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'AllDay appointments are visible on \'month\' view');
            });

            QUnit.test('AllDay appointment should have correct height', function(assert) {
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

                this.createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited',
                    height: 600
                });

                const appointmentHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-appointment').outerHeight();
                const allDayPanelHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                assert.roughEqual(appointmentHeight, allDayPanelHeight, 1, 'Appointment height is correct on init');

                this.instance.option('currentDate', new Date(2015, 2, 17));
                this.instance.option('currentDate', new Date(2015, 2, 10));

                assert.roughEqual(this.instance.$element().find('.dx-scheduler-all-day-appointment').outerHeight(), appointmentHeight, 0.501, 'Appointment height is correct');
            });

            QUnit.test('Multi-day appointment parts should be displayed correctly in allDay panel', function(assert) {
                const appointment = { startDate: new Date(2015, 3, 5, 0), endDate: new Date(2015, 3, 6, 7), text: 'caption' };

                this.createInstance({
                    currentDate: new Date(2015, 3, 6),
                    dataSource: [appointment],
                    firstDayOfWeek: 1,
                    endDayHour: 10,
                    currentView: 'day',
                    showAllDayPanel: true
                });

                const $appointments = $(this.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

                assert.ok($appointments.length, 'Appointment is displayed correctly in right place');
            });

            QUnit.test('AllDay appointment should have correct height after changing view', function(assert) {
                const appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 1, 30), allDay: true, text: 'caption' };

                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited'
                });

                const allDayPanelHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                this.instance.option('currentView', 'day');
                this.instance.option('currentView', 'week');

                assert.roughEqual(this.instance.$element().find('.dx-scheduler-all-day-appointment').outerHeight(), allDayPanelHeight, 1, 'Appointment height is correct');
            });

            QUnit.test('allDay panel should be expanded when there are long appointments without allDay', function(assert) {
                const appointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 5, 3), text: 'caption' };
                const newAppointment = { startDate: new Date(2015, 2, 5, 1), endDate: new Date(2015, 2, 8, 3), text: 'caption' };

                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    dataSource: [appointment],
                    currentView: 'week',
                    showAllDayPanel: true
                });

                this.instance.updateAppointment(appointment, newAppointment);
                const $workspace = $(this.instance.$element()).find('.dx-scheduler-work-space');

                assert.notOk($workspace.hasClass('dx-scheduler-work-space-all-day-collapsed'), 'AllDay panel is expanded');
            });

            QUnit.test('allDay panel should be expanded after adding allDay appointment via api', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: []
                });

                this.instance.addAppointment({
                    text: 'a',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 1, 11, 0, 30)
                });

                const workspace = this.instance.getWorkSpace();
                assert.notOk(workspace.option('allDayExpanded'), 'allDay panel is not expanded');

                this.instance.addAppointment({
                    text: 'b',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 1, 11, 0, 30),
                    allDay: true
                });

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            QUnit.test('allDay panel should be expanded after adding long appointment via api', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: []
                });

                const workspace = this.instance.getWorkSpace();

                this.instance.addAppointment({
                    text: 'b',
                    startDate: new Date(2015, 1, 11, 0),
                    endDate: new Date(2015, 4, 11, 0)
                });

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            QUnit.test('all-day-appointment should have a correct height when the \'showAllDayPanel\' option was changed', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{ startDate: new Date(2015, 1, 9), allDay: true }]
                });

                const appointmentHeight = $(this.instance.$element()).find('.dx-scheduler-appointment').first().outerHeight();
                this.instance.option('showAllDayPanel', false);
                this.instance.option('showAllDayPanel', true);

                assert.roughEqual(this.instance.$element().find('.dx-scheduler-appointment').first().outerHeight(), appointmentHeight, 0.501, 'appointment height is correct');
            });

            QUnit.test('long appointment should not be rendered if \'showAllDayPanel\' = false', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    firstDayOfWeek: 0,
                    dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 12) }]
                });

                this.instance.option('showAllDayPanel', false);

                assert.notOk(this.instance.$element().find('.dx-scheduler-appointment').length, 'long appointment was not rendered');
            });

            QUnit.test('AllDay panel should be displayed correctly on init with custom store', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 3, 16), endDate: new Date(2015, 3, 17)
                }];

                this.createInstance({
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

                const workspace = this.instance.getWorkSpace();
                this.clock.tick(300);

                assert.ok(workspace.option('allDayExpanded'), 'allDay panel is expanded');
            });

            QUnit.test('AllDay panel should be displayed correctly after changing view with custom store', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 2, 5)
                }];

                this.createInstance({
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
                this.instance.option('currentView', 'day');
                this.clock.tick(300);

                const workspace = this.instance.getWorkSpace();
                assert.notOk(workspace.option('allDayExpanded'), 'allDay panel is not expanded');
            });

            QUnit.test('AllDay appointment should be displayed correctly after changing view with custom store', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'day',
                    maxAppointmentsPerCell: 'unlimited',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a',
                                        allDay: true,
                                        startDate: new Date(2015, 2, 5),
                                        endDate: new Date(2015, 2, 5, 0, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                this.clock.tick(300);
                this.instance.option('currentView', 'week');
                this.clock.tick(300);

                const allDayPanelHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;
                const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);

                assert.roughEqual($appointment.outerHeight(), allDayPanelHeight, 0.501, 'Appointment height is correct');
            });

            QUnit.test('AllDay appointment should be displayed correctly after changing date with custom store', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for the standard scrolling mode');
                    return;
                }

                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'day',
                    maxAppointmentsPerCell: 'unlimited',
                    dataSource: new DataSource({
                        store: new CustomStore({
                            load: function(options) {
                                const d = $.Deferred();
                                setTimeout(function() {
                                    d.resolve([{
                                        text: 'a',
                                        allDay: true,
                                        startDate: new Date(2015, 2, 5),
                                        endDate: new Date(2015, 2, 5, 0, 30)
                                    }]);
                                }, 300);

                                return d.promise();
                            }
                        })
                    })
                });

                this.clock.tick(300);
                this.instance.option('currentDate', new Date(2015, 2, 5));
                this.clock.tick(300);

                const allDayPanelHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;
                const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);

                assert.roughEqual($appointment.outerHeight(), allDayPanelHeight, 2, 'Appointment height is correct');
            });

            QUnit.test('Multi-day appointment parts should have allDay class', function(assert) {
                const appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 10, 0), text: 'long appointment' };

                this.createInstance({
                    currentDate: new Date(2015, 1, 5),
                    dataSource: [appointment],
                    currentView: 'day'
                });

                const $appointment = $(this.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment part has allDay class');
            });

            QUnit.test('Multi-day appointment parts should have correct reduced class', function(assert) {
                const appointment = { startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 7, 0), text: 'long appointment' };

                this.createInstance({
                    currentDate: new Date(2015, 1, 5),
                    dataSource: [appointment],
                    currentView: 'day'
                });

                let $appointment = this.instance.$element().find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.ok($appointment.hasClass('dx-scheduler-appointment-head'), 'Appointment part has reduced class');

                this.instance.option('currentDate', new Date(2015, 1, 6));

                $appointment = this.instance.$element().find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);

                assert.notOk($appointment.hasClass('dx-scheduler-appointment-head'), 'Appointment part hasn\'t reduced class. It is tail');
            });

            QUnit.test('AllDay recurrent appointment should be rendered coorectly after changing currentDate', function(assert) {
                if(scrollingMode === 'virtual') {
                    assert.ok('This test is for the standard scrolling mode');
                    return;
                }

                const appointment = {
                    text: 'Appointment',
                    recurrenceRule: 'FREQ=DAILY',
                    allDay: true,
                    startDate: new Date(2015, 4, 25),
                    endDate: new Date(2015, 4, 25, 0, 30)
                };

                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    dataSource: [appointment],
                    currentView: 'week'
                });

                this.instance.option('currentDate', new Date(2015, 4, 31));

                const $appointment = $(this.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').eq(0);
                const cellHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').outerHeight();
                const cellWidth = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').outerWidth();

                assert.roughEqual($appointment.outerWidth(), 1.1, cellWidth, 'Appointment width is OK');
                assert.roughEqual($appointment.outerHeight(), 1.1, cellHeight, 'Appointment height is OK');
            });

            QUnit.test('DblClick on appointment should call scheduler.showAppointmentPopup for allDay appointment on month view', function(assert) {
                const data = [{
                    text: 'a', allDay: true, startDate: new Date(2015, 2, 5), endDate: new Date(2015, 2, 5, 0, 30)
                }];

                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'month',
                    dataSource: data,
                    maxAppointmentsPerCell: 1
                });

                this.clock.tick();

                const spy = sinon.spy(this.instance, 'showAppointmentPopup');

                $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0).trigger(dblclickEvent.name);

                assert.ok(spy.calledOnce, 'Method was called');
            });

            QUnit.test('AllDay appointment has right startDate and endDate', function(assert) {

                this.createInstance({
                    currentDate: new Date(2015, 2, 4),
                    currentView: 'week'
                });
                this.instance.showAppointmentPopup({ startDate: new Date(2015, 2, 5, 6), endDate: new Date(2015, 2, 6, 7), text: 'a', allDay: true });

                const $popupContent = $('.dx-scheduler-appointment-popup .dx-popup-content');
                const startDate = $popupContent.find('.dx-datebox').eq(0).dxDateBox('instance');
                const endDate = $popupContent.find('.dx-datebox').eq(1).dxDateBox('instance');

                assert.equal(startDate.option('type'), 'date', 'type is right');
                assert.equal(endDate.option('type'), 'date', 'type is right');
            });

            QUnit.test('All-day & common appointments should have a right sorting', function(assert) {
                const scheduler = createInstance({
                    currentDate: new Date(2016, 1, 10),
                    currentView: 'day',
                    width: 800,
                    maxAppointmentsPerCell: 3,
                    dataSource: [
                        {
                            text: 'A',
                            startDate: new Date(2016, 1, 10, 9, 0),
                            endDate: new Date(2016, 1, 10, 11, 30),
                            allDay: true
                        }, {
                            text: 'B',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'C',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },

                        {
                            text: 'D',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        }, {
                            text: 'E',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'F',
                            startDate: new Date(2016, 1, 10, 12, 0),
                            endDate: new Date(2016, 1, 10, 13, 0),
                            allDay: true
                        },
                        {
                            text: 'Simple appointment',
                            startDate: new Date(2016, 1, 10, 1),
                            endDate: new Date(2016, 1, 10, 2)
                        }
                    ]
                });

                const cellWidth = scheduler.workSpace.getCellWidth();

                assert.equal(scheduler.appointments.getTitleText(0), 'A', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(1), 'B', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(2), 'C', 'Text is right');
                assert.equal(scheduler.appointments.getTitleText(3), 'Simple appointment', 'Text is right');

                assert.roughEqual(scheduler.appointments.getAppointmentPosition(3).left, 100, 1.001, 'Appointment position is OK');
                assert.roughEqual(scheduler.appointments.getAppointmentPosition(3).top, 100, 1.001, 'Appointment position is OK');
                assert.roughEqual(scheduler.appointments.getAppointmentWidth(3), cellWidth - APPOINTMENT_DEFAULT_LEFT_OFFSET, 1.001, 'Appointment size is OK');
            });

            QUnit.test('dropDown appointment should have correct container & position', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week'
                });

                this.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ]);

                const $dropDown = $(this.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

                assert.equal($dropDown.parent().get(0), $(this.instance.$element()).find('.dx-scheduler-all-day-appointments').get(0), 'Container is OK');
                assert.roughEqual(translator.locate($dropDown).left, 228, 1.001, 'Appointment position is OK');
                assert.roughEqual(translator.locate($dropDown).top, 0, 1.001, 'Appointment position is OK');
            });

            QUnit.test('dropDown appointment should not have compact class on allDay panel', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week'
                });

                this.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true },
                    { text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true }
                ]);

                const $dropDown = $(this.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

                assert.notOk($dropDown.hasClass('dx-scheduler-appointment-collector-compact'), 'class is ok');
            });

            QUnit.test('AllDay appointments should have correct height, groupOrientation = vertical', function(assert) {
                const appointments = [
                    { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption1' },
                    { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption2' }];

                this.createInstance({
                    currentDate: new Date(2015, 2, 10),
                    dataSource: appointments,
                    groupOrientation: 'vertical',
                    currentView: 'day',
                    showAllDayPanel: true,
                    maxAppointmentsPerCell: 'unlimited',
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
                    height: 600
                });

                const allDayPanelHeight = $(this.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0).get(0).getBoundingClientRect().height;

                assert.roughEqual($(this.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0).outerHeight(), allDayPanelHeight, 0.501, 'First appointment height is correct on init');
                assert.roughEqual($(this.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(1).outerHeight(), allDayPanelHeight, 0.501, 'Second appointment height is correct on init');
            });

            QUnit.test('AllDay appointments should have correct position, groupOrientation = vertical', function(assert) {
                const appointments = [
                    { ownerId: 1, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption1' },
                    { ownerId: 2, startDate: new Date(2015, 2, 10, 1), endDate: new Date(2015, 2, 10, 1, 30), allDay: true, text: 'caption2' }];

                this.createInstance({
                    dataSource: appointments,
                    currentDate: new Date(2015, 2, 10),
                    groupOrientation: 'vertical',
                    currentView: 'day',
                    showAllDayPanel: true,
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

                const $element = $(this.instance.$element());
                const $appointments = $element.find('.dx-scheduler-appointment');
                const firstPosition = translator.locate($appointments.eq(0));
                const secondPosition = translator.locate($appointments.eq(1));
                const $allDayRows = $element.find('.dx-scheduler-all-day-table-row');
                const firstAllDayRowPosition = translator.locate($allDayRows.eq(0));
                const secondAllDayRowPosition = translator.locate($allDayRows.eq(1));

                assert.roughEqual(firstPosition.top, firstAllDayRowPosition.top, 1.5, 'Appointment has correct top');
                assert.roughEqual(secondPosition.top, secondAllDayRowPosition.top, 1.5, 'Appointment has correct top');
            });

            QUnit.test('allDayPanel cell with custom dataCellTemplate must open appointment popup when double-clicked (T737506)', function(assert) {
                this.createInstance({
                    currentDate: new Date(2015, 4, 25),
                    views: ['week'],
                    currentView: 'week',
                    firstDayOfWeek: 1,
                    startDayHour: 8,
                    endDayHour: 18,
                    height: 600,
                    dataCellTemplate: function(cellData, index, container) {
                        const wrapper = $('<div>').appendTo(container).addClass('dx-template-wrapper');
                        wrapper.append($('<div>').text(cellData.text).addClass('day-cell'));
                    }
                });

                this.instance.option('dataSource', [
                    { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 26), allDay: true },
                    { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 26), allDay: true },
                ]);

                const spy = sinon.spy(this.instance, 'showAppointmentPopup');

                const $allDayAppointment = $(this.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0);
                $allDayAppointment.trigger('dxdblclick');

                assert.ok(spy.calledOnce, 'Method was called');
            });

            QUnit.test('Appointment in allDayPanel must not change position if `editing` option is changed (T807933)', function(assert) {
                const scheduler = createInstance({
                    dataSource: [{
                        text: 'Website Re-Design Plan',
                        startDate: new Date(2017, 4, 22, 9, 30),
                        endDate: new Date(2017, 4, 23, 9, 30),
                        allDay: true,
                    }],
                    views: ['week'],
                    currentView: 'week',
                    currentDate: new Date(2017, 4, 22),
                    startDayHour: 9,
                    endDayHour: 19,
                    height: 600
                });

                let $appointment = scheduler.appointments.getAppointment();
                assert.ok($appointment, 'Appointment is rendered');

                scheduler.instance.option('editing.allowUpdating', false);

                $appointment = scheduler.appointments.getAppointment();

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has `addDayAppointment` class');
                assert.strictEqual($(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 1, 'Appointment is in `allDayAppointments` container');
                assert.strictEqual(translator.locate($appointment).top, 0, 'Appointment is on top of it`s container');
            });

            QUnit.test('New allDay appointment should be rendered correctly when groupByDate = true (T845632)', function(assert) {
                const appointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9, 1),
                    endDate: new Date(2020, 1, 9, 2),
                    ownerId: [2]
                };
                const newAppointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9),
                    endDate: new Date(2020, 1, 9),
                    allDay: true,
                    ownerId: [2]
                };

                const scheduler = createInstance({
                    currentDate: new Date(2020, 1, 9),
                    views: ['week'],
                    currentView: 'week',
                    groupByDate: true,
                    startDayHour: 1,
                    dataSource: [appointment],
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

                scheduler.instance.updateAppointment(appointment, newAppointment);

                const $appointment = scheduler.appointments.getAppointment();

                assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has `addDayAppointment` class');
                assert.strictEqual($(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 1, 'Appointment is in `allDayAppointments` container');
                assert.strictEqual(translator.locate($appointment).top, 0, 'Appointment is on top of it`s container');
            });

            QUnit.test('Recurrence allDay appointment should be rendered correctly (T831801)', function(assert) {
                const appointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9, 1),
                    endDate: new Date(2020, 1, 9, 2),
                    recurrenceRule: 'FREQ=DAILY'
                };
                const newAppointment = {
                    text: 'a',
                    startDate: new Date(2020, 1, 9),
                    endDate: new Date(2020, 1, 9, 1),
                    allDay: true,
                    recurrenceRule: 'FREQ=DAILY'
                };

                const scheduler = createInstance({
                    currentDate: new Date(2020, 1, 9),
                    views: ['week'],
                    currentView: 'week',
                    groupByDate: true,
                    startDayHour: 1,
                    dataSource: [appointment]
                });

                scheduler.instance.updateAppointment(appointment, newAppointment);

                const appointmentCount = scheduler.appointments.getAppointmentCount();

                assert.equal(appointmentCount, 7, 'All appointment parts were rendered');
            });
        });
    });
});
