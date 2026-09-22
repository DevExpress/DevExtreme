/**
 * @timezone Africa/Cairo
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const MINUTE_MS = 60 * 1000;

/**
 * What 26_1 renders when the browser zone is Cairo, so grid dates carry the real offset.
 * Phase B is expected to change the marked expectations.
 */
describe('Cairo grid when the browser zone is Cairo', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('folds the repeated hour into a 75-minute 23:45 cell', async () => {
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
    const row = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];
    const cell = (index: number) => row[index].cellData;
    const duration = (index: number) => (
      cell(index).endDate.getTime() - cell(index).startDate.getTime()
    );
    const firstPass = POM.getAppointment('A');
    const secondPass = POM.getAppointment('B');
    const across = POM.getAppointment('C');

    expect(row).toHaveLength(192);
    expect(duration(92)).toBe(15 * MINUTE_MS);
    expect(duration(95)).toBe(75 * MINUTE_MS);
    expect(cell(95).startDate.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(cell(95).endDate.toISOString()).toBe('2026-10-29T22:00:00.000Z');
    expect(cell(96).startDate.toISOString()).toBe('2026-10-29T22:00:00.000Z');

    expect(firstPass.getGeometry().left).toBe(92 * DEFAULT_CELL_WIDTH);
    expect(secondPass.getGeometry().left).toBe(firstPass.getGeometry().left);
    expect(firstPass.getGeometry().width).toBe(DEFAULT_CELL_WIDTH);
    expect(across.getGeometry().width).toBe(2 * DEFAULT_CELL_WIDTH);
    expect(firstPass.getDisplayDate()).toBe('11:00 PM - 11:15 PM');
    expect(secondPass.getDisplayDate()).toBe(firstPass.getDisplayDate());
    expect(across.getDisplayDate()).toBe('11:00 PM - 11:30 PM');
  });

  it('lets the last cell of a spring-forward day spill into the next midnight', async () => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 3, 24),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });
    const row = scheduler.getWorkSpace().viewDataProvider.viewDataMap.dateTableMap[0];
    const cell = (index: number) => row[index].cellData;
    const headers = POM.getHeaderPanelContent();

    expect(row).toHaveLength(48);
    expect(cell(0).startDate.getHours()).toBe(1);
    expect(cell(0).startDate.toISOString()).toBe('2026-04-23T22:00:00.000Z');
    expect(cell(23).startDate.getHours()).toBe(0);
    expect(cell(23).startDate.getDate()).toBe(25);
    expect(cell(24).startDate.getHours()).toBe(1);
    expect(cell(24).startDate.getDate()).toBe(25);
    expect(headers[2]).toBe('1:00 AM');
    expect(headers[26]).toBe('1:00 AM');
  });
});
