import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Appointments', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });
  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('All-day appointment should not be resizable if current view is "day"', async () => {
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

  describe('Keyboard Navigation', () => {
    describe('Delete hotkey', () => {
      it('should delete single occurrence on Delete and clicking \'Delete appointment\'', async () => {
        const onAppointmentUpdated = jest.fn();
        const { POM, keydown } = await createScheduler({
          dataSource: [{
            text: 'Recurring Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            recurrenceRule: 'FREQ=DAILY',
          }],
          onAppointmentUpdated,
          currentView: 'week',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointments()[0];

        appointment.element.focus();
        keydown(appointment.element, 'Delete');

        POM.popup.deleteAppointmentButton.click();

        expect(onAppointmentUpdated).toHaveBeenCalled();
        expect((onAppointmentUpdated.mock.calls[0][0] as any).appointmentData).toEqual(
          expect.objectContaining({
            text: 'Recurring Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            recurrenceRule: 'FREQ=DAILY',
            recurrenceException: expect.stringContaining('20150209'),
          }),
        );
      });

      it('should delete all occurrences on delete and clicking \'Delete series\'', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [{
            text: 'Recurring Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            recurrenceRule: 'FREQ=DAILY',
          }],
          editing: true,
          currentView: 'week',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointments()[0];

        appointment.element.focus();
        keydown(appointment.element, 'Delete');

        POM.popup.deleteSeriesButton.click();

        expect(POM.getAppointments().length).toBe(0);
      });

      it('should delete appointment on Delete', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [{
            text: 'Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
          }],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
        });

        const initialCount = POM.getAppointments().length;
        const appointment = POM.getAppointments()[0];

        appointment.element.focus();
        keydown(appointment.element, 'Delete');

        expect(POM.getAppointments().length).toBe(initialCount - 1);
      });
    });
  });
});
