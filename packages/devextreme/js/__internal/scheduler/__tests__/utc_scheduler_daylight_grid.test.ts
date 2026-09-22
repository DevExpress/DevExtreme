/**
 * @timezone Etc/UTC
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createTimeZoneCalculator } from '../r1/timezone_calculator';
import { buildDayCells } from '../utils/daylight_grid';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('timeline DST grid in a configured Scheduler time zone', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('detects Cairo fallback independently of the process time zone', () => {
    const { cells } = buildDayCells(
      new Date(2026, 9, 29),
      0,
      24,
      60 * 60 * 1000,
      createTimeZoneCalculator('Africa/Cairo'),
    );

    expect(cells).toHaveLength(25);
    expect(cells[23].start.toISOString()).toBe('2026-10-29T23:00:00.000Z');
    expect(cells[24].start.toISOString()).toBe('2026-10-29T23:00:00.000Z');
    expect(cells[24].startUTC - cells[23].startUTC).toBe(60 * 60 * 1000);
  });

  it('uses 25 cells and separates both Cairo 23:00 occurrences', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [{
        text: 'A',
        startDate: new Date('2026-10-29T23:00:00+03:00'),
        endDate: new Date('2026-10-29T23:15:00+03:00'),
      }, {
        text: 'B',
        startDate: new Date('2026-10-29T23:00:00+02:00'),
        endDate: new Date('2026-10-29T23:15:00+02:00'),
      }],
      views: [{ type: 'timelineDay', intervalCount: 2, maxAppointmentsPerCell: 'unlimited' }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });

    const workspace = scheduler.getWorkSpace();
    const cells = workspace.viewDataProvider.viewDataMap.dateTableMap[0];
    const headers = workspace.viewDataProvider.completeDateHeaderMap.at(-1) ?? [];

    expect(cells).toHaveLength(49);
    expect(cells[24].cellData.endDate.getTime()).toBe(cells[25].cellData.startDate.getTime());
    expect(headers[23].text).toBe(headers[24].text);
    expect(POM.getAppointment('B').getGeometry().left - POM.getAppointment('A').getGeometry().left)
      .toBe(DEFAULT_CELL_WIDTH);
  });

  it('gives every cell the wall clock it shows and the instant it means', async () => {
    const { scheduler } = await createScheduler({
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });
    const workspace = scheduler.getWorkSpace();
    const cells = workspace.viewDataProvider.viewDataMap.dateTableMap[0];
    const read = (index: number): (string | undefined)[] => [
      cells[index].cellData.startDate.toISOString(),
      cells[index].cellData.startDateUTC?.toISOString(),
      cells[index].cellData.endDateUTC?.toISOString(),
    ];

    // Both passes over 23:00 show the same wall clock and mean an hour apart.
    expect(read(23)).toEqual([
      '2026-10-29T23:00:00.000Z',
      '2026-10-29T20:00:00.000Z',
      '2026-10-29T21:00:00.000Z',
    ]);
    expect(read(24)).toEqual([
      '2026-10-29T23:00:00.000Z',
      '2026-10-29T21:00:00.000Z',
      '2026-10-29T22:00:00.000Z',
    ]);
    // The day after the repeated hour still starts at its own midnight.
    expect(read(25)).toEqual([
      '2026-10-30T00:00:00.000Z',
      '2026-10-29T22:00:00.000Z',
      '2026-10-29T23:00:00.000Z',
    ]);
    expect(cells[48].cellData.endDate.toISOString()).toBe('2026-10-31T00:00:00.000Z');
  });

  it('leaves out the hour a spring-forward skips', async () => {
    const { scheduler } = await createScheduler({
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 3, 24),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });
    const workspace = scheduler.getWorkSpace();
    const cells = workspace.viewDataProvider.viewDataMap.dateTableMap[0];

    expect(cells).toHaveLength(47);
    expect(workspace.viewDataProvider.completeDateHeaderMap[0]
      .map((header) => header.colSpan)).toEqual([23, 24]);
    expect(cells[0].cellData.startDate.toISOString()).toBe('2026-04-24T01:00:00.000Z');
    expect(cells[23].cellData.startDate.toISOString()).toBe('2026-04-25T00:00:00.000Z');
  });
});
