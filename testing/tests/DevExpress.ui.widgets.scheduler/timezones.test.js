import $ from 'jquery';
import fx from 'animation/fx';
import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';

const { testStart, test, module } = QUnit;

const timeZones = {
    LosAngeles: 'America/Los_Angeles',
    NewYork: 'America/New_York'
};

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

const data = [{
    text: 'app_1_Los_Angeles',
    startDate: new Date('2017-05-22T05:00:00.000Z'), // local offset
    endDate: new Date('2017-05-22T05:30:00.000Z'), // local offset
    startDateTimeZone: timeZones.LosAngeles, // -7
    endDateTimeZone: timeZones.LosAngeles // -7
}, {
    text: 'app_2_Los_Angeles',
    startDate: new Date('2017-05-22T12:00:00.000Z'), // local offset
    endDate: new Date('2017-05-22T12:30:00.000Z'), // local offset
    startDateTimeZone: timeZones.LosAngeles, // -7
    endDateTimeZone: timeZones.LosAngeles // -7
}, {
    text: 'app_local',
    startDate: new Date('2017-05-22T16:00:00.000Z'), // local offset
    endDate: new Date('2017-05-22T16:30:00.000Z') // local offset
}];

const createScheduler = (options = {}) => {
    return createWrapper($.extend({
        dataSource: data,
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 22),
        height: 600
    }, options));
};

module('Not native date DST', moduleConfig, () => {
    module('summer time', () => {

    });

    module('winter time', () => {

    });
});

module('Scheduler grid', moduleConfig, () => {
    module('timezone = "America/New_York', () => {
        test('startDate and endDate of appointments should valid', function(assert) {
            const scheduler = createScheduler({ timeZone: 'America/New_York' }); // -4 offset

            ['1:00 AM - 1:30 AM', '8:00 AM - 8:30 AM', '12:00 PM - 12:30 PM'].forEach((expected, index) => {
                const dateText = scheduler.appointments.getDateText(index);
                assert.equal(dateText, expected, 'Appointment date text should be valid');

                scheduler.appointments.click(index);

                const tooltipDateText = scheduler.tooltip.getDateText();
                assert.equal(dateText, tooltipDateText, 'Tooltip date text should be valid');
            });
        });
    });
});

module('Appointment popup', moduleConfig, () => {
    module('scheduler time zone is set', () => {
        const cases = [{
            startDate: (new Date(2017, 4, 21, 22)).valueOf(),
            endDate: (new Date(2017, 4, 21, 22, 30)).valueOf()
        }, {
            startDate: (new Date(2017, 4, 22, 5)).valueOf(),
            endDate: (new Date(2017, 4, 22, 5, 30)).valueOf()
        }, {
            startDate: (new Date(2017, 4, 22, 12)).valueOf(),
            endDate: (new Date(2017, 4, 22, 12, 30)).valueOf()
        }];

        cases.forEach((testCase, index) => {
            test('StartDate and endDate should be valid', function(assert) {
                const scheduler = createScheduler({ timeZone: 'America/New_York' }); // -4 offset

                scheduler.appointments.dblclick(index);

                const text = scheduler.appointments.getTitleText(index);
                const startDate = scheduler.appointmentForm.getEditor('startDate').option('value');
                const endDate = scheduler.appointmentForm.getEditor('endDate').option('value');

                assert.equal(startDate.valueOf(), testCase.startDate, `StartDate of '${text}' should be valid`);
                assert.equal(endDate.valueOf(), testCase.endDate, `EndDate of '${text}' should be valid`);
            });
        });
    });

    module('scheduler time zone is not set', () => {
        const cases = [{
            startDate: (new Date(2017, 4, 21, 22)).valueOf(),
            endDate: (new Date(2017, 4, 21, 22, 30)).valueOf()
        }, {
            startDate: (new Date(2017, 4, 22, 5)).valueOf(),
            endDate: (new Date(2017, 4, 22, 5, 30)).valueOf()
        }, {
            startDate: (new Date('2017-05-22T16:00:00.000Z')).valueOf(),
            endDate: (new Date('2017-05-22T16:30:00.000Z')).valueOf()
        }];

        cases.forEach((testCase, index) => {
            test('StartDate and endDate should be valid', function(assert) {
                const scheduler = createScheduler();

                scheduler.appointments.dblclick(index);

                const text = scheduler.appointments.getTitleText(index);
                const startDate = scheduler.appointmentForm.getEditor('startDate').option('value');
                const endDate = scheduler.appointmentForm.getEditor('endDate').option('value');

                assert.equal(startDate.valueOf(), testCase.startDate, `StartDate of '${text}' should be valid`);
                assert.equal(endDate.valueOf(), testCase.endDate, `EndDate of '${text}' should be valid`);
            });
        });
    });
});
