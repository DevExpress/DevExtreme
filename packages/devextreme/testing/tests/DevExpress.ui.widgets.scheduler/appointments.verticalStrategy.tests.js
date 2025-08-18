import $ from 'jquery';
import { Deferred } from 'core/utils/deferred';
import fx from 'common/core/animation/fx';

import '__internal/scheduler/m_scheduler';

import { mockDataAccessor } from '../../helpers/scheduler/mockDataAccessor.js';
import { getEmptyResourceManager } from '../../helpers/scheduler/mockResourceManager.js';

const { module, test, testStart } = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
        <div id="allDayContainer"></div>\
        <div id="fixedContainer"></div>');
});

const createInstance = (options) => {
    const notifyScheduler = {
        invoke: (command, field, obj, value) => {
            switch(command) {
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

    return $('#scheduler-appointments').dxSchedulerAppointments({
        notifyScheduler,
        ...options,
        dataAccessors: mockDataAccessor,
        getLoadedResources: () => [],
        getResourceManager: getEmptyResourceManager,
        getAppointmentColor: () => new Deferred(),
        getAppointmentDataSource: () => ({
            getUpdatedAppointment: () => false,
            getUpdatedAppointmentKeys: () => [],
        }),
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

module('Vertical Strategy', moduleOptions, () => {
    test('Wide rival appointments should not have specific class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12),
                allDay: true
            },
            sortedIndex: 0,
            width: 40, height: 100, allDay: true,
        }, {
            itemData: {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 9, 9),
                endDate: new Date(2015, 1, 9, 12),
                allDay: true
            },
            sortedIndex: 1,
            width: 40, height: 100, allDay: true,
        }];

        const instance = createInstance({
            items,
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        assert.ok(!$appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
        assert.ok(!$appointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has not the class');
    });

    // NOTE: integration test
    test('Narrow rival appointments should have specific class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12),
                allDay: true
            },
            sortedIndex: 0,
            maxLevel: 1, level: 0, width: 35, height: 100, allDay: true, empty: true
        }, {
            itemData: {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 9, 9),
                endDate: new Date(2015, 1, 9, 12),
                allDay: true
            },
            sortedIndex: 1,
            maxLevel: 1, level: 0, width: 35, height: 100, allDay: true, empty: true
        }];

        const instance = createInstance({
            items,
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
        assert.ok($appointment.eq(1).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });
});

module('Vertical All Day Strategy', moduleOptions, () => {
    test('Scheduler appointments should be rendered in right containers', async function(assert) {
        const instance = createInstance({
            fixedContainer: $('#fixedContainer'),
            allDayContainer: $('#allDayContainer')
        });

        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(),
                allDay: true
            },
            sortedIndex: 0,
            maxLevel: 1, level: 0, width: 40, height: 100, allDay: true,
        }, {
            itemData: {
                text: 'Appointment 2',
                startDate: new Date()
            },
            sortedIndex: 1,
            maxLevel: 1, level: 0, width: 40, height: 100,
        }];

        instance.option('items', items);

        assert.equal(instance.$element().find('.dx-scheduler-appointment').length, 1, 'dxSchedulerAppointments has 1 item');
        assert.equal($('#allDayContainer .dx-scheduler-appointment').length, 1, 'allDayContainer has 1 item');
    });

    test('Scheduler appointments should have specific allDay class if needed', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date()
            },
            sortedIndex: 0,
            maxLevel: 1, level: 0, width: 40, height: 100,
        }];

        const instance = createInstance({
            items,
        });

        let $appointment = $('.dx-scheduler-appointment').eq(0);
        assert.ok(!$appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment hasn\'t allDay class');

        instance.option('fixedContainer', $('#fixedContainer'));
        instance.option('allDayContainer', $('#allDayContainer'));
        instance.option('items', [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(),
                allDay: true
            },
            sortedIndex: 0,
            maxLevel: 1, level: 0, width: 40, height: 100, allDay: true,
        }]
        );

        $appointment = $('#allDayContainer .dx-scheduler-appointment').eq(0);
        assert.ok($appointment.hasClass('dx-scheduler-all-day-appointment'), 'Appointment has allDay class');
    });
});
