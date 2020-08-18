import $ from 'jquery';
import translator from 'animation/translator';
import dateLocalization from 'localization/date';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import tooltip from 'ui/tooltip/ui.tooltip';
import dragEvents from 'events/drag';
import { DataSource } from 'data/data_source/data_source';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import dataUtils from 'core/element_data';
import dateUtils from 'core/utils/date';
import { SchedulerTestWrapper } from '../../helpers/scheduler/helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const createInstance = function(options) {
    const instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
    return new SchedulerTestWrapper(instance);
};

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

function getDeltaTz(schedulerTz, date) {
    const defaultTz = date.getTimezoneOffset() * 60000;
    return schedulerTz * 3600000 + defaultTz;
}

QUnit.module('Integration: Appointments rendering when timezone is set', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('Appts should be filtered correctly with custom timeZone', function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(Date.UTC(2016, 4, 4, 15)),
            endDate: new Date(Date.UTC(2016, 4, 7, 15, 30)),
            text: 'new Date sample'
        }, {
            startDate: new Date(Date.UTC(2016, 4, 7, 23)),
            endDate: new Date(Date.UTC(2016, 4, 7, 21, 59)),
            text: 'The last one'
        }],
        currentDate: new Date(Date.UTC(2016, 4, 7)),
        timeZone: 5,
        currentView: 'day',
        firstDayOfWeek: 1
    });

    assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1, 'Only one appt is rendered');
});

QUnit.test('Appts should be filtered correctly with custom timeZone as string', function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: new Date(Date.UTC(2016, 4, 4, 15)),
            endDate: new Date(Date.UTC(2016, 4, 7, 15, 30)),
            text: 'new Date sample'
        }, {
            startDate: new Date(Date.UTC(2016, 4, 7, 23)),
            endDate: new Date(Date.UTC(2016, 4, 7, 21, 59)),
            text: 'The last one'
        }],
        currentDate: new Date(Date.UTC(2016, 4, 7)),
        timeZone: 'Asia/Calcutta',
        currentView: 'day',
        firstDayOfWeek: 1
    });

    assert.equal(this.instance.$element().find('.' + APPOINTMENT_CLASS).length, 1, 'Only one appt is rendered');
});

QUnit.test('Appts should be filtered correctly if there is a custom tz and start day hour is not 0', function(assert) {
    this.createInstance({
        dataSource: [{
            startDate: '2015-05-27T23:00:00+01:00',
            endDate: '2015-05-28T00:00:00+01:00',
            text: 'a'
        }, {
            startDate: '2015-05-26T18:30:00+01:00',
            endDate: '2015-05-26T20:30:00+01:00',
            text: 'b'
        }],
        startDayHour: 7,
        currentDate: new Date(2015, 4, 25),
        timeZone: -8,
        height: 500,
        currentView: 'week',
        firstDayOfWeek: 1
    });

    const $element = this.instance.$element();
    let $appt = $element.find('.' + APPOINTMENT_CLASS);
    const cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
    const apptPosition = translator.locate($appt.eq(0));
    const clientTzOffset = new Date('2015-05-27T23:00:00+01:00').getTimezoneOffset() / 60;

    const cellsCount = (new Date(
        new Date('2015-05-27T23:00:00+01:00').setHours(
            new Date('2015-05-27T23:00:00+01:00').getHours() + clientTzOffset - 8)).getHours() - 7) * 2;

    assert.equal($appt.length, 2, 'Appts are OK');
    assert.roughEqual(apptPosition.top, cellHeight * cellsCount, 2.001, 'Appt top offset is OK');

    this.instance.option({
        currentView: 'day',
        currentDate: new Date(2015, 4, 26)
    });

    $appt = $element.find('.' + APPOINTMENT_CLASS);
    assert.equal($appt.length, 1, 'Appts are OK on the Day view');
});

QUnit.test('Appts should be filtered correctly if there is a custom tz and start day hour is not 0(T396719)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            dataSource: [{
                text: 'Stand-up meeting',
                startDate: new Date(2015, 4, 25, 17),
                endDate: new Date(2015, 4, 25, 17, 30),
                startDateTimeZone: 'America/Lima', // -5
                endDateTimeZone: 'America/Lima'
            }],
            startDayHour: 10,
            currentDate: new Date(2015, 4, 25),
            timeZone: 'America/Dawson_Creek', // -7
            height: 500,
            currentView: 'week',
            firstDayOfWeek: 1
        });

        const apptCount = this.instance.$element().find('.' + APPOINTMENT_CLASS).length;

        assert.equal(apptCount, 0, 'There are not appts');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurring appointment icon should be visible on the month view', function(assert) {
    this.createInstance({
        dataSource: [
            {
                text: 'Appt',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 10),
                recurrenceRule: 'FREQ=DAILY'
            }
        ],
        currentDate: new Date(2015, 1, 9),
        timeZone: 'America/Los_Angeles',
        views: ['month'],
        currentView: 'month',
        height: 800
    });

    this.clock.tick();

    const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
    const $recurringIcon = $appointment.find('.dx-scheduler-appointment-recurrence-icon');

    assert.ok($recurringIcon.parent().hasClass('dx-scheduler-appointment-content'), 'Recurring icon is visible');
});

QUnit.test('Appointment startDate and endDate should be correct in the details view, if custom timeZone is setting', function(assert) {
    const startDate = new Date(2015, 3, 11, 11);
    const endDate = new Date(2015, 3, 11, 11, 30);

    const task = {
        text: 'Task 1',
        Start: startDate,
        End: endDate
    };

    const timezone = 5;

    this.createInstance({
        dataSource: new DataSource({
            store: [task]
        }),
        currentDate: new Date(2015, 3, 23),
        startDateExpr: 'Start',
        endDateExpr: 'End',
        timeZone: timezone
    });


    this.instance.showAppointmentPopup(task);

    const detailsForm = this.instance.getAppointmentDetailsForm();
    const formData = detailsForm.option('formData');
    const deltaTz = getDeltaTz(timezone, startDate);

    assert.deepEqual(formData.Start, new Date(startDate.getTime() + deltaTz), 'start date is correct');
    assert.deepEqual(formData.End, new Date(endDate.getTime() + deltaTz), 'end date is correct');
});

QUnit.test('Appointment startDate and endDate should be correct in the details view, if custom timeZone is setting as string', function(assert) {
    const startDate = new Date(2015, 3, 11, 11);
    const endDate = new Date(2015, 3, 11, 11, 30);

    const task = {
        text: 'Task 1',
        Start: startDate,
        End: endDate
    };

    this.clock.restore();

    this.createInstance({
        dataSource: new DataSource({
            store: [task]
        }),
        currentDate: new Date(2015, 3, 23),
        startDateExpr: 'Start',
        endDateExpr: 'End',
        timeZone: 'Asia/Ashkhabad'
    });

    this.instance.showAppointmentPopup(task);

    const detailsForm = this.instance.getAppointmentDetailsForm();
    const formData = detailsForm.option('formData');
    const deltaTz = getDeltaTz(5, startDate);

    assert.deepEqual(formData.Start, new Date(startDate.getTime() + deltaTz), 'start date is correct');
    assert.deepEqual(formData.End, new Date(endDate.getTime() + deltaTz), 'end date is correct');
});

QUnit.test('Appointment startDate and endDate should be correct in the details view for new appointment, if custom timeZone was set', function(assert) {
    this.createInstance({
        dataSource: new DataSource({
            store: []
        }),
        currentDate: new Date(2015, 3, 23),
        startDateExpr: 'Start',
        endDateExpr: 'End',
        timeZone: 'Asia/Calcutta'
    });

    pointerMock(this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(22)).start().click().click();

    const detailsForm = this.instance.getAppointmentDetailsForm();
    const formData = detailsForm.option('formData');

    assert.deepEqual(formData.Start, new Date(2015, 3, 23, 11), 'start date is correct');
    assert.deepEqual(formData.End, new Date(2015, 3, 23, 11, 30), 'end date is correct');
});

QUnit.test('Appointments should have correct size with custom time zone & hourly bounds', function(assert) {

    this.clock.restore();

    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 4, 25),
            startDayHour: 8,
            endDayHour: 18,
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: [{
                text: 'Approve New Online Marketing Strategy',
                startDate: new Date(2015, 4, 25, 8),
                endDate: new Date(2015, 4, 25, 12),
                startDateTimeZone: 'Africa/Brazzaville',
                endDateTimeZone: 'Africa/Brazzaville'
            }, {
                text: 'Stand-up meeting',
                startDate: new Date(2015, 4, 25, 18),
                endDate: new Date(2015, 4, 25, 20),
                startDateTimeZone: 'Africa/Brazzaville',
                endDateTimeZone: 'Africa/Brazzaville'
            }],
            timeZone: 'Africa/Brazzaville' // +1
        });

        const $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
        const $first = $appointments.eq(0);
        const $second = $appointments.eq(1);
        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

        assert.roughEqual($first.outerHeight(), cellHeight * 4, 2.001, 'Appointment height is correct');
        assert.roughEqual($second.outerHeight(), cellHeight * 4, 2.001, 'Appointment height is correct');

        assert.equal($first.find('.dx-scheduler-appointment-content-date').eq(0).text(), '6:00 AM - 10:00 AM', 'First appointment is correct');
        assert.equal($second.find('.dx-scheduler-appointment-content-date').eq(0).text(), '4:00 PM - 6:00 PM', 'Second appointment is correct');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Scheduler should not update scroll position if appointment is visible, when timeZone is set ', function(assert) {
    let workSpace;

    try {
        this.clock.restore();

        this.createInstance({
            startDayHour: 3,
            endDayHour: 10,
            currentDate: new Date(Date.UTC(2015, 1, 9)).toJSON(),
            dataSource: [],
            currentView: 'week',
            height: 500,
            timeZone: 'Asia/Ashkhabad'
        });

        this.instance.getWorkSpaceScrollable().scrollBy(170);

        workSpace = this.instance.getWorkSpace();

        const appointment = { startDate: new Date(Date.UTC(2015, 1, 9, 3)).toJSON(), endDate: new Date(Date.UTC(2015, 1, 9, 3, 30)).toJSON(), text: 'caption' };
        const scrollToTimeSpy = sinon.spy(workSpace, 'scrollToTime');

        this.instance.showAppointmentPopup(appointment);
        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        assert.notOk(scrollToTimeSpy.calledOnce, 'scrollToTime was not called');
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test('Scheduler should update scroll position if appointment was added to invisible bottom area, timezone is set', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: new DataSource({
            store: []
        }),
        currentView: 'week',
        height: 300,
        timezone: 'Asia/Ashkhabad'
    });

    const appointment = { startDate: new Date(2015, 1, 9, 21), endDate: new Date(2015, 1, 9, 22), text: 'caption 2' };
    const workSpace = this.instance.getWorkSpace();
    const scrollToTimeSpy = sinon.spy(workSpace, 'scrollToTime');

    try {
        this.instance.showAppointmentPopup(appointment);
        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        assert.ok(scrollToTimeSpy.calledOnce, 'scrollToTime was called');
    } finally {
        workSpace.scrollToTime.restore();
    }
});

QUnit.test('Appointment date correction should be rollback after closing popup, if custom timeZone was set', function(assert) {
    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 7, 1),
        endDate: new Date(2015, 1, 7, 2)
    };
    const data = new DataSource({
        store: [updatedItem]
    });

    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 1, 7),
        dataSource: data,
        timeZone: 5
    });

    const updateAppointment = sinon.spy(this.instance, 'updateAppointment');
    try {
        this.instance.showAppointmentPopup(updatedItem);

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        tooltip.hide();

        assert.ok(updateAppointment.calledOnce, 'Update method is called');
        assert.deepEqual(updateAppointment.getCall(0).args[0], updatedItem, 'Target item is correct');
        assert.deepEqual(updateAppointment.getCall(0).args[1], updatedItem, 'New data is correct');
    } finally {
        updateAppointment.restore();
    }
});

QUnit.test('Appointment date correction should be rollback after closing popup, if custom timeZone was set as string', function(assert) {
    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 7, 1),
        endDate: new Date(2015, 1, 7, 2)
    };
    const data = new DataSource({
        store: [updatedItem]
    });

    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 1, 7),
        dataSource: data,
        timeZone: 'Asia/Calcutta'
    });

    const updateAppointment = sinon.spy(this.instance, 'updateAppointment');

    try {
        this.instance.showAppointmentPopup(updatedItem);

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        assert.ok(updateAppointment.calledOnce, 'Update method is called');
        assert.deepEqual(updateAppointment.getCall(0).args[0], updatedItem, 'Target item is correct');
        assert.deepEqual(updateAppointment.getCall(0).args[1], updatedItem, 'New data is correct');
    } finally {
        updateAppointment.restore();
    }
});

QUnit.test('Appointment should have a correct template with custom timezone', function(assert) {
    this.clock.restore();
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date(2016, 4, 7, 5).getTimezoneOffset() * 60000);

    try {
        this.createInstance({
            currentDate: new Date(2016, 4, 7),
            startDayHour: 7,
            views: ['day'],
            currentView: 'day',
            dataSource: [
                {
                    startDate: new Date(Date.UTC(2016, 4, 7, 5)),
                    startDateTimeZone: 'Asia/Qyzylorda', // +6:00
                    endDateTimeZone: 'Asia/Qyzylorda',
                    endDate: new Date(Date.UTC(2016, 4, 7, 5, 30)),
                    text: 'new Date sample'
                }
            ],
            timeZone: 'Asia/Ashkhabad'// +5:00
        });

        const $appt = this.instance.$element().find('.' + APPOINTMENT_CLASS);
        const $contentDates = $appt.find('.dx-scheduler-appointment-content-date');

        assert.equal($contentDates.first().text(), '10:00 AM - 10:30 AM', 'Date is correct');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('onAppointmentAdding event args should be consistent with adding appointment when custom timezone (T686572)', function(assert) {
    this.createInstance({
        currentDate: new Date(2016, 4, 7),
        dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
        timeZone: 'Etc/UTC',
        views: ['day'],
        currentView: 'day',
        dataSource: [],
        height: 800,
        onAppointmentAdding: function(e) {
            assert.equal(e.appointmentData.startDate, '2016-05-07T05:00:00Z', 'Start date is ok');
            assert.equal(e.appointmentData.endDate, '2016-05-07T05:30:00Z', 'End date is ok');
        }
    });

    this.instance.addAppointment({
        startDate: new Date(Date.UTC(2016, 4, 7, 5)),
        endDate: new Date(Date.UTC(2016, 4, 7, 5, 30)),
        startDateTimeZone: 'Asia/Qyzylorda', // +6:00
        endDateTimeZone: 'Asia/Qyzylorda',
        text: 'new Date sample'
    });
});

QUnit.test('Appointment should have a correct template with custom timezone(T387040)', function(assert) {
    const clientTzOffset = new Date(2016, 4, 7).getTimezoneOffset() * 60000;

    this.createInstance({
        currentDate: new Date(2016, 4, 7),
        views: ['week'],
        currentView: 'week',
        dataSource: []
    });

    this.instance.option('dataSource', [{
        startDate: new Date(Date.UTC(2016, 4, 7, 1)),
        startDateTimeZone: 'Asia/Yekaterinburg',
        endDateTimeZone: 'Asia/Yekaterinburg',
        endDate: new Date(Date.UTC(2016, 4, 7, 1, 30)),
        text: 'new Date sample'
    }]);

    const $appt = this.instance.$element().find('.' + APPOINTMENT_CLASS);
    const $contentDates = $appt.find('.dx-scheduler-appointment-content-date');
    const expectedStartDate = new Date(new Date(2016, 4, 7, 1).getTime() - clientTzOffset);
    const expectedEndDate = new Date(new Date(2016, 4, 7, 1, 30).getTime() - clientTzOffset);

    assert.equal($contentDates.first().text(), `${dateLocalization.format(expectedStartDate, 'shorttime')} - ${dateLocalization.format(expectedEndDate, 'shorttime')}`, 'Date is correct');
});

QUnit.test('Appointment with custom timezone should be resized correctly(T390801)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            timeZone: 'America/Araguaina', // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 12, 10),
                endDate: new Date(2015, 5, 12, 12)
            }]
        });

        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
        let $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS);
        const initialAppointmentTop = $appointment.position().top;

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);

        assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointment.outerHeight(), cellHeight * 5, 2.001, 'Appointment height is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrence appointment with custom timezone should be resized correctly(T390801)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Araguaina', // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 12, 10).toString(),
                endDate: new Date(2015, 5, 12, 12).toString(),
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
        let $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
        const initialAppointmentTop = $appointments.eq(0).position().top;

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 2, 'Appointment count is OK');
        assert.equal($appointments.eq(1).position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 5, 2.001, 'Appointment height is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly(T390801)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        this.createInstance({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Araguaina', // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 12, 10).toString(),
                endDate: new Date(2015, 5, 12, 12).toString(),
                recurrenceRule: 'FREQ=DAILY',
                startDateTimeZone: 'America/Lima', // -5
                endDateTimeZone: 'America/Lima'
            }]
        });

        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;
        let $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
        const initialAppointmentTop = $appointments.eq(0).position().top;

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

        assert.equal($appointments.length, 2, 'Appointment count is OK');
        assert.equal($appointments.eq(1).position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 5, 2.001, 'Appointment height is OK');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be opened correctly(T390801)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        const appointment = {
            text: 'Stand-up meeting',
            startDate: new Date(2016, 5, 7, 9),
            endDate: new Date(2016, 5, 7, 10),
            startDateTimeZone: 'Europe/Moscow', // +3
            endDateTimeZone: 'Europe/Moscow',
            recurrenceRule: 'FREQ=DAILY'
        };

        this.createInstance({
            currentDate: new Date(2016, 5, 7),
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 1,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Phoenix', // -7
            dataSource: [appointment]
        });

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);

        $appointment.trigger('dxdblclick');
        const initialPosition = $appointment.position();

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
        const updatedPosition = this.instance.$element().find('.' + APPOINTMENT_CLASS).not('.dx-scheduler-appointment-recurrence').position();

        assert.equal(updatedPosition.top, initialPosition.top, 'Top is updated correctly');
        assert.equal(updatedPosition.left, initialPosition.left, 'Left is updated correctly');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Arguments in event args should be correct when timezone is set(T579457)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        const appointment = {
            startDate: new Date('2017-11-22T14:30:00.000Z'),
            endDate: new Date('2017-11-22T15:00:00.000Z'),
            allDay: false,
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
            text: ''
        };

        this.createInstance({
            currentDate: new Date(2017, 10, 22),
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 1,
            onAppointmentClick: function(args) {
                assert.equal(args.appointmentData.startDate.getTime(), args.targetedAppointmentData.startDate.getTime(), 'Arguments are OK');
                assert.equal(args.appointmentData.endDate.getTime(), args.targetedAppointmentData.endDate.getTime(), 'Arguments are OK');
            },
            timeZone: 'Etc/UTC',
            dataSource: [appointment]
        });

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
        $appointment.trigger('dxclick');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrence appointment with the same custom timezones should be opened correctly(T390801)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        const appointment = {
            text: 'Stand-up meeting',
            startDate: '2015-05-25T15:30:00.000Z',
            endDate: '2015-05-25T15:45:00.000Z',
            startDateTimeZone: 'America/Phoenix', // -7
            endDateTimeZone: 'America/Phoenix',
            recurrenceRule: 'FREQ=DAILY'
        };

        this.createInstance({
            currentDate: new Date(2015, 4, 25),
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 1,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Phoenix', // -7
            dataSource: [appointment]
        });

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(1);

        $appointment.trigger('dxdblclick');
        const initialPosition = $appointment.position();

        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
        const updatedPosition = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).not('.dx-scheduler-appointment-recurrence').position();

        assert.equal(updatedPosition.top, initialPosition.top, 'Top is updated correctly');
        assert.equal(updatedPosition.left, initialPosition.left, 'Left is updated correctly');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly(T392414)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 4, 25),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Phoenix', // -7
            dataSource: [{
                text: 'a',
                startDate: '2015-05-25T17:00:00.000Z',
                endDate: '2015-05-25T17:15:00.000Z',
                startDateTimeZone: 'America/Lima', // -5
                endDateTimeZone: 'America/Lima'
            }]
        });

        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();
        let $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();
        const initialAppointmentTop = $appointment.position().top;

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();

        assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointment.outerHeight(), cellHeight * 2, 2.001, 'Appointment height is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment with custom tz that is equal to scheduler tz should be resized correctly(T392414)', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 4, 25),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Lima', // -5
            dataSource: [{
                text: 'a',
                startDate: '2015-05-25T17:00:00.000Z',
                endDate: '2015-05-25T17:15:00.000Z',
                startDateTimeZone: 'America/Lima',
                endDateTimeZone: 'America/Lima'
            }]
        });

        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();
        let $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();
        const initialAppointmentTop = $appointment.position().top;

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();

        assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointment.outerHeight(), cellHeight * 2, 2.001, 'Appointment height is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment with custom tz should be resized correctly if the scheduler tz is empty(T392414)', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 11, 25),
        views: ['day'],
        currentView: 'day',
        editing: true,
        dataSource: [{
            text: 'a',
            startDate: '2015-12-25T10:00:00.000Z',
            endDate: '2015-12-25T10:15:00.000Z',
            startDateTimeZone: 'America/Lima', // -5
            endDateTimeZone: 'America/Lima'
        }]
    });

    const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();
    let $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();
    const initialAppointmentTop = $appointment.position().top;

    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
    pointer.dragStart().drag(0, cellHeight);
    pointer.dragEnd();

    $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();

    assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
    assert.roughEqual($appointment.outerHeight(), cellHeight * 2, 2.001, 'Appointment height is OK');
});

QUnit.test('Appointment with custom tz that isn\'t equal to scheduler tz should be dragged correctly(T392414)', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        startDayHour: 6,
        views: ['day'],
        currentView: 'day',
        editing: true,
        recurrenceEditMode: 'occurrence',
        timeZone: 'America/Phoenix', // -7
        dataSource: [{
            text: 'a',
            startDate: '2015-05-25T17:00:00.000Z',
            endDate: '2015-05-25T17:15:00.000Z',
            startDateTimeZone: 'America/Lima', // -5
            endDateTimeZone: 'America/Lima'
        }]
    });

    let $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).first();
    const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(6);
    const initialAppointmentHeight = $appointment.outerHeight();

    const pointer = pointerMock($appointment).start().down().move(10, 10);
    $cell.trigger(dragEvents.enter);
    pointer.up();

    $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();


    assert.roughEqual($appointment.position().top, $cell.outerHeight() * 6, 2.001, 'Appointment top is OK');
    assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

    const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
    const cellData = dataUtils.data($cell.get(0), 'dxCellData');
    const startDate = cellData.startDate;
    const endDate = new Date(cellData.startDate.getTime() + 15 * 60 * 1000);
    const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

    assert.equal(dateText, resultDate, 'Appointment date is OK');
});

QUnit.test('Appointment with \'Etc/UTC\' tz should be rendered correctly(T394991)', function(assert) {
    let tzOffsetStub;
    try {
        this.clock.restore();
        tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date('2016-06-25T17:00:00.000Z').getTimezoneOffset() * 60000);

        this.createInstance({
            currentDate: new Date(2016, 5, 25),
            startDayHour: 16,
            views: ['day'],
            currentView: 'day',
            editing: true,
            timeZone: 'Greenwich', // 0
            dataSource: [{
                text: 'a',
                startDate: '2016-06-25T17:00:00.000Z',
                endDate: '2016-06-25T17:30:00.000Z'
            }]
        });

        let $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).first();
        const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(6);
        const initialAppointmentHeight = $appointment.outerHeight();

        assert.roughEqual($appointment.position().top, $cell.outerHeight() * 2, 2.001, 'Appointment top is OK');
        assert.roughEqual($appointment.outerHeight(), $cell.outerHeight(), 2.001, 'Appointment height is OK');

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        $cell.trigger(dragEvents.enter);
        pointer.up();

        $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).first();

        assert.roughEqual($appointment.position().top, $cell.outerHeight() * 6, 2.001, 'Appointment top is OK');
        assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

        const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
        const cellData = dataUtils.data($cell.get(0), 'dxCellData');
        const startDate = cellData.startDate;
        const endDate = new Date(cellData.startDate.getTime() + 30 * 60 * 1000);
        const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

        assert.equal(dateText, resultDate, 'Appointment date is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment should be rendered correctly when custom timezone was set', function(assert) {
    const startDate = new Date(2015, 1, 4, 5);
    const endDate = new Date(2015, 1, 4, 7);

    const appointments = [{
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        text: 'abc',
        recurrenceRule: 'FREQ=DAILY'
    }];

    const timezone = 5;

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        dataSource: appointments,
        timeZone: timezone
    });

    const $recAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);

    assert.equal($recAppointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');

    const deltaTz = getDeltaTz(timezone, startDate);
    const resultDate = `${dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime')} - ${dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime')}`;

    assert.equal($recAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
    assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Recurrence icon is rendered');
});

QUnit.test('Appointment should be rendered correctly when custom timezone was set as string', function(assert) {
    const startDate = new Date(2015, 1, 4, 5);
    const endDate = new Date(2015, 1, 4, 7);

    const appointments = [{
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        text: 'abc',
        recurrenceRule: 'FREQ=DAILY'
    }
    ];

    this.clock.restore();

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        dataSource: appointments,
        timeZone: 'Asia/Ashkhabad'
    });


    const $recAppointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0);

    assert.equal($recAppointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');

    const deltaTz = getDeltaTz(5, startDate);
    const resultDate = `${dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime')} - ${dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime')}`;
    assert.equal($recAppointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
    assert.equal($recAppointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Recurrence icon is rendered');
});

QUnit.test('Appointment should be rendered correctly when appointment timeZone was set', function(assert) {
    const appointments = [{
        startDate: new Date(2015, 1, 4, 5).toString(),
        startDateTimeZone: 'Asia/Calcutta', // +05:30
        endDateTimeZone: 'Asia/Calcutta',
        endDate: new Date(2015, 1, 4, 6).toString(),
        text: 'abc'
    }];

    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: appointments
        });
        const cellHeight = scheduler.workSpace.getCellHeight();
        const resultDate = `${dateLocalization.format(new Date(2015, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2015, 1, 4, 6), 'shorttime')}`;

        assert.equal(scheduler.appointments.getDateText(), resultDate, 'Appointment content has correct dates');
        assert.deepEqual(scheduler.appointments.getAppointmentPosition(), {
            top: 10 * cellHeight,
            left: 100
        }, 'Appointment is rendered in right cell');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment should be rendered correctly when appointment timezone and scheduler timezone was set', function(assert) {
    const startDate = new Date(2015, 1, 4, 5);
    const endDate = new Date(2015, 1, 4, 6);

    const appointments = [{
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        startDateTimezone: 'Asia/Ashkhabad',
        text: 'abc'
    }];

    this.clock.restore();

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        dataSource: appointments,
        timeZone: 'Asia/Qyzylorda'
    });

    const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

    const deltaTz = getDeltaTz(6, startDate);
    const resultDate = `${dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime')} - ${dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime')}`;

    assert.equal($appointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');
    assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
});

QUnit.test('All-day Appointment should be rendered correctly when custom timezone was set', function(assert) {
    const timezone = 5;
    const timezoneDifference = getDeltaTz(timezone, new Date(2016, 4, 4));
    const startDate = new Date(new Date(2016, 4, 4).getTime() - timezoneDifference);
    const endDate = new Date(new Date(2016, 4, 5).getTime() - timezoneDifference);

    this.createInstance({
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2016, 4, 3),
        timeZone: 'Asia/Ashkhabad',
        dataSource: [{
            startDate: startDate,
            endDate: endDate
        }]
    });

    const $element = this.instance.$element();
    const apptWidth = $element.find('.' + APPOINTMENT_CLASS).first().outerWidth();
    const cellWidth = $element.find('.dx-scheduler-all-day-table-cell').first().outerWidth();

    assert.roughEqual(apptWidth, cellWidth, 2.001, 'Appt width is OK');
});

QUnit.test('Appointment should be rendered correctly if timeZones is changed', function(assert) {

    this.clock.restore();

    const appointments = [{
        startDate: new Date(2015, 1, 4, 5).toString(),
        endDate: new Date(2015, 1, 4, 6).toString(),
        text: 'abc'
    }];

    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            currentDate: new Date(2015, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: appointments,
            startDayHour: 5,
            timeZone: 3
        });

        this.instance.option('timeZone', 4);

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
        const cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

        assert.roughEqual($appointment.position().top, cellHeight * 2, 2.001, 'Appointment top is correct');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointment should have right width in workspace with timezone', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        this.clock.restore();
        this.createInstance({
            dataSource: [],
            currentDate: new Date(2017, 4, 1),
            currentView: 'month',
            firstDayOfWeek: 1,
            startDayHour: 3,
            endDayHour: 24,
            timeZone: 'Asia/Ashkhabad',
            height: 600
        });

        this.instance.addAppointment({
            text: 'Task 1',
            startDate: new Date(2017, 4, 4),
            endDate: new Date(2017, 4, 5)
        });

        const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);
        const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(9);

        assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 2, 2.001, 'Task has a right width');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Recurrence appointment with \'Etc/UTC\' tz should be updated correctly via drag(T394991)', function(assert) {
    let tzOffsetStub;
    try {
        this.clock.restore();
        tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date('2015-12-25T17:00:00.000Z').getTimezoneOffset() * 60000);

        this.createInstance({
            currentDate: new Date(2015, 11, 25),
            startDayHour: 16,
            views: ['week'],
            currentView: 'week',
            editing: true,
            timeZone: 'Etc/UTC', // 0
            recurrenceEditMode: 'occurrence',
            firstDayOfWeek: 1,
            dataSource: [{
                text: 'a',
                startDate: '2015-12-25T17:00:00.000Z',
                endDate: '2015-12-25T17:30:00.000Z',
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        let $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).first();
        const $cell = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(21);
        const initialAppointmentHeight = $appointment.outerHeight();

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        $cell.trigger(dragEvents.enter);
        pointer.up();

        $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS).not('.dx-scheduler-appointment-recurrence');

        assert.roughEqual($appointment.position().top, $cell.outerHeight() * 3, 2.001, 'Appointment top is OK');
        assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

        const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
        const cellData = dataUtils.data($cell.get(0), 'dxCellData');
        const startDate = cellData.startDate;
        const endDate = new Date(cellData.startDate.getTime() + 30 * 60 * 1000);
        const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

        assert.equal(dateText, resultDate, 'Appointment date is OK');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Task dragging when custom timeZone is set', function(assert) {
    this.clock.restore();
    const timezone = -5;
    const timezoneDifference = getDeltaTz(timezone, new Date(2015, 1, 9));
    const startDate = new Date(new Date(2015, 1, 9).getTime() - timezoneDifference);
    const endDate = new Date(new Date(2015, 1, 9, 1).getTime() - timezoneDifference);

    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: startDate,
                endDate: endDate
            }
        ]
    });

    this.createInstance({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true, timeZone: timezone });

    this.clock.tick();

    const hour = 3600000;
    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(startDate.getTime() + hour),
        endDate: new Date(endDate.getTime() + hour),
        allDay: false
    };

    const pointer = pointerMock($(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0)).start().down().move(10, 10);
    $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(2).trigger(dragEvents.enter);
    pointer.up();

    const dataSourceItem = this.instance.option('dataSource').items()[0];

    this.clock.tick();
    assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
});

QUnit.test('DropDown appointment should be rendered correctly when timezone is set', function(assert) {
    const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    try {
        const data = [
            {
                schedule: 'Appointment 1',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 2',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 3',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 4',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 5',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 6',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            }
        ];

        const scheduler = createInstance({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2018, 8, 17),
            timeZone: 'Etc/UTC',
            showCurrentTimeIndicator: false,
            maxAppointmentsPerCell: 1,
            height: 600,
            textExpr: 'schedule'
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getDateText(), 'September 16 10:00 PM - 11:00 PM', 'Dates are correct');
    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('New added appointment should be rendered correctly in specified timeZone', function(assert) {
    this.createInstance({
        dataSource: [],
        currentDate: new Date(2018, 4, 25),
        views: ['week'],
        currentView: 'week',
        timeZone: 'Etc/UTC'
    });

    const task = { text: 'a', startDate: new Date(2018, 4, 23, 8, 0), endDate: new Date(2018, 4, 23, 8, 30) };
    const timezoneOffset = new Date(2018, 4, 23).getTimezoneOffset() * dateUtils.dateToMilliseconds('minute');

    this.instance.showAppointmentPopup(task, true);
    $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

    const $appointment = this.instance.$element().find('.' + APPOINTMENT_CLASS);
    const startDate = $appointment.dxSchedulerAppointment('instance').option('startDate');

    assert.equal(startDate.getTime(), task.startDate.getTime() + timezoneOffset, 'appointment starts in 8AM');
});

QUnit.module('Appointments rendering when appointment timeZone is set', () => {
    const cases = [{
        caseName: 'startDateTimeZone = endDateTimezone',
        appointment: {
            startDate: new Date(2020, 1, 4, 5).toString(),
            startDateTimeZone: 'Asia/Yekaterinburg',
            endDateTimeZone: 'Asia/Yekaterinburg',
            endDate: new Date(2020, 1, 4, 6).toString(),
            text: 'abc'
        },
        expectedContent: `${dateLocalization.format(new Date(2020, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2020, 1, 4, 6), 'shorttime')}`,
        expectedPosition: {
            top: 500,
            left: 100
        },
        expectedPopupDates: {
            startDate: '2/4/2020, 7:00 AM',
            endDate: '2/4/2020, 8:00 AM'
        },
        expectedHeight: 100,
        stubClientTimeZone: true
    },
    {
        caseName: 'startDateTimeZone != endDateTimezone',
        appointment: {
            startDate: new Date(2020, 1, 4, 5).toString(),
            startDateTimeZone: 'Europe/Moscow',
            endDateTimeZone: 'Asia/Yekaterinburg',
            endDate: new Date(2020, 1, 4, 6).toString(),
            text: 'abc'
        },
        expectedContent: `${dateLocalization.format(new Date(2020, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2020, 1, 4, 6), 'shorttime')}`,
        expectedPosition: {
            top: 500,
            left: 100
        },
        expectedPopupDates: {
            startDate: '2/4/2020, 5:00 AM',
            endDate: '2/4/2020, 8:00 AM'
        },
        expectedHeight: 100,
        stubClientTimeZone: true
    },
    {
        caseName: 'startDateTimeZone = endDateTimezone and scheduler timeZone is set',
        appointment: {
            text: 'Daily meeting',
            startDate: new Date('2020-02-04T14:00:00.000Z'),
            endDate: new Date('2020-02-04T15:00:00.000Z'),
            startDateTimeZone: 'Africa/Algiers',
            endDateTimeZone: 'Africa/Algiers'
        },
        schedulerTimeZone: 'Asia/Yekaterinburg',
        expectedContent: '7:00 PM - 8:00 PM',
        expectedPosition: {
            top: 1900,
            left: 100
        },
        expectedPopupDates: {
            startDate: '2/4/2020, 3:00 PM',
            endDate: '2/4/2020, 4:00 PM'
        },
        expectedHeight: 100,
        stubClientTimeZone: false
    },
    {
        caseName: 'startDateTimeZone != endDateTimezone and scheduler timeZone is set',
        appointment: {
            text: 'Daily meeting',
            startDate: new Date('2020-02-04T14:00:00.000Z'),
            endDate: new Date('2020-02-04T15:00:00.000Z'),
            startDateTimeZone: 'Africa/Algiers',
            endDateTimeZone: 'Africa/Cairo'
        },
        schedulerTimeZone: 'Asia/Yekaterinburg',
        expectedContent: '7:00 PM - 8:00 PM',
        expectedPosition: {
            top: 1900,
            left: 100
        },
        expectedPopupDates: {
            startDate: '2/4/2020, 3:00 PM',
            endDate: '2/4/2020, 5:00 PM'
        },
        expectedHeight: 100,
        stubClientTimeZone: false
    }];

    const test = function(config, assert) {
        const scheduler = createInstance({
            currentDate: new Date(2020, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: [config.appointment],
            timeZone: config.schedulerTimeZone
        });

        assert.equal(scheduler.appointments.getDateText(), config.expectedContent, 'Appointment content has correct dates');
        assert.deepEqual(scheduler.appointments.getAppointmentPosition(), config.expectedPosition, 'Appointment is rendered in right cell');

        scheduler.appointments.dblclick(0);
        const form = scheduler.instance.getAppointmentDetailsForm();
        const startDateBox = form.getEditor('startDate');
        const endDateBox = form.getEditor('endDate');

        assert.equal(startDateBox.option('text'), config.expectedPopupDates.startDate, 'Appointment content has right startDate');
        assert.equal(endDateBox.option('text'), config.expectedPopupDates.endDate, 'Appointment content has right endDate');
    };

    cases.forEach((config) => {
        QUnit.test(`Appointment should have correct size, position and popup content if ${config.caseName}`, function(assert) {
            if(config.stubClientTimeZone) {
                const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
                try {
                    test(config, assert);
                } finally {
                    tzOffsetStub.restore();
                }
            } else {
                test(config, assert);
            }
        });
    });
});
