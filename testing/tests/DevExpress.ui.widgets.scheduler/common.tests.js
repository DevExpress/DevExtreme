import fx from 'animation/fx';
import translator from 'animation/translator';
import Color from 'color';
import 'common.css!';
import config from 'core/config';
import devices from 'core/devices';
import dataUtils from 'core/element_data';
import { noop } from 'core/utils/common';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { isRenderer } from 'core/utils/type';
import CustomStore from 'data/custom_store';
import { DataSource } from 'data/data_source/data_source';
import dragEvents from 'events/drag';
import { triggerHidingEvent, triggerShownEvent } from 'events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import timeZoneDataUtils from 'ui/scheduler/timezones/utils.timezones_data';
import dxScheduler from 'ui/scheduler/ui.scheduler';
import { getTimeZones } from 'time_zone_utils';
import dxSchedulerAppointmentModel from 'ui/scheduler/ui.scheduler.appointment_model';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import dxSchedulerWorkSpaceDay from 'ui/scheduler/workspaces/ui.scheduler.work_space_day';
import themes from 'ui/themes';
import errors from 'ui/widget/ui.errors';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import { createWrapper, SchedulerTestWrapper } from '../../helpers/scheduler/helpers.js';
import { Deferred } from 'core/utils/deferred';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});

QUnit.module('Initialization', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        sinon.spy(errors, 'log');

        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };

        this.checkDateTime = function(assert, actualDate, expectedDate, messagePrefix) {
            assert.equal(actualDate.getHours(), expectedDate.getHours(), messagePrefix + 'Hours\'re OK');
            assert.equal(actualDate.getMinutes(), expectedDate.getMinutes(), messagePrefix + 'Minutes\'re OK');
            assert.equal(actualDate.getSeconds(), expectedDate.getSeconds(), messagePrefix + 'Seconds\'re OK');
            assert.equal(actualDate.getMilliseconds(), expectedDate.getMilliseconds(), messagePrefix + 'Milliseconds\'re OK');
        };
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
        this.createInstance({ dataSource: data });

        assert.ok(this.instance._appointmentModel instanceof dxSchedulerAppointmentModel, 'Task model is initialized on scheduler init');
        assert.ok(this.instance._appointmentModel._dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should work correctly when wrong timeZone was set', function(assert) {
        this.createInstance({ timeZone: 'Wrong/timeZone' });
        assert.ok(true, 'Widget works correctly');
    });

    QUnit.test('Scheduler shouldn\'t have paginate in default DataSource', function(assert) {
        this.createInstance({ dataSource: this.tasks });

        assert.notOk(this.instance._appointmentModel._dataSource.paginate(), 'Paginate is false');
    });

    QUnit.test('Rendering inside invisible element', function(assert) {
        try {
            this.createInstance();
            triggerHidingEvent($('#scheduler'));
            $('#scheduler').hide();
            this.instance.option({
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
            assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
        }
    });

    QUnit.test('Data expressions should be compiled on init', function(assert) {
        this.createInstance();
        const dataAccessors = this.instance._dataAccessors;

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
        this.createInstance({
            'startDateExpr': '_startDate',
            'endDateExpr': '_endDate',
            'textExpr': '_text',
            'descriptionExpr': '_description',
            'allDayExpr': '_allDay',
            'recurrenceRuleExpr': null
        });

        const dataAccessors = this.instance._dataAccessors;

        assert.strictEqual(dataAccessors.getter.recurrenceRule, undefined, 'getter for recurrenceRule is OK');
        assert.strictEqual(dataAccessors.setter.recurrenceRule, undefined, 'setter for recurrenceRule is OK');
    });

    QUnit.test('appointmentCollectorTemplate rendering args should be correct', function(assert) {
        this.createInstance({
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
                    this.createInstance({
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
            this.createInstance({
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
            this.createInstance({
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

(function() {
    QUnit.module('Methods', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler($.extend({
                    showCurrentTimeIndicator: false
                }, options)).dxScheduler('instance');
                this.scheduler = new SchedulerTestWrapper(this.instance);
            };

            this.clock = sinon.useFakeTimers();

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
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test('Add new item', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' });
        this.clock.tick();
        assert.strictEqual(this.instance.option('dataSource').items().length, 3, 'new item is added');
    });

    QUnit.test('Add new item with empty text', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17) });
        this.clock.tick();
        assert.strictEqual(this.instance.option('dataSource').items()[2].text, '', 'new item was added with correct text');
    });

    QUnit.test('addAppointment shouldn\'t have an effect on data item, when timezone is set', function(assert) {
        const data = [];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 5
        });

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'first' });

        assert.deepEqual(data[0].startDate, new Date(2015, 1, 9, 16), 'Start date is OK');
        assert.deepEqual(data[0].endDate, new Date(2015, 1, 9, 17), 'End date is OK');
    });

    QUnit.test('Update item', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Updated item should be rerendered', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        const newTask = {
            text: 'Task 11',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        this.instance.option('onAppointmentRendered', function() {
            assert.ok(true, 'Updated item was rerendered');
        });
        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();
    });

    QUnit.test('Updated item should be rerendered if it\'s coordinates weren\'t changed (T650811)', function(assert) {
        const data = new DataSource({
            store: [this.tasks[0]]
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        const newTask = {
            allDay: undefined,
            text: 'Task 11',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        this.instance.option('onAppointmentRendered', function() {
            assert.ok(true, 'Updated item was rerendered');
        });

        this.instance.updateAppointment(this.tasks[0], newTask);

        this.clock.tick();
    });

    QUnit.test('Other appointments should not be rerendered after update item', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        const newTask = { startDate: new Date(2015, 1, 9, 2, 0), endDate: new Date(2015, 1, 9, 3, 0), text: 'caption' };
        let counter = 0;

        this.instance.option({ onAppointmentRendered: function(args) {
            counter++;
        } });

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option('dataSource').items()[0], newTask, 'item is updated');
        assert.equal(counter, 1, 'Only updated appointment was rerendered');
    });

    QUnit.test('Update item when custom timeZone was set', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 5
        });

        this.clock.tick();

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Update item when custom timeZone was set as string', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 'Asia/Muscat'
        });

        this.clock.tick();

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        this.instance.updateAppointment(this.tasks[0], newTask);
        this.clock.tick();

        assert.deepEqual(this.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Updated directly from store item should be rerendered correctly', function(assert) {
        const data = [{
            text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11)
        }];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const dataSource = this.instance.getDataSource();
        dataSource.store().update(data[0], {
            text: 'def', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11)
        });
        dataSource.load();

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment-title').eq(0).text(), 'def', 'Appointment is rerendered');
    });

    QUnit.test('Pushed directly from store item should be rerendered correctly', function(assert) {
        const data = new DataSource({
            store: {
                type: 'array',
                key: 'id',
                data: [{
                    id: 0,
                    text: 'abc',
                    startDate: new Date(2017, 4, 22, 9, 30),
                    endDate: new Date(2017, 4, 22, 11, 30)
                },
                {
                    id: 1,
                    text: 'abc',
                    startDate: new Date(2017, 4, 23, 9, 30),
                    endDate: new Date(2017, 4, 23, 11, 30)
                }]
            }
        });

        this.createInstance({
            dataSource: data,
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25)
        });

        const dataSource = this.instance.getDataSource();
        dataSource.store().push([
            {
                type: 'update', key: 0, data: {
                    text: 'Update-1',
                    startDate: new Date(2017, 4, 22, 9, 30),
                    endDate: new Date(2017, 4, 22, 11, 30)
                }
            },
            {
                type: 'update', key: 1, data: {
                    text: 'Update-2',
                    startDate: new Date(2017, 4, 23, 9, 30),
                    endDate: new Date(2017, 4, 23, 11, 30)
                }
            }
        ]);
        dataSource.load();

        const appointment = this.instance.$element().find('.dx-scheduler-appointment-title');
        assert.equal(appointment.eq(0).text(), 'Update-1', 'Appointment is rerendered');
        assert.equal(appointment.eq(1).text(), 'Update-2', 'Appointment is rerendered');
    });

    QUnit.test('Push new item to the store (remoteFiltering: true) (T900529)', function(assert) {
        const data = [{
            id: 0,
            text: 'Test Appointment',
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }];

        const pushItem = {
            id: 1,
            text: 'Pushed Appointment',
            startDate: new Date(2017, 4, 23, 9, 30),
            endDate: new Date(2017, 4, 23, 11, 30)
        };

        const scheduler = createWrapper({
            dataSource: {
                load: () => data,
                key: 'id'
            },
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25)
        });

        const dataSource = scheduler.instance.getDataSource();
        dataSource.store().push([{ type: 'update', key: pushItem.id, data: pushItem }]);
        dataSource.load();

        assert.equal(scheduler.appointments.getTitleText(0), 'Test Appointment', 'Appointment is rerendered');
        assert.equal(scheduler.appointments.getTitleText(1), 'Pushed Appointment', 'Pushed appointment is rerendered');
    });

    QUnit.test('the \'update\' method of store should have key as arg is store has the \'key\' field', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10)
        }];
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                update: function(key, updatedItem) {
                    assert.equal(key, 1, 'Key is OK');
                },
                key: 'id'
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        this.clock.tick();

        this.instance.updateAppointment(data[0], {});
    });

    QUnit.test('the \'update\' method of store should have item as arg is store has not the \'key\' field', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10)
        }];
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                update: function(key, updatedItem) {
                    assert.equal(key, data[0], 'Key is OK');
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.updateAppointment(data[0], {});
    });

    QUnit.test('Remove item', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        this.clock.tick();

        const lastTask = this.tasks[1];

        this.instance.deleteAppointment(this.tasks[0]);
        this.clock.tick();
        assert.deepEqual(this.instance.option('dataSource').items(), [lastTask], 'Task is removed');
    });

    QUnit.test('Other appointments should not be rerendered after remove appointment', function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });
        this.clock.tick();

        const lastTask = this.tasks[1];

        this.instance.option({ onAppointmentRendered: function(args) {
            assert.ok(false, 'Appointments were rerendered');
        } });

        this.instance.deleteAppointment(this.tasks[0]);
        this.clock.tick();
        assert.deepEqual(this.instance.option('dataSource').items(), [lastTask], 'Task is removed');
    });

    QUnit.test('the \'remove\' method of store should have key as arg is store has the \'key\' field', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10)
        }];
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                remove: function(key) {
                    assert.equal(key, 1, 'Key is OK');
                },
                key: 'id'
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.deleteAppointment(data[0]);
    });

    QUnit.test('the \'remove\' method of store should have item as arg is store has not the \'key\' field', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10)
        }];
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return data;
                },
                remove: function(key) {
                    assert.equal(key, data[0], 'Key is OK');
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });
        this.clock.tick();

        this.instance.deleteAppointment(data[0]);
    });

    QUnit.test('Check appointment takes all day', function(assert) {
        this.createInstance({
            dataSource: []
        });
        let result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, 'Appointment takes all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 10)
        });

        assert.ok(result, 'Appointment takes all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 4, 5)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');
    });

    QUnit.test('Check appointment takes all day if start & end hours are defined', function(assert) {
        this.createInstance({
            dataSource: [],
            startDayHour: 5,
            endDayHour: 10
        });

        let result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, 'Appointment takes all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 5),
            endDate: new Date(2015, 5, 4, 10)
        });
        assert.ok(result, 'Appointment takes all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 7)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 12)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');
    });

    QUnit.test('Scheduler focus method should call workspace focus method when appointment wasn\'t updated', function(assert) {
        this.createInstance({
            dataSource: [],
            currentView: 'day',
            currentDate: new Date(2015, 10, 3)
        });

        const workspace = this.instance.getWorkSpace();
        const spy = sinon.spy(workspace, 'focus');

        this.instance.focus();

        assert.ok(spy.calledOnce, 'focus is called');
    });

    QUnit.test('Scheduler focus method should call appointments focus method when appointment was updated', function(assert) {
        const tasks = [{
            text: 'a',
            startDate: new Date(2015, 6, 8, 8, 0),
            endDate: new Date(2015, 6, 8, 17, 0),
            allDay: true
        }];

        this.createInstance({
            dataSource: tasks,
            currentDate: new Date(2015, 6, 8)
        });

        const appointments = this.instance.getAppointmentsInstance();
        const focusSpy = sinon.spy(appointments, 'focus');

        this.instance._editAppointmentData = tasks[0];
        this.instance.focus();

        assert.ok(focusSpy.calledOnce, 'focus is called');
    });

    QUnit.test('Scheduler getWorkSpaceDateTableOffset should return right dateTable offset', function(assert) {
        this.createInstance({
            dataSource: 'day',
            currentDate: new Date(2015, 10, 3)
        });

        const timePanelWidth = this.instance.$element().find('.dx-scheduler-time-panel').eq(0).outerWidth();
        const offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, timePanelWidth, 'Date Table offset is correct');
    });

    QUnit.test('Scheduler getWorkSpaceDateTableOffset should return right dateTable offset, crossScrollingEnabled=true', function(assert) {
        this.createInstance({
            dataSource: 'day',
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true
        });

        const offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, 0, 'Date Table offset is correct');
    });

    QUnit.test('Scheduler getWorkSpaceDateTableOffset should return right dateTable offset, crossScrollingEnabled=true, rtl mode', function(assert) {
        this.createInstance({
            currentView: 'day',
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true,
            rtlEnabled: true
        });

        const timePanelWidth = this.instance.$element().find('.dx-scheduler-time-panel').eq(0).outerWidth();
        const offset = this.instance.getWorkSpaceDateTableOffset();

        assert.equal(offset, timePanelWidth, 'Date Table offset is correct');
    });

    QUnit.test('Scheduler dateTable should have right position, crossScrollingEnabled=true, rtl mode', function(assert) {
        this.createInstance({
            currentView: 'day',
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true,
            rtlEnabled: true
        });

        const dateTable = this.scheduler.workSpace.getDateTable();

        assert.equal(dateTable.position().left, 0, 'Date Table left is correct');
    });

    QUnit.test('Timezone offset calculation(T388304)', function(assert) {
        [{ tz: 'Europe/Belgrade', offset: 1, daylightOffset: 2, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'Asia/Ashgabat', offset: 5, daylightOffset: 5, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'America/Los_Angeles', offset: -8, daylightOffset: -7, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'America/Louisville', offset: -5, daylightOffset: -4, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'America/Managua', offset: -6, daylightOffset: -6, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'Antarctica/South_Pole', offset: 12, daylightOffset: 13, daylightDate: new Date(2016, 10, 20), date: new Date(2016, 4, 10) },
            { tz: 'Arctic/Longyearbyen', offset: 1, daylightOffset: 2, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'Asia/Brunei', offset: 8, daylightOffset: 8, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) },
            { tz: 'Asia/Damascus', offset: 2, daylightOffset: 3, daylightDate: new Date(2016, 4, 10), date: new Date(2016, 10, 20) }
        ].forEach(function(item) {
            const offset = timeZoneDataUtils.getTimeZoneOffsetById(item.tz, item.date);
            const daylightOffset = timeZoneDataUtils.getTimeZoneOffsetById(item.tz, item.daylightDate);

            assert.equal(offset, item.offset, item.tz + ': Common offset is OK');
            assert.equal(daylightOffset, item.daylightOffset, item.tz + ': DST offset is OK');
        });
    });

    QUnit.test('Scheduler should work correctly when groupOrientation is set without groups', function(assert) {
        assert.expect(1);

        this.createInstance({
            dataSource: [],
            resources: [{
                fieldExpr: 'owner.id',
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: 'A'
                    }, {
                        id: 2,
                        text: 'B'
                    }
                ]
            }],
            views: [
                {
                    type: 'week',
                    name: 'VWEEK',
                    groupOrientation: 'vertical'
                }
            ],
            currentView: 'VWEEK',
            height: 500
        });

        const $workSpace = this.instance.getWorkSpace().$element();

        assert.notOk($workSpace.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace hasn\'t \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('getWorkSpaceScrollableScrollTop should return right value for allDay appointments depending on the group orientation', function(assert) {
        assert.expect(4);

        this.createInstance({
            dataSource: [],
            groups: ['owner.id'],
            resources: [{
                fieldExpr: 'owner.id',
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: 'A'
                    }, {
                        id: 2,
                        text: 'B'
                    }
                ]
            }],
            views: [{
                type: 'week',
                name: 'HWEEK',
                groupOrientation: 'horizontal'
            },
            {
                type: 'week',
                name: 'VWEEK',
                groupOrientation: 'vertical'
            }],
            currentView: 'HWEEK',
            height: 500
        });

        let scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(), 400, 'Returned value is right for not allDay appt and horizontal grouping');
        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(true), 0, 'Returned value is right for allDay appt and horizontal grouping');

        this.instance.option('currentView', 'VWEEK');

        scrollable = this.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(), 400, 'Returned value is right for not allDay appt and vertical grouping');
        assert.equal(this.instance.getWorkSpaceScrollableScrollTop(true), 400, 'Returned value is right for allDay appt and vertical grouping');
    });

    QUnit.test('checkAndDeleteAppointment', function(assert) {
        const data = [{
            text: 'a',
            startDate: new Date(2015, 6, 8, 8, 0),
            endDate: new Date(2015, 6, 8, 17, 0),
        }];
        this.createInstance({
            dataSource: data,
        });

        this.instance.checkAndDeleteAppointment(data[0], data[0]);

        assert.equal(this.instance.option('dataSource').length, 0);
    });

    QUnit.test('showAppointmentTooltipCore, should call show tooltip', function(assert) {
        this.createInstance({});
        this.instance._appointmentTooltip.isAlreadyShown = sinon.stub().returns(false);
        this.instance._appointmentTooltip.show = sinon.stub();
        this.instance._appointmentTooltip.hide = sinon.stub();
        this.instance.showAppointmentTooltipCore('target', 'data', 'options');

        assert.ok(!this.instance._appointmentTooltip.hide.called, 'hide tooltip is not called');
        assert.ok(this.instance._appointmentTooltip.show.called, 'show tooltip is called');
    });

    QUnit.test('showAppointmentTooltipCore, should call hide tooltip', function(assert) {
        this.createInstance({});
        this.instance._appointmentTooltip.isAlreadyShown = sinon.stub().returns(true);
        this.instance._appointmentTooltip.show = sinon.stub();
        this.instance._appointmentTooltip.hide = sinon.stub();
        this.instance.showAppointmentTooltipCore('target', 'data', 'options');

        assert.ok(this.instance._appointmentTooltip.hide.called, 'hide tooltip is called');
        assert.ok(!this.instance._appointmentTooltip.show.called, 'show tooltip is not called');
    });

    QUnit.test('showAppointmentTooltip, should call show tooltip', function(assert) {
        this.createInstance({});
        this.instance._appointmentTooltip.isAlreadyShown = sinon.stub().returns(false);
        this.instance._appointmentTooltip.show = sinon.stub();
        this.instance._appointmentTooltip.hide = sinon.stub();
        this.instance.showAppointmentTooltip('appointmentData', 'target', 'currentAppointmentData');

        assert.ok(!this.instance._appointmentTooltip.hide.called, 'hide tooltip is not called');
        assert.ok(this.instance._appointmentTooltip.show.called, 'show tooltip is called');
    });

    QUnit.test('showAppointmentTooltip, should call hide tooltip', function(assert) {
        this.createInstance({});
        this.instance._appointmentTooltip.isAlreadyShown = sinon.stub().returns(true);
        this.instance._appointmentTooltip.show = sinon.stub();
        this.instance._appointmentTooltip.hide = sinon.stub();
        this.instance.showAppointmentTooltip('appointmentData', 'target', 'currentAppointmentData');

        assert.ok(this.instance._appointmentTooltip.hide.called, 'hide tooltip is called');
        assert.ok(!this.instance._appointmentTooltip.show.called, 'show tooltip is not called');
    });

    QUnit.test('_getUpdatedData for the empty data item (T906240)', function(assert) {
        const startCellDate = new Date(2020, 1, 2, 3);
        const endCellDate = new Date(2020, 1, 2, 4);
        const scheduler = createWrapper({});

        scheduler.instance.getTargetCellData = () => {
            return {
                startDate: startCellDate,
                endDate: endCellDate
            };
        };

        const updatedData = scheduler.instance._getUpdatedData({ text: 'test' });
        assert.deepEqual(updatedData, {
            allDay: undefined,
            endDate: endCellDate,
            startDate: startCellDate
        }, 'Updated data is correct');
    });
})('Methods');

QUnit.module('Scrolling to time', () => {
    ['standard', 'virtual'].forEach((scrollingMode) => {
        const moduleName = scrollingMode === 'virtual'
            ? 'Virtual Scrolling'
            : 'Standard Scrolling';
        QUnit.module(moduleName, {
            beforeEach: function() {
                this.createScheduler = (options) => {
                    return createWrapper({
                        showCurrentTimeIndicator: false,
                        scrolling: { mode: scrollingMode },
                        ...options,
                    });
                };

                this.clock = sinon.useFakeTimers();
                sinon.spy(errors, 'log');
                fx.off = true;
            },
            afterEach: function() {
                this.clock.restore();
                errors.log.restore();
                fx.off = false;
            }
        }, () => {
            QUnit.test('Check scrolling to time', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * (18 + 1 / 6);

                assert.roughEqual(scrollBy.getCall(0).args[0].top, expectedTop, 1.001, 'scrollBy was called with right distance');
                assert.equal(scrollBy.getCall(0).args[0].left, 0, 'scrollBy was called with right distance');
            });

            QUnit.test('Check scrolling to time, if startDayHour is not 0', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500,
                    startDayHour: 3
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(2, 0);

                assert.roughEqual(scrollBy.getCall(0).args[0].top, 0, 2.001, 'scrollBy was called with right distance');

                scheduler.instance.scrollToTime(5, 0);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * 4;

                assert.roughEqual(
                    scrollBy.getCall(1).args[0].top,
                    expectedTop,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time, if \'hours\' argument greater than the \'endDayHour\' option', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500,
                    endDayHour: 10
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(12, 0);

                const cellHeight = scheduler.workSpace.getCells().eq(0).outerHeight();
                const expectedTop = cellHeight * 18;

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].top,
                    expectedTop,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Scrolling to date which doesn\'t locate on current view should call console warning', function(assert) {
                const scheduler = this.createScheduler({
                    currentView: 'week',
                    currentDate: new Date(2015, 1, 9),
                    height: 500
                });

                scheduler.instance.scrollToTime(12, 0, new Date(2015, 1, 16));

                assert.equal(errors.log.callCount, 1, 'warning has been called once');
                assert.equal(errors.log.getCall(0).args[0], 'W1008', 'warning has correct error id');
            });

            QUnit.test('Check scrolling to time for timeline view', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5);

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view, rtl mode', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    rtlEnabled: true
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollLeft = scrollable.scrollLeft();
                const scrollBy = sinon.spy(scrollable, 'scrollBy');
                const offset = scheduler.instance.getWorkSpace().getScrollableContainer().outerWidth();

                scheduler.instance.scrollToTime(9, 5);

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 9, 9, 5)).left - scrollLeft - offset,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view if date was set', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    firstDayOfWeek: 1
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollBy = sinon.spy(scrollable, 'scrollBy');

                scheduler.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });

            QUnit.test('Check scrolling to time for timeline view if date was set, rtl mode', function(assert) {
                const scheduler = this.createScheduler({
                    views: ['timelineWeek'],
                    currentView: 'timelineWeek',
                    currentDate: new Date(2015, 1, 9),
                    width: 500,
                    firstDayOfWeek: 1,
                    rtlEnabled: true
                });

                const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                const scrollLeft = scrollable.scrollLeft();
                const scrollBy = sinon.spy(scrollable, 'scrollBy');
                const offset = scheduler.workSpace.getDataTableScrollableContainer().outerWidth();

                scheduler.instance.scrollToTime(9, 5, new Date(2015, 1, 11, 10, 30));

                assert.roughEqual(
                    scrollBy.getCall(0).args[0].left,
                    scheduler.instance._workSpace.getCoordinatesByDate(new Date(2015, 1, 11, 9, 5)).left - scrollLeft - offset,
                    1.001,
                    'scrollBy was called with right distance',
                );
            });
        });
    });
});


(function() {

    const checkDate = function(instance, assert) {

        const workSpace = instance.getWorkSpace();
        const workSpaceCurrentDate = workSpace.option('currentDate');
        const header = instance.getHeader();
        const headerCurrentDate = header.option('currentDate');

        assert.ok(workSpaceCurrentDate instanceof Date, 'date is instance of Date constructor');
        assert.equal(workSpaceCurrentDate.getFullYear(), 2015, 'Year is OK');
        assert.equal(workSpaceCurrentDate.getMonth(), 4, 'Month is OK');
        assert.equal(workSpaceCurrentDate.getDate(), 13, 'Date is OK');

        assert.ok(headerCurrentDate instanceof Date, 'date is instance of Date constructor');
        assert.equal(headerCurrentDate.getFullYear(), 2015, 'Year is OK');
        assert.equal(headerCurrentDate.getMonth(), 4, 'Month is OK');
        assert.equal(headerCurrentDate.getDate(), 13, 'Date is OK');
    };

    QUnit.module('Options', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
                this.scheduler = new SchedulerTestWrapper(this.instance);
            };
            this.clock = sinon.useFakeTimers();
            sinon.spy(errors, 'log');
        },
        afterEach: function() {
            this.clock.restore();
            errors.log.restore();
        }
    });

    QUnit.test('Data expressions should be recompiled on optionChanged', function(assert) {
        this.createInstance();
        const repaintStub = sinon.stub(this.instance, 'repaint');

        try {
            this.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException',
                'disabledExpr': '_disabled'
            });

            const data = {
                startDate: new Date(2017, 2, 22),
                endDate: new Date(2017, 2, 23),
                startDateTimeZone: 'America/Los_Angeles',
                endDateTimeZone: 'America/Los_Angeles',
                text: 'a',
                description: 'b',
                allDay: true,
                recurrenceRule: 'abc',
                recurrenceException: 'def',
                disabled: false
            };
            const appointment = {
                _startDate: data.startDate,
                _endDate: data.endDate,
                _startDateTimeZone: data.startDateTimeZone,
                _endDateTimeZone: data.endDateTimeZone,
                _text: data.text,
                _description: data.description,
                _allDay: data.allDay,
                _recurrenceRule: data.recurrenceRule,
                _recurrenceException: data.recurrenceException,
                _disabled: data.disabled
            };

            const dataAccessors = this.instance._dataAccessors;

            $.each(dataAccessors.getter, function(name, getter) {
                assert.equal(dataAccessors.getter[name](appointment), data[name], 'getter for ' + name + ' is OK');
            });

            $.each(dataAccessors.setter, function(name, getter) {
                dataAccessors.setter[name](appointment, 'xyz');
                assert.equal(appointment['_' + name], 'xyz', 'setter for ' + name + ' is OK');
            });
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Data expressions should be recompiled on optionChanged and passed to appointmentModel', function(assert) {
        this.createInstance();
        const repaintStub = sinon.stub(this.instance, 'repaint');

        try {
            const appointmentModel = this.instance.getAppointmentModel();

            this.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException'
            });

            const dataAccessors = this.instance._dataAccessors;

            assert.deepEqual($.extend({ resources: {} }, dataAccessors.getter), appointmentModel._dataAccessors.getter, 'dataAccessors getters were passed to appointmentModel');
            assert.deepEqual($.extend({ resources: {} }, dataAccessors.setter), appointmentModel._dataAccessors.setter, 'dataAccessors setters were passed to appointmentModel');
            assert.deepEqual(dataAccessors.expr, appointmentModel._dataAccessors.expr, 'dataExpressions were passed to appointmentModel');
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Appointment should be rendered correctly after expression changing', function(assert) {
        this.createInstance({
            dataSource: [{
                text: 'a',
                StartDate: new Date(2015, 6, 8, 8, 0),
                endDate: new Date(2015, 6, 8, 17, 0),
                allDay: true
            }],
            currentDate: new Date(2015, 6, 8)
        });

        this.instance.option('startDateExpr', 'StartDate');
        this.clock.tick();
        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
    });

    QUnit.test('Sheduler should be repainted after data expression option changing', function(assert) {
        this.createInstance();
        const repaintStub = sinon.stub(this.instance, 'repaint');

        try {
            this.instance.option({
                'startDateExpr': '_startDate',
                'endDateExpr': '_endDate',
                'startDateTimeZoneExpr': '_startDateTimeZone',
                'endDateTimeZoneExpr': '_endDateTimeZone',
                'textExpr': '_text',
                'descriptionExpr': '_description',
                'allDayExpr': '_allDay',
                'recurrenceRuleExpr': '_recurrenceRule',
                'recurrenceExceptionExpr': '_recurrenceException'
            });

            assert.equal(repaintStub.callCount, 9, 'Scheduler was repainted');
        } finally {
            repaintStub.restore();
        }
    });

    QUnit.test('Sheduler should have correct default template after data expression option changing', function(assert) {
        this.createInstance({
            dataSource: [{
                text: 'a',
                TEXT: 'New Text',
                startDate: new Date(2015, 6, 8, 8, 0),
                endDate: new Date(2015, 6, 8, 17, 0),
                allDay: true
            }],
            currentDate: new Date(2015, 6, 8)
        });

        this.instance.option({
            textExpr: 'TEXT'
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment-title').eq(0).text(), 'New Text', 'Appointment template is correct');
    });

    QUnit.test('Changing of \'currentView\' option after initializing should work correctly', function(assert) {
        this.createInstance({
            currentDate: new Date(2018, 0, 30),
            views: ['day', 'week'],
            currentView: 'week',
            onInitialized: function(e) {
                e.component.option('currentView', 'day');
            }
        });

        assert.ok(this.instance.getWorkSpace() instanceof dxSchedulerWorkSpaceDay, 'correct view');
    });

    QUnit.test('It should be possible to init currentDate as timestamp', function(assert) {
        this.createInstance({
            currentDate: 1431515985596
        });

        checkDate(this.instance, assert);
    });

    QUnit.test('It should be possible to change currentDate using timestamp', function(assert) {
        this.createInstance();

        this.instance.option('currentDate', 1431515985596);
        checkDate(this.instance, assert);
    });

    QUnit.test('Custom store should be loaded only once on the first rendering', function(assert) {
        let counter = 0;

        this.createInstance({
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        const d = $.Deferred();
                        setTimeout(function() {
                            d.resolve([]);
                            counter++;
                        }, 100);

                        return d.promise();
                    }
                })
            })
        });

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test('Custom store should be loaded only once on dataSource option change', function(assert) {
        let counter = 0;

        this.createInstance();

        this.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                        counter++;
                    }, 100);

                    return d.promise();
                }
            })
        }));

        this.clock.tick(200);

        assert.equal(counter, 1);
    });

    QUnit.test('allowAllDayResize option should be updated when current view is changed', function(assert) {
        this.createInstance({
            currentView: 'day'
        });

        assert.notOk(this.instance.getAppointmentsInstance().option('allowAllDayResize'));

        this.instance.option('currentView', 'week');
        assert.ok(this.instance.getAppointmentsInstance().option('allowAllDayResize'));
    });

    QUnit.test('allowAllDayResize option should depend on intervalCount', function(assert) {
        this.createInstance({
            views: [{ type: 'week', name: 'WEEK' }, { type: 'day', name: 'DAY' }, { type: 'day', name: 'DAY1', intervalCount: 3 } ],
            currentView: 'DAY'
        });

        assert.notOk(this.instance.getAppointmentsInstance().option('allowAllDayResize'));

        this.instance.option('currentView', 'DAY1');
        assert.ok(this.instance.getAppointmentsInstance().option('allowAllDayResize'));
    });

    QUnit.test('showAllDayPanel option value = true on init', function(assert) {
        this.createInstance();

        assert.equal(this.instance.option('showAllDayPanel'), true, 'showAllDayPanel option value is right on init');
    });

    QUnit.test('showCurrentTimeIndicator should have right default', function(assert) {
        this.createInstance();

        assert.equal(this.instance.option('showCurrentTimeIndicator'), true, 'showCurrentTimeIndicator option value is right on init');
    });

    QUnit.test('customizeDateNavigatorText should be passed to header & navigator', function(assert) {
        this.createInstance({
            currentView: 'week',
            currentDate: new Date(2017, 10, 25),
            customizeDateNavigatorText: function() {
                return 'abc';
            },
            views: ['week']
        });

        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(header.option('customizeDateNavigatorText')(), 'abc', 'option is passed correctly');
        assert.equal(navigator.option('customizeDateNavigatorText')(), 'abc', 'option is passed correctly');
    });

    QUnit.test('groupByDate option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'week',
            groupByDate: false
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('groupByDate'), false, 'workspace has correct groupByDate');

        this.instance.option('groupByDate', true);

        assert.equal(workSpaceWeek.option('groupByDate'), true, 'workspace has correct groupByDate');
    });

    QUnit.test('showCurrentTimeIndicator option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'week',
            showCurrentTimeIndicator: false
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('showCurrentTimeIndicator'), false, 'workspace has correct showCurrentTimeIndicator');

        this.instance.option('showCurrentTimeIndicator', true);

        assert.equal(workSpaceWeek.option('showCurrentTimeIndicator'), true, 'workspace has correct showCurrentTimeIndicator');
    });

    QUnit.test('indicatorTime option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'week',
            indicatorTime: new Date(2017, 8, 19)
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.deepEqual(workSpaceWeek.option('indicatorTime'), new Date(2017, 8, 19), 'workspace has correct indicatorTime');

        this.instance.option('indicatorTime', new Date(2017, 8, 20));

        assert.deepEqual(workSpaceWeek.option('indicatorTime'), new Date(2017, 8, 20), 'workspace has correct indicatorTime');
    });

    QUnit.test('indicatorUpdateInterval should have right default', function(assert) {
        this.createInstance({
            currentView: 'week'
        });

        assert.equal(this.instance.option('indicatorUpdateInterval'), 300000, 'workspace has correct indicatorUpdateInterval');
    });

    QUnit.test('indicatorUpdateInterval option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'week',
            indicatorUpdateInterval: 2000
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('indicatorUpdateInterval'), 2000, 'workspace has correct indicatorUpdateInterval');

        this.instance.option('indicatorUpdateInterval', 3000);

        assert.equal(workSpaceWeek.option('indicatorUpdateInterval'), 3000, 'workspace has correct indicatorUpdateInterval');
    });

    QUnit.test('shadeUntilCurrentTime should have right default', function(assert) {
        this.createInstance({
            currentView: 'week'
        });

        assert.equal(this.instance.option('shadeUntilCurrentTime'), false, 'workspace has correct shadeUntilCurrentTime');
    });

    QUnit.test('shadeUntilCurrentTime option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'week',
            shadeUntilCurrentTime: false
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('shadeUntilCurrentTime'), false, 'workspace has correct shadeUntilCurrentTime');

        this.instance.option('shadeUntilCurrentTime', true);

        assert.equal(workSpaceWeek.option('shadeUntilCurrentTime'), true, 'workspace has correct shadeUntilCurrentTime');
    });

    QUnit.test('appointments should be repainted after scheduler dimensions changing', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            dataSource: data,
            height: 500,
            width: 800
        });

        const initialAppointmentHeight = this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight();

        this.instance.option('height', 200);
        this.clock.tick();

        assert.notEqual(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight(), initialAppointmentHeight, 'Appointment was repainted');
    });

    QUnit.test('appointments should be repainted after scheduler hiding/showing and dimensions changing', function(assert) {
        const data = [{
            id: 1, text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 10, 30)
        }];

        this.createInstance({
            currentDate: new Date(2015, 1, 9),
            currentView: 'month',
            dataSource: data,
            maxAppointmentsPerCell: 2,
            height: 500,
            width: 800
        });

        const initialAppointmentHeight = this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight();

        triggerHidingEvent($('#scheduler'));
        $('#scheduler').hide();
        this.instance.option('height', 400);
        $('#scheduler').show();
        triggerShownEvent($('#scheduler'));
        this.clock.tick();

        assert.notEqual(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight(), initialAppointmentHeight, 'Appointment was repainted');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator', function(assert) {
        this.createInstance({
            currentView: 'week',
            views: [{
                type: 'week',
                name: 'Week',
                intervalCount: 3
            }]
        });

        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator, currentView is set by view.name', function(assert) {
        this.createInstance({
            currentView: 'WEEK1',
            views: [{
                type: 'day',
                name: 'DAY1',
                intervalCount: 5
            }, {
                type: 'week',
                name: 'WEEK1',
                intervalCount: 3
            }]
        });

        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
    });

    QUnit.test('view.intervalCount is passed to workspace & header & navigator, currentView is set by view.type', function(assert) {
        const views = [{
            type: 'day',
            name: 'DAY1',
            intervalCount: 5
        }, {
            type: 'week',
            name: 'WEEK1',
            intervalCount: 3
        }];

        this.createInstance({
            currentView: 'week',
            views: views,
            useDropDownViewSwitcher: false
        });

        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const viewSwitcher = header._viewSwitcher;
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 3, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 3, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 3, 'navigator has correct count');
        assert.deepEqual(viewSwitcher.option('selectedItem'), views[1], 'View switcher has correct selectedItem');
    });

    QUnit.test('view.startDate is passed to workspace & header & navigator', function(assert) {
        const date = new Date(2017, 3, 4);

        this.createInstance({
            currentView: 'week',
            currentDate: new Date(2017, 2, 10),
            views: [{
                type: 'week',
                name: 'Week',
                intervalCount: 3,
                startDate: date
            }]
        });

        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(workSpaceWeek.option('startDate'), date, 'workspace has correct startDate');
        assert.deepEqual(header.option('startDate'), date, 'header has correct startDate');
        assert.equal(navigator.option('date').getMonth(), 1, 'navigator has correct date depending on startDate');
    });

    QUnit.test('view.groupByDate is passed to workspace', function(assert) {
        this.createInstance({
            currentView: 'Week',
            views: [{
                type: 'week',
                name: 'Week',
                groupByDate: true
            },
            {
                type: 'day',
                name: 'Day',
                groupByDate: false
            }]
        });

        let workSpace = this.instance.getWorkSpace();

        assert.ok(workSpace.option('groupByDate'), 'workspace has correct groupByDate');
        this.instance.option('currentView', 'day');
        workSpace = this.instance.getWorkSpace();
        assert.notOk(workSpace.option('groupByDate'), 'workspace has correct groupByDate');
    });

    QUnit.test('currentView option should be passed to header correctly', function(assert) {
        this.createInstance({
            currentView: 'Week1',
            currentDate: new Date(2017, 10, 25),
            views: [{
                type: 'day',
                name: 'day1'
            }, {
                type: 'week',
                name: 'Week1'
            }]
        });

        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.deepEqual(header.option('currentView'), { type: 'week', name: 'Week1' }, 'header has correct currentView');
        assert.equal(navigator.option('step'), 'week', 'navigator has correct currentView');

        this.instance.option('currentView', 'day1');

        assert.deepEqual(header.option('currentView'), { type: 'day', name: 'day1' }, 'header has correct currentView');
        assert.equal(navigator.option('step'), 'day', 'navigator has correct currentView');
    });

    QUnit.test('currentView option changing should work correctly, when intervalCount & startDate is set', function(assert) {
        this.createInstance({
            currentView: 'day',
            currentDate: new Date(2019, 1, 23),
            views: [{
                type: 'day',
                name: 'day',
                intervalCount: 3,
                startDate: new Date(2019, 0, 1)
            }, {
                type: 'week',
                name: 'Week',
                intervalCount: 2,
                startDate: new Date(2019, 0, 30)
            }]
        });

        this.instance.option('currentView', 'week');
        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 2, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 2, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 2, 'navigator has correct count');

        assert.deepEqual(workSpaceWeek.option('startDate'), new Date(2019, 0, 30), 'workspace has correct startDate');
        assert.deepEqual(header.option('displayedDate'), new Date(2019, 1, 10), 'header has correct displayedDate');
        assert.deepEqual(header.option('currentDate'), new Date(2019, 1, 23), 'header has correct displayedDate');
        assert.equal(navigator.option('date').getMonth(), 1, 'navigator has correct date');
    });

    QUnit.test('currentView option changing should work correctly, when intervalCount on month view', function(assert) {
        this.createInstance({
            currentView: 'day',
            currentDate: new Date(2017, 4, 1),
            views: [ {
                name: '3 Days',
                type: 'day',
                intervalCount: 3,
                startDate: new Date(2017, 3, 30)
            }, {
                name: '2 Months',
                type: 'month',
                intervalCount: 2
            }]
        });

        this.instance.option('currentView', 'month');
        const workSpaceWeek = this.instance.getWorkSpace();
        const header = this.instance.getHeader();
        const navigator = header._navigator;

        assert.equal(workSpaceWeek.option('intervalCount'), 2, 'workspace has correct count');
        assert.equal(header.option('intervalCount'), 2, 'header has correct count');
        assert.equal(navigator.option('intervalCount'), 2, 'navigator has correct count');

        assert.deepEqual(workSpaceWeek.option('startDate'), null, 'workspace has correct startDate');
        assert.deepEqual(header.option('displayedDate'), new Date(2017, 4, 1), 'header has correct displayedDate');
        assert.deepEqual(header.option('currentDate'), new Date(2017, 4, 1), 'header has correct displayedDate');
        assert.equal(navigator.option('date').getMonth(), 4, 'navigator has correct date');
    });

    QUnit.test('maxAppointmentsPerCell should have correct default', function(assert) {
        this.createInstance({
            currentView: 'Week',
            views: [{
                type: 'week',
                name: 'Week',
            }]
        });

        assert.equal(this.instance.option('maxAppointmentsPerCell'), 'auto', 'Default Option value is right');
    });

    QUnit.test('cellDuration is passed to workspace', function(assert) {
        this.createInstance({
            currentView: 'week',
            cellDuration: 60
        });

        const workSpaceWeek = this.instance.getWorkSpace();

        assert.equal(workSpaceWeek.option('hoursInterval') * 60, this.instance.option('cellDuration'), 'workspace has correct cellDuration');

        this.instance.option('cellDuration', 20);

        assert.equal(workSpaceWeek.option('hoursInterval') * 60, this.instance.option('cellDuration'), 'workspace has correct cellDuration after change');
    });

    QUnit.test('accessKey is passed to workspace', function(assert) {
        this.createInstance({
            currentView: 'month',
            accessKey: 'o'
        });

        const workSpaceMonth = this.instance.getWorkSpace();
        assert.equal(workSpaceMonth.option('accessKey'), this.instance.option('accessKey'), 'workspace has correct accessKey');

        this.instance.option('accessKey', 'k');
        assert.equal(workSpaceMonth.option('accessKey'), this.instance.option('accessKey'), 'workspace has correct accessKey afterChange');
    });

    QUnit.test('the \'width\' option should be passed to work space on option changed if horizontal scrolling is enabled', function(assert) {
        this.createInstance();
        this.instance.option('crossScrollingEnabled', true);
        this.instance.option('width', 777);

        assert.equal(this.instance.getWorkSpace().option('width'), 777, 'option is OK');
    });

    QUnit.test('the \'width\' option should not be passed to work space on option changed if horizontal scrolling is not enabled', function(assert) {
        this.createInstance();
        this.instance.option('crossScrollingEnabled', false);
        this.instance.option('width', 777);

        assert.strictEqual(this.instance.getWorkSpace().option('width'), undefined, 'option is OK');
    });

    QUnit.test('Editing default option value', function(assert) {
        const defaultEditing = {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowResizing: true,
            allowDragging: true,
            allowTimeZoneEditing: false,
            allowEditingTimeZones: false
        };

        if(devices.real().platform !== 'generic') {
            defaultEditing.allowDragging = false;
            defaultEditing.allowResizing = false;
        }

        this.createInstance();
        const editing = this.instance.option('editing');

        assert.deepEqual(editing, defaultEditing);
    });

    QUnit.test('Scheduler should be repainted after currentTime indication toggling', function(assert) {
        this.createInstance({
            showCurrentTimeIndicator: true,
            currentDate: new Date(2017, 11, 18),
            indicatorTime: new Date(2017, 11, 18, 16, 45),
            views: ['timelineWeek'],
            view: 'timelineWeek'
        });

        const repaintStub = sinon.stub(this.instance, 'repaint');

        this.instance.option('showCurrentTimeIndicator', false);

        assert.ok(repaintStub.calledOnce, 'Sheduler was repainted');
    });

    QUnit.test('Filter options should be updated when dataSource is changed', function(assert) {
        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ['week'],
            currentView: 'week',
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');

        this.instance.option('dataSource', [
            { startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() },
            { startDate: new Date(2016, 2, 15, 3).toString(), endDate: new Date(2016, 2, 15, 4).toString() }
        ]);

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 2, 'Appointments are rendered');
    });

    QUnit.test('Appointments should be deleted from DOM when needed', function(assert) {
        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ['week', 'month'],
            currentView: 'week',
            dataSource: [{ startDate: new Date(2016, 2, 15, 1).toString(), endDate: new Date(2016, 2, 15, 2).toString() }]
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');

        this.instance.option('currentDate', new Date(2016, 2, 23));
        this.instance.option('currentView', 'month');
        this.instance.option('currentView', 'week');

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 0, 'Appointments were removed');
    });

    ['virtual', 'standard'].forEach((scrollingMode) => {
        QUnit.test(`selectedCellData option should be updated after view changing when scrolling is ${scrollingMode}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2018, 4, 10),
                views: ['week', 'month'],
                currentView: 'week',
                focusStateEnabled: true,
                scrolling: { mode: scrollingMode },
            });

            const keyboard = keyboardMock(this.instance.getWorkSpace().$element());
            const cell = this.scheduler.workSpace.getCell(7);

            pointerMock(cell).start().click();
            keyboard.keyDown('down', { shiftKey: true });

            assert.deepEqual(this.instance.option('selectedCellData'), [{
                startDate: new Date(2018, 4, 6, 0, 30),
                endDate: new Date(2018, 4, 6, 1),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }, {
                startDate: new Date(2018, 4, 6, 1),
                endDate: new Date(2018, 4, 6, 1, 30),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }], 'correct cell data');

            this.instance.option('currentView', 'month');
            assert.deepEqual(this.instance.option('selectedCellData'), [], 'selectedCellData was cleared');
        });

        QUnit.test(`selectedCellData option should be updated after currentDate changing when scrolling is ${scrollingMode}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2018, 4, 10),
                views: ['week', 'month'],
                currentView: 'week',
                focusStateEnabled: true,
                scrolling: { mode: scrollingMode },
            });

            const keyboard = keyboardMock(this.instance.getWorkSpace().$element());
            const cell = this.scheduler.workSpace.getCell(7);

            pointerMock(cell).start().click();
            keyboard.keyDown('down', { shiftKey: true });

            assert.deepEqual(this.instance.option('selectedCellData'), [{
                startDate: new Date(2018, 4, 6, 0, 30),
                endDate: new Date(2018, 4, 6, 1),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }, {
                startDate: new Date(2018, 4, 6, 1),
                endDate: new Date(2018, 4, 6, 1, 30),
                allDay: false,
                groups: undefined,
                groupIndex: 0,
            }], 'correct cell data');

            this.instance.option('currentDate', new Date(2018, 5, 10));
            assert.deepEqual(this.instance.option('selectedCellData'), [], 'selectedCellData was cleared');
        });
    });

    QUnit.test('Multiple reloading should be avoided after some options changing (T656320)', function(assert) {
        let counter = 0;

        this.createInstance();

        this.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    counter++;
                    return [];
                }
            })
        }));
        assert.equal(counter, 1, 'Data source was reloaded after dataSource option changing');
        this.instance.beginUpdate();
        this.instance.option('startDayHour', 10);
        this.instance.option('endDayHour', 18);
        this.instance.endUpdate();
        assert.equal(counter, 2, 'Data source was reloaded one more time after some options changing');
    });

    QUnit.test('Multiple reloading should be avoided after repaint (T737181)', function(assert) {
        let counter = 0;

        this.createInstance();

        this.instance.option('dataSource', new DataSource({
            store: new CustomStore({
                load: function() {
                    counter++;
                    return [];
                }
            })
        }));
        assert.equal(counter, 1, 'Data source was reloaded after dataSource option changing');
        this.instance.repaint();
        assert.equal(counter, 1, 'Data source wasn\'t reloaded after repaint');
    });

    QUnit.test('Multiple reloading should be avoided after some currentView options changing (T656320)', function(assert) {
        let counter = 0;
        let resourceCounter = 0;

        this.createInstance({
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function() {
                        counter++;
                        return [];
                    }
                })
            }),
            groups: ['owner.id'],
            resources: [{
                fieldExpr: 'owner.id',
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                resourceCounter++;
                                assert.equal(counter, resourceCounter - 1);
                                d.resolve([]);
                            }, 100);

                            return d.promise();
                        }
                    })
                })
            }],
        });
        this.clock.tick(100);
        assert.equal(resourceCounter, 1, 'Resources was reloaded after dataSource option changing');
        this.instance.beginUpdate();
        this.instance.option('currentView', 'timelineDay');
        this.instance.option('currentView', 'timelineMonth');
        this.instance.endUpdate();
        this.clock.tick(100);
        assert.equal(resourceCounter, 2, 'Resources was reloaded one more time after dataSource option changing');
    });


    [
        { startDayHour: 0, endDayHour: 0 },
        { startDayHour: 2, endDayHour: 0 }
    ].forEach(dayHours => {
        QUnit.test(`Generate error if option changed to startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    this.instance.option('startDayHour', dayHours.startDayHour);
                    this.instance.option('endDayHour', dayHours.endDayHour);
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });

        QUnit.test(`Generate error if workSpace option changed to startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 4, 24),
                views: [{
                    name: 'day',
                    type: 'day'
                }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    const instance = this.instance;
                    instance.option('views[0].startDayHour', dayHours.startDayHour);
                    instance.option('views[0].endDayHour', dayHours.endDayHour);
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });

        QUnit.test(`Generate error if currentView changed to view.startDayHour: ${dayHours.startDayHour} >= view.endDayHour: ${dayHours.endDayHour}`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 4, 24),
                dataSource: [
                    {
                        startDate: new Date(2015, 4, 24, 0),
                        endDate: new Date(2015, 4, 24, 2),
                        allDay: true
                    }
                ],
                views: [{
                    name: 'day',
                    type: 'day'
                }, {
                    name: 'week',
                    type: 'week',
                    startDayHour: dayHours.startDayHour,
                    endDayHour: dayHours.endDayHour
                }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });

            assert.throws(
                () => {
                    this.instance.option('currentView', 'week');
                },
                e => /E1058/.test(e.message),
                'E1058 Error message'
            );
        });
    });

    [
        { startDayHour: 0, endDayHour: 24, cellDuration: 95 },
        { startDayHour: 8, endDayHour: 24, cellDuration: 90 }
    ].forEach(config => {
        QUnit.test(`Options changing, generate warning if cellDuration: ${config.cellDuration} could not divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 4, 24),
                views: ['day'],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 12
            });
            this.instance.option({
                startDayHour: config.startDayHour,
                endDayHour: config.endDayHour,
                cellDuration: config.cellDuration
            });

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1015', 'warning has correct error id');
        });
    });

    [
        { currentView: 'WEEK1' },
        { currentView: 'WEEK2' }
    ].forEach(view => {
        QUnit.test(`View changing, generate warning if cellDuration: ${config.cellDuration} could not divide the range from startDayHour: ${config.startDayHour} to the endDayHour: ${config.endDayHour} into even intervals`, function(assert) {
            this.createInstance({
                currentDate: new Date(2015, 4, 24),
                views: ['day',
                    {
                        type: 'week',
                        name: 'WEEK1',
                        cellDuration: 7
                    },
                    {
                        type: 'week',
                        name: 'WEEK2',
                        cellDuration: 95
                    }],
                currentView: 'day',
                startDayHour: 8,
                endDayHour: 24
            });
            this.instance.option('currentView', view.currentView);

            assert.equal(errors.log.callCount, 1, 'warning has been called once');
            assert.equal(errors.log.getCall(0).args[0], 'W1015', 'warning has correct error id');
        });
    });

    QUnit.test('Data source should not be loaded on option change if it is already being loaded (T916558)', function(assert) {
        const dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            currentDate: new Date(2015, 4, 24),
            views: ['day', 'workWeek', { type: 'week' }],
            currentView: 'day',
            dataSource,
        });

        const initMarkupSpy = sinon.spy(this.instance, '_initMarkup');
        const reloadDataSourceSpy = sinon.spy(this.instance, '_reloadDataSource');

        const nextDataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve([]);
                    }, 300);

                    return d.promise();
                }
            })
        });
        this.instance.option({
            'dataSource': nextDataSource,
        });
        this.instance.option({
            'views[2].intervalCount': 2,
            'views[2].startDate': new Date(),
        });

        this.clock.tick(400);

        assert.ok(initMarkupSpy.calledTwice, 'Init markup was called on the second and third option change');
        assert.ok(reloadDataSourceSpy.calledOnce, '_reloadDataSource was not called on init mark up');
    });
})('Options');

(function() {
    QUnit.module('Events', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
            };
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test('onAppointmentAdding', function(assert) {
        const addingSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdding: addingSpy,
            dataSource: []
        });

        const newAppointment = {
            startDate: new Date(2015, 1, 9, 16),
            endDate: new Date(2015, 1, 9, 17),
            text: 'caption'
        };

        this.instance.addAppointment(newAppointment);
        this.clock.tick();


        const args = addingSpy.getCall(0).args[0];

        assert.ok(addingSpy.calledOnce, 'onAppointmentAdding was called');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
        assert.deepEqual(args.appointmentData, newAppointment, 'Appointment field is OK');
    });

    QUnit.test('Appointment should not be added to the data source if \'cancel\' flag is defined as true', function(assert) {
        const dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
        this.clock.tick();

        assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
    });

    QUnit.test('Appointment should not be added to the data source if \'cancel\' flag is defined as true during async operation', function(assert) {
        const dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
        this.clock.tick(200);

        assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
    });

    QUnit.test('Appointment should not be added to the data source if \'cancel\' flag is defined as Promise', function(assert) {
        const promise = new Promise(function(resolve) {
            setTimeout(function() {
                resolve(true);
            }, 200);
        });
        const dataSource = new DataSource({
            store: []
        });
        this.createInstance({
            onAppointmentAdding: function(args) {
                args.cancel = promise;
            },
            dataSource: dataSource
        });

        this.instance.addAppointment({ startDate: new Date(), text: 'Appointment 1' });
        this.clock.tick(200);

        promise.then(function() {
            assert.strictEqual(dataSource.items().length, 0, 'Insert operation is canceled');
        });

        return promise;
    });

    QUnit.test('onAppointmentAdded', function(assert) {
        const addedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdded: addedSpy,
            dataSource: []
        });

        const newAppointment = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        this.instance.addAppointment(newAppointment);
        this.clock.tick();

        const args = addedSpy.getCall(0).args[0];

        assert.ok(addedSpy.calledOnce, 'onAppointmentAdded was called');
        assert.deepEqual(args.appointmentData, newAppointment, 'Appointment field is OK');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.strictEqual(args.error, undefined, 'Error field is not defined');
    });

    QUnit.test('onAppointmentAdded should have error field in args if an error occurs while data inserting', function(assert) {
        const addedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentAdded: addedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: noop,
                    insert: function() {
                        return $.Deferred().reject(new Error('Unknown error occurred'));
                    }
                })
            })
        });

        this.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' });
        this.clock.tick();

        const error = addedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, 'Error field is defined');
        assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
    });


    QUnit.test('onAppointmentUpdating', function(assert) {
        const updatingSpy = sinon.spy(noop);
        const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

        this.createInstance({
            onAppointmentUpdating: updatingSpy,
            dataSource: new DataSource({ store: oldData })
        });

        this.instance.updateAppointment($.extend({}, oldData[0]), newData);
        this.clock.tick();

        const args = updatingSpy.getCall(0).args[0];

        assert.ok(updatingSpy.calledOnce, 'onAppointmentUpdating was called');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
        assert.deepEqual(args.newData, newData, 'newData field is OK');
        assert.deepEqual(args.oldData, oldData[0], 'oldData field is OK');
    });

    QUnit.test('Appointment should not be updated if \'cancel\' flag is defined as true', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(appointments[0], { startDate: new Date(), text: 'Appointment 1' });
        this.clock.tick();

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Update operation is canceled');
    });

    QUnit.test('Appointment form should not be updated if \'cancel\' flag is defined as true (T653358)', function(assert) {
        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);

        try {
            const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
            const dataSource = new DataSource({
                store: appointments
            });

            this.createInstance({
                timeZone: 'Etc/UTC',
                onAppointmentUpdating: function(args) {
                    args.cancel = true;
                },
                dataSource: dataSource,
                currentDate: new Date(2015, 1, 9)
            });

            this.instance.showAppointmentPopup(appointments[0]);
            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

            this.clock.tick();

            const appointmentForm = this.instance._appointmentPopup._appointmentForm;

            assert.deepEqual(appointmentForm.option('formData').startDate, new Date(2015, 1, 9, 13), 'Form data is correct');
        } finally {
            tzOffsetStub.restore();
        }
    });

    QUnit.test('Appointment should not be updated if \'cancel\' flag is defined as true during async operation', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(appointments[0], { startDate: new Date(), text: 'Appointment 1' });
        this.clock.tick(200);

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Update operation is canceled');
    });

    QUnit.test('Appointment should be returned to the initial state if \'cancel\' flag is defined as true during async operation', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                const d = $.Deferred();
                args.cancel = d.promise();
                setTimeout(function() {
                    d.reject();
                }, 200);
            },
            currentView: 'week',
            dataSource: [{ startDate: new Date(2015, 1, 11), endDate: new Date(2015, 1, 13), text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialLeftPosition = translator.locate($appointment).left;
        const cellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();
        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left').eq(0)).start();

        pointer.dragStart().drag(-cellWidth * 2, 0).dragEnd();
        this.clock.tick(200);
        assert.equal(translator.locate(this.instance.$element().find('.dx-scheduler-appointment').eq(0)).left, initialLeftPosition, 'Left position is OK');
    });

    QUnit.test('Appointment should have initial position if \'cancel\' flag is defined as true during update operation', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        let $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialPosition = translator.locate($appointment);

        $(this.instance.$element().find('.dx-scheduler-date-table-cell').eq(5)).trigger(dragEvents.enter);

        pointerMock($appointment)
            .start()
            .down(initialPosition.left + 10, initialPosition.top + 10)
            .move(initialPosition.left + 10, initialPosition.top + 100)
            .up();

        $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        assert.deepEqual(translator.locate($appointment), initialPosition, 'Appointments position is OK');
    });

    QUnit.test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (day view)', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialHeight = $appointment.outerHeight();
        const cellHeight = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerHeight();

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom').eq(0)).start();
        pointer.dragStart().drag(0, cellHeight * 2).dragEnd();

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerHeight(), initialHeight, 'Height is OK');
    });

    QUnit.test('Appointment should have initial size if "cancel" flag is defined as true during update operation (month view)', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            views: ['month'],
            currentView: 'month',
            dataSource: [{ startDate: new Date(2015, 1, 9, 1), endDate: new Date(2015, 1, 9, 2), text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialWidth = $appointment.outerWidth();
        const cellWidth = this.instance.$element().find('.dx-scheduler-date-table-cell').eq(0).outerWidth();

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
        pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

        assert.roughEqual(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerWidth(), initialWidth, 0.5, 'Width is OK');
    });

    QUnit.test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (all day)', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: 'week',
            dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 10), text: 'caption', allDay: true }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialWidth = $appointment.outerWidth();
        const cellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
        pointer.dragStart().drag(cellWidth * 2, 0).dragEnd();

        assert.roughEqual(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerWidth(), initialWidth, 1, 'Width is OK');
    });

    QUnit.test('Appointment should have initial size if \'cancel\' flag is defined as true during update operation (if appointment takes few days)', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: 'week',
            dataSource: [{ startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 11), text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialWidth = $appointment.outerWidth();
        const cellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();

        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-right').eq(0)).start();
        pointer.dragStart().drag(cellWidth * 3, 0).dragEnd();

        assert.roughEqual(this.instance.$element().find('.dx-scheduler-appointment').eq(0).outerWidth(), 1.1, initialWidth, 'Width is OK');
    });

    QUnit.test('Appointment should have initial left coordinate if \'cancel\' flag is defined as true during resize operation', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: 'week',
            dataSource: [{ startDate: new Date(2015, 1, 11), endDate: new Date(2015, 1, 13), text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialLeftPosition = translator.locate($appointment).left;
        const cellWidth = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerWidth();
        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-left').eq(0)).start();

        pointer.dragStart().drag(-cellWidth * 2, 0).dragEnd();

        assert.equal(translator.locate(this.instance.$element().find('.dx-scheduler-appointment').eq(0)).left, initialLeftPosition, 'Left position is OK');
    });

    QUnit.test('Appointment should have initial top coordinate if \'cancel\' flag is defined as true during resize operation', function(assert) {
        this.createInstance({
            onAppointmentUpdating: function(args) {
                args.cancel = true;
            },
            currentView: 'week',
            dataSource: [{ startDate: 1423620000000, endDate: 1423627200000, text: 'caption' }],
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9)
        });

        const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        const initialTopPosition = translator.locate($appointment).top;
        const cellHeight = this.instance.$element().find('.dx-scheduler-all-day-table-cell').eq(0).outerHeight();
        const pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-top').eq(0)).start();

        pointer.dragStart().drag(0, -cellHeight * 2).dragEnd();

        assert.equal(translator.locate(this.instance.$element().find('.dx-scheduler-appointment').eq(0)).top, initialTopPosition, 'Top position is OK');
    });

    QUnit.test('onAppointmentUpdated', function(assert) {
        const updatedSpy = sinon.spy(noop);
        const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

        this.createInstance({
            onAppointmentUpdated: updatedSpy,
            dataSource: new DataSource({ store: oldData }),
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.updateAppointment(oldData[0], newData);
        this.clock.tick();

        const args = updatedSpy.getCall(0).args[0];

        assert.ok(updatedSpy.calledOnce, 'onAppointmentUpdated was called');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.deepEqual(args.appointmentData, newData, 'newData field is OK');
        assert.strictEqual(args.error, undefined, 'Error field is not defined');
    });

    QUnit.test('onAppointmentUpdated should have error field in args if an error occurs while data updating', function(assert) {
        const updatedSpy = sinon.spy(noop);
        const oldData = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const newData = { startDate: new Date(2015, 1, 10, 16), endDate: new Date(2015, 1, 10, 17), text: 'title' };

        this.createInstance({
            onAppointmentUpdated: updatedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: function(options) {
                        const d = $.Deferred();
                        d.resolve(oldData);
                        return d.promise();
                    },
                    update: function() {
                        return $.Deferred().reject(new Error('Unknown error occurred'));
                    }
                })
            })
        });

        this.instance.updateAppointment(oldData[0], newData);
        this.clock.tick();

        const error = updatedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, 'Error field is defined');
        assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
    });

    QUnit.test('onAppointmentDeleting', function(assert) {
        const deletingSpy = sinon.spy(noop);
        const appointments = [
            { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }
        ];

        this.createInstance({
            onAppointmentDeleting: deletingSpy,
            currentDate: new Date(2015, 3, 29),
            dataSource: new DataSource({
                store: appointments
            })
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        const args = deletingSpy.getCall(0).args[0];

        assert.ok(deletingSpy.calledOnce, 'onAppointmentDeleting was called');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }, 'Appointment field is OK');
        assert.strictEqual(args.cancel, false, '\'Cancel\' flag is OK');
    });

    QUnit.test('Appointment should not be deleted if \'cancel\' flag is defined as true', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = true;
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Delete operation is canceled');
    });

    QUnit.test('Appointment should not be deleted if \'cancel\' flag is defined as true during async operation', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(true);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick(200);

        assert.deepEqual(dataSource.items(), [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }], 'Delete operation is canceled');
    });

    QUnit.test('Appointment should be deleted correctly if \'cancel\' flag is defined as false during async operation', function(assert) {
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            onAppointmentDeleting: function(args) {
                args.cancel = $.Deferred();
                setTimeout(function() {
                    args.cancel.resolve(false);
                }, 200);
            },
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick(200);

        assert.equal(dataSource.items().length, 0, 'Delete operation is completed');
    });

    QUnit.test('onAppointmentDeleted', function(assert) {
        const deletedSpy = sinon.spy(noop);
        const appointments = [
            { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }
        ];

        this.createInstance({
            onAppointmentDeleted: deletedSpy,
            currentDate: new Date(2015, 3, 29),
            dataSource: new DataSource({
                store: appointments
            })
        });

        this.instance.deleteAppointment(appointments[0]);
        this.clock.tick();

        const args = deletedSpy.getCall(0).args[0];
        assert.ok(deletedSpy.calledOnce, 'onAppointmentDeleted was called');
        assert.equal(args.element, this.instance.element(), 'Element field is OK');
        assert.equal(args.component, this.instance, 'Component field is OK');
        assert.deepEqual(args.appointmentData, { startDate: new Date(2015, 3, 29, 5), text: 'Appointment 1', endDate: new Date(2015, 3, 29, 6) }, 'newData field is OK');
        assert.strictEqual(args.error, undefined, 'Error field is not defined');
    });

    QUnit.test('onAppointmentDeleted should have error field in args if an error occurs while data deleting', function(assert) {
        const deletedSpy = sinon.spy(noop);

        this.createInstance({
            onAppointmentDeleted: deletedSpy,
            dataSource: new DataSource({
                store: new CustomStore({
                    load: noop,
                    remove: function() {
                        return $.Deferred().reject(new Error('Unknown error occurred'));
                    }
                })
            })
        });

        this.instance.deleteAppointment({});
        this.clock.tick();

        const error = deletedSpy.getCall(0).args[0].error;

        assert.ok(error instanceof Error, 'Error field is defined');
        assert.equal(error.message, 'Unknown error occurred', 'Error message is OK');
    });

    QUnit.test('onAppointmentRendered', function(assert) {
        const renderedSpy = sinon.spy(noop);
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        const args = renderedSpy.getCall(0).args[0];

        assert.ok(renderedSpy.calledOnce, 'onAppointmentRendered was called');
        assert.deepEqual(args.component, this.instance, 'component is scheduler instance');
        assert.deepEqual($(args.element).get(0), this.instance.$element().get(0), 'element is $scheduler');
        assert.deepEqual(args.appointmentData, appointments[0], 'appointment is OK');
        assert.deepEqual($(args.appointmentElement).get(0), this.instance.$element().find('.dx-scheduler-appointment').get(0), 'appointment element is OK');
    });

    QUnit.test('onAppointmentRendered should called on each recurrence', function(assert) {
        const renderedSpy = sinon.spy(noop);
        const appointments = [{
            startDate: new Date(2015, 1, 9, 16),
            endDate: new Date(2015, 1, 9, 17),
            text: 'caption',
            recurrenceRule: 'FREQ=DAILY;COUNT=2',
        }];
        const dataSource = new DataSource({
            store: appointments
        });

        this.createInstance({
            currentView: 'week',
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(renderedSpy.calledTwice, 'onAppointmentRendered was called twice');
    });

    QUnit.test('onAppointmentRendered should updated correctly', function(assert) {
        this.createInstance({
            dataSource: new DataSource({
                store: [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }]
            }),
            onAppointmentRendered: function() { return 1; },
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.option('onAppointmentRendered', function() { return 2; });
        const appointmentsCollection = this.instance.getAppointmentsInstance();

        assert.equal(appointmentsCollection.option('onItemRendered')(), 2, 'option is updated correctly');
    });

    QUnit.test('onAppointmentRendered should fires when appointment is completely rendered', function(assert) {
        this.createInstance({
            editing: {
                allowResizing: true,
                allowDragging: true
            },
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: 'caption',
                    groupId: 1,
                    recurrenceRule: 'FREQ=DAILY;INTERVAL=2'
                }],
            }),
            resources: [
                {
                    field: 'groupId',
                    dataSource: [
                        {
                            text: 'a',
                            id: 1,
                            color: '#ff0000'
                        }
                    ]
                }
            ],
            onAppointmentRendered: function(args) {
                const $appointment = $(args.appointmentElement);

                assert.equal(new Color($appointment.css('backgroundColor')).toHex(), '#ff0000', 'Resource color is applied');
                assert.ok($appointment.attr('data-groupid-1'), 'Resource data attribute is defined');
                assert.ok($appointment.hasClass('dx-scheduler-appointment-recurrence'), 'Recurrent class is defined');
                assert.ok($appointment.hasClass('dx-resizable'), 'Resizable class is defined');
            },
            currentDate: new Date(2015, 1, 9)
        });
    });

    QUnit.test('onAppointmentRendered should fires when appointment is completely rendered(month view)', function(assert) {
        assert.expect(2);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 20),
                    text: 'caption'
                }],
            }),
            views: ['month'],
            currentView: 'month',
            maxAppointmentsPerCell: 1,
            onAppointmentRendered: function(args) {
                assert.equal($(args.appointmentElement).find('.dx-scheduler-appointment-reduced-icon').length, 1, 'Appointment reduced icon is applied');
            },
            currentDate: new Date(2015, 1, 9)
        });
    });

    QUnit.test('onAppointmentRendered should contain information about all recurring appts', function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: 'caption',
                    recurrenceRule: 'FREQ=DAILY'
                }
            ]),
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;
                const appointmentIndex = $(e.appointmentElement).index();

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 16).getTime(), 'Start date is OK');
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 17).getTime(), 'End date is OK');
            },
            currentDate: new Date(2015, 1, 9),
            views: ['week'],
            currentView: 'week'
        });
    });

    QUnit.test('onAppointmentRendered should fires only for rerendered appointments', function(assert) {
        assert.expect(2);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 11),
                    text: 'caption1'
                }],
            }),
            views: ['month'],
            currentView: 'month',
            height: 600,
            onAppointmentRendered: function(args) {
                assert.ok(true, 'Appointment was rendered');
            },
            currentDate: new Date(2015, 1, 9)
        });

        this.instance.addAppointment({
            startDate: new Date(2015, 1, 12, 10),
            endDate: new Date(2015, 1, 13, 20),
            text: 'caption2'
        });
        this.clock.tick();
    });

    QUnit.test('All appointments should be rerendered after cellDuration changed', function(assert) {
        assert.expect(6);

        this.createInstance({
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 1, 10),
                    endDate: new Date(2015, 1, 11),
                    text: 'caption1'
                }, {
                    startDate: new Date(2015, 1, 12, 10),
                    endDate: new Date(2015, 1, 13, 20),
                    text: 'caption2'
                }],
            }),
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            cellDuration: 60,
            onAppointmentRendered: function(args) {
                assert.ok(true, 'Appointment was rendered');
            },
            currentDate: new Date(2015, 1, 9)
        });
        const appointments = this.instance.getAppointmentsInstance();
        const initialItems = appointments.option('items');

        this.instance.option('cellDuration', 100);
        this.clock.tick();

        const changedItems = appointments.option('items');

        assert.notDeepEqual(initialItems[0].settings, changedItems[0].settings, 'Item\'s settings were changed');
        assert.notDeepEqual(initialItems[1].settings, changedItems[1].settings, 'Item\'s settings were changed');
    });

    QUnit.test('targetedAppointmentData should return correct allDay appointmentData', function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9),
                    endDate: new Date(2015, 1, 10),
                    allDay: true,
                    text: 'All day appointment'
                }
            ]),
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9).getTime(), 'Start date is OK');
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 10).getTime(), 'End date is OK');
            },
            currentDate: new Date(2015, 1, 9),
            views: ['week'],
            currentView: 'week'
        });
    });


    QUnit.test('onAppointmentRendered should contain information about all recurring appts on agenda view', function(assert) {
        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: 'caption',
                    recurrenceRule: 'FREQ=DAILY'
                }
            ]),
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;
                const appointmentIndex = $(e.appointmentElement).index();

                assert.equal(targetedAppointmentData.startDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 16).getTime(), 'Start date is OK');
                assert.equal(targetedAppointmentData.endDate.getTime(), new Date(2015, 1, 9 + appointmentIndex, 17).getTime(), 'End date is OK');
            },
            currentDate: new Date(2015, 1, 9),
            views: ['agenda'],
            currentView: 'agenda'
        });
    });

    QUnit.test('agenda should be rendered correctly after changing groups on view changing(T847884)', function(assert) {
        const priorityData = [
            {
                text: 'Low Priority',
                id: 1,
                color: '#1e90ff'
            }, {
                text: 'High Priority',
                id: 2,
                color: '#ff9747'
            }
        ];

        this.createInstance({
            dataSource: [
                {
                    text: 'Upgrade Personal Computers',
                    priorityId: 1,
                    startDate: new Date(2018, 4, 21, 9),
                    endDate: new Date(2018, 4, 21, 11, 30)
                }],
            views: ['week', 'agenda'],
            onOptionChanged: function(e) {
                if(e.name === 'currentView') {
                    e.component._customUpdate = true;
                    e.component.beginUpdate();
                    e.component.option('groups', []);
                }
                if(e.name === 'groups' && e.component._customUpdate === true) {
                    e.component._customUpdate = false;
                    e.component.endUpdate();
                }
            },
            currentView: 'week',
            currentDate: new Date(2018, 4, 21),
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ]
        });

        this.instance.option('currentView', 'agenda');
        assert.ok(true, 'currentView was changed to agenda correctly');
    });

    QUnit.test('onAppointmentRendered should not contain information about particular appt resources if there are not groups(T413561)', function(assert) {
        const resourcesSpy = sinon.spy(dxScheduler.prototype, 'setTargetedAppointmentResources');

        this.createInstance({
            dataSource: new DataSource([
                {
                    startDate: new Date(2015, 1, 9, 16),
                    endDate: new Date(2015, 1, 9, 17),
                    text: 'caption',
                    recurrenceRule: 'FREQ=YEARLY'
                }
            ]),
            currentDate: new Date(2015, 1, 9),
            views: ['week'],
            currentView: 'week'
        });

        assert.equal(resourcesSpy.callCount, 2, 'Resources aren\'t required');
    });

    QUnit.test('onAppointmentClick should fires when appointment is clicked', function(assert) {
        assert.expect(3);

        const items = [{
            startDate: new Date(2015, 2, 10),
            endDate: new Date(2015, 2, 13),
            text: 'Task caption'
        }, {
            startDate: new Date(2015, 2, 15),
            endDate: new Date(2015, 2, 20),
            text: 'Task caption'
        }];

        this.createInstance({
            dataSource: new DataSource({
                store: items
            }),
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2015, 2, 9),
            height: 600,
            onAppointmentClick: function(e) {
                assert.deepEqual(isRenderer(e.appointmentElement), !!config().useJQuery, 'appointmentElement is correct');
                assert.deepEqual($(e.appointmentElement)[0], $item[0], 'appointmentElement is correct');
                assert.strictEqual(e.appointmentData, items[0], 'appointmentData is correct');
            }
        });

        const $item = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        $($item).trigger('dxclick');
    });

    QUnit.test('Args of onAppointmentClick should contain data about particular appt', function(assert) {
        assert.expect(2);

        const items = [{
            text: 'Task caption',
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            recurrence: { rule: 'FREQ=DAILY' }
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2015, 2, 9),
            startDateExpr: 'start.date',
            endDateExpr: 'end.date',
            recurrenceRuleExpr: 'recurrence.rule',
            onAppointmentClick: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.start.date.getTime(), new Date(2015, 2, 11, 1).getTime(), 'Start date is OK');
                assert.equal(targetedAppointmentData.end.date.getTime(), new Date(2015, 2, 11, 2).getTime(), 'End date is OK');
            }
        });

        $(this.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
    });

    QUnit.test('Args of onAppointmentClick/Rendered should contain data about particular grouped appt', function(assert) {
        assert.expect(6);

        const items = [{
            text: 'Task caption',
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            owner: { id: [1, 2] },
            priority: 1
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            groups: ['owner.id', 'priority'],
            resources: [{
                fieldExpr: 'owner.id',
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: 'A'
                    }, {
                        id: 2,
                        text: 'B'
                    }
                ]
            }, {
                fieldExpr: 'priority',
                dataSource: [{ id: 1, text: 'Low' }]
            }],
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2015, 2, 9),
            startDateExpr: 'start.date',
            endDateExpr: 'end.date',
            recurrenceRuleExpr: 'recurrence.rule',
            onAppointmentClick: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.owner.id, 2, 'Owner id is OK on click');
                assert.equal(targetedAppointmentData.priority, 1, 'Priority is OK on click');
            },
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;
                let expectedOwnerId = 1;

                if($(e.appointmentElement).index() === 1) {
                    expectedOwnerId = 2;
                }

                assert.equal(targetedAppointmentData.owner.id, expectedOwnerId, 'Owner id is OK on rendered');
                assert.equal(targetedAppointmentData.priority, 1, 'Priority is OK on rendered');
            }
        });

        $(this.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
    });

    QUnit.test('Args of onAppointmentClick should contain data about particular grouped appt on Agenda view', function(assert) {
        assert.expect(6);

        const items = [{
            text: 'Task caption',
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            owner: { id: [1, 2] },
            priority: 1
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            groups: ['owner.id', 'priority'],
            resources: [{
                fieldExpr: 'owner.id',
                allowMultiple: true,
                dataSource: [
                    {
                        id: 1,
                        text: 'A'
                    }, {
                        id: 2,
                        text: 'B'
                    }
                ]
            }, {
                fieldExpr: 'priority',
                dataSource: [{ id: 1, text: 'Low' }]
            }],
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 2, 9),
            startDateExpr: 'start.date',
            endDateExpr: 'end.date',
            recurrenceRuleExpr: 'recurrence.rule',
            onAppointmentClick: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.owner.id, 2, 'Owner id is OK');
                assert.equal(targetedAppointmentData.priority, 1, 'Priority is OK');
            },
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;
                let expectedOwnerId = 1;

                if($(e.appointmentElement).index() === 1) {
                    expectedOwnerId = 2;
                }

                assert.equal(targetedAppointmentData.owner.id, expectedOwnerId, 'Owner id is OK on rendered');
                assert.equal(targetedAppointmentData.priority, 1, 'Priority is OK on rendered');
            }
        });

        $(this.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
    });

    QUnit.test('onAppointmentContextMenu should fires when appointment context menu is triggered', function(assert) {
        assert.expect(3);

        const items = [{
            startDate: new Date(2015, 2, 10),
            endDate: new Date(2015, 2, 13),
            text: 'Task caption'
        }, {
            startDate: new Date(2015, 2, 15),
            endDate: new Date(2015, 2, 20),
            text: 'Task caption'
        }];

        this.createInstance({
            dataSource: new DataSource({
                store: items
            }),
            views: ['month'],
            currentView: 'month',
            height: 600,
            currentDate: new Date(2015, 2, 9),
            onAppointmentContextMenu: function(e) {
                assert.deepEqual(isRenderer(e.appointmentElement), !!config().useJQuery, 'appointmentElement is correct');
                assert.deepEqual($(e.appointmentElement)[0], $item[0], 'appointmentElement is correct');
                assert.strictEqual(e.appointmentData, items[0], 'appointmentData is correct');
            }
        });

        const $item = $(this.instance.$element().find('.dx-scheduler-appointment').eq(0));
        $($item).trigger('dxcontextmenu');
    });

    QUnit.test('Args of onAppointmentContextMenu should contain data about particular appt', function(assert) {
        assert.expect(2);

        const items = [{
            text: 'Task caption',
            start: { date: new Date(2015, 2, 10, 1) },
            end: { date: new Date(2015, 2, 10, 2) },
            recurrence: { rule: 'FREQ=DAILY' }
        }];

        this.createInstance({
            dataSource: new DataSource(items),
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2015, 2, 9),
            startDateExpr: 'start.date',
            endDateExpr: 'end.date',
            recurrenceRuleExpr: 'recurrence.rule',
            onAppointmentContextMenu: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;

                assert.equal(targetedAppointmentData.start.date.getTime(), new Date(2015, 2, 11, 1).getTime(), 'Start date is OK');
                assert.equal(targetedAppointmentData.end.date.getTime(), new Date(2015, 2, 11, 2).getTime(), 'End date is OK');
            }
        });

        $(this.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxcontextmenu');
    });

    QUnit.test('Cell click option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'month',
            onCellClick: sinon.stub().returns(1)
        });
        const workspaceMonth = this.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option('onCellClick')(), this.instance.option('onCellClick')(), 'scheduler has correct onCellClick');

        this.instance.option('onCellClick', sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option('onCellClick')(), this.instance.option('onCellClick')(), 'scheduler has correct onCellClick after option change');
    });

    QUnit.test('onCellContextMenu option should be passed to workSpace', function(assert) {
        this.createInstance({
            currentView: 'month',
            onCellContextMenu: sinon.stub().returns(1)
        });
        const workspaceMonth = this.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option('onCellContextMenu')(), this.instance.option('onCellContextMenu')(), 'scheduler has correct onCellContextMenu');

        this.instance.option('onCellContextMenu', sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option('onCellContextMenu')(), this.instance.option('onCellContextMenu')(), 'scheduler has correct onCellContextMenu after option change');
    });

    QUnit.test('onAppointmentContextMenu option should be passed to appointments', function(assert) {
        this.createInstance({
            currentView: 'month',
            onAppointmentContextMenu: sinon.stub().returns(1)
        });

        const appointments = this.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option('onItemContextMenu')(), this.instance.option('onAppointmentContextMenu')(), 'scheduler has correct onAppointmentContextMenu');

        this.instance.option('onAppointmentContextMenu', sinon.stub().returns(2));
        assert.deepEqual(appointments.option('onItemContextMenu')(), this.instance.option('onAppointmentContextMenu')(), 'scheduler has correct onAppointmentContextMenu after option change');
    });

    QUnit.test('onAppointmentDblClick option should be passed to appointments', function(assert) {
        this.createInstance({
            currentView: 'month',
            onAppointmentDblClick: sinon.stub().returns(1)
        });

        const appointments = this.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option('onAppointmentDblClick')(), this.instance.option('onAppointmentDblClick')(), 'scheduler has correct onAppointmentDblClick');

        this.instance.option('onAppointmentDblClick', sinon.stub().returns(2));
        assert.deepEqual(appointments.option('onAppointmentDblClick')(), this.instance.option('onAppointmentDblClick')(), 'scheduler has correct onAppointmentDblClick after option change');
    });

    QUnit.test('onAppointmentFormOpening event should be fired while details form is opening', function(assert) {
        const stub = sinon.stub();
        const data = {
            text: 'One',
            location: 'NY'
        };
        this.createInstance({
            currentView: 'month',
            onAppointmentFormOpening: stub
        });

        this.instance.showAppointmentPopup(data);

        const args = stub.getCall(0).args[0];

        assert.ok(stub.calledOnce, 'Event was fired');
        assert.equal(args.appointmentData, data, 'Appointment data is OK');
        assert.equal(args.form, this.instance.getAppointmentDetailsForm(), 'Appointment form is OK');
    });

    QUnit.test('Option changed', function(assert) {
        this.createInstance();

        this.instance.option({
            'onAppointmentAdding': function() { return true; },
            'onAppointmentAdded': function() { return true; },
            'onAppointmentUpdating': function() { return true; },
            'onAppointmentUpdated': function() { return true; },
            'onAppointmentDeleting': function() { return true; },
            'onAppointmentDeleted': function() { return true; },
            'onAppointmentFormOpening': function() { return true; }
        });

        $.each(this.instance.getActions(), function(name, action) {
            assert.ok(action(), '\'' + name + '\' option is changed');
        });
    });

    QUnit.test('Workspace dimension changing should be called before appointment repainting, when scheduler was resized (T739866)', function(assert) {
        const appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        this.createInstance({
            currentDate: new Date(2016, 2, 15),
            views: ['day'],
            currentView: 'day',
            width: 800,
            dataSource: [appointment]
        });

        const workspaceSpy = sinon.spy(this.instance._workSpace, '_dimensionChanged');
        const appointmentsSpy = sinon.spy(this.instance._appointments, '_repaintAppointments');

        resizeCallbacks.fire();

        assert.ok(appointmentsSpy.calledAfter(workspaceSpy), 'workSpace dimension changing was called before appointments repainting');
    });

    QUnit.test('ContentReady event should be fired after render completely ready (T902483)', function(assert) {
        let contentReadyFiresCount = 0;

        const scheduler = createWrapper({
            onContentReady: () => ++contentReadyFiresCount
        });

        assert.equal(contentReadyFiresCount, 1, 'contentReadyFiresCount === 1');

        scheduler.instance._workSpaceRecalculation = new Deferred();
        scheduler.instance._fireContentReadyAction();

        assert.equal(contentReadyFiresCount, 1, 'contentReadyFiresCount === 1');

        scheduler.instance._workSpaceRecalculation.resolve();

        assert.equal(contentReadyFiresCount, 2, 'contentReadyFiresCount === 2');

        scheduler.instance._workSpaceRecalculation = null;
        scheduler.instance._fireContentReadyAction();

        assert.equal(contentReadyFiresCount, 3, 'contentReadyFiresCount === 3');
    });
})('Events');

(function() {
    QUnit.module('Keyboard Navigation', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
                this.scheduler = new SchedulerTestWrapper(this.instance);
            };
            this.clock = sinon.useFakeTimers();
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test('Focus options should be passed to scheduler parts', function(assert) {
        this.createInstance({ focusStateEnabled: true, tabIndex: 1, currentView: 'day' });
        const header = this.instance.getHeader();
        const workspace = this.instance.getWorkSpace();
        const appointments = this.instance.getAppointmentsInstance();

        assert.equal(this.instance.$element().attr('tabindex'), null, 'scheduler has no tabIndex');

        assert.equal(header.option('focusStateEnabled'), true, 'header has correct focusStateEnabled');
        assert.equal(workspace.option('focusStateEnabled'), true, 'workspace has correct focusStateEnabled');
        assert.equal(appointments.option('focusStateEnabled'), true, 'appointments has correct focusStateEnabled');

        assert.equal(header.option('tabIndex'), 1, 'header has correct tabIndex');
        assert.equal(workspace.option('tabIndex'), 1, 'workspace has correct tabIndex');
        assert.equal(appointments.option('tabIndex'), 1, 'appointments has correct tabIndex');

    });

    QUnit.test('Focus options should be passed to scheduler parts after option changed', function(assert) {
        this.createInstance({ focusStateEnabled: true, tabIndex: 1, currentView: 'day' });
        const header = this.instance.getHeader();
        const workspace = this.instance.getWorkSpace();
        const appointments = this.instance.getAppointmentsInstance();

        this.instance.option('tabIndex', 2);

        assert.equal(header.option('tabIndex'), 2, 'header has correct tabIndex');
        assert.equal(workspace.option('tabIndex'), 2, 'workspace has correct tabIndex');
        assert.equal(appointments.option('tabIndex'), 2, 'appointments has correct tabIndex');

        this.instance.option('focusStateEnabled', false);

        assert.equal(header.option('focusStateEnabled'), false, 'header has correct focusStateEnabled');
        assert.equal(workspace.option('focusStateEnabled'), false, 'workspace has correct focusStateEnabled');
        assert.equal(appointments.option('focusStateEnabled'), false, 'appointments has correct focusStateEnabled');

    });

    QUnit.test('AllowMultipleCellSelection option should be passed to scheduler workspace', function(assert) {
        this.createInstance({ focusStateEnabled: true, allowMultipleCellSelection: false });
        const workspace = this.instance.getWorkSpace();

        assert.equal(workspace.option('allowMultipleCellSelection'), false, 'allowMultipleCellSelection');

        this.instance.option('allowMultipleCellSelection', true);

        assert.equal(workspace.option('allowMultipleCellSelection'), true, 'allowMultipleCellSelection');

    });

    QUnit.test('focusedStateEnabled option value should be passed to ddAppointments', function(assert) {
        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: ['month'],
            currentView: 'month',
            focusStateEnabled: false
        });

        this.scheduler.appointments.compact.click();
        assert.notOk(this.instance._appointmentTooltip._list.option('focusStateEnabled'), 'focusStateEnabled was passed correctly');

        this.instance._appointmentTooltip.hide();

        this.instance.option('focusStateEnabled', true);
        this.scheduler.appointments.compact.click();
        assert.ok(this.instance._appointmentTooltip._list.option('focusStateEnabled'), 'focusStateEnabled was passed correctly');
    });

    QUnit.test('Workspace navigation by arrows should work correctly with opened dropDown appointments', function(assert) {
        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: ['month'],
            currentView: 'month',
            focusStateEnabled: true
        });

        const $workSpace = this.instance.getWorkSpace().$element();
        const keyboard = keyboardMock($workSpace);

        $(this.instance.$element().find('.dx-scheduler-appointment-collector')).trigger('dxclick');

        keyboard.keyDown('down');
        keyboard.keyDown('up');
        keyboard.keyDown('right');
        keyboard.keyDown('left');

        assert.ok(true, 'Scheduler works correctly');
    });
})('Keyboard Navigation');

(function() {

    QUnit.module('Loading', {
        beforeEach: function() {
            this.instance = $('#scheduler').dxScheduler({
                showCurrentTimeIndicator: false
            }).dxScheduler('instance');
            this.clock = sinon.useFakeTimers();
            this.instance.option({
                currentView: 'day',
                currentDate: new Date(2015, 10, 1),
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([]);
                            }, 100);

                            return d.promise();
                        }
                    })
                })
            });
            fx.off = true;
        },
        afterEach: function() {
            this.clock.restore();
            fx.off = false;
        }
    });

    QUnit.test('Loading panel should be shown while datasource is reloading', function(assert) {
        this.clock.tick(100);

        this.instance.option('currentView', 'week');
        assert.equal(this.instance.$element().find('.dx-loadpanel-wrapper').length, 1, 'loading panel is shown');
    });

    QUnit.test('Loading panel should hide', function(assert) {
        this.clock.tick(100);
        this.instance.option('currentView', 'week');
        this.clock.tick(100);

        assert.equal($('.dx-loadpanel-wrapper').length, 0, 'loading panel hide');
    });

    QUnit.test('Loading panel should be shown in centre of scheduler', function(assert) {
        this.clock.tick(100);

        this.instance.option('currentView', 'week');
        const loadingInstance = $('.dx-loadpanel').last().dxLoadPanel('instance');
        assert.deepEqual(loadingInstance.option('position.of').get(0), this.instance.$element().get(0), 'loading panel is shown in right place');
    });

})('Loading');

(function() {
    QUnit.module('Filtering', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
            };
        }
    });

    QUnit.test('Start view date & end view date should be passed to the load method as filter expression', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {

                const filter = options.filter;
                const dateFilter = filter[0][0];
                const zeroDurationFilter = filter[0][4];

                assert.ok($.isArray(filter), 'Filter is array');

                assert.equal(filter[0].length, 5, 'Filter size is OK');

                assert.equal(dateFilter.length, 2, 'Date filter contains 2 items');

                assert.deepEqual(dateFilter[0], ['endDate', '>', startViewDate]);

                assert.deepEqual(dateFilter[1], ['startDate', '<', endViewDate]);

                assert.equal(filter.length, 1, 'Filter contains only dates');

                assert.deepEqual(zeroDurationFilter[0], ['endDate', startViewDate]);
                assert.deepEqual(zeroDurationFilter[1], ['startDate', startViewDate]);
            }
        });
        const startViewDate = new Date(2015, 11, 7);
        const endViewDate = new Date(2015, 11, 14);

        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('Recurrent appointments should be always loaded, if recurrenceRuleExpr !=null', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {
                const filter = options.filter;
                assert.equal(filter[0][1], 'or');
                assert.deepEqual(filter[0][2], ['recurrenceRule', 'startswith', 'freq']);
            }
        });
        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('There is no filter expression by recurrenceRule, if recurrenceRuleExpr is null', function(assert) {
        const dataSource = new DataSource({
            load: function(options) {
                const filter = options.filter;
                assert.equal(filter[0].length, 3, 'recurrenceRule expression is absent');
            }
        });
        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            views: ['week'],
            dataSource: dataSource,
            remoteFiltering: true,
            recurrenceRuleExpr: null
        });

    });

    QUnit.test('Internal scheduler filter should be merged with user\'s filter if it exists', function(assert) {
        const userFilter = ['someField', 'contains', 'abc'];
        const dataSource = new DataSource({
            filter: ['someField', 'contains', 'abc'],
            load: function(options) {
                const filter = options.filter;

                assert.equal(filter.length, 2);
                assert.deepEqual(filter[1], userFilter);
            }
        });

        this.createInstance({
            currentDate: new Date(2015, 11, 12),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true
        });

    });

    QUnit.test('Scheduler should filter data on client side if the remoteFiltering option is false', function(assert) {
        const dataSource = new DataSource([
            { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
            { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
        ]);

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

        assert.equal($appointments.length, 1, 'There is only one appt');
        assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, 'Appointment data is OK');
    });

    QUnit.test('Scheduler should filter data on client side if the remoteFiltering option is false and forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            const dataSource = new DataSource([
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                { StartDate: new Date(2015, 11, 19).toString(), EndDate: new Date(2015, 11, 19, 0, 30).toString() }
            ]);

            this.createInstance({
                currentDate: new Date(2015, 11, 24),
                firstDayOfWeek: 1,
                currentView: 'week',
                dataSource: dataSource,
                remoteFiltering: false,
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate'
            });

            const $appointments = $(this.instance.$element().find('.dx-scheduler-appointment'));

            assert.equal($appointments.length, 1, 'There is only one appt');
            assert.deepEqual(dataUtils.data($appointments[0], 'dxItemData'), { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() }, 'Appointment data is OK');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('Scheduler should filter data on server side if the remoteFiltering option is true', function(assert) {
        const dataSource = new DataSource([
            { StartDate: '2015-12-23T00:00', EndDate: '2015-12-23T00:30' },
            { StartDate: '2015-12-19T00:00', EndDate: '2015-12-19T00:30' }
        ]);

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: true,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.equal(this.instance.option('dataSource').items().length, 0, 'Appointments are filtered correctly');
    });

    QUnit.test('Scheduler should filter data on client side depends on user filter', function(assert) {
        const dataSource = new DataSource({
            filter: ['UserId', 1],
            store: [
                { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 },
                { StartDate: new Date(2015, 11, 24).toString(), EndDate: new Date(2015, 11, 24, 0, 30).toString(), UserId: 2 }
            ]
        });

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.deepEqual(this.instance.option('dataSource').items(), [{ StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString(), UserId: 1 }], 'Appointments are filtered correctly');
    });

    QUnit.test('Date filter should be used everytime before render', function(assert) {
        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    return [
                        { StartDate: new Date(2015, 11, 23).toString(), EndDate: new Date(2015, 11, 23, 0, 30).toString() },
                        { StartDate: new Date(2015, 9, 24).toString(), EndDate: new Date(2015, 9, 24, 0, 30).toString() }
                    ];
                }
            })
        });

        this.createInstance({
            currentDate: new Date(2015, 11, 24),
            firstDayOfWeek: 1,
            currentView: 'week',
            dataSource: dataSource,
            remoteFiltering: false,
            startDateExpr: 'StartDate',
            endDateExpr: 'EndDate'
        });

        assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment is rendered');
    });

})('Filtering');

(function() {
    QUnit.module('Small size', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
            };
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('Scheduler should have a small css class on init', function(assert) {
        this.createInstance({
            width: 300
        });

        assert.ok(this.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has \'dx-scheduler-small\' css class');
    });

    QUnit.test('Scheduler should have adaptive css class depend on adaptivityEnabled option', function(assert) {
        this.createInstance({
            width: 300,
            adaptivityEnabled: true
        });

        assert.ok(this.instance.$element().hasClass('dx-scheduler-adaptive'), 'Scheduler has \'dx-scheduler-adaptive\' css class');

        this.instance.option('adaptivityEnabled', false);

        assert.notOk(this.instance.$element().hasClass('dx-scheduler-adaptive'), 'Scheduler hasn\'t \'dx-scheduler-adaptive\' css class');
    });

    QUnit.test('Scheduler should have a small css class', function(assert) {
        this.createInstance({
            width: 600
        });

        this.instance.option('width', 300);
        assert.ok(this.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has \'dx-scheduler-small\' css class');
        this.instance.option('width', 600);
        assert.notOk(this.instance.$element().hasClass('dx-scheduler-small'), 'Scheduler has no \'dx-scheduler-small\' css class');
    });

    QUnit.test('Rendering small scheduler inside invisible element', function(assert) {
        try {
            triggerHidingEvent($('#scheduler'));
            this.createInstance({
                width: 300,
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 6, 5, 0, 0),
                    endDate: new Date(2015, 6, 5, 3, 0),
                }],
                currentDate: new Date(2015, 6, 6)
            });
            $('#scheduler').hide();
        } finally {
            $('#scheduler').show();
            triggerShownEvent($('#scheduler'));
            this.instance.option('width', 600);
            this.clock.tick();

            const $appointment = $(this.instance.$element().find('.dx-scheduler-appointment'));
            assert.roughEqual($appointment.position().left, 100, 1.001, 'Appointment is rendered correctly');
        }
    });

})('Small size');

(function() {
    QUnit.module('View with configuration', {
        beforeEach: function() {
            this.createInstance = function(options) {
                this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
            };
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    });

    QUnit.test('Scheduler should have specific cellDuration setting of the view', function(assert) {
        const viewCellDuration = 60;
        this.createInstance({
            views: [{
                type: 'day',
                cellDuration: viewCellDuration
            }, 'week'],
            cellDuration: 40,
            currentView: 'day'
        });

        let workSpace = this.instance.getWorkSpace();

        assert.equal(workSpace.option('hoursInterval') * 60, viewCellDuration, 'value of the cellDuration');

        this.instance.option('currentView', 'week');

        workSpace = this.instance.getWorkSpace();

        assert.equal(workSpace.option('hoursInterval') * 60, this.instance.option('cellDuration'), 'workspace has correct cellDuration after change');

    });

    QUnit.test('Scheduler should have specific startDayHour setting of the view', function(assert) {
        this.createInstance({
            views: [{
                type: 'day',
                startDayHour: 10
            }],
            startDayHour: 8,
            currentView: 'day'
        });

        assert.equal(this.instance._workSpace.option('startDayHour'), 10, 'value of the startDayHour');
    });

    QUnit.test('Scheduler should have specific endDayHour setting of the view', function(assert) {
        this.createInstance({
            views: [{
                type: 'day',
                endDayHour: 20
            }],
            endDayHour: 23,
            currentView: 'day'
        });

        assert.equal(this.instance._workSpace.option('endDayHour'), 20, 'value of the endDayHour');
    });

    QUnit.test('Scheduler should have specific firstDayOfWeek setting of the view', function(assert) {
        this.createInstance({
            views: [{
                type: 'workWeek',
                firstDayOfWeek: 0
            }],
            firstDayOfWeek: 3,
            currentView: 'workWeek'
        });

        assert.equal(this.instance._workSpace.option('firstDayOfWeek'), 0, 'value of the firstDayOfWeek in workSpace');
        assert.equal(this.instance._header.option('firstDayOfWeek'), 0, 'value of the firstDayOfWeek in header');
    });

    QUnit.test('Scheduler should have specific groups setting of the view', function(assert) {
        const dataSource1 = [
            { id: 1, text: 'group1' },
            { id: 2, text: 'group2' }
        ];
        const dataSource2 = [
            { id: 1, text: 'group3' },
            { id: 2, text: 'group4' }
        ];

        this.createInstance({
            views: [{
                type: 'workWeek',
                groups: ['test2']
            }],
            groups: ['test1'],
            resources: [
                {
                    field: 'test1',
                    dataSource: dataSource1
                },
                {
                    field: 'test2',
                    dataSource: dataSource2
                }
            ],
            currentView: 'workWeek'
        });

        assert.deepEqual(this.instance._workSpace.option('groups'), [{
            data: dataSource2,
            items: dataSource2,
            name: 'test2'
        }], 'value of the groups');
    });

    QUnit.test('Scheduler should have specific agendaDuration setting of the view', function(assert) {
        this.createInstance({
            views: [{
                type: 'agenda',
                agendaDuration: 4
            }],
            agendaDuration: 7,
            currentView: 'agenda'
        });

        assert.equal(this.instance._workSpace.option('agendaDuration'), 4, 'value of the agendaDuration');
    });

    QUnit.test('Scheduler should have specific dataCellTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            views: [{
                type: 'day',
                dataCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            dataCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'day'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific dateCellTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [],
            views: [{
                type: 'week',
                dateCellTemplate: function(item, index, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, 'element is correct');
                    countCallTemplate2++;
                }
            }],
            dateCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific timeCellTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [],
            views: [{
                type: 'week',
                timeCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            timeCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific resourceCellTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;
        const dataSource = [
            { id: 1, text: 'group1' },
            { id: 2, text: 'group2' }
        ];

        this.createInstance({
            views: [{
                type: 'week',
                resourceCellTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            groups: ['test'],
            resources: [
                {
                    field: 'test',
                    dataSource: dataSource
                }
            ],
            resourceCellTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'week',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            appointmentTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTemplate setting of the view after current view changing', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 26, 9, 10),
                endDate: new Date(2015, 4, 26, 11, 1)
            }],
            currentDate: new Date(2015, 4, 26),
            views: [{
                type: 'week',
                name: 'Week',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate1++;
                }
            }, {
                type: 'workWeek',
                name: 'WorkWeek',
                appointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            currentView: 'Week'
        });

        this.instance.option('currentView', 'WorkWeek');

        assert.notEqual(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific dropDownAppointmentTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'month',
                dropDownAppointmentTemplate: function(item, index, container) {
                    assert.deepEqual(isRenderer(container), !!config().useJQuery, 'appointmentElement is correct');
                    countCallTemplate2++;
                }
            }],
            dropDownAppointmentTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'month'
        });

        $(this.instance.$element().find('.dx-scheduler-appointment-collector').eq(0)).trigger('dxclick');

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentCollectorTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 1'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 2'
            }, {
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1),
                allDay: true,
                text: 'Task 3'
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'month',
                appointmentCollectorTemplate: function() {
                    countCallTemplate2++;
                }
            }],
            appointmentCollectorTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'month'
        });

        $(this.instance.$element().find('.dx-scheduler-appointment-collector').eq(0)).trigger('dxclick');

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Scheduler should have specific appointmentTooltipTemplate setting of the view', function(assert) {
        let countCallTemplate1 = 0;
        let countCallTemplate2 = 0;

        this.createInstance({
            dataSource: [{
                startDate: new Date(2015, 4, 24, 9, 10),
                endDate: new Date(2015, 4, 24, 11, 1)
            }],
            currentDate: new Date(2015, 4, 24),
            views: [{
                type: 'week',
                appointmentTooltipTemplate: function(model, index, container) {
                    assert.equal(isRenderer(container), !!config().useJQuery, 'element is correct');
                    countCallTemplate2++;
                }
            }],
            appointmentTooltipTemplate: function() {
                countCallTemplate1++;
            },
            currentView: 'week'
        });

        $(this.instance.$element().find('.dx-scheduler-appointment').eq(0)).trigger('dxclick');
        this.clock.tick(300);

        assert.equal(countCallTemplate1, 0, 'count call first template');
        assert.notEqual(countCallTemplate2, 0, 'count call second template');
    });

    QUnit.test('Check appointment takes all day by certain startDayHour and endDayHour', function(assert) {
        this.createInstance({
            startDayHour: 9,
            endDayHour: 18,
            views: [{
                type: 'week',
                startDayHour: 7,
                endDayHour: 23
            }],
            currentView: 'week'
        });

        let result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 9),
            endDate: new Date(2015, 5, 4, 18)
        });

        assert.ok(!result, 'Appointment doesn\'t takes all day');

        result = this.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 7),
            endDate: new Date(2015, 5, 4, 23)
        });

        assert.ok(result, 'Appointment takes all day');
    });


    ['day', 'week', 'month'].forEach(viewName => {
        QUnit.test(`Cell should have default height if view: '${viewName}'`, function(assert) {
            const DEFAULT_CELL_HEIGHT = 50;

            const scheduler = createWrapper({
                views: [viewName],
                currentView: viewName
            });

            const cellHeight = scheduler.workSpace.getCellHeight(0, 0);
            assert.equal(cellHeight, DEFAULT_CELL_HEIGHT, 'Cell has min height');
        });
    });

    ['timelineDay', 'timelineWeek', 'timelineMonth'].forEach(viewName => {
        QUnit.test(`Group header height should be equals to the grouping cell height if view: '${viewName}'`, function(assert) {
            const scheduler = createWrapper({
                views: [viewName],
                currentView: viewName,
                groups: ['any'],
                resources: [{
                    fieldExpr: 'any',
                    dataSource: [
                        { text: 'Group_1', id: 1 },
                        { text: 'Group_2', id: 2 },
                        { text: 'Group_3', id: 3 }
                    ],
                }]
            });

            const $groupHeaders = $(scheduler.workSpace.groups.getGroupHeaders(0));
            $groupHeaders.each((index, groupHeader) => {
                const groupHeaderHeight = $(groupHeader).outerHeight();
                const groupingCellHeight = scheduler.workSpace.getCellHeight(index, 0);
                assert.equal(groupHeaderHeight, groupingCellHeight, `Group header ${index} has min height`);
            });
        });
    });

    ['day', 'week', 'month'].forEach(viewName => {
        [undefined, 2, 3].forEach(intervalCount => {
            [undefined, 200, 300, 800].forEach(height => {
                QUnit.test(`Workspace vertical scroll should be equal to the dataTable height if view: '${viewName}', view.intervalCount: ${intervalCount}, height: ${height}`, function(assert) {
                    const scheduler = createWrapper({
                        height: height,
                        views: [{
                            type: viewName,
                            name: viewName,
                            intervalCount: intervalCount
                        }],
                        currentView: viewName
                    });

                    const dateTableHeight = scheduler.workSpace.getDateTableHeight();
                    const scrollable = scheduler.workSpace.getScrollable();
                    assert.roughEqual(scrollable.scrollHeight(), dateTableHeight, 1.01, 'Scroll height > minWorspaceHeight');
                });

                QUnit.test(`Workspace vertical scroll should be equal to the dataTable height if grouping, view: '${viewName}', view.intervalCount=${intervalCount}, height: ${height}`, function(assert) {
                    const scheduler = createWrapper({
                        height: height,
                        views: [{
                            type: viewName,
                            name: viewName,
                            intervalCount: intervalCount
                        }],
                        currentView: viewName,
                        groups: ['any'],
                        resources: [{
                            fieldExpr: 'any',
                            dataSource: [
                                { text: 'Group_1', id: 1 },
                                { text: 'Group_2', id: 2 },
                                { text: 'Group_3', id: 2 }
                            ],
                        }]
                    });

                    const dateTableHeight = scheduler.workSpace.getDateTableHeight();
                    const scrollable = scheduler.workSpace.getScrollable();
                    assert.roughEqual(scrollable.scrollHeight(), dateTableHeight, 1.01, 'Scroll height > minWorspaceHeight');
                });
            });
        });
    });

    QUnit.test('Scrollable content should have correct height when native scrolling is used and a cell\'s height is greater than default', function(assert) {
        const scheduler = createWrapper({
            height: 1500,
            views: ['month'],
            currentView: 'month',
        });

        const scrollable = scheduler.workSpace.getScrollable();
        scrollable.option('useNative', true);

        const dateTableHeight = scheduler.workSpace.getDateTableHeight();
        const scrollHeight = scrollable.scrollHeight();
        const scrollableHeight = scrollable.$element().height();

        assert.equal(scrollableHeight, dateTableHeight, 'Correct dateTable height');
        assert.equal(scrollableHeight, scrollHeight, 'Correct scroll content height');
    });

    QUnit.test('Scrollable content should have correct height when native scrolling is used and a cell\'s height is equal to default', function(assert) {
        const scheduler = createWrapper({
            height: 500,
            views: [{
                type: 'month',
                intervalCount: 5,
            }],
            currentView: 'month',
        });

        const scrollable = scheduler.workSpace.getScrollable();
        scrollable.option('useNative', true);

        const dateTableHeight = scheduler.workSpace.getDateTableHeight();
        const scrollHeight = scrollable.scrollHeight();
        const scrollableHeight = scrollable.$element().height();

        assert.equal(scrollHeight, dateTableHeight, 'Correct dateTable height');
        assert.notEqual(scrollableHeight, scrollHeight, 'Correct scroll content height');
    });
})('View with configuration');

QUnit.module('Options for Material theme in components', {
    beforeEach: function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        themes.isMaterial = this.origIsMaterial;
    }
}, () => {
    QUnit.test('_dropDownButtonIcon option should be passed to SchedulerHeader', function(assert) {
        this.createInstance({
            currentView: 'week',
            showCurrentTimeIndicator: false
        });

        const header = this.instance.getHeader();

        assert.equal(header.option('_dropDownButtonIcon'), 'chevrondown', 'header has correct _dropDownButtonIcon');
    });

    QUnit.test('_collectorOffset option should be passed to SchedulerAppointments depending on the view', function(assert) {
        this.createInstance({
            currentView: 'month',
            showCurrentTimeIndicator: false
        });

        const appointments = this.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 20, 'SchedulerAppointments has correct _collectorOffset');

        this.instance.option('currentView', 'week');
        assert.equal(appointments.option('_collectorOffset'), 0, 'SchedulerAppointments has correct _collectorOffset');
    });

    QUnit.test('Real _collectorOffset option should be passed to SchedulerAppointments depending on the adaptivityEnabled', function(assert) {
        this.createInstance({
            currentView: 'month',
            showCurrentTimeIndicator: false,
            adaptivityEnabled: false
        });

        let appointments = this.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 20, 'SchedulerAppointments has correct _collectorOffset');

        this.instance.option('adaptivityEnabled', true);
        appointments = this.instance.getAppointmentsInstance();

        assert.equal(appointments.option('_collectorOffset'), 0, 'SchedulerAppointments has correct _collectorOffset');
    });
});

QUnit.module('Getting timezones', {}, () => {
    const findTimeZone = (timeZones, id) => {
        return timeZones.filter((timeZone) => timeZone.id === id)[0];

    };
    QUnit.test('getTimeZones method should return accepted timezones with correct format', function(assert) {
        const date = new Date(2020, 5, 1);
        const timeZones = getTimeZones(date);
        const firstTimeZone = timeZones[0];

        assert.ok(timeZones instanceof Array, 'method returns an array');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'id'), 'returned timeZone has an id');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'offset'), 'returned timeZone has an offset');
        assert.ok(Object.prototype.hasOwnProperty.call(firstTimeZone, 'title'), 'returned timeZone has a title');
    });

    QUnit.test('getTimeZones method should work properly without date passing', function(assert) {
        const timeZones = getTimeZones();
        const timeZone = findTimeZone(timeZones, 'Europe/Moscow');

        assert.deepEqual(timeZone, {
            id: 'Europe/Moscow',
            offset: 3,
            title: '(GMT +03:00) Europe - Moscow'
        }, 'some of returned timeZone is ok');
    });

    QUnit.test('getTimeZones method should return correct offsets depending on the date', function(assert) {
        const winter = '2020-03-08T01:00:00-08:00';
        const summer = '2020-03-08T02:00:00-08:00';

        let timeZones = getTimeZones(new Date(winter));
        let timeZone = findTimeZone(timeZones, 'America/Los_Angeles');

        assert.equal(timeZone.offset, -8, 'returned offset for timeZone with DST is OK');
        assert.equal(timeZone.title, '(GMT -08:00) America - Los Angeles', 'returned title for timeZone with DST is OK');

        timeZones = getTimeZones(new Date(summer));
        timeZone = findTimeZone(timeZones, 'America/Los_Angeles');

        assert.equal(timeZone.offset, -7, 'returned offset for timeZone with DST is OK');
        assert.equal(timeZone.title, '(GMT -07:00) America - Los Angeles', 'returned title for timeZone with DST is OK');
    });
});

QUnit.module('ScrollTo', () => {
    ['virtual', 'standard'].forEach((scrollingMode) => {
        const moduleName = scrollingMode === 'virtual'
            ? 'Virtual Scrolling'
            : 'Standard Scrolling';

        const checkScrollTo = (assert, scheduler, topCellCount, leftCellCount, date, groups, allDay) => {
            const $scrollable = scheduler.workSpace.getDateTableScrollable();
            const scrollableInstance = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
            const scrollBy = sinon.spy(scrollableInstance, 'scrollBy');

            const rtlInitialPosition = scrollableInstance.option('rtlEnabled')
                ? scrollableInstance.scrollLeft()
                : 0;

            scheduler.instance.scrollTo(date, groups, allDay);

            const scrollableHeight = $scrollable.height();
            const scrollableWidth = $scrollable.width();
            const $schedulerCell = scheduler.workSpace.getCells().eq(0);
            const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
            const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

            assert.ok(scrollBy.calledOnce, 'ScrollBy was called');
            assert.equal(
                scrollBy.getCall(0).args[0].top,
                topCellCount * cellHeight - (scrollableHeight - cellHeight) / 2,
                'Correct top parameter',
            );
            assert.equal(
                rtlInitialPosition + scrollBy.getCall(0).args[0].left,
                leftCellCount * cellWidth - (scrollableWidth - cellWidth) / 2,
                'Correct left parameter',
            );
        };

        QUnit.module(moduleName, {
            beforeEach: function() {
                this.createScheduler = (options = {}) => {
                    return createWrapper({
                        showCurrentTimeIndicator: false,
                        scrolling: { mode: scrollingMode },
                        currentDate: new Date(2020, 8, 6),
                        currentView: 'week',
                        height: 500,
                        width: 500,
                        crossScrollingEnabled: true,
                        resources: [{
                            fieldExpr: 'ownerId',
                            dataSource: [{
                                id: 1, text: 'A',
                            }, {
                                id: 2, text: 'B',
                            }]
                        }],
                        ...options,
                    });
                };

                this.clock = sinon.useFakeTimers();
                sinon.spy(errors, 'log');
                fx.off = true;
            },
            afterEach: function() {
                this.clock.restore();
                errors.log.restore();
                fx.off = false;
            }
        }, () => {
            QUnit.test('A warning should be thrown when scrolling to an invalid date', function(assert) {
                const scheduler = this.createScheduler();

                scheduler.instance.scrollTo(new Date(2020, 8, 5));

                assert.equal(errors.log.callCount, 1, 'warning has been called once');
                assert.equal(errors.log.getCall(0).args[0], 'W1008', 'warning has correct error id');

                scheduler.instance.scrollTo(new Date(2020, 8, 14));

                assert.equal(errors.log.callCount, 2, 'warning has been called once');
                assert.equal(errors.log.getCall(1).args[0], 'W1008', 'warning has correct error id');
            });

            QUnit.test('A warning should not be thrown when scrolling to a valid date', function(assert) {
                const scheduler = this.createScheduler();

                scheduler.instance.scrollTo(new Date(2020, 8, 7));

                assert.equal(errors.log.callCount, 0, 'warning has been called once');
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 1,
                topCellCount: 18,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25),
                leftCellCount: 5,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 66,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7),
                leftCellCount: 6,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work in basic case in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: view,
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
                });
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9, 15),
                leftCellCount: 1,
                topCellCount: 18.5,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25, 12),
                leftCellCount: 5,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9, 15),
                leftCellCount: 66.5,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7, 12),
                leftCellCount: 6,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work when date is between a cell's startDate and endDate in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: view,
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
                });
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 8,
                topCellCount: 18,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25, 12),
                leftCellCount: 12,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 402,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7, 12),
                leftCellCount: 36,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work with horizontal grouping in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: {
                            type: view,
                            groupOrientation: 'horizontal',
                            groupByDate: false,
                        },
                        groups: ['ownerId'],
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
                });
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 3,
                topCellCount: 18,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25, 12),
                leftCellCount: 11,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 133,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7, 12),
                leftCellCount: 13,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work when grouped by date in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: {
                            type: view,
                            groupOrientation: 'horizontal',
                            groupByDate: true,
                        },
                        groups: ['ownerId'],
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
                });
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 1,
                topCellCount: 66,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25, 12),
                leftCellCount: 5,
                topCellCount: 9,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 66,
                topCellCount: 1,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7, 12),
                leftCellCount: 6,
                topCellCount: 1,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work with vertical grouping in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: {
                            type: view,
                            groupOrientation: 'vertical',
                        },
                        groups: ['ownerId'],
                        showAllDayPanel: false,
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
                });
            });

            QUnit.test('ScrollTo should work with vertical grouping in week view when all-day panel is enabled', function(assert) {
                const leftCellCount = 1;
                const topCellCount = 68;
                const date = new Date(2020, 8, 7, 9);

                const scheduler = this.createScheduler({
                    currentView: {
                        type: 'week',
                        groupOrientation: 'vertical',
                    },
                    groups: ['ownerId'],
                    showAllDayPanel: true,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 });
            });

            QUnit.test('ScrollTo should work with vertical grouping when scrolling to an all-day cell', function(assert) {
                const leftCellCount = 1;
                const topCellCount = 49;
                const date = new Date(2020, 8, 7, 9);

                const scheduler = this.createScheduler({
                    currentView: {
                        type: 'week',
                        groupOrientation: 'vertical',
                    },
                    groups: ['ownerId'],
                    showAllDayPanel: true,
                });

                checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date, { ownerId: 2 }, true);
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 1,
                topCellCount: 18,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25),
                leftCellCount: 5,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 66,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7),
                leftCellCount: 6,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo to all-day cells should work in ${view} view`, function(assert) {
                    const scheduler = this.createScheduler({
                        currentView: view,
                    });

                    const $scrollable = scheduler.workSpace.getDateTableScrollable();
                    const scrollableInstance = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');
                    const scrollBy = sinon.spy(scrollableInstance, 'scrollBy');

                    scheduler.instance.scrollTo(date, undefined, true);

                    const scrollableHeight = $scrollable.height();
                    const scrollableWidth = $scrollable.width();
                    const $schedulerCell = scheduler.workSpace.getCells().eq(0);
                    const cellHeight = $schedulerCell.get(0).getBoundingClientRect().height;
                    const cellWidth = $schedulerCell.get(0).getBoundingClientRect().width;

                    const top = view === 'week'
                        ? 0
                        : topCellCount * cellHeight - (scrollableHeight - cellHeight) / 2;

                    assert.ok(scrollBy.calledOnce, 'ScrollBy was called');
                    assert.equal(
                        scrollBy.getCall(0).args[0].top,
                        top,
                        'Correct top parameter',
                    );
                    assert.equal(
                        scrollBy.getCall(0).args[0].left,
                        leftCellCount * cellWidth - (scrollableWidth - cellWidth) / 2,
                        'Correct left parameter',
                    );
                });
            });

            [{
                view: 'week',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 5,
                topCellCount: 18,
            }, {
                view: 'month',
                date: new Date(2020, 8, 25),
                leftCellCount: 1,
                topCellCount: 3,
            }, {
                view: 'timelineWeek',
                date: new Date(2020, 8, 7, 9),
                leftCellCount: 269,
                topCellCount: 0,
            }, {
                view: 'timelineMonth',
                date: new Date(2020, 8, 7),
                leftCellCount: 23,
                topCellCount: 0,
            }].forEach(({ view, date, leftCellCount, topCellCount }) => {
                QUnit.test(`ScrollTo should work correctly when RTL is enabled in ${view}`, function(assert) {
                    const scheduler = this.createScheduler({
                        rtlEnabled: true,
                        currentView: view,
                    });

                    checkScrollTo(assert, scheduler, topCellCount, leftCellCount, date);
                });
            });
        });
    });
});
