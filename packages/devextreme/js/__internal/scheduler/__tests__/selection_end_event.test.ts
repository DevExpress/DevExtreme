import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { SelectionEndEvent } from '@js/ui/scheduler';
import { fireEvent } from '@testing-library/dom';
import support from '@ts/core/utils/m_support';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const defaultOptions = {
  currentView: 'week',
  views: ['week'],
  currentDate: new Date(2024, 0, 1),
  startDayHour: 9,
  endDayHour: 16,
  height: 600,
};

describe('onSelectionEnd', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    fx.off = false;
    document.body.innerHTML = '';
  });

  it('should fire with selectedCellData on multi-cell mouse drag', async () => {
    const onSelectionEnd = jest.fn<(e: SelectionEndEvent) => void>();

    const { POM, scheduler } = await createScheduler({
      ...defaultOptions,
      onSelectionEnd,
    });

    const firstCell = POM.getDateTableCell(0, 0);
    const secondCell = POM.getDateTableCell(1, 0);
    const thirdCell = POM.getDateTableCell(2, 0);

    fireEvent.mouseDown(firstCell, { which: 1 });
    fireEvent.mouseMove(secondCell);
    fireEvent.mouseMove(thirdCell);
    fireEvent.mouseUp(thirdCell);

    expect(onSelectionEnd).toHaveBeenCalledTimes(1);

    const { selectedCellData, component } = onSelectionEnd.mock.calls[0][0];

    expect(selectedCellData).toHaveLength(3);

    const firstStart = selectedCellData[0].startDate;
    expect(firstStart.getHours()).toBe(9);
    expect(firstStart.getMinutes()).toBe(0);

    expect(selectedCellData[0].endDate.getTime() - firstStart.getTime()).toBe(30 * 60 * 1000);
    expect(selectedCellData[1].startDate.getTime()).toBe(selectedCellData[0].endDate.getTime());
    expect(selectedCellData[2].startDate.getTime()).toBe(selectedCellData[1].endDate.getTime());

    expect(selectedCellData[2].endDate.getHours()).toBe(10);
    expect(selectedCellData[2].endDate.getMinutes()).toBe(30);

    expect(component).toBe(scheduler);
  });

  it('T1187849: should select cells with mouse on touch monitor', async () => {
    const originalSupportTouch = support.touch;
    support.touch = true;

    const { POM, scheduler } = await createScheduler(defaultOptions);
    const firstCell = POM.getDateTableCell(0, 0);
    const secondCell = POM.getDateTableCell(1, 0);

    expect(scheduler.getWorkSpace().getScrollable().option('scrollByContent')).toBe(true);

    fireEvent.mouseDown(firstCell, { which: 1 });
    fireEvent.mouseMove(secondCell, { which: 1 });
    fireEvent.mouseUp(secondCell, { which: 1 });

    expect(scheduler.option('selectedCellData')).toHaveLength(2);
    expect(firstCell.classList.contains('dx-state-focused')).toBe(true);
    expect(secondCell.classList.contains('dx-state-focused')).toBe(true);

    support.touch = originalSupportTouch;
  });

  it('should not fire onSelectionEnd when clicking on an already-selected cell', async () => {
    const onSelectionEnd = jest.fn<(e: SelectionEndEvent) => void>();

    const { POM } = await createScheduler({
      ...defaultOptions,
      onSelectionEnd,
    });

    const firstCell = POM.getDateTableCell(0, 0);
    const secondCell = POM.getDateTableCell(1, 0);
    const thirdCell = POM.getDateTableCell(2, 0);

    fireEvent.mouseDown(firstCell, { which: 1 });
    fireEvent.mouseMove(secondCell);
    fireEvent.mouseMove(thirdCell);
    fireEvent.mouseUp(thirdCell);

    expect(onSelectionEnd).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(thirdCell, { which: 1 });
    fireEvent.mouseUp(thirdCell);

    expect(onSelectionEnd).toHaveBeenCalledTimes(1);
  });

  it('should fire onSelectionEnd independently for each Scheduler instance on the page', async () => {
    const onSelectionEndA = jest.fn<(e: SelectionEndEvent) => void>();
    const onSelectionEndB = jest.fn<(e: SelectionEndEvent) => void>();

    const { POM: POMA } = await createScheduler({
      ...defaultOptions,
      onSelectionEnd: onSelectionEndA,
    });
    await createScheduler({
      ...defaultOptions,
      onSelectionEnd: onSelectionEndB,
    });

    const firstCell = POMA.getDateTableCell(0, 0);
    const secondCell = POMA.getDateTableCell(1, 0);

    fireEvent.mouseDown(firstCell, { which: 1 });
    fireEvent.mouseMove(secondCell);
    fireEvent.mouseUp(secondCell);

    expect(onSelectionEndA).toHaveBeenCalledTimes(1);
    expect(onSelectionEndB).toHaveBeenCalledTimes(0);
  });
});
