import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import pointerMock from '../../helpers/pointerMock.js';
import dateLocalization from 'localization/date';
import fx from 'animation/fx';

import 'ui/scheduler/ui.scheduler';

import 'generic_light.css!';

const pacificTimezoneOffset = 480; // TODO: Value in ms. Offset (UTC-08:00) Pacific Time (US & Canada)
const summerDSTDate = new Date(2020, 2, 8); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -7 Pacific time)
const winterDSTDate = new Date(2020, 10, 1); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -8 Pacific time)

// This tests run only in (UTC-08:00) Pacific Time (US & Canada)
// For run test locally, change timezone on desktop on (UTC-08:00) Pacific Time (US & Canada)
if((new Date(2020, 2, 7)).getTimezoneOffset() === pacificTimezoneOffset) {
    QUnit.testStart(() => initTestMarkup());
    const moduleConfig = {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
        }
    };

    QUnit.module('Day light saving time in native JS Date', moduleConfig, () => {
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
            QUnit.test(testCase.name, function(assert) {
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

    QUnit.module('Time panel should have correct value in case DST(T852308)', moduleConfig, () => {
        const views = ['week', 'day'];

        QUnit.module('timeCellTemplate', () => {
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

            views.forEach(view => {
                QUnit.test(`Time value in time panel should be correct in ${view}`, function(assert) {
                    let index = 0;
                    createWrapper({
                        dataSource: [],
                        timeCellTemplate: (arg) => {
                            assert.equal(arg.date.valueOf(), expectedDateResults[index].valueOf(), '');
                            index++;
                        },
                        views: views,
                        currentView: view,
                        startDayHour: 0,
                        currentDate: summerDSTDate,
                        height: 600
                    });
                });
            });
        });

        QUnit.module('Time panel render', () => {
            const expectedTimeResults = (() => {
                const result = [];
                let startDate = new Date(2020, 2, 9); // TODO Date when there is no daylight saving
                while(startDate.getDate() < 10) {
                    result.push(dateLocalization.format(startDate, 'shorttime'));
                    startDate = new Date(startDate.setHours(startDate.getHours() + 1));
                }
                return result;
            })();

            views.forEach(view => {
                QUnit.test(`Time value in time panel should be correct in ${view}`, function(assert) {
                    const scheduler = createWrapper({
                        dataSource: [],
                        views: views,
                        currentView: view,
                        startDayHour: 0,
                        currentDate: summerDSTDate,
                        height: 600
                    });

                    const currentTimeResults = scheduler.timePanel.getTimeValues();

                    assert.equal(currentTimeResults.length, expectedTimeResults.length, 'Count of current values and expected should equal');
                    for(let i = 0; i < currentTimeResults.length; i++) {
                        assert.equal(currentTimeResults[i], expectedTimeResults[i], 'Current value should be equal expected');
                    }
                });
            });
        });
        QUnit.test('onAppointmentFormOpening should have correct dates on new appointment when custom timezone', function(assert) {
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
                onAppointmentAdding: function(e) {
                    assert.deepEqual(e.appointmentData.startDate, assertDate, 'onAppointmentAdding has correct date');
                },
                onAppointmentFormOpening: function(e) {
                    assert.deepEqual(e.appointmentData.startDate, assertDate, 'onAppointmentFormOpening has correct date');
                }
            });

            pointerMock(scheduler.workSpace.getCell(0, 0)).start().click().click();
            scheduler.appointmentPopup.clickDoneButton();
        });
    });
}
