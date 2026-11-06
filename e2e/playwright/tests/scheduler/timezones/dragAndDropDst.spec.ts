import type { Locator } from '@playwright/test';
import type { Appointment } from 'devextreme/ui/scheduler';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { dragToElement } from '../../../helpers/dragUtils';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import type { MachineTimezone } from '../../../helpers/timezones';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../helpers/timezones';
import Scheduler from '../../../models/scheduler';

interface TestCase {
  timezone: MachineTimezone;
  season: 'summer' | 'winter';
  currentDate: string;
  startDate: Date;
  cellIdxArray: [rowIdx: number, colIdx: number][];
  expectedTopPosition: number[];
}

const SCHEDULER_SELECTOR = '#container';
const APPOINTMENT_TEXT = 'Appointment';
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
// NOTE: half of an regular (1 hour) appointment size
const DRAG_Y_OFFSET_PX = 12;

const getAppointmentFromStartDate = (startDate: Date, offset: number): Appointment => {
  const minuteMs = 60000;
  const appointmentDurationMs = 60 * minuteMs; // one hour

  return {
    startDate: new Date(startDate.getTime() + offset * minuteMs),
    endDate: new Date(startDate.getTime() + offset * minuteMs + appointmentDurationMs),
    text: APPOINTMENT_TEXT,
  };
};

const getTop = (element: Locator): Promise<number> => element.evaluate(
  (node) => node.getBoundingClientRect().top,
);

const BERLIN_SUMMER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'summer',
  currentDate: '2024-03-31',
  startDate: new Date('2024-03-30T23:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
  // NOTE: 25 instead of the 50 okay here at the idx = 2 is ok here
  // We cannot drag-n-drop appointment to the 02:00 -> 03:00 Berlin time
  // Because this time interval doesn't exist in this timezone
  // More details here: https://www.timeanddate.com/time/change/germany/berlin (31 Mar 2024)
  expectedTopPosition: [0, 25, 25, 75, 100, 125, 150, 175],
};

const BERLIN_SUMMER_CASE_OFFSET: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'summer',
  currentDate: '2024-03-31',
  startDate: new Date('2024-03-30T23:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const BERLIN_WINTER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.EuropeBerlin,
  season: 'winter',
  currentDate: '2024-10-27',
  startDate: new Date('2024-10-26T22:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_SUMMER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'summer',
  currentDate: '2024-03-10',
  startDate: new Date('2024-03-10T08:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
  // NOTE: 25 instead of the 50 okay here at the idx = 2 is ok here
  // We cannot drag-n-drop appointment to the 02:00 -> 03:00 Los Angeles time
  // Because this time interval doesn't exist in this timezone
  // More details here: https://www.timeanddate.com/time/change/usa/los-angeles (10 Mar 2024)
  expectedTopPosition: [0, 25, 25, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_SUMMER_CASE_OFFSET: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'summer',
  currentDate: '2024-03-10',
  startDate: new Date('2024-03-10T08:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
  expectedTopPosition: [0, 25, 50, 75, 100, 125, 150, 175],
};

const LOS_ANGELES_WINTER_CASE: TestCase = {
  timezone: MACHINE_TIMEZONES.AmericaLosAngeles,
  season: 'winter',
  currentDate: '2024-11-03',
  startDate: new Date('2024-11-03T07:00:00Z'),
  cellIdxArray: Array.from({ length: 8 }, (_, idx) => [idx, 3]),
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

test.describe('Scheduler render during DST', () => {
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
  }) => {
    getTimezoneTest(timezone)(`Should drag-n-drop appointment correctly during around DST (${timezone}, ${season}, ${offset})`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, CUSTOM_CSS);
      await createWidget(page, 'dxScheduler', {
        timeZone: timezone,
        dataSource: [getAppointmentFromStartDate(startDate, offset)],
        currentView: 'week',
        currentDate,
        offset,
        showCurrentTimeIndicator: false,
        showAllDayPanel: false,
        firstDayOfWeek: 4,
        cellDuration: 60,
        height: 800,
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TEXT);
      const [[firstCellRowIdx, firstCellColIdx]] = cellIdxArray;
      const firstCell = scheduler.getDateTableCell(firstCellRowIdx, firstCellColIdx);
      const firstCellTop = await getTop(firstCell);

      for (const [idx, [rowIdx, colIdx]] of cellIdxArray.entries()) {
        const cell = scheduler.getDateTableCell(rowIdx, colIdx);

        await dragToElement(page, appointment.element, cell, { offsetY: DRAG_Y_OFFSET_PX });

        await expect
          .poll(async () => (await getTop(appointment.element)) - firstCellTop)
          .toBe(expectedTopPosition[idx]);
      }
    });
  });
});
