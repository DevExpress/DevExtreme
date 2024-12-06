import { getOuterHeight, getOuterWidth, getWidth, getHeight } from 'core/utils/size';
import $ from 'jquery';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import translator from 'common/core/animation/translator';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import { DataSource } from 'common/data/data_source/data_source';
import dataUtils from 'core/element_data';
import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';
import 'ui/switch';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

const APPOINTMENT_DEFAULT_LEFT_OFFSET = 26;

QUnit.testStart(() => initTestMarkup());

const config = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('Integration: Appointments on vertical views (day, week, workWeek)', config, () => {
    QUnit.test('Appointments on Day view should have a right height and position if startDate begins day before', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2016, 9, 5, 23, 30),
                endDate: new Date(2016, 9, 6, 1),
                text: 'new Date sample'
            }],
            currentDate: new Date(2016, 9, 6),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        });
        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS);
        const cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

        assert.equal($appointment.position().top, 0, 'Appointment has a right top position');
        assert.equal(getOuterHeight($appointment), cellHeight, 'Appointment has a right height');
    });

    QUnit.test('Appointments on Week view should have a right position if widget is small', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2016, 9, 6, 1),
                endDate: new Date(2016, 9, 6, 3),
                text: 'new Date sample'
            }],
            currentDate: new Date(2016, 9, 6),
            views: ['week'],
            width: 350,
            currentView: 'week',
            cellDuration: 60
        });
        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS);
        const cellWidth = getOuterWidth($element.find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointment.position().left, cellWidth * 4, 2, 'Appointment has a right left position');
    });

    QUnit.test('Appointment with resources should have a right height and position if it ends on the next day', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2017, 6, 22, 20),
                endDate: new Date(2017, 6, 23, 4),
                text: 'Appointment',
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
            currentDate: new Date(2017, 6, 22),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        });

        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS);
        const cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

        assert.equal($appointment.length, 1, 'Only one appt is rendered');
        assert.equal($appointment.position().top, cellHeight * 20, 'Appointment has a right top position');
        assert.equal(getOuterHeight($appointment), cellHeight * 4, 'Appointment has a right height');
    });

    QUnit.test('Breaking an appointment into parts depends on the timezone', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: '2017-05-24T20:15:00+01:00',
                endDate: '2017-05-25T01:30:00+01:00',
                text: 'Test task'
            }],
            timeZone: 'America/Los_Angeles',
            currentDate: new Date(2017, 4, 25),
            views: ['week'],
            currentView: 'week',
            cellDuration: 60
        });

        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment has 1 part');
    });

    QUnit.test('Breaking an appointment into parts should work correctly when endDate is a midnight', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: '2017-05-24T20:15:00+01:00',
                endDate: '2017-05-25T08:00:00+01:00',
                text: 'Test task'
            }],
            timeZone: 'America/Los_Angeles',
            currentDate: new Date(2017, 4, 25),
            views: ['week'],
            currentView: 'week',
            cellDuration: 60
        });

        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment has 1 part');
    });

    QUnit.test('The part of the appointment that ends after midnight should be shown on Week view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 25, 22, 0),
                endDate: new Date(2015, 4, 26, 2, 15),
                text: 'Test task'
            }],
            currentDate: new Date(2015, 4, 25),
            views: ['week'],
            currentView: 'week',
            cellDuration: 60
        });

        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS);

        assert.equal($appointment.length, 2, 'ok');
        assert.equal($appointment.eq(1).position().top, 0, 'Appointment has a right top position');
    });

    QUnit.test('The part of the appointment that ends after midnight should have right height when set startDayHour & endDayHour', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 25, 21),
                endDate: new Date(2015, 4, 26, 2),
                text: 'Test task'
            }],
            currentDate: new Date(2015, 4, 25),
            views: ['week'],
            currentView: 'week',
            startDayHour: 1,
            endDayHour: 23,
            cellDuration: 60
        });

        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(1);
        const cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;

        assert.equal(getOuterHeight($appointment), cellHeight, 'appt part has right height');
    });

    QUnit.test('The parts of recurrence appointment before and after midnight should be shown on Week view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 27, 23, 0),
                endDate: new Date(2015, 4, 28, 1, 15),
                text: 'Test task',
                recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
            }],
            currentDate: new Date(2015, 4, 27),
            views: ['week'],
            currentView: 'week',
            cellDuration: 60
        });

        const cellHeight = scheduler.workSpace.getCellHeight();

        assert.equal(scheduler.appointments.getAppointmentCount(), 4, 'Appt parts are shown');
        assert.equal(scheduler.appointments.getAppointmentPosition(2).top, cellHeight * 23, 'Second appointment part before midnight has a correct top position');
        assert.equal(scheduler.appointments.getAppointmentPosition(3).top, 0, 'Second appointment part after midnight has a right top position');
    });

    QUnit.test('The part of recurrence appointment before midnight should be shown on Day view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 25, 23, 0),
                endDate: new Date(2015, 4, 26, 1, 15),
                text: 'Test task',
                recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
            }],
            currentDate: new Date(2015, 4, 27),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        });

        const cellHeight = scheduler.workSpace.getCellHeight();

        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appt part is shown');
        assert.equal(scheduler.appointments.getAppointmentPosition().top, cellHeight * 23, 'Appointment has a correct top position');
    });

    QUnit.test('The part of recurrence appointment after midnight should be shown on Day view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 25, 23, 0),
                endDate: new Date(2015, 4, 26, 1, 15),
                text: 'Test task',
                recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
            }],
            currentDate: new Date(2015, 4, 26),
            views: ['day'],
            currentView: 'day',
            cellDuration: 60
        });

        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appt part is shown on 2d day');
        assert.equal(scheduler.appointments.getAppointmentPosition().top, 0, 'Appointment has a correct top position');

        scheduler.instance.option('currentDate', new Date(2015, 4, 28));

        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appt part is shown on 2d day');
        assert.equal(scheduler.appointments.getAppointmentPosition().top, 0, 'Appointment has a correct top position');
    });

    QUnit.test('The part of recurrence appointment after midnight should have right height on the first day of week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 25, 22, 0),
                endDate: new Date(2015, 4, 26, 3, 30),
                text: 'Test task',
                recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
            }],
            currentDate: new Date(2015, 5, 1),
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 1,
            startDayHour: 2,
            endDayHour: 23,
            cellDuration: 30
        });

        const $element = scheduler.instance.$element();
        const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);
        const cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;

        assert.equal(getOuterHeight($appointment), cellHeight * 3, 'appt part has right height');
    });

    QUnit.test('Recurring appointments should be rendered correctly with a custom timezone(T385377)', function(assert) {
        const tzOffsetStub = sinon.stub(timeZoneUtils, 'getClientTimezoneOffset').returns(-10800000);

        try {
            const scheduler = createWrapper({
                dataSource: [],
                currentDate: new Date(2016, 4, 7),
                timeZone: 'Asia/Ashkhabad',
                height: 500,
                currentView: 'week',
                firstDayOfWeek: 1
            });

            scheduler.instance.addAppointment({
                startDate: new Date(2016, 4, 2),
                endDate: new Date(2016, 4, 2, 0, 30),
                recurrenceRule: 'FREQ=DAILY'
            });

            const $appt = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);
            const apptPosition = $appt.position();

            assert.roughEqual(apptPosition.top, 200, 2.001, 'Appts top is OK');
            assert.roughEqual(apptPosition.left, 0, 2.001, 'Appts left is OK');

        } finally {
            tzOffsetStub.restore();
        }
    });

    QUnit.test('Appointments should have correctly height with a custom timezone(T387561)', function(assert) {
        const tzOffsetStub = sinon.stub(timeZoneUtils, 'getClientTimezoneOffset').returns(-10800000);

        try {
            const scheduler = createWrapper({
                dataSource: [{
                    text: 'Stand-up meeting',
                    startDate: '2015-05-25T17:00:00.000Z',
                    endDate: '2015-05-25T17:15:00.000Z',
                    startDateTimeZone: 'Europe/Belgrade',
                    endDateTimeZone: 'Europe/Belgrade'
                }, {
                    text: 'Approve New Online Marketing Strategy',
                    startDate: '2015-05-25T17:00:00.000Z',
                    endDate: '2015-05-25T19:00:00.000Z'
                }],
                currentDate: new Date(2015, 4, 25),
                timeZone: 'America/Los_Angeles',
                height: 500,
                currentView: 'week',
                firstDayOfWeek: 0
            });

            const $element = scheduler.instance.$element();
            const $appts = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
            const cellHeight = getOuterHeight($element.find('.' + DATE_TABLE_CELL_CLASS).eq(0));

            assert.roughEqual(getOuterHeight($appts.eq(0)), cellHeight / 2, 2.001, 'Appts top is OK');
            assert.roughEqual(getOuterHeight($appts.eq(1)), cellHeight * 4, 2.001, 'Appts top is OK');

        } finally {
            tzOffsetStub.restore();
        }
    });

    QUnit.test('Two vertical neighbor appointments should be placed correctly', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 24),
            views: ['week'],
            currentView: 'week',
            width: 800
        });

        scheduler.instance.addAppointment({
            text: 'b',
            startDate: new Date(2015, 1, 23, 1),
            endDate: new Date(2015, 1, 23, 1, 30)
        });

        scheduler.instance.addAppointment({
            text: 'a',
            startDate: new Date(2015, 1, 23, 0, 30),
            endDate: new Date(2015, 1, 23, 1)
        });

        scheduler.instance.addAppointment({
            text: 'c',
            startDate: new Date(2015, 1, 23, 0, 30),
            endDate: new Date(2015, 1, 23, 1),
            allDay: true
        });

        const $commonAppointments = scheduler.instance.$element().find('.dx-scheduler-scrollable-appointments .dx-scheduler-appointment');
        const $allDayAppts = scheduler.instance.$element().find('.dx-scheduler-all-day-appointment');
        const cellWidth = getOuterWidth(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));

        assert.roughEqual(translator.locate($commonAppointments.eq(0)).left, 0, 2.001, 'Left position is OK');
        assert.roughEqual(translator.locate($commonAppointments.eq(1)).left, 0, 2.001, 'Left position is OK');
        assert.roughEqual(translator.locate($allDayAppts.eq(0)).left, 0, 2.001, 'Left position is OK');

        assert.roughEqual(getOuterWidth($commonAppointments.eq(0)), cellWidth - APPOINTMENT_DEFAULT_LEFT_OFFSET, 1.001, 'Width is OK');
        assert.roughEqual(getOuterWidth($commonAppointments.eq(1)), cellWidth - APPOINTMENT_DEFAULT_LEFT_OFFSET, 1.001, 'Width is OK');
        assert.roughEqual(getOuterWidth($allDayAppts.eq(0)), cellWidth, 1.001, 'Width is OK');
    });

    QUnit.test('Appointment size should depend on neighbor appointments', function(assert) {
        const items = [{ text: 'a', startDate: new Date(2015, 2, 4, 1), endDate: new Date(2015, 2, 4, 2) },
            { text: 'b', startDate: new Date(2015, 2, 4, 2, 30), endDate: new Date(2015, 2, 4, 3) },
            { text: 'c', startDate: new Date(2015, 2, 4, 2, 30), endDate: new Date(2015, 2, 4, 3) },
            { text: 'd', startDate: new Date(2015, 2, 4, 1, 30), endDate: new Date(2015, 2, 4, 3) }];

        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2015, 2, 4),
            dataSource: items,
            maxAppointmentsPerCell: 'unlimited'
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
        assert.roughEqual(getWidth($appointments.eq(0)), getWidth($appointments.eq(3)), 0.1);
    });

    QUnit.test('Recurrence appointment should be rendered correctly when currentDate was changed: all-day', function(assert) {
        const appointment = {
            startDate: new Date(2015, 1, 4, 0),
            endDate: new Date(2015, 1, 4, 0, 30),
            text: 'long appointment',
            recurrenceRule: 'FREQ=DAILY',
            allDay: true
        };

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 4),
            dataSource: [appointment],
            views: ['day'],
            currentView: 'day'
        });

        scheduler.instance.option('currentDate', new Date(2015, 1, 5));

        const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

        assert.equal($appointment.length, 1, 'Appointment is rendered');
    });

    QUnit.test('Recurrence appointment should be rendered correctly when currentDate was changed: day', function(assert) {
        const appointment = {
            startDate: new Date(2015, 1, 4, 0),
            endDate: new Date(2015, 1, 4, 1),
            text: 'long appointment',
            recurrenceRule: 'FREQ=DAILY'
        };

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 4),
            dataSource: [appointment],
            views: ['day'],
            currentView: 'day'
        });

        scheduler.instance.option('currentDate', new Date(2015, 1, 5));

        const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

        assert.roughEqual(getHeight($appointment), 100, 1.001, 'Appointment is rendered correctly');
    });

    QUnit.test('Appointments should have correct position, rtl mode, editing=false', function(assert) {
        const appointment = {
            startDate: new Date(2015, 1, 4, 0),
            endDate: new Date(2015, 1, 4, 1)
        };

        const scheduler = createWrapper({
            rtlEnabled: true,
            editing: false,
            currentDate: new Date(2015, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: [appointment]
        });

        const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

        assert.roughEqual($appointment.position().left, APPOINTMENT_DEFAULT_LEFT_OFFSET, 2, 'Appointment left is correct on init');
    });

    QUnit.test('dropDown appointment should not compact class on vertical view', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 4, 25),
            views: [{ type: 'week', name: 'week' }],
            currentView: 'week'
        });

        scheduler.instance.option('dataSource', [
            { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) },
            { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) },
            { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) }
        ]);

        const $dropDown = $(scheduler.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

        assert.ok($dropDown.hasClass('dx-scheduler-appointment-collector-compact'), 'class is ok');
    });

    QUnit.test('Appointments should be rendered correctly, Day view with intervalCount', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2015, 2, 16, 7), endDate: new Date(2015, 2, 16, 7, 30) },
            { text: 'Two', startDate: new Date(2015, 2, 16, 11), endDate: new Date(2015, 2, 16, 11, 30) },
            { text: 'Three', startDate: new Date(2015, 2, 18, 12), endDate: new Date(2015, 2, 18, 12, 30) },
            { text: 'Four', startDate: new Date(2015, 2, 18, 15), endDate: new Date(2015, 2, 18, 15, 30) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2015, 2, 16),
            dataSource: dataSource,
            views: [{
                type: 'day',
                name: 'Day',
                intervalCount: 3
            }],
            currentView: 'day'
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointments should be rendered correctly, Week view with intervalCount', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2015, 4, 25, 7), endDate: new Date(2015, 4, 25, 7, 30) },
            { text: 'Two', startDate: new Date(2015, 5, 1, 11), endDate: new Date(2015, 5, 1, 11, 30) },
            { text: 'Three', startDate: new Date(2015, 5, 6, 12), endDate: new Date(2015, 5, 6, 12, 30) },
            { text: 'Four', startDate: new Date(2015, 5, 12, 15), endDate: new Date(2015, 5, 12, 15, 30) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2015, 4, 25),
            dataSource: dataSource,
            views: [{
                type: 'week',
                name: 'week',
                intervalCount: 3
            }],
            currentView: 'week'
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointments should be rendered correctly, Day view with intervalCount and startDate', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2017, 5, 25, 4), endDate: new Date(2017, 5, 25, 4, 30) },
            { text: 'Two', startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
            { text: 'Three', startDate: new Date(2017, 5, 27, 10), endDate: new Date(2017, 5, 27, 11) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2017, 5, 26),
            dataSource: dataSource,
            views: [{
                type: 'day',
                name: 'day',
                intervalCount: 3,
                startDate: new Date(2017, 5, 25)
            }],
            currentView: 'day'
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointments should be rendered correctly, Week view with intervalCount and startDate', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2017, 5, 22, 4), endDate: new Date(2017, 5, 22, 4, 30) },
            { text: 'Two', startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
            { text: 'Three', startDate: new Date(2017, 6, 2, 10), endDate: new Date(2017, 6, 2, 11) },
            { text: 'Four', startDate: new Date(2017, 6, 9, 8), endDate: new Date(2017, 6, 9, 8, 30) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2017, 5, 26),
            dataSource: dataSource,
            views: [{
                type: 'week',
                name: 'week',
                intervalCount: 3,
                startDate: new Date(2017, 5, 19)
            }],
            currentView: 'week',
            firstDayOfWeek: 1
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointments should be rendered correctly after switching Day view with intervalCount and startDate', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2017, 5, 28, 4), endDate: new Date(2017, 5, 28, 4, 30) },
            { text: 'Two', startDate: new Date(2017, 5, 29, 0), endDate: new Date(2017, 5, 29, 0, 30) },
            { text: 'Three', startDate: new Date(2017, 5, 30, 10), endDate: new Date(2017, 5, 30, 11) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2017, 5, 26),
            dataSource: dataSource,
            views: [{
                type: 'day',
                name: 'day',
                intervalCount: 3,
                startDate: new Date(2017, 5, 25)
            }],
            currentView: 'day'
        });

        $(scheduler.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointments should be rendered correctly after switching Week view with intervalCount and startDate', function(assert) {
        const tasks = [
            { text: 'One', startDate: new Date(2017, 6, 10, 4), endDate: new Date(2017, 6, 10, 4, 30) },
            { text: 'Two', startDate: new Date(2017, 6, 18, 0), endDate: new Date(2017, 6, 18, 0, 30) },
            { text: 'Three', startDate: new Date(2017, 6, 25, 10), endDate: new Date(2017, 6, 25, 11) }
        ];
        const dataSource = new DataSource({
            store: tasks
        });
        const scheduler = createWrapper({
            currentDate: new Date(2017, 5, 26),
            dataSource: dataSource,
            views: [{
                type: 'week',
                name: 'week',
                intervalCount: 3,
                startDate: new Date(2017, 5, 19)
            }],
            currentView: 'week',
            firstDayOfWeek: 1
        });

        $(scheduler.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
    });

    QUnit.test('Appointment should have right width on mobile devices & desktop in week view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 13, 1),
                endDate: new Date(2018, 2, 13, 3)
            }],
            currentDate: new Date(2018, 2, 13),
            views: ['week'],
            currentView: 'week'
        });

        const $appointments = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);
        const cellWidth = getOuterWidth(scheduler.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0));

        assert.roughEqual(getOuterWidth($appointments.eq(0)), cellWidth - APPOINTMENT_DEFAULT_LEFT_OFFSET, 1.001, 'Width is OK');
    });

    QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Day', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 1, 9),
                endDate: new Date(2018, 2, 1, 10, 30),
                id: 1
            }, {
                text: 'b',
                startDate: new Date(2018, 2, 1, 9),
                endDate: new Date(2018, 2, 1, 10, 30),
                id: 2
            }],
            currentDate: new Date(2018, 2, 1),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            currentView: 'day',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 9,
            showAllDayPanel: false
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointments are rendered');

        const cellHeight = $(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

        assert.equal($appointments.eq(0).position().top, 0, 'correct top position');
        assert.equal($appointments.eq(0).position().left, 0, 'correct left position');
        assert.equal($appointments.eq(1).position().top, cellHeight * 30, 'correct top position');
        assert.equal($appointments.eq(1).position().left, 0, 'correct left position');
    });

    QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 9),
                endDate: new Date(2018, 2, 16, 10, 30),
                id: 1
            }, {
                text: 'b',
                startDate: new Date(2018, 2, 16, 9),
                endDate: new Date(2018, 2, 16, 10, 30),
                id: 2
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 9,
            showAllDayPanel: false
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointments is rendered');

        const cellHeight = $(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
        const cellWidth = $(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().width;

        assert.equal($appointments.eq(0).position().top, 0, 'correct top position');
        assert.equal($appointments.eq(0).position().left, cellWidth * 5, 'correct left position');
        assert.equal($appointments.eq(1).position().top, cellHeight * 30, 'correct top position');
        assert.equal($appointments.eq(1).position().left, cellWidth * 5, 'correct left position');
    });

    QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Week, showAllDayPanel = true', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 2,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
                {
                    text: '2',
                    id: 2,
                    allDay: true,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 15,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointments are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 7 * cellHeight, 1.5, 'correct top position of allDay appointment');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
        assert.roughEqual(translator.locate($appointments.eq(0)).left, 256, 1.1, 'correct left position of allDay appointment');

        assert.roughEqual($appointments.eq(1).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
        assert.roughEqual($appointments.eq(1).position().left, 256, 1.1, 'correct left position of appointment');
    });

    QUnit.test('Rival allDay appointments from different groups should be rendered correctly in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    allDay: true,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
                {
                    text: '2',
                    id: 2,
                    allDay: true,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 15,
            cellDuration: 60,
            showAllDayPanel: true
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointments are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 0, 1.5, 'correct top position of allDay appointment');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
        assert.roughEqual(translator.locate($appointments.eq(0)).left, 114, 1, 'correct left position of allDay appointment');

        assert.roughEqual($appointments.eq(1).position().top, 7 * cellHeight, 1.5, 'correct top position of allDay appointment');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
        assert.roughEqual(translator.locate($appointments.eq(1)).left, 114, 1, 'correct left position of allDay appointment');
    });

    QUnit.test('Rival allDay appointments from same groups should be rendered correctly in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    allDay: true,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
                {
                    text: '2',
                    id: 1,
                    allDay: true,
                    startDate: new Date(2018, 4, 21, 9, 30),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 15,
            cellDuration: 60,
            showAllDayPanel: true
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 0.5 * cellHeight, 2.5, 'correct top position of allDay appointment');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
        assert.roughEqual(translator.locate($appointments.eq(0)).left, 114, 1, 'correct left position of allDay appointment');
    });

    QUnit.test('Rival appointments from one group should be rendered correctly in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            width: 800,
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 15,
            cellDuration: 60,
            showAllDayPanel: true
        });

        scheduler.instance.option('dataSource', [
            {
                text: '1',
                id: 2,
                startDate: new Date(2018, 4, 21, 9, 30),
                endDate: new Date(2018, 4, 21, 11, 30)
            },
            {
                text: '2',
                id: 2,
                startDate: new Date(2018, 4, 22, 9, 30),
                endDate: new Date(2018, 4, 22, 11, 30)
            },
        ]);

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointments are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
        assert.roughEqual(getOuterWidth($appointments.eq(0)), 59, 2, 'correct size of appointment');
        assert.roughEqual($appointments.eq(0).position().left, 85, 1.1, 'correct left position of appointment');

        assert.roughEqual($appointments.eq(1).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
        assert.roughEqual(getOuterWidth($appointments.eq(1)), 59, 2, 'correct size of appointment');
        assert.roughEqual($appointments.eq(1).position().left, 170, 1.1, 'correct left position of appointment');
    });

    QUnit.test('Appointment in bottom cell should be rendered cirrectly in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 2,
                    startDate: new Date(2018, 4, 22, 13, 0),
                    endDate: new Date(2018, 4, 22, 17, 30)
                },
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 15,
            width: 2000,
            cellDuration: 60,
            showAllDayPanel: true
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 12 * cellHeight, 1.5, 'correct top position of appointment');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), 100, 2, 'correct size of appointment');
    });

    QUnit.test('Appointment should be dragged correctly between the groups in vertical grouped workspace Day', function(assert) {
        const scheduler = createWrapper({
            _draggingMode: 'default',
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 1, 12),
                endDate: new Date(2018, 2, 1, 12, 30),
                id: 1
            }],
            currentDate: new Date(2018, 2, 1),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            editing: true,
            currentView: 'day',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: false
        });

        scheduler.appointmentList[0].drag.toCell(10);

        this.clock.tick(10);
        const appointmentData = dataUtils.data(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

        assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 1, 13), 'Start date is correct');
        assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 1, 13, 30), 'End date is correct');
        assert.deepEqual(appointmentData.id, 2, 'Group is OK');
    });

    QUnit.test('Appointment should be dragged correctly between the groups in vertical grouped workspace Week', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 12),
                endDate: new Date(2018, 2, 16, 12, 30),
                id: 1
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            editing: true,
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: false,
            _draggingMode: 'default'
        });

        scheduler.appointmentList[0].drag.toCell(75);

        this.clock.tick(10);
        const appointmentData = dataUtils.data(scheduler.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

        assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 16, 13), 'Start date is correct');
        assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 16, 13, 30), 'End date is correct');
        assert.deepEqual(appointmentData.id, 2, 'Group is OK');
    });

    QUnit.test('Hourly recurring appt should be rendred in vertical grouped workspace Day', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 12, 30),
                endDate: new Date(2018, 2, 16, 13, 15),
                recurrenceRule: 'FREQ=HOURLY',
                id: 1
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            currentView: 'day',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: false
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 4, 'Appointments are rendered');
    });

    QUnit.test('Appt shouldn\'t be resized to the group border in horizontal grouped workspace Day', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 14),
                endDate: new Date(2018, 2, 16, 15),
                id: 1
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            currentView: 'day',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            editing: true,
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: false
        });

        const $element = $(scheduler.instance.$element());
        const cellHeight = $(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
        const pointer = pointerMock($element.find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight * 2).dragEnd();

        const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

        assert.equal($appointment.position().top + getOuterHeight($appointment), cellHeight * 8, 'Correct bottom coordinate');
    });

    QUnit.test('Appt shouldn\'t be resized to the group border after scrolling in horizontal grouped workspace Day', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 14),
                endDate: new Date(2018, 2, 16, 15),
                id: 2
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            currentView: 'day',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            editing: true,
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: true,
            height: 500
        });

        const scrollable = scheduler.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        const $element = $(scheduler.instance.$element());
        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0));
        const pointer = pointerMock($element.find('.dx-resizable-handle-top').eq(0)).start();

        pointer.dragStart().drag(0, -cellHeight * 5).dragEnd();

        const $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

        assert.roughEqual($appointment.position().top, 500, 1.1, 'Correct top coordinate');
        assert.equal(getOuterHeight($appointment), cellHeight * 6, 'Correct height');
    });

    QUnit.test('Appointment inside vertical grouped view should have a right resizable area in Day view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'a',
                startDate: new Date(2018, 2, 16, 14),
                endDate: new Date(2018, 2, 16, 15),
                id: 1
            }],
            currentDate: new Date(2018, 2, 16),
            views: [{
                type: 'day',
                groupOrientation: 'vertical'
            }],
            currentView: 'day',
            groups: ['id'],
            editing: true,
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            startDayHour: 12,
            endDayHour: 16,
            showAllDayPanel: false
        });

        const $appointment = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS).first();
        const initialResizableAreaTop = $appointment.dxResizable('instance').option('area').top;
        const initialResizableAreaBottom = $appointment.dxResizable('instance').option('area').bottom;

        assert.equal($appointment.dxResizable('instance').option('area').top, initialResizableAreaTop);
        assert.equal($appointment.dxResizable('instance').option('area').bottom, initialResizableAreaBottom);
    });

    QUnit.test('Appointment before startDayHour part should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    startDate: new Date(2018, 4, 21, 7),
                    endDate: new Date(2018, 4, 21, 11, 30)
                },
                {
                    text: '2',
                    id: 2,
                    startDate: new Date(2018, 4, 21, 7),
                    endDate: new Date(2018, 4, 21, 11, 30)
                }
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointment parts are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());
        const cellWidth = getOuterWidth($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), cellHeight * 2.5, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(0).position().left, cellWidth, 1.1, 'correct left position of  appointment part');

        assert.roughEqual($appointments.eq(1).position().top, cellHeight * 9, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), cellHeight * 2.5, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(1).position().left, cellWidth, 1.1, 'correct left position of appointment part');
    });

    QUnit.test('Appointment after endDayHour part should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    startDate: new Date(2018, 4, 21, 15),
                    endDate: new Date(2018, 4, 21, 17)
                },
                {
                    text: '2',
                    id: 2,
                    startDate: new Date(2018, 4, 21, 15),
                    endDate: new Date(2018, 4, 21, 17)
                }
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointment parts are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());
        const cellWidth = getOuterWidth($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, cellHeight * 7, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), cellHeight, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(0).position().left, cellWidth, 1.1, 'correct left position of  appointment part');

        assert.roughEqual($appointments.eq(1).position().top, cellHeight * 15, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), cellHeight, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(1).position().left, cellWidth, 1.1, 'correct left position of appointment part');
    });

    QUnit.test('Appointment starting on previous week should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    startDate: new Date(2018, 4, 19, 15),
                    endDate: new Date(2018, 4, 20, 11)
                },
                {
                    text: '2',
                    id: 2,
                    startDate: new Date(2018, 4, 19, 15),
                    endDate: new Date(2018, 4, 20, 11)
                }
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointment parts are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), cellHeight * 2, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(0).position().left, 0, 1.1, 'correct left position of  appointment part');

        assert.roughEqual($appointments.eq(1).position().top, cellHeight * 9, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), cellHeight * 2, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(1).position().left, 0, 1.1, 'correct left position of appointment part');
    });

    QUnit.test('Long appointments should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true (T714290)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 1,
                    startDate: new Date(2018, 4, 21, 15),
                    endDate: new Date(2018, 4, 22, 11, 30)
                }
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointment parts are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());
        const cellWidth = getOuterWidth($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 7 * cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), cellHeight, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(0).position().left, cellWidth, 1.1, 'correct left position of  appointment part');

        assert.roughEqual($appointments.eq(1).position().top, cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), cellHeight * 2.5, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(1).position().left, cellWidth * 2, 1.1, 'correct left position of appointment part');
    });

    QUnit.test('Long appointments should be rendered correctly in vertical grouped workspace Week, second group, showAllDayPanel = true (T714290)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: '1',
                    id: 2,
                    startDate: new Date(2018, 4, 21, 15),
                    endDate: new Date(2018, 4, 22, 11, 30)
                }
            ],
            views: [{
                type: 'week',
                groupOrientation: 'vertical'
            }],
            currentView: 'week',
            groups: ['id'],
            resources: [
                {
                    field: 'id',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' }
                    ]
                }
            ],
            currentDate: new Date(2018, 4, 21),
            startDayHour: 9,
            endDayHour: 16,
            cellDuration: 60,
            showAllDayPanel: true,
            width: 2000
        });

        const $appointments = $(scheduler.instance.$element()).find('.' + APPOINTMENT_CLASS);
        assert.equal($appointments.length, 2, 'two appointment parts are rendered');

        const cellHeight = getOuterHeight($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());
        const cellWidth = getOuterWidth($(scheduler.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first());

        assert.roughEqual($appointments.eq(0).position().top, 15 * cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(0)), cellHeight, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(0).position().left, cellWidth, 1.1, 'correct left position of  appointment part');

        assert.roughEqual($appointments.eq(1).position().top, 9 * cellHeight, 1.5, 'correct top position of appointment part');
        assert.roughEqual(getOuterHeight($appointments.eq(1)), cellHeight * 2.5, 2, 'correct size of appointment part');
        assert.roughEqual($appointments.eq(1).position().left, cellWidth * 2, 1.1, 'correct left position of appointment part');
    });

    QUnit.test('Scheduler recurrent appointments render right if began before startDayHour (T735635)', function(assert) {
        const appointments = [
            {
                text: 'Website Re-Design Plan',
                startDate: new Date(2019, 3, 22, 7, 30),
                endDate: new Date(2019, 3, 22, 11, 30),
                recurrenceRule: 'FREQ=DAILY'
            }
        ];
        const options = {
            dataSource: appointments,
            views: ['week', 'month'],
            currentView: 'week',
            startDayHour: 10,
            endDayHour: 16,
            height: 600,
            currentDate: new Date(2019, 3, 21),
        };
        const scheduler = createWrapper(options);

        const initialAppointmentHeight = scheduler.appointments.getAppointmentHeight(0);
        const recurrentAppointmentHeight = scheduler.appointments.getAppointmentHeight(1);
        assert.equal(initialAppointmentHeight, recurrentAppointmentHeight, 'Appointment cells have equal heights (both initial and recurrent)');
    });
});
