import { initTestMarkup, createWrapper } from './helpers.js';
import dateLocalization from 'localization/date';
import fx from 'animation/fx';

import 'ui/scheduler/ui.scheduler';
import 'common.css!';
import 'generic_light.css!';

const pacificTimezoneOffset = 480; // TODO: Value in ms. Offset (UTC-08:00) Pacific Time (US & Canada)
const dateWhichTimezoneShifted = new Date(2020, 2, 8); // TODO Daylight saving time will happen on this day in 2 A.M.(UTC -8 Pacific time)

// This tests run only in (UTC-08:00) Pacific Time (US & Canada)
// For run test locally, change timezone on desktop on (UTC-08:00) Pacific Time (US & Canada)
if((new Date()).getTimezoneOffset() === pacificTimezoneOffset) {
    QUnit.testStart(() => initTestMarkup());
    const moduleConfig = {
        beforeEach() {
            fx.off = true;
        },

        afterEach() {
            fx.off = false;
        }
    };

    QUnit.module('Time panel should have correct value in case DST(T852308)', moduleConfig, () => {
        const views = ['week', 'day'];

        QUnit.module('timeCellTemplate', () => {
            const expectedDateResults = (() => {
                const result = [];
                let startHours = 0;
                let currentDate = new Date(dateWhichTimezoneShifted);

                while(currentDate.getDate() < 9) {
                    result.push(new Date(currentDate));
                    startHours += 0.5;
                    currentDate = new Date(new Date(dateWhichTimezoneShifted).setHours(startHours - (startHours % 1), startHours % 1 * 60));
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
                        currentDate: dateWhichTimezoneShifted,
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
                        currentDate: dateWhichTimezoneShifted,
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
    });
}
