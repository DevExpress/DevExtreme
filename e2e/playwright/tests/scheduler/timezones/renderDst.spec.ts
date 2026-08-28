import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import type { MachineTimezonesType } from '../../../helpers/machineTimezones';
import { getTimezoneTest, MACHINE_TIMEZONES, normalizeTimezoneName } from '../../../helpers/machineTimezones';
import { testScreenshot } from '../../../helpers/screenshots';
import Scheduler from '../../../models/scheduler';

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
  textPrefix = '',
): object[] => new Array(count).fill(null).map((_, idx) => {
  const currentStartDate = new Date(startDate.getTime() + durationMin * MS_IN_MINUTE * idx);
  const currentEndDate = new Date(currentStartDate.getTime() + durationMin * MS_IN_MINUTE);

  return {
    text: `${textPrefix}${idx}`,
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
  location: [timezone, caseName, currentDate, startDate],
}) => {
  const dataSource = generateAppointments(startDate, 60, 120);

  getTimezoneTest([timezone])(
    `Should correctly render hourly appointments at DST (${timezone}, ${caseName}, offset ${offset})`,
    async ({ page }) => {
      await insertStylesheetRulesToPage(page, CUSTOM_CSS);
      await createWidget(page, 'dxScheduler', {
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

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const timezoneName = normalizeTimezoneName(timezone);

      await testScreenshot(
        page,
        `${currentView}_usual-appts-render-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );
    },
  );
});

generateOptionMatrix({
  currentView: ['day'],
  offset: [-60, 0, 60],
  location: [
    [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-03-30T23:00:00Z')],
    [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-10-26T22:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-03-10T08:00:00Z')],
    [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-11-03T07:00:00Z')],
  ] as [MachineTimezonesType, string, string, Date][],
}).forEach(({
  currentView,
  offset,
  location: [timezone, caseName, currentDate, startDate],
}) => {
  const dataSource = [
    ...generateAppointments(startDate, 60, 5, 'A_'),
    ...generateAppointments(startDate, 30, 10, 'B_'),
  ];

  getTimezoneTest([timezone])(
    `Should resolve appointment start cell correctly during DST (${timezone}, ${caseName}, offset ${offset})`,
    async ({ page }) => {
      await insertStylesheetRulesToPage(page, CUSTOM_CSS);
      await createWidget(page, 'dxScheduler', {
        timeZone: timezone,
        dataSource,
        currentView,
        currentDate,
        offset,
        showCurrentTimeIndicator: false,
        maxAppointmentsPerCell: 'unlimited',
        firstDayOfWeek: 4,
        cellDuration: 30,
        height: 800,
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const timezoneName = normalizeTimezoneName(timezone);

      await testScreenshot(
        page,
        `${currentView}_usual-appts-start-cell-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );
    },
  );
});
