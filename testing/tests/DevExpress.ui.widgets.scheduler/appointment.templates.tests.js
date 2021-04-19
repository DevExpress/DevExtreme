import $ from 'jquery';
import fx from 'animation/fx';
import Color from 'color';
import { DataSource } from 'data/data_source/data_source';
import {
    SchedulerTestWrapper,
    initTestMarkup,
    createWrapper
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test
} = QUnit;

initTestMarkup();

const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

module('Integration: Appointment templates', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
        };
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    let eventCallCount = 0;

    const createScheduler = (data, options) => {
        const config = {
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            startDayHour: 9,
            width: 600,
            height: 600
        };

        return createWrapper($.extend(config, options));
    };

    const createTestForCommonData = (assert, scheduler, skipCallCount = false) => {
        eventCallCount = 0;

        return (model, index, container) => {
            const { appointmentData, targetedAppointmentData } = model;

            if(!skipCallCount) {
                assert.equal(index, eventCallCount, 'index argument should be equal current index of appointment');
            }
            assert.deepEqual(appointmentData, targetedAppointmentData, 'appointmentData and targetedAppointmentData should be equivalents');

            eventCallCount++;
        };
    };

    const createTestForRecurrenceData = (assert, scheduler) => {
        eventCallCount = 0;

        return (model, index, container) => {
            const { appointmentData, targetedAppointmentData } = model;
            const startDateExpr = scheduler.option('startDateExpr');
            const endDateExpr = scheduler.option('endDateExpr');
            const textExpr = scheduler.option('textExpr');

            const expectedStartDate = appointmentData[startDateExpr].getDate() + eventCallCount;
            const expectedEndDate = appointmentData[endDateExpr].getDate() + eventCallCount;

            assert.equal(targetedAppointmentData[startDateExpr].getDate(), expectedStartDate, `start date of targetedAppointmentData should be equal ${expectedStartDate}`);
            assert.equal(targetedAppointmentData[endDateExpr].getDate(), expectedEndDate, `end date of targetedAppointmentData should be equal ${expectedEndDate}`);

            assert.equal(index, 0, 'index argument should be 0');
            assert.equal(appointmentData[textExpr], targetedAppointmentData[textExpr], 'appointmentData.text and targetedAppointmentData.text arguments should be equal');

            eventCallCount++;
        };
    };

    const createTestForHourlyRecurrenceData = (assert, scheduler) => {
        eventCallCount = 0;

        return (model, index, container) => {
            // TODO: in current state, targetedAppointmentData arguments has non converted dates
            const { appointmentData, targetedAppointmentData } = model;

            const startDateExpr = scheduler.option('startDateExpr');
            const endDateExpr = scheduler.option('endDateExpr');
            const textExpr = scheduler.option('textExpr');

            const expectedStartDate = appointmentData[startDateExpr];
            const expectedStartDateHours = expectedStartDate.getHours() + eventCallCount;
            const expectedStartDateMinutes = expectedStartDate.getMinutes();

            const expectedEndDate = appointmentData[endDateExpr];
            const expectedEndDateHours = expectedEndDate.getHours() + eventCallCount;
            const expectedEndDateMinutes = expectedEndDate.getMinutes();

            assert.equal(targetedAppointmentData[startDateExpr].getHours(), expectedStartDateHours, `start date of targetedAppointmentData should be equal ${expectedStartDateHours}`);
            assert.equal(targetedAppointmentData[startDateExpr].getMinutes(), expectedStartDateMinutes, `start date of targetedAppointmentData should be equal ${expectedStartDateMinutes}`);

            assert.equal(targetedAppointmentData[endDateExpr].getHours(), expectedEndDateHours, `end date of targetedAppointmentData should be equal ${expectedEndDateHours}`);
            assert.equal(targetedAppointmentData[endDateExpr].getMinutes(), expectedEndDateMinutes, `end date of targetedAppointmentData should be equal ${expectedEndDateMinutes}`);

            assert.equal(index, 0, 'index argument should be 0');
            assert.equal(appointmentData[textExpr], targetedAppointmentData[textExpr], 'appointmentData.text and targetedAppointmentData.text arguments should be equal');

            eventCallCount++;
        };
    };

    const commonData = [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30)
    }, {
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 23, 9, 30),
        endDate: new Date(2017, 4, 23, 11, 30)
    }, {
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 24, 9, 30),
        endDate: new Date(2017, 4, 24, 11, 30)
    }, {
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 25, 9, 30),
        endDate: new Date(2017, 4, 25, 11, 30)
    }, {
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 26, 9, 30),
        endDate: new Date(2017, 4, 26, 11, 30)
    }];

    const recurrenceData = [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    }];

    const recurrenceDataWithCustomNames = [{
        textCustom: 'Website Re-Design Plan',
        startDateCustom: new Date(2017, 4, 22, 9, 30),
        endDateCustom: new Date(2017, 4, 22, 11, 30),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    }];

    const recurrenceAndCompactData = [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    },
    {
        text: 'Website Re-Design Plan1',
        startDate: new Date(2017, 4, 22, 9, 35),
        endDate: new Date(2017, 4, 22, 11, 20),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    },
    {
        text: 'Website Re-Design Plan2',
        startDate: new Date(2017, 4, 22, 9, 45),
        endDate: new Date(2017, 4, 22, 11, 25),
        recurrenceRule: 'FREQ=DAILY;COUNT=5'
    }];

    const hourlyRecurrenceData = [{
        textCustom: 'Website Re-Design Plan',
        startDateCustom: new Date(2017, 4, 25, 9, 30),
        endDateCustom: new Date(2017, 4, 25, 10),
        recurrenceRule: 'FREQ=HOURLY;COUNT=5'
    },
    {
        textCustom: 'Website Re-Design Plan1',
        startDateCustom: new Date(2017, 4, 25, 9, 35),
        endDateCustom: new Date(2017, 4, 25, 11, 20),
        recurrenceRule: 'FREQ=HOURLY;COUNT=5'
    }];

    module('appointmentTemplate', () => {
        test('model.targetedAppointmentData argument should have current appointment data', function(assert) {
            const scheduler = createScheduler(commonData);
            scheduler.option({ appointmentTemplate: createTestForCommonData(assert) });

            assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
        });

        test('model.targetedAppointmentData argument should have current appointment data in case recurrence', function(assert) {
            const scheduler = createScheduler(recurrenceData);
            scheduler.option({ appointmentTemplate: createTestForRecurrenceData(assert, scheduler) });

            assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
        });

        test('model.targetedAppointmentData argument should have current appointment data in case recurrence and custom data properties', function(assert) {
            const scheduler = createScheduler(recurrenceDataWithCustomNames, {
                textExpr: 'textCustom',
                startDateExpr: 'startDateCustom',
                endDateExpr: 'endDateCustom'
            });
            scheduler.option({ appointmentTemplate: createTestForRecurrenceData(assert, scheduler) });

            assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
        });

        test('appointmentTemplate option should be passed to the Task module', function(assert) {
            const data = new DataSource({
                store: [
                    {
                        text: 'Task 1',
                        startDate: new Date(2015, 1, 9, 1, 0),
                        endDate: new Date(2015, 1, 9, 2, 0)
                    }
                ]
            });
            this.createInstance({
                views: ['day', 'week'],
                currentView: 'day',
                currentDate: new Date(2015, 1, 9),
                appointmentTemplate: 'template',
                dataSource: data
            });

            assert.deepEqual(this.instance.$element().find('.' + APPOINTMENT_CLASS).eq(0).text(), 'Task Template', 'Tasks itemTemplate option is correct');
        });

        test('DOM element should be rendered by render function', function(assert) {
            const startDate = new Date(2015, 1, 4, 1);
            const endDate = new Date(2015, 1, 4, 2);
            const appointment = {
                Start: startDate.getTime(),
                End: endDate.getTime(),
                Text: 'abc'
            };

            this.createInstance({
                currentDate: new Date(2015, 1, 4),
                dataSource: [appointment],
                startDateExpr: 'Start',
                endDateExpr: 'End',
                textExpr: 'Text',
                appointmentTemplate: 'appointmentTemplate',
                integrationOptions: {
                    templates: {
                        'appointmentTemplate': {
                            render: function(args) {
                                const $element = $('<span>')
                                    .addClass('dx-template-wrapper')
                                    .text('text');

                                return $element.get(0);
                            }
                        }
                    }
                }
            });

            const $appointment = $(this.instance.$element()).find('.' + APPOINTMENT_CLASS).eq(0);

            assert.equal($appointment.text(), 'text', 'container is correct');
        });
    });

    module('appointmentTooltipTemplate', () => {
        const cases = [
            {
                data: commonData,
                appointmentTooltip: createTestForCommonData,
                name: 'common'
            },
            {
                data: recurrenceData,
                appointmentTooltip: createTestForRecurrenceData,
                name: 'recurrence'
            },
            {
                data: recurrenceAndCompactData,
                appointmentTooltip: createTestForRecurrenceData,
                name: 'recurrence in collector',
                testCollector: true
            },
            {
                data: hourlyRecurrenceData,
                options: {
                    textExpr: 'textCustom',
                    startDateExpr: 'startDateCustom',
                    endDateExpr: 'endDateCustom',
                    currentView: 'week'
                },
                appointmentTooltip: createTestForHourlyRecurrenceData,
                name: 'hourly recurrence in collector',
                testCollector: true
            },
            {
                data: hourlyRecurrenceData,
                options: {
                    textExpr: 'textCustom',
                    startDateExpr: 'startDateCustom',
                    endDateExpr: 'endDateCustom',
                    currentView: 'week',
                    timeZone: 'Africa/Bangui', // NOTE: +1
                    startDayHour: 0,
                    endDayHour: 24
                },
                appointmentTooltip: createTestForHourlyRecurrenceData,
                name: 'hourly recurrence in collector, custom timezone is set',
                testCollector: true
            }
        ];

        cases.forEach(testCase => {
            test(`model.targetedAppointmentData argument should have current appointment data, ${testCase.name} case`, function(assert) {
                const scheduler = createScheduler(testCase.data, testCase.options);
                scheduler.option('appointmentTooltipTemplate', testCase.appointmentTooltip(assert, scheduler, true));

                for(let i = 0; i < 5; i++) {
                    if(testCase.testCollector) {
                        scheduler.appointments.compact.click(i);
                    } else {
                        scheduler.appointments.click(i);
                    }
                }

                assert.strictEqual(eventCallCount, 5, 'appointmentTemplate should be raised');
            });
        });
    });
});
