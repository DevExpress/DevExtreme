import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/m_mock_scheduler';

describe('Appointments', () => {
  afterEach(() => {
    const $scheduler = $('.dx-scheduler');
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

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

  it('should display "(No subject)" in tooltip for appointments without title', async () => {
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

  it('should have aria-describedby attr', async () => {
    setupSchedulerTestEnvironment();
    const { POM } = await createScheduler({
      dataSource: [{
        text: 'Appointment 1',
        startDate: new Date(2015, 1, 9, 8),
        endDate: new Date(2015, 1, 9, 9),
      }],
      currentView: 'day',
      currentDate: new Date(2015, 1, 9, 8),
    });

    const appointment = POM.getAppointment();
    expect(appointment.element?.hasAttribute('aria-describedby')).toBe(true);
  });

  describe('Keyboard Navigation', () => {
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

    it('should focus first appointment on Home', async () => {
      setupSchedulerTestEnvironment();
      const { POM, keydown } = await createScheduler({
        dataSource,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
      });

      const appointments = POM.getAppointments();
      const firstAppointment = appointments[0];
      const lastAppointment = appointments[2];

      lastAppointment.element.focus();
      keydown(lastAppointment.element, 'Home');

      expect(firstAppointment.isFocused()).toBe(true);
      expect(lastAppointment.isFocused()).toBe(false);
    });

    it('should focus last appointment on End', async () => {
      setupSchedulerTestEnvironment();
      const { POM, keydown } = await createScheduler({
        dataSource,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
      });

      const appointments = POM.getAppointments();
      const firstAppointment = appointments[0];
      const lastAppointment = appointments[2];

      firstAppointment.element.focus();
      keydown(firstAppointment.element, 'End');

      expect(firstAppointment.isFocused()).toBe(false);
      expect(lastAppointment.isFocused()).toBe(true);
    });

    it('should not change focus when Home is pressed on the first appointment', async () => {
      setupSchedulerTestEnvironment();
      const { POM, keydown } = await createScheduler({
        dataSource,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
      });

      const appointments = POM.getAppointments();
      const firstAppointment = appointments[0];

      firstAppointment.element.focus();
      keydown(firstAppointment.element, 'Home');

      expect(firstAppointment.isFocused()).toBe(true);
    });

    it('should not change focus when End is pressed on the last appointment', async () => {
      setupSchedulerTestEnvironment();
      const { POM, keydown } = await createScheduler({
        dataSource,
        currentView: 'day',
        currentDate: new Date(2015, 1, 9),
      });

      const appointments = POM.getAppointments();
      const lastAppointment = appointments[2];

      lastAppointment.element.focus();
      keydown(lastAppointment.element, 'End');

      expect(lastAppointment.isFocused()).toBe(true);
    });
  });
});
