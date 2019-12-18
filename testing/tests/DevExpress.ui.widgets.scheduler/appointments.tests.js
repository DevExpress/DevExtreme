import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';

import $ from 'jquery';
import VerticalAppointmentsStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.vertical';
import HorizontalMonthAppointmentsStrategy from 'ui/scheduler/rendering_strategies/ui.scheduler.appointments.strategy.horizontal_month';
import SchedulerAppointments from 'ui/scheduler/ui.scheduler.appointments';
import eventsEngine from 'events/core/events_engine';
import dblclickEvent from 'events/dblclick';
import translator from 'animation/translator';
import dataCoreUtils from 'core/utils/data';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import dateUtils from 'core/utils/date';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import Draggable from 'ui/draggable';
import Resizable from 'ui/resizable';
import fx from 'animation/fx';
import dragEvents from 'events/drag';
import { DataSource } from 'data/data_source/data_source';

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
                                <div id="allDayContainer"></div>\
                                <div id="fixedContainer"></div>');
});

var moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        var that = this;

        this.clock = sinon.useFakeTimers();
        this.width = 20;
        this.height = 20;
        this.allDayHeight = 20;
        this.items = [];
        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };

        var dataAccessors = {
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

        this.initItems = function(items) {
            this.items = items;
            this.instance.option('items', items);
        };

        var subscribes = {
            needCoordinates: function(options) {
                options.callback(that.getCoordinates.apply(that));
            },
            getAppointmentColor: function(options) {
                options.callback($.Deferred().resolve('red').promise());
            },
            getResourceForPainting: function(options) {
                options.callback({ field: 'roomId' });
            },
            getField: function(field, obj) {
                if(!typeUtils.isDefined(dataAccessors.getter[field])) {
                    return;
                }

                return dataAccessors.getter[field](obj);
            },
            setField: function(field, obj, value) {
                return dataAccessors.setter[field](obj, value);
            },
            prerenderFilter: function() {
                return that.items.length ? that.items : that.instance.option('items');
            },
            convertDateByTimezone: function(field, timezone) {
                return field;
            },
            getEndViewDate: function() {
                return new Date(2150, 1, 1);
            },
            getAppointmentDurationInMs: function(options) {
                options.callback(options.endDate.getTime() - options.startDate.getTime());
            },
            getResourcesFromItem: function(options) {
                options.callback({ someId: ['with space'] });
            },
            getAppointmentGeometry: function(settings) {
                return {
                    width: settings.width || 0,
                    height: settings.height || 0,
                    left: settings.left || 0,
                    top: settings.top || 0
                };
            },
            getCellHeight: function() {
                return that.height;
            },
            getCellWidth: function() {
                return that.width;
            },
            getStartDayHour: function() {
                return 8;
            },
            getEndDayHour: function() {
                return 20;
            },
            appointmentTakesSeveralDays: function(appointment) {
                var startDate = new Date(appointment.startDate),
                    endDate = new Date(appointment.endDate);

                var startDateCopy = dateUtils.trimTime(new Date(startDate)),
                    endDateCopy = dateUtils.trimTime(new Date(endDate));

                return startDateCopy.getTime() !== endDateCopy.getTime();
            },
            mapAppointmentFields: function(config) {
                var result = {
                    appointmentData: config.itemData,
                    appointmentElement: config.itemElement
                };

                return result;
            },
            appendSingleAppointmentData: function(data) {
                return data;
            },
        };

        var observer = {
            fire: function(subject) {
                var callback = subscribes[subject],
                    args = Array.prototype.slice.call(arguments);

                return callback && callback.apply(this, args.slice(1));
            }
        };

        this.instance = $('#scheduler-appointments').dxSchedulerAppointments({ observer: observer }).dxSchedulerAppointments('instance');

    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Appointments', moduleOptions);

QUnit.test('Scheduler appointments should be initialized', function(assert) {
    assert.ok(this.instance instanceof SchedulerAppointments, 'dxSchedulerAppointments was initialized');
});

QUnit.test('Scheduler appointments should have a right css class', function(assert) {
    var $element = this.instance.$element();

    assert.ok($element.hasClass('dx-scheduler-scrollable-appointments'), 'dxSchedulerAppointments has \'dx-scheduler-scrollable-appointments\' css class');
});

QUnit.test('startDate should be preprocessed before rendering', function(assert) {
    var data = {
        text: 'Appointment 1',
        startDate: 1429688467740,
    };

    this.initItems([
        {
            itemData: data,
            settings: [{}]
        }
    ]);

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').data('dxItemData').startDate, 1429688467740);
});

QUnit.test('Scheduler appointment should have appointment title', function(assert) {
    var data = {
        text: 'Appointment 1',
        startDate: new Date(2015, 8, 24, 13),
        endDate: new Date(2015, 8, 24, 15)
    };

    this.initItems([
        {
            itemData: data,
            settings: []
        }
    ]);

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').attr('title'), this.instance.option('items')[0].text, 'title is right');
});

QUnit.test('Scheduler appointments should have a right item count', function(assert) {
    this.initItems([
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
    ]);

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 2, 'dxSchedulerAppointments has two items');
});

QUnit.test('Scheduler appointments with recurrenceRule should have a specific class', function(assert) {
    this.initItems([
        {
            itemData:
            {
                text: 'Appointment 1',
                startDate: new Date(),
                recurrenceRule: 'FREQ=YEARLY;COUNT=1'
            },
            settings: [{}]
        }
    ]);

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment-recurrence').length, 1, 'dxSchedulerAppointments has two items');
});

QUnit.test('Scheduler appointments should have a correct height', function(assert) {
    this.initItems([
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
    ]);

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.equal($appointment.outerHeight(), 40, 'Appointment has a right height');
});

QUnit.test('Scheduler appointment should be resizable', function(assert) {
    this.instance._cellHeight = 20;
    this.initItems([
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

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        resizableInstance = $appointment.dxResizable('instance');

    assert.ok(resizableInstance instanceof Resizable, 'Appointment is instance of dxResizable');
    assert.equal(resizableInstance.option('handles'), 'top bottom', 'Appointment can resize only vertical');
    assert.equal(resizableInstance.option('step'), this.height, 'Resizable has a right step');
    assert.equal(resizableInstance.option('minHeight'), this.height, 'Resizable has a right minHeight');
    assert.deepEqual(resizableInstance.option('area'), this.instance.$element().closest('.dx-scrollable-content'), 'Resizable area is scrollable content');
});


QUnit.test('Scheduler appointment should not be resizable if allowResize is false', function(assert) {
    this.instance.option({ allowResize: false });

    this.initItems([
        {
            itemData:
            {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 9)
            },
            settings: []
        }
    ]);

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.notOk($appointment.data('dxResizable'), 'Appointment is not dxResizable');
});

QUnit.test('All-day appointment should not be resizable if current view is \'day\'', function(assert) {
    this.instance.option({ 'allowAllDayResize': false });

    this.initItems([
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
    ]);

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment').first();

    assert.notOk($appointment.hasClass('dx-resizable'), 'Appointment is not resizable');
});

QUnit.test('moveAppointmentBack should affect on appointment only first time', function(assert) {
    var item = {
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

    this.initItems([item]);

    this.instance.option({
        height: 100,
        width: 100,
        focusStateEnabled: true
    });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    var pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom')).start();
    pointer.dragStart();

    var coordinates = {
        top: 10,
        left: 10
    };

    this.instance.moveAppointmentBack();

    translator.move($appointment, coordinates);
    this.instance.moveAppointmentBack();
    assert.deepEqual(translator.locate($appointment), coordinates, 'coordinates has been changed');

});

QUnit.test('Appointment should not be changed while resize when \'esc\' key was pressed', function(assert) {
    var item = {
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

    this.initItems([item]);

    this.instance.option({ focusStateEnabled: true });

    var updateSpy = sinon.spy(commonUtils.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        keyboard = keyboardMock($appointment);


    var pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom')).start();
    pointer.dragStart().drag(0, 40);
    keyboard.keyDown('esc');
    pointer.dragEnd();

    assert.ok(!updateSpy.calledOnce, 'Observer was not notified');
});

QUnit.test('Appointment should not be changed while resize when \'esc\' key was pressed', function(assert) {
    var item = {
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

    this.initItems([item]);

    this.instance.option({ focusStateEnabled: true });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        initialWidth = $appointment.width(),
        initialHeight = $appointment.height(),
        keyboard = keyboardMock($appointment),
        pointer = pointerMock(this.instance.$element().find('.dx-resizable-handle-bottom')).start();

    pointer.dragStart().drag(0, 40);
    keyboard.keyDown('esc');
    pointer.dragEnd();

    assert.equal($appointment.width(), initialWidth, 'Appointment width is correct');
    assert.equal($appointment.height(), initialHeight, 'Appointment height is correct');
});

QUnit.test('Scheduler appointment should be draggable', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.initItems([item]);

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        draggableInstance = $appointment.dxDraggable('instance');

    assert.ok(draggableInstance instanceof Draggable, 'Appointment is instance of dxDraggable');
});

QUnit.test('Scheduler appointment should not be draggable if allowDrag is false', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.initItems([item]);
    this.instance.option({ allowDrag: false });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.notOk($appointment.data('dxDraggable'), 'Appointment is not dxDraggable');
});

QUnit.test('Drag event should not contain maxBottomOffset & maxRightOffset', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    $($appointment).on(dragEvents.start, function(e) {
        assert.equal(e.maxBottomOffset, null, 'maxBottomOffset is not set');
        assert.equal(e.maxRightOffset, null, 'maxRightOffset is not set');
    });

    pointer.dragStart();
    pointer.dragEnd();
});

QUnit.test('Allday appointment should stay in allDayContainer after small dragging', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true
        },
        settings: [{ allDay: true }]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        allDayContainer: $('#allDayContainer'),
        items: [item]
    });

    var $appointment = $('#allDayContainer .dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, -30);
    pointer.dragEnd();

    assert.equal($('#allDayContainer .dx-scheduler-appointment').length, 1, 'appointment is in allDayContainer');
});

QUnit.test('Drag event should not contain maxBottomOffset & maxLeftOffset for RTL', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true
        },
        settings: [{}]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        rtlEnabled: true,
        items: [item]
    });
    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    $($appointment).on(dragEvents.start, function(e) {
        assert.equal(e.maxBottomOffset, null, 'maxBottomOffset is not set');
        assert.equal(e.maxLeftOffset, null, 'maxLeftOffset is not set');
    });

    pointer.dragStart();
    pointer.dragEnd();
});

QUnit.test('Appointment coordinates should be corrected during drag', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true
        },
        settings: [{ allDay: true }]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var updateSpy = sinon.spy(commonUtils.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);

    assert.ok(!updateSpy.calledOnce, 'Observers are notified');
    assert.deepEqual(updateSpy.getCall(1).args[0], 'correctAppointmentCoordinates', 'Correct method of observer is called');
    assert.deepEqual(updateSpy.getCall(1).args[1].coordinates, { left: 0, top: 60 }, 'Arguments are OK');
    assert.deepEqual(updateSpy.getCall(1).args[1].allDay, true, 'Arguments are OK');

    pointer.dragEnd();
});

QUnit.test('Appointment coordinates should be corrected on dragend', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            allDay: true
        },
        settings: [{ allDay: true }]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var updateSpy = sinon.spy(commonUtils.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60).dragEnd();

    assert.ok(!updateSpy.calledOnce, 'Observers are notified');
    assert.deepEqual(updateSpy.getCall(2).args[0], 'correctAppointmentCoordinates', 'Correct method of observer is called');
    assert.deepEqual(updateSpy.getCall(2).args[1].coordinates, { left: 0, top: 60 }, 'Arguments are OK');
    assert.deepEqual(updateSpy.getCall(2).args[1].allDay, true, 'Arguments are OK');
    assert.deepEqual(updateSpy.getCall(2).args[1].isFixedContainer, true, 'Arguments are OK');

    pointer.dragEnd();
});

QUnit.test('Start & end date of appointment should be changed when drag is finished', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var updateSpy = sinon.spy(commonUtils.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60).dragEnd();

    assert.ok(!updateSpy.calledOnce, 'Observers are notified');
    assert.deepEqual(updateSpy.getCall(3).args[0], 'updateAppointmentAfterDrag', 'Correct method of observer is called');
    assert.deepEqual(updateSpy.getCall(3).args[1].data, item.itemData, 'Arguments are OK');
    assert.deepEqual(updateSpy.getCall(3).args[1].$appointment.get(0), $appointment.get(0), 'Arguments are OK');
});

QUnit.test('Appointment tooltip should be hidden when drag is started', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var updateSpy = sinon.spy(commonUtils.noop);

    this.instance.notifyObserver = updateSpy;

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);

    assert.deepEqual(updateSpy.getCall(0).args[0], 'hideAppointmentTooltip', 'Correct method of observer is called');

    pointer.dragEnd();
});

QUnit.test('Appointment should be placed in fixed container on drag-start', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item],
        focusStateEnabled: true
    });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment'),
        pointer = pointerMock($appointment).start();

    pointer.dragStart().drag(0, 60);
    assert.equal($('#fixedContainer .dx-scheduler-appointment').length, 1, 'fixedContainer has 1 item');

    pointer.dragEnd();
    assert.equal($('#fixedContainer .dx-scheduler-appointment').length, 0, 'fixedContainer is empty after drag-end');
});

QUnit.test('Appointment should be rendered a many times if coordinates array contains a few items', function(assert) {
    var item = {
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
    this.coordinates = [{ top: 0, left: 0 }, { top: 10, left: 10 }, { top: 20, left: 20 }];

    this.instance.option({
        items: [item]
    });

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.equal($appointment.length, 3, 'All appointments are rendered');
    assert.deepEqual(translator.locate($appointment.eq(0)), { top: 0, left: 0 }, 'appointment is rendered in right place');
    assert.deepEqual(translator.locate($appointment.eq(1)), { top: 10, left: 10 }, 'appointment is rendered in right place');
    assert.deepEqual(translator.locate($appointment.eq(2)), { top: 20, left: 20 }, 'appointment is rendered in right place');
    assert.deepEqual(this.instance.option('items'), [item], 'items are not affected');
});

QUnit.test('Draggable clone should be correct', function(assert) {
    var item = {
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

    this.instance.option({
        fixedContainer: $('#fixedContainer'),
        items: [item]
    });

    var $secondAppointment = this.instance.$element().find('.dx-scheduler-appointment').eq(1),
        pointer = pointerMock($secondAppointment).start();

    $secondAppointment.dxDraggable('instance').option('onDrag', function(e) {
        assert.deepEqual($(arguments[0].element).get(0), $secondAppointment.get(0), 'draggable element is right');
    });

    pointer.dragStart().drag(0, 60).dragEnd();
});

QUnit.test('Delta time for resizable appointment should be 0 if appointment isn\'t resized', function(assert) {
    var strategy = new HorizontalMonthAppointmentsStrategy({
            notifyObserver: commonUtils.noop,
            option: commonUtils.noop,
            fire: commonUtils.noop
        }),
        deltaTime = strategy.getDeltaTime({ width: 100 }, { width: 100 });

    assert.strictEqual(deltaTime, 0, 'Delta time is 0');
});

QUnit.test('Delta time for resizable appointment should decreased correctly in vertical strategy', function(assert) {
    var strategy = new VerticalAppointmentsStrategy({
        notifyObserver: commonUtils.noop,
        invoke: commonUtils.noop,
        fire: commonUtils.noop,
        appointmentTakesAllDay: commonUtils.noop,
        getAppointmentDurationInMinutes: function() {
            return 30;
        }
    });
    strategy._defaultHeight = 50;
    var deltaTime = strategy.getDeltaTime({ height: 50 }, { height: 100 }, { allDay: false });

    assert.strictEqual(deltaTime, -1800000, 'Delta time is OK');
});

QUnit.test('Scheduler appointment should have aria-role \'button\'', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option('items', [item]);

    var $appointment = this.instance.$element().find('.dx-scheduler-appointment');

    assert.equal($appointment.attr('role'), 'button', 'role is right');
});

QUnit.test('Split appointment by day', function(assert) {
    var appt1 = { startDate: new Date(2016, 1, 25, 9).toString(), endDate: new Date(2016, 1, 25, 10).toString() },
        appt2 = { startDate: new Date(2016, 1, 28, 9).toString(), endDate: new Date(2016, 2, 3, 16).toString() },
        appt3 = { startDate: new Date(2016, 1, 28, 9).toString(), endDate: new Date(2016, 1, 29, 10).toString() };

    var parts1 = this.instance.splitAppointmentByDay(appt1),
        parts2 = this.instance.splitAppointmentByDay(appt2),
        parts3 = this.instance.splitAppointmentByDay(appt3);

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
    var appt1 = { startDate: new Date(2016, 1, 25, 1).toString(), endDate: new Date(2016, 1, 25, 2).toString() },
        appt2 = { startDate: new Date(2016, 1, 28, 1).toString(), endDate: new Date(2016, 2, 3, 2).toString() },
        appt3 = { startDate: new Date(2016, 1, 28, 16).toString(), endDate: new Date(2016, 1, 29, 20).toString() };

    var parts1 = this.instance.splitAppointmentByDay(appt1),
        parts2 = this.instance.splitAppointmentByDay(appt2),
        parts3 = this.instance.splitAppointmentByDay(appt3);

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
    var appt1 = { startDate: new Date(2017, 7, 21, 9, 0, 10).toString(), endDate: new Date(2017, 7, 22, 18, 0).toString() };

    var parts1 = this.instance.splitAppointmentByDay(appt1);

    assert.deepEqual(parts1, [
        { settings: { startDate: new Date(2017, 7, 21, 9, 0, 10), endDate: new Date(2017, 7, 21, 20) }, startDate: appt1.startDate, endDate: appt1.endDate },
        { settings: { startDate: new Date(2017, 7, 22, 8, 0, 0), endDate: new Date(2017, 7, 22, 18) }, startDate: appt1.startDate, endDate: appt1.endDate }
    ], 'Parts are OK');
});

QUnit.test('Appointment should process resource names with spaces', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 10, 3, 9),
            endDate: new Date(2015, 10, 3, 11)
        },
        settings: [
            { top: 0, left: 0, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 },
            { top: 10, left: 10, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 },
            { top: 20, left: 20, height: 10, sortedIndex: 0, width: 10, count: 1, index: 0 }
        ]
    };
    this.instance.option({
        currentDate: new Date(2015, 10, 3),
        items: [item]
    });

    var $appointment = $('.dx-scheduler-appointment').eq(0);
    assert.equal($appointment.filter('[data-someid-with__32__space]').length, 1, 'attr is right');
});

QUnit.module('Appointments Actions', moduleOptions);

QUnit.test('Appointments should set alias key to cellCache', function(assert) {
    var item = {
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
    var setCacheAliasSpy = sinon.spy(this.instance, 'invoke').withArgs('setCellDataCacheAlias');

    this.initItems([item]);

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
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        items: [item],
        onItemClick: function(e) {
            e.cancel = true;
        }
    });

    var stub = sinon.stub(this.instance, 'notifyObserver').withArgs('showAppointmentTooltip');
    var $item = $('.dx-scheduler-appointment').eq(0);

    $($item).trigger('dxclick');
    this.clock.tick(300);

    assert.notOk(stub.called, 'showAppointmentTooltip doesn\'t shown');
});

QUnit.test('onAppointmentDblClick should fires when item is dbl clicked', function(assert) {
    assert.expect(2);

    var items = [{
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

    this.instance.option({
        dataSource: new DataSource({
            store: items
        }),
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2015, 2, 9),
        onAppointmentDblClick: function(e) {
            assert.deepEqual($(e.appointmentElement)[0], $item[0], 'appointmentElement is correct');
            assert.deepEqual(e.appointmentData, items[0].itemData, 'appointmentData is correct');
        }
    });

    var $item = $('.dx-scheduler-appointment').eq(0);
    $($item).trigger(dblclickEvent.name);
});

QUnit.test('Popup should be shown when onAppointmentDblClick', function(assert) {
    assert.expect(1);
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{}]
    };

    this.instance.option({
        items: [item],
        onAppointmentDblClick: function(e) {
            e.cancel = true;
        }
    });

    var stub = sinon.stub(this.instance, 'notifyObserver').withArgs('showEditAppointmentPopup');
    var $item = $('.dx-scheduler-appointment').eq(0);

    $($item).trigger(dblclickEvent.name);

    assert.notOk(stub.called, 'showEditAppointmentPopup doesn\'t shown');
});


QUnit.module('Appointments Keyboard Navigation', {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this);

        var current = 0;
        this.getCoordinates = function() {
            var coords = [[{ top: 0, left: 100 }], [{ top: 0, left: 200 }], [{ top: 0, left: 300 }], [{ top: 0, left: 400 }]];
            return coords[current++ % coords.length];
        };

        this.width = 100;
        this.height = 30;
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this);
    }
});

QUnit.test('Items has a tab index if focusStateEnabled', function(assert) {
    var item = {
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9)
        },
        settings: [{ sortedIndex: 0 }]
    };

    this.instance.option({
        currentDate: new Date(2015, 1, 9),
        items: [item],
        focusStateEnabled: true,
        tabIndex: 1
    });
    var $appointments = $('.dx-scheduler-appointment');

    assert.equal($appointments.eq(0).attr('tabindex'), 1, 'item tabindex is right');

    this.instance.option({
        focusStateEnabled: false
    });

    $appointments = $('.dx-scheduler-appointment');
    assert.ok(!$appointments.eq(0).attr('tabindex'), 'item tabindex is right');
});

QUnit.testInActiveWindow('Focused element should be changed on focusin', function(assert) {
    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 1, 9),
        items: items,
        focusStateEnabled: true
    });
    var $appointments = $('.dx-scheduler-appointment');
    $appointments.get(0).focus();
    assert.equal(isRenderer(this.instance.option('focusedElement')), !!config().useJQuery, 'focusedElement is correct');
    assert.deepEqual($appointments.get(0), $(this.instance.option('focusedElement')).get(0), 'right element is focused');

    $appointments.get(1).focus();
    assert.deepEqual($appointments.get(1), $(this.instance.option('focusedElement')).get(0), 'right element is focused');
});

QUnit.test('Appointment popup should be opened after enter key press', function(assert) {
    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true
    });

    var notifyStub = sinon.stub(this.instance, 'notifyObserver'),
        $appointments = $('.dx-scheduler-appointment'),
        keyboard = keyboardMock($appointments.eq(0));


    $($appointments.eq(0)).trigger('focusin');
    keyboard.keyDown('enter');
    this.clock.tick(300);

    assert.ok(notifyStub.called, 'notify is called');
    assert.equal(notifyStub.getCall(0).args[0], 'showEditAppointmentPopup', 'popup is shown');

    assert.deepEqual(notifyStub.getCall(0).args[1].data, items[0].itemData, 'data is ok');
    assert.deepEqual(notifyStub.getCall(0).args[1].target.get(0), $appointments.get(0), 'element is ok');
});

QUnit.test('Appointment should be deleted after delete key press, if allowDelete = true', function(assert) {
    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true,
        allowDelete: true
    });

    var notifyStub = sinon.stub(this.instance, 'notifyObserver'),
        $appointments = $('.dx-scheduler-appointment'),
        $targetAppointment = $appointments.eq(1);

    $($targetAppointment).trigger('focusin');

    var keyboard = keyboardMock($targetAppointment);
    keyboard.keyDown('del');

    assert.ok(notifyStub.called, 'notify is called');

    var deleteEventName = notifyStub.getCall(0).args[0],
        hideTooltipEventName = notifyStub.getCall(1).args[0];

    assert.equal(deleteEventName, 'deleteAppointment', 'deleteAppointment is called');

    var eventOptions = notifyStub.getCall(0).args[1];
    assert.deepEqual(eventOptions.data, items[1].itemData, 'data is ok');
    assert.deepEqual($(eventOptions.target).get(0), $targetAppointment.get(0), 'target is ok');

    assert.equal(hideTooltipEventName, 'hideAppointmentTooltip', 'hideAppointmentTooltip is called');
});

QUnit.test('Appointment should not be deleted after delete key press, if allowDelete = false', function(assert) {
    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 8, 16),
        items: items,
        focusStateEnabled: true,
        allowDelete: false
    });

    var notifyStub = sinon.stub(this.instance, 'notifyObserver'),
        $appointments = $('.dx-scheduler-appointment'),
        $targetAppointment = $appointments.eq(1);

    $($targetAppointment).trigger('focusin');

    var keyboard = keyboardMock($targetAppointment);
    keyboard.keyDown('del');

    assert.notOk(notifyStub.called, 'notify was not called');
});

QUnit.test('Focus method should call focus on appointment', function(assert) {
    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 10, 3),
        items: items,
        focusStateEnabled: true
    });

    var $appointment = $('.dx-scheduler-appointment').eq(0);

    $($appointment).trigger('focusin');

    var focusedElement = $(this.instance.option('focusedElement')).get(0);
    var focusSpy = sinon.spy(eventsEngine, 'trigger').withArgs(sinon.match(function($element) {
        return config().useJQuery ? $element.get(0) === focusedElement : $element === focusedElement;
    }), 'focus');
    var appointmentFocusedStub = sinon.stub(this.instance, 'notifyObserver').withArgs('appointmentFocused');

    this.instance.focus();

    this.clock.tick();
    assert.ok(focusSpy.called, 'focus is called');
    assert.ok(appointmentFocusedStub.called, 'appointmentFocused is fired');
    sinon.restore();
});

QUnit.test('Default behavior of tab button should be prevented for apps', function(assert) {
    assert.expect(1);

    var items = [
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

    this.instance.option({
        currentDate: new Date(2015, 1, 9),
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.$element().find('.dx-scheduler-appointment'),
        keyboard = keyboardMock($appointments.eq(0));

    $(this.instance.$element()).on('keydown', function(e) {
        assert.ok(e.isDefaultPrevented(), 'default tab prevented');
    });

    $($appointments.eq(0)).trigger('focusin');
    keyboard.keyDown('tab');

    $($appointments).off('keydown');
});

QUnit.test('Focus shouldn\'t be prevent when first appointment is reached in back order', function(assert) {
    var items = [
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

    this.instance.option({
        items: items,
        focusStateEnabled: true
    });

    var $appointments = this.instance.$element().find('.dx-scheduler-appointment'),
        keyboard = keyboardMock($appointments.eq(0));

    $(this.instance.$element()).on('keydown', function(e) {
        assert.notOk(e.isDefaultPrevented(), 'default tab isn\'t prevented');
    });

    $($appointments.eq(0)).trigger('focusin');
    keyboard.keyDown('tab', { shiftKey: true });

    $($appointments).off('keydown');
});

