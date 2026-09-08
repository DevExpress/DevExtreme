import { expect } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { dragToElement } from '../../../helpers/dragUtils';
import type { MachineTimezonesType } from '../../../helpers/machineTimezones';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../helpers/machineTimezones';
import Scheduler from '../../../models/scheduler';

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
const MS_IN_MINUTE = 60000;
const COLUMN_IDX = 3;
const ROW_COUNT = 8;
const CELL_HEIGHT = 25;
// An appointment dropped next to the spring-forward gap keeps its one hour of real time, and that
// hour ends past the clock change — so it is drawn over the phantom cell as well.
const OVER_THE_GAP_HEIGHT = 50;

const cellRowIndexes = Array.from({ length: ROW_COUNT }, (_, idx) => idx);

// NOTE: 25 instead of the 50 at idx = 2 is ok here. We cannot drag-n-drop the appointment to the
// 02:00 -> 03:00 local time, because that time interval does not exist on the day the clocks go
// forward. https://www.timeanddate.com/time/change/germany/berlin (31 Mar 2024)
// https://www.timeanddate.com/time/change/usa/los-angeles (10 Mar 2024)
const SPRING_FORWARD_TOPS = [0, 25, 25, 75, 100, 125, 150, 175];
const REGULAR_TOPS = [0, 25, 50, 75, 100, 125, 150, 175];

const heightsWithGapAt = (...gapRows: number[]): number[] => cellRowIndexes.map(
  (idx) => (gapRows.includes(idx) ? OVER_THE_GAP_HEIGHT : CELL_HEIGHT),
);

interface TestCase {
  timezone: MachineTimezonesType;
  season: string;
  offset: number;
  currentDate: string;
  startDate: Date;
  expectedTopPosition: number[];
  expectedHeight: number[];
}

const springForward = (
  timezone: MachineTimezonesType,
  currentDate: string,
  startDate: Date,
): TestCase[] => [
  {
    timezone,
    season: 'summer',
    offset: 0,
    currentDate,
    startDate,
    expectedTopPosition: SPRING_FORWARD_TOPS,
    expectedHeight: heightsWithGapAt(1, 2),
  },
  // A negative offset pulls the view start back, so the clock change lands on the last of the
  // sampled rows instead of the third one; a positive one pushes it past them altogether.
  {
    timezone,
    season: 'summer',
    offset: -360,
    currentDate,
    startDate,
    expectedTopPosition: REGULAR_TOPS,
    expectedHeight: heightsWithGapAt(ROW_COUNT - 1),
  },
  {
    timezone,
    season: 'summer',
    offset: 360,
    currentDate,
    startDate,
    expectedTopPosition: REGULAR_TOPS,
    expectedHeight: heightsWithGapAt(),
  },
];

const fallBack = (
  timezone: MachineTimezonesType,
  currentDate: string,
  startDate: Date,
): TestCase[] => [0, -360, 360].map((offset) => ({
  timezone,
  season: 'winter',
  offset,
  currentDate,
  startDate,
  expectedTopPosition: REGULAR_TOPS,
  expectedHeight: heightsWithGapAt(),
}));

const TEST_CASES: TestCase[] = [
  ...springForward(MACHINE_TIMEZONES.EuropeBerlin, '2024-03-31', new Date('2024-03-30T23:00:00Z')),
  ...fallBack(MACHINE_TIMEZONES.EuropeBerlin, '2024-10-27', new Date('2024-10-26T22:00:00Z')),
  ...springForward(MACHINE_TIMEZONES.AmericaLosAngeles, '2024-03-10', new Date('2024-03-10T08:00:00Z')),
  ...fallBack(MACHINE_TIMEZONES.AmericaLosAngeles, '2024-11-03', new Date('2024-11-03T07:00:00Z')),
];

const getAppointmentFromStartDate = (startDate: Date, offset: number): object => {
  const appointmentDurationMs = 60 * MS_IN_MINUTE;

  return {
    startDate: new Date(startDate.getTime() + offset * MS_IN_MINUTE),
    endDate: new Date(startDate.getTime() + offset * MS_IN_MINUTE + appointmentDurationMs),
    text: APPOINTMENT_TEXT,
  };
};

TEST_CASES.forEach(({
  timezone, season, offset, currentDate, startDate, expectedTopPosition, expectedHeight,
}) => {
  getTimezoneTest([timezone])(
    `Should drag-n-drop appointment correctly during around DST (${timezone}, ${season}, ${offset})`,
    async ({ page }) => {
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
      const firstCellBox = await scheduler.getDateTableCell(
        cellRowIndexes[0],
        COLUMN_IDX,
      ).boundingBox();

      expect(firstCellBox).not.toBeNull();

      const firstCellTop = firstCellBox!.y;

      for (const rowIdx of cellRowIndexes) {
        const cell = scheduler.getDateTableCell(rowIdx, COLUMN_IDX);

        await dragToElement(page, appointment.element, cell, { offsetY: DRAG_Y_OFFSET_PX });

        // The drop re-renders the appointment, so the assertion polls instead of measuring once:
        // the element found right after the drag can still be the one being replaced.
        await expect.poll(async () => {
          const box = await appointment.element.boundingBox();

          return box && { height: box.height, relativeTop: box.y - firstCellTop };
        }).toEqual({
          height: expectedHeight[rowIdx],
          relativeTop: expectedTopPosition[rowIdx],
        });
      }
    },
  );
});
