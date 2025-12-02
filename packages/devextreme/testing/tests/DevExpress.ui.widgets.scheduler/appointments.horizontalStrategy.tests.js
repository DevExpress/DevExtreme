import { getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import { Deferred } from 'core/utils/deferred';
import fx from 'common/core/animation/fx';
import '__internal/scheduler/m_scheduler';

import { mockDataAccessor } from '../../helpers/scheduler/mockDataAccessor.js';
import { getEmptyResourceManager } from '../../helpers/scheduler/mockResourceManager.js';

const { testStart, module, test } = QUnit;

const BASE_WIDTH = 20;

testStart(function() {
    $('#qunit-fixture').html('<div id="scheduler-appointments"></div>\
        <div id="allDayContainer"></div>\
        <div id="fixedContainer"></div>');
});

const createInstance = (options = {}) => {
    const createMockScheduler = (renderingStrategy) => ({
        invoke: (command, field, obj, value) => {
            switch(command) {
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
                default:
                    break;
            }
        }
    });

    return $('#scheduler-appointments').dxSchedulerAppointments({
        notifyScheduler: createMockScheduler(options.renderingStrategy),
        ...options,
        dataAccessors: mockDataAccessor,
        getResources: () => [],
        getLoadedResources: () => [],
        getAppointmentColor: () => new Deferred(),
        getResourceManager: getEmptyResourceManager,
    }).dxSchedulerAppointments('instance');
};

const moduleOptions = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

module('Horizontal Month Strategy', moduleOptions, () => {
    test('AllDay appointment should be displayed right when endDate > startDate and duration < 24', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 5, 10),
                endDate: new Date(2015, 2, 6, 6),
                allDay: true
            },
            sortedIndex: -1,
            top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true
        }];

        const instance = createInstance({
            items,
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        const allDayAppointmentWidth = BASE_WIDTH * 2;
        assert.equal(getOuterWidth($appointment.eq(0)), allDayAppointmentWidth, 'appointment has right width');
    });

    test('Appointment should not be multiweek when its width some more than maxAllowedPosition(ie & ff pixels)', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 2, 1),
                endDate: new Date(2015, 2, 8)
            },
            sortedIndex: -1,
            top: 0, left: 0, max: 135
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal($appointment.length, 1, 'appointment is not multiline');
    });

    test('Collapsing appointments should have specific class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 11),
                endDate: new Date(2015, 1, 9, 12)
            },
            sortedIndex: -1,
            top: 0, left: 0, empty: true
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment').eq(0);
        assert.ok($appointment.hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    test('Small width appointments should have specific class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            sortedIndex: -1,
            top: 0, left: 0, height: 50, width: 39.5, empty: true
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontalMonth',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');
        assert.ok($appointment.eq(0).hasClass('dx-scheduler-appointment-empty'), 'appointment has the class');
    });

    test('Small height appointments should have specific class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 8),
                endDate: new Date(2015, 1, 9, 12)
            },
            sortedIndex: -1,
            top: 0, left: 0, height: 18.5, width: 10, empty: true
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
    test('All-day appointment should have a correct css class', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            sortedIndex: -1,
            top: 0, left: 0, count: 1, index: 0, width: 40, allDay: true
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontal',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.ok($appointment.eq(0).hasClass('dx-scheduler-all-day-appointment'), 'Appointment has a right css class');
    });

    test('Appointment should have a correct min width', async function(assert) {
        const items = [{
            itemData: {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1),
                endDate: new Date(2015, 1, 9, 2),
                allDay: true
            },
            sortedIndex: -1,
            width: 2
        }];

        const instance = createInstance({
            items,
            renderingStrategy: 'horizontal',
        });

        const $appointment = instance.$element().find('.dx-scheduler-appointment');

        assert.equal(getOuterWidth($appointment), 2, 'Min width is OK');
    });

});
