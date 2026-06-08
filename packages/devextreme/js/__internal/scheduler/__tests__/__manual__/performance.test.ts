import {
  describe, it,
} from '@jest/globals';

import { createScheduler } from '../__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from '../__mock__/mock_scheduler';

describe.skip('scheduler manual testing', () => {
  it('should work with good performance for 1000 recurrence appointments', async () => {
    const startDate = new Date('2023-12-01T00:00:00.000Z');
    const endDate = new Date('2023-12-01T01:00:00.000Z');
    const delta = 60 * 60 * 1000; // 1 hour in milliseconds
    const config = {
      dataSource: new Array(1000).fill(null).map((_, idx) => ({
        startDate: new Date(startDate.getTime() + delta * idx),
        endDate: new Date(endDate.getTime() + delta * idx),
        recurrenceRule: 'FREQ=DAILY',
        text: `${idx + 1}`,
      })),
      currentDate: '2023-12-31',
      views: [
        'day',
        'week',
        'workWeek',
        'month',
        'timelineDay',
        'timelineWeek',
        'timelineWorkWeek',
        'timelineMonth',
      ],
      currentView: 'timelineWeek',
    };

    setupSchedulerTestEnvironment();
    await createScheduler(config);

    // first render should be 720ms
  });

  it('should work with good performance for 30000 appointments grouped by 100 resources and virtualization', async () => {
    const resources = new Array(100)
      .fill(null)
      .map((_, idx) => ({
        id: idx,
        text: `Resource ${idx}`,
      }));

    const startDate = new Date('2024-01-01T00:00:00');
    const endDate = new Date('2024-01-01T01:00:00');
    const delta = 1200 * 1000;
    const config = {
      dataSource: new Array(100)
        .fill(null)
        .map((_, index) => new Array(100).fill(null)
          // eslint-disable-next-line @typescript-eslint/naming-convention
          .map((_item, index2) => ({
            startDate: new Date(startDate.getTime() + delta * index),
            endDate: new Date(endDate.getTime() + delta * index),
            text: index,
            resourceId: index2,
          }))).flat(),
      currentDate: '2023-12-30',
      views: [
        {
          type: 'week',
          groupOrientation: 'vertical',
        },
      ],
      currentView: 'week',
      groups: ['resourceId'],
      resources: [
        {
          fieldExpr: 'resourceId',
          allowMultiple: false,
          dataSource: resources,
          label: 'My resource',
        },
      ],
      scrolling: {
        mode: 'virtual',
      },
    };

    setupSchedulerTestEnvironment();
    await createScheduler(config);

    // first render should be 400ms
    // each scrolling cycle should be 100-220ms
  });
});
