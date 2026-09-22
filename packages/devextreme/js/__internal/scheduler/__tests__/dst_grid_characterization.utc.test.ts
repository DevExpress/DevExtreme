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
 * What 26_1 renders for the Cairo fall-back when the browser zone is not Cairo.
 * Grid dates are wall clocks packed as UTC, so the repeated hour is simply missing:
 * 48 cells, one 11:00 PM, and both passes share a column.
 * Phase B is expected to change the marked expectations.
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

    expect(row).toHaveLength(48);
    expect(workspace.viewDataProvider.completeDateHeaderMap[0].map((header) => header.colSpan))
      .toEqual([24, 24]);
    expect(timeHeaders[0]).toBe('12:00 AM');
    expect(timeHeaders[23]).toBe('11:00 PM');
    expect(timeHeaders[24]).toBe('12:00 AM');
    expect(timeHeaders.filter((text) => text === '11:00 PM')).toEqual(['11:00 PM', '11:00 PM']);

    expect(cell(0).startDate.toISOString()).toBe('2026-10-29T00:00:00.000Z');
    expect(cell(23).startDate.toISOString()).toBe('2026-10-29T23:00:00.000Z');
    expect(cell(23).endDate.toISOString()).toBe('2026-10-30T00:00:00.000Z');
    expect(cell(24).startDate.toISOString()).toBe('2026-10-30T00:00:00.000Z');

    expect(Object.keys(cell(0)).sort()).toEqual([
      'allDay',
      'endDate',
      'groupIndex',
      'index',
      'isFirstGroupCell',
      'isLastGroupCell',
      'key',
      'startDate',
    ]);
    expect(Object.values(cell(0)).some((value) => value === undefined)).toBe(false);

    expect(firstPass.left).toBe(23 * DEFAULT_CELL_WIDTH);
    expect(secondPass.left).toBe(firstPass.left);
    expect(firstPass.width).toBe(62);
    expect(secondPass.width).toBe(62);
    expect(across.left).toBe(firstPass.left);
    expect(across.width).toBe(125);
  });
});
