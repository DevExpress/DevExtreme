/**
 * @timezone Africa/Cairo
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

const appointments = [
  {
    text: 'A',
    startDate: '2026-10-29T23:00:00+03:00',
    endDate: '2026-10-29T23:30:00+03:00',
  },
  {
    text: 'B',
    startDate: '2026-10-29T23:00:00+02:00',
    endDate: '2026-10-29T23:30:00+02:00',
  },
  {
    text: 'C',
    startDate: '2026-10-29T23:30:00+03:00',
    endDate: '2026-10-30T00:00:00+02:00',
  },
];

const baseConfig = {
  timeZone: 'Africa/Cairo',
  currentDate: new Date(2026, 9, 29),
  cellDuration: 15,
  showAllDayPanel: false,
  showCurrentTimeIndicator: false,
  scrolling: { mode: 'standard' },
  editing: false,
};

describe('T1335525 Egypt fall-back DST', () => {
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

  it('should render extra cells and keep repeated-hour appointments apart', async () => {
    const { POM, container, scheduler } = await createScheduler({
      timeZone: 'Africa/Cairo',
      dataSource: appointments,
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
    expect(cells).toHaveLength(196);

    const dayHeaders = container
      .querySelectorAll('.dx-scheduler-header-row:first-child .dx-scheduler-header-panel-cell');
    expect(dayHeaders).toHaveLength(2);
    expect(dayHeaders[0].getAttribute('colspan')).toBe('100');
    expect(dayHeaders[1].getAttribute('colspan')).toBe('96');

    expect(POM.getAppointment('A').getGeometry().left).toBe(92 * DEFAULT_CELL_WIDTH);
    expect(POM.getAppointment('B').getGeometry().left).toBe(96 * DEFAULT_CELL_WIDTH);
    expect(POM.getAppointment('C').getGeometry().width).toBe(6 * DEFAULT_CELL_WIDTH);

    const cellData = scheduler.getWorkSpace().getCellData($(POM.getDateTableCell(0, 95)));
    expect(cellData.startDate.toISOString()).toBe('2026-10-29T20:45:00.000Z');
    expect(cellData.endDate.toISOString()).toBe('2026-10-29T21:00:00.000Z');
  });

  it('should keep repeated-hour appointments apart in a partial-day view', async () => {
    const { POM, container, scheduler } = await createScheduler({
      ...baseConfig,
      dataSource: appointments,
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      startDayHour: 22,
      endDayHour: 24,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    expect(cells).toHaveLength(20);
    expect(POM.getAppointment('A').getGeometry().left).toBe(4 * DEFAULT_CELL_WIDTH);
    expect(POM.getAppointment('B').getGeometry().left).toBe(8 * DEFAULT_CELL_WIDTH);

    const workSpace = scheduler.getWorkSpace();
    const getCellStartDate = (index: number): string => workSpace
      .getCellData($(cells[index])).startDate.toISOString();

    // NOTE: The hidden hours must not be added to the repeated hour cells.
    expect(getCellStartDate(7)).toBe('2026-10-29T20:45:00.000Z');
    expect(getCellStartDate(8)).toBe('2026-10-29T21:00:00.000Z');
    expect(getCellStartDate(11)).toBe('2026-10-29T21:45:00.000Z');
    expect(getCellStartDate(12)).toBe('2026-10-30T20:00:00.000Z');
  });

  it('should add cells to the fall-back day only when week days are hidden', async () => {
    const { container, scheduler } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: [{ type: 'timelineWeek', hiddenWeekDays: [5] }],
      currentView: 'timelineWeek',
      startDayHour: 0,
      endDayHour: 24,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    expect(cells).toHaveLength(6 * 96 + 4);

    const workSpace = scheduler.getWorkSpace();
    const getCellStartDate = (index: number): string => workSpace
      .getCellData($(cells[index])).startDate.toISOString();

    // NOTE: The repeated hour of Thursday must not be moved to the hidden Friday.
    expect(getCellStartDate(480)).toBe('2026-10-29T21:00:00.000Z');
    expect(getCellStartDate(483)).toBe('2026-10-29T21:45:00.000Z');
    expect(getCellStartDate(484)).toBe('2026-10-30T22:00:00.000Z');
  });

  it('should keep the current time indicator in the cell of the current time', async () => {
    const { container } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      startDayHour: 0,
      endDayHour: 24,
      height: 440,
      showCurrentTimeIndicator: true,
      indicatorTime: new Date(2026, 9, 30, 12, 0),
      indicatorUpdateInterval: 0,
      shadeUntilCurrentTime: false,
    });

    const indicator = container.querySelector<HTMLElement>('.dx-scheduler-date-time-indicator');
    expect(indicator?.style.left).toBe(`${(100 + 48) * DEFAULT_CELL_WIDTH}px`);
  });

  it('should keep the current time indicator in the second occurrence of the repeated hour', async () => {
    const { container } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      startDayHour: 0,
      endDayHour: 24,
      height: 440,
      showCurrentTimeIndicator: true,
      indicatorTime: new Date('2026-10-29T23:30:00+02:00'),
      indicatorUpdateInterval: 0,
      shadeUntilCurrentTime: false,
    });

    const indicator = container.querySelector<HTMLElement>('.dx-scheduler-date-time-indicator');
    expect(indicator?.style.left).toBe(`${98 * DEFAULT_CELL_WIDTH}px`);
  });

  it('should not let the last fall-back cell overlap the next day', async () => {
    const { container, scheduler } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: [{ type: 'timelineDay', intervalCount: 2 }],
      currentView: 'timelineDay',
      startDayHour: 0,
      endDayHour: 24,
      cellDuration: 45,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    const workSpace = scheduler.getWorkSpace();
    const lastFallBackCell = workSpace.getCellData($(cells[33]));
    const firstNextDayCell = workSpace.getCellData($(cells[34]));

    expect(lastFallBackCell.endDate.getTime())
      .toBeLessThanOrEqual(firstNextDayCell.startDate.getTime());
  });

  it('should not add cells to the views with day long cells', async () => {
    const { container, scheduler } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      startDayHour: 0,
      endDayHour: 24,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    expect(cells).toHaveLength(31);

    const workSpace = scheduler.getWorkSpace();
    expect(workSpace.getCellData($(cells[29])).startDate.toISOString())
      .toBe('2026-10-29T22:00:00.000Z');
  });

  it('should keep the wall clock time of the cells in a vertical view', async () => {
    const { container, scheduler } = await createScheduler({
      ...baseConfig,
      dataSource: [],
      views: ['day'],
      currentView: 'day',
      startDayHour: 0,
      endDayHour: 24,
    });

    const cells = container.querySelectorAll('.dx-scheduler-date-table-cell');
    expect(cells).toHaveLength(96);

    const workSpace = scheduler.getWorkSpace();
    const lastCellStartDate = workSpace.getCellData($(cells[cells.length - 1])).startDate;
    expect(lastCellStartDate.getHours()).toBe(23);
    expect(lastCellStartDate.getMinutes()).toBe(45);
  });
});
