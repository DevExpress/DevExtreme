import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl, insertStylesheetRulesToPage, generateOptionMatrix } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const MACHINE_TIMEZONES = {
  EuropeBerlin: 'Europe/Berlin',
  AmericaLosAngeles: 'America/Los_Angeles',
} as const;
type MachineTimezonesType = typeof MACHINE_TIMEZONES[keyof typeof MACHINE_TIMEZONES];

interface TestCase {
  timezone: MachineTimezonesType;
  season: string;
  currentDate: string;
  startDate: Date;
  cellIdxArray: [rowIdx: number, colIdx: number][];
  expectedTopPosition: number[];
}

const SCHEDULER_SELECTOR = '#container';
const APPOINTMENT_TEXT = 'Appointment';
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
const DRAG_Y_OFFSET_PX = 12;

const getAppointmentFromStartDate = (startDate: Date, offset: number) => {
  const minuteMs = 60000;
  const appointmentDurationMs = 60 * minuteMs;
  return {
    startDate: new Date(startDate.getTime() + offset * minuteMs),
    endDate: new Date(startDate.getTime() + offset * minuteMs + appointmentDurationMs),
    text: APPOINTMENT_TEXT,
  };
};

const BERLIN_SUMMER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'summer',
  currentDate: '2024-03-31',
  startDate: new Date('2024-03-30T23:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 25, 75, 100, 125, 150, 175],
};

const BERLIN_SUMMER_CASE_OFFSET: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'summer',
  currentDate: '2024-03-31',
  startDate: new Date('2024-03-30T23:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const BERLIN_WINTER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'winter',
  currentDate: '2024-10-27',
  startDate: new Date('2024-10-26T22:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_SUMMER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'summer',
  currentDate: '2024-03-10',
  startDate: new Date('2024-03-10T08:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 25, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_SUMMER_CASE_OFFSET: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'summer',
  currentDate: '2024-03-10',
  startDate: new Date('2024-03-10T08:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_WINTER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'summer',
  currentDate: '2024-11-03',
  startDate: new Date('2024-11-03T07:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]) as [number, number][],
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const ZERO_OFFSET_TEST_CASES = generateOptionMatrix({
  offset: [0],
  testCase: [
    BERLIN_SUMMER_CASE,
    BERLIN_WINTER_CASE,
    LOS_ANGELES_SUMMER_CASE,
    LOS_ANGELES_WINTER_CASE,
  ],
});

const OFFSET_TEST_CASES = generateOptionMatrix({
  offset: [-360, 360],
  testCase: [
    BERLIN_SUMMER_CASE_OFFSET,
    BERLIN_WINTER_CASE,
    LOS_ANGELES_SUMMER_CASE_OFFSET,
    LOS_ANGELES_WINTER_CASE,
  ],
});

test.describe('Scheduler render during DST - drag and drop', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [
    ...ZERO_OFFSET_TEST_CASES,
    ...OFFSET_TEST_CASES,
  ].forEach(({
    offset,
    testCase: {
      timezone,
      season,
      currentDate,
      startDate,
      cellIdxArray,
      expectedTopPosition,
    },
  }, idx) => {
    test(`Should drag-n-drop appointment correctly during around DST (${timezone}, ${season}, ${offset}, #${idx})`, async ({ page }) => {
      const browserTimezone = await page.evaluate(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      test.skip(browserTimezone !== timezone, `Skipping: machine timezone is ${browserTimezone}, expected ${timezone}`);

      await insertStylesheetRulesToPage(page, CUSTOM_CSS);

      const dataSource = [getAppointmentFromStartDate(startDate, offset)];
      await createWidget(page, 'dxScheduler', {
        timeZone: timezone,
        dataSource,
        currentView: 'week',
        currentDate,
        offset,
        showCurrentTimeIndicator: false,
        showAllDayPanel: false,
        firstDayOfWeek: 4,
        cellDuration: 60,
        height: 800,
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: APPOINTMENT_TEXT });
      const initialHeight = await appointment.evaluate((el) => el.getBoundingClientRect().height);
      const [[firstCellRowIdx, firstCellColIdx]] = cellIdxArray;
      const firstCell = page.locator('.dx-scheduler-date-table-row').nth(firstCellRowIdx)
        .locator('.dx-scheduler-date-table-cell').nth(firstCellColIdx);
      const firstCellTop = await firstCell.evaluate((el) => el.getBoundingClientRect().top);

      for (let idx = 0; idx < cellIdxArray.length; idx += 1) {
        const [rowIdx, colIdx] = cellIdxArray[idx];
        const cell = page.locator('.dx-scheduler-date-table-row').nth(rowIdx)
          .locator('.dx-scheduler-date-table-cell').nth(colIdx);

        // TODO: dragToElement with offsetY - Playwright dragTo doesn't support offset on target the same way
        await appointment.dragTo(cell);

        const currentHeight = await appointment.evaluate((el) => el.getBoundingClientRect().height);
        const currentTop = await appointment.evaluate((el) => el.getBoundingClientRect().top);
        const relativeTop = currentTop - firstCellTop;

        expect(currentHeight).toBe(initialHeight);
        expect(relativeTop).toBe(expectedTopPosition[idx]);
      }
    });
  });
});
