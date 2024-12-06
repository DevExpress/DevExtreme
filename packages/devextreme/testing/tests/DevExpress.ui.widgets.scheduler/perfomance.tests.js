import 'generic_light.css!';
import '__internal/scheduler/m_scheduler';

import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';

import { CustomStore } from 'common/data/custom_store';
import { SchedulerTestWrapper } from '../../helpers/scheduler/helpers.js';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler"></div>');
});


const renderLayoutModuleOptions = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.createInstance = (view, dataSource, options) => {
            this.instance = $('#scheduler').dxScheduler($.extend(options, {
                views: ['week', 'month', 'agenda'],
                currentView: view,
                dataSource: dataSource,
                currentDate: new Date(2017, 4, 25),
                startDayHour: 9,
                height: 600,
                width: 1300,
                editing: true,
            })).dxScheduler('instance');
            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Render layout', renderLayoutModuleOptions, function() {
    const createScheduler = (view, dataSource, options, clock) => {
        const instance = $('#scheduler').dxScheduler($.extend(options, {
            views: ['week', 'month', 'agenda'],
            currentView: view,
            dataSource: dataSource,
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            height: 600,
            width: 1300,
            editing: true,
        })).dxScheduler('instance');

        return new SchedulerTestWrapper(instance, clock);
    };

    const markAppointments = (scheduler) => scheduler.appointments.getAppointments().data('mark', true);

    const getUnmarkedAppointments = (scheduler) => {
        return scheduler.appointments.getAppointments().filter(function() {
            return !!$(this).data('mark') === false;
        });
    };

    const defaultData = [
        {
            id: 0,
            text: 'Website Re-Design Plan',
            startDate: new Date(2017, 4, 21, 9, 30),
            endDate: new Date(2017, 4, 21, 11, 30)
        }, {
            id: 1,
            text: 'Install New Database',
            startDate: new Date(2017, 4, 21, 12, 45),
            endDate: new Date(2017, 4, 21, 13, 15)
        }, {
            id: 2,
            text: 'Book Flights to San Fran for Sales Trip',
            startDate: new Date(2017, 4, 22, 12, 0),
            endDate: new Date(2017, 4, 22, 13, 0),
        }, {
            id: 3,
            text: 'Install New Router in Dev Room',
            startDate: new Date(2017, 4, 22, 14, 30),
            endDate: new Date(2017, 4, 22, 15, 30)
        }, {
            id: 4,
            text: 'Approve Personal Computer Upgrade Plan',
            startDate: new Date(2017, 4, 23, 10, 0),
            endDate: new Date(2017, 4, 23, 11, 0)
        }, {
            id: 5,
            text: 'Final Budget Review',
            startDate: new Date(2017, 4, 23, 12, 0),
            endDate: new Date(2017, 4, 23, 13, 35)
        }, {
            id: 6,
            text: 'Install New Database',
            startDate: new Date(2017, 4, 24, 9, 45),
            endDate: new Date(2017, 4, 24, 11, 15)
        }, {
            id: 7,
            text: 'Upgrade Personal Computers',
            startDate: new Date(2017, 4, 24, 15, 15),
            endDate: new Date(2017, 4, 24, 16, 30)
        }, {
            id: 8,
            text: 'Customer Workshop',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 12, 0),
        }, {
            id: 9,
            text: 'Prepare 2015 Marketing Plan',
            startDate: new Date(2017, 4, 25, 11, 0),
            endDate: new Date(2017, 4, 25, 13, 30)
        }, {
            id: 10,
            text: 'Create Icons for Website',
            startDate: new Date(2017, 4, 26, 10, 0),
            endDate: new Date(2017, 4, 26, 11, 30)
        }, {
            id: 11,
            text: 'Upgrade Server Hardware',
            startDate: new Date(2017, 4, 26, 14, 30),
            endDate: new Date(2017, 4, 26, 16, 0)
        }, {
            id: 12,
            text: 'Submit New Website Design',
            startDate: new Date(2017, 4, 27, 16, 30),
            endDate: new Date(2017, 4, 27, 18, 0)
        }, {
            id: 13,
            text: 'Launch New Website',
            startDate: new Date(2017, 4, 27, 12, 20),
            endDate: new Date(2017, 4, 27, 14, 0)
        }
    ];

    const createDataSource = (list = defaultData) => {
        return new DataSource({
            pushAggregationTimeout: 0,
            reshapeOnPush: true,
            store: {
                type: 'array',
                key: 'id',
                data: [...list]
            }
        });
    };

    QUnit.test('Scheduler should render appointments only for appointments that need redraw', function(assert) {
        const dataSource = createDataSource();
        const scheduler = createScheduler('week', dataSource);

        markAppointments(scheduler);
        dataSource.store().push([
            { type: 'update', key: 0, data: { text: 'updated-1' } },
            { type: 'update', key: 1, data: { text: 'updated-2' } }
        ]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 2, 'Should rendered only two updated appointments');

        markAppointments(scheduler);
        dataSource.store().push([{ type: 'insert', data: {
            id: 15,
            text: 'Fake',
            startDate: new Date(2017, 4, 27, 15, 30),
            endDate: new Date(2017, 4, 27, 16, 30)
        } }]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only inserted appointment');

        markAppointments(scheduler);
        dataSource.store().remove(0);

        assert.equal(getUnmarkedAppointments(scheduler).length, 0, 'Html element should removed and should not redrawing another appointments');
    });

    QUnit.test('Scheduler should render only necessary appointments in crossing appointments case', function(assert) {
        const dataSource = createDataSource();
        const scheduler = createScheduler('week', dataSource);

        markAppointments(scheduler);
        dataSource.store().push([{ type: 'insert', data: {
            id: 14,
            text: 'Fake_key_14',
            startDate: defaultData[0].startDate,
            endDate: defaultData[0].endDate
        } }]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 2, 'Should rendered inserted appointment and update appointment');

        markAppointments(scheduler);
        dataSource.store().push([{ type: 'insert', data: {
            id: 15,
            text: 'Fake_key_15',
            startDate: defaultData[1].startDate,
            endDate: defaultData[1].endDate
        } }]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 2, 'Should rendered inserted appointment and 2 updated appointment');

        markAppointments(scheduler);
        dataSource.store().remove(15);
        dataSource.load();
        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only two updated appointments');
    });

    QUnit.test('Scheduler should throw onAppointmentRendered event only for appointments that need redraw', function(assert) {
        const dataSource = createDataSource();
        const fakeHandler = {
            onAppointmentRendered: () => { }
        };
        const renderedStub = sinon.stub(fakeHandler, 'onAppointmentRendered');
        createScheduler('week', dataSource, { onAppointmentRendered: fakeHandler.onAppointmentRendered });

        renderedStub.reset();
        dataSource.store().push([{ type: 'insert', data: {
            id: 14,
            text: 'Fake_key_14',
            startDate: new Date(2017, 4, 21, 15, 0),
            endDate: new Date(2017, 4, 21, 15, 30),
        } }]);

        assert.equal(renderedStub.callCount, 1, 'Should throw one call onAppointmentRendered event');

        renderedStub.reset();
        dataSource.store().remove(14);
        dataSource.load();
        assert.equal(renderedStub.callCount, 0, 'Should not throw onAppointmentRendered event');

        renderedStub.reset();
        dataSource.store().push([{ type: 'insert', data: {
            id: 15,
            text: 'Fake_key_15',
            startDate: defaultData[0].startDate,
            endDate: defaultData[0].endDate
        } }]);

        assert.equal(renderedStub.callCount, 2, 'Should throw two call onAppointmentRendered event');

        renderedStub.reset();
        dataSource.store().push([
            { type: 'update', key: 0, data: { text: 'updated-1' } },
        ]);

        assert.equal(renderedStub.callCount, 1, 'Should throw one call onAppointmentRendered event');
    });

    QUnit.test('Scheduler should render appointments only for appointments that need redraw in Month view', function(assert) {
        const dataSource = createDataSource();
        const scheduler = createScheduler('month', dataSource);

        markAppointments(scheduler);
        dataSource.store().push([
            { type: 'update', key: 0, data: { text: 'updated-1' } },
            { type: 'update', key: 1, data: { text: 'updated-2' } }
        ]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 2, 'Should rendered only two updated appointments');

        markAppointments(scheduler);
        dataSource.store().push([{ type: 'insert', data: {
            id: 15,
            text: 'Fake',
            startDate: new Date(2017, 4, 28, 15, 30),
            endDate: new Date(2017, 4, 28, 16, 30)
        } }]);

        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only inserted appointment');

        markAppointments(scheduler);
        dataSource.store().remove(0);
        dataSource.load();

        // TODO: in future this case should be optimized - redraw in this case can escape
        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only one appointment');
    });

    QUnit.test('Scheduler should render appointments only for appointments that need redraw. Use scheduler API', function(assert) {
        const scheduler = createScheduler('week', defaultData);

        markAppointments(scheduler);
        scheduler.instance.updateAppointment(defaultData[0], { text: 'updated' });
        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only one appointment');

        markAppointments(scheduler);
        scheduler.instance.updateAppointment(defaultData[9], { text: 'updated' });
        assert.equal(getUnmarkedAppointments(scheduler).length, 1, 'Should rendered only one appointment from intersecting appointments');

        markAppointments(scheduler);
        scheduler.instance.deleteAppointment(defaultData[0]);
        assert.equal(getUnmarkedAppointments(scheduler).length, 0, 'Nothing should be redrawing');
    });

    QUnit.test('Scheduler should re-render all appointments in Agenda view case', function(assert) {
        const dataSource = createDataSource();
        const scheduler = createScheduler('agenda', dataSource);

        markAppointments(scheduler);
        dataSource.store().push([
            { type: 'update', key: 8, data: { text: 'updated-1' } },
            { type: 'update', key: 10, data: { text: 'updated-2' } }
        ]);

        assert.equal(scheduler.appointments.getAppointmentCount(), getUnmarkedAppointments(scheduler).length, 'Should rendered all appointments');

        markAppointments(scheduler);
        dataSource.store().push([{ type: 'insert', data: {
            id: 15,
            text: 'Fake',
            startDate: new Date(2017, 4, 27, 15, 30),
            endDate: new Date(2017, 4, 27, 16, 30)
        } }]);

        assert.equal(scheduler.appointments.getAppointmentCount(), getUnmarkedAppointments(scheduler).length, 'Should rendered all appointments');
    });

    QUnit.test('Scheduler should re-render appointments in Agenda view, if data source loading data', function(assert) {
        const items = [
            { id: 0, startDate: new Date(2017, 4, 25, 9), endDate: new Date(2017, 4, 25, 9, 30), text: 'a' },
            { id: 1, startDate: new Date(2017, 4, 27, 15), endDate: new Date(2017, 4, 27, 15, 30), text: 'b' }
        ];

        const dataSource = {
            store: new CustomStore({
                key: 'id',
                load: () => items,
                update: (key, values) => items[parseInt(key)] = values
            })
        };
        const scheduler = createScheduler('agenda', dataSource, undefined, this.clock);
        assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Should render 2 appointments');
        markAppointments(scheduler);

        scheduler.appointments.click();
        scheduler.tooltip.clickOnItem();
        scheduler.appointmentForm.setSubject('new text');
        scheduler.appointmentPopup.clickDoneButton();

        assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Should render 2 appointments');
        assert.equal(scheduler.appointments.getAppointmentCount(), getUnmarkedAppointments(scheduler).length, 'Should re-rendered all appointments');
    });

    QUnit.test('Scheduler should leave appointments consistently if no data has been changed (T751129)', function(assert) {
        const data = [{
            startDate: new Date(2017, 4, 25, 9),
            endDate: new Date(2017, 4, 25, 9, 30),
            text: 'First'
        }, {
            startDate: new Date(2017, 4, 25, 9, 35),
            endDate: new Date(2017, 4, 25, 10, 20),
            text: 'Second'
        }];
        this.createInstance('week', data);
        let appointmentFirst = this.scheduler.appointments.getAppointment(0);
        appointmentFirst.css('backgroundColor', '#00ff00');
        const appointmentSecond = this.scheduler.appointments.getAppointment(1);
        const pointer = pointerMock(appointmentSecond).start();
        pointer.dragStart().drag(-200, -30).dragEnd();
        appointmentFirst = this.scheduler.appointments.getAppointment(0);
        assert.equal(appointmentFirst.css('backgroundColor'), 'rgb(0, 255, 0)', 'Appointment background color is not changed after another appointment drag');

        const appointments = this.instance.option('dataSource');
        this.instance.updateAppointment(appointments[1], $.extend(appointments[1], { text: 'Third' }));

        appointmentFirst = this.scheduler.appointments.getAppointment(0);
        assert.equal(appointmentFirst.css('backgroundColor'), 'rgb(0, 255, 0)', 'Appointment background color is not changed after another appointment update');
    });

    QUnit.test('Scheduler must re-render appointments if resource color has been changed (T751129)', function(assert) {
        const resourcesData = [{
            id: 1,
            color: '#48392c',
            text: 'One',
        }, {
            id: 2,
            color: '#592750',
            text: 'Two'
        }];

        const data = [{
            startDate: new Date(2017, 4, 25, 9),
            endDate: new Date(2017, 4, 25, 9, 30),
            text: 'First',
            resourceId: 1,
        }, {
            startDate: new Date(2017, 4, 25, 9, 35),
            endDate: new Date(2017, 4, 25, 10, 20),
            text: 'Second',
            resourceId: 2,
        }];

        this.createInstance('week', data, {
            resources: [{
                fieldExpr: 'resourceId',
                allowMultiple: false,
                dataSource: resourcesData,
                label: 'Resource'
            }]
        });
        let appointmentFirst = this.scheduler.appointments.getAppointment(0);
        assert.notEqual(appointmentFirst.css('backgroundColor'), 'rgb(0, 255, 0)', 'Appointment background color is not changed');

        const resources = this.instance.option('resources');
        resources[0].dataSource[0].color = '#00ff00';
        this.instance.option('resources', resources);

        appointmentFirst = this.scheduler.appointments.getAppointment(0);
        assert.equal(appointmentFirst.css('backgroundColor'), 'rgb(0, 255, 0)', 'Appointment background color is changed');
    });
});
