import { getOuterHeight, getWidth, getHeight } from 'core/utils/size';
import 'generic_light.css!';

import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';

import $ from 'jquery';
import '__internal/scheduler/workspaces/m_work_space_week';
import VerticalAppointmentsStrategy from '__internal/scheduler/appointments/rendering_strategies/m_strategy_vertical';
import HorizontalMonthAppointmentsStrategy from '__internal/scheduler/appointments/rendering_strategies/m_strategy_horizontal_month';
import SchedulerAppointments from '__internal/scheduler/appointments/m_appointment_collection';
import eventsEngine from 'common/core/events/core/events_engine';
import dblclickEvent from 'common/core/events/dblclick';
import translator from 'common/core/animation/translator';
import dataCoreUtils from 'core/utils/data';
import commonUtils from 'core/utils/common';
import typeUtils, { isRenderer } from 'core/utils/type';
import config from 'core/config';
import Resizable from 'ui/resizable';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { ExpressionUtils } from '__internal/scheduler/m_expression_utils';
import { Deferred } from 'core/utils/deferred';
import { createExpressions } from '__internal/scheduler/resources/m_utils';
import { AppointmentDataProvider } from '__internal/scheduler/appointments/data_provider/m_appointment_data_provider.js';
import { createTimeZoneCalculator } from '__internal/scheduler/r1/timezone_calculator/index.js';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="scheduler-work-space"></div>
        <div id="scheduler-appointments"></div>
        <div id="allDayContainer"></div>
        <div id="fixedContainer"></div>
    `);
});

const testConfig = {
    cellWidth: 20,
    cellHeight: 20,
    coordinates: [{ top: 0, left: 0 }],
};

const keyboardNavigationConfig = {
    ...testConfig,
    cellWidth: 100,
    cellHeight: 30,
};

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;
const dataAccessors = {
    getter: {
        startDate: compileGetter('startDate'),
        endDate: compileGetter('endDate'),
        allDay: compileGetter('allDay'),
        text: compileGetter('text'),
        recurrenceRule: compileGetter('recurrenceRule')
    },
    setter: {
        startDate: compileSetter('startDate'),
        endDate: compileSetter('endDate'),
        allDay: compileSetter('allDay'),
        text: compileSetter('text'),
        recurrenceRule: compileSetter('recurrenceRule')
    }
};

ExpressionUtils.getField = (_, field, obj) => {
    if(typeUtils.isDefined(dataAccessors.getter[field])) {
        return dataAccessors.getter[field](obj);
    }
};

ExpressionUtils.setField = (_, field, obj, value) => {
    return dataAccessors.setter[field](obj, value);
};

const createSubscribes = (coordinates, cellWidth, cellHeight) => ({
    createAppointmentSettings: () => coordinates,
    timeZoneCalculator: {
        createDate: date => date
    },
    getEndViewDate: () => {
        return new Date(2150, 1, 1);
    },
    getAppointmentGeometry: (settings) => {
        return {
            width: settings.width || 0,
            height: settings.height || 0,
            left: settings.left || 0,
            top: settings.top || 0
        };
    },
    getCellHeight: () => cellHeight,
    getCellWidth: () => cellWidth,
    getStartDayHour: () => 8,
    getEndDayHour: () => 20,
    mapAppointmentFields: (config) => {
        const result = {
            appointmentData: config.itemData,
            appointmentElement: config.itemElement
        };

        return result;
    },
    appendSingleAppointmentData: (data) => data
});

const createInstance = (options, subscribesConfig) => {
    const subscribes = createSubscribes(
        subscribesConfig.coordinates,
        subscribesConfig.cellWidth,
        subscribesConfig.cellHeight,
    );

    const observer = {
        fire: function(subject) {
            const callback = subscribes[subject];
            const args = Array.prototype.slice.call(arguments);

            return callback && callback.apply(this, args.slice(1));
        }
    };

    const instance = $('#scheduler-appointments').dxSchedulerAppointments({
        observer,
        ...options,
        timeZoneCalculator: createTimeZoneCalculator(),
        getResources: () => [],
        getLoadedResources: () => [],
        getAgendaResourceProcessor: () => ({}),
        getAppointmentColor: () => new Deferred(),
        getResourceDataAccessors: () => createExpressions([]),
        dataAccessors,
        getAppointmentDataProvider: () => new AppointmentDataProvider({
            getIsVirtualScrolling: () => false
        })
    }).dxSchedulerAppointments('instance');

    const workspaceInstance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
        draggingMode: 'default',
    }).dxSchedulerWorkSpaceWeek('instance');

    workspaceInstance.getWorkArea().append(instance.$element());

    const schedulerMock = {
        _appointments: instance,
        option: $.noop,
        element: $.noop,
    };

    workspaceInstance.initDragBehavior(schedulerMock);

    return instance;
};

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Appointments', moduleOptions, () => {
    QUnit.test('Scheduler appointments should be initialized', function(assert) {
        const instance = createInstance({}, testConfig);

        assert.ok(instance instanceof SchedulerAppointments, 'dxSchedulerAppointments was initialized');
    });

    QUnit.test('Scheduler appointments should have a right css class', function(assert) {
        const instance = createInstance({}, testConfig);

        const $element = instance.$element();

        assert.ok($element.hasClass('dx-scheduler-scrollable-appointments'), 'dxSchedulerAppointments has \'dx-scheduler-scrollable-appointments\' css class');
    });

    QUnit.test('startDate should be preprocessed before rendering', function(assert) {
        const data = {
            text: 'Appointment 1',
            startDate: 1429688467740,
        };

        const instance = createInstance({
            items: [
                {
                    itemData: data,
                    settings: [{}],
                },
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').data('dxItemData').startDate, 1429688467740);
    });

    QUnit.test('Scheduler appointment should have appointment title', function(assert) {
        const data = {
            text: 'Appointment 1',
            startDate: new Date(2015, 8, 24, 13),
            endDate: new Date(2015, 8, 24, 15)
        };

        const instance = createInstance({
            items: [
                {
                    itemData: data,
                    settings: [],
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').attr('title'), instance.option('items')[0].text, 'title is right');
    });

    QUnit.test('Scheduler appointments should have a right item count', function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData: {
                        text: 'Appointment 1',
                        startDate: new Date()
                    },
                    settings: [{}]
                },
                {
                    itemData: {
                        text: 'Appointment 2',
                        startDate: new Date()
                    },
                    settings: [{}]
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 2, 'dxSchedulerAppointments has two items');
    });

    QUnit.test('Scheduler appointments with recurrenceRule should have a specific class', function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(),
                        recurrenceRule: 'FREQ=YEARLY;COUNT=1'
                    },
                    settings: [{}]
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment-recurrence').length, 1, 'dxSchedulerAppointments has two items');
    });

    QUnit.test('Scheduler appointments should have a correct height', function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 8),
                        endDate: new Date(2015, 1, 9, 9)
                    },
                    settings: [
                        {
                            height: 40
                        }
                    ]
                }
            ],
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(getOuterHeight($appointment), 40, 'Appointment has a right height');
    });

    QUnit.test('Scheduler appointment should be resizable', function(assert) {
        const instance = createInstance({}, testConfig);
        instance._cellHeight = 20;

        instance.option('items', [
            {
                itemData:
                {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 9)
                },
                settings: [
                    {
                        height: 30
                    }
                ]
            }
        ]);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        const resizableInstance = $appointment.dxResizable('instance');

        assert.ok(resizableInstance instanceof Resizable, 'Appointment is instance of dxResizable');
        assert.equal(resizableInstance.option('handles'), 'top bottom', 'Appointment can resize only vertical');
        assert.equal(resizableInstance.option('step'), testConfig.cellHeight, 'Resizable has a right step');
        assert.equal(resizableInstance.option('minHeight'), testConfig.cellHeight, 'Resizable has a right minHeight');
        assert.deepEqual(resizableInstance.option('area'), instance.$element().closest('.dx-scrollable-content'), 'Resizable area is scrollable content');
    });


    QUnit.test('Scheduler appointment should not be resizable if allowResize is false', function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 8),
                        endDate: new Date(2015, 1, 9, 9)
                    },
                    settings: []
                }
            ],
            allowResize: false,
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.notOk($appointment.data('dxResizable'), 'Appointment is not dxResizable');
    });

    QUnit.test('All-day appointment should not be resizable if current view is \'day\'', function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 8),
                        endDate: new Date(2015, 1, 9, 9),
                        allDay: true
                    },
                    settings: []
                }
            ],
            allowAllDayResize: false,
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment').first();

        assert.notOk($appointment.hasClass('dx-resizable'), 'Appointment is not resizable');
    });

    QUnit.test('moveAppointmentBack should affect on appointment only first time', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{
                height: 40,
                width: 40
            }]
        };

        const instance = createInstance({
            items: [item],
            height: 100,
            width: 100,
            focusStateEnabled: true,
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        const pointer = pointerMock(instance.$element().find('.dx-resizable-handle-bottom')).start();
        pointer.dragStart();

        const coordinates = {
            top: 10,
            left: 10
        };

        instance.moveAppointmentBack();

        translator.move($appointment, coordinates);
        instance.moveAppointmentBack();
        assert.deepEqual(translator.locate($appointment), coordinates, 'coordinates has been changed');

    });

    QUnit.test('Appointment should not be changed while resize when \'esc\' key was pressed', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{
                sortedIndex: 0,
                height: 40,
                width: 40,
                left: 0,
                top: 100
            }]
        };

        const instance = createInstance({
            items: [item],
            focusStateEnabled: true,
        }, testConfig);

        const updateStub = sinon.stub(instance, 'notifyObserver').withArgs('updateAppointmentAfterResize');

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        const keyboard = keyboardMock($appointment);

        const pointer = pointerMock(instance.$element().find('.dx-resizable-handle-bottom')).start();
        pointer.down().move(0, 40);
        keyboard.keyDown('esc');
        pointer.up();

        assert.notOk(updateStub.called, '\'updateAppointmentAfterResize\' method isn\'t called');
    });

    QUnit.test('Appointment dimensions should not be changed while resize when \'esc\' key was pressed', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{
                sortedIndex: 0,
                height: 40,
                width: 40,
                left: 0,
                top: 100
            }]
        };

        const instance = createInstance({
            items: [item],
            focusStateEnabled: true,
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        const initialWidth = getWidth($appointment);
        const initialHeight = getHeight($appointment);
        const keyboard = keyboardMock($appointment);
        const pointer = pointerMock(instance.$element().find('.dx-resizable-handle-bottom')).start();

        pointer.down().move(0, 40);
        keyboard.keyDown('esc');
        pointer.up();

        assert.equal(getWidth($appointment), initialWidth, 'Appointment width is correct');
        assert.equal(getHeight($appointment), initialHeight, 'Appointment height is correct');
    });

    QUnit.test('Allday appointment should stay in allDayContainer after small dragging', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9),
                allDay: true
            },
            settings: [{ allDay: true }]
        };

        const instance = createInstance({}, testConfig);

        instance.option({
            fixedContainer: $('#fixedContainer'),
            allDayContainer: $('#allDayContainer'),
            items: [item],
        });

        const $appointment = $('#allDayContainer .dx-scheduler-appointment');
        const pointer = pointerMock($appointment).start();

        pointer.dragStart().drag(0, -30);
        pointer.dragEnd();

        assert.equal($('#allDayContainer .dx-scheduler-appointment').length, 1, 'appointment is in allDayContainer');
    });

    QUnit.test('Appointment should be rendered a many times if coordinates array contains a few items', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 10)
            },
            settings: [
                { top: 0, left: 0, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 },
                { top: 10, left: 10, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 },
                { top: 20, left: 20, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 }
            ]
        };

        const instance = createInstance({
            items: [item],
        }, {
            ...testConfig,
            coordinates: [{ top: 0, left: 0 }, { top: 10, left: 10 }, { top: 20, left: 20 }],
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.length, 3, 'All appointments are rendered');
        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, 'appointment is rendered in right place');
        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 10, left: 10 }, 'appointment is rendered in right place');
        assert.deepEqual(translator.locate($appointment.eq(2)), { top: 20, left: 20 }, 'appointment is rendered in right place');
        assert.deepEqual(instance.option('items'), [item], 'items are not affected');
    });

    QUnit.test('Delta time for resizable appointment should be 0 if appointment isn\'t resized', function(assert) {
        const strategy = new HorizontalMonthAppointmentsStrategy({
            instance: {
                notifyObserver: commonUtils.noop,
                option: commonUtils.noop,
                fire: commonUtils.noop,
            },
            getResizableStep: () => 0
        });
        const deltaTime = strategy.getDeltaTime({ width: 100 }, { width: 100 });

        assert.strictEqual(deltaTime, 0, 'Delta time is 0');
    });

    QUnit.test('Delta time for resizable appointment should decreased correctly in vertical strategy', function(assert) {
        const strategy = new VerticalAppointmentsStrategy({
            appointmentDataProvider: {
                appointmentTakesAllDay: commonUtils.noop,
            },
            allDayPanelMode: 'all',
            cellDurationInMinutes: 30,
            cellHeight: 50
        });
        const deltaTime = strategy.getDeltaTime({ height: 50 }, { height: 100 }, { allDay: false });

        assert.strictEqual(deltaTime, -1800000, 'Delta time is OK');
    });

    QUnit.test('Scheduler appointment should have aria-role \'application\'', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{}]
        };

        const instance = createInstance({
            items: [item],
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.attr('role'), 'application', 'role is right');
    });

    QUnit.test('Split appointment by day', function(assert) {
        const instance = createInstance({}, testConfig);

        const appt1 = { startDate: new Date(2016, 1, 25, 9).toString(), endDate: new Date(2016, 1, 25, 10).toString() };
        const appt2 = { startDate: new Date(2016, 1, 28, 9).toString(), endDate: new Date(2016, 2, 3, 16).toString() };
        const appt3 = { startDate: new Date(2016, 1, 28, 9).toString(), endDate: new Date(2016, 1, 29, 10).toString() };

        const parts1 = instance.splitAppointmentByDay(appt1);
        const parts2 = instance.splitAppointmentByDay(appt2);
        const parts3 = instance.splitAppointmentByDay(appt3);

        assert.deepEqual(parts1, [{
            appointmentData: appt1,
            startDate: new Date(2016, 1, 25, 9)
        }], 'Parts are OK');

        assert.deepEqual(parts2, [
            { settings: { startDate: new Date(2016, 1, 28, 9), endDate: new Date(2016, 1, 28, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 1, 29, 8), endDate: new Date(2016, 1, 29, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 2, 1, 8), endDate: new Date(2016, 2, 1, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 2, 2, 8), endDate: new Date(2016, 2, 2, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 2, 3, 8), endDate: new Date(2016, 2, 3, 16) }, startDate: appt2.startDate, endDate: appt2.endDate }
        ], 'Parts are OK');

        assert.deepEqual(parts3, [
            { settings: { startDate: new Date(2016, 1, 28, 9), endDate: new Date(2016, 1, 28, 20) }, startDate: appt3.startDate, endDate: appt3.endDate },
            { settings: { startDate: new Date(2016, 1, 29, 8), endDate: new Date(2016, 1, 29, 10) }, startDate: appt3.startDate, endDate: appt3.endDate },
        ], 'Parts are OK');
    });

    QUnit.test('Split appointment by day should consider startDayHour & endDayHour', function(assert) {
        const instance = createInstance({}, testConfig);

        const appt1 = { startDate: new Date(2016, 1, 25, 1).toString(), endDate: new Date(2016, 1, 25, 2).toString() };
        const appt2 = { startDate: new Date(2016, 1, 28, 1).toString(), endDate: new Date(2016, 2, 3, 2).toString() };
        const appt3 = { startDate: new Date(2016, 1, 28, 16).toString(), endDate: new Date(2016, 1, 29, 20).toString() };

        const parts1 = instance.splitAppointmentByDay(appt1);
        const parts2 = instance.splitAppointmentByDay(appt2);
        const parts3 = instance.splitAppointmentByDay(appt3);

        assert.deepEqual(parts1, [], 'Parts are OK');

        assert.deepEqual(parts2, [
            { settings: { startDate: new Date(2016, 1, 28, 8), endDate: new Date(2016, 1, 28, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 1, 29, 8), endDate: new Date(2016, 1, 29, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 2, 1, 8), endDate: new Date(2016, 2, 1, 20) }, startDate: appt2.startDate, endDate: appt2.endDate },
            { settings: { startDate: new Date(2016, 2, 2, 8), endDate: new Date(2016, 2, 2, 20) }, startDate: appt2.startDate, endDate: appt2.endDate }
        ], 'Parts are OK');

        assert.deepEqual(parts3, [
            { settings: { startDate: new Date(2016, 1, 28, 16), endDate: new Date(2016, 1, 28, 20) }, startDate: appt3.startDate, endDate: appt3.endDate },
            { settings: { startDate: new Date(2016, 1, 29, 8), endDate: new Date(2016, 1, 29, 20) }, startDate: appt3.startDate, endDate: appt3.endDate }
        ], 'Parts are OK');
    });

    QUnit.test('Split appointment by day should trim minutes, seconds and milliseconds if needed', function(assert) {
        const instance = createInstance({}, testConfig);

        const appt1 = { startDate: new Date(2017, 7, 21, 9, 0, 10).toString(), endDate: new Date(2017, 7, 22, 18, 0).toString() };

        const parts1 = instance.splitAppointmentByDay(appt1);

        assert.deepEqual(parts1, [
            { settings: { startDate: new Date(2017, 7, 21, 9, 0, 10), endDate: new Date(2017, 7, 21, 20) }, startDate: appt1.startDate, endDate: appt1.endDate },
            { settings: { startDate: new Date(2017, 7, 22, 8, 0, 0), endDate: new Date(2017, 7, 22, 18) }, startDate: appt1.startDate, endDate: appt1.endDate }
        ], 'Parts are OK');
    });
});

QUnit.module('Appointments Actions', moduleOptions, () => {
    QUnit.test('Appointments should set alias key to cellCache', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 10, 3, 9),
                endDate: new Date(2015, 10, 3, 11)
            },
            settings: [
                { top: 0, left: 0, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0, allDay: false, appointmentReduced: null },
                { top: 10, left: 10, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 },
                { top: 20, left: 20, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 }
            ]
        };

        const instance = createInstance({}, testConfig);

        const setCacheAliasSpy = sinon.spy(instance, 'invoke').withArgs('setCellDataCacheAlias');

        instance.option('items', [item]);

        assert.equal(setCacheAliasSpy.callCount, 3, 'setCacheAlias was called');
        assert.deepEqual(setCacheAliasSpy.getCall(0).args[1], {
            allDay: false,
            appointmentReduced: null,
            count: 1,
            height: 10,
            index: 0,
            left: 0,
            sortedIndex: 0,
            top: 0,
            width: 10
        }, 'setCacheAlias was called with correct appointment appointmentSettings');

        assert.deepEqual(setCacheAliasSpy.getCall(0).args[2], {
            height: 10,
            left: 0,
            top: 0,
            width: 10
        }, 'setCacheAlias was called with correct geometry');

    });

    QUnit.test('Default behavior of item click should prevented when set e.cancel', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{}]
        };

        const instance = createInstance({
            items: [item],
            onItemClick: function(e) {
                e.cancel = true;
            }
        }, testConfig);

        const stub = sinon.stub(instance, 'notifyObserver').withArgs('showAppointmentTooltip');
        const $item = $('.dx-scheduler-appointment').eq(0);

        $($item).trigger('dxclick');
        this.clock.tick(300);

        assert.notOk(stub.called, 'showAppointmentTooltip doesn\'t shown');
    });

    QUnit.test('onAppointmentDblClick should fires when item is dbl clicked', function(assert) {
        assert.expect(2);

        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 9, 10),
                endDate: new Date(2015, 2, 9, 10)
            },
            settings: [{}]
        }, {
            itemData: {
                text: 'Appointment 2',
                startDate: new Date(2015, 2, 10, 8),
                endDate: new Date(2015, 2, 10, 9)
            },
            settings: [{}]
        }];

        createInstance({
            dataSource: new DataSource({
                store: items
            }),
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2015, 2, 9),
            onAppointmentDblClick: function(e) {
                assert.deepEqual($(e.appointmentElement)[0], $item[0], 'appointmentElement is correct');
                assert.deepEqual(e.appointmentData, items[0].itemData, 'appointmentData is correct');
            },
        }, testConfig);

        const $item = $('.dx-scheduler-appointment').eq(0);
        $($item).trigger(dblclickEvent.name);
    });

    QUnit.test('Popup should be shown when onAppointmentDblClick', function(assert) {
        assert.expect(1);
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{}]
        };

        const instance = createInstance({
            items: [item],
            onAppointmentDblClick: (e) => {
                e.cancel = true;
            },
        }, testConfig);

        const stub = sinon.stub(instance, 'notifyObserver').withArgs('showEditAppointmentPopup');
        const $item = $('.dx-scheduler-appointment').eq(0);

        $($item).trigger(dblclickEvent.name);

        assert.notOk(stub.called, 'showEditAppointmentPopup doesn\'t shown');
    });
});

QUnit.module('Appointments Keyboard Navigation', moduleOptions, () => {
    QUnit.test('Items has a tab index if focusStateEnabled', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: [{ sortedIndex: 0 }]
        };

        const instance = createInstance({
            currentDate: new Date(2015, 1, 9),
            items: [item],
            focusStateEnabled: true,
            tabIndex: 1
        }, keyboardNavigationConfig);

        let $appointments = $('.dx-scheduler-appointment');

        assert.equal($appointments.eq(0).attr('tabindex'), 1, 'item tabindex is right');

        instance.option({
            focusStateEnabled: false
        });

        $appointments = $('.dx-scheduler-appointment');
        assert.ok(!$appointments.eq(0).attr('tabindex'), 'item tabindex is right');
    });

    QUnit.testInActiveWindow('Focused element should be changed on focusin', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{}]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{}]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 1, 9),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointments = $('.dx-scheduler-appointment');
        $appointments.get(0).focus();
        assert.equal(isRenderer(instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
        assert.deepEqual($appointments.get(0), $(instance.option('focusedElement')).get(0), 'right element is focused');

        $appointments.get(1).focus();
        assert.deepEqual($appointments.get(1), $(instance.option('focusedElement')).get(0), 'right element is focused');
    });

    QUnit.test('Appointment popup should be opened after enter key press', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 0
                }]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 1
                }]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 8, 16),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const notifyStub = sinon.stub(instance, 'notifyObserver');
        const $appointments = $('.dx-scheduler-appointment');
        const keyboard = keyboardMock($appointments.eq(0));


        $($appointments.eq(0)).trigger('focusin');
        keyboard.keyDown('enter');
        this.clock.tick(300);

        assert.ok(notifyStub.called, 'notify is called');
        assert.equal(notifyStub.getCall(0).args[0], 'showEditAppointmentPopup', 'popup is shown');

        assert.deepEqual(notifyStub.getCall(0).args[1].data, items[0].itemData, 'data is ok');
        assert.deepEqual(notifyStub.getCall(0).args[1].target.get(0), $appointments.get(0), 'element is ok');
    });

    QUnit.test('Appointment should be deleted after delete key press, if allowDelete = true', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 0
                }]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 1
                }]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 8, 16),
            items: items,
            focusStateEnabled: true,
            allowDelete: true,
        }, keyboardNavigationConfig);

        const notifyStub = sinon.stub(instance, 'notifyObserver');
        const $appointments = $('.dx-scheduler-appointment');
        const $targetAppointment = $appointments.eq(1);

        $($targetAppointment).trigger('focusin');

        const keyboard = keyboardMock($targetAppointment);
        keyboard.keyDown('del');

        assert.ok(notifyStub.called, 'notify is called');

        const deleteEventName = notifyStub.getCall(0).args[0];

        assert.equal(deleteEventName, 'onDeleteButtonPress', 'onDeleteButtonPress is called');

        const eventOptions = notifyStub.getCall(0).args[1];
        assert.deepEqual(eventOptions.data, items[1].itemData, 'data is ok');
        assert.deepEqual($(eventOptions.target).get(0), $targetAppointment.get(0), 'target is ok');
    });

    QUnit.test('Appointment should not be deleted after delete key press, if allowDelete = false', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 0
                }]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 1
                }]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 8, 16),
            items: items,
            focusStateEnabled: true,
            allowDelete: false,
        }, keyboardNavigationConfig);

        const notifyStub = sinon.stub(instance, 'notifyObserver');
        const $appointments = $('.dx-scheduler-appointment');
        const $targetAppointment = $appointments.eq(1);

        $($targetAppointment).trigger('focusin');

        const keyboard = keyboardMock($targetAppointment);
        keyboard.keyDown('del');

        assert.notOk(notifyStub.called, 'notify was not called');
    });

    QUnit.test('Focus method should call focus on appointment', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 10, 3, 9),
                    endDate: new Date(2015, 10, 3, 11)
                },
                settings: [{
                    sortedIndex: 0
                }]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 10, 3),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointment = $('.dx-scheduler-appointment').eq(0);

        $($appointment).trigger('focusin');
        const initialTrigger = eventsEngine.trigger;

        const focusedElement = $(instance.option('focusedElement')).get(0);
        const focusSpy = sinon.spy(eventsEngine, 'trigger').withArgs(sinon.match(function($element) {
            return config().useJQuery ? $element.get(0) === focusedElement : $element === focusedElement;
        }), 'focus');

        instance.focus();

        this.clock.tick(10);
        assert.ok(focusSpy.called, 'focus is called');
        sinon.restore();

        eventsEngine.trigger = initialTrigger;
    });

    QUnit.test('Default behavior of tab button should be prevented for apps', function(assert) {
        assert.expect(1);

        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 0
                }]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                settings: [{
                    sortedIndex: 1
                }]
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 1, 9),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointments = instance.$element().find('.dx-scheduler-appointment');
        const keyboard = keyboardMock($appointments.eq(0));

        $(instance.$element()).on('keydown', function(e) {
            assert.ok(e.isDefaultPrevented(), 'default tab prevented');
        });

        $($appointments.eq(0)).trigger('focusin');
        keyboard.keyDown('tab');

        $($appointments).off('keydown');
    });

    QUnit.test('Focus shouldn\'t be prevent when first appointment is reached in back order', function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 9, 16, 9),
                    endDate: new Date(2015, 9, 16, 11)
                },
                settings: [{
                    sortedIndex: 0
                }]
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 9, 17, 8),
                    endDate: new Date(2015, 9, 17, 10)
                },
                settings: [{
                    sortedIndex: 1
                }]
            }
        ];

        const instance = createInstance({
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointments = instance.$element().find('.dx-scheduler-appointment');
        const keyboard = keyboardMock($appointments.eq(0));

        $(instance.$element()).on('keydown', function(e) {
            assert.notOk(e.isDefaultPrevented(), 'default tab isn\'t prevented');
        });

        $($appointments.eq(0)).trigger('focusin');
        keyboard.keyDown('tab', { shiftKey: true });

        $($appointments).off('keydown');
    });
});
