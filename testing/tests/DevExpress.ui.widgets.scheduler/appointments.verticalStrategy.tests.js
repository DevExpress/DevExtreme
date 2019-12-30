import $ from 'jquery';
import dataCoreUtils from 'core/utils/data';
import typeUtils from 'core/utils/type';
import fx from 'animation/fx';

import 'ui/scheduler/ui.scheduler';

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
                                <div id="allDayContainer"></div>\
                                <div id="fixedContainer"></div>');
});

const CELL_OFFSET = 15;

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;

        this.coordinates = [{ top: 0, left: 0 }];
        this.getCoordinates = function() {
            return this.coordinates;
        };
        this.clock = sinon.useFakeTimers();
        this.cellWidth = 25;
        this.cellHeight = 20;
        this.allDayHeight = 20;
        this.compactAppointmentOffset = 3;

        this.appWidth = function(appInCellCount) {
            appInCellCount = appInCellCount || 1;
            return (this.cellWidth - CELL_OFFSET) / appInCellCount;
        };

        this.appCoordinates = function(appInCellIndex, appInCellCount, startTopCoord, startLeftCoord) {
            appInCellCount = appInCellCount || 1;
            appInCellIndex = appInCellIndex || 0;
            startTopCoord = startTopCoord || 0;
            startLeftCoord = startLeftCoord || 0;

            const topCoord = startTopCoord;
            const leftCoord = startLeftCoord + ((this.cellWidth - CELL_OFFSET) / appInCellCount) * appInCellIndex;

            return { top: topCoord, left: leftCoord };
        };

        this.instance = $('#scheduler-appointments').dxSchedulerAppointments().dxSchedulerAppointments('instance');

        this.instance.notifyObserver = $.proxy(function(command, options) {
            if(command === 'needCoordinates') {
                options.callback(this.getCoordinates.apply(this));
            }

            if(command === 'getCellDimensions') {
                options.callback(this.cellWidth, this.cellHeight, this.allDayHeight);
            }

            if(command === 'getAppointmentColor') {
                options.callback($.Deferred().resolve('red').promise());
            }

            if(command === 'getResourceForPainting') {
                options.callback({ field: 'roomId' });
            }

            if(command === 'getAppointmentDurationInMs') {
                options.callback(options.endDate.getTime() - options.startDate.getTime());
            }
        }, this);

        this.instance.invoke = $.proxy(function(command, field, obj, value) {
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
            if(command === 'getField') {
                if(!typeUtils.isDefined(dataAccessors.getter[field])) {
                    return;
                }

                return dataAccessors.getter[field](obj);
            }
            if(command === 'setField') {
                return dataAccessors.setter[field](obj, value);
            }
            if(command === 'prerenderFilter') {
                return this.instance.option('items');
            }
            if(command === 'convertDateByTimezone') {
                return field;
            }
            if(command === 'getAppointmentGeometry') {
                return {
                    width: field.width || 0,
                    height: field.height || 0,
                    left: field.left || 0,
                    top: field.top || 0,
                    empty: field.empty || false
                };
            }
        }, this);
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Vertical Strategy', moduleOptions);

QUnit.test('Wide rival appointments should not have specific class', function(assert) {
    const items = [{
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 12),
            allDay: true
        },
        settings: [{ width: 40, height: 100, allDay: true }]
    }, {
        itemData: {
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 9, 9),
            endDate: new Date(2015, 1, 9, 12),
            allDay: true
        },
        settings: [{ width: 40, height: 100, allDay: true }]
    }];

    this.items = items;
    this.instance.option('items', items);

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
    assert.ok(!$appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    assert.ok(!$appointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
});

// NOTE: integration test
QUnit.test('Narrow rival appointments should have specific class', function(assert) {
    const items = [{
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 12),
            allDay: true
        },
        settings: [{ count: 1, index: 0, width: 35, height: 100, allDay: true, empty: true }]
    }, {
        itemData: {
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 9, 9),
            endDate: new Date(2015, 1, 9, 12),
            allDay: true
        },
        settings: [{ count: 1, index: 0, width: 35, height: 100, allDay: true, empty: true }]
    }];

    this.items = items;
    this.instance.option('items', items);

    const $appointment = this.instance.$element().find('.dx-scheduler-appointment');
    assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    assert.ok($appointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
});

QUnit.module('Vertical All Day Strategy', {
    beforeEach: function() {
        moduleOptions.beforeEach.apply(this, arguments);
        this.cellWidth = 20;
    },
    afterEach: function() {
        moduleOptions.afterEach.apply(this, arguments);
    },
});

QUnit.test('Scheduler appointments should be rendered in right containers', function(assert) {
    this.instance.option('fixedContainer', $('#fixedContainer'));
    this.instance.option('allDayContainer', $('#allDayContainer'));

    const items = [{
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(),
            allDay: true
        },
        settings: [{ count: 1, index: 0, width: 40, height: 100, allDay: true }]
    }, {
        itemData: {
            text: 'Appointment 2',
            startDate: new Date()
        },
        settings: [{ count: 1, index: 0, width: 40, height: 100 }]
    }];

    this.items = items;
    this.instance.option('items', items);

    assert.equal(this.instance.$element().find('.dx-scheduler-appointment').length, 1, 'dxSchedulerAppointments has 1 item');
    assert.equal($('#allDayContainer .dx-scheduler-appointment').length, 1, 'allDayContainer has 1 item');
});

QUnit.test('Scheduler appointments should have specific allDay class if needed', function(assert) {
    const items = [{
        itemData: {
            text: 'Appointment 1',
            startDate: new Date()
        },
        settings: [{ count: 1, index: 0, width: 40, height: 100 }]
    }];

    this.items = items;
    this.instance.option('items', items);

    let $appointment = $('.dx-scheduler-appointment').eq(0);
    assert.ok(!$appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment hasn\'t allDay class');

    this.instance.option('fixedContainer', $('#fixedContainer'));
    this.instance.option('allDayContainer', $('#allDayContainer'));
    this.instance.option('items', [{
        itemData: {
            text: 'Appointment 1',
            startDate: new Date(),
            allDay: true
        },
        settings: [{ count: 1, index: 0, width: 40, height: 100, allDay: true }]
    }]
    );

    $appointment = $('#allDayContainer .dx-scheduler-appointment').eq(0);
    assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has allDay class');
});
