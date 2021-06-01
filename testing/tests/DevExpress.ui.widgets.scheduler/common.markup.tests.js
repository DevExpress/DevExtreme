import $ from 'jquery';
import fx from 'animation/fx';
import dxScheduler from 'ui/scheduler/ui.scheduler';
import { DataSource } from 'data/data_source/data_source';
import dateUtils from 'core/utils/date';
import { getAppointmentDataProvider, AppointmentDataProvider } from 'ui/scheduler/appointments/DataProvider/appointmentDataProvider';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

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
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Scheduler markup', moduleConfig, () => {
    QUnit.test('Scheduler should be initialized', function(assert) {
        const scheduler = createWrapper();

        assert.ok(scheduler.instance instanceof dxScheduler, 'Scheduler was initialized');
    });

    QUnit.test('Scheduler should have a right css classes', function(assert) {
        const scheduler = createWrapper();

        assert.ok(scheduler.instance.$element().hasClass('dx-scheduler'), 'Scheduler has \'dx-scheduler\' css class');
        assert.ok(scheduler.instance.$element().hasClass('dx-widget'), 'Scheduler has \'dx-widget\' css class');
    });

    QUnit.test('Scheduler should not fail when dataSource is set', function(assert) {
        const data = new DataSource({
            store: tasks
        });

        createWrapper({
            dataSource: data,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(getAppointmentDataProvider() instanceof AppointmentDataProvider, 'Task model is initialized on scheduler init');
        assert.ok(getAppointmentDataProvider().dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineView', function(assert) {
        const data = new DataSource({
            store: tasks
        });

        createWrapper({
            dataSource: data,
            views: ['timelineDay'],
            currentView: 'timelineDay',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(getAppointmentDataProvider() instanceof AppointmentDataProvider, 'Task model is initialized on scheduler init');
        assert.ok(getAppointmentDataProvider().dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineWeek', function(assert) {
        const data = new DataSource({
            store: tasks
        });

        createWrapper({
            dataSource: data,
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(getAppointmentDataProvider() instanceof AppointmentDataProvider, 'Task model is initialized on scheduler init');
        assert.ok(getAppointmentDataProvider().dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, agenda', function(assert) {
        const data = new DataSource({
            store: tasks
        });

        createWrapper({
            dataSource: data,
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(getAppointmentDataProvider() instanceof AppointmentDataProvider, 'Task model is initialized on scheduler init');
        assert.ok(getAppointmentDataProvider().dataSource instanceof DataSource, 'Task model has data source instance');
    });

    QUnit.test('Header & work space currentDate should not contain information about hours, minutes, seconds', function(assert) {
        const scheduler = createWrapper();

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

QUnit.module('Scheduler with config', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Scheduler should have specific viewName setting of the view', function(assert) {
        const scheduler = createWrapper({
            views: [{
                type: 'day',
                name: 'Test Day'
            }, 'week'],
            cellDuration: 40,
            currentView: 'day',
            useDropDownViewSwitcher: false
        });

        const $header = $(scheduler.instance.getHeader().$element());

        assert.equal($header.find('.dx-tab').eq(0).text(), 'Test Day');
        assert.equal($header.find('.dx-tab').eq(1).text(), 'Week');
    });

    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set', function(assert) {
        const scheduler = createWrapper();

        assert.strictEqual(scheduler.instance.getWorkSpace().option('crossScrollingEnabled'), false, 'option is OK');

        scheduler.instance.option('crossScrollingEnabled', true);
        assert.strictEqual(scheduler.instance.getWorkSpace().option('crossScrollingEnabled'), true, 'option is OK');
    });

    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set, agenda view', function(assert) {
        createWrapper({
            crossScrollingEnabled: true,
            currentView: 'agenda'
        });

        assert.ok(true, 'Widget was successfully initialized');
    });
});
