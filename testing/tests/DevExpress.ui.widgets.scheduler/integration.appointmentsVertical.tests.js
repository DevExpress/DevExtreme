import $ from 'jquery';

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';

import { SchedulerTestWrapper } from './helpers.js';

const createInstance = function(options) {
    const defaultOption = {
        maxAppointmentsPerCell: null
    };
    const instance = $('#scheduler').dxScheduler($.extend(defaultOption, options)).dxScheduler('instance');
    return new SchedulerTestWrapper(instance);
};

import translator from 'animation/translator';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import Color from 'color';
import devices from 'core/devices';
import dragEvents from 'events/drag';
import { DataSource } from 'data/data_source/data_source';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import dataUtils from 'core/element_data';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

var APPOINTMENT_DEFAULT_OFFSET = 25;
const APPOINTMENT_MOBILE_OFFSET = 50;

const getOffset = () => {
    if(devices.current().deviceType !== 'desktop') {
        return APPOINTMENT_MOBILE_OFFSET;
    } else {
        return APPOINTMENT_DEFAULT_OFFSET;
    }
};

QUnit.module('Integration: Appointments on vertical views (day, week, workWeek)', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options, { maxAppointmentsPerCell: options && options.maxAppointmentsPerCell || null })).dxScheduler('instance');
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
});

QUnit.test('Appointments on Day view should have a right height and position if startDate begins day before', function(assert) {
    this.createInstance({
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
    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS),
        cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

    assert.equal($appointment.position().top, 0, 'Appointment has a right top position');
    assert.equal($appointment.outerHeight(), cellHeight, 'Appointment has a right height');
});

QUnit.test('Appointments on Week view should have a right position if widget is small', function(assert) {
    this.createInstance({
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
    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS),
        cellWidth = $element.find('.' + DATE_TABLE_CELL_CLASS).first().outerWidth();

    assert.roughEqual($appointment.position().left, cellWidth * 4 + 50, 2, 'Appointment has a right left position');
});

QUnit.test('Appointment with resources should have a right height and position if it ends on the next day', function(assert) {
    this.createInstance({
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

    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS),
        cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

    assert.equal($appointment.length, 1, 'Only one appt is rendered');
    assert.equal($appointment.position().top, cellHeight * 20, 'Appointment has a right top position');
    assert.equal($appointment.outerHeight(), cellHeight * 4, 'Appointment has a right height');
});

QUnit.test('The part of the appointment that ends after midnight should be shown on Week view', function(assert) {
    this.createInstance({
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

    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 2, 'ok');
    assert.equal($appointment.eq(1).position().top, 0, 'Appointment has a right top position');
});

QUnit.test('The part of the appointment that ends after midnight should have right height when set startDayHour & endDayHour', function(assert) {
    this.createInstance({
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

    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(1),
        cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;

    assert.equal($appointment.outerHeight(), cellHeight, 'appt part has right height');
});

QUnit.test('The part of recurrence appointment after midnight should be shown on Day view', function(assert) {
    this.createInstance({
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

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 1, 'Appt part is shown on 2d day');
    assert.equal($appointment.eq(0).position().top, 0, 'Appointment has a right top position');
});

QUnit.test('The part of recurrence appointment after midnight should have right height on the first day of week', function(assert) {
    this.createInstance({
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

    var $element = this.instance.$element(),
        $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0),
        cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;

    assert.equal($appointment.outerHeight(), cellHeight * 3, 'appt part has right height');
});

QUnit.test('Recurring appointments should be rendered correctly with a custom timezone(T385377)', function(assert) {
    var tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
            dataSource: [],
            currentDate: new Date(2016, 4, 7),
            timeZone: 'Asia/Ashkhabad',
            height: 500,
            currentView: 'week',
            firstDayOfWeek: 1
        });

        this.instance.addAppointment({
            startDate: new Date(2016, 4, 2),
            endDate: new Date(2016, 4, 2, 0, 30),
            recurrenceRule: 'FREQ=DAILY'
        });

        var $element = this.instance.$element(),
            $appt = this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0),
            expectedLeftPosition = $element.find('.dx-scheduler-time-panel').outerWidth(),
            apptPosition = $appt.position();

        assert.roughEqual(apptPosition.top, 0, 2.001, 'Appts top is OK');
        assert.roughEqual(apptPosition.left, expectedLeftPosition, 2.001, 'Appts left is OK');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Appointments should have correctly height with a custom timezone(T387561)', function(assert) {
    var tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

    try {
        this.createInstance({
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

        var $element = this.instance.$element(),
            $appts = this.instance.$element().find('.' + APPOINTMENT_CLASS),
            cellHeight = $element.find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight();

        assert.roughEqual($appts.eq(0).outerHeight(), cellHeight / 2, 2.001, 'Appts top is OK');
        assert.roughEqual($appts.eq(1).outerHeight(), cellHeight * 4, 2.001, 'Appts top is OK');

    } finally {
        tzOffsetStub.restore();
    }
});

QUnit.test('Two vertical neighbor appointments should be placed correctly', function(assert) {
    this.createInstance({
        dataSource: [],
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 24),
        views: ['week'],
        currentView: 'week',
        width: 800
    });

    this.instance.addAppointment({
        text: 'b',
        startDate: new Date(2015, 1, 23, 1),
        endDate: new Date(2015, 1, 23, 1, 30)
    });

    this.instance.addAppointment({
        text: 'a',
        startDate: new Date(2015, 1, 23, 0, 30),
        endDate: new Date(2015, 1, 23, 1)
    });

    this.instance.addAppointment({
        text: 'c',
        startDate: new Date(2015, 1, 23, 0, 30),
        endDate: new Date(2015, 1, 23, 1),
        allDay: true
    });

    var $commonAppointments = this.instance.$element().find('.dx-scheduler-scrollable-appointments .dx-scheduler-appointment'),
        $allDayAppts = this.instance.$element().find('.dx-scheduler-all-day-appointment'),
        cellWidth = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerWidth(),
        appointmentOffset = getOffset();

    assert.roughEqual(translator.locate($commonAppointments.eq(0)).left, 100, 2.001, 'Left position is OK');
    assert.roughEqual(translator.locate($commonAppointments.eq(1)).left, 100, 2.001, 'Left position is OK');
    assert.roughEqual(translator.locate($allDayAppts.eq(0)).left, 100, 2.001, 'Left position is OK');

    assert.roughEqual($commonAppointments.eq(0).outerWidth(), cellWidth - appointmentOffset, 1.001, 'Width is OK');
    assert.roughEqual($commonAppointments.eq(1).outerWidth(), cellWidth - appointmentOffset, 1.001, 'Width is OK');
    assert.roughEqual($allDayAppts.eq(0).outerWidth(), cellWidth, 1.001, 'Width is OK');
});

QUnit.test('Appointment size should depend on neighbor appointments', function(assert) {
    var items = [{ text: 'a', startDate: new Date(2015, 2, 4, 1), endDate: new Date(2015, 2, 4, 2) },
        { text: 'b', startDate: new Date(2015, 2, 4, 2, 30), endDate: new Date(2015, 2, 4, 3) },
        { text: 'c', startDate: new Date(2015, 2, 4, 2, 30), endDate: new Date(2015, 2, 4, 3) },
        { text: 'd', startDate: new Date(2015, 2, 4, 1, 30), endDate: new Date(2015, 2, 4, 3) }];

    this.createInstance({
        currentView: 'week',
        currentDate: new Date(2015, 2, 4),
        dataSource: items
    });

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);
    assert.roughEqual($appointments.eq(0).width(), $appointments.eq(3).width(), 0.1);
});

QUnit.test('Recurrence appointment should be rendered correctly when currentDate was changed: all-day', function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 4, 0),
        endDate: new Date(2015, 1, 4, 0, 30),
        text: 'long appointment',
        recurrenceRule: 'FREQ=DAILY',
        allDay: true
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        dataSource: [appointment],
        views: ['day'],
        currentView: 'day'
    });

    this.instance.option('currentDate', new Date(2015, 1, 5));

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    assert.equal($appointment.length, 1, 'Appointment is rendered');
});

QUnit.test('Recurrence appointment should be rendered correctly when currentDate was changed: day', function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 4, 0),
        endDate: new Date(2015, 1, 4, 1),
        text: 'long appointment',
        recurrenceRule: 'FREQ=DAILY'
    };

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        dataSource: [appointment],
        views: ['day'],
        currentView: 'day'
    });

    this.instance.option('currentDate', new Date(2015, 1, 5));

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    assert.roughEqual($appointment.height(), 100, 1.001, 'Appointment is rendered correctly');
});

QUnit.test('Appointments should have correct position, rtl mode, editing=false', function(assert) {
    var appointment = {
        startDate: new Date(2015, 1, 4, 0),
        endDate: new Date(2015, 1, 4, 1)
    };

    this.createInstance({
        rtlEnabled: true,
        editing: false,
        currentDate: new Date(2015, 1, 4),
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        dataSource: [appointment]
    });

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0),
        appointmentOffset = getOffset();

    assert.roughEqual($appointment.position().left, appointmentOffset, 2, 'Appointment left is correct on init');
});


QUnit.test('Appointment should have correct height, when startDayHour is decimal', function(assert) {
    var appointments = [{
        startDate: new Date(2015, 1, 4, 5, 35).toString(),
        endDate: new Date(2015, 1, 4, 5, 45).toString(),
        text: 'abc'
    }];

    this.createInstance({
        currentDate: new Date(2015, 1, 4),
        cellDuration: 5,
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        dataSource: appointments,
        startDayHour: 5.5
    });

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0),
        cellHeight = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height;

    assert.roughEqual($appointment.position().top, cellHeight, 2.001, 'Appointment top is correct');
    assert.roughEqual($appointment.outerHeight(), 2 * cellHeight, 2.001, 'Appointment height is correct');
});

QUnit.test('dropDown appointment should not compact class on vertical view', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: [{ type: 'week', name: 'week' }],
        currentView: 'week',
        maxAppointmentsPerCell: 'auto'
    });

    this.instance.option('dataSource', [
        { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) },
        { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) },
        { text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1) }
    ]);

    var $dropDown = $(this.instance.$element()).find('.dx-scheduler-appointment-collector').eq(0);

    assert.ok($dropDown.hasClass('dx-scheduler-appointment-collector-compact'), 'class is ok');
});

QUnit.test('Appointments should be rendered correctly, Day view with intervalCount', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2015, 2, 16, 7), endDate: new Date(2015, 2, 16, 7, 30) },
        { text: 'Two', startDate: new Date(2015, 2, 16, 11), endDate: new Date(2015, 2, 16, 11, 30) },
        { text: 'Three', startDate: new Date(2015, 2, 18, 12), endDate: new Date(2015, 2, 18, 12, 30) },
        { text: 'Four', startDate: new Date(2015, 2, 18, 15), endDate: new Date(2015, 2, 18, 15, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 2, 16),
        dataSource: dataSource,
        views: [{
            type: 'day',
            name: 'Day',
            intervalCount: 3
        }],
        currentView: 'day'
    });

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
});

QUnit.test('Appointments should be rendered correctly, Week view with intervalCount', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2015, 4, 25, 7), endDate: new Date(2015, 4, 25, 7, 30) },
        { text: 'Two', startDate: new Date(2015, 5, 1, 11), endDate: new Date(2015, 5, 1, 11, 30) },
        { text: 'Three', startDate: new Date(2015, 5, 6, 12), endDate: new Date(2015, 5, 6, 12, 30) },
        { text: 'Four', startDate: new Date(2015, 5, 12, 15), endDate: new Date(2015, 5, 12, 15, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        dataSource: dataSource,
        views: [{
            type: 'week',
            name: 'week',
            intervalCount: 3
        }],
        currentView: 'week'
    });

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
});

QUnit.test('Appointments should be rendered correctly, Day view with intervalCount and startDate', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2017, 5, 25, 4), endDate: new Date(2017, 5, 25, 4, 30) },
        { text: 'Two', startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
        { text: 'Three', startDate: new Date(2017, 5, 27, 10), endDate: new Date(2017, 5, 27, 11) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
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

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
});

QUnit.test('Appointments should be rendered correctly, Week view with intervalCount and startDate', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2017, 5, 22, 4), endDate: new Date(2017, 5, 22, 4, 30) },
        { text: 'Two', startDate: new Date(2017, 5, 26, 0), endDate: new Date(2017, 5, 26, 0, 30) },
        { text: 'Three', startDate: new Date(2017, 6, 2, 10), endDate: new Date(2017, 6, 2, 11) },
        { text: 'Four', startDate: new Date(2017, 6, 9, 8), endDate: new Date(2017, 6, 9, 8, 30) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
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

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, 'Appointments were rendered correctly');
});

QUnit.test('Appointments should be rendered correctly after switching Day view with intervalCount and startDate', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2017, 5, 28, 4), endDate: new Date(2017, 5, 28, 4, 30) },
        { text: 'Two', startDate: new Date(2017, 5, 29, 0), endDate: new Date(2017, 5, 29, 0, 30) },
        { text: 'Three', startDate: new Date(2017, 5, 30, 10), endDate: new Date(2017, 5, 30, 11) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
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

    $(this.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
});

QUnit.test('Appointments should be rendered correctly after switching Week view with intervalCount and startDate', function(assert) {
    var tasks = [
        { text: 'One', startDate: new Date(2017, 6, 10, 4), endDate: new Date(2017, 6, 10, 4, 30) },
        { text: 'Two', startDate: new Date(2017, 6, 18, 0), endDate: new Date(2017, 6, 18, 0, 30) },
        { text: 'Three', startDate: new Date(2017, 6, 25, 10), endDate: new Date(2017, 6, 25, 11) }
    ];
    var dataSource = new DataSource({
        store: tasks
    });
    this.createInstance({
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

    $(this.instance.$element().find('.dx-scheduler-navigator-next')).trigger('dxclick');

    var $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 3, 'Appointments were rendered correctly');
});

QUnit.test('Appointment should have right width on mobile devices & desktop in week view', function(assert) {
    this.createInstance({
        dataSource: [{
            text: 'a',
            startDate: new Date(2018, 2, 13, 1),
            endDate: new Date(2018, 2, 13, 3)
        }],
        currentDate: new Date(2018, 2, 13),
        views: ['week'],
        currentView: 'week'
    });

    var expectedOffset = getOffset(),
        $appointments = this.instance.$element().find('.' + APPOINTMENT_CLASS),
        cellWidth = this.instance.$element().find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerWidth();

    assert.roughEqual($appointments.eq(0).outerWidth(), cellWidth - expectedOffset, 1.001, 'Width is OK');
});

QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Day', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointments are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().get(0).getBoundingClientRect().height;

    assert.equal($appointments.eq(0).position().top, 0, 'correct top position');
    assert.equal($appointments.eq(0).position().left, 200, 'correct left position');
    assert.equal($appointments.eq(1).position().top, cellHeight * 30, 'correct top position');
    assert.equal($appointments.eq(1).position().left, 200, 'correct left position');
});

QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointments is rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height,
        cellWidth = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().width;

    assert.equal($appointments.eq(0).position().top, 0, 'correct top position');
    assert.equal($appointments.eq(0).position().left, 200 + cellWidth * 5, 'correct left position');
    assert.equal($appointments.eq(1).position().top, cellHeight * 30, 'correct top position');
    assert.equal($appointments.eq(1).position().left, 200 + cellWidth * 5, 'correct left position');
});

QUnit.test('Appointments should be rendered correctly in vertical grouped workspace Week, showAllDayPanel = true', function(assert) {
    this.createInstance({
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
        width: 2000,
        maxAppointmentsPerCell: 'auto'
    });

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointments are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight();

    assert.roughEqual($appointments.eq(0).position().top, 7 * cellHeight, 1.5, 'correct top position of allDay appointment');
    assert.roughEqual($appointments.eq(0).outerHeight(), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
    assert.roughEqual(translator.locate($appointments.eq(0)).left, 456, 1.1, 'correct left position of allDay appointment');

    assert.roughEqual($appointments.eq(1).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
    assert.roughEqual($appointments.eq(1).position().left, 456, 1.1, 'correct left position of appointment');
});

QUnit.test('Rival allDay appointments from different groups should be rendered correctly in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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
        showAllDayPanel: true,
        maxAppointmentsPerCell: 'auto'
    });

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointments are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight();

    assert.roughEqual($appointments.eq(0).position().top, 0, 1.5, 'correct top position of allDay appointment');
    assert.roughEqual($appointments.eq(0).outerHeight(), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
    assert.equal(translator.locate($appointments.eq(0)).left, 314, 'correct left position of allDay appointment');

    assert.roughEqual($appointments.eq(1).position().top, 7 * cellHeight, 1.5, 'correct top position of allDay appointment');
    assert.roughEqual($appointments.eq(1).outerHeight(), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
    assert.equal(translator.locate($appointments.eq(1)).left, 314, 'correct left position of allDay appointment');
});

QUnit.test('Rival allDay appointments from same groups should be rendered correctly in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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
        showAllDayPanel: true,
        maxAppointmentsPerCell: 'auto'
    });

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight();

    assert.roughEqual($appointments.eq(0).position().top, 0.5 * cellHeight, 2.5, 'correct top position of allDay appointment');
    assert.roughEqual($appointments.eq(0).outerHeight(), 0.5 * cellHeight, 2, 'correct size of allDay appointment');
    assert.equal(translator.locate($appointments.eq(0)).left, 314, 'correct left position of allDay appointment');
});

QUnit.test('Rival appointments from one group should be rendered correctly in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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
        currentDate: new Date(2018, 4, 21),
        startDayHour: 9,
        endDayHour: 15,
        cellDuration: 60,
        showAllDayPanel: true,
        maxAppointmentsPerCell: null
    });

    var defaultWidthStub = sinon.stub(this.instance.getRenderingStrategyInstance(), '_getAppointmentMaxWidth').returns(50);

    this.instance.option('dataSource', [
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointments are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight();

    assert.roughEqual($appointments.eq(0).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
    assert.roughEqual($appointments.eq(0).outerWidth(), 50, 2, 'correct size of appointment');
    assert.equal($appointments.eq(0).position().left, 314, 'correct left position of appointment');

    assert.roughEqual($appointments.eq(1).position().top, 8.5 * cellHeight, 1.5, 'correct top position of appointment');
    assert.roughEqual($appointments.eq(1).outerWidth(), 50, 2, 'correct size of appointment');
    assert.equal($appointments.eq(1).position().left, 428, 'correct left position of appointment');

    defaultWidthStub.restore();
});

QUnit.test('Appointment in bottom cell should be rendered cirrectly in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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
        showAllDayPanel: true,
        maxAppointmentsPerCell: 'auto'
    });

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight();

    assert.roughEqual($appointments.eq(0).position().top, 12 * cellHeight, 1.5, 'correct top position of appointment');
    assert.roughEqual($appointments.eq(0).outerHeight(), 100, 2, 'correct size of appointment');
});

QUnit.test('Appointment should be dragged correctly between the groups in vertical grouped workspace Day', function(assert) {
    this.createInstance({
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

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

    $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(10).trigger(dragEvents.enter);
    pointerMock($appointment).start().down().move(10, 10).up();

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

    assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 1, 13), 'Start date is correct');
    assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 1, 13, 30), 'End date is correct');
    assert.deepEqual(appointmentData.id, 2, 'Group is OK');
});

QUnit.test('Appointment should be dragged correctly between the groups in vertical grouped workspace Week', function(assert) {
    this.createInstance({
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
        showAllDayPanel: false
    });

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

    $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(75).trigger(dragEvents.enter);
    pointerMock($appointment).start().down().move(10, 10).up();

    this.clock.tick();
    var appointmentData = dataUtils.data(this.instance.$element().find('.' + APPOINTMENT_CLASS).get(0), 'dxItemData');

    assert.deepEqual(appointmentData.startDate, new Date(2018, 2, 16, 13), 'Start date is correct');
    assert.deepEqual(appointmentData.endDate, new Date(2018, 2, 16, 13, 30), 'End date is correct');
    assert.deepEqual(appointmentData.id, 2, 'Group is OK');
});

QUnit.test('Hourly recurring appt should be rendred in vertical grouped workspace Day', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);

    assert.equal($appointments.length, 4, 'Appointments are rendered');
});

QUnit.test('Appt shouldn\'t be resized to the group border in horizontal grouped workspace Day', function(assert) {
    this.createInstance({
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

    var $element = $(this.instance.$element()),
        cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).get(0).getBoundingClientRect().height,
        pointer = pointerMock($element.find('.dx-resizable-handle-bottom').eq(0)).start();

    pointer.dragStart().drag(0, cellHeight * 2).dragEnd();

    var $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

    assert.equal($appointment.position().top + $appointment.outerHeight(), cellHeight * 8, 'Correct bottom coordinate');
});

QUnit.test('Appt shouldn\'t be resized to the group border after scrolling in horizontal grouped workspace Day', function(assert) {
    this.createInstance({
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

    var scrollable = this.instance.getWorkSpace().getScrollable();
    scrollable.scrollTo({ left: 0, top: 400 });

    var $element = $(this.instance.$element()),
        cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).eq(0).outerHeight(),
        pointer = pointerMock($element.find('.dx-resizable-handle-top').eq(0)).start();

    pointer.dragStart().drag(0, -cellHeight * 5).dragEnd();

    var $appointment = $element.find('.' + APPOINTMENT_CLASS).eq(0);

    assert.roughEqual($appointment.position().top, 500, 1.1, 'Correct top coordinate');
    assert.equal($appointment.outerHeight(), cellHeight * 6, 'Correct height');
});

QUnit.test('Appointment inside vertical grouped view should have a right resizable area in Day view', function(assert) {
    this.createInstance({
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

    var $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).first(),
        initialResizableAreaTop = $appointment.dxResizable('instance').option('area').top,
        initialResizableAreaBottom = $appointment.dxResizable('instance').option('area').bottom;

    assert.equal($appointment.dxResizable('instance').option('area').top, initialResizableAreaTop);
    assert.equal($appointment.dxResizable('instance').option('area').bottom, initialResizableAreaBottom);
});

QUnit.test('Appointment before startDayHour part should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointment parts are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight(),
        cellWidth = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        dateTableLeftOffset = 200;

    assert.roughEqual($appointments.eq(0).position().top, cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(0).outerHeight(), cellHeight * 2.5, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(0).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of  appointment part');

    assert.roughEqual($appointments.eq(1).position().top, cellHeight * 9, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 2.5, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(1).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of appointment part');
});

QUnit.test('Appointment after endDayHour part should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointment parts are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight(),
        cellWidth = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        dateTableLeftOffset = 200;

    assert.roughEqual($appointments.eq(0).position().top, cellHeight * 7, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(0).outerHeight(), cellHeight, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(0).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of  appointment part');

    assert.roughEqual($appointments.eq(1).position().top, cellHeight * 15, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(1).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of appointment part');
});

QUnit.test('Appointment starting on previous week should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointment parts are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight(),
        dateTableLeftOffset = 200;

    assert.roughEqual($appointments.eq(0).position().top, cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(0).outerHeight(), cellHeight * 2, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(0).position().left, dateTableLeftOffset, 1.1, 'correct left position of  appointment part');

    assert.roughEqual($appointments.eq(1).position().top, cellHeight * 9, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 2, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(1).position().left, dateTableLeftOffset, 1.1, 'correct left position of appointment part');
});

QUnit.test('Long appointments should be rendered correctly in vertical grouped workspace Week, first group, showAllDayPanel = true (T714290)', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointment parts are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight(),
        cellWidth = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        dateTableLeftOffset = 200;

    assert.roughEqual($appointments.eq(0).position().top, 7 * cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(0).outerHeight(), cellHeight, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(0).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of  appointment part');

    assert.roughEqual($appointments.eq(1).position().top, cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 2.5, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(1).position().left, cellWidth * 2 + dateTableLeftOffset, 1.1, 'correct left position of appointment part');
});

QUnit.test('Long appointments should be rendered correctly in vertical grouped workspace Week, second group, showAllDayPanel = true (T714290)', function(assert) {
    this.createInstance({
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

    var $appointments = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS);
    assert.equal($appointments.length, 2, 'two appointment parts are rendered');

    var cellHeight = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerHeight(),
        cellWidth = $(this.instance.$element()).find('.' + DATE_TABLE_CELL_CLASS).first().outerWidth(),
        dateTableLeftOffset = 200;

    assert.roughEqual($appointments.eq(0).position().top, 15 * cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(0).outerHeight(), cellHeight, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(0).position().left, cellWidth + dateTableLeftOffset, 1.1, 'correct left position of  appointment part');

    assert.roughEqual($appointments.eq(1).position().top, 9 * cellHeight, 1.5, 'correct top position of appointment part');
    assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 2.5, 2, 'correct size of appointment part');
    assert.roughEqual($appointments.eq(1).position().left, cellWidth * 2 + dateTableLeftOffset, 1.1, 'correct left position of appointment part');
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
    let scheduler = createInstance(options);

    const initialAppointmentHeight = scheduler.appointments.getAppointmentHeight(0);
    const recurrentAppointmentHeight = scheduler.appointments.getAppointmentHeight(1);
    assert.equal(initialAppointmentHeight, recurrentAppointmentHeight, 'Appointment cells have equal heights (both initial and recurrent)');
});
