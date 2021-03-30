import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'animation/fx';
import browser from 'core/utils/browser';
import timeZoneUtils from 'ui/scheduler/utils.timeZone';

import 'ui/scheduler/ui.scheduler';
import 'generic_light.css!';

const { testStart, module, test, skip } = QUnit;

const pacificTimezoneOffset = 480; // TODO: Value in ms. Offset (UTC-08:00) Pacific Time (US & Canada)
const summerDSTDate = new Date(2020, 2, 8); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -7 Pacific time)
const winterDSTDate = new Date(2020, 10, 1); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -8 Pacific time)

// This tests run only in (UTC-08:00) Pacific Time (US & Canada)
// For run test locally, change timezone on desktop on (UTC-08:00) Pacific Time (US & Canada)
if(!browser.msie && (new Date(2020, 2, 7)).getTimezoneOffset() === pacificTimezoneOffset) {
    testStart(() => initTestMarkup());
    const moduleConfig = {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
        }
    };

    module('Day light saving time in native JS Date', moduleConfig, () => {
        const testCase1AmTo2AmSummerTime = {
            name: 'Summer time:source appointment from 1:00 AM to 2:00 AM',
            result: [
                '1:00 AM - 2:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
            ],
            startDate: new Date(2020, 2, 7, 1),
            endDate: new Date(2020, 2, 7, 2),
            currentDate: summerDSTDate,
            recurrenceException: '20200311T080000Z'
        };

        const testCase1AmTo3AmSummerTime = {
            name: 'Summer time:source appointment from 1:00 AM to 3:00 AM',
            result: [
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
            ],
            startDate: new Date(2020, 2, 7, 1),
            endDate: new Date(2020, 2, 7, 3),
            currentDate: summerDSTDate,
            recurrenceException: '20200311T080000Z'
        };

        const testCase2AmTo3AmSummerTime = {
            name: 'Summer time:source appointment from 2:00 AM to 3:00 AM',
            result: [
                '2:00 AM - 3:00 AM',
                '3:00 AM - 4:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
            ],
            startDate: new Date(2020, 2, 7, 2),
            endDate: new Date(2020, 2, 7, 3),
            currentDate: summerDSTDate,
            recurrenceException: '20200311T090000Z'
        };

        const testCase1AmTo2AmWinterTime = {
            name: 'Winter time:source appointment from 1:00 AM to 2:00 AM',
            result: [
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
                '1:00 AM - 2:00 AM',
            ],
            startDate: new Date(2020, 9, 25, 1),
            endDate: new Date(2020, 9, 25, 2),
            currentDate: winterDSTDate,
            recurrenceException: '20201102T090000Z'
        };

        const testCase1AmTo3AmWinterTime = {
            name: 'Winter time:source appointment from 1:00 AM to 3:00 AM',
            result: [
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
                '1:00 AM - 3:00 AM',
            ],
            startDate: new Date(2020, 9, 25, 1),
            endDate: new Date(2020, 9, 25, 3),
            currentDate: winterDSTDate,
            recurrenceException: '20201102T090000Z'
        };

        const testCase2AmTo3AmWinterTime = {
            name: 'Winter time:source appointment from 2:00 AM to 3:00 AM',
            result: [
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
                '2:00 AM - 3:00 AM',
            ],
            startDate: new Date(2020, 9, 25, 2),
            endDate: new Date(2020, 9, 25, 3),
            currentDate: winterDSTDate,
            recurrenceException: '20201102T100000Z'
        };

        [
            testCase1AmTo2AmSummerTime,
            testCase1AmTo3AmSummerTime,
            testCase2AmTo3AmSummerTime,
            testCase1AmTo2AmWinterTime,
            testCase1AmTo3AmWinterTime,
            testCase2AmTo3AmWinterTime
        ].forEach(testCase => {
            test(testCase.name, function(assert) {
                const scheduler = createWrapper({
                    dataSource: [{
                        startDate: testCase.startDate,
                        endDate: testCase.endDate,
                        text: 'Test',
                        recurrenceRule: 'FREQ=DAILY',
                    }],
                    views: ['week'],
                    currentView: 'week',
                    recurrenceEditMode: 'occurrence',
                    firstDayOfWeek: 4,
                    currentDate: testCase.currentDate,
                    startDayHour: 0,
                    height: 600,
                    width: 600
                });

                const appointmentCount = scheduler.appointments.getAppointmentCount();

                testCase.result.forEach((expectedText, index) => {
                    const currentText = scheduler.appointments.getDateText(index);
                    assert.equal(currentText, expectedText, `'${currentText}' should be equal expected text`);
                });

                const lastAppointmentIndex = testCase.result.length - 1;
                scheduler.appointments.click(lastAppointmentIndex);

                scheduler.tooltip.clickOnDeleteButton(0);

                const dataSource = scheduler.option('dataSource');
                assert.equal(dataSource[0].recurrenceException, testCase.recurrenceException, 'recurrenceException should be valid');
                assert.equal(scheduler.appointments.getAppointmentCount(), appointmentCount - 1, 'appointment count should be reduced');
            });
        });
    });

    module('Time panel should have correct dates value in case DST', moduleConfig, () => {
        const expectedAllTimes = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM',
            '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM',
            '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
            '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
            '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
            '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
        ];

        const expectedShortTimes = ['12:00 AM', '', '1:00 AM', '', '2:00 AM', '', '3:00 AM', '', '4:00 AM', '', '5:00 AM', '', '6:00 AM', '',
            '7:00 AM', '', '8:00 AM', '', '9:00 AM', '', '10:00 AM', '', '11:00 AM', '', '12:00 PM', '', '1:00 PM', '', '2:00 PM', '', '3:00 PM', '',
            '4:00 PM', '', '5:00 PM', '', '6:00 PM', '', '7:00 PM', '', '8:00 PM', '', '9:00 PM', '', '10:00 PM', '', '11:00 PM', ''
        ];

        const testCases = [
            { view: 'week', times: expectedShortTimes },
            { view: 'day', times: expectedShortTimes },
            { view: 'timelineDay', times: expectedAllTimes },
            { view: 'timelineWeek', times: expectedAllTimes }
        ];

        const expectedDateResults = (() => {
            const result = [];
            let startHours = 0;
            let currentDate = new Date(summerDSTDate);

            while(currentDate.getDate() < 9) {
                result.push(new Date(currentDate));
                startHours += 0.5;
                currentDate = new Date(new Date(summerDSTDate).setHours(startHours - (startHours % 1), startHours % 1 * 60));
            }

            return result;
        })();

        [true, false].forEach((renovateRender) => {
            module('timeCellTemplate', () => {
                testCases.forEach(testCase => {
                    test(`arguments should be valid in '${testCase.view}' view when renovateRender is ${renovateRender}`, function(assert) {
                        let index = 0;

                        createWrapper({
                            dataSource: [],
                            timeCellTemplate: arg => {
                                if(index < expectedAllTimes.length) {
                                    assert.equal(arg.date.valueOf(), expectedDateResults[index].valueOf(), 'arg.date should be valid');
                                    assert.equal(arg.text, testCase.times[index], 'arg.text should be valid');

                                    index++;
                                }
                            },
                            views: testCases.map(testCases => testCases.view),
                            currentView: testCase.view,
                            startDayHour: 0,
                            currentDate: summerDSTDate,
                            height: 600,
                            renovateRender,
                        });

                        assert.expect(expectedAllTimes.length * 2);
                    });

                    test(`template args should be valid in '${testCase.view}' view when startViewDate is during DST change when renovateRender is ${renovateRender}`, function(assert) {
                        let index = 0;

                        const validExpectedDateResults = expectedDateResults.slice(4);
                        const times = testCase.times.slice(4);

                        createWrapper({
                            dataSource: [],
                            timeCellTemplate: ({ date, text }) => {
                                if(index < validExpectedDateResults.length) {
                                    assert.equal(date.valueOf(), validExpectedDateResults[index].valueOf(), 'correct date');
                                    assert.equal(text, times[index], 'correct text');

                                    index++;
                                }
                            },
                            views: testCases.map(testCases => testCases.view),
                            currentView: testCase.view,
                            startDayHour: 2,
                            currentDate: summerDSTDate,
                            height: 600,
                            renovateRender,
                        });

                        assert.expect(times.length * 2);
                    });
                });
            });

            module('dataCellTemplate', () => {
                testCases
                    .map(testCase => {
                        return ({
                            ...testCase,
                            isDivideIndex: testCase.view === 'week',
                        });
                    })
                    .forEach((testCase) => {
                        // TODO: we should decide what startDate we should use for "dead time" - one hour before it or one hour after
                        test(`template args should be valid in '${testCase.view}' view when startViewDate is during DST change when renovateRender is ${renovateRender}`, function(assert) {
                            let index = 0;

                            const validExpectedDateResults = expectedDateResults.slice(4);

                            createWrapper({
                                dataSource: [],
                                dataCellTemplate: ({ startDate, allDay }) => {
                                    if(allDay) {
                                        return undefined;
                                    }

                                    const correctedIndex = testCase.isDivideIndex
                                        ? Math.floor(index / 7)
                                        : index;
                                    const isValidIndex = testCase.isDivideIndex
                                        ? index % 7 === 0
                                        : true;

                                    if(correctedIndex < validExpectedDateResults.length && isValidIndex) {
                                        assert.equal(startDate.valueOf(), validExpectedDateResults[correctedIndex].valueOf(), 'correct date');
                                    }
                                    index++;
                                },
                                views: testCases.map(testCases => testCases.view),
                                currentView: testCase.view,
                                startDayHour: 2,
                                currentDate: summerDSTDate,
                                height: 600,
                                renovateRender,
                            });

                            assert.expect(validExpectedDateResults.length);
                        });
                    });
            });
        });

        module('Time panel render', () => {
            testCases.forEach(testCase => {
                test(`Time value in time panel should be correct in ${testCase.view} (T852308, T860281)`, function(assert) {
                    const scheduler = createWrapper({
                        dataSource: [],
                        views: testCases.map(testCases => testCases.view),
                        currentView: testCase.view,
                        startDayHour: 0,
                        currentDate: summerDSTDate,
                        height: 600
                    });

                    const currentTimeResults = scheduler.timePanel.getTimeValues();

                    assert.ok(currentTimeResults.length >= testCase.times.length, 'Count of current values should not less expected values');
                    for(let i = 0; i < testCase.times.length; i++) {
                        assert.equal(currentTimeResults[i], testCase.times[i], 'Current time value should be equal expected');
                    }

                    assert.expect(testCase.times.length + 1);
                });

                test(`Time value in time panel should be correct in ${testCase.view} when startViewDate is during DST change`, function(assert) {
                    const times = testCase.times.slice(4);

                    const scheduler = createWrapper({
                        dataSource: [],
                        views: testCases.map(testCases => testCases.view),
                        currentView: testCase.view,
                        startDayHour: 2,
                        currentDate: summerDSTDate,
                        height: 600
                    });

                    const currentTimeResults = scheduler.timePanel.getTimeValues();

                    assert.ok(currentTimeResults.length >= times.length, 'Correct number of time values');
                    for(let i = 0; i < times.length; i += 1) {
                        assert.equal(currentTimeResults[i], times[i], 'Current time value should be equal expected');
                    }

                    assert.expect(times.length + 1);
                });
            });
        });
    });

    module('Common', moduleConfig, () => {
        [{
            currentDate: new Date(2021, 2, 14),
            text: 'summer time'
        }, {
            currentDate: new Date(2021, 10, 7),
            text: 'winter time'
        }].forEach(({ currentDate, text }) => {
            test(`If local time zone and scheduler time zone equal by declaration, then should be valid display appointments(skip scheduler timezone engine), ${text}`, function(assert) {
                const etalonDateText = '10:30 AM - 12:00 PM';
                const scheduler = createWrapper({
                    currentDate,
                    timeZone: 'America/Tijuana',
                    dataSource: [{
                        text: 'Website Re-Design Plan',
                        startDate: new Date('2021-02-24T18:30:00.000Z'),
                        endDate: new Date('2021-02-24T20:00:00.000Z'),
                        recurrenceRule: 'FREQ=DAILY'
                    }],
                    views: ['week'],
                    currentView: 'week',
                    firstDayOfWeek: 5,
                    startDayHour: 9,
                    height: 600
                });

                scheduler.appointmentList.forEach(appointment => {
                    assert.equal(appointment.date, etalonDateText, `date of appointment should be equal '${etalonDateText}'`);
                    appointment.click();

                    assert.equal(scheduler.tooltip.getDateText(), etalonDateText, `date of tooltip should be equal '${etalonDateText}'`);
                });

                assert.expect(14);
            });
        });

        [{
            startDate: '2020-05-03T08:00:00.000Z',
            endDate: '2020-05-03T09:00:00.000Z',
            text: 'Test',
            recurrenceRule: 'FREQ=DAILY;UNTIL=20200506T080000Z'
        }, {
            startDate: new Date(2020, 2, 3, 1),
            endDate: new Date(2020, 2, 3, 2),
            text: 'Test',
            recurrenceRule: 'FREQ=DAILY;UNTIL=20200506T010000'
        }].forEach(appointment => {
            test(`UNTIL property should be apply right in case '${appointment.recurrenceRule}'`, function(assert) {
                const scheduler = createWrapper({
                    dataSource: [appointment],
                    views: ['week'],
                    currentView: 'week',
                    width: 900,
                    currentDate: new Date(2020, 4, 8)
                });

                assert.equal(scheduler.appointmentList.length, 4, 'should be render 4 appointments');

                const positions = [100, 214, 328, 442];

                for(let i = 0; i < 4; i++) {
                    const element = scheduler.appointmentList[i].getElement();
                    assert.roughEqual(element.position().left, positions[i], 1, `appointment's position left should be equal ${positions[i]}`);
                }

                assert.expect(5);
            });
        });

        [{
            view: 'day',
            left: 100,
            top: 100,
        }, {
            view: 'week',
            left: 100,
            top: 100,
        }, {
            view: 'timelineDay',
            left: 400,
            top: 26,
        }, {
            view: 'timelineWeek',
            left: 400,
            top: 26,
        }].forEach(({ view, left, top }) => {
            test(`Appointments should be rendered corrrectly when startViewDate is during DST change in ${view}`, function(assert) {
                const scheduler = createWrapper({
                    dataSource: [{
                        startDate: new Date(2020, 2, 8, 3),
                        endDate: new Date(2020, 2, 8, 4),
                    }],
                    views: [view],
                    currentView: view,
                    height: 600,
                    currentDate: summerDSTDate,
                    startDayHour: 2,
                });

                assert.equal(scheduler.appointmentList.length, 1, 'one appointment has been rendered');

                const element = scheduler.appointmentList[0].getElement();

                assert.roughEqual(element.position().left, left, 1, 'correct left position');
                assert.roughEqual(element.position().top, top, 1, 'correct top position');
            });
        });

        test('timeZoneUtils.isEqualLocalTimeZoneByDeclaration should be return right value', function(assert) {
            assert.ok(timeZoneUtils.isEqualLocalTimeZoneByDeclaration('America/Tijuana', new Date(2021, 6, 6)), 'should be return true, both timezone have same declaration');
            assert.ok(timeZoneUtils.isEqualLocalTimeZoneByDeclaration('America/Los_Angeles', new Date(2021, 6, 6)), 'should be return true');
            assert.notOk(timeZoneUtils.isEqualLocalTimeZoneByDeclaration('America/New_York', new Date(2021, 6, 6)), 'should be return false');
        });

        test('timeZoneUtils.isEqualLocalTimeZone should be return right value', function(assert) {
            assert.ok(timeZoneUtils.isEqualLocalTimeZone('America/Tijuana', new Date(2021, 6, 6)), 'should be return true, both timezone have same declaration');
            assert.ok(timeZoneUtils.isEqualLocalTimeZone('America/Los_Angeles', new Date(2021, 6, 6)), 'should be return true');
            assert.notOk(timeZoneUtils.isEqualLocalTimeZone('America/New_York', new Date(2021, 6, 6)), 'should be return false');
        });

        module('Today and current day in calendar', () => {
            const views = ['month', 'week'];

            const schedulerTimeZone = 24 - (new Date()).getTimezoneOffset() / 60; // So that the difference between the local time zone is more than a day

            const getTodayValue = (offset = 0) => {
                const currentDate = new Date();
                return (new Date(currentDate.setDate(currentDate.getDate() + offset))).getDate();
            };

            const getViewToday = (scheduler, view) => {
                if(view === 'month') {
                    return scheduler.workSpace.getMonthCurrentDay();
                }
                if(view === 'week') {
                    return scheduler.workSpace.getWeekCurrentDay();
                }
                new Error('Invalid view type');
            };

            views.forEach(currentView => {
                [{
                    timeZone: undefined,
                    today: getTodayValue()
                }, {
                    timeZone: schedulerTimeZone,
                    today: getTodayValue(1)
                }].forEach(({ timeZone, today }) => {
                    skip(`Today in calendar should be equal with today in grid, view='${currentView}' timeZone='${timeZone}' (T946335)`, function(assert) {
                        const scheduler = createWrapper({
                            timeZone,
                            currentView,
                            views,
                            dataSource: [],
                            height: 600
                        });

                        assert.equal(getViewToday(scheduler, currentView), today, 'Grid\'s today value should be valid');

                        const { navigator } = scheduler.header;
                        navigator.caption.click();

                        const calendarToday = navigator.popover.calendar.today.value;

                        assert.equal(calendarToday, today, 'Calendar\'s today value should be valid');
                    });
                });
            });

            [{
                timeZone: undefined,
                expectedToday: getTodayValue()
            }, {
                timeZone: schedulerTimeZone,
                expectedToday: getTodayValue(1)
            }].forEach(({ timeZone, expectedToday }) => {
                skip(`Scheduler should be valid display today after change view type, timeZone='${timeZone}'`, function(assert) {
                    const scheduler = createWrapper({
                        timeZone,
                        views,
                        currentView: 'month',
                        dataSource: [],
                        height: 600
                    });

                    const { navigator } = scheduler.header;
                    const { calendar } = navigator.popover;

                    views.forEach(currentView => {
                        scheduler.option('currentView', currentView);

                        assert.equal(getViewToday(scheduler, currentView), expectedToday, `Grid's today value should be valid after set '${currentView}' view`);

                        navigator.caption.click();

                        assert.equal(calendar.today.value, expectedToday, `Calendar's today value should be valid after set '${currentView}' view`);

                        navigator.caption.click(); // for hide calendar
                    });
                });
            });
        });

        test('onAppointmentFormOpening should have correct dates on new appointment when custom timezone(T862350)', function(assert) {
            const assertDate = new Date(2015, 0, 25, 2, 0);
            const scheduler = createWrapper({
                height: 600,
                dataSource: [],
                timeZone: 'Etc/UTC',
                views: ['day'],
                currentView: 'day',
                startDayHour: 10,
                endDayHour: 16,
                currentDate: assertDate,
                onAppointmentAdding: e => {
                    assert.deepEqual(e.appointmentData.startDate, assertDate, 'onAppointmentAdding has correct date');
                },
                onAppointmentFormOpening: e => {
                    assert.deepEqual(e.appointmentData.startDate, assertDate, 'onAppointmentFormOpening has correct date');
                }
            });

            pointerMock(scheduler.workSpace.getCell(0, 0)).start().click().click();
            scheduler.appointmentPopup.clickDoneButton();

            assert.expect(2);
        });
    });
}
