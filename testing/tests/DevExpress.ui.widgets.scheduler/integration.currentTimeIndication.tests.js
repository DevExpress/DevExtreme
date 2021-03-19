import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { dateToMilliseconds as toMs } from 'core/utils/date';

import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

module('Common cases', () => {
    test('Current time indicator calculates position correctly with workWeek view (T750252)', function(assert) {
        const clock = sinon.useFakeTimers((new Date(2021, 0, 20, 20)).getTime());

        const scheduler = createWrapper({
            views: [{
                name: '2 Work Weeks',
                type: 'workWeek',
                intervalCount: 2,
                startDate: new Date(Date.now() - 5 * toMs('day')),
            }],
            currentView: 'workWeek',
            currentDate: new Date(),
            height: 580,
        });

        const $dateTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator()[0];
        const position = { top: $dateTimeIndicator.style.top, left: $dateTimeIndicator.style.left };

        assert.notDeepEqual(position, { left: 0, top: 0 }, 'Current time indicator positioned correctly');

        clock.restore();
    });

    test('Current time indicator should be visible in period between 23.59 and 24.00', function(assert) {
        const clock = sinon.useFakeTimers((new Date(2021, 0, 20, 23, 59, 58)).getTime());

        const scheduler = createWrapper({
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(),
            height: 580,
        });

        const currentTimeIndicator = scheduler.workSpace.getCurrentTimeIndicator();

        assert.equal(currentTimeIndicator.length, 1, 'Current time indicator is visible');

        clock.restore();
    });
});
