import { dateUtils } from '@ts/core/utils/m_date';

import type { DaylightCell, DaylightPlan } from '../../../utils/daylight_grid';
import { cellLayoutRange } from '../../../utils/daylight_grid';
import timeZoneUtils from '../../../utils_time_zone';
import { sourceColumnDayIndex, type VerticalSlot } from '../../../workspaces/view_model/view_data_generator';
import { splitIntervalByDay } from '../../common/split_interval_by_days';
import type { CellInterval, DateInterval } from '../../types';

interface Options {
  intervals: DateInterval[];
  startDayHour: number;
  endDayHour: number;
  durationMinutes: number;
  skippedDays: number[];
  daylightPlan?: DaylightPlan;
  verticalSlots?: VerticalSlot[];
  viewOffset?: number;
}

const toMs = dateUtils.dateToMilliseconds;

const wallMinutesOf = (date: Date): number => date.getHours() * 60 + date.getMinutes();

const cellForSlot = (
  cells: DaylightCell[],
  slot: VerticalSlot,
): DaylightCell | undefined => {
  const seenInDay = new Map<number, number>();

  return cells.find((cell) => {
    const wallMinutes = wallMinutesOf(cell.start);
    const occurrence = seenInDay.get(wallMinutes) ?? 0;
    seenInDay.set(wallMinutes, occurrence + 1);

    return wallMinutes === slot.wallMinutes && occurrence === slot.occurrence;
  });
};

const verticalDayCells = (
  plan: DaylightPlan,
  slots: VerticalSlot[],
  viewOffset: number,
): CellInterval[] => {
  const cells: CellInterval[] = [];

  plan.days.forEach((columnDay, columnIndex) => {
    if (!columnDay) {
      return;
    }
    slots.forEach((slot, rowIndex) => {
      const day = plan.days[sourceColumnDayIndex(
        columnIndex,
        slot.wallMinutes,
        viewOffset,
        plan.days.length,
      )];
      const cell = day && cellForSlot(day.cells, slot);

      if (!cell) {
        return;
      }

      cells.push({
        ...cellLayoutRange(plan, cell),
        rowIndex: columnIndex,
        columnIndex: rowIndex,
        cellIndex: cells.length,
      });
    });
  });

  return cells;
};

const filterBySkippedDays = <T extends DateInterval>(
  intervals: T[],
  skippedDays: number[],
): T[] => intervals.filter((item) => {
  const weekday = new Date(item.min).getUTCDay();
  return !skippedDays.includes(weekday);
});

const adjustDayIntervalMinForMidnightDST = (
  dayIntervalMin: number,
  startDayHour: number,
): number => {
  const date = timeZoneUtils.createDateFromUTCWithLocalOffset(new Date(dayIntervalMin));
  const isMidnightDST = startDayHour === 0 && timeZoneUtils.isLocalTimeMidnightDST(date);

  return isMidnightDST
    ? dayIntervalMin + date.getHours() * toMs('hour')
    : dayIntervalMin;
};

export const getMinutesCellIntervals = ({
  intervals,
  startDayHour,
  endDayHour,
  durationMinutes,
  skippedDays,
  daylightPlan,
  verticalSlots,
  viewOffset = 0,
}: Options): CellInterval[] => {
  if (daylightPlan && verticalSlots) {
    return verticalDayCells(daylightPlan, verticalSlots, viewOffset);
  }

  if (daylightPlan) {
    return daylightPlan.days.flatMap((day) => day.cells).map((cell, cellIndex) => ({
      ...cellLayoutRange(daylightPlan, cell),
      rowIndex: 0,
      columnIndex: cellIndex,
      cellIndex,
    }));
  }

  return intervals.reduce<CellInterval[]>((result, interval, rowIndex) => {
    const dayIntervals = splitIntervalByDay({
      ...interval, startDayHour, endDayHour, skippedDays,
    });

    let columnIndex = 0;
    filterBySkippedDays(dayIntervals, skippedDays).forEach((dayInterval) => {
      const firstAvailableDayTime = adjustDayIntervalMinForMidnightDST(
        dayInterval.min,
        startDayHour,
      );
      const date = new Date(firstAvailableDayTime);
      while (date.getTime() < dayInterval.max) {
        const min = date.getTime();
        let max = date.setUTCMinutes(date.getUTCMinutes() + durationMinutes);

        if (date.getUTCHours() > endDayHour) {
          date.setUTCDate(date.getUTCDate() + 1);
          date.setUTCHours(startDayHour, 0, 0, 0);
          max = date.getTime();
        }

        result.push({
          min,
          max,
          rowIndex,
          columnIndex,
          cellIndex: result.length,
        });
        columnIndex += 1;
      }
    });

    return result;
  }, []);
};
