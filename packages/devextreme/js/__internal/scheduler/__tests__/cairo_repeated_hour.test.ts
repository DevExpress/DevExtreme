/**
 * @timezone Africa/Cairo
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const cellDuration = 15;

describe('timeline repeated hour during the Egypt fallback', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('keeps both 23:00 occurrences as separate 15 minute cells', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [{
        text: 'A',
        startDate: new Date('2026-10-29T23:00:00+03:00'),
        endDate: new Date('2026-10-29T23:15:00+03:00'),
      }, {
        text: 'B',
        startDate: new Date('2026-10-29T23:00:00+02:00'),
        endDate: new Date('2026-10-29T23:15:00+02:00'),
      }, {
        text: 'C',
        startDate: new Date('2026-10-29T23:00:00+03:00'),
        endDate: new Date('2026-10-29T23:30:00+02:00'),
      }],
      views: [{ type: 'timelineDay', intervalCount: 2, maxAppointmentsPerCell: 'unlimited' }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration,
      timeZone: 'Africa/Cairo',
      width: 800,
    });

    const cells = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];
    const firstQuarterToMidnight = cells[95].cellData;
    const repeatedHour = cells[96].cellData;

    expect(cells).toHaveLength(196);
    expect(firstQuarterToMidnight.startDate.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(firstQuarterToMidnight.endDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(repeatedHour.startDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells[99].cellData.endDate.toISOString()).toBe('2026-10-29T22:00:00.000Z');

    const dayHeaders = scheduler.getWorkSpace().viewDataProvider.completeDateHeaderMap[0];
    expect(dayHeaders.map((header) => header.colSpan)).toEqual([100, 96]);

    const appointmentA = POM.getAppointment('A');
    const appointmentB = POM.getAppointment('B');
    const appointmentC = POM.getAppointment('C');

    expect(appointmentB.getGeometry().left - appointmentA.getGeometry().left)
      .toBe(4 * DEFAULT_CELL_WIDTH);
    expect(appointmentC.getGeometry().width).toBe(6 * DEFAULT_CELL_WIDTH);
  });

  it('inserts the extra hour only after the visible start', async () => {
    const { scheduler } = await createScheduler({
      views: [{ type: 'timelineDay', intervalCount: 1 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration,
      startDayHour: 22,
      endDayHour: 24,
      timeZone: 'Africa/Cairo',
    });

    const cells = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];

    expect(cells).toHaveLength(12);
    expect(cells[0].cellData.startDate.toISOString()).toBe('2026-10-29T19:00:00.000Z');
    expect(cells[8].cellData.startDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
  });

  it('keeps the current time indicator on the noon cell of the day after the fallback', async () => {
    const { scheduler } = await createScheduler({
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration,
      timeZone: 'Africa/Cairo',
      showCurrentTimeIndicator: true,
    });

    const workspace = scheduler.getWorkSpace();
    workspace.option('indicatorTime', new Date(2026, 9, 30, 12));

    // @ts-ignore
    expect(workspace.getIndicationCellCount()).toBe(148);
  });

  it('keeps Thursday extra cells when Friday is hidden', async () => {
    const { scheduler } = await createScheduler({
      views: [{ type: 'timelineWeek', hiddenWeekDays: [5] }],
      currentView: 'timelineWeek',
      currentDate: new Date(2026, 9, 29),
      firstDayOfWeek: 0,
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });

    const cells = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];

    expect(cells).toHaveLength(145);
    expect(cells[120].cellData.startDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
  });

  it('does not stretch a vertical day or a timeline month', async () => {
    const { scheduler } = await createScheduler({
      views: ['day', 'timelineMonth'],
      currentView: 'day',
      currentDate: new Date(2026, 9, 29),
      cellDuration,
      timeZone: 'Africa/Cairo',
    });

    expect(scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap)
      .toHaveLength(96);

    scheduler.option('currentView', 'timelineMonth');
    await new Promise(process.nextTick);

    expect(scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0])
      .toHaveLength(31);
  });
});
