import { getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import dragEvents from 'common/core/events/drag';
import { DataSource } from 'common/data/data_source/data_source';
import dataUtils from 'core/element_data';
import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

const { module, test, testStart } = QUnit;

testStart(() => initTestMarkup());

const createInstanceBase = options => createWrapper({ _draggingMode: 'default', ...options });

const triggerDragEnter = ($element, $appointment) => {
    const appointmentOffset = $appointment.offset();

    $element.trigger($.Event(dragEvents.enter, {
        pageX: appointmentOffset.left,
        pageY: appointmentOffset.top
    }));
};

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

module('All day appointments dragging', config, () => {
    test('Task dragging into the allDay container', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = createInstanceBase({ currentDate: new Date(2015, 1, 9), dataSource: data, editing: true });
        const $element = $(scheduler.instance.$element());
        const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

        let pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
        pointer.up();
        this.clock.tick(10);

        const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

        assert.equal($allDayAppointment.length, 1, 'allDayContainer has 1 item');
        assert.ok(scheduler.instance.option('dataSource').items()[0].allDay, 'New data is correct');

        pointer = pointerMock($allDayAppointment).start().down().move(10, 10);
        triggerDragEnter($(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell').eq(5), $allDayAppointment);
        pointer.up();

        assert.ok(!scheduler.instance.option('dataSource').items()[0].allDay, 'New data is correct');
        assert.deepEqual(scheduler.instance.option('dataSource').items()[0].endDate, new Date(2015, 1, 9, 3), 'New data is correct');
        assert.equal($element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 0, 'allDayContainer is empty');
    });

    test('Task dragging into the allDay container when allDay-cell is exactly top', function(assert) {
        const data = new DataSource({
            store: [{
                text: 'Task 1',
                startDate: new Date(2015, 2, 4, 0, 0),
                endDate: new Date(2015, 2, 4, 0, 30)
            }]
        });

        const scheduler = createInstanceBase({ currentDate: new Date(2015, 2, 4), dataSource: data, currentView: 'week', editing: true });
        const $element = $(scheduler.instance.$element());
        const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

        let pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell').eq(3), $appointment);
        pointer.up();
        this.clock.tick(10);

        const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment');

        assert.equal($allDayAppointment.length, 1, 'allDayContainer has 1 item');
        assert.ok(scheduler.instance.option('dataSource').items()[0].allDay, 'New data is correct');

        pointer = pointerMock($allDayAppointment).start().down().move(10, 10);
        triggerDragEnter($(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell').eq(3), $allDayAppointment);
        pointer.up();

        assert.ok(!scheduler.instance.option('dataSource').items()[0].allDay, 'New data is correct');
        assert.deepEqual(scheduler.instance.option('dataSource').items()[0].endDate, new Date(2015, 2, 4, 0, 30), 'New data is correct');
        assert.equal($element.find('.dx-scheduler-all-day-appointments .dx-scheduler-appointment').length, 0, 'allDayContainer is empty');
    });

    test('End date of appointment should be calculated if it\'s dragged off from the all day container', function(assert) {
        const scheduler = createInstanceBase({
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

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0), $appointment);
        pointer.up();

        this.clock.tick(10);
        const appointmentData = dataUtils.data($(scheduler.instance.$element()).find('.dx-scheduler-appointment').get(0), 'dxItemData');

        assert.deepEqual(appointmentData.startDate, new Date(2015, 1, 8, 0, 0), 'Start date is correct');
        assert.deepEqual(appointmentData.endDate, new Date(2015, 1, 8, 0, 30), 'End date is correct');
    });

    test('allDayExpanded option of workspace should be updated after dragged into the all day container', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = createInstanceBase({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            currentView: 'week',
            editing: true
        });

        const $element = $(scheduler.instance.$element());
        const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

        const workspace = $(scheduler.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance');

        assert.equal(workspace.option('allDayExpanded'), false);

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
        pointer.up();
        this.clock.tick(10);

        assert.equal(workspace.option('allDayExpanded'), true);
    });

    test('Height of appointment should be correct after dragged into the all day container', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = createInstanceBase({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            currentView: 'week',
            editing: true,
            maxAppointmentsPerCell: 'unlimited'
        });

        const $element = $(scheduler.instance.$element());
        const $appointment = $element.find('.dx-scheduler-appointment').eq(0);

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($element.find('.dx-scheduler-all-day-table-cell'), $appointment);
        pointer.up();
        this.clock.tick(10);

        const $allDayCell = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-table-cell').eq(0);
        const $allDayAppointment = $element.find('.dx-scheduler-all-day-appointment').eq(0);

        assert.equal(getOuterHeight($allDayAppointment), getOuterHeight($allDayCell), 'Appointment has correct height');
    });

    test('allDayExpanded option of workspace should be updated after dragged off from the all day container', function(assert) {
        const scheduler = createInstanceBase({
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

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        triggerDragEnter($(scheduler.instance.$element()).find('.dx-scheduler-date-table-cell').eq(0), $appointment);
        pointer.up();

        this.clock.tick(10);
        const workspace = $(scheduler.instance.$element()).find('.dx-scheduler-work-space').dxSchedulerWorkSpaceWeek('instance');

        assert.equal(workspace.option('allDayExpanded'), false);
    });


    test('Appointment should have right position while dragging, after change allDay property', function(assert) {
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

        const scheduler = createInstanceBase({
            height: 500,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            editing: true,
            dataSource: [appointment]
        });

        scheduler.instance.updateAppointment(appointment, newAppointment);

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const scrollable = scheduler.instance.getWorkSpace().$element().find('.dx-scrollable').dxScrollable('instance');
        const scrollDistance = 400;
        const dragDistance = -300;

        scrollable.scrollBy(scrollDistance);

        const pointer = pointerMock($appointment).start();
        const startPosition = $appointment.offset();

        pointer.down().move(0, dragDistance);

        const $draggedAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const currentPosition = $draggedAppointment.offset();

        assert.roughEqual(startPosition.top, currentPosition.top - dragDistance, 2.1, 'Appointment position is correct');
        pointer.up();
    });

    test('AllDay appointment should have right position while dragging from allDay panel', function(assert) {
        const appointment = {
            text: 'a',
            startDate: new Date(2015, 1, 9, 7),
            endDate: new Date(2015, 1, 9, 7, 30),
            allDay: true
        };

        const scheduler = createInstanceBase({
            height: 500,
            currentDate: new Date(2015, 1, 9),
            currentView: 'week',
            editing: true,
            dataSource: [appointment]
        });

        const $appointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const dragDistance = 300;

        const pointer = pointerMock($appointment).start();
        const startPosition = $appointment.offset();

        pointer.down().move(0, dragDistance);

        const $draggedAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-appointment').eq(0);
        const currentPosition = $draggedAppointment.offset();

        assert.equal(startPosition.top, currentPosition.top - dragDistance, 'Appointment position is correct');
        pointer.up();
    });
});
