import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import translator from 'animation/translator';

import SchedulerLayoutManager from 'ui/scheduler/ui.scheduler.appointments.layout_manager';
import BaseAppointmentsStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.base';
import VerticalAppointmentStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.vertical';
import HorizontalAppointmentsStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal';
import HorizontalMonthLineAppointmentsStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month_line';
import Color from 'color';
import dataUtils from 'core/element_data';
import devices from 'core/devices';
import CustomStore from 'data/custom_store';
import { SchedulerTestWrapper } from './helpers.js';

const APPOINTMENT_DEFAULT_OFFSET = 25;
const APPOINTMENT_MOBILE_OFFSET = 50;

const getOffset = () => {
    if(devices.current().deviceType !== 'desktop') {
        return APPOINTMENT_MOBILE_OFFSET;
    } else {
        return APPOINTMENT_DEFAULT_OFFSET;
    }
};

const checkAppointmentUpdatedCallbackArgs = (assert, actual, expected) => {
    assert.deepEqual(actual.old, expected.old, 'Old data is OK');
    assert.deepEqual(actual.updated, expected.updated, 'New data is OK');
    assert.deepEqual(actual.$appointment.get(0), expected.$appointment.get(0), 'Appointment element is OK');
};

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

const moduleOptions = {
    beforeEach: function() {
        this.createInstance = options => {
            this.instance = $('#scheduler').dxScheduler($.extend(options, { editing: true, maxAppointmentsPerCell: null })).dxScheduler('instance');
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
    },
    afterEach: function() {
    }
};

QUnit.module('LayoutManager', moduleOptions);

QUnit.test('LayoutManager should be initialized', function(assert) {
    this.createInstance();
    assert.ok(this.instance.getLayoutManager() instanceof SchedulerLayoutManager, 'SchedulerLayoutManager was initialized');
});

QUnit.test('RenderingStrategy should be initialized', function(assert) {
    this.createInstance();
    assert.ok(this.instance.getLayoutManager().getRenderingStrategyInstance() instanceof BaseAppointmentsStrategy, 'SchedulerLayoutManager was initialized');
});

QUnit.test('Scheduler should have a right rendering strategy for timeline views', function(assert) {
    this.createInstance({
        views: ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'],
        currentView: 'timelineDay'
    });

    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, 'Strategy is OK');

    this.instance.option('currentView', 'timelineWeek');
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, 'Strategy is OK');

    this.instance.option('currentView', 'timelineWorkWeek');
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, 'Strategy is OK');

    this.instance.option('currentView', 'timelineMonth');
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalMonthLineAppointmentsStrategy, 'Strategy is OK');
});

QUnit.test('Scheduler should have a right rendering strategy for views with config', function(assert) {
    this.createInstance({
        views: [ {
            name: 'MonthView',
            type: 'month'
        }, {
            name: 'WeekView',
            type: 'week'
        }],
        currentView: 'WeekView'
    });

    assert.ok(this.instance.getRenderingStrategyInstance() instanceof VerticalAppointmentStrategy, 'Strategy is OK');

    this.instance.option('currentView', 'MonthView');
    assert.ok(this.instance.getRenderingStrategyInstance() instanceof HorizontalAppointmentsStrategy, 'Strategy is OK');
});

QUnit.module('Appointments', moduleOptions);

QUnit.test('Exception should be thrown if appointment has no start date', function(assert) {
    this.createInstance();

    const layoutManager = this.instance.getLayoutManager();

    assert.throws(
        function() {
            layoutManager.createAppointmentsMap([{
                text: 'Appointment 1'
            }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        'Exception messages should be correct'
    );
});

QUnit.test('Exception should be thrown if appointment has a broken start date', function(assert) {
    this.createInstance();

    const layoutManager = this.instance.getLayoutManager();

    assert.throws(
        function() {
            layoutManager.createAppointmentsMap([{
                text: 'Appointment 1', startDate: 'Invalid date format'
            }]);
        },
        function(e) {
            return /E1032/.test(e.message);
        },
        'Exception messages should be correct'
    );
});

QUnit.test('Default appointment duration should be equal to 30 minutes', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [{ text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8) }]
    });

    assert.deepEqual(this.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 8, 30), 'End date of appointment is 30 minutes');
});

QUnit.test('Appointment duration should be equal to 30 minutes if end date lower than start date', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [
            { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 7) }
        ]
    });

    assert.deepEqual(this.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 8, 30), 'End date is correct');
});

QUnit.test('Appointment duration should not change if end date equal to start date', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [
            { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 8) },
        ]
    });

    assert.deepEqual(this.instance.option('dataSource')[0].endDate, new Date(2015, 1, 9, 8, 0), 'End date is correct');
});

QUnit.test('AllDay appointment without endDate shoud be rendered correctly', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 1, 9),
        dataSource: [
            { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), AllDay: true }
        ],
        currentView: 'week',
        allDayExpr: 'AllDay',
        views: ['week']
    });

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.length, 1, 'AllDay appointment was rendered');
});

QUnit.test('Appointment should have right default height', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2016, 2, 1),
            dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.outerHeight(), 100, 'Appointment has a right height');
});

QUnit.test('Appointment should have a correct height when dates are defined as not Date objects', function(assert) {
    this.createInstance(
        {
            currentDate: 1423458000000,
            dataSource: [{ text: 'Appointment 1', startDate: 1423458000000, endDate: 1423461600000 }]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.outerHeight(), 100, 'Appointment has a right height');
});

QUnit.test('Appointment should have a correct min height', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 8, 1)
                }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.outerHeight(), 4, 'Appointment has a right height');
});

QUnit.test('Appointment should have a correct min width', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 8, 1, 1),
                    endDate: new Date(2015, 1, 9, 8, 1, 2)
                }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.outerWidth(), 5, 'Appointment has a right width');
});

QUnit.test('Long appointment tail should have a correct min height', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9, 8),
            views: ['week'],
            currentView: 'week',
            dataSource: [
                {
                    startDate: new Date(2015, 1, 9, 23, 0),
                    endDate: new Date(2015, 1, 10, 0, 0, 53)
                }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(1);

    assert.equal($appointment.outerHeight(), 4, 'Appointment-tail has a right height');
});

QUnit.test('Appointment has right sortedIndex', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 9, 16),
            currentView: 'month',
            focusStateEnabled: true,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
                { text: 'Appointment 2', startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
                { text: 'Appointment 3', startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
                { text: 'Appointment 4', startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }
            ]
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal(dataUtils.data($appointments.get(0), 'dxAppointmentSettings').sortedIndex, 0, 'app has right sortedIndex');
    assert.equal(dataUtils.data($appointments.get(1), 'dxAppointmentSettings').sortedIndex, 1, 'app has right sortedIndex');
    assert.equal(dataUtils.data($appointments.get(2), 'dxAppointmentSettings').sortedIndex, 2, 'app has right sortedIndex');
    assert.equal(dataUtils.data($appointments.get(3), 'dxAppointmentSettings').sortedIndex, 3, 'app has right sortedIndex');
});

// NOTE: check sortedIndex for long appt parts
QUnit.test('Compact parts of long appointment shouldn\'t have sortedIndex', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4, 2),
            focusStateEnabled: true,
            views: ['month'],
            currentView: 'month',
            height: 500,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 3), allDay: true },
                { text: 'Appointment 2', startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 5, 12), allDay: true },
                { text: 'Appointment 3', startDate: new Date(2015, 2, 4, 2), endDate: new Date(2015, 2, 8, 2), allDay: true }
            ]
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal(dataUtils.data($appointments.get(0), 'dxAppointmentSettings').sortedIndex, 0, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(1), 'dxAppointmentSettings').sortedIndex, 1, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(2), 'dxAppointmentSettings').sortedIndex, 2, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(3), 'dxAppointmentSettings').sortedIndex, null, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(4), 'dxAppointmentSettings').sortedIndex, null, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(5), 'dxAppointmentSettings').sortedIndex, null, 'app has sortedIndex');
    assert.equal(dataUtils.data($appointments.get(6), 'dxAppointmentSettings').sortedIndex, 3, 'app has sortedIndex');
});

QUnit.test('AllDay appointment should be displayed right when endDate > startDate and duration < 24', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 5),
            currentView: 'week',
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 2, 5, 10), endDate: new Date(2015, 2, 6, 6), allDay: true }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $allDayCell = $(this.instance.$element().find('.dx-scheduler-all-day-table-cell'));

    assert.roughEqual($appointment.eq(0).outerWidth(), $allDayCell.eq(0).outerWidth() * 2, 1.001, 'appointment has right width');
});

QUnit.test('Two rival appointments should have correct positions', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) },
                { text: 'Appointment 1', startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));

    assert.equal($appointment.length, 2, 'All appointments are rendered');

    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal(firstAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), 1.1, 'appointment has a right size');

    assert.equal(secondAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), $tableCell.outerWidth(), 1.1, 'appointment has a right size');
});

QUnit.test('Collapsing appointments should have specific class', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 600,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 12) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 12) },
                { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 11), endDate: new Date(2015, 1, 9, 12) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.ok(!$appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    assert.ok(!$appointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    assert.ok($appointment.eq(2).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
});

QUnit.test('Four rival appointments should have correct positions', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 12) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 1, 9), endDate: new Date(2015, 1, 1, 12) },
                { text: 'Appointment 3', startDate: new Date(2015, 1, 1, 11), endDate: new Date(2015, 1, 1, 12) },
                { text: 'Appointment 4', startDate: new Date(2015, 1, 1, 10), endDate: new Date(2015, 1, 1, 12) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));
    const thirdAppointmentPosition = translator.locate($appointment.eq(2));
    const fourthAppointmentPosition = translator.locate($appointment.eq(3));

    assert.equal($appointment.length, 4, 'All appointments are rendered');

    assert.equal(firstAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), 1.1, 'appointment has a right size');

    assert.equal(secondAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), $tableCell.outerWidth(), 1.1, 'appointment has a right size');

    assert.roughEqual(thirdAppointmentPosition.left, 21, 1.5, 'appointment is rendered in right place');
    assert.roughEqual(thirdAppointmentPosition.top, 3, 1.5, 'appointment is rendered in right place');
    assert.equal($appointment.eq(2).outerHeight(), 15, 'appointment has a right size');
    assert.equal($appointment.eq(2).outerWidth(), 15, 'appointment has a right size');
    assert.roughEqual(fourthAppointmentPosition.left, 3, 1, 'appointment is rendered in right place');
    assert.roughEqual(fourthAppointmentPosition.top, 3, 1.5, 'appointment is rendered in right place');
    assert.equal($appointment.eq(3).outerHeight(), 15, 'appointment has a right size');
    assert.equal($appointment.eq(3).outerWidth(), 15, 'appointment has a right size');
});

QUnit.test('Rival duplicated appointments should have correct positions', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 1, 10) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 1, 8), endDate: new Date(2015, 1, 2, 9) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal($appointment.length, 2, 'All appointments are rendered');

    assert.equal(firstAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.top, 26, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), $tableCell.outerWidth(), 1.1, 'appointment has a right size');

    assert.equal(secondAppointmentPosition.left, 0, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.top, 46, 1.5, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), $tableCell.outerWidth() * 2, 1.5, 'appointment has a right size');
});

QUnit.test('More than 3 small appointments should be grouped', function(assert) {
    const items = [];
    let i = 8;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            width: 600,
            dataSource: items
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointments.length, 2, 'Small appointments are grouped');
});

QUnit.test('Appointments should be rendered without errors (T816873)', function(assert) {
    this.createInstance(
        {
            dataSource: [
                {
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T130000',
                    recurrenceException: '',
                    startDate: '2019-09-19T18:00:00.000Z',
                    endDate: '2019-09-19T18:04:00.000Z'
                },
                {
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T050000',
                    recurrenceException: '',
                    startDate: '2019-09-20T10:00:00.000Z',
                    endDate: '2019-09-20T04:59:59.000Z'
                },
                {
                    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20190930T045900',
                    recurrenceException: '',
                    startDate: '2019-09-20T09:59:00.000Z',
                    endDate: '2019-09-20T10:00:00.000Z'
                }
            ],
            currentView: 'week',
            currentDate: new Date(2019, 8, 22),
            views: [{
                type: 'week',
                cellDuration: 120,
                maxAppointmentsPerCell: 'unlimited'
            }]
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.equal($appointments.length, 15, 'appointments should be rendered without errors');
});

QUnit.module('Horizontal Month Line Strategy', moduleOptions);

QUnit.test('Start date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 3, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: 'timelineMonth',
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-200, 0).dragEnd();
    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 6, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: 'timelineMonth',
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed when resize is finished, RTL mode', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 6, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: 'timelineMonth',
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );
    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Start date of appointment should be changed when resize is finished, RTL mode', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 3, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            currentView: 'timelineMonth',
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.module('Horizontal Month Strategy', {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
        this.clock.restore();
    }
});

QUnit.test('Start date of the long-time reduced appointment should be changed correctly when resize is finished', function(assert) {
    const items = [{
        text: 'Appointment 1',
        startDate: new Date(2015, 2, 11, 0),
        endDate: new Date(2015, 2, 23, 0)
    }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 15),
            currentView: 'month',
            height: 500,
            dataSource: items
        }
    );

    const updatedItem = $.extend({}, items[0], { startDate: new Date(2015, 2, 10, 0) });
    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-80, 0).dragEnd();

    const args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: items[0],
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('More than 3 cloned appointments should be grouped', function(assert) {
    const items = [];
    let i = 10;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.equal($appointment.length, 2, 'Cloned appointments are grouped');

    this.scheduler.appointments.compact.click();
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '8 more', 'DropDown menu has correct text');
    assert.roughEqual(this.scheduler.appointments.compact.getButton().outerWidth(), 106, 1.001, 'DropDownMenu button width is OK');
    assert.equal(this.scheduler.tooltip.getItemCount(), 8, 'DropDown menu has correct items');
});

QUnit.test('Grouped appointments schould have correct colors', function(assert) {
    const items = [];
    let i = 2;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 1 });
        i--;
    }
    i = 10;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9, 3), endDate: new Date(2015, 1, 9, 4), roomId: 2 });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: items,
            resources: [
                {
                    field: 'roomId',
                    allowMultiple: true,
                    dataSource: [
                        { id: 1, text: 'Room 1', color: '#ff0000' },
                        { id: 2, text: 'Room 2', color: '#0000ff' }
                    ]
                }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.equal($appointment.length, 2, 'Cloned appointments are grouped');

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector');

    assert.equal(new Color($dropDownMenu.css('backgroundColor')).toHex(), '#0000ff', 'ddAppointment is rendered');
});

QUnit.test('Grouped appointments schould have correct colors when resourses store is asynchronous', function(assert) {
    const items = [];
    let i = 2;

    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1), roomId: 1 });
        i--;
    }
    i = 10;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9, 3), endDate: new Date(2015, 1, 9, 4), roomId: 2 });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            dataSource: items,
            resources: [
                {
                    field: 'roomId',
                    allowMultiple: true,
                    dataSource: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([
                                    { id: 1, text: 'Room 1', color: '#ff0000' },
                                    { id: 2, text: 'Room 2', color: '#0000ff' }
                                ]);
                            }, 300);

                            return d.promise();
                        }
                    })
                }
            ]
        }
    );

    this.clock.tick(300);
    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.equal($appointment.length, 2, 'Cloned appointments are grouped');

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector');
    this.clock.tick(300);
    assert.equal(new Color($dropDownMenu.css('backgroundColor')).toHex(), '#0000ff', 'ddAppointment is rendered');
});

QUnit.test('Grouped appointments should be reinitialized if datasource is changed', function(assert) {
    const items = [];
    let i = 7;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            height: 500,
            width: 600,
            dataSource: items
        }
    );
    items.push({ text: 'a', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 1) });
    this.instance.option('dataSource', items);
    const $dropDownMenu = $(this.instance.$element().find('.dx-scheduler-appointment-collector'));

    assert.equal($dropDownMenu.length, 1, 'DropDown appointments are refreshed');
});

QUnit.test('Parts of long compact appt should have right positions', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 5, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 5, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 12, 0), endDate: new Date(2015, 2, 7, 2, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    const gap = 3;

    for(let i = 2; i < $appointment.length; i++) {
        const appointmentPosition = translator.locate($appointment.eq(i));

        assert.deepEqual($appointment.eq(i).outerWidth(), 15, 'appointment has a right size');
        assert.roughEqual(appointmentPosition.top, gap, 1.5, 'part has right position');
        assert.roughEqual(appointmentPosition.left, gap + 3 * tableCellWidth + tableCellWidth * (i - 2), 3, 'part has right position');
    }
});

QUnit.module('Horizontal Strategy', moduleOptions);

QUnit.test('Start date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 1, 1), endDate: new Date(2015, 1, 2, 0) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 1, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 1),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Start date of the long-time reduced appointment should be changed correctly when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 2, 15, 2), endDate: new Date(2015, 2, 23, 0) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 2, 15, 0) });

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 15),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-800, 0).dragEnd();

    const args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 5, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed when resize is finished, RTL mode', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 0), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 5, 0, 30) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-200, 0).dragEnd();

    const args = stub.getCall(0).args;
    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Start date of appointment should be changed when resize is finished, RTL mode', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 4, 10), endDate: new Date(2015, 1, 5, 0) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 4, 9, 30) });
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 4),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            rtlEnabled: true,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();

    pointer.dragStart().drag(200, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed considering endDayHour and startDayHour when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 18), endDate: new Date(2015, 1, 9, 19) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 10, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();

    pointer.dragStart().drag(1200, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.deepEqual(args[0], 'updateAppointmentAfterResize', 'Correct method of observer is called');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Start date of appointment should be changed considering endDayHour and startDayHour when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 8, 19) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();
    pointer.dragStart().drag(-800, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.deepEqual(args[0], 'updateAppointmentAfterResize', 'Correct method of observer is called');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Start date of long multiday appointment should be changed considering endDayHour and startDayHour when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 7, 18) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left')).start();
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    const cellsCount = 15 * 2;

    pointer.dragStart().drag(-cellsCount * tableCellWidth, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.deepEqual(args[0], 'updateAppointmentAfterResize', 'Correct method of observer is called');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of long multiday appointment should be changed considering endDayHour and startDayHour when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 18), endDate: new Date(2015, 1, 9, 19) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 11, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            startDayHour: 8,
            endDayHour: 20,
            height: 500,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right')).start();
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    const cellsCount = 15 * 2;

    pointer.dragStart().drag(cellsCount * tableCellWidth, 0).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.deepEqual(args[0], 'updateAppointmentAfterResize', 'Correct method of observer is called');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Four rival appointments should have correct positions', function(assert) {
    const items = [{ text: 'Appointment 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 4', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'timelineDay',
            maxAppointmentsPerCell: null,
            height: 500,
            dataSource: items,
            startDayHour: 1
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.equal($appointment.length, 4, 'All appointments are rendered');

    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, 'appointment is rendered in right place');

    assert.roughEqual(translator.locate($appointment.eq(1)).top, $appointment.eq(0).outerHeight(), 1, 'appointment is rendered in right place');
    assert.equal(translator.locate($appointment.eq(1)).left, 0, 'appointment is rendered in right place');

    assert.roughEqual(translator.locate($appointment.eq(2)).top, 2 * $appointment.eq(0).outerHeight(), 1, 'appointment is rendered in right place');
    assert.equal(translator.locate($appointment.eq(2)).left, 0, 'appointment is rendered in right place');

    assert.roughEqual(translator.locate($appointment.eq(3)).top, 3 * $appointment.eq(0).outerHeight(), 1, 'appointment is rendered in right place');
    assert.equal(translator.locate($appointment.eq(3)).left, 0, 'appointment is rendered in right place');
});

QUnit.test('Four rival appointments should have correct sizes', function(assert) {
    const items = [{ text: 'Appointment 1', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) },
        { text: 'Appointment 4', startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'timelineDay',
            height: 530,
            dataSource: items,
            startDayHour: 1
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth() * 2;

    assert.equal($appointment.eq(0).outerWidth(), tableCellWidth, 'appointment has a right size');
    assert.equal($appointment.eq(0).outerHeight(), 100, 'appointment has a right size');

    assert.equal($appointment.eq(1).outerWidth(), tableCellWidth, 'appointment has a right size');
    assert.equal($appointment.eq(1).outerHeight(), 100, 'appointment has a right size');

    assert.equal($appointment.eq(2).outerWidth(), tableCellWidth, 'appointment has a right size');
    assert.equal($appointment.eq(2).outerHeight(), 100, 'appointment has a right size');

    assert.equal($appointment.eq(3).outerWidth(), tableCellWidth, 'appointment has a right size');
    assert.equal($appointment.eq(3).outerHeight(), 100, 'appointment has a right size');
});

QUnit.test('Recurrence appointment should be rendered correctly on timelineWeek (T701534)', function(assert) {
    const items = [{
        allDay: false,
        endDate: new Date(2018, 11, 12, 2),
        RecurrenceRule: 'FREQ=DAILY;COUNT=2',
        startDate: new Date(2018, 11, 11, 2)
    }];

    this.createInstance(
        {
            currentDate: new Date(2018, 11, 10),
            currentView: 'timelineWeek',
            height: 530,
            dataSource: items,
            startDayHour: 1,
            cellDuration: 1440,
            recurrenceRuleExpr: 'RecurrenceRule'
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointment.length, 2, 'appointments are rendered correctly');
});

QUnit.module('Vertical Strategy', moduleOptions);

QUnit.test('AllDay recurrent appointments count should be correct if recurrenceException is set', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2016, 6, 25),
            currentView: 'week',
            height: 900,
            width: 900,
            dataSource: [
                {
                    text: 'SERIES - 1',
                    startDate: new Date(2016, 6, 25, 14, 14),
                    endDate: new Date(2016, 6, 25, 14, 14),
                    allDay: true,
                    recurrenceRule: 'FREQ=DAILY',
                    recurrenceException: '20160728T141400, 20160729T141400'
                }
            ]
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.equal($appointments.length, 4, 'Appointments count is OK');
});

QUnit.test('Four rival all day appointments should have correct sizes', function(assert) {
    const items = [{ text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10), allDay: true },
        { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10), allDay: true },
        { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12), allDay: true },
        { text: 'Appointment 4', startDate: new Date(2015, 1, 9, 12), endDate: new Date(2015, 1, 9, 14), allDay: true }];

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'day',
            height: 900,
            width: 900,
            dataSource: items
        }
    );

    const $appointments = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));

    assert.equal($appointments.length, 4, 'All appointments are rendered');

    assert.roughEqual($appointments.eq(0).outerWidth(), 798, 1.1, 'appointment has a right width');
    assert.roughEqual($appointments.eq(0).outerHeight(), 24, 2, 'appointment has a right height');

    assert.roughEqual($appointments.eq(1).outerWidth(), 798, 1.1, 'appointment has a right width');
    assert.roughEqual($appointments.eq(1).outerHeight(), 24, 2, 'appointment has a right height');

    assert.roughEqual($appointments.eq(2).outerWidth(), 15, 1.1, 'appointment has a right width');
    assert.roughEqual($appointments.eq(2).outerHeight(), 15, 1.1, 'appointment has a right height');

    assert.roughEqual($appointments.eq(3).outerWidth(), 15, 1.1, 'appointment has a right width');
    assert.roughEqual($appointments.eq(3).outerHeight(), 15, 1.1, 'appointment has a right height');
});

QUnit.test('Dates of allDay appointment should be changed when resize is finished, week view RTL mode', function(assert) {
    const item = {
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 10),
        allDay: true
    };
    const updatedItem = $.extend({}, item, {
        endDate: new Date(2015, 1, 10, 10)
    });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            rtlEnabled: true,
            height: 900,
            width: 900,
            dataSource: [item]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock($appointment.find('.dx-resizable-handle-left')).start();

    pointer.dragStart().drag(-100, 0).dragEnd();

    const args = stub.getCall(0).args;

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-all-day-appointment')
    });
});

QUnit.test('Start date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };
    const updatedItem = $.extend({}, item, { startDate: new Date(2015, 1, 9, 7) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'day',
            height: 530,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');
    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-top')).start();
    pointer.dragStart().drag(0, -80).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('End date of appointment should be changed when resize is finished', function(assert) {
    const item = { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) };
    const updatedItem = $.extend({}, item, { endDate: new Date(2015, 1, 9, 10) });

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'day',
            height: 530,
            dataSource: [item]
        }
    );

    const stub = sinon.stub(this.instance.getAppointmentsInstance(), 'notifyObserver').withArgs('updateAppointmentAfterResize');

    const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom')).start();
    pointer.dragStart().drag(0, 80).dragEnd();

    const args = stub.getCall(0).args;

    assert.ok(stub.calledOnce, 'Observer is notified');
    assert.deepEqual(args[0], 'updateAppointmentAfterResize', 'Correct method of observer is called');

    checkAppointmentUpdatedCallbackArgs(assert, {
        old: args[1].target,
        updated: args[1].data,
        $appointment: args[1].$appointment
    }, {
        old: item,
        updated: updatedItem,
        $appointment: this.instance.$element().find('.dx-scheduler-appointment')
    });
});

QUnit.test('Two rival appointments should have correct positions, vertical strategy', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            startDayHour: 8,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellHeight = $tableCell.get(0).getBoundingClientRect().height;
    const cellWidth = $tableCell.get(0).getBoundingClientRect().width;
    const offset = getOffset();

    assert.equal($appointment.length, 2, 'All appointments are rendered');

    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal(firstAppointmentPosition.top, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');
});

QUnit.test('Three rival appointments with two columns should have correct positions, vertical strategy', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            startDayHour: 8,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 9) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellHeight = $tableCell.get(0).getBoundingClientRect().height;
    const cellWidth = $tableCell.get(0).getBoundingClientRect().width;
    const offset = getOffset();
    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));
    const thirdAppointmentPosition = translator.locate($appointment.eq(2));

    assert.equal($appointment.length, 3, 'All appointments are rendered');
    assert.equal(firstAppointmentPosition.top, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.left, cellWidth + 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');

    assert.equal(secondAppointmentPosition.top, 2 * cellHeight, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');

    assert.equal(thirdAppointmentPosition.top, 0, 'appointment is rendered in right place');
    assert.roughEqual(thirdAppointmentPosition.left, cellWidth + $appointment.eq(0).outerWidth() + 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');
});

QUnit.test('Four rival appointments with three columns should have correct positions, vertical strategy', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 11) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 9, 9), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 3', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 4', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 12) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellHeight = $tableCell.get(0).getBoundingClientRect().height;
    const cellWidth = $tableCell.get(0).getBoundingClientRect().width;
    const offset = getOffset();
    const expectedAppWidth = (cellWidth - offset) / 3;

    assert.equal($appointment.length, 4, 'All appointments are rendered');

    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: cellWidth + 100 }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), expectedAppWidth, 1, 'appointment has a right size');

    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 2 * cellHeight, left: cellWidth + 100 + 2 * expectedAppWidth }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), expectedAppWidth, 1, 'appointment has a right size');

    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 0, left: cellWidth + 100 + expectedAppWidth }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(2).outerWidth(), expectedAppWidth, 1, 'appointment has a right size');

    assert.deepEqual(translator.locate($appointment.eq(3)), { top: 4 * cellHeight, left: cellWidth + 100 + expectedAppWidth }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(3).outerWidth(), expectedAppWidth, 1, 'appointment has a right size');
});

QUnit.test('Rival duplicated appointments should have correct positions', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9, 8), endDate: new Date(2015, 1, 9, 10) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) },
                { text: 'Appointment 3', startDate: new Date(2015, 1, 10, 8), endDate: new Date(2015, 1, 10, 9) }
            ]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const $tableCell = $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
    const cellWidth = $tableCell.outerWidth();
    const offset = getOffset();

    assert.equal($appointment.length, 3, 'All appointments are rendered');
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: cellWidth + 100 }, 'appointment is rendered in right place');
    assert.equal($appointment.eq(0).outerWidth(), cellWidth - offset, 'appointment has a right size');

    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 0, left: 2 * cellWidth + 100 }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');

    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 0, left: 2 * cellWidth + 100 + (cellWidth - offset) / 2 }, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(2).outerWidth(), (cellWidth - offset) / 2, 1, 'appointment has a right size');
});

QUnit.test('More than 3 all-day appointments should be grouped', function(assert) {
    const items = [];
    let i = 12;
    while(i > 0) {
        items.push({ text: i, startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10), allDay: true });
        i--;
    }

    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            width: 900,
            dataSource: items
        }
    );

    const $appointment = $('.dx-scheduler-all-day-appointments').find('.dx-scheduler-appointment');

    assert.equal($appointment.length, 2, 'Small appointments are grouped');
});

QUnit.test('Two rival all day appointments should have correct sizes and positions, vertical strategy', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 8), allDay: true, endDate: new Date(2015, 2, 8) },
                { text: 'Appointment 2', startDate: new Date(2015, 1, 8), endDate: new Date(2015, 2, 8), allDay: true }
            ]
        }
    );

    const $appointment = $('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');
    const firstAppointmentPosition = translator.locate($appointment.eq(0));
    const secondAppointmentPosition = translator.locate($appointment.eq(1));

    assert.equal($appointment.length, 2, 'All appointments are rendered');

    assert.equal(firstAppointmentPosition.top, 0, 'appointment is rendered in right place');
    assert.roughEqual(firstAppointmentPosition.left, 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(0).outerWidth(), 798, 1.1, 'appointment has a right width');
    assert.roughEqual($appointment.eq(0).outerHeight(), 37, 1.1, 'appointment has a right height');

    assert.roughEqual(secondAppointmentPosition.top, 37, 1, 'appointment is rendered in right place');
    assert.roughEqual(secondAppointmentPosition.left, 100, 1, 'appointment is rendered in right place');
    assert.roughEqual($appointment.eq(1).outerWidth(), 798, 1.1, 'appointment has a right width');
    assert.roughEqual($appointment.eq(1).outerHeight(), 37, 1.1, 'appointment has a right height');
});

QUnit.test('All day appointments should have correct left position, vertical strategy, rtl mode', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            height: 500,
            width: 900,
            startDayHour: 8,
            rtlEnabled: true,
            dataSource: [
                { text: 'Appointment 1', startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 13), allDay: true }
            ]
        }
    );

    const $appointment = $('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');
    const $allDayCell = $(this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0));
    const appointmentPosition = translator.locate($appointment.eq(0));

    assert.equal($appointment.length, 1, 'Appointment was rendered');
    assert.roughEqual(appointmentPosition.left, $allDayCell.outerWidth() * 2, 2, 'Appointment left coordinate has been adjusted ');
});

QUnit.test('Parts of long compact appt should have right positions', function(assert) {
    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            height: 500,
            width: 900,
            startDayHour: 8,
            dataSource: [
                { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
                { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
                { text: 'Task 4', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 8, 2, 0), allDay: true }]
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const gap = 3;
    const cellBorderOffset = 1;
    const cellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();

    for(let i = 2; i < $appointment.length; i++) {
        const appointmentPosition = translator.locate($appointment.eq(i));

        assert.equal($appointment.eq(i).outerWidth(), 15, 'appointment has a right size');
        assert.equal(appointmentPosition.top, gap, 'Appointment top is OK');
        assert.roughEqual(appointmentPosition.left, (cellBorderOffset + cellWidth) * (i + 1) + 100, 3, 'Appointment left is OK');
    }
});

QUnit.module('Appointments Keyboard Navigation', {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
        this.clock.restore();
    }
});

QUnit.test('Focus shouldn\'t be prevent when last appointment is reached', function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: 'month',
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: 'Appointment 1', startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
            { text: 'Appointment 2', startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
            { text: 'Appointment 3', startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
            { text: 'Appointment 4', startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }]
    });

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));
    $($appointments.eq(3)).trigger('focusin');
    this.clock.tick();

    const keyboard = keyboardMock($appointments.eq(3));

    $(this.instance.$element()).on('keydown', function(e) {
        assert.notOk(e.isDefaultPrevented(), 'default tab isn\'t prevented');
    });

    keyboard.keyDown('tab');

    $($appointments).off('keydown');
});

QUnit.testInActiveWindow('Apps should be focused in right order', function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: 'week',
        startDayHour: 8,
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: 'Appointment 1', startDate: new Date(2015, 9, 11, 9), endDate: new Date(2015, 9, 11, 11) },
            { text: 'Appointment 2', startDate: new Date(2015, 9, 12, 8), endDate: new Date(2015, 9, 12, 10) },
            { text: 'Appointment 3', startDate: new Date(2015, 9, 13, 8), endDate: new Date(2015, 9, 13, 10) },
            { text: 'Appointment 4', startDate: new Date(2015, 9, 14, 8), endDate: new Date(2015, 9, 14, 10) }]
    });

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const apptInstance = this.instance.getAppointmentsInstance();

    $($appointments.eq(0)).trigger('focusin');
    this.clock.tick();

    const keyboard = keyboardMock($appointments.eq(0));
    keyboard.keyDown('tab');
    assert.deepEqual($appointments.get(1), $(apptInstance.option('focusedElement')).get(0), 'app 1 in focus');

    keyboard.keyDown('tab');
    assert.deepEqual($appointments.get(2), $(apptInstance.option('focusedElement')).get(0), 'app 0 in focus');

    keyboard.keyDown('tab');
    assert.deepEqual($appointments.get(3), $(apptInstance.option('focusedElement')).get(0), 'app 3 in focus');
});

QUnit.testInActiveWindow('Apps should be focused in right order on month view with ddAppointments', function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: 'month',
        views: [{
            type: 'month',
            name: 'MONTH',
            maxAppointmentsPerCell: 'auto'
        }],
        height: 600,
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: 'Appointment 1', startDate: new Date(2015, 9, 11, 9), endDate: new Date(2015, 9, 11, 11) },
            { text: 'Appointment 2', startDate: new Date(2015, 9, 11, 8), endDate: new Date(2015, 9, 11, 10) },
            { text: 'Appointment 3', startDate: new Date(2015, 9, 11, 8), endDate: new Date(2015, 9, 11, 10) },
            { text: 'Appointment 4', startDate: new Date(2015, 9, 12, 8), endDate: new Date(2015, 9, 12, 10) }]
    });

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const apptInstance = this.instance.getAppointmentsInstance();

    $($appointments.eq(0)).trigger('focusin');
    this.clock.tick();

    const keyboard = keyboardMock($appointments.eq(0));
    keyboard.keyDown('tab');
    assert.deepEqual($appointments.get(1), $(apptInstance.option('focusedElement')).get(0), 'app 1 in focus');

    keyboard.keyDown('tab');
    assert.deepEqual($appointments.get(2), $(apptInstance.option('focusedElement')).get(0), 'app 0 in focus');
});

QUnit.testInActiveWindow('Apps should be focused in back order while press shift+tab', function(assert) {
    this.createInstance({
        focusStateEnabled: true,
        currentView: 'month',
        currentDate: new Date(2015, 9, 16),
        dataSource: [{ text: 'Appointment 1', startDate: new Date(2015, 9, 16, 9), endDate: new Date(2015, 9, 16, 11) },
            { text: 'Appointment 2', startDate: new Date(2015, 9, 17, 8), endDate: new Date(2015, 9, 17, 10) },
            { text: 'Appointment 3', startDate: new Date(2015, 9, 18, 8), endDate: new Date(2015, 9, 18, 10) },
            { text: 'Appointment 4', startDate: new Date(2015, 9, 19, 8), endDate: new Date(2015, 9, 19, 10) }]
    });

    const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const apptInstance = this.instance.getAppointmentsInstance();
    const keyboard = keyboardMock($appointments.eq(0));

    $($appointments.eq(3)).trigger('focusin');
    this.clock.tick();

    keyboard.keyDown('tab', { shiftKey: true });
    assert.deepEqual($appointments.get(2), $(apptInstance.option('focusedElement')).get(0), 'app 1 in focus');

    keyboard.keyDown('tab', { shiftKey: true });
    assert.deepEqual($appointments.get(1), $(apptInstance.option('focusedElement')).get(0), 'app 1 in focus');

    keyboard.keyDown('tab', { shiftKey: true });
    assert.deepEqual($appointments.get(0), $(apptInstance.option('focusedElement')).get(0), 'app 1 in focus');
});

QUnit.module('Appointment overlapping, month view and allDay panel', moduleOptions);

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    for(let i = 0; i < 2; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');

    this.scheduler.appointments.compact.click();
    assert.equal(this.scheduler.tooltip.isVisible(), 1, 'ddAppointment is rendered');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '2 more', 'DropDown menu has correct text');

    this.instance.option('height', 900);
    $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(2).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(3).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, height is small \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 200,
            dataSource: items
        }
    );

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector').trigger('dxclick');
    const dropDownMenuText = $dropDownMenu.find('span').first().text();

    assert.equal($dropDownMenu.length, 1, 'ddAppointment is rendered');
    assert.equal(dropDownMenuText, '4 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment should have correct height, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 550,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.roughEqual($appointment.eq(0).outerHeight(), 23.5, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(1).outerHeight(), 23.5, 1, 'appointment height is ok');

    this.instance.option('height', 900);
    $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.roughEqual($appointment.eq(0).outerHeight(), 21, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(1).outerHeight(), 21, 1, 'appointment height is ok');
});

QUnit.test('Full-size appointment should not have empty class in \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: []
        }
    );

    const getHeightStub = sinon.stub(this.instance.getRenderingStrategyInstance(), '_getAppointmentDefaultHeight', function() {
        return 18;
    });

    try {
        this.instance.option('dataSource', items);

        const $firstAppointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(0);
        const $secondAppointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(1);

        assert.ok(!$firstAppointment.hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
        assert.ok(!$secondAppointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    } finally {
        getHeightStub.restore();
    }
});

QUnit.test('Full-size appointment should not have empty class in \'auto\' mode, week view', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'auto'
            }],
            width: 620,
            dataSource: []
        }
    );

    this.instance.option('dataSource', items);

    const $firstAppointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(0);
    const $secondAppointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(1);

    assert.ok(!$firstAppointment.hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    assert.ok(!$secondAppointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
});

QUnit.test('Full-size appointment should have correct height, \'numeric\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 3
            }],
            height: 550,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.roughEqual($appointment.eq(0).outerHeight(), 15.5, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(1).outerHeight(), 15.5, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(2).outerHeight(), 15.5, 1, 'appointment height is ok');

    this.instance.option('height', 900);
    $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));

    assert.roughEqual($appointment.eq(0).outerHeight(), 35.5, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(1).outerHeight(), 35.5, 1, 'appointment height is ok');
    assert.roughEqual($appointment.eq(2).outerHeight(), 35.5, 1, 'appointment height is ok');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'unlimited\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'month',
            views: [{
                type: 'month',
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 200,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

    assert.roughEqual($appointment.eq(0).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(1).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(2).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(3).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(4).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
    assert.roughEqual($appointment.eq(5).outerWidth(), tableCellWidth, 1.5, 'appointment is full-size');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, Day view', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'day',
            views: [{
                type: 'day',
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 3; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, 'appointment is full-size');
        assert.roughEqual(appointmentHeight, (tableCellHeight - 30) / 3, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, Day view, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true },
        { text: 'Task 5', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'day',
            views: [{
                type: 'day',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 2; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, 'appointment is full-size');
        assert.roughEqual(appointmentHeight, (tableCellHeight - 24) / 2, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 3, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '3 more', 'DropDown menu has correct text');
});

QUnit.test('Appointment should have an unchangeable height, Day view, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'day',
            views: [{
                type: 'day',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();
    const appointmentHeight = (tableCellHeight - 24) / 2;

    assert.roughEqual($appointment.eq(0).outerHeight(), appointmentHeight, 1.5, 'appointment has a correct height');

    this.instance.addAppointment({ text: 'Task 2', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true });
    $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));

    assert.roughEqual($appointment.eq(0).outerHeight(), appointmentHeight, 1.5, 'appointment has a correct height');
    assert.roughEqual($appointment.eq(1).outerHeight(), appointmentHeight, 1.5, 'appointment has a correct height');
});

QUnit.test('Appointment should have a right top position, Day view, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'day',
            views: [{
                type: 'day',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 500,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));
    const $header = $(this.instance.$element().find('.dx-scheduler-header'));

    assert.roughEqual($appointment.eq(0).position().top, $header.outerHeight(), 1.5, 'appointment has a correct position');

    this.instance.addAppointment({ text: 'Task 2', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true });
    $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));

    assert.roughEqual($appointment.eq(0).position().top, $header.outerHeight(), 1.5, 'appointment has a correct position');
    assert.roughEqual($appointment.eq(1).position().top, $header.outerHeight() + $appointment.outerHeight(), 1.5, 'appointment has a correct position');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, Week view, \'unlimited\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true },
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 7, 0), endDate: new Date(2015, 2, 4, 12, 0), allDay: true },
        { text: 'Task 3', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 5, 0), allDay: true },
        { text: 'Task 4', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true },
        { text: 'Task 5', startDate: new Date(2015, 2, 4, 6, 0), endDate: new Date(2015, 2, 4, 8, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-all-day-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 5; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentWidth, tableCellWidth, 1.5, 'appointment is full-size');
        assert.roughEqual(appointmentHeight, (tableCellHeight - 10) / 5, 1.5, 'appointment is full-size');
    }
});

QUnit.test('One full-size appointment should have a correct height, Week view, \'unlimited\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 4, 2, 0), endDate: new Date(2015, 2, 4, 3, 0), allDay: true } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 500,
            dataSource: items
        }
    );

    const tableCellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();

    assert.roughEqual($(this.instance.$element().find('.dx-scheduler-all-day-appointment')).eq(0).outerHeight(), tableCellHeight, 1.5, 'appointment height is correct');
});

QUnit.module('Appointment overlapping, timeline view', moduleOptions);

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'numeric\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                maxAppointmentsPerCell: 2
            }],
            height: 500,
            cellDuration: 60,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 3; i++) {
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26) / 2, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.equal(this.scheduler.appointments.compact.getButtonCount(), 2, 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 2, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '2 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'auto\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 400,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 5; i++) {
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26) / 3, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.equal(this.scheduler.appointments.compact.getButtonCount(), 4, 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'auto\' mode, narrow height', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 200,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 2; i++) {
        const appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, (tableCellHeight - 26), 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.equal(this.scheduler.appointments.compact.getButtonCount(), 8, 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 3, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '3 more', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'unlimited\' mode', function(assert) {
    const items = [ { text: 'Task 1', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 4, 0) },
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 3', startDate: new Date(2015, 2, 1, 2, 0), endDate: new Date(2015, 2, 1, 5, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'timelineWeek',
            views: [{
                type: 'timelineWeek',
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 600,
            dataSource: [items[0]]
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    let tableCellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

    let appointmentHeight = $appointment.eq(0).outerHeight();
    assert.roughEqual(appointmentHeight, tableCellHeight, 1.5, 'appointment is full-size');

    this.instance.option('dataSource', items);
    $appointment = $(this.instance.$element().find('.dx-scheduler-appointment')),
    tableCellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

    for(let i = 0; i < 5; i++) {
        appointmentHeight = $appointment.eq(i).outerHeight();

        assert.roughEqual(appointmentHeight, tableCellHeight / 4, 1.5, 'appointment is full-size');
    }

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector');

    assert.equal($dropDownMenu.length, 0, 'ddAppointment isn\'t rendered');
});


QUnit.module('Appointment overlapping, vertical view', moduleOptions);

QUnit.test('Full-size appointment should have minWidth, narrow width', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week'
            }],
            width: 200,
            dataSource: items
        }
    );

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.equal($appointments.eq(0).get(0).getBoundingClientRect().width, 5, 'Appointment has min width');
    assert.equal($appointments.eq(1).get(0).getBoundingClientRect().width, 5, 'Appointment has min width');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'auto\' mode, narrow width', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'auto'
            }],
            width: 300,
            dataSource: items
        }
    );

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'numeric\' mode', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 3
            }],
            height: 500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

    for(let i = 0; i < 2; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, (tableCellWidth - 26) / 3, 1.5, 'appointment is full-size');
    }

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1', 'DropDown menu has correct text');
});

QUnit.test('Full-size appointment should have correct size, \'auto\' mode', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 4, 0, 0), endDate: new Date(2015, 2, 4, 2, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'day',
            views: ['day'],
            height: 600,
            width: 1500,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment')).eq(0);
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    const appointmentWidth = $appointment.outerWidth();
    const offset = getOffset();

    assert.roughEqual(appointmentWidth, tableCellWidth - offset, 1.5, 'appointment is full-size');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell and width option, \'auto\' mode', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            width: 1600,
            dataSource: items
        }
    );

    let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    let tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    let appointmentWidth;

    for(let i = 0; i < 2; i++) {
        appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, (tableCellWidth - 26) / 3, 1.5, 'appointment is full-size');
    }


    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 1, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '1', 'DropDown menu has correct text');

    this.instance.option('width', 900);

    $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();
    appointmentWidth = $appointment.eq(0).outerWidth();

    assert.roughEqual(appointmentWidth, tableCellWidth - 26, 1.5, 'One appointment is full-size');

    this.scheduler.appointments.compact.click();
    assert.ok(this.scheduler.tooltip.isVisible(), 'ddAppointment is rendered');
    assert.equal(this.scheduler.tooltip.getItemCount(), 3, 'DropDown menu has correct items');
    assert.equal(this.scheduler.appointments.compact.getButtonText(), '3', 'DropDown menu has correct text');
});

QUnit.test('DropDown appointments button should have correct width on week view', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'auto'
            }],
            height: 600,
            width: 1500,
            dataSource: items
        }
    );

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector');

    assert.roughEqual($dropDownMenu.outerWidth(), 24, 0.5, 'ddAppointment has correct width');
});

QUnit.test('Full-size appointment count depends on maxAppointmentsPerCell option, \'unlimited\' mode', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 4', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 2, 0) },
        { text: 'Task 5', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) },
        { text: 'Task 6', startDate: new Date(2015, 2, 1, 1, 0), endDate: new Date(2015, 2, 1, 3, 0) } ];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            views: [{
                type: 'week',
                maxAppointmentsPerCell: 'unlimited'
            }],
            height: 600,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    const tableCellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

    for(let i = 0; i < 4; i++) {
        const appointmentWidth = $appointment.eq(i).outerWidth();

        assert.roughEqual(appointmentWidth, tableCellWidth / 4, 1.5, 'appointment is full-size');
    }

    const $dropDownMenu = $(this.instance.$element()).find('.dx-scheduler-appointment-collector');

    assert.equal($dropDownMenu.length, 0, 'ddAppointment isn\'t rendered');
});

QUnit.test('Appointments should not have specific class if maxAppointmentsPerCell=null', function(assert) {
    const items = [
        { text: 'Task 2', startDate: new Date(2015, 2, 1, 0, 0), endDate: new Date(2015, 2, 1, 2, 0) }];

    this.createInstance(
        {
            currentDate: new Date(2015, 2, 4),
            currentView: 'week',
            width: 800,
            views: [{
                type: 'week',
                maxAppointmentsPerCell: null
            }],
            height: 600,
            dataSource: items
        }
    );

    const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
    assert.ok(!$appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
});

QUnit.test('_isAppointmentEmpty should work correctly in different strategies', function(assert) {
    this.createInstance({
        views: ['timelineDay', 'week'],
        currentView: 'timelineDay'
    });

    const renderingStrategy = this.instance.getRenderingStrategyInstance();

    assert.ok(renderingStrategy._isAppointmentEmpty(34, 41), 'Appointment is empty');
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), 'Appointment isn\'t empty');

    this.instance.option('currentView', 'week');

    assert.ok(renderingStrategy._isAppointmentEmpty(34, 39), 'Appointment is empty');
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), 'Appointment isn\'t empty');

    this.instance.option('currentView', 'month');

    assert.ok(renderingStrategy._isAppointmentEmpty(19, 50), 'Appointment is empty');
    assert.notOk(renderingStrategy._isAppointmentEmpty(36, 41), 'Appointment isn\'t empty');
});
