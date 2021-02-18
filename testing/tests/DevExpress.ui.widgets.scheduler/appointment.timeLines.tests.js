import $ from 'jquery';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import Color from 'color';
import {
    SchedulerTestWrapper,
    initTestMarkup,
    CLASSES
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'common.css!';
import 'generic_light.css!';

const {
    module,
    test,
    skip
} = QUnit;

QUnit.testStart(() => initTestMarkup());

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const APPOINTMENT_DEFAULT_TOP_OFFSET = 26;

module('Integration: Appointments in Timeline views', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
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
}, () => {
    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, {
            beforeEach: function() {
                const createInstance = this.createInstance.bind(this);
                this.createInstance = options => {
                    options = options || {};
                    $.extend(
                        true,
                        options,
                        {
                            scrolling: {
                                mode: scrollingMode
                            }
                        }
                    );

                    createInstance(options);

                    if(scrollingMode === 'virtual') {
                        const virtualScrollingDispatcher = this.instance.getWorkSpace().virtualScrollingDispatcher;
                        if(virtualScrollingDispatcher) {
                            virtualScrollingDispatcher.renderer.getRenderTimeout = () => -1;
                        }
                    }
                };

                this.scrollTo = args => this.instance.getWorkSpace().getScrollable().scrollTo(args);
            }
        }, () => {
            test('Appointment should have right position on timelineMonth view', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 3, 8, 15),
                    endDate: new Date(2016, 1, 3, 9, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    currentView: 'timelineMonth',
                    firstDayOfWeek: 0,
                    dataSource: [appointment],
                    maxAppointmentsPerCell: 'unlimited'
                });

                const targetCellPosition = this.scheduler.workSpace.getCellPosition(0, 2);

                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition().top, targetCellPosition.top, 1.001, 'appointment top is correct');
                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition().left, targetCellPosition.left, 1.001, 'appointment left is correct');
            });

            test('Rival appointments should have right position on timelineMonth view', function(assert) {
                const data = [{
                    'id': '1',
                    'text': 'Recurrence event',
                    'recurrenceRule': 'FREQ=DAILY;INTERVAL=2;COUNT=2',
                    'startDate': new Date(2018, 11, 3, 9, 0),
                    'endDate': new Date(2018, 11, 1, 10, 30)
                },
                {
                    'id': '2',
                    'text': 'Some event',
                    'startDate': new Date(2018, 11, 4, 9, 0),
                    'endDate': new Date(2018, 11, 4, 10, 29),
                }];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    maxAppointmentsPerCell: 'unlimited',
                    currentDate: new Date(2018, 11, 3),
                    firstDayOfWeek: 0,
                    startDayHour: 8,
                    endDayHour: 20
                });

                this.instance.$element().find('.' + APPOINTMENT_CLASS).each(function(index, appointment) {
                    assert.equal($(appointment).position().top, 0, 'Appointment top is ok');
                });
            });

            test('Rival long appointments should have right position on timelineMonth view', function(assert) {
                const data = [{
                    'id': '1',
                    'text': 'Long event',
                    'startDate': new Date(2018, 11, 1, 9, 0),
                    'endDate': new Date(2018, 11, 5, 10, 30)
                },
                {
                    'id': '2',
                    'text': 'Some event',
                    'startDate': new Date(2018, 11, 4, 9, 0),
                    'endDate': new Date(2018, 11, 4, 10, 29),
                }];

                this.createInstance({
                    dataSource: data,
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    maxAppointmentsPerCell: 2,
                    currentDate: new Date(2018, 11, 3),
                    firstDayOfWeek: 0,
                    startDayHour: 8,
                    endDayHour: 20
                });

                assert.equal(this.scheduler.appointments.getAppointmentPosition(0).top, APPOINTMENT_DEFAULT_TOP_OFFSET, 'Long appointment top is ok');
                assert.roughEqual(this.scheduler.appointments.getAppointmentPosition(1).top, this.scheduler.appointments.getAppointmentHeight() + APPOINTMENT_DEFAULT_TOP_OFFSET, 1, 'Second appointment top is ok');
            });

            test('Long appointment part should not be rendered on timelineMonth view (T678380)', function(assert) {
                const appointment = {
                    'text': 'Ends april 1st at 7:59 am',
                    'startDate': new Date(2019, 2, 20, 9, 0),
                    'endDate': new Date(2019, 3, 1, 7, 59)
                };

                this.createInstance({
                    currentDate: new Date(2019, 3, 2),
                    currentView: 'timelineMonth',
                    views: ['timelineMonth'],
                    recurrenceRuleExpr: null,
                    startDayHour: 8,
                    firstDayOfWeek: 0,
                    endDayHour: 18,
                    cellDuration: 60,
                    dataSource: [appointment]
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, 'appointment-part was not rendered');
            });

            test('Long appointment part should not be rendered on timelineWorkWeek view (T678380)', function(assert) {
                const appointment = {
                    'text': 'Ends april 1st at 7:59 am',
                    'startDate': new Date(2019, 2, 20, 9, 0),
                    'endDate': new Date(2019, 3, 1, 7, 59)
                };

                this.createInstance({
                    currentDate: new Date(2019, 3, 2),
                    currentView: 'timelineWorkWeek',
                    views: ['timelineWorkWeek'],
                    recurrenceRuleExpr: null,
                    startDayHour: 8,
                    firstDayOfWeek: 0,
                    endDayHour: 18,
                    cellDuration: 60,
                    dataSource: [appointment]
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 0, 'appointment-part was not rendered');
            });

            test('Appointment should have right width on timelineWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 3, 9, 30),
                    endDate: new Date(2015, 2, 3, 10, 30)
                };

                this.createInstance({
                    currentDate: 1425416400000,
                    currentView: 'timelineWeek',
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 10
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth(), 1.001, 'Task has a right width');
            });

            test('Multiday appointment should have right width on timelineWeek view when set startDayHour > appointment endDate (T533348)', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 1, 11, 0),
                    endDate: new Date(2016, 1, 2, 1, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 20,
                    height: 200
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 9;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('Recurrence appointment part should have right width on timelineWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 4, 25, 21),
                    endDate: new Date(2015, 4, 26, 2),
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
                };

                this.createInstance({
                    currentDate: new Date(2015, 4, 26),
                    currentView: 'timelineWeek',
                    dataSource: [appointment],
                    startDayHour: 1,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 4, 1.001, 'Task has a right width');
            });

            test('Multiday appointment should have right width on timelineWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 19),
                    endDate: new Date(2015, 2, 3, 13)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 4;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('AllDay appointment should have right width on timelineWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 11, 14),
                    endDate: new Date(2015, 11, 17),
                    allDay: true
                };

                this.createInstance({
                    currentDate: new Date(2015, 11, 14),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 48;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('AllDay appointment without allDay field should have right width on timelineDay view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 11, 14, 0, 0),
                    endDate: new Date(2015, 11, 14, 24, 0)
                };

                this.createInstance({
                    currentDate: new Date(2015, 11, 14),
                    currentView: 'timelineDay',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 22
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 12;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('Long multiday appointment should have right width on timelineWorkWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 9),
                    endDate: new Date(2015, 2, 4, 18)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWorkWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 28;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('Long multiday appointment should have right width on timelineWeek view when set startDayHour > appointment endDate (T533348)', function(assert) {
                const appointment = {
                    startDate: new Date(2016, 1, 1, 11, 0),
                    endDate: new Date(2016, 1, 4, 1, 0)
                };

                this.createInstance({
                    currentDate: new Date(2016, 1, 1),
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    firstDayOfWeek: 1,
                    dataSource: [appointment],
                    startDayHour: 8,
                    endDayHour: 20,
                    height: 200
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsInAppointment = 33;

                assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * cellsInAppointment, 1.001, 'Task has a right width');
            });

            test('Long multiday appointment should have right position on timelineWeek view', function(assert) {
                const appointment = {
                    startDate: new Date(2015, 2, 2, 9),
                    endDate: new Date(2015, 2, 5, 18)
                };

                this.createInstance({
                    currentDate: new Date(2015, 2, 3),
                    currentView: 'timelineWeek',
                    cellDuration: 60,
                    dataSource: [appointment],
                    startDayHour: 10,
                    endDayHour: 20
                });

                const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
                const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0);
                const cellsToAppointment = 10;

                assert.roughEqual($appointment.position().left, $cell.outerWidth() * cellsToAppointment, 1.001, 'Task has a right width');
            });

            // Timezone-sensitive test, use US/Pacific for proper testing
            [{
                handle: CLASSES.resizableHandle.left,
                direction: -1,
                currentDate: new Date(2019, 10, 1),
                appointment: {
                    startDate: '2019-11-04T00:00',
                    endDate: '2019-11-06T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'November 3 12:00 AM - November 6 12:00 AM',
                scrollDate: new Date(2019, 10, 1),
                text: 'in case drag left handle to winter DST'
            }, {
                handle: CLASSES.resizableHandle.left,
                direction: -1,
                currentDate: new Date(2019, 2, 10),
                appointment: {
                    startDate: '2019-03-11T00:00',
                    endDate: '2019-03-13T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'March 10 12:00 AM - March 13 12:00 AM',
                scrollDate: new Date(2019, 2, 10),
                text: 'in case drag left handle to summer DST'
            }, {
                handle: CLASSES.resizableHandle.right,
                direction: 1,
                currentDate: new Date(2019, 10, 1),
                appointment: {
                    startDate: '2019-11-01T00:00',
                    endDate: '2019-11-03T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'November 1 12:00 AM - November 4 12:00 AM',
                scrollDate: new Date(2019, 10, 1),
                text: 'in case drag right handle to winter DST'
            }, {
                handle: CLASSES.resizableHandle.right,
                direction: 1,
                currentDate: new Date(2019, 2, 10),
                appointment: {
                    startDate: '2019-03-08T00:00',
                    endDate: '2019-03-10T00:00',
                },
                expectedValue: '12:00 AM - 12:00 AM',
                expectedTooltipValue: 'March 8 12:00 AM - March 11 12:00 AM',
                scrollDate: new Date(2019, 2, 7),
                text: 'in case drag right handle to summer DST'
            }].forEach(testCase => {
                test(`Appointment should have correct dates after resizing ${testCase.text} (T835544)`, function(assert) {
                    this.createInstance({
                        editing: {
                            allowResizing: true
                        },
                        dataSource: [{
                            text: 'Staff Productivity Report',
                            startDate: testCase.appointment.startDate,
                            endDate: testCase.appointment.endDate,
                        }],
                        views: ['timelineMonth'],
                        currentView: 'timelineMonth',
                        currentDate: new Date(testCase.currentDate),
                        height: 300,
                        startDayHour: 0,
                    });

                    this.scheduler.instance.scrollToTime(0, 0, new Date(testCase.scrollDate));

                    const { getAppointment, getDateText } = this.scheduler.appointments;

                    const cellWidth = this.scheduler.workSpace.getCellWidth();
                    let pointer = pointerMock($(getAppointment()).find(testCase.handle).eq(0)).start();

                    pointer.dragStart().drag(testCase.direction * cellWidth, 0);
                    pointer.dragEnd();

                    assert.equal(getDateText(), testCase.expectedValue, 'Dates should correct after resizing');

                    this.scheduler.appointments.click();
                    assert.equal(this.scheduler.tooltip.getDateText(), testCase.expectedTooltipValue, 'Dates in tooltip should correct');

                    pointer = pointerMock($(getAppointment()).find(testCase.handle).eq(0)).start();

                    pointer.dragStart().drag(-testCase.direction * cellWidth, 0);
                    pointer.dragEnd();

                    assert.equal(getDateText(), testCase.expectedValue, 'Dates should correct');
                });
            });

            test('Appointment should be rendered without compact ones if only one per cell (even with zoom) (T723354)', function(assert) {
                this.createInstance({
                    dataSource: [{
                        text: 'Recruiting students',
                        startDate: new Date(2018, 2, 26, 10, 0),
                        endDate: new Date(2018, 2, 26, 11, 0),
                        recurrenceRule: 'FREQ=DAILY'
                    }],
                    views: ['timelineMonth'],
                    currentView: 'timelineMonth',
                    currentDate: new Date(2018, 3, 27)
                });

                assert.equal(this.scheduler.appointments.getAppointmentCount(), 30, 'Scheduler appointments are rendered without compact ones');
            });

            skip('Appointments are rendered with custom cell width less than default (T816873)', function(assert) {
                const $style = $('<style>').text('#dxLineSchedule .dx-scheduler-date-table-cell, #dxLineSchedule .dx-scheduler-header-panel-cell {width: 100px !important;}');
                try {
                    $style.appendTo('head');

                    const data = [{
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T130000',
                        recurrenceException: '',
                        startDate: '2019-09-19T18:00:00.000Z',
                        endDate: '2019-09-19T18:04:00.000Z'
                    }, {
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T050000',
                        recurrenceException: '',
                        startDate: '2019-09-20T10:00:00.000Z',
                        endDate: '2019-09-20T04:59:59.000Z'
                    }, {
                        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T045900',
                        recurrenceException: '',
                        startDate: '2019-09-20T09:59:00.000Z',
                        endDate: '2019-09-20T10:00:00.000Z'
                    }];

                    this.createInstance({
                        dataSource: data,
                        elementAttr: {
                            id: 'dxLineSchedule'
                        },
                        views: [{
                            type: 'timelineWeek',
                            cellDuration: 120,
                            maxAppointmentsPerCell: 'unlimited'
                        }],
                        currentView: 'timelineWeek',
                        currentDate: new Date(2019, 8, 22)
                    });

                    assert.ok(this.scheduler.appointments.getAppointmentCount() > 0, 'Appointments are rendered');
                } finally {
                    $style.remove();
                }
            });

            [true, false].forEach((isRenovatedRender) => {
                test(`Multi-day appointment should be rendered when started after endDayHour (T819852) when renovateRender is ${isRenovatedRender}`, function(assert) {
                    const data = [{
                        text: 'Default appt',
                        startDate: new Date('2019-10-03T06:00:00.000'),
                        endDate: new Date('2019-10-03T18:00:00.000'),
                    }, {
                        text: 'Appt with end before endDayHour',
                        startDate: new Date('2019-10-02T17:00:00.000'),
                        endDate: new Date('2019-10-03T17:00:00.000'),
                    }, {
                        text: 'Appt with end before startDayHour',
                        startDate: new Date('2019-10-02T17:30:00.000'),
                        endDate: new Date('2019-10-02T18:30:00.000'),
                    }, {
                        text: 'Appt with end after endDayHour',
                        startDate: new Date('2019-10-02T18:55:00.000'),
                        endDate: new Date('2019-10-03T19:00:00.000'),
                    }];

                    this.createInstance({
                        dataSource: data,
                        views: ['timelineWeek'],
                        currentView: 'timelineWeek',
                        currentDate: new Date(2019, 9, 4),
                        cellDuration: 660,
                        startDayHour: 7,
                        endDayHour: 18,
                        height: 580,
                        renovateRender: scrollingMode === 'virtual' || isRenovatedRender,
                    });

                    assert.strictEqual(this.scheduler.appointments.getAppointmentCount(), 4, 'Appointments are rendered');
                    assert.strictEqual($(this.scheduler.appointments.getAppointment(0)).position().left, $(this.scheduler.appointments.getAppointment(3)).position().left, 'Appointments have same left coordinate');
                    assert.strictEqual($(this.scheduler.appointments.getAppointment(0)).innerWidth(), $(this.scheduler.appointments.getAppointment(3)).innerWidth(), 'Appointments with equal coords have same width');
                    assert.strictEqual($(this.scheduler.appointments.getAppointment(1)).innerWidth(), $(this.scheduler.appointments.getAppointment(3)).innerWidth(), 'Appointments with defferent coords have same width');
                });
            });
        });
    });
});
