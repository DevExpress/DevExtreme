import $ from 'jquery';
import dataCoreUtils from 'core/utils/data';
import typeUtils from 'core/utils/type';
import fx from 'animation/fx';

import 'ui/scheduler/ui.scheduler';

const { module, test, testStart } = QUnit;

const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;

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

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        const observer = {
            fire: (command, field, obj, value) => {
                switch(command) {
                    case 'getField':
                        if(!typeUtils.isDefined(dataAccessors.getter[field])) {
                            return;
                        }
                        return dataAccessors.getter[field](obj);
                    case 'setField':
                        return dataAccessors.setter[field](obj, value);
                    case 'prerenderFilter':
                        return this.instance.option('items');
                    case 'getAppointmentColor':
                        return $.Deferred().resolve('red').promise();
                    case 'getAppointmentGeometry':
                        return {
                            width: field.width || 0,
                            height: field.height || 0,
                            left: field.left || 0,
                            top: field.top || 0,
                            empty: field.empty || false
                        };
                    default:
                        break;
                }
            }
        };

        this.instance = $('#scheduler-appointments').dxSchedulerAppointments({ observer }).dxSchedulerAppointments('instance');
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

module('Vertical Strategy', moduleOptions, () => {
    test('Wide rival appointments should not have specific class', function(assert) {
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
    test('Narrow rival appointments should have specific class', function(assert) {
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
});

module('Vertical All Day Strategy', moduleOptions, () => {
    test('Scheduler appointments should be rendered in right containers', function(assert) {
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

    test('Scheduler appointments should have specific allDay class if needed', function(assert) {
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
});
