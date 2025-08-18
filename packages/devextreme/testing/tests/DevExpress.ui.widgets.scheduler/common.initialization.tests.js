import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import { triggerHidingEvent, triggerShownEvent } from 'common/core/events/visibility_change';
import { isFunction } from 'core/utils/type';
import $ from 'jquery';
import { AppointmentDataSource } from '__internal/scheduler/view_model/generate_view_model/data_provider/m_appointment_data_source';

import { createWrapper, initTestMarkup, SchedulerTestWrapper } from '../../helpers/scheduler/helpers.js';
import { waitForAsync, waitGlobalFailure } from '../../helpers/scheduler/waitForAsync.js';

QUnit.testStart(() => initTestMarkup());

QUnit.module('Initialization', {
    beforeEach: function() {
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
        fx.off = false;
    }
}, () => {
    QUnit.test('Scheduler should have task model instance', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const { instance } = await createWrapper({ dataSource: data });

        assert.ok(instance.appointmentDataSource instanceof AppointmentDataSource, 'Task model is initialized on scheduler init');
        assert.ok(instance.appointmentDataSource.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should work correctly when wrong timeZone was set', async function(assert) {
        await createWrapper({ timeZone: 'Wrong/timeZone' });
        assert.ok(true, 'Widget works correctly');
    });

    QUnit.test('Scheduler shouldn\'t have paginate in default DataSource', async function(assert) {
        const { instance } = await createWrapper({ dataSource: this.tasks });

        assert.notOk(instance.appointmentDataSource.dataSource.paginate(), 'Paginate is false');
    });

    QUnit.test('Rendering inside invisible element', async function(assert) {
        const scheduler = await createWrapper();
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
            const isSchedulerShown = () => scheduler.instance.$element().find('.dx-scheduler-appointment').length === 1;
            await waitForAsync(() => isSchedulerShown());
            assert.ok(isSchedulerShown(), 'Appointment is rendered');
        }
    });

    QUnit.test('Data expressions should be compiled on init', async function(assert) {
        const scheduler = await createWrapper();
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
            assert.ok(isFunction(dataAccessors.getter[field]), '\'' + field + '\' getter is OK');
            assert.ok(isFunction(dataAccessors.setter[field]), '\'' + field + '\' setter is OK');
        });
    });

    QUnit.test('RecurrenceRule expression should not be compiled, if recurrenceRuleExpr = null', async function(assert) {
        const scheduler = await createWrapper({
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

    QUnit.test('appointmentCollectorTemplate rendering args should be correct', async function(assert) {
        await createWrapper({
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
        QUnit.test(`Generate error if startDayHour: ${dayHours.startDayHour} >= endDayHour: ${dayHours.endDayHour}`, async function(assert) {
            const promise = waitGlobalFailure();
            const consoleErrors = [];

            try {
                await createWrapper({
                    currentDate: new Date(2015, 4, 24),
                    views: ['day'],
                    currentView: 'day',
                    startDayHour: dayHours.startDayHour,
                    endDayHour: dayHours.endDayHour
                });
                consoleErrors.push(await promise);
            } catch(error) {
                consoleErrors.push(error.message);
            }

            assert.ok(consoleErrors[0].startsWith('E1062'), 'E1062 Error message');
        });
    });

    QUnit.test('Header panel should be visible in "Day" view with intervalCount > 1 if crossScrollingEnabled: true, showAllDayPanel: false (T895058)', async function(assert) {
        const scheduler = await createWrapper({
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

    QUnit.test('Option should apply before resource loaded', async function(assert) {
        const done = assert.async();
        const instance = $('#scheduler').dxScheduler({
            timeZone: 'America/Los_Angeles',
            dataSource: [],
            startDayHour: 12,
            currentView: 'week',
            currentDate: new Date('2021-03-29T21:30:00.000Z'),
            groups: ['Priority'],
            resources: [{
                fieldExpr: 'Priority',
                allowMultiple: false,
                label: 'Priority',
                dataSource: new DataSource({
                    store: new CustomStore({
                        load: function() {
                            const d = $.Deferred();
                            setTimeout(function() {
                                d.resolve([{ id: 1, text: 'Low' }]);
                            }, 100);

                            return d.promise();
                        }
                    })
                })
            }],
            onContentReady: () => {
                done();
                assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'DataSource set correctly after resource rendered');
            }
        }).dxScheduler('instance');
        const scheduler = new SchedulerTestWrapper(instance);
        instance.option('dataSource', [{
            text: 'Install New Router in Dev Room',
            startDate: new Date('2021-03-29T21:30:00.000Z'),
            endDate: new Date('2021-03-29T22:30:00.000Z'),
            Priority: 1,
        }]);
    });
});
