import $ from 'jquery';
import fx from 'animation/fx';
import {
    CLASSES,
    createWrapper,
    initTestMarkup,
    isDesktopEnvironment
} from '../../helpers/scheduler/helpers.js';
import pointerMock from '../../helpers/pointerMock.js';
import dateUtils from 'core/utils/date';
import subscribes from 'ui/scheduler/ui.scheduler.subscribes';
import dateLocalization from 'localization/date';
import translator from 'animation/translator';
import tooltip from 'ui/tooltip/ui.tooltip';
import { DataSource } from 'data/data_source/data_source';
import dataUtils from 'core/element_data';
import dragEvents from 'events/drag';

const { testStart, test, module } = QUnit;

const timeZones = {
    LosAngeles: 'America/Los_Angeles',
    NewYork: 'America/New_York',

    // Deprecated time zone(don't use in new tests)
    Ashkhabad: 'Asia/Ashkhabad',
    Brazzaville: 'Africa/Brazzaville',
    Calcutta: 'Asia/Calcutta',
    // eslint-disable-next-line spellcheck/spell-checker
    Araguaina: 'America/Araguaina',
    Lima: 'America/Lima',
    Phoenix: 'America/Phoenix',
    Yekaterinburg: 'Asia/Yekaterinburg',
    Moscow: 'Europe/Moscow',
    UTC: 'Etc/UTC',
    Greenwich: 'Greenwich',
    Dawson_Creek: 'America/Dawson_Creek'
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
    startDate: new Date('2017-05-22T05:00:00.000Z'),
    endDate: new Date('2017-05-22T05:30:00.000Z'),
    startDateTimeZone: timeZones.LosAngeles, // -7
    endDateTimeZone: timeZones.LosAngeles // -7
}, {
    text: 'app_2_Los_Angeles',
    startDate: new Date('2017-05-22T12:00:00.000Z'),
    endDate: new Date('2017-05-22T12:30:00.000Z'),
    startDateTimeZone: timeZones.LosAngeles, // -7
    endDateTimeZone: timeZones.LosAngeles // -7
}, {
    text: 'app_local',
    startDate: new Date('2017-05-22T16:00:00.000Z'),
    endDate: new Date('2017-05-22T16:30:00.000Z')
}];

const createScheduler = (options = {}) => {
    return createWrapper($.extend({
        dataSource: data,
        views: ['week', 'month'],
        currentView: 'week',
        currentDate: new Date(2017, 4, 22),
        height: 600
    }, options));
};

module('Common', moduleConfig, () => {
    if(isDesktopEnvironment()) {
        module('Appointments rendering when appointment timeZone is set', () => {
            const cases = [{
                caseName: 'startDateTimeZone = endDateTimezone',
                appointment: {
                    startDate: new Date(2020, 1, 4, 5).toString(),
                    startDateTimeZone: timeZones.Yekaterinburg,
                    endDateTimeZone: timeZones.Yekaterinburg,
                    endDate: new Date(2020, 1, 4, 6).toString(),
                },
                expectedContent: `${dateLocalization.format(new Date(2020, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2020, 1, 4, 6), 'shorttime')}`,
                expectedPosition: {
                    top: 500,
                    left: 100
                },
                expectedPopupDates: {
                    startDate: '2/4/2020, 7:00 AM',
                    endDate: '2/4/2020, 8:00 AM'
                },
                expectedHeight: 100,
                stubClientTimeZone: true
            },
            {
                caseName: 'startDateTimeZone != endDateTimezone',
                appointment: {
                    startDate: new Date(2020, 1, 4, 5).toString(),
                    startDateTimeZone: timeZones.Moscow,
                    endDateTimeZone: timeZones.Yekaterinburg,
                    endDate: new Date(2020, 1, 4, 6).toString()
                },
                expectedContent: `${dateLocalization.format(new Date(2020, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2020, 1, 4, 6), 'shorttime')}`,
                expectedPosition: {
                    top: 500,
                    left: 100
                },
                expectedPopupDates: {
                    startDate: '2/4/2020, 5:00 AM',
                    endDate: '2/4/2020, 8:00 AM'
                },
                expectedHeight: 100,
                stubClientTimeZone: true
            },
            {
                caseName: 'startDateTimeZone = endDateTimezone and scheduler timeZone is set',
                appointment: {
                    startDate: new Date('2020-02-04T14:00:00.000Z'),
                    endDate: new Date('2020-02-04T15:00:00.000Z'),
                    startDateTimeZone: 'Africa/Algiers',
                    endDateTimeZone: 'Africa/Algiers'
                },
                schedulerTimeZone: timeZones.Yekaterinburg,
                expectedContent: '7:00 PM - 8:00 PM',
                expectedPosition: {
                    top: 1900,
                    left: 100
                },
                expectedPopupDates: {
                    startDate: '2/4/2020, 3:00 PM',
                    endDate: '2/4/2020, 4:00 PM'
                },
                expectedHeight: 100,
                stubClientTimeZone: false
            },
            {
                caseName: 'startDateTimeZone != endDateTimezone and scheduler timeZone is set',
                appointment: {
                    startDate: new Date('2020-02-04T14:00:00.000Z'),
                    endDate: new Date('2020-02-04T15:00:00.000Z'),
                    startDateTimeZone: 'Africa/Algiers',
                    endDateTimeZone: 'Africa/Cairo'
                },
                schedulerTimeZone: timeZones.Yekaterinburg,
                expectedContent: '7:00 PM - 8:00 PM',
                expectedPosition: {
                    top: 1900,
                    left: 100
                },
                expectedPopupDates: {
                    startDate: '2/4/2020, 3:00 PM',
                    endDate: '2/4/2020, 5:00 PM'
                },
                expectedHeight: 100,
                stubClientTimeZone: false
            }];

            const runTest = (config, assert) => {
                const scheduler = createWrapper({
                    currentDate: new Date(2020, 1, 4),
                    views: ['day'],
                    currentView: 'day',
                    firstDayOfWeek: 1,
                    dataSource: [config.appointment],
                    timeZone: config.schedulerTimeZone
                });

                assert.equal(scheduler.appointments.getDateText(), config.expectedContent, 'Appointment content has correct dates');
                assert.deepEqual(scheduler.appointments.getAppointmentPosition(), config.expectedPosition, 'Appointment is rendered in right cell');

                scheduler.appointments.dblclick(0);
                const form = scheduler.instance.getAppointmentDetailsForm();
                const startDateBox = form.getEditor('startDate');
                const endDateBox = form.getEditor('endDate');

                assert.equal(startDateBox.option('text'), config.expectedPopupDates.startDate, 'Appointment popup has right startDate');
                assert.equal(endDateBox.option('text'), config.expectedPopupDates.endDate, 'Appointment popup has right endDate');
            };

            cases.forEach(config => {
                test(`Appointment should have correct size, position and popup content if ${config.caseName}`, function(assert) {
                    if(config.stubClientTimeZone) {
                        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
                        try {
                            runTest(config, assert);
                        } finally {
                            tzOffsetStub.restore();
                        }
                    } else {
                        runTest(config, assert);
                    }
                });
            });
        });

        [undefined, timeZones.LosAngeles]
            .forEach(timeZone => {
                test(`After drag element to scheduler, dates from elements should be valid,
                    if timeZone=${timeZone}(T924224)`, function(assert) {
                    const draggingGroupName = 'appointmentsGroup';

                    const expectedStartDate = new Date(2017, 4, 22, 2, 0);
                    const expectedEndDate = new Date(2017, 4, 22, 2, 30);

                    const dragAppointment = $('<div>')
                        .text(data.text)
                        .css({ display: 'block', width: '100px', height: '50px', background: 'red' })
                        .prependTo('#qunit-fixture')
                        .dxDraggable({
                            group: draggingGroupName,
                            data: { text: 'New Brochures' },
                            clone: true,
                            onDragEnd: e => {
                                if(e.toData) {
                                    e.cancel = true;
                                }
                            },
                            onDragStart: e => {
                                e.itemData = e.fromData;
                            }
                        });

                    const scheduler = createScheduler({
                        dataSource: [],
                        views: ['day'],
                        currentView: 'day',
                        timeZone: timeZone,
                        editing: {
                            allowTimeZoneEditing: true,
                            allowAdding: true,
                            allowUpdating: true,
                        },
                        height: 600,
                        appointmentDragging: {
                            group: draggingGroupName,
                            onAdd: e => {
                                e.component.showAppointmentPopup(e.itemData, true);

                                const startDate = scheduler.appointmentForm.getEditor('startDate').option('value');
                                const endDate = scheduler.appointmentForm.getEditor('endDate').option('value');

                                assert.equal(startDate.valueOf(), expectedStartDate.valueOf(), 'start date should be equal with date from grid - 5/22/2017 2:00 AM');
                                assert.equal(endDate.valueOf(), expectedEndDate.valueOf(), 'start date should be equal with date from grid - 5/22/2017 2:30 AM');

                                scheduler.appointmentPopup.dialog.hide();
                            }
                        }
                    });

                    const pointer = pointerMock(dragAppointment).start();

                    // Cell on 2 A.M.
                    const dataCellOffset = $(CLASSES.dateTableCell).eq(4).offset();

                    pointer
                        .down(0, 0)
                        .move(dataCellOffset.left, dataCellOffset.top);
                    pointer.up();
                });
            });
    }
});

module('API', moduleConfig, () => {
    test('onAppointmentAdding event args should be consistent with adding appointment when custom timezone (T686572)', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2016, 4, 7),
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
            timeZone: timeZones.UTC,
            views: ['day'],
            currentView: 'day',
            dataSource: [],
            height: 800,
            onAppointmentAdding: e => {
                assert.equal(e.appointmentData.startDate, '2016-05-07T05:00:00Z', 'Start date is ok');
                assert.equal(e.appointmentData.endDate, '2016-05-07T05:30:00Z', 'End date is ok');
            }
        });

        scheduler.instance.addAppointment({
            startDate: new Date(Date.UTC(2016, 4, 7, 5)),
            endDate: new Date(Date.UTC(2016, 4, 7, 5, 30)),
            startDateTimeZone: 'Asia/Qyzylorda', // +6:00
            endDateTimeZone: 'Asia/Qyzylorda',
            text: 'new Date sample'
        });

        assert.expect(2);
    });

    test('New added appointment should be rendered correctly in specified timeZone', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            currentDate: new Date(2018, 4, 25),
            views: ['week'],
            currentView: 'week',
            timeZone: timeZones.UTC
        });

        const appointment = {
            text: 'a',
            startDate: new Date(2018, 4, 23, 8, 0),
            endDate: new Date(2018, 4, 23, 8, 30)
        };
        const timezoneOffset = new Date(2018, 4, 23).getTimezoneOffset() * dateUtils.dateToMilliseconds('minute');

        scheduler.instance.showAppointmentPopup(appointment, true);
        $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

        const $appointment = scheduler.instance.$element().find(CLASSES.appointment);
        const startDate = $appointment.dxSchedulerAppointment('instance').option('startDate');

        assert.equal(startDate.getTime(), appointment.startDate.getTime() + timezoneOffset, 'appointment starts in 8AM');
    });

    test('Appointment date correction should be rollback after closing popup, if custom timeZone was set', function(assert) {
        const updatedItem = {
            text: 'Task 1',
            startDate: new Date(2015, 1, 7, 1),
            endDate: new Date(2015, 1, 7, 2)
        };
        const data = new DataSource({
            store: [updatedItem]
        });

        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2015, 1, 7),
            dataSource: data,
            timeZone: 5
        });

        const updateAppointment = sinon.spy(scheduler.instance, 'updateAppointment');
        try {
            scheduler.instance.showAppointmentPopup(updatedItem);

            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

            tooltip.hide();

            assert.ok(updateAppointment.calledOnce, 'Update method is called');
            assert.deepEqual(updateAppointment.getCall(0).args[0], updatedItem, 'Target item is correct');
            assert.deepEqual(updateAppointment.getCall(0).args[1], updatedItem, 'New data is correct');
        } finally {
            updateAppointment.restore();
        }
    });
});

module('Not native date DST', moduleConfig, () => {
    module('summer time', () => {
        const from1amTo2amCase = {
            text: 'Recurrence start from 1 a.m. to 2 a.m.',
            startDate: new Date('2020-03-01T09:00:00.000Z'),
            endDate: new Date('2020-03-01T10:00:00.000Z'),
            expectedTexts: [
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM'
            ]
        };

        const from1amTo3amCase = {
            text: 'Recurrence start from 1 a.m. to 3 a.m.',
            startDate: new Date('2020-03-01T09:00:00.000Z'),
            endDate: new Date('2020-03-01T11:00:00.000Z'),
            expectedTexts: [
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM'
            ]
        };

        const from2amTo3amCase = {
            text: 'Recurrence start from 2 a.m. to 3 a.m.',
            startDate: new Date('2020-03-01T10:00:00.000Z'),
            endDate: new Date('2020-03-01T11:00:00.000Z'),
            expectedTexts: [
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '3:00 AM - 4:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM'
            ]
        };

        const from6amTo7amCase = {
            text: 'Recurrence start from 6 a.m. to 7 a.m.',
            startDate: new Date('2020-03-01T16:00:00.000Z'),
            endDate: new Date('2020-03-01T17:00:00.000Z'),
            expectedTexts: [
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM',
                '8:00 AM - 9:00 AM'
            ]
        };

        [from1amTo2amCase, from1amTo3amCase, from2amTo3amCase, from6amTo7amCase].forEach(testCase => {
            test(testCase.text, function(assert) {
                const scheduler = createScheduler({
                    dataSource: [{
                        startDate: testCase.startDate,
                        endDate: testCase.endDate,
                        text: 'Test',
                        recurrenceRule: 'FREQ=DAILY',
                    }],
                    firstDayOfWeek: 4,
                    timeZone: timeZones.LosAngeles,
                    currentDate: new Date(2020, 2, 8)
                });

                const count = scheduler.appointments.getAppointmentCount();
                for(let i = 0; i < count; i++) {
                    const expectedText = testCase.expectedTexts[i];
                    const appointmentText = scheduler.appointments.getDateText(i);
                    assert.equal(appointmentText, expectedText, `appointment date text should be equal ${expectedText}`);

                    scheduler.appointments.click(i);

                    const tooltipText = scheduler.tooltip.getDateText();
                    assert.equal(tooltipText, expectedText, `tooltip date text should be equal ${expectedText}`);

                    scheduler.instance.hideAppointmentTooltip();
                }

                assert.expect(testCase.expectedTexts.length * 2);
            });
        });

        const from1amTo2amMonthCase = {
            text: 'Recurrence start from 1 a.m. to 2 a.m.',
            startDate: new Date('2020-03-06T09:00:00.000Z'),
            endDate: new Date('2020-03-06T10:00:00.000Z'),
            expectedTexts: [
                'March 6 1:00 AM - 2:00 AM',
                'March 7 1:00 AM - 2:00 AM',
                'March 8 1:00 AM - 3:00 AM',
                'March 9 1:00 AM - 2:00 AM',
                'March 10 1:00 AM - 2:00 AM',
                'March 11 1:00 AM - 2:00 AM',
                'March 12 1:00 AM - 2:00 AM'
            ]
        };

        const from1amTo3amMonthCase = {
            text: 'Recurrence start from 1 a.m. to 3 a.m.',
            startDate: new Date('2020-03-06T09:00:00.000Z'),
            endDate: new Date('2020-03-06T11:00:00.000Z'),
            expectedTexts: [
                'March 6 1:00 AM - 3:00 AM',
                'March 7 1:00 AM - 3:00 AM',
                'March 8 1:00 AM - 3:00 AM',
                'March 9 1:00 AM - 3:00 AM',
                'March 10 1:00 AM - 3:00 AM',
                'March 11 1:00 AM - 3:00 AM',
                'March 12 1:00 AM - 3:00 AM'
            ]
        };

        const from2amTo3amMonthCase = {
            text: 'Recurrence start from 2 a.m. to 3 a.m.',
            startDate: new Date('2020-03-06T10:00:00.000Z'),
            endDate: new Date('2020-03-06T11:00:00.000Z'),
            expectedTexts: [
                'March 6 2:00 AM - 3:00 AM',
                'March 7 2:00 AM - 3:00 AM',
                'March 8 3:00 AM - 4:00 AM',
                'March 9 2:00 AM - 3:00 AM',
                'March 10 2:00 AM - 3:00 AM',
                'March 11 2:00 AM - 3:00 AM',
                'March 12 2:00 AM - 3:00 AM'
            ]
        };

        const from6amTo7amMonthCase = {
            text: 'Recurrence start from 6 a.m. to 7 a.m.',
            startDate: new Date('2020-03-06T16:00:00.000Z'),
            endDate: new Date('2020-03-06T17:00:00.000Z'),
            expectedTexts: [
                'March 6 8:00 AM - 9:00 AM',
                'March 7 8:00 AM - 9:00 AM',
                'March 8 8:00 AM - 9:00 AM',
                'March 9 8:00 AM - 9:00 AM',
                'March 10 8:00 AM - 9:00 AM',
                'March 11 8:00 AM - 9:00 AM',
                'March 12 8:00 AM - 9:00 AM'
            ]
        };

        [from1amTo2amMonthCase, from1amTo3amMonthCase, from2amTo3amMonthCase, from6amTo7amMonthCase].forEach(testCase => {
            test(`${testCase.text}, month view type`, function(assert) {
                const scheduler = createScheduler({
                    dataSource: [{
                        startDate: testCase.startDate,
                        endDate: testCase.endDate,
                        text: 'Test',
                        recurrenceRule: 'FREQ=DAILY',
                    }],
                    currentView: 'month',
                    timeZone: timeZones.LosAngeles,
                    currentDate: new Date(2020, 2, 8)
                });

                for(let i = 0; i < testCase.expectedTexts.length; i++) {
                    const expectedText = testCase.expectedTexts[i];

                    scheduler.appointments.click(i);

                    const tooltipText = scheduler.tooltip.getDateText();
                    assert.equal(tooltipText, expectedText, `tooltip date text should be equal ${expectedText}`);

                    scheduler.instance.hideAppointmentTooltip();
                }

                assert.expect(testCase.expectedTexts.length);
            });
        });
    });

    module('winter time', () => {
        const from1amTo2amCase = {
            text: 'Recurrence start from 1 a.m. to 2 a.m.',
            startDate: '2020-10-25T08:00:00.000Z',
            endDate: '2020-10-25T09:00:00.000Z',
            expectedTexts: [
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM'
            ]
        };

        const from2amTo3amCase = {
            text: 'Recurrence start from 2 a.m. to 3 a.m.',
            startDate: '2020-10-25T09:00:00.000Z',
            endDate: '2020-10-25T10:00:00.000Z',
            expectedTexts: [
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
            ]
        };

        const from1amTo3amCase = {
            text: 'Recurrence start from 1 a.m. to 3 a.m.',
            startDate: '2020-10-25T08:00:00.000Z',
            endDate: '2020-10-25T10:00:00.000Z',
            expectedTexts: [
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
            ]
        };

        const from6amTo7amCase = {
            text: 'Recurrence start from 6 a.m. to 7 a.m.',
            startDate: '2020-10-25T13:00:00.000Z',
            endDate: '2020-10-25T14:00:00.000Z',
            expectedTexts: [
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM',
                '6:00 AM - 7:00 AM'
            ]
        };

        [from1amTo2amCase, from2amTo3amCase, from1amTo3amCase, from6amTo7amCase].forEach(testCase => {
            test(testCase.text, function(assert) {
                const scheduler = createScheduler({
                    dataSource: [{
                        startDate: testCase.startDate,
                        endDate: testCase.endDate,
                        text: 'Test',
                        recurrenceRule: 'FREQ=DAILY',
                    }],
                    firstDayOfWeek: 4,
                    timeZone: timeZones.LosAngeles,
                    currentDate: new Date(2020, 10, 1),
                });

                const count = scheduler.appointments.getAppointmentCount();
                for(let i = 0; i < count; i++) {
                    const expectedText = testCase.expectedTexts[i];
                    const appointmentText = scheduler.appointments.getDateText(i);
                    assert.equal(appointmentText, expectedText, `appointment date text should be equal ${expectedText}`);

                    scheduler.appointments.click(i);

                    const tooltipText = scheduler.tooltip.getDateText();
                    assert.equal(tooltipText, expectedText, `tooltip date text should be equal ${expectedText}`);

                    scheduler.instance.hideAppointmentTooltip();
                }

                assert.expect(testCase.expectedTexts.length * 2);
            });
        });

        const from1amTo2amWinterCase = {
            text: 'Recurrence start from 1 a.m. to 2 a.m.',
            startDate: '2020-10-25T08:00:00.000Z',
            endDate: '2020-10-25T09:00:00.000Z',
            expectedTexts: [
                'October 29 1:00 AM - 2:00 AM',
                'October 30 1:00 AM - 2:00 AM',
                'October 31 1:00 AM - 2:00 AM',
                'November 1 1:00 AM - 2:00 AM',
                'November 2 1:00 AM - 2:00 AM',
                'November 3 1:00 AM - 2:00 AM',
                'November 4 1:00 AM - 2:00 AM'
            ]
        };

        const from2amTo3amWinterCase = {
            text: 'Recurrence start from 2 a.m. to 3 a.m.',
            startDate: '2020-10-25T09:00:00.000Z',
            endDate: '2020-10-25T10:00:00.000Z',
            expectedTexts: [
                'October 29 2:00 AM - 3:00 AM',
                'October 30 2:00 AM - 3:00 AM',
                'October 31 2:00 AM - 3:00 AM',
                'November 1 2:00 AM - 3:00 AM',
                'November 2 2:00 AM - 3:00 AM',
                'November 3 2:00 AM - 3:00 AM',
                'November 4 2:00 AM - 3:00 AM',
            ]
        };

        const from1amTo3amWinterCase = {
            text: 'Recurrence start from 1 a.m. to 3 a.m.',
            startDate: '2020-10-25T08:00:00.000Z',
            endDate: '2020-10-25T10:00:00.000Z',
            expectedTexts: [
                'October 29 1:00 AM - 3:00 AM',
                'October 30 1:00 AM - 3:00 AM',
                'October 31 1:00 AM - 3:00 AM',
                'November 1 1:00 AM - 3:00 AM',
                'November 2 1:00 AM - 3:00 AM',
                'November 3 1:00 AM - 3:00 AM',
                'November 4 1:00 AM - 3:00 AM',
            ]
        };

        const from6amTo7amWinterCase = {
            text: 'Recurrence start from 6 a.m. to 7 a.m.',
            startDate: '2020-10-25T13:00:00.000Z',
            endDate: '2020-10-25T14:00:00.000Z',
            expectedTexts: [
                'October 29 6:00 AM - 7:00 AM',
                'October 30 6:00 AM - 7:00 AM',
                'October 31 6:00 AM - 7:00 AM',
                'November 1 6:00 AM - 7:00 AM',
                'November 2 6:00 AM - 7:00 AM',
                'November 3 6:00 AM - 7:00 AM',
                'November 4 6:00 AM - 7:00 AM'
            ]
        };

        [from1amTo2amWinterCase, from2amTo3amWinterCase, from1amTo3amWinterCase, from6amTo7amWinterCase].forEach(testCase => {
            test(`${testCase.text}, month view type`, function(assert) {
                const scheduler = createScheduler({
                    dataSource: [{
                        startDate: testCase.startDate,
                        endDate: testCase.endDate,
                        text: 'Test',
                        recurrenceRule: 'FREQ=DAILY',
                    }],
                    currentView: 'month',
                    firstDayOfWeek: 4,
                    timeZone: timeZones.LosAngeles,
                    currentDate: new Date(2020, 10, 1),
                });

                for(let i = 0; i < testCase.expectedTexts.length; i++) {
                    const expectedText = testCase.expectedTexts[i];

                    scheduler.appointments.click(i);

                    const tooltipText = scheduler.tooltip.getDateText();
                    assert.equal(tooltipText, expectedText, `tooltip date text should be equal ${expectedText}`);

                    scheduler.instance.hideAppointmentTooltip();
                }

                assert.expect(testCase.expectedTexts.length);
            });
        });
    });
});

module('Scheduler grid', moduleConfig, () => {
    const getDeltaTz = (schedulerTz, date) => {
        const defaultTz = date.getTimezoneOffset() * 60000;
        return schedulerTz * 3600000 + defaultTz;
    };

    [
        {
            timeZone: timeZones.NewYork,
            times: ['1:00 AM - 1:30 AM', '8:00 AM - 8:30 AM', '12:00 PM - 12:30 PM']
        }, {
            timeZone: timeZones.LosAngeles,
            times: ['10:00 PM - 10:30 PM', '5:00 AM - 5:30 AM', '9:00 AM - 9:30 AM']
        }
    ].forEach(testCase => {
        test(`startDate and endDate of appointments should valid in ${testCase.timeZone}`, function(assert) {
            const scheduler = createScheduler({ timeZone: testCase.timeZone });

            testCase.times.forEach((expected, index) => {
                const gridDateText = scheduler.appointments.getDateText(index);
                assert.equal(gridDateText, expected, 'Appointment date text should be valid');

                scheduler.appointments.click(index);

                const tooltipDateText = scheduler.tooltip.getDateText();
                assert.equal(gridDateText, tooltipDateText, 'Tooltip date text should be valid');
            });
        });
    });

    test('Recurrence appointment with \'Etc/UTC\' tz should be updated correctly via drag(T394991)', function(assert) {
        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date('2015-12-25T17:00:00.000Z').getTimezoneOffset() * 60000);
        try {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 11, 25),
                startDayHour: 16,
                views: ['week'],
                currentView: 'week',
                editing: true,
                timeZone: timeZones.UTC,
                recurrenceEditMode: 'occurrence',
                firstDayOfWeek: 1,
                dataSource: [{
                    text: 'a',
                    startDate: '2015-12-25T17:00:00.000Z',
                    endDate: '2015-12-25T17:30:00.000Z',
                    recurrenceRule: 'FREQ=DAILY'
                }]
            });

            const rootElement = scheduler.getElement();
            let $appointment = $(rootElement).find(CLASSES.appointment).first();
            const $cell = $(rootElement).find(CLASSES.dateTableCell).eq(21);
            const initialAppointmentHeight = $appointment.outerHeight();

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            $cell.trigger(dragEvents.enter);
            pointer.up();

            $appointment = rootElement.find(CLASSES.appointment).not('.dx-scheduler-appointment-recurrence');

            assert.roughEqual($appointment.position().top, $cell.outerHeight() * 3, 2.001, 'Appointment top is OK');
            assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

            const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
            const cellData = dataUtils.data($cell.get(0), 'dxCellData');
            const startDate = cellData.startDate;
            const endDate = new Date(cellData.startDate.getTime() + 30 * 60 * 1000);
            const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

            assert.equal(dateText, resultDate, 'Appointment date is OK');
        } finally {
            tzOffsetStub.restore();
        }
    });

    test('Task dragging when custom timeZone is set', function(assert) {
        const timezone = -5;
        const timezoneDifference = getDeltaTz(timezone, new Date(2015, 1, 9));
        const startDate = new Date(new Date(2015, 1, 9).getTime() - timezoneDifference);
        const endDate = new Date(new Date(2015, 1, 9, 1).getTime() - timezoneDifference);

        const data = new DataSource({
            store: [
                {
                    text: 'Task 1',
                    startDate: startDate,
                    endDate: endDate
                }
            ]
        });

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            dataSource: data,
            editing: true,
            timeZone: timezone
        });

        const hour = 3600000;
        const updatedItem = {
            text: 'Task 1',
            startDate: new Date(startDate.getTime() + hour),
            endDate: new Date(endDate.getTime() + hour),
            allDay: false
        };

        const rootElement = scheduler.getElement();

        const pointer = pointerMock($(rootElement).find(CLASSES.appointment).eq(0)).start().down().move(10, 10);
        $(rootElement).find(CLASSES.dateTableCell).eq(2).trigger(dragEvents.enter);
        pointer.up();

        const dataSourceItem = scheduler.option('dataSource').items()[0];

        assert.deepEqual(dataSourceItem.startDate, updatedItem.startDate, 'New data is correct');
        assert.deepEqual(dataSourceItem.endDate, updatedItem.endDate, 'New data is correct');
    });

    test('Appointment with \'Etc/UTC\' tz should be rendered correctly(T394991)', function(assert) {
        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date('2016-06-25T17:00:00.000Z').getTimezoneOffset() * 60000);
        try {
            const scheduler = createWrapper({
                currentDate: new Date(2016, 5, 25),
                startDayHour: 16,
                views: ['day'],
                currentView: 'day',
                editing: true,
                timeZone: timeZones.Greenwich,
                dataSource: [{
                    text: 'a',
                    startDate: '2016-06-25T17:00:00.000Z',
                    endDate: '2016-06-25T17:30:00.000Z'
                }]
            });

            const rootElement = scheduler.getElement();

            let $appointment = $(rootElement).find(CLASSES.appointment).first();
            const $cell = $(rootElement).find(CLASSES.dateTableCell).eq(6);
            const initialAppointmentHeight = $appointment.outerHeight();

            assert.roughEqual($appointment.position().top, $cell.outerHeight() * 2, 2.001, 'Appointment top is OK');
            assert.roughEqual($appointment.outerHeight(), $cell.outerHeight(), 2.001, 'Appointment height is OK');

            const pointer = pointerMock($appointment).start().down().move(10, 10);
            $cell.trigger(dragEvents.enter);
            pointer.up();

            $appointment = rootElement.find(CLASSES.appointment).first();

            assert.roughEqual($appointment.position().top, $cell.outerHeight() * 6, 2.001, 'Appointment top is OK');
            assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

            const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
            const cellData = dataUtils.data($cell.get(0), 'dxCellData');
            const startDate = cellData.startDate;
            const endDate = new Date(cellData.startDate.getTime() + 30 * 60 * 1000);
            const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

            assert.equal(dateText, resultDate, 'Appointment date is OK');
        } finally {
            tzOffsetStub.restore();
        }
    });

    [5, 'Asia/Calcutta'].forEach(timeZone => {
        test(`Appts should be filtered correctly with custom timeZone='${timeZone}'`, function(assert) {
            const scheduler = createWrapper({
                timeZone,
                dataSource: [{
                    startDate: new Date(Date.UTC(2016, 4, 4, 15)),
                    endDate: new Date(Date.UTC(2016, 4, 7, 15, 30)),
                    text: 'new Date sample'
                }, {
                    startDate: new Date(Date.UTC(2016, 4, 7, 23)),
                    endDate: new Date(Date.UTC(2016, 4, 7, 21, 59)),
                    text: 'The last one'
                }],
                currentDate: new Date(Date.UTC(2016, 4, 7)),
                currentView: 'day',
                firstDayOfWeek: 1
            });

            assert.equal(scheduler.getElement().find(CLASSES.appointment).length, 1, 'Only one appt is rendered');
        });
    });

    test('Appointment should have a correct template with custom timezone(T387040)', function(assert) {
        const clientTzOffset = new Date(2016, 4, 7).getTimezoneOffset() * 60000;

        const scheduler = createWrapper({
            currentDate: new Date(2016, 4, 7),
            views: ['week'],
            currentView: 'week',
            dataSource: []
        });

        scheduler.instance.option('dataSource', [{
            startDate: new Date(Date.UTC(2016, 4, 7, 1)),
            startDateTimeZone: timeZones.Yekaterinburg,
            endDateTimeZone: timeZones.Yekaterinburg,
            endDate: new Date(Date.UTC(2016, 4, 7, 1, 30)),
            text: 'new Date sample'
        }]);

        const $appt = scheduler.getElement().find(CLASSES.appointment);
        const $contentDates = $appt.find('.dx-scheduler-appointment-content-date');
        const expectedStartDate = new Date(new Date(2016, 4, 7, 1).getTime() - clientTzOffset);
        const expectedEndDate = new Date(new Date(2016, 4, 7, 1, 30).getTime() - clientTzOffset);

        const assertText = `${dateLocalization.format(expectedStartDate, 'shorttime')} - ${dateLocalization.format(expectedEndDate, 'shorttime')}`;
        assert.equal($contentDates.first().text(), assertText, 'Date is correct');
    });

    test('Appointment with custom tz should be resized correctly if the scheduler tz is empty(T392414)', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 11, 25),
            views: ['day'],
            currentView: 'day',
            editing: true,
            dataSource: [{
                text: 'a',
                startDate: '2015-12-25T10:00:00.000Z',
                endDate: '2015-12-25T10:15:00.000Z',
                startDateTimeZone: timeZones.Lima, // -5
                endDateTimeZone: timeZones.Lima
            }]
        });

        const rootElement = scheduler.getElement();

        const cellHeight = rootElement.find(CLASSES.dateTableCell).eq(0).outerHeight();
        let $appointment = rootElement.find(CLASSES.appointment).first();
        const initialAppointmentTop = $appointment.position().top;

        const pointer = pointerMock(rootElement.find('.dx-resizable-handle-bottom').eq(0)).start();
        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointment = rootElement.find(CLASSES.appointment).first();

        assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointment.outerHeight(), cellHeight * 2, 2.001, 'Appointment height is OK');
    });

    test('Appointment with custom tz that isn\'t equal to scheduler tz should be dragged correctly(T392414)', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 4, 25),
            startDayHour: 6,
            views: ['day'],
            currentView: 'day',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: timeZones.Phoenix, // -7
            dataSource: [{
                text: 'a',
                startDate: '2015-05-25T17:00:00.000Z',
                endDate: '2015-05-25T17:15:00.000Z',
                startDateTimeZone: timeZones.Lima, // -5
                endDateTimeZone: timeZones.Lima
            }]
        });

        const rootElement = scheduler.getElement();

        let $appointment = $(rootElement).find(CLASSES.appointment).first();
        const $cell = $(rootElement).find(CLASSES.dateTableCell).eq(6);
        const initialAppointmentHeight = $appointment.outerHeight();

        const pointer = pointerMock($appointment).start().down().move(10, 10);
        $cell.trigger(dragEvents.enter);
        pointer.up();

        $appointment = rootElement.find(CLASSES.appointment).first();


        assert.roughEqual($appointment.position().top, $cell.outerHeight() * 6, 2.001, 'Appointment top is OK');
        assert.equal($appointment.outerHeight(), initialAppointmentHeight, 'Appointment height is OK');

        const dateText = $appointment.find('.dx-scheduler-appointment-content-date').eq(0).text();
        const cellData = dataUtils.data($cell.get(0), 'dxCellData');
        const startDate = cellData.startDate;
        const endDate = new Date(cellData.startDate.getTime() + 15 * 60 * 1000);
        const resultDate = `${dateLocalization.format(startDate, 'shorttime')} - ${dateLocalization.format(endDate, 'shorttime')}`;

        assert.equal(dateText, resultDate, 'Appointment date is OK');
    });

    test('Scheduler should not update scroll position if appointment is visible, when timeZone is set ', function(assert) {
        const scheduler = createWrapper({
            startDayHour: 3,
            endDayHour: 10,
            currentDate: new Date(Date.UTC(2015, 1, 9)).toJSON(),
            dataSource: [],
            currentView: 'week',
            height: 500,
            timeZone: 'Asia/Ashkhabad',
            width: 1000,
        });

        const workSpace = scheduler.instance.getWorkSpace();

        try {
            scheduler.instance.getWorkSpaceScrollable().scrollBy(190);

            const appointment = {
                startDate: new Date(Date.UTC(2015, 1, 9, 3)).toJSON(),
                endDate: new Date(Date.UTC(2015, 1, 9, 3, 30)).toJSON(),
                text: 'caption'
            };

            const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

            scheduler.instance.showAppointmentPopup(appointment);
            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

            assert.notOk(scrollToSpy.calledOnce, 'scrollTo was not called');
        } finally {
            workSpace.scrollTo.restore();
        }
    });

    test('Scheduler should update scroll position if appointment was added to invisible bottom area, timezone is set', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 9),
            dataSource: new DataSource({
                store: []
            }),
            currentView: 'week',
            height: 300,
            timezone: 'Asia/Ashkhabad'
        });

        const appointment = {
            startDate: new Date(2015, 1, 9, 21),
            endDate: new Date(2015, 1, 9, 22),
            text: 'caption 2'
        };
        const workSpace = scheduler.instance.getWorkSpace();
        const scrollToSpy = sinon.spy(workSpace, 'scrollTo');

        try {
            scheduler.instance.showAppointmentPopup(appointment);
            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

            assert.ok(scrollToSpy.calledOnce, 'scrollTo was called');
        } finally {
            workSpace.scrollTo.restore();
        }
    });

    test('Appts should be filtered correctly if there is a custom tz and start day hour is not 0', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                startDate: '2015-05-27T23:00:00+01:00',
                endDate: '2015-05-28T00:00:00+01:00',
                text: 'a'
            }, {
                startDate: '2015-05-26T18:30:00+01:00',
                endDate: '2015-05-26T20:30:00+01:00',
                text: 'b'
            }],
            startDayHour: 7,
            currentDate: new Date(2015, 4, 25),
            timeZone: -8,
            height: 500,
            currentView: 'week',
            firstDayOfWeek: 1
        });

        const $element = scheduler.getElement();
        let $appt = $element.find(CLASSES.appointment);
        const cellHeight = $element.find(CLASSES.dateTableCell).eq(0).get(0).getBoundingClientRect().height;
        const apptPosition = translator.locate($appt.eq(0));
        const clientTzOffset = new Date('2015-05-27T23:00:00+01:00').getTimezoneOffset() / 60;

        const cellsCount = (new Date(
            new Date('2015-05-27T23:00:00+01:00').setHours(
                new Date('2015-05-27T23:00:00+01:00').getHours() + clientTzOffset - 8)).getHours() - 7) * 2;

        assert.equal($appt.length, 2, 'Appts are OK');
        assert.roughEqual(apptPosition.top, cellHeight * cellsCount, 2.001, 'Appt top offset is OK');

        scheduler.option({
            currentView: 'day',
            currentDate: new Date(2015, 4, 26)
        });

        $appt = $element.find(CLASSES.appointment);
        assert.equal($appt.length, 1, 'Appts are OK on the Day view');
    });

    test('Recurring appointment icon should be visible on the month view', function(assert) {
        const scheduler = createWrapper({
            dataSource: [
                {
                    text: 'Appt',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 10),
                    recurrenceRule: 'FREQ=DAILY'
                }
            ],
            currentDate: new Date(2015, 1, 9),
            timeZone: timeZones.LosAngeles,
            views: ['month'],
            currentView: 'month',
            height: 800
        });

        const $appointment = $(scheduler.getElement()).find(CLASSES.appointment).eq(0);
        const $recurringIcon = $appointment.find('.dx-scheduler-appointment-recurrence-icon');

        assert.ok($recurringIcon.parent().hasClass('dx-scheduler-appointment-content'), 'Recurring icon is visible');
    });

    test('Appointment should have a correct template with custom timezone', function(assert) {
        const tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(new Date(2016, 4, 7, 5).getTimezoneOffset() * 60000);

        try {
            const scheduler = createWrapper({
                currentDate: new Date(2016, 4, 7),
                startDayHour: 7,
                views: ['day'],
                currentView: 'day',
                dataSource: [
                    {
                        startDate: new Date(Date.UTC(2016, 4, 7, 5)),
                        startDateTimeZone: 'Asia/Qyzylorda', // +6:00
                        endDateTimeZone: 'Asia/Qyzylorda',
                        endDate: new Date(Date.UTC(2016, 4, 7, 5, 30)),
                        text: 'new Date sample'
                    }
                ],
                timeZone: 'Asia/Ashkhabad'// +5:00
            });

            const $appt = scheduler.getElement().find(CLASSES.appointment);
            const $contentDates = $appt.find('.dx-scheduler-appointment-content-date');

            assert.equal($contentDates.first().text(), '10:00 AM - 10:30 AM', 'Date is correct');

        } finally {
            tzOffsetStub.restore();
        }
    });

    [{
        startDate: new Date(2015, 1, 4, 5),
        endDate: new Date(2015, 1, 4, 7),
        recurrenceRule: 'FREQ=DAILY',
        timeZone: 5,
        timeZoneNumber: 5
    }, {
        startDate: new Date(2015, 1, 4, 5),
        endDate: new Date(2015, 1, 4, 7),
        recurrenceRule: 'FREQ=DAILY',
        timeZone: 'Asia/Ashkhabad',
        timeZoneNumber: 5
    }, {
        startDate: new Date(2015, 1, 4, 5),
        endDate: new Date(2015, 1, 4, 6),
        startDateTimezone: 'Asia/Ashkhabad',
        timeZone: 'Asia/Qyzylorda',
        timeZoneNumber: 6
    }].forEach(({ startDate, endDate, timeZone, startDateTimezone, recurrenceRule, timeZoneNumber }) => {
        test('Appointment should be rendered correctly when custom timezone was set', function(assert) {
            const appointments = [{
                startDate: startDate.toString(),
                endDate: endDate.toString(),
                text: 'abc',
                startDateTimezone,
                recurrenceRule
            }];

            const scheduler = createWrapper({
                timeZone,
                currentDate: new Date(2015, 1, 4),
                views: ['day'],
                currentView: 'day',
                firstDayOfWeek: 1,
                dataSource: appointments
            });

            const $appointment = scheduler.getElement().find(CLASSES.appointment).eq(0);

            const deltaTz = getDeltaTz(timeZoneNumber, startDate);
            const resultDate = `${dateLocalization.format(new Date(startDate.getTime() + deltaTz), 'shorttime')} - ${dateLocalization.format(new Date(endDate.getTime() + deltaTz), 'shorttime')}`;

            assert.equal($appointment.find('.dx-scheduler-appointment-content-date').eq(0).text(), resultDate, 'Date is correct on init');
            assert.equal($appointment.find('.dx-scheduler-appointment-content div').eq(0).text(), 'abc', 'Text is correct on init');
            if(recurrenceRule) {
                assert.equal($appointment.find('.dx-scheduler-appointment-recurrence-icon').length, 1, 'Recurrence icon is rendered');
            }
        });
    });

    test('All-day Appointment should be rendered correctly when custom timezone was set', function(assert) {
        const timezone = 5;
        const timezoneDifference = getDeltaTz(timezone, new Date(2016, 4, 4));
        const startDate = new Date(new Date(2016, 4, 4).getTime() - timezoneDifference);
        const endDate = new Date(new Date(2016, 4, 5).getTime() - timezoneDifference);

        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2016, 4, 3),
            timeZone: 'Asia/Ashkhabad',
            dataSource: [{
                startDate: startDate,
                endDate: endDate
            }]
        });

        const rootElement = scheduler.getElement();
        const apptWidth = rootElement.find(CLASSES.appointment).first().outerWidth();
        const cellWidth = rootElement.find(CLASSES.allDayTableCell).first().outerWidth();

        assert.roughEqual(apptWidth, cellWidth, 2.001, 'Appt width is OK');
    });
});

module('Appointment popup', moduleConfig, () => {
    const getDeltaTz = (schedulerTz, date) => {
        const defaultTz = date.getTimezoneOffset() * 60000;
        return schedulerTz * 3600000 + defaultTz;
    };

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
                const scheduler = createScheduler({ timeZone: timeZones.NewYork }); // -4 offset

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

    [5, 'Asia/Ashkhabad'].forEach(timeZone => {
        test(`Appointment startDate and endDate should be correct in the details view, if custom timeZone='${timeZone}' is setting`,
            function(assert) {
                const startDate = new Date(2015, 3, 11, 11);
                const endDate = new Date(2015, 3, 11, 11, 30);

                const appointment = {
                    text: 'Task 1',
                    Start: startDate,
                    End: endDate
                };

                const scheduler = createWrapper({
                    timeZone,
                    dataSource: new DataSource({
                        store: [appointment]
                    }),
                    currentDate: new Date(2015, 3, 23),
                    startDateExpr: 'Start',
                    endDateExpr: 'End'
                });


                scheduler.instance.showAppointmentPopup(appointment);

                const detailsForm = scheduler.instance.getAppointmentDetailsForm();
                const formData = detailsForm.option('formData');
                const deltaTz = getDeltaTz(5, startDate);

                assert.deepEqual(formData.Start, new Date(startDate.getTime() + deltaTz), 'start date is correct');
                assert.deepEqual(formData.End, new Date(endDate.getTime() + deltaTz), 'end date is correct');
            });
    });

    test('Appointment startDate and endDate should be correct in the details view for new appointment, if custom timeZone was set',
        function(assert) {
            const scheduler = createWrapper({
                dataSource: new DataSource({
                    store: []
                }),
                currentDate: new Date(2015, 3, 23),
                startDateExpr: 'Start',
                endDateExpr: 'End',
                timeZone: 'Asia/Calcutta'
            });

            pointerMock(scheduler.getElement().find(CLASSES.dateTableCell).eq(22)).start().click().click();

            const detailsForm = scheduler.instance.getAppointmentDetailsForm();
            const formData = detailsForm.option('formData');

            assert.deepEqual(formData.Start, new Date(2015, 3, 23, 11), 'start date is correct');
            assert.deepEqual(formData.End, new Date(2015, 3, 23, 11, 30), 'end date is correct');
        });

    test('Appointment date correction should be rollback after closing popup, if custom timeZone was set as string', function(assert) {
        const updatedItem = {
            text: 'Task 1',
            startDate: new Date(2015, 1, 7, 1),
            endDate: new Date(2015, 1, 7, 2)
        };
        const data = new DataSource({
            store: [updatedItem]
        });

        const scheduler = createWrapper({
            currentView: 'week',
            currentDate: new Date(2015, 1, 7),
            dataSource: data,
            timeZone: 'Asia/Calcutta'
        });

        const updateAppointment = sinon.spy(scheduler.instance, 'updateAppointment');

        try {
            scheduler.instance.showAppointmentPopup(updatedItem);

            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');

            assert.ok(updateAppointment.calledOnce, 'Update method is called');
            assert.deepEqual(updateAppointment.getCall(0).args[0], updatedItem, 'Target item is correct');
            assert.deepEqual(updateAppointment.getCall(0).args[1], updatedItem, 'New data is correct');
        } finally {
            updateAppointment.restore();
        }
    });
});

module('Fixed client time zone offset', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
        this.tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
        fx.off = true;
    },

    afterEach() {
        this.clock.restore();
        this.tzOffsetStub.restore();
        fx.off = false;
    }
}, () => {
    test('Appointment should have right width in workspace with timezone', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            currentDate: new Date(2017, 4, 1),
            currentView: 'month',
            firstDayOfWeek: 1,
            startDayHour: 3,
            endDayHour: 24,
            timeZone: 'Asia/Ashkhabad',
            height: 600
        });

        scheduler.instance.addAppointment({
            text: 'Task 1',
            startDate: new Date(2017, 4, 4),
            endDate: new Date(2017, 4, 5)
        });

        const rootElement = scheduler.instance.$element();
        const $appointment = $(rootElement).find(CLASSES.appointment).eq(0);
        const $cell = $(rootElement).find(CLASSES.dateTableCell).eq(9);

        assert.roughEqual($appointment.outerWidth(), $cell.outerWidth() * 2, 2.001, 'Task has a right width');
    });

    test('Appointments should have correct size with custom time zone & hourly bounds', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 4, 25),
            startDayHour: 8,
            endDayHour: 18,
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: [{
                text: 'Approve New Online Marketing Strategy',
                startDate: new Date(2015, 4, 25, 8),
                endDate: new Date(2015, 4, 25, 12),
                startDateTimeZone: 'Africa/Brazzaville',
                endDateTimeZone: 'Africa/Brazzaville'
            }, {
                text: 'Stand-up meeting',
                startDate: new Date(2015, 4, 25, 18),
                endDate: new Date(2015, 4, 25, 20),
                startDateTimeZone: 'Africa/Brazzaville',
                endDateTimeZone: 'Africa/Brazzaville'
            }],
            timeZone: 'Africa/Brazzaville' // +1
        });

        const rootElement = scheduler.getElement();

        const $appointments = rootElement.find(CLASSES.appointment);
        const $first = $appointments.eq(0);
        const $second = $appointments.eq(1);
        const cellHeight = rootElement.find(CLASSES.dateTableCell).eq(0).outerHeight();

        assert.roughEqual($first.outerHeight(), cellHeight * 4, 2.001, 'Appointment height is correct');
        assert.roughEqual($second.outerHeight(), cellHeight * 4, 2.001, 'Appointment height is correct');

        assert.equal($first.find('.dx-scheduler-appointment-content-date').eq(0).text(), '6:00 AM - 10:00 AM', 'First appointment is correct');
        assert.equal($second.find('.dx-scheduler-appointment-content-date').eq(0).text(), '4:00 PM - 6:00 PM', 'Second appointment is correct');
    });

    test('Appointment should be rendered correctly if timeZones is changed', function(assert) {
        const appointments = [{
            startDate: new Date(2015, 1, 4, 5).toString(),
            endDate: new Date(2015, 1, 4, 6).toString(),
            text: 'abc'
        }];

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: appointments,
            startDayHour: 5,
            timeZone: 3
        });

        scheduler.instance.option('timeZone', 4);

        const rootElement = scheduler.instance.$element();
        const $appointment = $(rootElement).find(CLASSES.appointment).eq(0);
        const cellHeight = rootElement.find(CLASSES.dateTableCell).eq(0).outerHeight();

        assert.roughEqual($appointment.position().top, cellHeight * 2, 2.001, 'Appointment top is correct');
    });

    test('Appointment should be rendered correctly when appointment timeZone was set', function(assert) {
        const appointments = [{
            startDate: new Date(2015, 1, 4, 5).toString(),
            startDateTimeZone: 'Asia/Calcutta', // +05:30
            endDateTimeZone: 'Asia/Calcutta',
            endDate: new Date(2015, 1, 4, 6).toString(),
            text: 'abc'
        }];

        const scheduler = createWrapper({
            currentDate: new Date(2015, 1, 4),
            views: ['day'],
            currentView: 'day',
            firstDayOfWeek: 1,
            dataSource: appointments
        });
        const cellHeight = scheduler.workSpace.getCellHeight();
        const resultDate = `${dateLocalization.format(new Date(2015, 1, 4, 5), 'shorttime')} - ${dateLocalization.format(new Date(2015, 1, 4, 6), 'shorttime')}`;

        assert.equal(scheduler.appointments.getDateText(), resultDate, 'Appointment content has correct dates');
        assert.deepEqual(scheduler.appointments.getAppointmentPosition(), {
            top: 10 * cellHeight,
            left: 100
        }, 'Appointment is rendered in right cell');
    });

    test('AllDay appointment with custom timezone should be resized correctly', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            // eslint-disable-next-line spellcheck/spell-checker
            timeZone: timeZones.Araguaina, // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 8, 10),
                endDate: new Date(2015, 5, 10, 1),
                allDay: true
            }]
        });

        const rootElement = scheduler.getElement();

        const cellWidth = rootElement.find(CLASSES.dateTableCell).eq(0).get(0).getBoundingClientRect().width;
        let $appointment = rootElement.find(CLASSES.appointment);

        const pointer = pointerMock(rootElement.find('.dx-resizable-handle-right').eq(0)).start();

        pointer.dragStart().drag(cellWidth, 0);
        pointer.dragEnd();

        $appointment = rootElement.find(CLASSES.appointment).eq(0);

        assert.roughEqual($appointment.outerWidth(), cellWidth * 3, 2.001, 'Appointment width is OK');
    });

    test('Arguments in event args should be correct when timezone is set(T579457)', function(assert) {
        const appointment = {
            startDate: new Date('2017-11-22T14:30:00.000Z'),
            endDate: new Date('2017-11-22T15:00:00.000Z'),
            allDay: false,
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
            text: ''
        };

        const scheduler = createWrapper({
            currentDate: new Date(2017, 10, 22),
            views: ['week'],
            currentView: 'week',
            firstDayOfWeek: 1,
            onAppointmentClick: function(args) {
                assert.equal(args.appointmentData.startDate.getTime(), args.targetedAppointmentData.startDate.getTime(), 'Arguments are OK');
                assert.equal(args.appointmentData.endDate.getTime(), args.targetedAppointmentData.endDate.getTime(), 'Arguments are OK');
            },
            timeZone: timeZones.UTC,
            dataSource: [appointment]
        });

        const $appointment = $(scheduler.getElement()).find(CLASSES.appointment).eq(0);
        $appointment.trigger('dxclick');
    });

    test('Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly(T390801)', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            // eslint-disable-next-line spellcheck/spell-checker
            timeZone: timeZones.Araguaina, // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 12, 10).toString(),
                endDate: new Date(2015, 5, 12, 12).toString(),
                recurrenceRule: 'FREQ=DAILY',
                startDateTimeZone: timeZones.Lima, // -5
                endDateTimeZone: timeZones.Lima
            }]
        });

        const rootElement = scheduler.getElement();

        const cellHeight = rootElement.find(CLASSES.dateTableCell).eq(0).get(0).getBoundingClientRect().height;
        let $appointments = rootElement.find(CLASSES.appointment);
        const initialAppointmentTop = $appointments.eq(0).position().top;

        const pointer = pointerMock(rootElement.find('.dx-resizable-handle-bottom').eq(0)).start();

        pointer.dragStart().drag(0, cellHeight);
        pointer.dragEnd();

        $appointments = rootElement.find(CLASSES.appointment);

        assert.equal($appointments.length, 2, 'Appointment count is OK');
        assert.equal($appointments.eq(1).position().top, initialAppointmentTop, 'Appointment top is OK');
        assert.roughEqual($appointments.eq(1).outerHeight(), cellHeight * 5, 2.001, 'Appointment height is OK');
    });

    [{
        appointment: {
            text: 'Stand-up meeting',
            startDate: new Date(2016, 5, 7, 9),
            endDate: new Date(2016, 5, 7, 10),
            startDateTimeZone: timeZones.Moscow, // +3
            endDateTimeZone: timeZones.Moscow,
            recurrenceRule: 'FREQ=DAILY'
        },
        currentDate: new Date(2016, 5, 7),
        text: 'Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be opened correctly'
    }, {
        appointment: {
            text: 'Stand-up meeting',
            startDate: '2015-05-25T15:30:00.000Z',
            endDate: '2015-05-25T15:45:00.000Z',
            startDateTimeZone: timeZones.Phoenix, // -7
            endDateTimeZone: timeZones.Phoenix,
            recurrenceRule: 'FREQ=DAILY'
        },
        currentDate: new Date(2015, 4, 25),
        text: 'Recurrence appointment with the same custom timezones should be opened correctly'
    }].forEach(({ appointment, text, currentDate }) => {
        test(`${text}(T390801)`, function(assert) {
            const scheduler = createWrapper({
                currentDate,
                views: ['week'],
                currentView: 'week',
                firstDayOfWeek: 1,
                recurrenceEditMode: 'occurrence',
                timeZone: timeZones.Phoenix, // -7
                dataSource: [appointment]
            });

            const $appointment = $(scheduler.getElement()).find(CLASSES.appointment).eq(1);

            $appointment.trigger('dxdblclick');
            const initialPosition = $appointment.position();

            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
            const updatedPosition = $(scheduler.getElement()).find(CLASSES.appointment).not('.dx-scheduler-appointment-recurrence').position();

            assert.equal(updatedPosition.top, initialPosition.top, 'Top is updated correctly');
            assert.equal(updatedPosition.left, initialPosition.left, 'Left is updated correctly');
        });
    });

    [{
        timeZone: timeZones.Phoenix,
        appointmentTimeZone: timeZones.Lima,
        text: 'Appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly'
    }, {
        timeZone: timeZones.Lima,
        appointmentTimeZone: timeZones.Lima,
        text: 'Appointment with custom tz that is equal to scheduler tz should be resized correctly'
    }].forEach(testCase => {
        test(`${testCase.text}(T392414)`, function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 25),
                views: ['week'],
                currentView: 'week',
                editing: true,
                recurrenceEditMode: 'occurrence',
                timeZone: testCase.timeZone,
                dataSource: [{
                    text: 'a',
                    startDate: '2015-05-25T17:00:00.000Z',
                    endDate: '2015-05-25T17:15:00.000Z',
                    startDateTimeZone: testCase.appointmentTimeZone,
                    endDateTimeZone: testCase.appointmentTimeZone
                }]
            });

            const rootElement = scheduler.instance.$element();

            const cellHeight = rootElement.find(CLASSES.dateTableCell).eq(0).outerHeight();
            let $appointment = rootElement.find(CLASSES.appointment).first();
            const initialAppointmentTop = $appointment.position().top;

            const pointer = pointerMock(rootElement.find('.dx-resizable-handle-bottom').eq(0)).start();
            pointer.dragStart().drag(0, cellHeight);
            pointer.dragEnd();

            $appointment = rootElement.find(CLASSES.appointment).first();

            assert.equal($appointment.position().top, initialAppointmentTop, 'Appointment top is OK');
            assert.roughEqual($appointment.outerHeight(), cellHeight * 2, 2.001, 'Appointment height is OK');

        });
    });

    test('DropDown appointment should be rendered correctly when timezone is set', function(assert) {
        const data = [
            {
                schedule: 'Appointment 1',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 2',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 3',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 4',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 5',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            },
            {
                schedule: 'Appointment 6',
                startDate: new Date(2018, 8, 17, 1),
                endDate: new Date(2018, 8, 17, 2)
            }
        ];

        const scheduler = createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2018, 8, 17),
            timeZone: timeZones.UTC,
            showCurrentTimeIndicator: false,
            maxAppointmentsPerCell: 1,
            height: 600,
            textExpr: 'schedule'
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getDateText(), 'September 16 10:00 PM - 11:00 PM', 'Dates are correct');
    });

    test('Appts should be filtered correctly if there is a custom tz and start day hour is not 0(T396719)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'Stand-up meeting',
                startDate: new Date(2015, 4, 25, 17),
                endDate: new Date(2015, 4, 25, 17, 30),
                startDateTimeZone: timeZones.Lima, // -5
                endDateTimeZone: timeZones.Lima
            }],
            startDayHour: 10,
            currentDate: new Date(2015, 4, 25),
            timeZone: timeZones.Dawson_Creek, // -7
            height: 500,
            currentView: 'week',
            firstDayOfWeek: 1
        });

        const apptCount = scheduler.getElement().find(CLASSES.appointment).length;

        assert.equal(apptCount, 0, 'There are not appts');
    });

});
