import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import support from '@ts/core/utils/m_support';

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
});
