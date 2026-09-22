/**
 * @timezone Etc/UTC
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createTimeZoneCalculator } from '../r1/timezone_calculator';
import { buildFallbackDayCells } from '../utils/repeated_hour';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('timeline repeated hour in a configured Scheduler time zone', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('detects Cairo fallback independently of the process time zone', () => {
    const cells = buildFallbackDayCells(
      new Date(2026, 9, 29),
      0,
      24,
      60 * 60 * 1000,
      createTimeZoneCalculator('Africa/Cairo'),
    );

    expect(cells).toHaveLength(25);
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
});
