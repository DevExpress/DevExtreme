/**
 * @timezone Africa/Cairo
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

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
      cellDuration: 15,
      timeZone: 'Africa/Cairo',
    });

    const cells = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];
    const quarterToMidnight = cells[95].cellData;

    expect(cells).toHaveLength(196);
    expect(quarterToMidnight.startDate.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(quarterToMidnight.endDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cells[96].cellData.startDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(scheduler.getWorkSpace().viewDataProvider.completeDateHeaderMap[0]
      .map((header) => header.colSpan)).toEqual([100, 96]);
    expect(POM.getAppointment('B').getGeometry().left - POM.getAppointment('A').getGeometry().left)
      .toBe(4 * DEFAULT_CELL_WIDTH);
    expect(POM.getAppointment('C').getGeometry().width).toBe(6 * DEFAULT_CELL_WIDTH);
  });

  it('keeps a later appointment aligned when hidden days sit on the fallback', async () => {
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Monday',
        startDate: new Date(2026, 10, 2, 0),
        endDate: new Date(2026, 10, 2, 1),
      }],
      views: [{
        type: 'timelineDay',
        intervalCount: 2,
        hiddenWeekDays: [0, 5, 6],
        maxAppointmentsPerCell: 'unlimited',
      }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });

    expect(POM.getAppointment('Monday').getGeometry().left).toBe(25 * DEFAULT_CELL_WIDTH);
  });

  it('stretches an all-day appointment across the repeated hour', async () => {
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'All',
        startDate: new Date(2026, 9, 29),
        endDate: new Date(2026, 9, 29),
        allDay: true,
      }],
      views: [{ type: 'timelineDay', intervalCount: 1, maxAppointmentsPerCell: 'unlimited' }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
      showAllDayPanel: false,
    });

    expect(POM.getAppointment('All').getGeometry().width).toBe(25 * DEFAULT_CELL_WIDTH);
  });

  it('keeps a UTC appointment on its displayed hour when the browser repeats 23:00', async () => {
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'UTC',
        startDate: new Date('2026-10-29T21:00:00.000Z'),
        endDate: new Date('2026-10-29T22:00:00.000Z'),
      }],
      views: [{ type: 'timelineDay', intervalCount: 1, maxAppointmentsPerCell: 'unlimited' }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Etc/UTC',
    });

    expect(POM.getAppointment('UTC').getGeometry().left).toBe(21 * DEFAULT_CELL_WIDTH);
  });
});
