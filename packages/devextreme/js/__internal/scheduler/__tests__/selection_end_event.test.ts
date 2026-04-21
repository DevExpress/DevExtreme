import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { fireEvent } from '@testing-library/dom';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

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
    const onSelectionEnd = jest.fn();

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
    selectedCellData.forEach((cell) => {
      expect(cell).toHaveProperty('startDate');
      expect(cell).toHaveProperty('endDate');
    });
    expect(component).toBe(scheduler);
  });
});
