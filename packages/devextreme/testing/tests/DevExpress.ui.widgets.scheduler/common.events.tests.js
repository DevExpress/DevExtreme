import fx from 'common/core/animation/fx';
import Color from 'color';
import config from 'core/config';
import { noop } from 'core/utils/common';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { isRenderer } from 'core/utils/type';
import { DataSource } from 'common/data/data_source/data_source';

import $ from 'jquery';
import dxScheduler from '__internal/scheduler/m_scheduler';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { Deferred } from 'core/utils/deferred';

QUnit.testStart(() => initTestMarkup());

QUnit.module('Events', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('onAppointmentRendered', function(assert) {
        const renderedSpy = sinon.spy(noop);
        const appointments = [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }];
        const dataSource = new DataSource({
            store: appointments
        });

        const scheduler = createWrapper({
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        const args = renderedSpy.getCall(0).args[0];

        assert.ok(renderedSpy.calledOnce, 'onAppointmentRendered was called');
        assert.deepEqual(args.component, scheduler.instance, 'component is scheduler instance');
        assert.deepEqual($(args.element).get(0), scheduler.instance.$element().get(0), 'element is $scheduler');
        assert.deepEqual(args.appointmentData, appointments[0], 'appointment is OK');
        assert.deepEqual($(args.appointmentElement).get(0), scheduler.instance.$element().find('.dx-scheduler-appointment').get(0), 'appointment element is OK');
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

        createWrapper({
            currentView: 'week',
            dataSource: dataSource,
            onAppointmentRendered: renderedSpy,
            currentDate: new Date(2015, 1, 9)
        });

        assert.ok(renderedSpy.calledTwice, 'onAppointmentRendered was called twice');
    });

    QUnit.test('onAppointmentRendered should updated correctly', function(assert) {
        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: [{ startDate: new Date(2015, 1, 9, 16), endDate: new Date(2015, 1, 9, 17), text: 'caption' }]
            }),
            onAppointmentRendered: function() { return 1; },
            currentDate: new Date(2015, 1, 9)
        });

        scheduler.instance.option('onAppointmentRendered', function() { return 2; });
        const appointmentsCollection = scheduler.instance.getAppointmentsInstance();

        assert.equal(appointmentsCollection.option('onItemRendered')(), 2, 'option is updated correctly');
    });

    QUnit.test('onAppointmentRendered should fires when appointment is completely rendered', function(assert) {
        createWrapper({
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

        createWrapper({
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
        createWrapper({
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

        const scheduler = createWrapper({
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

        scheduler.instance.addAppointment({
            startDate: new Date(2015, 1, 12, 10),
            endDate: new Date(2015, 1, 13, 20),
            text: 'caption2'
        });
        this.clock.tick(10);
    });

    QUnit.test('All appointments should be rerendered after cellDuration changed', function(assert) {
        assert.expect(6);

        const scheduler = createWrapper({
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
        const appointments = scheduler.instance.getAppointmentsInstance();
        const initialItems = appointments.option('items');

        scheduler.instance.option('cellDuration', 120);
        this.clock.tick(10);

        const changedItems = appointments.option('items');

        assert.notDeepEqual(initialItems[0].settings, changedItems[0].settings, 'Item\'s settings were changed');
        assert.notDeepEqual(initialItems[1].settings, changedItems[1].settings, 'Item\'s settings were changed');
    });

    QUnit.test('targetedAppointmentData should return correct allDay appointmentData', function(assert) {
        createWrapper({
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
        createWrapper({
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

        const scheduler = createWrapper({
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

        scheduler.instance.option('currentView', 'agenda');
        assert.ok(true, 'currentView was changed to agenda correctly');
    });

    QUnit.test('onAppointmentRendered should not contain information about particular appt resources if there are not groups(T413561)', function(assert) {
        const resourcesSpy = sinon.spy(dxScheduler.prototype, 'setTargetedAppointmentResources');

        createWrapper({
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

        const scheduler = createWrapper({
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

        const $item = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
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

        const scheduler = createWrapper({
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

        $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
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

        const scheduler = createWrapper({
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

        $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
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

        const scheduler = createWrapper({
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

        $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxclick');
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

        const scheduler = createWrapper({
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

        const $item = $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(0));
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

        const scheduler = createWrapper({
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

        $(scheduler.instance.$element().find('.dx-scheduler-appointment').eq(1)).trigger('dxcontextmenu');
    });

    QUnit.test('Cell click option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            onCellClick: sinon.stub().returns(1)
        });
        const workspaceMonth = scheduler.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option('onCellClick')(), scheduler.instance.option('onCellClick')(), 'scheduler has correct onCellClick');

        scheduler.instance.option('onCellClick', sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option('onCellClick')(), scheduler.instance.option('onCellClick')(), 'scheduler has correct onCellClick after option change');
    });

    QUnit.test('onCellContextMenu option should be passed to workSpace', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            onCellContextMenu: sinon.stub().returns(1)
        });
        const workspaceMonth = scheduler.instance.getWorkSpace();

        assert.deepEqual(workspaceMonth.option('onCellContextMenu')(), scheduler.instance.option('onCellContextMenu')(), 'scheduler has correct onCellContextMenu');

        scheduler.instance.option('onCellContextMenu', sinon.stub().returns(2));
        assert.deepEqual(workspaceMonth.option('onCellContextMenu')(), scheduler.instance.option('onCellContextMenu')(), 'scheduler has correct onCellContextMenu after option change');
    });

    QUnit.test('onAppointmentContextMenu option should be passed to appointments', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            onAppointmentContextMenu: sinon.stub().returns(1)
        });

        const appointments = scheduler.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option('onItemContextMenu')(), scheduler.instance.option('onAppointmentContextMenu')(), 'scheduler has correct onAppointmentContextMenu');

        scheduler.instance.option('onAppointmentContextMenu', sinon.stub().returns(2));
        assert.deepEqual(appointments.option('onItemContextMenu')(), scheduler.instance.option('onAppointmentContextMenu')(), 'scheduler has correct onAppointmentContextMenu after option change');
    });

    QUnit.test('onAppointmentDblClick option should be passed to appointments', function(assert) {
        const scheduler = createWrapper({
            currentView: 'month',
            onAppointmentDblClick: sinon.stub().returns(1)
        });

        const appointments = scheduler.instance.getAppointmentsInstance();
        assert.deepEqual(appointments.option('onAppointmentDblClick')(), scheduler.instance.option('onAppointmentDblClick')(), 'scheduler has correct onAppointmentDblClick');

        scheduler.instance.option('onAppointmentDblClick', sinon.stub().returns(2));
        assert.deepEqual(appointments.option('onAppointmentDblClick')(), scheduler.instance.option('onAppointmentDblClick')(), 'scheduler has correct onAppointmentDblClick after option change');
    });

    QUnit.test('onAppointmentFormOpening event should be fired while details form is opening', function(assert) {
        const stub = sinon.stub();
        const data = {
            text: 'One',
            location: 'NY'
        };
        const scheduler = createWrapper({
            currentView: 'month',
            onAppointmentFormOpening: stub
        });

        scheduler.instance.showAppointmentPopup(data);

        const args = stub.getCall(0).args[0];

        assert.ok(stub.calledOnce, 'Event was fired');
        assert.equal(args.appointmentData, data, 'Appointment data is OK');
        assert.equal(args.form, scheduler.instance.getAppointmentDetailsForm(), 'Appointment form is OK');
    });

    QUnit.test('Option changed', function(assert) {
        const scheduler = createWrapper();

        scheduler.instance.option({
            'onAppointmentAdding': function() { return true; },
            'onAppointmentAdded': function() { return true; },
            'onAppointmentUpdating': function() { return true; },
            'onAppointmentUpdated': function() { return true; },
            'onAppointmentDeleting': function() { return true; },
            'onAppointmentDeleted': function() { return true; },
            'onAppointmentFormOpening': function() { return true; },
            'onAppointmentTooltipShowing': function() { return true; }
        });

        $.each(scheduler.instance.getActions(), function(name, action) {
            assert.ok(action(), '\'' + name + '\' option is changed');
        });
    });

    QUnit.test('Workspace dimension changing should be called before appointment repainting, when scheduler was resized (T739866)', function(assert) {
        const appointment = {
            startDate: new Date(2016, 2, 15, 1).toString(),
            endDate: new Date(2016, 2, 15, 2).toString()
        };

        const scheduler = createWrapper({
            currentDate: new Date(2016, 2, 15),
            views: ['day'],
            currentView: 'day',
            width: 800,
            dataSource: [appointment]
        });

        const workspaceSpy = sinon.spy(scheduler.instance._workSpace, '_dimensionChanged');
        const appointmentsSpy = sinon.spy(scheduler.instance._appointments, '_repaintAppointments');

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

    QUnit.test('onAppointmentContextMenu should be triggered when items in the appointment tooltip and appointment collector tooltip is right-clicked (T1181442)', function(assert) {
        let $eventAppointmentElement = null;
        const onAppointmentContextMenu = sinon.spy(({ appointmentElement }) => {
            $eventAppointmentElement = $(appointmentElement);
        });

        const scheduler = createWrapper({
            height: 600,
            dataSource: [{
                text: 'appointment 1',
                startDate: new Date(2023, 7, 18),
                endDate: new Date(2023, 7, 18, 4),
            }, {
                text: 'appointment 2',
                startDate: new Date(2023, 7, 18),
                endDate: new Date(2023, 7, 18, 4),
            }],
            maxAppointmentsPerCell: 1,
            currentDate: new Date(2023, 7, 18),
            onAppointmentContextMenu,
        }, this.clock);

        scheduler.appointments.click();

        let $appointmentItem = scheduler.tooltip.getItemElement();
        $appointmentItem.trigger('dxcontextmenu'); // first call

        assert.ok($eventAppointmentElement.is($appointmentItem), 'same element');

        scheduler.appointments.compact.click();

        $eventAppointmentElement = null;
        $appointmentItem = scheduler.appointments.compact.getAppointment();
        $appointmentItem.trigger('dxcontextmenu'); // second call

        assert.ok($eventAppointmentElement.is($appointmentItem), 'same element');
        assert.equal(onAppointmentContextMenu.callCount, 2, 'onAppointmentContextMenu is called twice');
    });
});
