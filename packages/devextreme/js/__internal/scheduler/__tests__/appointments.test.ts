import {
  describe, expect, it,
} from '@jest/globals';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Appointments', () => {
  it('All-day appointment should not be resizable if current view is "day"', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
        allDay: true,
      }],
      currentView: 'day',
      currentDate: new Date(2015, 1, 9, 8),
    });

    const appointment = POM.getAppointment();
    expect(appointment.element && !appointment.element.classList.contains('dx-resizable')).toBe(true);
  });

  it('should display "(No subject)" for appointments without title', async () => {
    setupSchedulerTestEnvironment({ height: 200 });
    const appointmentWithoutTitle = {
      startDate: new Date(2017, 4, 9, 9, 30),
      endDate: new Date(2017, 4, 9, 11),
      text: '',
    };

    const { POM } = await createScheduler({
      dataSource: [appointmentWithoutTitle],
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2017, 4, 25),
      firstDayOfWeek: 1,
      startDayHour: 9,
      height: 600,
      width: 600,
    });

    const appointment = POM.getAppointment();
    expect(appointment.getText()).toBe('(No subject)');
  });
});
