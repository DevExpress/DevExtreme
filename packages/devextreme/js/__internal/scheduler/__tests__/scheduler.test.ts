import {
  describe, expect, it, jest,
} from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Scheduler scrollTo', () => {
  it('should not log warnings when using scrollTo API', async () => {
    setupSchedulerTestEnvironment();
    const loggerWarnSpy = jest.spyOn(logger, 'warn');

    const { scheduler } = await createScheduler({
      dataSource: [{
        text: 'Meeting',
        startDate: new Date(2025, 0, 15, 9, 0),
        endDate: new Date(2025, 0, 15, 10, 0),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2025, 0, 15),
      startDayHour: 8,
      endDayHour: 18,
    });
    loggerWarnSpy.mockReset();

    const testDate = new Date(2025, 0, 16, 14, 0);

    scheduler.scrollTo(testDate, undefined, false);

    expect(loggerWarnSpy).toHaveBeenCalledTimes(0);
  });
});
