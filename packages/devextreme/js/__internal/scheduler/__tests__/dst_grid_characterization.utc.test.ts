/**
 * @timezone Etc/UTC
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

/**
 * Cairo fall-back when the browser zone is not Cairo.
 * Both 23:00 passes are columns of their own, and the next day still starts at midnight.
 */
describe('Cairo fall-back grid when the browser zone is UTC', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('keeps a 24-hour grid and puts both 23:00 passes in one column', async () => {
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
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
    });
    const workspace = scheduler.getWorkSpace();
    const row = workspace.viewDataProvider.viewDataMap.dateTableMap[0];
    const cell = (index: number) => row[index].cellData;
    const timeHeaders = POM.getHeaderPanelContent().slice(2);
    const firstPass = POM.getAppointment('A').getGeometry();
    const secondPass = POM.getAppointment('B').getGeometry();
    const across = POM.getAppointment('C').getGeometry();

    expect(row).toHaveLength(49);
    expect(workspace.viewDataProvider.completeDateHeaderMap[0].map((header) => header.colSpan))
      .toEqual([25, 24]);
    expect(timeHeaders[0]).toBe('12:00 AM');
    expect(timeHeaders[23]).toBe('11:00 PM');
    expect(timeHeaders[24]).toBe('11:00 PM');
    expect(timeHeaders[25]).toBe('12:00 AM');

    expect(cell(0).startDate.toISOString()).toBe('2026-10-29T00:00:00.000Z');
    expect(cell(23).startDate.toISOString()).toBe('2026-10-29T23:00:00.000Z');
    expect(cell(24).startDate.toISOString()).toBe('2026-10-29T23:00:00.000Z');
    expect(cell(23).startDateUTC?.toISOString()).toBe('2026-10-29T20:00:00.000Z');
    expect(cell(24).startDateUTC?.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(cell(25).startDate.toISOString()).toBe('2026-10-30T00:00:00.000Z');
    expect(cell(25).startDateUTC?.toISOString()).toBe('2026-10-29T22:00:00.000Z');

    expect(Object.keys(cell(0)).sort()).toEqual([
      'allDay',
      'endDate',
      'endDateUTC',
      'groupIndex',
      'index',
      'isFirstGroupCell',
      'isLastGroupCell',
      'key',
      'startDate',
      'startDateUTC',
    ]);
    expect(Object.values(cell(0)).some((value) => value === undefined)).toBe(false);

    expect(firstPass.left).toBe(23 * DEFAULT_CELL_WIDTH);
    expect(secondPass.left).toBe(24 * DEFAULT_CELL_WIDTH);
    expect(firstPass.width).toBe(62);
    expect(secondPass.width).toBe(62);
    expect(across.left).toBe(firstPass.left);
    expect(across.width).toBe(375);
  });
});
