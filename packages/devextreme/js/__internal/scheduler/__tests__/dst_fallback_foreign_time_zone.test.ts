/**
 * @timezone UTC
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import {
  DEFAULT_CELL_WIDTH,
  DEFAULT_TIMELINE_CELL_HEIGHT,
  setupSchedulerTestEnvironment,
} from './__mock__/mock_scheduler';

describe('T1335525 fall-back DST of a foreign Scheduler time zone', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({
      width: DEFAULT_CELL_WIDTH,
      height: DEFAULT_TIMELINE_CELL_HEIGHT,
    });
  });

  afterEach(() => {
    fx.off = false;
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  // NOTE: The workspace grid is built with the browser time zone rules,
  // so a transition of the Scheduler time zone alone should not change the layout.
  it('should keep the grid and the appointments aligned', async () => {
    const { POM, container, scheduler } = await createScheduler({
      timeZone: 'Africa/Cairo',
      dataSource: [{
        text: 'A',
        startDate: '2026-10-30T12:00:00+02:00',
        endDate: '2026-10-30T12:30:00+02:00',
      }],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      currentDate: new Date(2026, 9, 29),
      startDayHour: 0,
      endDayHour: 24,
      cellDuration: 15,
      height: 440,
      showAllDayPanel: false,
      showCurrentTimeIndicator: false,
      scrolling: { mode: 'standard' },
      editing: false,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    expect(cells).toHaveLength(192);

    const appointmentCellIndex = POM.getAppointment('A').getGeometry().left / DEFAULT_CELL_WIDTH;
    expect(appointmentCellIndex).toBe(144);

    const cellData = scheduler.getWorkSpace().getCellData($(cells[appointmentCellIndex]));
    expect(cellData.startDate.toISOString()).toBe('2026-10-30T12:00:00.000Z');
  });
});
