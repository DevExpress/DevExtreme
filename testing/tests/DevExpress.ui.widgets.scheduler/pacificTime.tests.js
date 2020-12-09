import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'animation/fx';
import browser from 'core/utils/browser';

import 'ui/scheduler/ui.scheduler';
import 'generic_light.css!';

const { testStart, module, test } = QUnit;

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
            recurrenceException: '20200311T090000Z'
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
            recurrenceException: '20200311T090000Z'
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
            recurrenceException: '20200311T100000Z'
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
            recurrenceException: '20201102T080000Z'
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
            recurrenceException: '20201102T080000Z'
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
            recurrenceException: '20201102T090000Z'
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
                scheduler.appointmentPopup.dialog.clickEditAppointment();

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

        module('timeCellTemplate', () => {
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

            testCases.forEach(testCase => {
                test(`arguments should be valid in '${testCase.view}' view`, function(assert) {
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
                        height: 600
                    });

                    assert.expect(expectedAllTimes.length * 2);
                });
            });
        });

        module('Time panel render(T852308, T860281)', () => {
            testCases.forEach(testCase => {
                test(`Time value in time panel should be correct in ${testCase.view}`, function(assert) {
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
            });
        });
    });

    module('Common', moduleConfig, () => {
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
                    test(`Today in calendar should be equal with today in grid, view='${currentView}' timeZone='${timeZone}' (T946335)`, function(assert) {
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
                test(`Scheduler should be valid display today after change view type, timeZone='${timeZone}'`, function(assert) {
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
