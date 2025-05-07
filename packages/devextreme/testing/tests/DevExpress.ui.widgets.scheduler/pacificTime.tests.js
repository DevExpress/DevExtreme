import { initTestMarkup, createWrapper, isDesktopEnvironment, CLASSES } from '../../helpers/scheduler/helpers.js';
import pointerMock from '../../helpers/pointerMock.js';
import fx from 'common/core/animation/fx';
import timeZoneUtils from '__internal/scheduler/m_utils_time_zone';
import { getRecurrenceProcessor } from '__internal/scheduler/m_recurrence';

import '__internal/scheduler/m_scheduler';
import 'generic_light.css!';

const { testStart, module, test, skip } = QUnit;

const pacificTimezoneOffset = 480; // TODO: Value in ms. Offset (UTC-08:00) Pacific Time (US & Canada)
const summerDSTDate = new Date(2020, 2, 8); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -7 Pacific time)
const winterDSTDate = new Date(2020, 10, 1); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -8 Pacific time)

// This tests run only in (UTC-08:00) Pacific Time (US & Canada)
// For run test locally, change timezone on desktop on (UTC-08:00) Pacific Time (US & Canada)
if((new Date(2020, 2, 7)).getTimezoneOffset() === pacificTimezoneOffset) {
    testStart(() => initTestMarkup());
    const moduleConfig = {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
        }
    };
    const moduleConfigWithClock = {
        beforeEach() {
            fx.off = true;
            this.clock = sinon.useFakeTimers();
        },

        afterEach() {
            fx.off = false;
            this.clock.restore();
        }
    };

    module('Day light saving time in native JS Date', moduleConfigWithClock, () => {
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
                }, this.clock);

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

        [{
            cellDuration: 120,
            appointmentTop: 100,
            view: 'week',
            startDate: new Date(2020, 2, 8, 4),
        }, {
            cellDuration: 90,
            appointmentTop: 150,
            view: 'week',
            startDate: new Date(2020, 2, 8, 4, 30),
        }, {
            cellDuration: 120,
            appointmentLeft: 400,
            view: 'timelineWeek',
            startDate: new Date(2020, 2, 8, 4),
        }, {
            cellDuration: 90,
            appointmentLeft: 600,
            view: 'timelineWeek',
            startDate: new Date(2020, 2, 8, 4, 30),
        }].forEach(({ cellDuration, appointmentTop, appointmentLeft, view, startDate }) => {
            test(`Appointments should be rendered correctly after DST when cellDuration is ${cellDuration} in ${view}`, function(assert) {
                const scheduler = createWrapper({
                    dataSource: [{
                        startDate,
                        endDate: new Date(2020, 2, 8, 6),
                        text: 'Test Appointment',
                    }],
                    currentDate: summerDSTDate,
                    views: [view],
                    currentView: view,
                    cellDuration,
                });

                if(view === 'week') {
                    const actualAppointmentTop = scheduler.appointmentList[0].position.top;

                    assert.equal(actualAppointmentTop, appointmentTop, 'Correct top coordinate');
                } else {
                    const actualAppointmentLeft = scheduler.appointmentList[0].position.left;

                    assert.equal(actualAppointmentLeft, appointmentLeft, 'Correct left coordinate');
                }
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

        const expectedDateResults = (() => {
            const result = [];
            let startHours = 0;
            let currentDate = new Date(summerDSTDate);

            while(currentDate.getDate() < 9) {
                result.push(new Date(currentDate));
                startHours += 0.5;
                currentDate = new Date(new Date(summerDSTDate).setHours(startHours - (startHours % 1), startHours % 1 * 60));

                if(startHours === 2 || startHours === 2.5) {
                    const validStartHour = startHours - 1;
                    currentDate = new Date(new Date(summerDSTDate).setHours(validStartHour - (validStartHour % 1), validStartHour % 1 * 60));
                }
            }

            return result;
        })();

        const testCases = [
            { view: 'week', times: expectedShortTimes, dates: expectedDateResults },
            { view: 'day', times: expectedShortTimes, dates: expectedDateResults },
            { view: 'timelineDay', times: expectedAllTimes, dates: expectedDateResults },
            { view: 'timelineWeek', times: expectedAllTimes, dates: expectedDateResults }
        ];

        [true, false].forEach((renovateRender) => {
            module('timeCellTemplate', () => {
                testCases.forEach(testCase => {
                    test(`arguments should be valid in '${testCase.view}' view when renovateRender is ${renovateRender}`, function(assert) {
                        let index = 0;

                        createWrapper({
                            dataSource: [],
                            timeCellTemplate: arg => {
                                if(index < expectedAllTimes.length) {
                                    assert.equal(arg.date.valueOf(), testCase.dates[index].valueOf(), 'arg.date should be valid');
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

                        const validExpectedDateResults = testCase.dates.slice(4);
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

    module('Common', moduleConfigWithClock, () => {
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
                }, this.clock);

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

                const positions = [0, 114, 228, 342];

                for(let i = 0; i < 4; i++) {
                    const element = scheduler.appointmentList[i].getElement();
                    assert.roughEqual(element.position().left, positions[i], 1, `appointment's position left should be equal ${positions[i]}`);
                }

                assert.expect(5);
            });
        });

        [{
            view: 'day',
            left: 0,
            top: 100,
        }, {
            view: 'week',
            left: 0,
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

        test('Recurrence rule with UNTIL date in UTC format should apply correctly to local dates', function(assert) {
            const dates = getRecurrenceProcessor().generateDates(
                {
                    rule: 'FREQ=DAILY;UNTIL=20210625T075959Z',
                    start: new Date(2021, 5, 24, 1, 30),
                    min: new Date(2021, 5, 20),
                    max: new Date(2021, 5, 26),
                    appointmentTimezoneOffset: 0,
                }
            );

            assert.deepEqual(dates, [new Date(2021, 5, 24, 1, 30)], 'Should be only one date');
        });
    });

    module('Cells selection with DST', {
        beforeEach: function() {
            fx.off = true;
        },
        afterEach: function() {
            fx.off = false;
        },
    }, () => {
        const SELECTED_CELL_CLASS = CLASSES.selectedCell.slice(1);
        const FOCUSED_CELL_CLASS = CLASSES.focusedCell.slice(1);

        if(isDesktopEnvironment()) {
            const schedulerSettings = {
                dataSource: [],
                views: ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'],
                currentDate: new Date(2021, 2, 14),
                scrolling: {
                    mode: 'virtual'
                },
                startDayHour: 0,
                endDayHour: 10,
                height: 600,
                width: 1500,
            };

            [
                {
                    cell: 28,
                    currentView: 'week'
                }, {
                    cell: 5,
                    currentView: 'day'
                }, {
                    cell: 5,
                    currentView: 'timelineDay'
                }, {
                    cell: 5,
                    currentView: 'timelineWeek'
                }
            ].forEach(({ cell, currentView }) => {
                test(`Correct cell should be selected when ${currentView} view is used`, function(assert) {
                    const scheduler = createWrapper(Object.assign({ currentView }, schedulerSettings));
                    scheduler.workSpace.selectCells(cell, cell);

                    const selectedCell = scheduler.workSpace.getCell(cell);
                    const selectedCells = scheduler.workSpace.getSelectedCells();

                    assert.equal(selectedCells.length, 1, 'selected exacly one cell');
                    assert.ok(selectedCell.hasClass(SELECTED_CELL_CLASS), 'the cell is selected');
                    assert.ok(selectedCell.hasClass(FOCUSED_CELL_CLASS), 'the cell is focused');
                });
            });

            [
                {
                    firstCell: 3,
                    lastCell: 8,
                    selectedCellCount: 6,
                    currentView: 'day',
                    mustBeSelectedCells: [4, 5, 6, 7],
                    testDescription: 'Cells that cover dead zone of DST'
                }, {
                    firstCell: 21,
                    lastCell: 56,
                    selectedCellCount: 6,
                    currentView: 'week',
                    mustBeSelectedCells: [28, 35, 42, 49],
                    testDescription: 'Cells that cover dead zone of DST'
                }, {
                    firstCell: 28,
                    lastCell: 29,
                    selectedCellCount: 17,
                    currentView: 'week',
                    mustBeSelectedCells: [28, 35, 42, 56],
                    testDescription: 'Cells that cover dead zone of DST and part of next week'
                }, {
                    firstCell: 3,
                    lastCell: 8,
                    selectedCellCount: 6,
                    currentView: 'timelineDay',
                    mustBeSelectedCells: [4, 5, 6, 7],
                    testDescription: 'Cells that cover dead zone of DST'
                }, {
                    firstCell: 5,
                    lastCell: 9,
                    selectedCellCount: 5,
                    currentView: 'timelineWeek',
                    mustBeSelectedCells: [5, 6, 7, 8, 9],
                    testDescription: 'Cells that start on dead zone of DST'
                },
                {
                    firstCell: 4,
                    lastCell: 5,
                    selectedCellCount: 2,
                    currentView: 'day',
                    mustBeSelectedCells: [4, 5],
                    testDescription: 'Cells of dead zone of DST'
                }, {
                    firstCell: 14,
                    lastCell: 28,
                    selectedCellCount: 3,
                    currentView: 'week',
                    mustBeSelectedCells: [14, 21, 28],
                    testDescription: 'Cells that end on dead zone of DST'
                }, {
                    firstCell: 3,
                    lastCell: 5,
                    selectedCellCount: 3,
                    currentView: 'timelineDay',
                    mustBeSelectedCells: [3, 4, 5],
                    testDescription: 'Cells that end on dead zone of DST'
                }, {
                    firstCell: 3,
                    lastCell: 5,
                    selectedCellCount: 3,
                    currentView: 'timelineWeek',
                    mustBeSelectedCells: [3, 4, 5],
                    testDescription: 'Cells that end on dead zone of DST'
                },
            ].forEach(({ firstCell, lastCell, selectedCellCount, currentView, mustBeSelectedCells, testDescription }) => {
                test(`${testDescription} should be selected when ${currentView} view is used`, function(assert) {
                    const scheduler = createWrapper({ ...schedulerSettings, currentView });

                    scheduler.workSpace.selectCells(firstCell, lastCell);

                    const cells = scheduler.workSpace.getCells();
                    const selectedCells = scheduler.workSpace.getSelectedCells();

                    assert.equal(selectedCells.length, selectedCellCount, 'the amount of selected cells is correct');
                    assert.ok(cells.eq(firstCell).hasClass(SELECTED_CELL_CLASS), 'the first cell is selected');
                    assert.ok(cells.eq(lastCell).hasClass(SELECTED_CELL_CLASS), 'the last cell is selected');
                    assert.ok(cells.eq(lastCell).hasClass(FOCUSED_CELL_CLASS), 'the last cell is focused');
                    mustBeSelectedCells.forEach(index => {
                        assert.ok(cells.eq(index).hasClass(SELECTED_CELL_CLASS), 'the cell from dead zone is selected');
                    });
                });
            });
        }
    });

    module('Current Time Indicator', () => {
        test('Current time indicator should have correct top in week view when DST is present (T1040849)', function(assert) {
            const clock = sinon.useFakeTimers((new Date(2021, 10, 7, 10)).getTime());

            const scheduler = createWrapper({
                views: ['week'],
                currentView: 'week',
                currentDate: new Date(),
                height: 580,
            });

            const currentTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator();

            assert.roughEqual(currentTimeIndicator.eq(0).position().top, 1000, 1.5, 'Current time indicator has correct top');

            clock.restore();
        });

        test('Current time indicator should have correct left in timeline-week view when DST is present (T1040849)', function(assert) {
            const clock = sinon.useFakeTimers((new Date(2021, 10, 7, 10)).getTime());

            const scheduler = createWrapper({
                views: ['timelineWeek'],
                currentView: 'timelineWeek',
                currentDate: new Date(),
                height: 580,
            });

            const currentTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator();

            assert.roughEqual(currentTimeIndicator.eq(0).position().left, 4000, 1.5, 'Current time indicator has correct left');

            clock.restore();
        });
    });
}
