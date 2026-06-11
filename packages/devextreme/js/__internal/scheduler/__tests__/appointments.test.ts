import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import messageLocalization from '@js/common/core/localization/message';
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

      const tooltipAppointment = POM.tooltip.getAppointmentItem();
      expect(tooltipAppointment).not.toBeNull();

      const tooltipTitleElement = tooltipAppointment?.querySelector('.dx-tooltip-appointment-item-content-subject');
      expect(tooltipTitleElement?.textContent?.trim()).toBe('(No subject)');
    }
  });

  describe('Appointment aria attributes', () => {
    const deleteHotkeyText = messageLocalization.format('dxScheduler-hotkeysAriaDescription-delete');
    const homeEndHotkeysText = messageLocalization.format('dxScheduler-hotkeysAriaDescription-homeEnd');

    it('should have correct aria-describedby when editing = false', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        editing: false,
      });

      const appointment = POM.getAppointment();
      expect(appointment.getAriaDescription()).toBe(homeEndHotkeysText);
    });

    it('should have correct aria-describedby when allowUpdating = true', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        editing: {
          allowUpdating: true,
        },
      });

      const appointment = POM.getAppointment();
      expect(appointment.getAriaDescription()).toBe(`${deleteHotkeyText}; ${homeEndHotkeysText}`);
    });

    it('should have correct aria-describedby when allowUpdating = true and allowDeleting = false', async () => {
      const { POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        editing: {
          allowUpdating: true,
          allowDeleting: false,
        },
      });

      const appointment = POM.getAppointment();
      expect(appointment.getAriaDescription()).toBe(homeEndHotkeysText);
    });

    it('should have correct aria-describedby when allowDeleting is updated', async () => {
      const { scheduler, POM } = await createScheduler({
        dataSource: [{
          text: 'Appointment 1',
          startDate: new Date(2015, 1, 9, 8),
          endDate: new Date(2015, 1, 9, 9),
        }],
        currentView: 'day',
        currentDate: new Date(2015, 1, 9, 8),
        editing: {
          allowUpdating: true,
          allowDeleting: false,
        },
      });

      scheduler.option('editing.allowDeleting', true);
      await new Promise(process.nextTick);

      const appointment = POM.getAppointment();
      expect(appointment.getAriaDescription()).toBe(`${deleteHotkeyText}; ${homeEndHotkeysText}`);
    });
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

    describe('Home and End hotkeys', () => {
      it('should focus first appointment on Home', async () => {
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
          currentView: 'week',
          currentDate: new Date(2015, 1, 9),
        });

        const appointment = POM.getAppointments()[2];

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
