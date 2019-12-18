import $ from 'jquery';
import fx from 'animation/fx';
import dxScheduler from 'ui/scheduler/ui.scheduler';
import DataSource from 'data/data_source/data_source';
import dateUtils from 'core/utils/date';
import dxSchedulerAppointmentModel from 'ui/scheduler/ui.scheduler.appointment_model';

QUnit.testStart(() => {
    const markup =
        '<div id="scheduler"> </div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();

        this.instance = $('#scheduler').dxScheduler().dxScheduler('instance');
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
    afterEach: () => {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Scheduler markup', moduleConfig, () => {
    QUnit.test('Scheduler should be initialized', (assert) => {
        assert.ok(this.instance instanceof dxScheduler, 'Scheduler was initialized');
    });

    QUnit.test('Scheduler should have a right css classes', (assert) => {
        assert.ok(this.instance.$element().hasClass('dx-scheduler'), 'Scheduler has \'dx-scheduler\' css class');
        assert.ok(this.instance.$element().hasClass('dx-widget'), 'Scheduler has \'dx-widget\' css class');
    });

    QUnit.test('Scheduler should not fail when dataSource is set', (assert) => {
        const data = new DataSource.DataSource({
            store: this.tasks
        });

        const instance = $('#scheduler').dxScheduler({
            dataSource: data,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2015, 1, 9)
        }).dxScheduler('instance');

        assert.ok(instance._appointmentModel instanceof dxSchedulerAppointmentModel, 'Task model is initialized on scheduler init');
        assert.ok(instance._appointmentModel._dataSource instanceof DataSource.DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineView', (assert) => {
        const data = new DataSource.DataSource({
            store: this.tasks
        });

        const instance = $('#scheduler').dxScheduler({
            dataSource: data,
            views: ['timelineDay'],
            currentView: 'timelineDay',
            currentDate: new Date(2015, 1, 9)
        }).dxScheduler('instance');

        assert.ok(instance._appointmentModel instanceof dxSchedulerAppointmentModel, 'Task model is initialized on scheduler init');
        assert.ok(instance._appointmentModel._dataSource instanceof DataSource.DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, timelineWeek', (assert) => {
        const data = new DataSource.DataSource({
            store: this.tasks
        });

        const instance = $('#scheduler').dxScheduler({
            dataSource: data,
            views: ['timelineWeek'],
            currentView: 'timelineWeek',
            currentDate: new Date(2015, 1, 9)
        }).dxScheduler('instance');

        assert.ok(instance._appointmentModel instanceof dxSchedulerAppointmentModel, 'Task model is initialized on scheduler init');
        assert.ok(instance._appointmentModel._dataSource instanceof DataSource.DataSource, 'Task model has data source instance');
    });

    QUnit.test('Scheduler should not fail when dataSource is set, agenda', (assert) => {
        const data = new DataSource.DataSource({
            store: this.tasks
        });

        const instance = $('#scheduler').dxScheduler({
            dataSource: data,
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 1, 9)
        }).dxScheduler('instance');

        assert.ok(instance._appointmentModel instanceof dxSchedulerAppointmentModel, 'Task model is initialized on scheduler init');
        assert.ok(instance._appointmentModel._dataSource instanceof DataSource.DataSource, 'Task model has data source instance');
    });

    QUnit.test('Header & work space currentDate should not contain information about hours, minutes, seconds', (assert) => {
        var currentDate = this.instance.option('currentDate'),
            header = this.instance.getHeader(),
            workSpace = this.instance.getWorkSpace(),
            headerCurrentDate = header.option('currentDate'),
            workSpaceCurrentDate = workSpace.option('currentDate');

        this.checkDateTime(assert, headerCurrentDate, dateUtils.trimTime(currentDate), 'header date');
        this.checkDateTime(assert, workSpaceCurrentDate, dateUtils.trimTime(currentDate), 'work space date');

        this.instance.option('currentDate', new Date(2015, 1, 1, 10, 10, 10, 10));

        currentDate = this.instance.option('currentDate');

        headerCurrentDate = header.option('currentDate'),
        workSpaceCurrentDate = workSpace.option('currentDate');

        this.checkDateTime(assert, currentDate, new Date(2015, 1, 1, 10, 10, 10, 10), 'current date: ');
        this.checkDateTime(assert, headerCurrentDate, new Date(2015, 1, 1), 'header date: ');
        this.checkDateTime(assert, workSpaceCurrentDate, new Date(2015, 1, 1), 'work space date ');
    });
});

QUnit.module('Scheduler with config', {
    beforeEach: () => {
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: () => {
        this.clock.restore();
    }
}, () => {
    QUnit.test('Scheduler should have specific viewName setting of the view', (assert) => {
        this.createInstance({
            views: [{
                type: 'day',
                name: 'Test Day'
            }, 'week'],
            cellDuration: 40,
            currentView: 'day',
            useDropDownViewSwitcher: false
        });

        const $header = $(this.instance.getHeader().$element());

        assert.equal($header.find('.dx-tab').eq(0).text(), 'Test Day');
        assert.equal($header.find('.dx-tab').eq(1).text(), 'Week');
    });

    QUnit.test('Workspace shouldn\'t have specific class if maxAppointmentsPerCell=null', (assert) => {
        this.createInstance({
            currentView: 'Week',
            maxAppointmentsPerCell: null,
            views: [{
                type: 'week',
                name: 'Week',
            }]
        });

        var $workSpace = this.instance.getWorkSpace().$element();
        assert.notOk($workSpace.hasClass('dx-scheduler-work-space-overlapping'), 'workspace hasn\'t class');
    });

    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set', (assert) => {
        this.createInstance();

        assert.strictEqual(this.instance.getWorkSpace().option('crossScrollingEnabled'), false, 'option is OK');

        this.instance.option('crossScrollingEnabled', true);
        assert.strictEqual(this.instance.getWorkSpace().option('crossScrollingEnabled'), true, 'option is OK');
    });

    QUnit.test('Scheduler should not fail when crossScrollingEnabled is set, agenda view', (assert) => {
        this.createInstance({
            crossScrollingEnabled: true,
            currentView: 'agenda'
        });

        assert.ok(true, 'Widget was successfully initialized');
    });
});
