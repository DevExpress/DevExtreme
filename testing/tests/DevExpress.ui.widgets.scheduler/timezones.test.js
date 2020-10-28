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
import { DataSource } from 'data/data_source/data_source';

const { testStart, test, module } = QUnit;

const timeZones = {
    LosAngeles: 'America/Los_Angeles',
    NewYork: 'America/New_York'
};

testStart(() => initTestMarkup());

const getDeltaTz = (schedulerTz, date) => { // TODO
    const defaultTz = date.getTimezoneOffset() * 60000;
    return schedulerTz * 3600000 + defaultTz;
};

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
    test('New added appointment should be rendered correctly in specified timeZone', function(assert) {
        const scheduler = createWrapper({
            dataSource: [],
            currentDate: new Date(2018, 4, 25),
            views: ['week'],
            currentView: 'week',
            timeZone: 'Etc/UTC'
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

            assert.equal(scheduler.root.getElement().find(CLASSES.appointment).length, 1, 'Only one appt is rendered');
        });
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

        const $element = scheduler.root.getElement();
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

    test('Appts should be filtered correctly if there is a custom tz and start day hour is not 0(T396719)', function(assert) {
        const scheduler = createWrapper({
            dataSource: [{
                text: 'Stand-up meeting',
                startDate: new Date(2015, 4, 25, 17),
                endDate: new Date(2015, 4, 25, 17, 30),
                startDateTimeZone: 'America/Lima', // -5
                endDateTimeZone: 'America/Lima'
            }],
            startDayHour: 10,
            currentDate: new Date(2015, 4, 25),
            timeZone: 'America/Dawson_Creek', // -7
            height: 500,
            currentView: 'week',
            firstDayOfWeek: 1
        });

        const apptCount = scheduler.root.getElement().find(CLASSES.appointment).length;

        assert.equal(apptCount, 0, 'There are not appts');
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
            timeZone: 'America/Los_Angeles',
            views: ['month'],
            currentView: 'month',
            height: 800
        });

        // this.clock.tick(); TODO

        const $appointment = $(scheduler.root.getElement()).find(CLASSES.appointment).eq(0);
        const $recurringIcon = $appointment.find('.dx-scheduler-appointment-recurrence-icon');

        assert.ok($recurringIcon.parent().hasClass('dx-scheduler-appointment-content'), 'Recurring icon is visible');
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
});

const oldModuleConfig = {
    beforeEach() {
        this.clock = sinon.useFakeTimers();

        fx.off = true;
        this.tzOffsetStub = sinon.stub(subscribes, 'getClientTimezoneOffset').returns(-10800000);
    },

    afterEach() {
        this.clock.restore(); // TODO

        fx.off = false;
        this.tzOffsetStub.restore();
    }
};

module('Oll tests', oldModuleConfig, () => {
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

        const rootElement = scheduler.root.getElement();

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
            timeZone: 'America/Araguaina', // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 8, 10),
                endDate: new Date(2015, 5, 10, 1),
                allDay: true
            }]
        });

        const rootElement = scheduler.root.getElement();

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
            timeZone: 'Etc/UTC',
            dataSource: [appointment]
        });

        const $appointment = $(scheduler.root.getElement()).find(CLASSES.appointment).eq(0);
        $appointment.trigger('dxclick');
    });

    test('Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly(T390801)', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 5, 12),
            views: ['week'],
            currentView: 'week',
            editing: true,
            recurrenceEditMode: 'occurrence',
            timeZone: 'America/Araguaina', // -3
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 5, 12, 10).toString(),
                endDate: new Date(2015, 5, 12, 12).toString(),
                recurrenceRule: 'FREQ=DAILY',
                startDateTimeZone: 'America/Lima', // -5
                endDateTimeZone: 'America/Lima'
            }]
        });

        const rootElement = scheduler.root.getElement();

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
            startDateTimeZone: 'Europe/Moscow', // +3
            endDateTimeZone: 'Europe/Moscow',
            recurrenceRule: 'FREQ=DAILY'
        },
        currentDate: new Date(2016, 5, 7),
        text: 'Recurrence appointment with custom tz that isn\'t equal to scheduler tz should be opened correctly'
    }, {
        appointment: {
            text: 'Stand-up meeting',
            startDate: '2015-05-25T15:30:00.000Z',
            endDate: '2015-05-25T15:45:00.000Z',
            startDateTimeZone: 'America/Phoenix', // -7
            endDateTimeZone: 'America/Phoenix',
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
                timeZone: 'America/Phoenix', // -7
                dataSource: [appointment]
            });

            const $appointment = $(scheduler.root.getElement()).find(CLASSES.appointment).eq(1);

            $appointment.trigger('dxdblclick');
            const initialPosition = $appointment.position();

            $('.dx-scheduler-appointment-popup .dx-popup-done').trigger('dxclick');
            const updatedPosition = $(scheduler.root.getElement()).find(CLASSES.appointment).not('.dx-scheduler-appointment-recurrence').position();

            assert.equal(updatedPosition.top, initialPosition.top, 'Top is updated correctly');
            assert.equal(updatedPosition.left, initialPosition.left, 'Left is updated correctly');
        });
    });

    [{
        timeZone: 'America/Phoenix',
        appointmentTimeZone: 'America/Lima',
        text: 'Appointment with custom tz that isn\'t equal to scheduler tz should be resized correctly'
    }, {
        timeZone: 'America/Lima',
        appointmentTimeZone: 'America/Lima',
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
            timeZone: 'Etc/UTC',
            showCurrentTimeIndicator: false,
            maxAppointmentsPerCell: 1,
            height: 600,
            textExpr: 'schedule'
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getDateText(), 'September 16 10:00 PM - 11:00 PM', 'Dates are correct');
    });
});
