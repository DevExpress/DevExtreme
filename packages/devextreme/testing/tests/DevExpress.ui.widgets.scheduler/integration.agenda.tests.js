import { getOuterHeight, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import devices from '__internal/core/m_devices';
import resizeCallbacks from 'core/utils/resize_callbacks';
import dblclickEvent from 'common/core/events/dblclick';
import fx from 'common/core/animation/fx';
import AgendaAppointmentsStrategy from '__internal/scheduler/appointments/rendering_strategies/m_strategy_agenda';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import dataUtils from 'core/element_data';
import { createWrapper, SchedulerTestWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';

const {
    module,
    test,
    testStart,
} = QUnit;

testStart(() => {
    initTestMarkup();
});

function getDeltaTz(schedulerTz) {
    const defaultTz = -10800000;
    return schedulerTz * 3600000 + defaultTz;
}

const createScheduler = (options, clock) => {
    const instance = $('#scheduler').dxScheduler($.extend(options, { height: 600 })).dxScheduler('instance');
    return new SchedulerTestWrapper(instance, clock);
};

const createInstance = options => $('#scheduler').dxScheduler($.extend(options, { height: 600 })).dxScheduler('instance');

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

module('Integration: Agenda', moduleConfig, () => {
    test('startDateExpr and endDateExpr should be applied for Agenda view', function(assert) {
        assert.expect(4);

        const scheduler = createWrapper({
            dataSource: [{
                text: 'Oil Painting for Beginners',
                CustomStartDate: new Date(2020, 9, 25, 9, 30),
                CustomEndDate: new Date(2020, 9, 25, 10),
                recurrenceRule: 'FREQ=WEEKLY'
            }],
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2020, 10, 25),
            startDayHour: 9,
            startDateExpr: 'CustomStartDate',
            endDateExpr: 'CustomEndDate',
            onAppointmentClick({ targetedAppointmentData, appointmentData }) {
                assert.equal(targetedAppointmentData.CustomStartDate.toDateString(), 'Sun Nov 29 2020');
                assert.equal(targetedAppointmentData.CustomEndDate.toDateString(), 'Sun Nov 29 2020');

                assert.equal(appointmentData.CustomStartDate.toDateString(), 'Sun Oct 25 2020');
                assert.equal(appointmentData.CustomEndDate.toDateString(), 'Sun Oct 25 2020');
            },
            height: 600
        }, this.clock);

        scheduler.appointments.click();
    });

    test('Scheduler should have a right agenda work space', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda'
        });

        const $element = instance.$element();

        assert.ok($element.find('.dx-scheduler-work-space').dxSchedulerAgenda('instance'), 'Work space is agenda on init');
    });

    test('Scheduler should have a right rendering strategy for agenda view', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda'
        });

        const renderingStrategy = instance.getLayoutManager().getRenderingStrategyInstance();

        assert.ok(renderingStrategy instanceof AgendaAppointmentsStrategy, 'Strategy is OK');
    });

    test('showAllDayPanel option shouldn\'t have any effect on agenda', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 22),
            showAllDayPanel: false,
            dataSource: [
                { startDate: new Date(2016, 1, 22, 1), endDate: new Date(2016, 1, 24, 1, 30) }
            ]
        });

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 3, 'Appointment count is OK');
    });

    test('Appointments should not be resizable/draggable if current view is agenda', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'day'],
            currentView: 'agenda'
        });

        const currentDevice = devices.current();
        const isMobile = currentDevice.phone || currentDevice.tablet;

        const appointments = instance.getAppointmentsInstance();

        assert.notOk(appointments.option('allowResize'), 'Appointment is not resizable');
        assert.notOk(appointments.option('allowDrag'), 'Appointment is not draggable');

        instance.option('currentView', 'day');

        if(!isMobile) {
            assert.ok(appointments.option('allowResize'), 'Appointment is resizable');
            assert.ok(appointments.option('allowDrag'), 'Appointment is draggable');
        }
    });

    test('Appointments should not be resizable/draggable if current view is agenda and view is object', function(assert) {
        const instance = createInstance({
            views: ['day', { type: 'agenda', name: 'My Agenda' }],
            currentView: 'My Agenda'
        });

        const currentDevice = devices.current();
        const isMobile = currentDevice.phone || currentDevice.tablet;

        const appointments = instance.getAppointmentsInstance();

        assert.notOk(appointments.option('allowResize'), 'Appointment is not resizable');
        assert.notOk(appointments.option('allowDrag'), 'Appointment is not draggable');

        instance.option('currentView', 'day');

        if(!isMobile) {
            assert.ok(appointments.option('allowResize'), 'Appointment is resizable');
            assert.ok(appointments.option('allowDrag'), 'Appointment is draggable');
        }
    });

    test('Agenda should contain a right appointment quantity', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 28, 1, 30) }
            ]
        });

        let appointmentCount = 0;
        instance.$element().find('.dx-scheduler-appointment').each(function() {
            const apptData = dataUtils.data($(this).get(0), 'dxItemData');

            if(!apptData.appointmentData) {
                assert.ok(apptData.startDate);
                assert.ok(apptData.endDate);
            } else {
                assert.ok(apptData.appointmentData.startDate);
                assert.ok(apptData.appointmentData.endDate);

                assert.ok(apptData.startDate);
            }

            appointmentCount++;
        });

        assert.equal(appointmentCount, 7, 'Appointment count is OK');
    });

    test('Agenda appointments should have right sortedIndex', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 28, 1, 30) }
            ]
        });

        let sortedIndex = 0;
        instance.$element().find('.dx-scheduler-appointment').each(function(index, appointment) {
            assert.equal(dataUtils.data($(appointment).get(0), 'dxAppointmentSettings').sortedIndex, sortedIndex++);
        });
    });

    test('Agenda should contain a right allDay appointment parts', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 0), endDate: new Date(2016, 1, 25, 0), allDay: true }
            ]
        });

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment count is OK');
    });

    test('Agenda should contain a right quantity of long-appointments', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 22, 1), endDate: new Date(2016, 2, 4, 1, 30) }
            ]
        });

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 7, 'Appointment count is OK');
    });

    test('Long and recurrent appointment parts should not have a reduced-icon and reduced class', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            recurrenceRuleExpr: 'rRule',
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 25, 1, 30), rRule: 'FREQ=DAILY;INTERVAL=3' }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.notOk($appointments.eq(0).hasClass('dx-scheduler-appointment-reduced'), 'Appointment part hasn\'t a reduced-class');
        assert.equal($appointments.eq(0).find('.dx-scheduler-appointment-reduced-icon').length, 0, 'Appointment part hasn\'t a reduced-icon');
        assert.notOk($appointments.eq(1).hasClass('dx-scheduler-appointment-reduced'), 'Appointment part hasn\'t a reduced-class');
        assert.equal($appointments.eq(1).find('.dx-scheduler-appointment-reduced-icon').length, 0, 'Appointment part hasn\'t a reduced-icon');
        assert.notOk($appointments.eq(4).hasClass('dx-scheduler-appointment-reduced'), 'Appointment part hasn\'t a reduced-class');
        assert.equal($appointments.eq(4).find('.dx-scheduler-appointment-reduced-icon').length, 0, 'Appointment part hasn\'t a reduced-icon');
    });

    test('Particular recurrence appt should have a correct data', function(assert) {
        const scheduler = createWrapper({
            views: ['agenda'],
            resources: [
                { field: 'ownerId', dataSource: [{ id: 1, color: '#ff0000' }, { id: 2, color: '#0000ff' }] }
            ],
            groups: ['ownerId'],
            currentView: 'agenda',
            currentDate: new Date(2015, 2, 23),
            recurrenceEditMode: 'occurrence',
            dataSource: [
                {
                    startDate: new Date(2015, 2, 22, 1),
                    endDate: new Date(2015, 2, 22, 1, 30),
                    text: 'a',
                    recurrenceRule: 'FREQ=DAILY',
                    ownerId: 1
                }
            ],
            height: 600
        });

        let appointmentIndex = 0;

        sinon.stub(scheduler.instance, 'showAppointmentPopup').callsFake((rawAppointment, isNew, targetedRawAppointment) => {
            const expectedDate = new Date(2015, 2, 23 + appointmentIndex);
            expectedDate.setHours(1);

            assert.equal(targetedRawAppointment.startDate.getTime(), expectedDate.getTime(), 'Start date is OK');
        });

        scheduler.appointmentList.forEach(appointment => {
            assert.equal(appointment.title.text, 'a', 'Title is OK');
            assert.equal(appointment.marker.color, '#ff0000', 'Appointment color is OK');
            appointment.dbClick();

            appointmentIndex++;
        });
    });

    test('Particular recurrence appt data calculation', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 0, 29),
            dataSource: []
        });

        const renderingStrategy = instance.getRenderingStrategyInstance();
        const rows = [
            [0, 1, 0, 2, 1, 1, 1],
            [3, 0, 1, 0, 1, 1, 1]
        ];
        const expectedResults = [
            new Date(2015, 0, 30),
            new Date(2015, 1, 1),
            new Date(2015, 1, 1),
            new Date(2015, 1, 2),
            new Date(2015, 1, 3),
            new Date(2015, 1, 4),
            new Date(2015, 0, 29),
            new Date(2015, 0, 29),
            new Date(2015, 0, 29),
            new Date(2015, 0, 31),
            new Date(2015, 1, 2),
            new Date(2015, 1, 3),
            new Date(2015, 1, 4)
        ];

        for(let i = 0; i <= 12; i++) {
            assert.equal(renderingStrategy.getDateByIndex(i, rows, new Date(2015, 0, 29)).getTime(), expectedResults[i].getTime(), 'Date is OK');
        }
    });

    test('AllDay appointment should have specific content on agenda view', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), allDay: true }
            ]
        });

        const $contentDetails = instance.$element().find('.dx-scheduler-appointment-content-details');
        const $appointmentAllDayTitle = instance.$element().find('.dx-scheduler-appointment').eq(0).find('.dx-scheduler-appointment-content-allday');

        assert.equal($contentDetails.get(0).firstChild, $appointmentAllDayTitle.get(0), 'AllDay title is the first element of content');
        assert.equal($appointmentAllDayTitle.length, 1, 'Appointment has an allDay title');
        assert.ok($appointmentAllDayTitle.is(':visible'), 'AllDay title is visible');
    });


    test('Agenda should contain a right quantity of recurrence appointments', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), recurrenceRule: 'FREQ=DAILY' },
                { startDate: new Date(2016, 1, 22, 1), endDate: new Date(2016, 1, 22, 1, 30), recurrenceRule: 'FREQ=DAILY' },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 28, 1, 30) }
            ]
        });

        let appointmentCount = 0;
        instance.$element().find('.dx-scheduler-appointment').each(function() {
            const apptData = dataUtils.data($(this)[0], 'dxItemData');

            if(!apptData.appointmentData) {
                assert.ok(apptData.startDate);
                assert.ok(apptData.endDate);
            } else {
                assert.ok(apptData.appointmentData.startDate);
                assert.ok(apptData.appointmentData.endDate);

                assert.ok(apptData.startDate);
            }

            appointmentCount++;
        });

        assert.equal(appointmentCount, 20, 'Appointment count is OK');
    });

    test('Agenda should contain a right quantity of recurrence long appointments', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'week'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            recurrenceRuleExpr: 'RecurrenceRule',
            dataSource: [
                {
                    Start: new Date(2016, 1, 22, 1).toString(),
                    End: new Date(2016, 1, 23, 1, 30).toString(),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=3',
                    text: 'appointment 1'
                }
            ]
        });
        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 4, 'Appointment count is OK');

        instance.option({
            currentDate: new Date(2015, 1, 23),
            dataSource: [
                {
                    Start: new Date(2015, 1, 23, 1),
                    End: new Date(2015, 1, 24, 5),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=3',
                    text: 'appointment 2'
                }
            ]
        });

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 5, 'Appointment count is OK');
    });

    test('Agenda should contain a right quantity of long appointments after changing currentView', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'week'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            dataSource: [
                {
                    Start: new Date(2016, 1, 24, 1),
                    End: new Date(2016, 1, 26, 5),
                    text: 'appointment 1'
                }
            ]
        });
        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 3, 'Appointment count is OK');

        instance.option('currentView', 'week');
        instance.option('currentView', 'agenda');

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 3, 'Appointment count is OK');
    });

    test('Grouped agenda should contain a right appointment quantity', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['ownerId', 'roomId'],
            resources: [
                { field: 'ownerId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] },
                { field: 'roomId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] }
            ],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            dataSource: [
                {
                    Start: new Date(2016, 1, 25, 1).toString(),
                    End: new Date(2016, 1, 25, 1, 30).toString(),
                    ownerId: [1, 2],
                    roomId: 1,
                    text: 'one'
                }, {
                    Start: new Date(2016, 1, 26, 1).toString(),
                    End: new Date(2016, 1, 26, 1, 30).toString(),
                    ownerId: 1,
                    roomId: [1, 2],
                    text: 'two'
                }
            ]
        });
        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 4, 'Appointment count is OK');
    });

    test('Grouped agenda should contain a right long-appointment quantity', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['ownerId', 'roomId'],
            resources: [
                { field: 'ownerId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] },
                { field: 'roomId', allowMultiple: true, dataSource: [{ id: 1 }, { id: 2 }] }
            ],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            dataSource: [
                {
                    Start: new Date(2016, 1, 24, 1).toString(),
                    End: new Date(2016, 1, 26, 1, 30).toString(),
                    ownerId: [1, 2],
                    roomId: 1,
                    text: 'one'
                }
            ]
        });

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 6, 'Appointment count is OK');
    });

    test('Grouped appointments should have a correct color', function(assert) {
        const scheduler = createWrapper({
            views: ['agenda'],
            groups: ['roomId', 'ownerId'],
            resources: [
                { field: 'ownerId', dataSource: [{ id: 1, color: '#ff0000' }, { id: 2, color: '#0000ff' }], allowMultiple: true }
            ],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            dataSource: [
                {
                    Start: new Date(2016, 1, 24, 1).toString(),
                    End: new Date(2016, 1, 25, 1, 30).toString(),
                    ownerId: 1,
                    text: 'one'
                },
                {
                    Start: new Date(2016, 1, 24, 1).toString(),
                    End: new Date(2016, 1, 25, 1, 30).toString(),
                    ownerId: 2,
                    text: 'two'
                }
            ]
        });

        assert.equal(scheduler.appointmentList[0].marker.color, '#ff0000', 'Appointment color is OK');
        assert.equal(scheduler.appointmentList[1].marker.color, '#ff0000', 'Appointment color is OK');

        assert.equal(scheduler.appointmentList[2].marker.color, '#0000ff', 'Appointment color is OK');
        assert.equal(scheduler.appointmentList[3].marker.color, '#0000ff', 'Appointment color is OK');
    });

    test('Grouped appointments should be rendered if resources aren\'t defined', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['roomId', 'ownerId'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24).toString(),
            endDateExpr: 'End',
            startDateExpr: 'Start',
            dataSource: [
                {
                    Start: new Date(2016, 1, 24, 1).toString(),
                    End: new Date(2016, 1, 24, 1, 30).toString(),
                    ownerId: 1,
                    text: 'one'
                },
                {
                    Start: new Date(2016, 1, 24, 1).toString(),
                    End: new Date(2016, 1, 24, 1, 30).toString(),
                    ownerId: 2,
                    text: 'two'
                }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointments.length, 2, 'Appointments are rendered');
    });

    test('Group row count should depend on existing appointment count', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['roomId', 'ownerId'],
            resources: [
                {
                    field: 'roomId',
                    allowMultiple: true,
                    dataSource: [
                        { id: 1 },
                        { id: 2 }
                    ]
                },
                {
                    field: 'ownerId',
                    allowMultiple: true,
                    dataSource: [
                        { id: 1 },
                        { id: 2 }
                    ]
                }
            ],
            currentView: 'agenda',
            currentDate: new Date(2015, 2, 4).toString(),
            height: 800,
            dataSource: [
                {
                    text: 'Task 2',
                    roomId: [1, 2, 3],
                    ownerId: 1,
                    startDate: new Date(2015, 2, 5, 8, 0).toString(),
                    endDate: new Date(2015, 2, 7, 9, 0).toString()
                }, {
                    text: 'Task 3',
                    roomId: [1, 2],
                    ownerId: 1,
                    startDate: new Date(2015, 2, 4, 1).toString(),
                    endDate: new Date(2015, 2, 4, 2).toString()
                }
            ]
        });

        const $groupTable = instance.$element().find('.dx-scheduler-group-table');
        const $rows = $groupTable.find('.dx-scheduler-group-row');

        assert.equal($rows.length, 2, 'Row count is OK');
        assert.equal($rows.eq(0).find('.dx-scheduler-group-header').length, 2, 'Cell count is OK');
        assert.equal($rows.eq(1).find('.dx-scheduler-group-header').length, 2, 'Cell count is OK');
    });

    test('Group header height should depend on existing appointment count', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['roomId', 'ownerId'],
            resources: [
                {
                    field: 'roomId',
                    allowMultiple: true,
                    dataSource: [
                        { id: 1 },
                        { id: 2 }
                    ]
                },
                {
                    field: 'ownerId',
                    allowMultiple: true,
                    dataSource: [
                        { id: 1 },
                        { id: 2 }
                    ]
                }
            ],
            currentView: 'agenda',
            currentDate: new Date(2015, 2, 4).toString(),
            dataSource: [
                {
                    text: 'Task 1',
                    roomId: [1, 2],
                    ownerId: 1,
                    startDate: new Date(2015, 2, 5, 8, 0).toString(),
                    endDate: new Date(2015, 2, 7, 9, 0).toString()
                }
            ]
        });

        const $groupTable = instance.$element().find('.dx-scheduler-group-table');
        const $headers = $groupTable.find('.dx-scheduler-group-header-content');

        assert.equal($headers.length, 4, 'Header count is OK');
        assert.roughEqual(getOuterHeight($headers.eq(1)), 240, 2, 'Header height is OK');
        assert.roughEqual(getOuterHeight($headers.eq(3)), 240, 2, 'Header height is OK');
    });

    test('Group agenda with recurrence appointments should be rendered correctly (T683374)', function(assert) {
        const data = [
            {
                text: 'Upgrade Personal Computers',
                priorityId: 1,
                startDate: new Date(2018, 4, 13, 9),
                endDate: new Date(2018, 4, 13, 11, 30),
                recurrenceRule: 'FREQ=DAILY;COUNT=4'
            },
            {
                text: 'Prepare 2018 Marketing Plan',
                priorityId: 2,
                startDate: new Date(2018, 4, 14, 11, 0),
                endDate: new Date(2018, 4, 14, 13, 30)
            }
        ];

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

        const scheduler = createScheduler({
            dataSource: data,
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2018, 4, 14),
            groups: ['priorityId'],
            resources: [
                {
                    fieldExpr: 'priorityId',
                    allowMultiple: false,
                    dataSource: priorityData,
                    label: 'Priority'
                }
            ],
            height: 700
        });

        assert.equal(scheduler.grouping.getGroupHeaderContentCount(), 2, 'Header count is OK');
        assert.roughEqual(scheduler.grouping.getGroupHeaderContentHeight(0), 240, 2, 'Header height is OK');
        assert.roughEqual(scheduler.grouping.getGroupHeaderContentHeight(1), 80, 2, 'Header height is OK');
        assert.equal(scheduler.workSpace.getRowCount(), 4, 'Row count is OK');
    });

    test('Group header should be rendered in right place (T374948)', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            groups: ['priorityId'],
            currentView: 'agenda',
            startDayHour: 6,
            endDayHour: 24,
            height: 600
        });

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

        instance.option('currentDate', new Date(2015, 4, 25));
        instance.option('dataSource', [
            {
                text: 'Website Re-Design Plan',
                priorityId: 2,
                startDate: new Date(2015, 4, 25, 9, 0),
                endDate: new Date(2015, 4, 25, 11, 30)
            }, {
                text: 'Book Flights to San Fran for Sales Trip',
                priorityId: 2,
                startDate: new Date(2015, 4, 25, 12, 0),
                endDate: new Date(2015, 4, 25, 13, 0)
            }, {
                text: 'Install New Router in Dev Room',
                priorityId: 1,
                startDate: new Date(2015, 4, 25, 14, 30),
                endDate: new Date(2015, 4, 25, 15, 30)
            }, ]
        );
        instance.option('resources', [{
            field: 'priorityId',
            allowMultiple: false,
            dataSource: priorityData,
            label: 'Priority'
        }]);

        const $groupTable = instance.$element().find('.dx-scheduler-group-table');
        const $container = instance.$element().find('.dx-scheduler-date-table-scrollable-content');

        assert.equal($groupTable.length, 1, 'Group table was rendered');
        assert.equal($container.children().get(0), $groupTable.get(0), 'Group table was rendered in right place');
    });

    test('Row count should be correct if appt ends at 0h 0m 0sec (T378182)', function(assert) {
        const instance = createInstance({
            dataSource: [{
                clubId: 1,
                text: 'One',
                startDate: '2016-06-15T19:00:00.000Z',
                endDate: '2016-06-15T21:00:00.000Z'
            }],
            resources: [
                {
                    field: 'clubId',
                    dataSource: [{ id: 1 }]
                }
            ],
            groups: ['clubId'],
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 5, 12)
        });

        assert.equal(instance.$element().find('.dx-scheduler-date-table-row').length, 1, 'Row count is OK');
    });

    test('Agenda should contain a right appointment sorting', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 26, 1), endDate: new Date(2016, 1, 27, 1, 30), text: 'e' },
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 28, 1, 30), text: 'd' },
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), text: 'a' },
                { Start: new Date(2016, 1, 25, 1), endDate: new Date(2016, 1, 25, 1, 30), text: 'b' },
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), text: 'c' }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(dataUtils.data($appointments.get(0), 'dxItemData').text, 'd'); // 24
        assert.equal(dataUtils.data($appointments.get(1), 'dxItemData').text, 'a'); // 24
        assert.equal(dataUtils.data($appointments.get(2), 'dxItemData').text, 'c'); // 24
        assert.equal(dataUtils.data($appointments.get(3), 'dxItemData').text, 'd'); // 25
        assert.equal(dataUtils.data($appointments.get(4), 'dxItemData').text, 'b'); // 25
        assert.equal(dataUtils.data($appointments.get(5), 'dxItemData').text, 'd'); // 26
        assert.equal(dataUtils.data($appointments.get(6), 'dxItemData').text, 'e'); // 26
        assert.equal(dataUtils.data($appointments.get(7), 'dxItemData').text, 'e'); // 27
        assert.equal(dataUtils.data($appointments.get(8), 'dxItemData').text, 'd'); // 27
        assert.equal(dataUtils.data($appointments.get(9), 'dxItemData').text, 'd'); // 28
    });

    test('Agenda should contain a right appointment sorting after adding of the new appointment', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 6), endDate: new Date(2016, 1, 24, 6, 30), text: 'a' },
                { Start: new Date(2016, 1, 27, 1), endDate: new Date(2016, 1, 27, 1, 30), text: 'b' }
            ]
        });

        instance.addAppointment({ Start: new Date(2016, 1, 25, 1), endDate: new Date(2016, 1, 25, 1, 30), text: 'c' });
        const $appointments = instance.$element().find('.dx-scheduler-appointment');
        assert.equal(dataUtils.data($appointments.get(0), 'dxItemData').text, 'a');
        assert.equal(dataUtils.data($appointments.get(1), 'dxItemData').text, 'c');
        assert.equal(dataUtils.data($appointments.get(2), 'dxItemData').text, 'b');
    });

    test('Agenda should contain a right appointment sorting after updating of the', function(assert) {
        const items = [
            { Start: new Date(2016, 1, 24, 6), endDate: new Date(2016, 1, 24, 6, 30), text: 'a' },
            { Start: new Date(2016, 1, 27, 1), endDate: new Date(2016, 1, 27, 1, 30), text: 'b' }
        ];
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDateExpr: 'Start',
            dataSource: items
        });

        instance.updateAppointment(items[0], { Start: new Date(2016, 1, 24, 6), endDate: new Date(2016, 1, 24, 9, 30), text: 'a' });
        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(dataUtils.data($appointments.get(0), 'dxItemData').text, 'a');
        assert.equal(dataUtils.data($appointments.get(1), 'dxItemData').text, 'b');
    });

    test('Agenda should contain a right recurrence appointment sorting', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), text: 'd' },
                { Start: new Date(2016, 1, 22, 5), endDate: new Date(2016, 1, 22, 5, 30), text: 'e', recurrenceRule: 'FREQ=DAILY' },
                { Start: new Date(2016, 1, 23, 2), endDate: new Date(2016, 1, 23, 2, 30), text: 'f', recurrenceRule: 'FREQ=DAILY' }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(dataUtils.data($appointments.get(0), 'dxItemData').text, 'd'); // 24
        assert.equal(dataUtils.data($appointments.get(1), 'dxItemData').text, 'f'); // 24
        assert.equal(dataUtils.data($appointments.get(2), 'dxItemData').text, 'e'); // 24
    });

    test('Long & recurrence appts should be sorted correctly', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 1, 23),
            dataSource: [
                { startDate: new Date(2015, 1, 22, 1), endDate: new Date(2015, 1, 22, 1, 30), text: 'a', recurrenceRule: 'FREQ=DAILY' },
                { startDate: new Date(2015, 1, 23, 3), endDate: new Date(2015, 1, 28, 3, 30), text: 'long...' },
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');
        const recurrenceApptsIndices = [0, 3, 5, 7, 9, 11, 12];
        const longApptsIndices = [1, 2, 4, 6, 8, 10];

        $appointments.each(function(index, appt) {
            const $appt = $(appt);
            let positionInArray;

            if($appt.hasClass('dx-scheduler-appointment-recurrence')) {
                positionInArray = recurrenceApptsIndices.indexOf(index);
                assert.notOk($appt.hasClass('dx-scheduler-appointment-reduced'), 'Recurrence appt doesn\'t have \'reduced\' class');

            } else {
                positionInArray = longApptsIndices.indexOf(index);
            }

            assert.ok(positionInArray > -1, 'Appointment are rendered correctly');

        });
    });

    test('Appointments should have correct width & height', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24)
        });

        const agenda = instance.getWorkSpace();
        const rowHeight = 77;
        const $element = instance.$element();
        const expectedWidth = getOuterWidth($element.find('.dx-scheduler-date-table'));
        const agendaStub = sinon.stub(agenda, '_getRowHeight').returns(rowHeight);

        try {
            instance.option('dataSource', [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) }
            ]);

            const $appointments = instance.$element().find('.dx-scheduler-appointment');

            assert.roughEqual(getOuterHeight($appointments.eq(0)), 2.001, rowHeight, 'Appointment height is OK');
            assert.equal(parseInt($appointments.eq(0).css('marginBottom'), 10), 5, 'Appointment offset is OK');
            assert.roughEqual(getOuterWidth($appointments.eq(0)), 2.001, expectedWidth, 'Appointment width is OK');

            assert.roughEqual(getOuterHeight($appointments.eq(1)), 2.001, rowHeight, 'Appointment height is OK');
            assert.equal(parseInt($appointments.eq(1).css('marginBottom'), 10), 20, 'Appointment offset is OK');
            assert.roughEqual(getOuterWidth($appointments.eq(1)), 2.001, expectedWidth, 'Appointment width is OK');

        } finally {
            agendaStub.restore();
        }
    });

    test('Grouped appointments should have a right offsets', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            groups: ['ownerId', 'roomId'],
            resources: [
                { field: 'ownerId', dataSource: [{ id: 1 }, { id: 2 }], allowMultiple: true },
                { field: 'roomId', dataSource: [{ id: 1 }, { id: 2 }], allowMultiple: true }
            ],
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), roomId: [1, 2], ownerId: [1, 2] },
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30), roomId: [1, 2], ownerId: [1, 2] }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(parseInt($appointments.eq(0).css('marginBottom'), 10), 5, 'Appointment offset is OK');
        assert.equal(parseInt($appointments.eq(1).css('marginBottom'), 10), 20, 'Appointment offset is OK');

        assert.equal(parseInt($appointments.eq(2).css('marginBottom'), 10), 5, 'Appointment offset is OK');
        assert.equal(parseInt($appointments.eq(3).css('marginBottom'), 10), 20, 'Appointment offset is OK');
    });

    test('Tooltip should appear by appointment click', function(assert) {
        const scheduler = createScheduler({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) }
            ]
        }, this.clock);

        scheduler.appointments.click();
        assert.ok(scheduler.tooltip.isVisible(), 'Tooltip is rendered');
    });

    test('Agenda should be rerendered when data source is changed', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) }
            ]
        });

        let $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 1, 'Date table rows are OK');
        assert.equal($element.find('.dx-scheduler-time-panel-row').length, 1, 'Time panel rows are OK');

        instance.addAppointment({
            startDate: new Date(2016, 1, 25, 1),
            endDate: new Date(2016, 1, 25, 1, 30)
        });

        $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-date-table-row').length, 2, 'Date table rows are OK');
        assert.equal($element.find('.dx-scheduler-time-panel-row').length, 2, 'Time panel rows are OK');
    });

    test('Appointment count should be ok after dimensionChanged', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 11),
            currentView: 'agenda',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: new Date(2016, 1, 11, 10),
                endDate: new Date(2016, 1, 11, 15),
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        resizeCallbacks.fire();

        assert.equal(instance._appointments.option('items').length, 7, 'Appointments are OK before rendering');
    });

    test('Appts should not be repainted when the \'editing\' option is changed', function(assert) {
        const instance = createInstance({
            currentDate: new Date(2016, 1, 11),
            currentView: 'agenda',
            dataSource: [{
                text: 'a',
                allDay: true,
                startDate: new Date(2016, 1, 11, 10),
                endDate: new Date(2016, 1, 11, 15),
                recurrenceRule: 'FREQ=DAILY'
            }]
        });

        const apptsInstance = instance.getAppointmentsInstance();
        const repaintStub = sinon.stub(apptsInstance, 'repaint');

        instance.option('editing', { allowUpdating: false });

        assert.equal(repaintStub.callCount, 0, 'The \'repaint\' method isn\'t called');
    });

    test('No Data message should be rendered if agenda is empty', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: []
        });

        const $element = instance.$element();
        const $message = $element.find('.dx-scheduler-agenda-nodata');

        assert.equal($message.length, 1, 'Message was rendered');
        assert.equal($message.text(), 'No data to display', 'Message is correct');
    });

    test('Custom No Data message should be rendered if agenda is empty', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: [],
            noDataText: 'No data'
        });

        const $element = instance.$element();
        const $message = $element.find('.dx-scheduler-agenda-nodata');

        assert.equal($message.length, 1, 'Message was rendered');
        assert.equal($message.text(), 'No data', 'Message is correct');
    });

    test('No Data message should be rendered if agenda is empty, grouped agenda', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 26),
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 25, 1, 30), group: 1 }
            ],
            groups: ['group'],
            resources: [
                {
                    field: 'group',
                    allowMultiple: true,
                    dataSource: [
                        {
                            text: 'Group1',
                            id: 1
                        },
                        {
                            text: 'Group2',
                            id: 2
                        }
                    ]
                }]
        });

        const $element = instance.$element();
        const $message = $element.find('.dx-scheduler-agenda-nodata');

        assert.equal($message.length, 1, 'Message was rendered');
        assert.equal($message.text(), 'No data to display', 'Message is correct');
    });

    test('No Data message should not be rendered if one group doesn\'t have appts, grouped agenda', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            height: 500,
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 2), groupID: 1 }
            ],
            groups: ['groupID'],
            resources: [
                {
                    field: 'groupID',
                    allowMultiple: true,
                    dataSource: [
                        {
                            text: 'Group1',
                            id: 1
                        },
                        {
                            text: 'Group2',
                            id: 2
                        }
                    ]
                }]
        });

        const $element = instance.$element();
        const $message = $element.find('.dx-scheduler-agenda-nodata');
        const $apps = $element.find('.dx-scheduler-appointment');

        assert.equal($message.length, 0, 'Message is absent');
        assert.equal($apps.length, 1, 'Appointments was found');
    });

    test('No Data message should be removed after dataSource changing', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: []
        });

        instance.option('dataSource', [
            { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 25, 1, 30) }
        ]);

        const $element = instance.$element();
        const $message = $element.find('.dx-scheduler-agenda-nodata');

        assert.equal($message.length, 0, 'Message was remover');
    });

    test('The timeZone option should be processed correctly', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 4, 6),
            timeZone: 'Asia/Ashkhabad',
            dataSource: [{
                startDate: new Date(2016, 4, 7),
                startDateTimeZone: 'Asia/Qyzylorda',
                endDate: new Date(2016, 4, 7, 0, 30),
                text: 'a'
            }, {
                startDate: new Date(2016, 4, 7, 23),
                endDate: new Date(2016, 4, 7, 23, 59),
                text: 'b'
            }]
        });

        const $element = instance.$element();
        const $dateTableRows = $element.find('.dx-scheduler-date-table-row');
        const $timePanelRows = $element.find('.dx-scheduler-time-panel-row');

        assert.equal($timePanelRows.length, 2, 'Timepanel row count is OK');
        assert.equal($dateTableRows.length, 2, 'DateTable row count is OK');
    });

    test('All-day appointment should not be duplicated with custom timezone', function(assert) {
        const tzOffsetStub = sinon.stub(timeZoneUtils, 'getClientTimezoneOffset').returns(-10800000);
        try {
            this.clock.restore();
            const timezoneDifference = getDeltaTz(5);
            const getDate = function(date) {
                return new Date(date.getTime() - timezoneDifference);
            };

            const instance = createInstance({
                views: ['agenda'],
                currentView: 'agenda',
                currentDate: new Date(2016, 4, 3),
                timeZone: 'Asia/Ashkhabad',
                dataSource: [{
                    startDate: getDate(new Date(2016, 4, 4)),
                    endDate: getDate(new Date(2016, 4, 5))
                }]
            });

            const $appts = instance.$element().find('.dx-scheduler-appointment');

            assert.equal($appts.length, 1, 'Appt count is OK');
        } finally {
            tzOffsetStub.restore();
        }
    });

    test('All-day appointment should not be duplicated with custom timezone (T437288)', function(assert) {
        this.clock.restore();

        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2015, 4, 18),
            timeZone: 'America/Los_Angeles',
            height: 300,
            dataSource: [{
                startDate: '2015-05-25T00:00:00.000Z',
                endDate: '2015-05-26T00:00:00.000Z'
            }]
        });

        const $appts = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appts.length, 1, 'Appt count is OK');
    });

    test('Recurring appointment and timepanel should be rendered correctly if DST makes sense(T444318)', function(assert) {
        // can be reproduced in PST timezone
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 10, 5),
            firstDayOfWeek: 1,
            height: 300,
            dataSource: [{
                text: 'test-rec',
                startDate: new Date(2016, 10, 3, 9, 0),
                endDate: new Date(2016, 10, 3, 9, 15),
                recurrenceRule: 'FREQ=WEEKLY;INTERVAL=1'
            }]
        });

        const $element = instance.$element();
        const $appts = $element.find('.dx-scheduler-appointment');
        const timePanelDate = $element.find('.dx-scheduler-agenda-date').text();

        assert.equal($appts.length, 1, 'Appt count is OK');
        assert.equal(timePanelDate, '10 Thu', 'Time panel date is OK');
    });

    test('Recurring appointment and timepanel should be rendered correctly if DST makes sense(T444318), the second case', function(assert) {
        // can be reproduced in PST timezone
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 10, 6),
            firstDayOfWeek: 1,
            height: 300,
            dataSource: [{
                text: 'test-rec',
                startDate: new Date(2016, 10, 6, 1, 0),
                endDate: new Date(2016, 10, 6, 1, 15),
                recurrenceRule: 'FREQ=WEEKLY;INTERVAL=1'
            }]
        });

        const $element = instance.$element();
        const $appts = $element.find('.dx-scheduler-appointment');
        const $timePanelDateEl = $element.find('.dx-scheduler-agenda-date');
        const timePanelDate = $timePanelDateEl.text();

        assert.equal($appts.length, 1, 'Appt count is OK');
        assert.equal($timePanelDateEl.length, 1, 'Timepanel cell count is OK');
        assert.equal(timePanelDate, '6 Sun', 'Time panel date is OK');
    });

    test('resourceCellTemplate should take cellElement with correct geometry (T453520)', function(assert) {
        createInstance({
            currentView: 'agenda',
            views: ['agenda'],
            height: 700,
            width: 700,
            groups: ['owner'],
            currentDate: new Date(2016, 10, 28),
            resources: [{
                fieldExpr: 'owner',
                dataSource: [{ id: 1, text: 'a' }]
            }],
            dataSource: [{
                startDate: new Date(2016, 10, 28, 1),
                endDate: new Date(2016, 10, 28, 2),
                owner: 1
            }],
            resourceCellTemplate: function(cellData, cellIndex, cellElement) {
                assert.equal(getOuterWidth($(cellElement)), 80, 'Resource cell width is OK');
                assert.equal(getOuterHeight($(cellElement)), 80, 'Resource cell height is OK');
            }
        });
    });

    test('Long appointment parts data should be correct', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 11, 30), text: 'a' }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(dataUtils.data($appointments.get(0), 'dxItemData').text, 'a');
        assert.equal(dataUtils.data($appointments.get(1), 'dxItemData').text, 'a');
        assert.equal(dataUtils.data($appointments.get(2), 'dxItemData').text, 'a');
        assert.equal(dataUtils.data($appointments.get(3), 'dxItemData').text, 'a');

        assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData').Start, new Date(2016, 1, 24, 1)); // first part of long appointment has original startDate
        assert.deepEqual(dataUtils.data($appointments.get(0), 'dxItemData').endDate, new Date(2016, 1, 27, 11, 30)); // first part of long appointment has original endDate

        const expectedTimes = [
            '8:00 AM - 8:00 PM',
            '8:00 AM - 8:00 PM',
            '8:00 AM - 8:00 PM',
            '8:00 AM - 11:30 AM',
        ];

        const $appts = instance.$element().find('.dx-scheduler-appointment');

        expectedTimes.forEach((expectedTime, index) => {
            const time = $appts.eq(index)
                .find('.dx-scheduler-appointment-content-date').first().text();
            assert.equal(time, expectedTime, `${index} date is correct`);
        });
    });

    test('Long appointment parts targetedAppointmentData should be correct', function(assert) {
        createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 25),
            firstDayOfWeek: 1,
            height: 300,
            onAppointmentRendered: function(e) {
                const targetedAppointmentData = e.targetedAppointmentData;
                const originalAppointmentData = e.appointmentData;

                assert.deepEqual(targetedAppointmentData, originalAppointmentData, 'Targeted appointment data is ok');
            },
            dataSource: [
                { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 11, 30), text: 'a' }
            ]
        });
    });

    test('Long appointment parts popup should have original data', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 1, 30), text: 'a' }
            ]
        });

        const $appointment = $(instance.$element()).find('.dx-scheduler-appointment').eq(1);
        $appointment.trigger(dblclickEvent.name);

        const detailsForm = instance.getAppointmentDetailsForm();
        const formData = detailsForm.option('formData');

        assert.deepEqual(formData.Start, new Date(2016, 1, 24, 1), 'start is correct');
        assert.deepEqual(formData.endDate, new Date(2016, 1, 27, 1, 30), 'end is correct');
        assert.equal(formData.text, 'a', 'text is correct');
    });

    test('Long appointment should be rendered correctly after changing view', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'month'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 10), text: 'a' }
            ]
        });

        let $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointments.length, 4, 'appointments are OK');

        instance.option('currentView', 'month');
        const cellWidth = getOuterWidth(instance.$element().find('.dx-scheduler-date-table-cell').eq(0));
        $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointments.length, 1, 'appointment is OK');
        assert.roughEqual(getOuterWidth($appointments.eq(0)), cellWidth * 4, 2.5, 'appointment size is OK');
    });

    test('Timepanel rows count should be OK for long appointment', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'month'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 10), text: 'a' }
            ]
        });

        const $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-time-panel-row').length, 4, 'Time panel rows are OK');
    });

    test('Timepanel rows count should be OK for long recurrence appointment', function(assert) {
        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDateExpr: 'Start',
            recurrenceRuleExpr: 'Recurrence',
            dataSource: [
                { Start: new Date(2016, 1, 24, 22), endDate: new Date(2016, 1, 25, 10), text: 'a', Recurrence: 'FREQ=DAILY;COUNT=2' }
            ]
        });

        const $element = instance.$element();

        assert.equal($element.find('.dx-scheduler-time-panel-row').length, 3, 'Time panel rows are OK');
    });

    test('Long appointment should have a correct template', function(assert) {
        const instance = createInstance({
            views: ['agenda', 'month'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 9, 30), endDate: new Date(2016, 1, 27, 10), text: 'a' }
            ]
        });

        const $appts = instance.$element().find('.dx-scheduler-appointment');
        const $firstContentDates = $appts.eq(0).find('.dx-scheduler-appointment-content-date');
        const $secondContentDates = $appts.eq(1).find('.dx-scheduler-appointment-content-date');
        const $lastContentDates = $appts.last().find('.dx-scheduler-appointment-content-date');

        assert.equal($firstContentDates.first().text(), '9:30 AM - 8:00 PM', 'First date is correct');
        assert.equal($secondContentDates.first().text(), '8:00 AM - 8:00 PM', 'Second date is correct');
        assert.equal($lastContentDates.first().text(), '8:00 AM - 10:00 AM', 'Last date is correct');

    });

    test('Agenda should contain a right appointment quantity after dataSource reloading', function(assert) {
        const data = [
            { startDate: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 24, 1, 30) },
        ];

        const dataSource = new DataSource({
            store: new CustomStore({
                load: function() {
                    const d = $.Deferred();
                    setTimeout(function() {
                        d.resolve(data);
                    }, 100);
                    return d.promise();
                }
            })
        });

        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            dataSource: dataSource
        });

        this.clock.tick(100);
        dataSource.load();
        this.clock.tick(100);
        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 1, 'Appointment count is OK');
    });

    test('Appointments should be rendered correctly if agenda view is set as object', function(assert) {
        const instance = createInstance({
            views: [{ type: 'day', name: 'My day' }, { type: 'agenda', name: 'My agenda' }],
            currentView: 'My agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            endDayHour: 20,
            startDateExpr: 'Start',
            dataSource: [
                { Start: new Date(2016, 1, 24, 1), endDate: new Date(2016, 1, 27, 10), text: 'a' }
            ]
        });

        const $appointments = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointments.length, 4, 'appointments are OK');
        assert.equal($appointments.first().position().top, 0, 'appointment position is OK');
        assert.equal($appointments.last().position().top, 240, 'appointment position is OK');
    });

    test('Long appointment should not affect render the next appointment', function(assert) {
        const data = [{
            text: 'Long',
            startDate: new Date(2020, 9, 1, 21, 15),
            endDate: new Date(2020, 9, 2, 9, 15)
        }, {
            text: 'Simple',
            startDate: new Date(2020, 9, 4, 21, 16),
            endDate: new Date(2020, 9, 4, 22)
        }];

        const instance = createInstance({
            currentView: 'agenda',
            views: ['agenda'],
            currentDate: new Date(2020, 9, 1),
            startDayHour: 9,
            dataSource: data
        });

        const items = instance._appointments.option('items');

        const expectedTimes = [
            '9:15 PM - 12:00 AM',
            '9:00 AM - 9:15 AM',
            '9:16 PM - 10:00 PM',
        ];

        const $appts = instance.$element().find('.dx-scheduler-appointment');

        expectedTimes.forEach((expectedTime, index) => {
            const time = $appts.eq(index)
                .find('.dx-scheduler-appointment-content-date').first().text();
            assert.equal(time, expectedTime, `${index} date is correct`);
        });

        const { itemData } = items[2];
        assert.deepEqual(itemData.startDate, data[1].startDate, 'Simple item startDate is correct');
        assert.deepEqual(itemData.endDate, data[1].endDate, 'Simple item endDate is correct');
    });

    test('Several days appointment should be rendered correctly if startDayHour is set', function(assert) {
        const data = [{
            startDate: new Date(2016, 1, 24, 1),
            endDate: new Date(2016, 1, 24, 1, 30)
        }, {
            startDate: new Date(2016, 1, 24, 7),
            endDate: new Date(2016, 1, 24, 7, 30)
        }, {
            startDate: new Date(2016, 1, 24, 9),
            endDate: new Date(2016, 1, 26, 9, 30)
        }];

        const instance = createInstance({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2016, 1, 24),
            startDayHour: 8,
            dataSource: data
        });

        const filteredItems = instance.filteredItems;

        assert.equal(filteredItems.length, 1, 'Filtered items amount is correct');
        assert.deepEqual(filteredItems[0], data[2], 'Filtered item is correct');

        const appointments = instance.getAppointmentsInstance();
        const $itemElements = appointments.itemElements();

        assert.deepEqual($itemElements.length, 3, 'Appointment elements amount is correct');

        // TODO: filtered items should not have settings due to it is a filtered dataSource items.
        filteredItems.forEach(item => item.settings = null);

        const renderingStrategy = instance.getLayoutManager().getRenderingStrategyInstance();
        const itemPositions = renderingStrategy.createTaskPositionMap(filteredItems);

        assert.equal(itemPositions.length, 3, 'Item positions amount is correct');
        itemPositions.forEach((itemPosition, index) => {
            assert.equal(itemPosition[0].sortedIndex, index, `Item ${index} sortIndex is correct`);
            assert.equal(itemPosition[0].groupIndex, 0, 'Item groupIndex is correct');
        });
    });

    test('Long recurrence appointment should have a correct time', function(assert) {
        const data = [
            {
                startDate: new Date(2021, 1, 22, 9),
                endDate: new Date(2021, 1, 24, 10, 30),
                recurrenceRule: 'FREQ=DAILY;COUNT=3',
                text: 'Long and recurrence'
            }
        ];

        const scheduler = createWrapper({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2021, 1, 22),
            startDayHour: 8,
            endDayHour: 20,
            dataSource: data
        });

        const expectedTimes = [
            '9:00 AM - 8:00 PM',
            '8:00 AM - 8:00 PM',
            '9:00 AM - 8:00 PM',
            '8:00 AM - 10:30 AM',
            '8:00 AM - 8:00 PM',
            '9:00 AM - 8:00 PM',
            '8:00 AM - 10:30 AM',
            '8:00 AM - 8:00 PM',
            '8:00 AM - 10:30 AM'
        ];

        const appointments = scheduler.appointmentList;
        expectedTimes.forEach((expectedTime, index) => {
            const time = appointments[index].date;

            assert.equal(time, expectedTime, `${index} date is correct`);
        });

        assert.notOk(data[0].settings, 'Agenda doesn\'t modify user data of long recurence appointment');
    });

    test('Appointment of diffent types should have a correct time', function(assert) {
        const data = [
            {
                startDate: new Date(2021, 1, 24, 9),
                endDate: new Date(2021, 1, 24, 11, 30),
                text: 'One day'
            },
            {
                startDate: new Date(2021, 1, 20, 1),
                endDate: new Date(2021, 1, 20, 9, 30),
                text: 'Invisible one'
            },
            {
                startDate: new Date(2021, 1, 23, 1),
                endDate: new Date(2021, 1, 25, 10, 30),
                text: 'Long'
            }
        ];

        const scheduler = createWrapper({
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2021, 1, 22),
            startDayHour: 8,
            endDayHour: 20,
            dataSource: data
        });

        const expectedTimes = [
            '8:00 AM - 8:00 PM',
            '8:00 AM - 8:00 PM',
            '9:00 AM - 11:30 AM',
            '8:00 AM - 10:30 AM',
        ];

        const appointments = scheduler.appointmentList;
        expectedTimes.forEach((expectedTime, index) => {
            const time = appointments[index].date;
            assert.equal(time, expectedTime, `${index} date is correct`);
        });

        assert.notOk(data[0].settings, 'Agenda doesn\'t modify user data of short appointment');
        assert.notOk(data[1].settings, 'Agenda doesn\'t modify user data of invisible appointment');
        assert.notOk(data[2].settings, 'Agenda doesn\'t modify user data of long appointment');
    });

    module('Rows calculation', function() {
        test('Agenda row count calculation', function(assert) {
            const data = [
                { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 0, 30) },
                { startDate: new Date(2016, 1, 20), endDate: new Date(2016, 1, 20, 0, 30) },
                { startDate: new Date(2016, 1, 18), endDate: new Date(2016, 1, 18, 0, 30) },
                { startDate: new Date(2016, 1, 18), endDate: new Date(2016, 1, 18, 0, 30) },
                { startDate: new Date(2016, 1, 22), endDate: new Date(2016, 1, 22, 0, 30) },
                { startDate: new Date(2016, 2, 2), endDate: new Date(2016, 2, 22, 0, 30) },

                { startDate: new Date(2016, 0, 30), endDate: new Date(2016, 1, 1, 5, 30) },

                { startDate: new Date(2016, 2, 23), endDate: new Date(2016, 2, 24, 5, 30) }
            ];

            const instance = createInstance({
                views: [{
                    type: 'agenda',
                    agendaDuration: 65,
                    currentDate: new Date(2016, 1, 1)
                }],
                currentView: 'agenda',
                dataSource: []
            });

            const expectedRows = [0, 1, 17, 19, 21, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
            const agendaWorkspace = instance.getWorkSpace();

            // act
            instance.option('dataSource', data);

            const calculatedRows = agendaWorkspace._rows[0];
            assert.equal(calculatedRows.length, 65, 'Rows are OK');

            $.each(calculatedRows, function(index, item) {
                if($.inArray(index, expectedRows) > -1) {
                    if(index === 17) {
                        assert.equal(item, 2, 'Row is OK');
                    } else {
                        assert.equal(item, 1, 'Row is OK');
                    }
                } else {
                    assert.equal(item, 0, 'Row is OK');
                }
            });
        });

        test('Agenda row count calculation with recurrence appointments', function(assert) {
            const instance = createInstance({
                views: [{
                    type: 'agenda',
                    agendaDuration: 5,
                    currentDate: new Date(2016, 1, 1)
                }],
                currentView: 'agenda'
            });

            const endViewDateStub = sinon.stub(instance, 'getEndViewDate').returns(new Date(2016, 1, 5, 23, 59));
            const startViewDateStub = sinon.stub(instance, 'getStartViewDate').returns(new Date(2016, 1, 1));
            const data = [
                { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 0, 30) },
                { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 0, 30), recurrenceRule: 'FREQ=DAILY' },
                { startDate: new Date(2016, 0, 31), endDate: new Date(2016, 0, 31, 0, 30), recurrenceRule: 'FREQ=DAILY' }
            ];

            const agendaWorkspace = instance.getWorkSpace();

            try {
                // act
                instance.option('dataSource', data);

                const calculatedRows = agendaWorkspace._rows;
                assert.deepEqual(calculatedRows, [[1, 2, 2, 2, 2]], 'Rows are OK');
            } finally {
                endViewDateStub.restore();
                startViewDateStub.restore();
            }
        });

        test('Agenda row count calculation with wrong endDate appointments', function(assert) {

            const instance = createInstance({
                views: [{
                    type: 'agenda',
                    agendaDuration: 5,
                    currentDate: new Date(2016, 1, 1)
                }],
                currentView: 'agenda'
            });

            const data = [
                { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 0, 30) },
                { startDate: new Date(2016, 1, 3, 3, 30), endDate: new Date(2016, 1, 3) },
                { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 0, 30) }
            ];

            const endViewDateStub = sinon.stub(instance, 'getEndViewDate').returns(new Date(2016, 1, 5, 23, 59));
            const startViewDateStub = sinon.stub(instance, 'getStartViewDate').returns(new Date(2016, 1, 1));
            const agendaWorkspace = instance.getWorkSpace();

            try {
                // act
                instance.option('dataSource', data);

                const calculatedRows = agendaWorkspace._rows;
                assert.deepEqual(calculatedRows, [[0, 1, 1, 1, 0]], 'Rows are OK');
            } finally {
                endViewDateStub.restore();
                startViewDateStub.restore();
            }
        });

        test('Agenda row count calculation with long appointments', function(assert) {
            const instance = createInstance({
                views: [{
                    type: 'agenda',
                    agendaDuration: 5,
                    currentDate: new Date(2016, 1, 1)
                }],
                currentView: 'agenda'
            });

            const data = [
                { startDate: new Date(2016, 1, 1, 1), endDate: new Date(2016, 1, 4, 10, 30) }
            ];

            const endViewDateStub = sinon.stub(instance, 'getEndViewDate').returns(new Date(2016, 1, 5, 23, 59));
            const startViewDateStub = sinon.stub(instance, 'getStartViewDate').returns(new Date(2016, 1, 1));
            const agendaWorkspace = instance.getWorkSpace();

            try {
                // act
                instance.option('dataSource', data);

                const calculatedRows = agendaWorkspace._rows;
                assert.deepEqual(calculatedRows, [[1, 1, 1, 1, 0]], 'Rows are OK');
            } finally {
                endViewDateStub.restore();
                startViewDateStub.restore();
            }
        });

        test('Agenda row count calculation with long recurrence appointments', function(assert) {
            const instance = createInstance({
                startDateExpr: 'Start',
                endDateExpr: 'End',
                recurrenceRuleExpr: 'RecurrenceRule',
                views: [{
                    type: 'agenda',
                    agendaDuration: 7,
                    currentDate: new Date(2016, 1, 24)
                }],
                currentView: 'agenda'
            });

            const data = [
                {
                    Start: new Date(2016, 1, 22, 1).toString(),
                    End: new Date(2016, 1, 23, 1, 30).toString(),
                    RecurrenceRule: 'FREQ=DAILY;INTERVAL=3'
                }
            ];

            const endViewDateStub = sinon.stub(instance, 'getEndViewDate').returns(new Date(2016, 2, 1, 23, 59));
            const startViewDateStub = sinon.stub(instance, 'getStartViewDate').returns(new Date(2016, 1, 24));
            const agendaWorkspace = instance.getWorkSpace();

            try {
                // act
                instance.option('dataSource', data);

                const calculatedRows = agendaWorkspace._rows;
                assert.deepEqual(calculatedRows, [[0, 1, 1, 0, 1, 1, 0]], 'Rows are OK');
            } finally {
                endViewDateStub.restore();
                startViewDateStub.restore();
            }
        });

        test('Agenda row count calculation with groups', function(assert) {
            const instance = createInstance({
                groups: ['ownerId'],
                resources: [{
                    field: 'ownerId',
                    dataSource: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 }
                    ],
                    allowMultiple: true
                }],
                views: [{
                    type: 'agenda',
                    agendaDuration: 7,
                    currentDate: new Date(2016, 1, 1)
                }],
                currentView: 'agenda'
            });

            const data = [
                { startDate: new Date(2016, 1, 2), endDate: new Date(2016, 1, 2, 1), ownerId: 1 },
                { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 2 },
                { startDate: new Date(2016, 1, 3), endDate: new Date(2016, 1, 3, 1), ownerId: 1 },
                { startDate: new Date(2016, 1, 3, 2), endDate: new Date(2016, 1, 3, 3), ownerId: 1 },
                { startDate: new Date(2016, 1, 5), endDate: new Date(2016, 1, 5, 1), ownerId: [1, 2] },
                { startDate: new Date(2016, 1, 4), endDate: new Date(2016, 1, 4, 1), ownerId: 2 }
            ];

            const agendaWorkspace = instance.getWorkSpace();

            // act
            instance.option('dataSource', data);

            const calculatedRows = agendaWorkspace._rows;
            assert.equal(calculatedRows.length, 3, 'Rows are OK');
            assert.deepEqual(calculatedRows[0], [0, 1, 2, 0, 1, 0, 0], 'Row is OK');
            assert.deepEqual(calculatedRows[1], [0, 0, 1, 1, 1, 0, 0], 'Row is OK');
            assert.strictEqual(calculatedRows[2].length, 0, 'Row is OK');
        });

        test('Agenda should work when current view is changed', function(assert) {
            const instance = createInstance({
                views: ['agenda', 'week'],
                currentView: 'week',
                currentDate: new Date(2016, 2, 1),
                dataSource: [{ startDate: new Date(2016, 2, 1, 1), endDate: new Date(2016, 2, 1, 2) }]
            });

            instance.option('currentView', 'agenda');

            assert.ok(true, 'Agenda works');
        });
    });
});
