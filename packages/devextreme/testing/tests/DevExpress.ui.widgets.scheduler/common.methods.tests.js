import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { CustomStore } from 'common/data/custom_store';
import { DataSource } from 'common/data/data_source/data_source';

import timeZoneUtils from '__internal/scheduler/utils_time_zone';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

import 'fluent_blue_light.css!';

QUnit.testStart(() => initTestMarkup());

const createInstance = async(options = {}) => {
    const scheduler = await createWrapper({
        showCurrentTimeIndicator: false,
        ...options
    });

    return scheduler;
};

QUnit.module('Methods', {
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
    QUnit.test('Add new item', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        scheduler.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' });
        await waitAsync(10);
        assert.strictEqual(scheduler.instance.option('dataSource').items().length, 3, 'new item is added');
    });

    QUnit.test('Add new item with empty text', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        scheduler.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17) });
        await waitAsync(10);
        assert.strictEqual(scheduler.instance.option('dataSource').items()[2].text, '', 'new item was added with correct text');
    });

    QUnit.test('addAppointment shouldn\'t have an effect on data item, when timezone is set', async function(assert) {
        const data = [];

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 'Etc/GMT-5'
        });

        scheduler.instance.addAppointment({ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'first' });

        assert.deepEqual(data[0].startDate, new Date(2015, 1, 9, 16), 'Start date is OK');
        assert.deepEqual(data[0].endDate, new Date(2015, 1, 9, 17), 'End date is OK');
    });

    QUnit.test('Update item', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        scheduler.instance.updateAppointment(this.tasks[0], newTask);

        assert.deepEqual(scheduler.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Updated item should be rerendered', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const newTask = {
            text: 'Task 11',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        scheduler.instance.option('onAppointmentRendered', function() {
            assert.ok(true, 'Updated item was rerendered');
        });
        scheduler.instance.updateAppointment(this.tasks[0], newTask);
    });

    QUnit.test('Updated item should be rerendered if it\'s coordinates weren\'t changed (T650811)', async function(assert) {
        const data = new DataSource({
            store: [this.tasks[0]]
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const newTask = {
            allDay: undefined,
            text: 'Task 11',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };

        scheduler.instance.option('onAppointmentRendered', function() {
            assert.ok(true, 'Updated item was rerendered');
        });

        scheduler.instance.updateAppointment(this.tasks[0], newTask);
    });

    QUnit.test('Other appointments should not be rerendered after update item', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const newTask = { startDate: new Date(2015, 1, 9, 2, 0), endDate: new Date(2015, 1, 9, 3, 0), text: 'caption' };
        let counter = 0;

        scheduler.instance.option({ onAppointmentRendered: function(args) {
            counter++;
        } });

        scheduler.instance.updateAppointment(this.tasks[0], newTask);

        assert.deepEqual(scheduler.instance.option('dataSource').items()[0], newTask, 'item is updated');
        assert.equal(counter, 1, 'Only updated appointment was rerendered');
    });

    QUnit.test('Update item when custom timeZone was set', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 'Etc/GMT-5'
        });

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        scheduler.instance.updateAppointment(this.tasks[0], newTask);

        assert.deepEqual(scheduler.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Update item when custom timeZone was set as string', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            timeZone: 'Asia/Muscat'
        });

        const newTask = { startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' };

        scheduler.instance.updateAppointment(this.tasks[0], newTask);

        assert.deepEqual(scheduler.instance.option('dataSource').items()[0], newTask, 'item is updated');
    });

    QUnit.test('Updated directly from store item should be rerendered correctly', async function(assert) {
        const data = [{
            text: 'abc', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11)
        }];

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const dataSource = scheduler.instance.getDataSource();
        dataSource.store().update(data[0], {
            text: 'def', startDate: new Date(2015, 1, 9, 10), endDate: new Date(2015, 1, 9, 11)
        });
        dataSource.load();

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment-title').eq(0).text(), 'def', 'Appointment is rerendered');
    });

    QUnit.test('Pushed directly from store item should be rerendered correctly', async function(assert) {
        const data = [{
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
        }];
        const dataSource = new DataSource({
            pushAggregationTimeout: 0,
            reshapeOnPush: true,
            store: {
                type: 'array',
                key: 'id',
                data
            }
        });

        const scheduler = await createInstance({
            dataSource: dataSource,
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2017, 4, 25)
        });

        const dataSourceInstance = scheduler.instance.getDataSource();
        dataSourceInstance.store().push([
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

        const appointment = scheduler.instance.$element().find('.dx-scheduler-appointment-title');
        assert.equal(appointment.eq(0).text(), 'Update-1', 'Appointment is rerendered');
        assert.equal(appointment.eq(1).text(), 'Update-2', 'Appointment is rerendered');
    });

    QUnit.test('the \'update\' method of store should have key as arg is store has the \'key\' field', async function(assert) {
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

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        scheduler.instance.updateAppointment(data[0], {});
    });

    QUnit.test('the \'update\' method of store should have item as arg is store has not the \'key\' field', async function(assert) {
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

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        scheduler.instance.updateAppointment(data[0], {});
    });

    QUnit.test('Remove item', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const lastTask = this.tasks[1];

        scheduler.instance.deleteAppointment(this.tasks[0]);
        assert.deepEqual(scheduler.instance.option('dataSource').items(), [lastTask], 'Task is removed');
    });

    QUnit.test('Other appointments should not be rerendered after remove appointment', async function(assert) {
        const data = new DataSource({
            store: this.tasks
        });

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: data
        });

        const lastTask = this.tasks[1];

        scheduler.instance.option({ onAppointmentRendered: function(args) {
            assert.ok(false, 'Appointments were rerendered');
        } });

        scheduler.instance.deleteAppointment(this.tasks[0]);
        assert.deepEqual(scheduler.instance.option('dataSource').items(), [lastTask], 'Task is removed');
    });

    QUnit.test('the \'remove\' method of store should have key as arg is store has the \'key\' field', async function(assert) {
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

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        scheduler.instance.deleteAppointment(data[0]);
    });

    QUnit.test('the \'remove\' method of store should have item as arg is store has not the \'key\' field', async function(assert) {
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

        const scheduler = await createInstance({
            currentDate: new Date(2015, 1, 9),
            dataSource: dataSource
        });

        scheduler.instance.deleteAppointment(data[0]);
    });

    QUnit.test('Check appointment takes all day', async function(assert) {
        const scheduler = await createInstance({
            dataSource: []
        });
        let result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, 'Appointment takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 10)
        });

        assert.ok(result, 'Appointment takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 4, 5)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');
    });

    QUnit.test('Check appointment takes all day if start & end hours are defined', async function(assert) {
        const scheduler = await createInstance({
            dataSource: [],
            startDayHour: 5,
            endDayHour: 10
        });

        let result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 0),
            endDate: new Date(2015, 5, 5, 0)
        });

        assert.ok(result, 'Appointment takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 5),
            endDate: new Date(2015, 5, 4, 10)
        });
        assert.ok(!result, 'Appointment takes all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 7)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');

        result = scheduler.instance.appointmentTakesAllDay({
            startDate: new Date(2015, 5, 4, 6),
            endDate: new Date(2015, 5, 4, 12)
        });
        assert.ok(!result, 'Appointment doesn\'t take all day');
    });

    QUnit.test('Scheduler focus method should call workspace focus method when appointment wasn\'t updated', async function(assert) {
        const scheduler = await createInstance({
            dataSource: [],
            currentView: 'day',
            currentDate: new Date(2015, 10, 3)
        });

        const workspace = scheduler.instance.getWorkSpace();
        const spy = sinon.spy(workspace, 'focus');

        scheduler.instance.focus();

        assert.ok(spy.calledOnce, 'focus is called');
    });

    QUnit.test('Scheduler focus method should call appointments focus method when appointment was updated', async function(assert) {
        const tasks = [{
            text: 'a',
            startDate: new Date(2015, 6, 8, 8, 0),
            endDate: new Date(2015, 6, 8, 17, 0),
            allDay: true
        }];

        const scheduler = await createInstance({
            dataSource: tasks,
            currentDate: new Date(2015, 6, 8)
        });

        const appointments = scheduler.instance.getAppointmentsInstance();
        const focusSpy = sinon.spy(appointments, 'focus');

        scheduler.instance.editAppointmentData = tasks[0];
        scheduler.instance.focus();

        assert.ok(focusSpy.calledOnce, 'focus is called');
    });

    QUnit.test('Scheduler dateTable should have right position, crossScrollingEnabled=true, rtl mode', async function(assert) {
        const scheduler = await createInstance({
            currentView: 'day',
            currentDate: new Date(2015, 10, 3),
            crossScrollingEnabled: true,
            rtlEnabled: true
        });

        const dateTable = scheduler.workSpace.getDateTable();

        assert.equal(dateTable.position().left, 0, 'Date Table left is correct');
    });

    QUnit.test('Timezone offset calculation(T388304)', async function(assert) {
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
            const offset = timeZoneUtils.calculateTimezoneByValue(item.tz, item.date);
            const daylightOffset = timeZoneUtils.calculateTimezoneByValue(item.tz, item.daylightDate);

            assert.equal(offset, item.offset, item.tz + ': Common offset is OK');
            assert.equal(daylightOffset, item.daylightOffset, item.tz + ': DST offset is OK');
        });
    });

    QUnit.test('Scheduler should work correctly when groupOrientation is set without groups', async function(assert) {
        assert.expect(1);

        const scheduler = await createInstance({
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

        const $workSpace = scheduler.instance.getWorkSpace().$element();

        assert.notOk($workSpace.hasClass('dx-scheduler-work-space-vertical-grouped'), 'Workspace hasn\'t \'dx-scheduler-work-space-vertical-grouped\' css class');
    });

    QUnit.test('getWorkSpaceScrollableScrollTop should return right value for allDay appointments depending on the group orientation', async function(assert) {
        assert.expect(4);

        const scheduler = await createInstance({
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

        const workSpace = scheduler.instance.getWorkSpace();
        let scrollable = workSpace.getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(scheduler.instance.getWorkSpace().getGroupedScrollableScrollTop(), 400, 'Returned value is right for not allDay appt and horizontal grouping');
        assert.equal(scheduler.instance.getWorkSpace().getGroupedScrollableScrollTop(true), 0, 'Returned value is right for allDay appt and horizontal grouping');

        scheduler.instance.option('currentView', 'VWEEK');

        scrollable = scheduler.instance.getWorkSpace().getScrollable();
        scrollable.scrollTo({ left: 0, top: 400 });

        assert.equal(scheduler.instance.getWorkSpace().getGroupedScrollableScrollTop(), 400, 'Returned value is right for not allDay appt and vertical grouping');
        assert.equal(scheduler.instance.getWorkSpace().getGroupedScrollableScrollTop(true), 0, 'Returned value is right for allDay appt and vertical grouping');
    });

    QUnit.test('checkAndDeleteAppointment', async function(assert) {
        const data = [{
            text: 'a',
            startDate: new Date(2015, 6, 8, 8, 0),
            endDate: new Date(2015, 6, 8, 17, 0),
        }];
        const scheduler = await createInstance({
            dataSource: data,
        });

        scheduler.instance.checkAndDeleteAppointment(data[0], data[0]);

        assert.equal(scheduler.instance.option('dataSource').length, 0);
    });

    QUnit.test('showAppointmentTooltipCore, should call show tooltip', async function(assert) {
        const scheduler = await createInstance({});
        scheduler.instance.appointmentTooltip.isShownForTarget = sinon.stub().returns(false);
        scheduler.instance.appointmentTooltip.show = sinon.stub();
        scheduler.instance.appointmentTooltip.hide = sinon.stub();
        scheduler.instance.showAppointmentTooltipCore('target', [], 'options');

        assert.ok(!scheduler.instance.appointmentTooltip.hide.called, 'hide tooltip is not called');
        assert.ok(scheduler.instance.appointmentTooltip.show.called, 'show tooltip is called');
    });

    QUnit.test('showAppointmentTooltipCore, should call hide tooltip', async function(assert) {
        const scheduler = await createInstance({});
        scheduler.instance.appointmentTooltip.isShownForTarget = sinon.stub().returns(true);
        scheduler.instance.appointmentTooltip.show = sinon.stub();
        scheduler.instance.appointmentTooltip.hide = sinon.stub();
        scheduler.instance.showAppointmentTooltipCore('target', [], 'options');

        assert.ok(scheduler.instance.appointmentTooltip.hide.called, 'hide tooltip is called');
        assert.ok(!scheduler.instance.appointmentTooltip.show.called, 'show tooltip is not called');
    });

    QUnit.test('showAppointmentTooltip, should call show tooltip', async function(assert) {
        const scheduler = await createInstance({});
        scheduler.instance.appointmentTooltip.isShownForTarget = sinon.stub().returns(false);
        scheduler.instance.appointmentTooltip.show = sinon.stub();
        scheduler.instance.appointmentTooltip.hide = sinon.stub();
        scheduler.instance.showAppointmentTooltip('appointmentData', 'target', 'currentAppointmentData');

        assert.ok(!scheduler.instance.appointmentTooltip.hide.called, 'hide tooltip is not called');
        assert.ok(scheduler.instance.appointmentTooltip.show.called, 'show tooltip is called');
    });

    QUnit.test('showAppointmentTooltip, should call hide tooltip', async function(assert) {
        const scheduler = await createInstance({});
        scheduler.instance.appointmentTooltip.isShownForTarget = sinon.stub().returns(true);
        scheduler.instance.appointmentTooltip.show = sinon.stub();
        scheduler.instance.appointmentTooltip.hide = sinon.stub();
        scheduler.instance.showAppointmentTooltip('appointmentData', 'target', 'currentAppointmentData');

        assert.ok(scheduler.instance.appointmentTooltip.hide.called, 'hide tooltip is called');
        assert.ok(!scheduler.instance.appointmentTooltip.show.called, 'show tooltip is not called');
    });

    QUnit.test('getUpdatedData for the empty data item (T906240)', async function(assert) {
        const startCellDate = new Date(2020, 1, 2, 3);
        const endCellDate = new Date(2020, 1, 2, 4);
        const scheduler = await createWrapper({});

        scheduler.instance.getTargetCellData = () => {
            return {
                startDate: startCellDate,
                endDate: endCellDate
            };
        };

        const updatedData = scheduler.instance.getUpdatedData({ text: 'test' });
        assert.deepEqual(updatedData, {
            endDate: endCellDate,
            startDate: startCellDate
        }, 'Updated data is correct');
    });
});
