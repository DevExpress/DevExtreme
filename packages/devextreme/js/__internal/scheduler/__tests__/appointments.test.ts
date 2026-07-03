import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

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

  it('should display "(No subject)" for appointments without title', async () => {
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

  it('should display "(No subject)" in tooltip for appointments without title', async () => {
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
    if (appointment.element) {
      jest.useFakeTimers();
      appointment.element.click();
      jest.advanceTimersByTime(1000);

      const tooltipAppointment = POM.getTooltipAppointment();
      expect(tooltipAppointment).not.toBeNull();

      const tooltipTitleElement = tooltipAppointment?.querySelector('.dx-tooltip-appointment-item-content-subject');
      expect(tooltipTitleElement?.textContent?.trim()).toBe('(No subject)');
    }
  });

  describe('Keyboard Navigation', () => {
    describe('Delete hotkey', () => {
      it('should delete single occurrence on Delete and clicking \'Delete appointment\'', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [{
            text: 'Recurring Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            recurrenceRule: 'FREQ=DAILY',
          }],
          currentView: 'week',
          currentDate: new Date(2015, 1, 9),
        });

        const initialCount = POM.getAppointments().length;
        const appointment = POM.getAppointments()[2];

        appointment.element.focus();
        keydown(appointment.element, 'Delete');

        POM.popup.deleteAppointmentButton.click();

        expect(POM.getAppointments().length).toBe(initialCount - 1);
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

    describe('Focus after Delete', () => {
      const dataSource = [
        {
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        },
        {
          text: 'Appointment 2',
          startDate: new Date(2015, 1, 9, 10),
          endDate: new Date(2015, 1, 9, 11),
        },
        {
          text: 'Appointment 3',
          startDate: new Date(2015, 1, 9, 12),
          endDate: new Date(2015, 1, 9, 13),
        },
      ];

      it('should focus next appointment after deleting via Delete key', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [...dataSource],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointment('Appointment 2');

        appointment.element?.focus();
        keydown(appointment.element as Element, 'Delete');
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(2);
        expect(POM.getAppointment('Appointment 3').isFocused()).toBe(true);
      });

      it('should focus previous appointment after deleting the last one', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [...dataSource],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointment('Appointment 3');

        appointment.element?.focus();
        keydown(appointment.element as Element, 'Delete');
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(2);
        expect(POM.getAppointment('Appointment 2').isFocused()).toBe(true);
      });

      it('should focus toolbar element when no appointments remain after delete', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [dataSource[0]],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointment('Appointment 1');

        appointment.element?.focus();
        keydown(appointment.element as Element, 'Delete');
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(0);
        expect(POM.toolbar.element.contains(document.activeElement)).toBe(true);
      });

      it('should focus workspace when no appointments remain after delete and toolbar is hidden', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [dataSource[0]],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
          toolbar: { items: [] },
        });

        const appointment = POM.getAppointment('Appointment 1');

        appointment.element?.focus();
        keydown(appointment.element as Element, 'Delete');
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(0);
        expect(document.activeElement).toBe(POM.getWorkspace());
      });

      it('should keep focus on appointment when deleting is canceled', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [...dataSource],
          currentView: 'day',
          currentDate: new Date(2015, 1, 9),
          onAppointmentDeleting: (e) => {
            e.cancel = true;
          },
        });

        const appointment = POM.getAppointment('Appointment 2');

        appointment.element?.focus();
        keydown(appointment.element as Element, 'Delete');
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(3);
        expect(document.activeElement).toBe(appointment.element);
      });

      it('should focus next occurrence after deleting recurring occurrence via dialog', async () => {
        const { POM, keydown } = await createScheduler({
          dataSource: [{
            text: 'Recurring Appointment',
            startDate: new Date(2015, 1, 9, 8),
            endDate: new Date(2015, 1, 9, 9),
            recurrenceRule: 'FREQ=DAILY',
          }],
          currentView: 'week',
          currentDate: new Date(2015, 1, 9),
        });

        const initialCount = POM.getAppointments().length;
        const appointment = POM.getAppointments()[2];

        appointment.element.focus();
        keydown(appointment.element, 'Delete');
        POM.popup.deleteAppointmentButton.click();
        await new Promise(process.nextTick);

        expect(POM.getAppointments().length).toBe(initialCount - 1);
        expect(POM.getAppointments()[2].isFocused()).toBe(true);
      });
    });
  });
});
