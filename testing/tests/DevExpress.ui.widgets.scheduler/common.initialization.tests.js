import fx from 'animation/fx';
import { DataSource } from 'data/data_source/data_source';

import { triggerHidingEvent, triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import AppointmentDataProvider from 'ui/scheduler/appointments/DataProvider/appointmentDataProvider';
import { getInstanceFactory } from 'ui/scheduler/instanceFactory';
import errors from 'ui/widget/ui.errors';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

initTestMarkup();

QUnit.module('Initialization', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        sinon.spy(errors, 'log');

        fx.off = true;
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
        errors.log.restore();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Scheduler should have task model instance', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        createWrapper({ dataSource: data });

        const { appointmentDataProvider } = getInstanceFactory();

        assert.ok(appointmentDataProvider instanceof AppointmentDataProvider, 'Task model is initialized on scheduler init');
        assert.ok(appointmentDataProvider.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should work correctly when wrong timeZone was set', function(assert) {
        createWrapper({ timeZone: 'Wrong/timeZone' });
        assert.ok(true, 'Widget works correctly');
    });

    QUnit.test('Scheduler shouldn\'t have paginate in default DataSource', function(assert) {
        createWrapper({ dataSource: this.tasks });

        const { appointmentDataProvider } = getInstanceFactory();

        assert.notOk(appointmentDataProvider.dataSource.paginate(), 'Paginate is false');
    });

    QUnit.test('Rendering inside invisible element', function(assert) {
        const scheduler = createWrapper();
        try {
            triggerHidingEvent($('#scheduler'));
            $('#scheduler').hide();
            scheduler.instance.option({
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 6, 8, 8, 0),
                    endDate: new Date(2015, 6, 8, 17, 0),
                    allDay: true
                }],
                currentDate: new Date(2015, 6, 8)
            });
        } finally {
            $('#scheduler').show();
            triggerShownEvent($('#scheduler'));
            this.clock.tick();
            assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
        }
    });

    QUnit.test('Data expressions should be compiled on init', function(assert) {
        const scheduler = createWrapper();
        const dataAccessors = scheduler.instance._dataAccessors;

        $.each([
            'startDate',
            'endDate',
            'startDateTimeZone',
            'endDateTimeZone',
            'text',
            'description',
            'allDay',
            'recurrenceRule',
            'recurrenceException'], function(_, field) {
            assert.ok($.isFunction(dataAccessors.getter[field]), '\'' + field + '\' getter is OK');
            assert.ok($.isFunction(dataAccessors.setter[field]), '\'' + field + '\' setter is OK');
        });
    });

    QUnit.test('RecurrenceRule expression should not be compiled, if recurrenceRuleExpr = null', function(assert) {
        const scheduler = createWrapper({
            'startDateExpr': '_startDate',
            'endDateExpr': '_endDate',
            'textExpr': '_text',
            'descriptionExpr': '_description',
            'allDayExpr': '_allDay',
            'recurrenceRuleExpr': null
        });

        const dataAccessors = scheduler.instance._dataAccessors;

        assert.strictEqual(dataAccessors.getter.recurrenceRule, undefined, 'getter for recurrenceRule is OK');
        assert.strictEqual(dataAccessors.setter.recurrenceRule, undefined, 'setter for recurrenceRule is OK');
    });

    QUnit.test('appointmentCollectorTemplate rendering args should be correct', function(assert) {
        createWrapper({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                recurrenceRule: 'FREQ=DAILY;COUNT=2',
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                recurrenceRule: 'FREQ=DAILY;COUNT=2',
                text: 'Task 2'
            }],
            maxAppointmentsPerCell: 1,
            currentDate: new Date(2015, 4, 24),
            views: ['month'],
            appointmentCollectorTemplate: function(data) {
                assert.equal(data.appointmentCount, 1, 'Appointments count is OK');
                assert.strictEqual(data.isCompact, false, 'Compact flag is ok');
            },
            currentView: 'month'
        });
    });

    [
        { startDayHour: 0, endDayHour: 0 },
        { startDayHour: 2, endDayHour: 0 }
    ].forEach(dayHours => {
        QUnit.test(`Generate error if startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, function(assert) {
            assert.throws(
                () => {
                    createWrapper({
                        currentDate: new Date(2015, 4, 24),
                        views: ['day'],
                        currentView: 'day',
                        startDayHour: dayHours.startDayHour,
                        endDayHour: dayHours.endDayHour
                    });
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
            this.clock.tick(1000);
        });
    });

    [
        { startDayHour: 0, endDayHour: 24, cellDuration: 95 },
        { startDayHour: 8, endDayHour: 24, cellDuration: 90 }
    ].forEach(config => {
        QUnit.test(`Generate warning if cellDuration: ${config.cellDuration} could not divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: config.startDayHour,
                endDayHour: config.endDayHour,
                cellDuration: config.cellDuration
            });

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1015', 'warning has correct error id');
        });
    });

    [
        { startDayHour: 0, endDayHour: 24, cellDuration: 60 },
        { startDayHour: 8, endDayHour: 24, cellDuration: 10 }
    ].forEach(config => {
        QUnit.test(`Warning should not be generated if cellDuration: ${config.cellDuration} could divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            createWrapper({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: config.startDayHour,
                endDayHour: config.endDayHour,
                cellDuration: config.cellDuration
            });

            assert.equal(errors.log.callCount, 0, 'there are not any warnings');
        });
    });

    QUnit.test('Header panel should be visible in "Day" view with intervalCount > 1 if crossScrollingEnabled: true, showAllDayPanel: false (T895058)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            views: [{
                type: 'day',
                intervalCount: 2
            }],
            crossScrollingEnabled: true,
            showAllDayPanel: false
        });

        const headerScrollableHeight = scheduler.workSpace.getHeaderScrollable().height();
        const headerHeight = scheduler.header.getElement().height();

        assert.ok(headerScrollableHeight >= headerHeight, 'HeaderScrollable height is correct');
    });
});
