import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import fx from '../../../common/core/animation/fx';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

const CLASSES = {
  scheduler: 'dx-scheduler',
  workSpace: 'dx-scheduler-work-space',
  shaderTop: 'dx-scheduler-date-time-shader-top',
};

describe('Workspace', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should use group 0 width as fallback when groups are not rendered due to virtual scrolling (T1310524)', async () => {
    const resources = [
      { text: 'Room 1', id: 1, color: '#cb6bb2' },
      { text: 'Room 2', id: 2, color: '#56ca85' },
      { text: 'Room 3', id: 3, color: '#1e90ff' },
      { text: 'Room 4', id: 4, color: '#ff9747' },
      { text: 'Room 5', id: 5, color: '#ff6a00' },
      { text: 'Room 6', id: 6, color: '#ffc0cb' },
    ];

    const { scheduler } = await createScheduler({
      currentView: 'week',
      views: ['week'],
      groups: ['roomId'],
      resources: [{ fieldExpr: 'roomId', dataSource: resources, label: 'Room' }],
      dataSource: [
        {
          text: 'Meeting 1', startDate: new Date(2025, 9, 15, 9), endDate: new Date(2025, 9, 15, 10), roomId: 1,
        },
        {
          text: 'Meeting 2', startDate: new Date(2025, 9, 15, 9), endDate: new Date(2025, 9, 15, 10), roomId: 4,
        },
      ],
      startDayHour: 8,
      endDayHour: 18,
      currentDate: new Date(2025, 9, 15),
      height: 400,
      shadeUntilCurrentTime: true,
      scrolling: { mode: 'virtual' },
    });

    const workSpace = scheduler.getWorkSpace();
    const cellCount = workSpace._getCellCount();
    const lastGroupWidth = workSpace.getRoundedCellWidth(
      resources.length - 1,
      (resources.length - 1) * cellCount,
      cellCount,
    );

    expect(lastGroupWidth).toBeGreaterThan(0);
  });
});
