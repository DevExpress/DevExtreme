import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const CLASSES = {
  scheduler: 'dx-scheduler',
  dateTableCell: 'dx-scheduler-date-table-cell',
};

describe('onSelectionEnd Event', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    if ($scheduler.length > 0) {
      // @ts-expect-error
      $scheduler.dxScheduler('dispose');
    }
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should trigger onSelectionEnd event when selecting multiple cells with mouse', async () => {
    const onSelectionEnd = jest.fn();

    const { scheduler, POM, container } = await createScheduler({
      currentView: 'week',
      views: ['week'],
      currentDate: new Date(2024, 0, 1),
      startDayHour: 9,
      endDayHour: 18,
      height: 600,
      onSelectionEnd,
    });

    const firstCell = POM.getDateTableCell(0, 0);
    const thirdCell = POM.getDateTableCell(2, 0);

    firstCell.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    }));

    const secondCell = POM.getDateTableCell(1, 0);
    secondCell.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 150,
    }));

    thirdCell.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 200,
    }));

    thirdCell.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 200,
    }));

    expect(onSelectionEnd).toHaveBeenCalledTimes(1);

    expect(onSelectionEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        component: scheduler,
        element: container,
        selectedCellData: expect.arrayContaining([
          expect.objectContaining({
            startDate: new Date('2023-12-31T12:00:00.000Z'),
            endDate: new Date('2023-12-31T12:30:00.000Z'),
          }),
        ]),
      }),
    );
  });
});
