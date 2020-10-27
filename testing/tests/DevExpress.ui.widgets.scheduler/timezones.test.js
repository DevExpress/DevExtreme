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
