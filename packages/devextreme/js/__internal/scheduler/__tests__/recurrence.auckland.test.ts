/**
 * @timezone Pacific/Auckland
 */

import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

describe('Recurrence appointments', () => {
  it('Weekly appointment should show in correct day and hours (T1185479)', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        startDate: new Date(2023, 3, 27, 1),
        endDate: new Date(2023, 3, 27, 2),
        allDay: false,
        text: 'Weekly meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
      }],
      currentView: 'week',
      currentDate: new Date(2023, 3, 27),
    });

    const appointment = POM.getAppointment();
    expect(appointment.getAriaLabel()).toBe('Weekly meeting: April 27, 2023, 1:00 AM - 2:00 AM');
    expect(appointment.getDisplayDate()).toBe('1:00 AM - 2:00 AM');
  });
});
