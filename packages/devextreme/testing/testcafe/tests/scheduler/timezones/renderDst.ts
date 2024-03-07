import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  getTimezoneTest,
  MACHINE_TIMEZONES,
  MachineTimezonesType, normalizeTimezoneName,
} from '../../../helpers/machineTimezones';
import url from '../../../helpers/getPageUrl';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import { createWidget, disposeWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
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
const MS_IN_MINUTE = 60000;

const generateAppointments = (
  startDate: Date,
  durationMin: number,
  count: number,
) => new Array(count).fill(null).map((item, idx) => {
  const currentStartDate = new Date(startDate.getTime() + durationMin * MS_IN_MINUTE * idx);
  const currentEndDate = new Date(currentStartDate.getTime() + durationMin * MS_IN_MINUTE);

  return {
    text: `${idx}`,
    startDate: currentStartDate,
    endDate: currentEndDate,
  };
});

generateOptionMatrix({
  currentView: ['week'],
  offset: [-360, 0, 360],
  location: [
    [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-03-28T23:00:00Z')],
    [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-10-24T22:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-03-08T08:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-11-01T08:00:00Z')],
  ] as [MachineTimezonesType, string, string, Date][],
}).forEach(({
  currentView,
  offset,
  location: [timezone, seasonType, currentDate, startDate],
}) => {
  const dataSource = generateAppointments(startDate, 60, 120);

  getTimezoneTest([timezone])(
    `Should correctly render hourly appointments at DST (${timezone}, ${seasonType})`,
    async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      const timezoneName = normalizeTimezoneName(timezone);
      await takeScreenshot(
        `${currentView}_usual-appts-render-dts_t-${timezoneName}-${seasonType}_offset-${offset}.png`,
        scheduler.workSpace,
      );

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    },
  ).before(async () => {
    await insertStylesheetRulesToPage(CUSTOM_CSS);
    await createWidget('dxScheduler', {
      timeZone: timezone,
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
    await disposeWidget('dxScheduler');
  });
});
