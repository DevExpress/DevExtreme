import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

test.describe('Resize all day panel appointments', () => {
  [true, false].forEach((rtlEnabled) => {
    test(`Resize all day appointment rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await createScheduler(page, {
        currentDate: new Date(2015, 1, 9),
        currentView: 'week',
        firstDayOfWeek: 0,
        rtlEnabled,
        height: 400,
        dataSource: [{
          text: 'Appointment',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 10),
          allDay: true,
        }],
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Appointment');
      const { left, right } = appointment.resizableHandle;
      const text = 'Appointment: February 9, 2015, All day';
      const startDateExtendedText = 'Appointment: February 8, 2015 - February 9, 2015, All day';
      const endDateExtendedText = 'Appointment: February 9, 2015 - February 10, 2015, All day';

      await dragToOffset(page, right, 100, 0);
      await expect(appointment.element)
        .toHaveAttribute('aria-label', rtlEnabled ? startDateExtendedText : endDateExtendedText);
      await dragToOffset(page, right, -100, 0);
      await expect(appointment.element).toHaveAttribute('aria-label', text);
      await dragToOffset(page, left, -100, 0);
      await expect(appointment.element)
        .toHaveAttribute('aria-label', rtlEnabled ? endDateExtendedText : startDateExtendedText);
      await dragToOffset(page, left, 100, 0);
      await expect(appointment.element).toHaveAttribute('aria-label', text);
    });
  });
});
