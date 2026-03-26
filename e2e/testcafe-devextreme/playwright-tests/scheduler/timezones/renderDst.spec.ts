import { test } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl, insertStylesheetRulesToPage, testScreenshot, generateOptionMatrix } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;
type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

const normalizeTimezoneName = (timezone: string): string => timezone.replace(/\//g, '-');

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
) => new Array(count).fill(null).map((_, idx) => {
  const currentStartDate = new Date(startDate.getTime() + durationMin * MS_IN_MINUTE * idx);
  const currentEndDate = new Date(currentStartDate.getTime() + durationMin * MS_IN_MINUTE);
  return {
    text: `${textPrefix}${idx}`,
    startDate: currentStartDate,
    endDate: currentEndDate,
  };
});

const weekLocations: [MachineTimezonesType, string, string, Date][] = [
  [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-03-28T23:00:00Z')],
  [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-10-24T22:00:00Z')],
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-03-08T08:00:00Z')],
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-11-01T08:00:00Z')],
];

const dayLocations: [MachineTimezonesType, string, string, Date][] = [
  [MACHINE_TIMEZONES.EuropeBerlin, 'summer', '2024-03-31', new Date('2024-03-30T23:00:00Z')],
  [MACHINE_TIMEZONES.EuropeBerlin, 'winter', '2024-10-27', new Date('2024-10-26T22:00:00Z')],
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'summer', '2024-03-10', new Date('2024-03-10T08:00:00Z')],
  [MACHINE_TIMEZONES.AmericaLosAngeles, 'winter', '2024-11-03', new Date('2024-11-03T07:00:00Z')],
];

([
  MACHINE_TIMEZONES.EuropeBerlin,
  MACHINE_TIMEZONES.AmericaLosAngeles,
] as MachineTimezonesType[]).forEach((tz) => {
  test.describe(`Scheduler render during DST [${tz}]`, () => {
    test.use({ timezoneId: tz });

    test.beforeEach(async ({ page }) => {
      await setupTestPage(page, containerUrl);
    });

    generateOptionMatrix({
      currentView: ['week'] as string[],
      offset: [-360, 0, 360],
      location: weekLocations.filter(([timezone]) => timezone === tz),
    }).forEach(({
      currentView,
      offset,
      location: [timezone, caseName, currentDate, startDate],
    }) => {
      const dataSource = generateAppointments(startDate, 60, 120);

      test(`Should correctly render hourly appointments at DST (${timezone}, ${caseName}, offset: ${offset})`, async ({ page }) => {
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

        const workSpace = page.locator('.dx-scheduler-work-space');
        const timezoneName = normalizeTimezoneName(timezone);
        await testScreenshot(
          page,
          `${currentView}_usual-appts-render-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
          { element: workSpace },
        );
      });
    });

    weekLocations.filter(([timezone]) => timezone === tz).forEach(([timezone, caseName, currentDate, startDate]) => {
      const dataSource = generateAppointments(startDate, 60, 120);

      test(`Should correctly render hourly appointments at DST (${timezone}, ${caseName})`, async ({ page }) => {
        const currentView = 'week';
        const offset = 0;
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

        const workSpace = page.locator('.dx-scheduler-work-space');
        const timezoneName = normalizeTimezoneName(timezone);
        await testScreenshot(
          page,
          `${currentView}_usual-appts-render-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
          { element: workSpace },
        );
      });
    });

    generateOptionMatrix({
      currentView: ['day'] as string[],
      offset: [-60, 0, 60],
      location: dayLocations.filter(([timezone]) => timezone === tz),
    }).forEach(({
      currentView,
      offset,
      location: [timezone, caseName, currentDate, startDate],
    }) => {
      const dataSource = [
        ...generateAppointments(startDate, 60, 5, 'A_'),
        ...generateAppointments(startDate, 30, 10, 'B_'),
      ];

      test(`Should resolve appointment start cell correctly during DST (${timezone}, ${caseName}, offset: ${offset})`, async ({ page }) => {
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

        const workSpace = page.locator('.dx-scheduler-work-space');
        const timezoneName = normalizeTimezoneName(timezone);
        await testScreenshot(
          page,
          `${currentView}_usual-appts-start-cell-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
          { element: workSpace },
        );
      });
    });

    dayLocations.filter(([timezone]) => timezone === tz).forEach(([timezone, caseName, currentDate, startDate]) => {
      const dataSource = [
        ...generateAppointments(startDate, 60, 5, 'A_'),
        ...generateAppointments(startDate, 30, 10, 'B_'),
      ];

      test(`Should resolve appointment start cell correctly during DST (${timezone}, ${caseName})`, async ({ page }) => {
        const currentView = 'day';
        const offset = 0;
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

        const workSpace = page.locator('.dx-scheduler-work-space');
        const timezoneName = normalizeTimezoneName(timezone);
        await testScreenshot(
          page,
          `${currentView}_usual-appts-start-cell-dts_t-${timezoneName}-${caseName}_offset-${offset}.png`,
          { element: workSpace },
        );
      });
    });
  });
});
