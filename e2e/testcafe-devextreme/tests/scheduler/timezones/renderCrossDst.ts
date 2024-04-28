import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import {
  getTimezoneTest,
  MACHINE_TIMEZONES,
  normalizeTimezoneName,
} from '../../../helpers/machineTimezones';
import url from '../../../helpers/getPageUrl';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';

fixture.disablePageReloads`Scheduler render during DST`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';
// TODO remove first two selectors after fix of the currentTimeIndicator option
const CUSTOM_CSS = `
#container .dx-scheduler-header-panel-cell {
  color: rgba(0,0,0,.54);
}

#container .dx-scheduler-header-panel-cell::before {
  display: none;
}

.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const SUMMER_BERLIN_LOCAL_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  caseName: 'summer-local',
  currentDate: '2024-03-31',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-03-30T00:00:00',
      endDate: '2024-03-30T05:00:00',
    },
    {
      text: '#1',
      startDate: '2024-03-31T00:00:00',
      endDate: '2024-03-31T05:00:00',
    },
    {
      text: '#2',
      startDate: '2024-04-01T00:00:00',
      endDate: '2024-04-01T05:00:00',
    },
    {
      text: 'Recurrent',
      startDate: '2020-01-01T00:00',
      endDate: '2020-01-01T05:00',
      recurrenceRule: 'FREQ=DAILY',
    },
  ],
};

const SUMMER_BERLIN_UTC_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  caseName: 'summer-utc',
  currentDate: '2024-03-31',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-03-29T23:00:00Z',
      endDate: '2024-03-30T04:00:00Z',
    },
    {
      text: '#1',
      startDate: '2024-03-30T23:00:00Z',
      endDate: '2024-03-31T04:00:00Z',
    },
    {
      text: '#2',
      startDate: '2024-03-31T23:00:00Z',
      endDate: '2024-04-01T04:00:00Z',
    },
    // NOTE: Recurrent appointments with UTC date have incorrect behavior (ticket T1222902)
    // {
    //   text: 'Recurrent',
    //   startDate: '2020-01-01T23:00Z',
    //   endDate: '2020-01-02T04:00Z',
    //   recurrenceRule: 'FREQ=DAILY',
    // },
  ],
};

const WINTER_BERLIN_LOCAL_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  caseName: 'winter-local',
  currentDate: '2024-10-27',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-10-26T01:00:00',
      endDate: '2024-10-26T04:00:00',
    },
    {
      text: '#1',
      startDate: '2024-10-27T01:00:00',
      endDate: '2024-10-27T04:00:00',
    },
    {
      text: '#2',
      startDate: '2024-10-28T01:00:00',
      endDate: '2024-10-28T04:00:00',
    },
    {
      text: 'Recurrent',
      startDate: '2020-01-01T01:00',
      endDate: '2020-01-01T04:00',
      recurrenceRule: 'FREQ=DAILY',
    },
  ],
};

const WINTER_BERLIN_UTC_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  caseName: 'winter-utc',
  currentDate: '2024-10-27',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-10-25T23:00:00Z',
      endDate: '2024-10-26T04:00:00Z',
    },
    {
      text: '#1',
      startDate: '2024-10-26T23:00:00Z',
      endDate: '2024-10-27T04:00:00Z',
    },
    {
      text: '#2',
      startDate: '2024-10-27T23:00:00Z',
      endDate: '2024-10-28T04:00:00Z',
    },
    // NOTE: Recurrent appointments with UTC date have incorrect behavior (ticket T1222902)
    // {
    //   text: 'Recurrent',
    //   startDate: '2020-01-01T23:00Z',
    //   endDate: '2020-01-02T04:00Z',
    //   recurrenceRule: 'FREQ=DAILY',
    // },
  ],
};

const SUMMER_LOS_ANGELES_LOCAL_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  caseName: 'summer-local',
  currentDate: '2024-03-10',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-03-09T00:00:00',
      endDate: '2024-03-09T05:00:00',
    },
    {
      text: '#1',
      startDate: '2024-03-10T00:00:00',
      endDate: '2024-03-10T05:00:00',
    },
    {
      text: '#2',
      startDate: '2024-03-11T00:00:00',
      endDate: '2024-03-11T05:00:00',
    },
    {
      text: 'Recurrent',
      startDate: '2020-01-01T00:00',
      endDate: '2020-01-01T05:00',
      recurrenceRule: 'FREQ=DAILY',
    },
  ],
};

const SUMMER_LOS_ANGELES_UTC_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  caseName: 'summer-utc',
  currentDate: '2024-03-10',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-03-09T08:00:00Z',
      endDate: '2024-03-09T13:00:00Z',
    },
    {
      text: '#1',
      startDate: '2024-03-10T08:00:00Z',
      endDate: '2024-03-10T13:00:00Z',
    },
    {
      text: '#2',
      startDate: '2024-03-11T08:00:00Z',
      endDate: '2024-03-11T13:00:00Z',
    },
    // NOTE: Recurrent appointments with UTC date have incorrect behavior (ticket T1222902)
    // {
    //   text: 'Recurrent',
    //   startDate: '2020-01-01T08:00Z',
    //   endDate: '2020-01-01T13:00Z',
    //   recurrenceRule: 'FREQ=DAILY',
    // },
  ],
};

const WINTER_LOS_ANGELES_LOCAL_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  caseName: 'winter-local',
  currentDate: '2024-11-03',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-11-02T00:00:00',
      endDate: '2024-11-02T05:00:00',
    },
    {
      text: '#1',
      startDate: '2024-11-03T00:00:00',
      endDate: '2024-11-03T05:00:00',
    },
    {
      text: '#2',
      startDate: '2024-11-04T00:00:00',
      endDate: '2024-11-04T05:00:00',
    },
    {
      text: 'Recurrent',
      startDate: '2020-01-01T00:00',
      endDate: '2020-01-01T05:00',
      recurrenceRule: 'FREQ=DAILY',
    },
  ],
};

const WINTER_LOS_ANGELES_UTC_DATE_CASE = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  caseName: 'winter-utc',
  currentDate: '2024-11-03',
  dataSource: [
    {
      text: '#0',
      startDate: '2024-11-02T08:00:00Z',
      endDate: '2024-11-02T13:00:00Z',
    },
    {
      text: '#1',
      startDate: '2024-11-03T08:00:00Z',
      endDate: '2024-11-03T13:00:00Z',
    },
    {
      text: '#2',
      startDate: '2024-11-04T08:00:00Z',
      endDate: '2024-11-04T13:00:00Z',
    },
    // NOTE: Recurrent appointments with UTC date have incorrect behavior (ticket T1222902)
    // {
    //   text: 'Recurrent',
    //   startDate: '2020-01-01T00:00Z',
    //   endDate: '2020-01-01T05:00Z',
    //   recurrenceRule: 'FREQ=DAILY',
    // },
  ],
};

generateOptionMatrix({
  currentView: ['week'],
  offset: [-360, 0, 360],
  location: [
    // Europe/Berlin
    SUMMER_BERLIN_LOCAL_DATE_CASE,
    SUMMER_BERLIN_UTC_DATE_CASE,
    WINTER_BERLIN_LOCAL_DATE_CASE,
    WINTER_BERLIN_UTC_DATE_CASE,
    // America/Los Angeles
    SUMMER_LOS_ANGELES_LOCAL_DATE_CASE,
    SUMMER_LOS_ANGELES_UTC_DATE_CASE,
    WINTER_LOS_ANGELES_LOCAL_DATE_CASE,
    WINTER_LOS_ANGELES_UTC_DATE_CASE,
  ],
}).forEach(({
  currentView,
  offset,
  location: {
    timezone,
    caseName,
    currentDate,
    dataSource,
  },
}) => {
  getTimezoneTest([timezone])(
    `Should correctly render appointments with local machine date crossing DST (${timezone}, ${caseName})`,
    async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      const timezoneName = normalizeTimezoneName(timezone);
      await takeScreenshot(
        `${currentView}_appts-render-cross-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
        scheduler.workSpace,
      );

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    },
  ).before(async () => {
    await insertStylesheetRulesToPage(CUSTOM_CSS);
    await createWidget('dxScheduler', {
      dataSource,
      currentView,
      currentDate,
      offset,
      showCurrentTimeIndicator: false,
      firstDayOfWeek: 4,
      cellDuration: 60,
      height: 800,
    });
  }).after(async () => {
    await removeStylesheetRulesFromPage();
  });
});
