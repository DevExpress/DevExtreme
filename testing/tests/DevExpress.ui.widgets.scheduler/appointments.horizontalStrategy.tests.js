import $ from 'jquery';
import dataCoreUtils from 'core/utils/data';
import typeUtils from 'core/utils/type';
import fx from 'animation/fx';
import 'ui/scheduler/ui.scheduler';
import { createFactoryInstances, getResourceManager, getAppointmentDataProvider } from 'ui/scheduler/instanceFactory';

const { testStart, module, test } = QUnit;

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;

const BASE_WIDTH = 20;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
        <div id="allDayContainer"></div>\
        <div id="fixedContainer"></div>');
});

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

const schedulerMock = {
    isVirtualScrolling: () => false
};

const createInstance = (options = {}) => {
    const key = createFactoryInstances({
        scheduler: schedulerMock
    });

    const createObserver = (renderingStrategy) => ({
        fire: (command, field, obj, value) => {
            switch(command) {
                case 'getField':
                    if(!typeUtils.isDefined(dataAccessors.getter[field])) {
                        return;
                    }
                    return dataAccessors.getter[field](obj);
                case 'setField':
                    return dataAccessors.setter[field](obj, value);
                case 'getAppointmentColor':
                    return $.Deferred().resolve('red').promise();
                case 'getEndDayHour':
                    if(renderingStrategy === 'horizontalMonthLine') {
                        return 24;
                    } else {
                        return 20;
                    }
                case 'getStartDayHour':
                    if(renderingStrategy === 'horizontalMonthLine') {
                        return 0;
                    } else {
                        return 8;
                    }
                case 'getAppointmentGeometry':
                    return {
                        width: field.width || 0,
                        height: field.height || 0,
                        left: field.left || 0,
                        top: field.top || 0,
                        empty: field.empty || false
                    };
                case 'getResourceManager':
                    return getResourceManager(key);
                case 'getAppointmentDataProvider':
                    return getAppointmentDataProvider(key);
                default:
                    break;
            }
        }
    });

    return $('#scheduler-appointments').dxSchedulerAppointments({
        observer: createObserver(options.renderingStrategy),
        ...options,
    }).dxSchedulerAppointments('instance');
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

module('Horizontal Month Strategy', moduleOptions, () => {
    test('AllDay appointment should be displayed right when endDate > startDate and duration < 24', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 5, 10),
                endDate: new Date(2015, 2, 6, 6),
                allDay: true
            },
            settings: [{ top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true }]
        }];

        const instance = createInstance({
            items,
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        const allDayAppointmentWidth = BASE_WIDTH * 2;
        assert.equal($appointment.eq(0).outerWidth(), allDayAppointmentWidth, 'appointment has right width');
    });

    test('Appointment should not be multiweek when its width some more than maxAllowedPosition(ie & ff pixels)', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 1),
                endDate: new Date(2015, 2, 8)
            },
            settings: [{ top: 0, left: 0, max: 135 }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.length, 1, 'appointment is not multiline');
    });

    test('Collapsing appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 11),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, empty: true }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment').eq(0);
        assert.ok($appointment.hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    test('Small width appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, height: 50, width: 39.5, empty: true }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    test('Small height appointments should have specific class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            settings: [{ top: 0, left: 0, height: 18.5, width: 10, empty: true }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });
});

module('Horizontal Strategy', moduleOptions, () => {
    test('All-day appointment should have a correct css class', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            settings: [{ top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontal',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.ok($appointment.eq(0).hasClass('dx-scheduler-all-day-appointment'), 'Appointment has a right css class');
    });

    test('Appointment should have a correct min width', function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            settings: [{ width: 2 }]
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontal',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.outerWidth(), 2, 'Min width is OK');
    });

});
