import { getOuterHeight, getWidth, getHeight } from 'core/utils/size';

import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';
import { mockDataAccessor } from '../../helpers/scheduler/mockDataAccessor.js';
import { getEmptyResourceManager } from '../../helpers/scheduler/mockResourceManager.js';

import $ from 'jquery';
import '__internal/scheduler/workspaces/work_space_week';
import SchedulerAppointments from '__internal/scheduler/appointments/m_appointment_collection';
import dblclickEvent from 'common/core/events/dblclick';
import translator from 'common/core/animation/translator';
import Resizable from 'ui/resizable';
import fx from 'common/core/animation/fx';
import { Deferred } from 'core/utils/deferred';
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
const dataAccessors = mockDataAccessor;

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

    const notifyScheduler = {
        invoke: function(subject) {
            const callback = subscribes[subject];
            const args = Array.prototype.slice.call(arguments);

            return callback && callback.apply(this, args.slice(1));
        }
    };

    // Set 'items' using options like it is done in real scheduler
    const items = options.items || [];
    delete options.items;

    const instance = $('#scheduler-appointments').dxSchedulerAppointments({
        notifyScheduler,
        ...options,
        timeZoneCalculator: createTimeZoneCalculator(),
        getLoadedResources: () => [],
        getResourceManager: getEmptyResourceManager,
        getAppointmentColor: () => new Deferred(),
        getSortedAppointments: () => items,
        dataAccessors,
        getAppointmentDataSource: () => ({
            getUpdatedAppointment: () => false,
            getUpdatedAppointmentKeys: () => [],
        })
    }).dxSchedulerAppointments('instance');

    const workspaceInstance = $('#scheduler-work-space').dxSchedulerWorkSpaceWeek({
        draggingMode: 'default',
        getResourceManager: getEmptyResourceManager,
    }).dxSchedulerWorkSpaceWeek('instance');

    workspaceInstance.getWorkArea().append(instance.$element());

    instance.option('items', items);

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
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('Appointments', moduleOptions, () => {
    QUnit.test('Scheduler appointments should be initialized', async function(assert) {
        const instance = createInstance({}, testConfig);

        assert.ok(instance instanceof SchedulerAppointments, 'dxSchedulerAppointments was initialized');
    });

    QUnit.test('Scheduler appointments should have a right css class', async function(assert) {
        const instance = createInstance({}, testConfig);

        const $element = instance.$element();

        assert.ok($element.hasClass('dx-scheduler-scrollable-appointments'), 'dxSchedulerAppointments has \'dx-scheduler-scrollable-appointments\' css class');
    });

    QUnit.test('startDate should be preprocessed before rendering', async function(assert) {
        const data = {
            text: 'Appointment 1',
            startDate: 1429688467740,
        };

        const instance = createInstance({
            items: [
                {
                    itemData: data,
                    sortedIndex: 0,
                },
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').data('dxItemData').startDate, 1429688467740);
    });

    QUnit.test('Scheduler appointment should have appointment title', async function(assert) {
        const data = {
            text: 'Appointment 1',
            startDate: new Date(2015, 8, 24, 13),
            endDate: new Date(2015, 8, 24, 15)
        };

        const instance = createInstance({
            items: [
                {
                    itemData: data,
                    sortedIndex: 0,
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').attr('title'), instance.option('items')[0].text, 'title is right');
    });

    QUnit.test('Scheduler appointments should have a right item count', async function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData: {
                        text: 'Appointment 1',
                        startDate: new Date()
                    },
                    sortedIndex: 0,
                },
                {
                    itemData: {
                        text: 'Appointment 2',
                        startDate: new Date()
                    },
                    sortedIndex: 1,
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 2, 'dxSchedulerAppointments has two items');
    });

    QUnit.test('Scheduler appointments with recurrenceRule should have a specific class', async function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(),
                        recurrenceRule: 'FREQ=YEARLY;COUNT=1'
                    },
                    sortedIndex: 0,
                }
            ],
        }, testConfig);

        assert.equal(instance.$element().find('.dx-scheduler-appointment-recurrence').length, 1, 'dxSchedulerAppointments has two items');
    });

    QUnit.test('Scheduler appointments should have a correct height', async function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData:
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 8),
                        endDate: new Date(2015, 1, 9, 9)
                    },
                    sortedIndex: 0,
                    height: 40,
                }
            ],
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(getOuterHeight($appointment), 40, 'Appointment has a right height');
    });

    QUnit.test('Scheduler appointment should be resizable', async function(assert) {
        const instance = createInstance({}, testConfig);
        instance._cellHeight = 20;

        instance.option('items', [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 9)
                },
                sortedIndex: 0,
                height: 30,
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


    QUnit.test('Scheduler appointment should not be resizable if allowResize is false', async function(assert) {
        const instance = createInstance({
            items: [
                {
                    itemData: {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 8),
                        endDate: new Date(2015, 1, 9, 9)
                    },
                    sortedIndex: 0,
                }
            ],
            allowResize: false,
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.notOk($appointment.data('dxResizable'), 'Appointment is not dxResizable');
    });

    QUnit.test('moveAppointmentBack should affect on appointment only first time', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
            height: 40,
            width: 40,
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

    QUnit.test('Appointment should not be changed while resize when \'esc\' key was pressed', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
            height: 40,
            width: 40,
            left: 0,
            top: 100,
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

    QUnit.test('Appointment dimensions should not be changed while resize when \'esc\' key was pressed', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
            height: 40,
            width: 40,
            left: 0,
            top: 100,
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

    QUnit.test('Allday appointment should stay in allDayContainer after small dragging', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9),
                allDay: true
            },
            sortedIndex: 0,
            allDay: true,
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

    QUnit.test('Appointment should be rendered a many times if coordinates array contains a few items', async function(assert) {
        const itemData = {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 10)
        };
        const items = [
            { itemData, top: 0, left: 0, height: 10, sortedIndex: 0, width: 10, maxLevel: 1, level: 0 },
            { itemData, top: 10, left: 10, height: 10, sortedIndex: 1, width: 10, maxLevel: 1, level: 0 },
            { itemData, top: 20, left: 20, height: 10, sortedIndex: 2, width: 10, maxLevel: 1, level: 0 },
        ];

        const instance = createInstance({ items }, {
            ...testConfig,
            coordinates: [{ top: 0, left: 0 }, { top: 10, left: 10 }, { top: 20, left: 20 }],
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.length, 3, 'All appointments are rendered');
        assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, 'appointment is rendered in right place');
        assert.deepEqual(translator.locate($appointment.eq(1)), { top: 10, left: 10 }, 'appointment is rendered in right place');
        assert.deepEqual(translator.locate($appointment.eq(2)), { top: 20, left: 20 }, 'appointment is rendered in right place');
        assert.deepEqual(instance.option('items'), items, 'items are not affected');
    });

    QUnit.test('Scheduler appointment should have aria-role \'button\'', function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
        };

        const instance = createInstance({
            items: [item],
        }, testConfig);

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.attr('role'), 'button', 'role is right');
    });
});

QUnit.module('Appointments Actions', moduleOptions, () => {
    QUnit.test('Default behavior of item click should prevented when set e.cancel', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
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

        assert.notOk(stub.called, 'showAppointmentTooltip doesn\'t shown');
    });

    QUnit.test('onAppointmentDblClick should fires when item is dbl clicked', async function(assert) {
        assert.expect(2);

        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 9, 10),
                endDate: new Date(2015, 2, 9, 10)
            },
            sortedIndex: 0,
        }, {
            itemData: {
                text: 'Appointment 2',
                startDate: new Date(2015, 2, 10, 8),
                endDate: new Date(2015, 2, 10, 9)
            },
            sortedIndex: 1,
        }];

        createInstance({
            items,
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

    QUnit.test('Popup should be shown when onAppointmentDblClick', async function(assert) {
        assert.expect(1);
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
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
    QUnit.test('Items has a tab index if focusStateEnabled', async function(assert) {
        const item = {
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            sortedIndex: 0,
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

    QUnit.test('Focused element should be changed on focusin', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 0,
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 1,
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 1, 9),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointments = $('.dx-scheduler-appointment');

        $appointments.get(0).focus();
        assert.equal($appointments.get(0), $(instance.option('focusedElement')).get(0), 'right element is focused - 1');

        $appointments.get(1).focus();
        assert.equal($appointments.get(1), $(instance.option('focusedElement')).get(0), 'right element is focused - 2');
    });

    QUnit.test('Appointment popup should be opened after enter key press', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 0,
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 1,
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

        assert.ok(notifyStub.called, 'notify is called');
        assert.equal(notifyStub.getCall(0).args[0], 'showEditAppointmentPopup', 'popup is shown');

        assert.deepEqual(notifyStub.getCall(0).args[1].data, items[0].itemData, 'data is ok');
        assert.deepEqual(notifyStub.getCall(0).args[1].target.get(0), $appointments.get(0), 'element is ok');
    });

    QUnit.test('Appointment should be deleted after delete key press, if allowDelete = true', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 0,
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 1,
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

    QUnit.test('Appointment should not be deleted after delete key press, if allowDelete = false', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 0
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 1
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

    QUnit.test('Focus method should call focus on appointment', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 10, 3, 9),
                    endDate: new Date(2015, 10, 3, 11)
                },
                sortedIndex: 0
            }
        ];

        const instance = createInstance({
            currentDate: new Date(2015, 10, 3),
            items: items,
            focusStateEnabled: true,
        }, keyboardNavigationConfig);

        const $appointment = $('.dx-scheduler-appointment').eq(0);

        $appointment.trigger('focusin');

        let focusCalled = false;
        $appointment.on('focus', function() {
            focusCalled = true;
        });

        instance.focus();
        assert.ok(focusCalled, 'focus is called');
    });


    QUnit.test('Default behavior of tab button should be prevented for apps', async function(assert) {
        assert.expect(1);

        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 8),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 0
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 9, 9),
                    endDate: new Date(2015, 1, 9, 10)
                },
                sortedIndex: 1
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

    QUnit.test('Focus shouldn\'t be prevent when first appointment is reached in back order', async function(assert) {
        const items = [
            {
                itemData: {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 9, 16, 9),
                    endDate: new Date(2015, 9, 16, 11)
                },
                sortedIndex: 0
            },
            {
                itemData: {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 9, 17, 8),
                    endDate: new Date(2015, 9, 17, 10)
                },
                sortedIndex: 1
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
