/**
 * @timezone Etc/UTC
 */

import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const FIRST_PASS = new Date('2026-10-29T20:30:00.000Z');
const SECOND_PASS = new Date('2026-10-29T21:30:00.000Z');

describe('cell search on a Cairo fall-back timeline', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ width: DEFAULT_CELL_WIDTH, height: 80 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  const createTimeline = async (offset = 0) => {
    const { scheduler, POM } = await createScheduler({
      dataSource: [{
        text: 'A',
        startDate: new Date('2026-10-29T23:00:00+03:00'),
        endDate: new Date('2026-10-29T23:15:00+03:00'),
      }],
      views: [{ type: 'timelineDay', cellDuration: 60, offset }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      cellDuration: 60,
      timeZone: 'Africa/Cairo',
      indicatorTime: SECOND_PASS,
      showCurrentTimeIndicator: true,
    });
    const workspace = scheduler.getWorkSpace();
    const provider = workspace.viewDataProvider;
    const row = provider.completeViewDataMap[0];

    return {
      scheduler, POM, workspace, provider, row,
    };
  };

  it('findGlobalCellPosition tells the two 23:00 instants apart', async () => {
    const { provider } = await createTimeline();
    const first = provider.findGlobalCellPosition(FIRST_PASS);
    const second = provider.findGlobalCellPosition(SECOND_PASS);

    expect(first?.cellData.startDateUTC?.toISOString()).toBe('2026-10-29T20:00:00.000Z');
    expect(second?.cellData.startDateUTC?.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(first?.position.columnIndex).toBe(23);
    expect(second?.position.columnIndex).toBe(24);
  });

  it('getSkippedDaysCount counts a cell whose wall clock ends where it starts', async () => {
    const { provider, row } = await createTimeline();
    const repeated = row[23];
    const startInstant = repeated.startDateUTC ?? repeated.startDate;
    const endInstant = repeated.endDateUTC ?? repeated.endDate;
    const included = provider.getSkippedDaysCount(0, startInstant, endInstant, 1);

    expect(repeated.startDate.getTime()).toBe(repeated.endDate.getTime());
    expect(included).toBe(0);
  });

  it('isGroupIntersectDateInterval uses the true span, including the repeated hour', async () => {
    const { provider } = await createTimeline();

    expect(provider.isGroupIntersectDateInterval(0, FIRST_PASS, SECOND_PASS)).toBe(true);
    expect(provider.isGroupIntersectDateInterval(
      0,
      new Date('2026-10-28T10:00:00.000Z'),
      new Date('2026-10-28T12:00:00.000Z'),
    )).toBe(false);
  });

  it('getCellsBetween keeps both passes of 23:00', async () => {
    const { provider, row } = await createTimeline();
    const between = provider.getCellsBetween(row[23], row[24]);

    expect(between.map((cell) => cell.startDateUTC?.toISOString())).toEqual([
      '2026-10-29T20:00:00.000Z',
      '2026-10-29T21:00:00.000Z',
    ]);
  });

  it('asks the plan for the indicator column of the second 23:00', async () => {
    const { workspace } = await createTimeline();
    const column = workspace.getIndicationCellCount();

    expect(column).toBe(24.5);
  });

  it('applies viewOffset once, so the appointment stays on its cell', async () => {
    const shifted = await createTimeline(60);
    const cell = shifted.row[23];

    expect(cell.startDateUTC?.toISOString()).toBe('2026-10-29T21:00:00.000Z');
    expect(shifted.POM.getAppointment('A').getGeometry().left).toBe(23 * DEFAULT_CELL_WIDTH);
  });
});
