/**
 * @timezone America/Santiago
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

/**
 * The 26_1 defect already visible in santiago_timezone.test.ts.snap:
 * a 23-hour spring day is drawn as 24 cells, and every later day in the view
 * is labeled from 1:00 AM instead of 12:00 AM.
 * Phase B is expected to change these expectations.
 */
describe('Santiago spring-forward grid on 6 September 2026', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('gives timelineDay 24 cells and spends the last one on the next midnight', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [],
      views: [{ type: 'timelineDay' }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 8, 6),
      cellDuration: 60,
    });
    const row = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];
    const headers = POM.getHeaderPanelContent();

    expect(row).toHaveLength(24);
    expect(row[0].cellData.startDate.getHours()).toBe(1);
    expect(row[0].cellData.startDate.getDate()).toBe(6);
    expect(row[23].cellData.startDate.getHours()).toBe(0);
    expect(row[23].cellData.startDate.getDate()).toBe(7);
    expect(headers).toHaveLength(24);
    expect(headers[0]).toBe('1:00 AM');
    expect(headers[23]).toBe('12:00 AM');
  });

  it('labels every day of the week from 1:00 AM', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [],
      views: [{
        type: 'timelineWeek',
        firstDayOfWeek: 0,
        cellDuration: 6 * 60,
      }],
      currentView: 'timelineWeek',
      currentDate: new Date(2026, 8, 6),
      cellDuration: 60,
      firstDayOfWeek: 1,
    });
    const headers = POM.getHeaderPanelContent();
    const timeHeaders = headers.slice(7);

    expect(headers.slice(0, 7)).toEqual([
      'Sun 6', 'Mon 7', 'Tue 8', 'Wed 9', 'Thu 10', 'Fri 11', 'Sat 12',
    ]);
    expect(scheduler.getWorkSpace().viewDataProvider.completeDateHeaderMap[0]
      .map((header) => header.colSpan)).toEqual([4, 4, 4, 4, 4, 4, 4]);
    expect(timeHeaders.filter((_, index) => index % 4 === 0)).toEqual([
      '1:00 AM',
      '1:00 AM',
      '1:00 AM',
      '1:00 AM',
      '1:00 AM',
      '1:00 AM',
      '1:00 AM',
    ]);
  });
});
