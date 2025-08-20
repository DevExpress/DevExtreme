import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Appointments', () => {
  it('All-day appointment should not be resizable if current view is "day"', async () => {
    setupSchedulerTestEnvironment();
    const { container } = await createScheduler({
      dataSource: [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
        allDay: true,
      }],
      currentView: 'day',
      currentDate: new Date(2015, 1, 9, 8),
    });

    const appointment = container.querySelector('.dx-scheduler-appointment');
    expect(appointment && !appointment.classList.contains('dx-resizable')).toBe(true);
  });
});
