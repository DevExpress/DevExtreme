import fx from 'common/core/animation/fx';
import dxScheduler from '__internal/scheduler/m_scheduler';
import { DataSource } from 'common/data/data_source/data_source';
import dateUtils from 'core/utils/date';
import { AppointmentDataSource } from '__internal/scheduler/view_model/m_appointment_data_source';

import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

QUnit.testStart(() => {
    initTestMarkup();
});

const checkDateTime = (assert, actualDate, expectedDate, messagePrefix) => {
    assert.equal(actualDate.getHours(), expectedDate.getHours(), messagePrefix + 'Hours\'re OK');
    assert.equal(actualDate.getMinutes(), expectedDate.getMinutes(), messagePrefix + 'Minutes\'re OK');
    assert.equal(actualDate.getSeconds(), expectedDate.getSeconds(), messagePrefix + 'Seconds\'re OK');
    assert.equal(actualDate.getMilliseconds(), expectedDate.getMilliseconds(), messagePrefix + 'Milliseconds\'re OK');
};

const tasks = [
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

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Scheduler markup', moduleConfig, () => {
    QUnit.test('Scheduler should be initialized', async function(assert) {
        const scheduler = await createWrapper();

        assert.ok(scheduler.instance instanceof dxScheduler, 'Scheduler was initialized');
    });

    QUnit.test('Scheduler should have a right css classes', async function(assert) {
        const scheduler = await createWrapper();

        assert.ok(scheduler.instance.$element().hasClass('dx-scheduler'), 'Scheduler has \'dx-scheduler\' css class');
        assert.ok(scheduler.instance.$element().hasClass('dx-widget'), 'Scheduler has \'dx-widget\' css class');
    });

    QUnit.test('Scheduler should not fail when dataSource is set', async function(assert) {
        const data = new DataSource({
            store: tasks
        });

        const { instance } = await createWrapper({
            dataSource: data,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(instance.appointmentDataSource instanceof AppointmentDataSource, 'Task model is initialized on scheduler init');
        assert.ok(instance.appointmentDataSource.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineView', async function(assert) {
        const data = new DataSource({
            store: tasks
        });

        const { instance } = await createWrapper({
            dataSource: data,
            views: ['timelineDay'],
            currentView: 'timelineDay',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(instance.appointmentDataSource instanceof AppointmentDataSource, 'Task model is initialized on scheduler init');
        assert.ok(instance.appointmentDataSource.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineWeek', async function(assert) {
        const data = new DataSource({
            store: tasks
        });

        const { instance } = await createWrapper({
            dataSource: data,
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(instance.appointmentDataSource instanceof AppointmentDataSource, 'Task model is initialized on scheduler init');
        assert.ok(instance.appointmentDataSource.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, agenda', async function(assert) {
        const data = new DataSource({
            store: tasks
        });

        const { instance } = await createWrapper({
            dataSource: data,
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(instance.appointmentDataSource instanceof AppointmentDataSource, 'Task model is initialized on scheduler init');
        assert.ok(instance.appointmentDataSource.dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Header & work space currentDate should not contain information about hours, minutes, seconds', async function(assert) {
        const scheduler = await createWrapper();

        let currentDate = scheduler.instance.option('currentDate');
        const header = scheduler.instance.getHeader();
        const workSpace = scheduler.instance.getWorkSpace();
        let headerCurrentDate = header.option('currentDate');
        let workSpaceCurrentDate = workSpace.option('currentDate');

        checkDateTime(assert, headerCurrentDate, dateUtils.trimTime(currentDate), 'header date');
        checkDateTime(assert, workSpaceCurrentDate, dateUtils.trimTime(currentDate), 'work space date');

        scheduler.instance.option('currentDate', new Date(2015, 1, 1, 10, 10, 10, 10));

        currentDate = scheduler.instance.option('currentDate');

        headerCurrentDate = header.option('currentDate'),
        workSpaceCurrentDate = workSpace.option('currentDate');

        checkDateTime(assert, currentDate, new Date(2015, 1, 1, 10, 10, 10, 10), 'current date: ');
        checkDateTime(assert, headerCurrentDate, new Date(2015, 1, 1), 'header date: ');
        checkDateTime(assert, workSpaceCurrentDate, new Date(2015, 1, 1), 'work space date ');
    });
});

QUnit.module('Scheduler with config', () => {
    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set', async function(assert) {
        const scheduler = await createWrapper();

        assert.strictEqual(scheduler.instance.getWorkSpace().option('crossScrollingEnabled'), false, 'option is OK');

        scheduler.instance.option('crossScrollingEnabled', true);
        await waitAsync(10);
        assert.strictEqual(scheduler.instance.getWorkSpace().option('crossScrollingEnabled'), true, 'option is OK');
    });

    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set, agenda view', async function(assert) {
        await createWrapper({
            crossScrollingEnabled: true,
            currentView: 'agenda'
        });

        assert.ok(true, 'Widget was successfully initialized');
    });
});
