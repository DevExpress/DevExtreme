import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { loadMessages, locale } from '@js/localization';
import type { GroupItem } from '@js/ui/form';
import { fireEvent } from '@testing-library/dom';
import DOMComponent from '@ts/core/widget/dom_component';

import fx from '../../../common/core/animation/fx';
import {
  createAppointmentPopup,
  disposeAppointmentPopups,
} from '../__tests__/__mock__/create_appointment_popup';
import { setupSchedulerTestEnvironment } from '../__tests__/__mock__/m_mock_scheduler';

describe('Isolated AppointmentPopup environment', () => {
  beforeEach(() => {
    fx.off = true;
  });

  afterEach(() => {
    disposeAppointmentPopups();
    fx.off = false;
  });

  it('should render popup with form fields', async () => {
    const { POM } = await createAppointmentPopup();

    expect(POM.element).toBeTruthy();
    expect(POM.dxForm).toBeTruthy();
  });

  it('should display appointment data in form', async () => {
    const { POM } = await createAppointmentPopup({
      appointmentData: {
        text: 'My Meeting',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
    });

    expect(POM.getInputValue('subjectEditor')).toBe('My Meeting');
  });

  it('should have Save and Cancel buttons', async () => {
    const { POM } = await createAppointmentPopup();

    expect(POM.saveButton).toBeTruthy();
    expect(POM.cancelButton).toBeTruthy();
  });

  it('should call onSave callback on Save click', async () => {
    const { POM, callbacks } = await createAppointmentPopup({
      appointmentData: {
        text: 'New Appointment',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
    });

    POM.saveButton.click();
    await new Promise(process.nextTick);

    expect(callbacks.onSave).toHaveBeenCalledTimes(1);
    expect(callbacks.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'New Appointment',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      }),
    );
  });

  it('should not call addAppointment or updateAppointment directly', async () => {
    const { POM, callbacks } = await createAppointmentPopup({
      appointmentData: {
        text: 'Test',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
    });

    POM.saveButton.click();
    await new Promise(process.nextTick);

    expect(callbacks.addAppointment).not.toHaveBeenCalled();
    expect(callbacks.updateAppointment).not.toHaveBeenCalled();
  });

  it('should display title from config', async () => {
    const { POM } = await createAppointmentPopup({
      title: 'Edit Appointment',
    });

    const titleElement = POM.element.querySelector('.dx-toolbar-label');
    expect(titleElement?.textContent).toBe('Edit Appointment');
  });

  it('should hide Save button when readOnly is true', async () => {
    const { POM } = await createAppointmentPopup({
      readOnly: true,
    });

    const saveButtons = POM.element.querySelectorAll('.dx-popup-done');
    expect(saveButtons.length).toBe(0);
  });

  it('should show Save button when readOnly is false', async () => {
    const { POM } = await createAppointmentPopup({
      readOnly: false,
    });

    expect(POM.saveButton).toBeTruthy();
  });

  it('should hide popup on Cancel click', async () => {
    const { popup, POM } = await createAppointmentPopup();
    const visibleBefore = popup.visible;

    POM.cancelButton.click();

    const visibleAfter = popup.visible;

    expect(visibleBefore).toBe(true);
    expect(visibleAfter).toBe(false);
  });

  it('should support composite onSave for exclude-from-series scenario', async () => {
    const updateAppointment = jest.fn();
    const addAppointment = jest.fn<(appointment: Record<string, unknown>) => Promise<void>>(
      () => Promise.resolve(),
    );

    const sourceAppointment = { text: 'Series', recurrenceRule: 'FREQ=DAILY' };
    const updatedAppointment = { text: 'Series', recurrenceException: '20210426' };

    const onSave = jest.fn((newAppointment: Record<string, unknown>) => {
      updateAppointment(sourceAppointment, updatedAppointment);
      return addAppointment(newAppointment);
    });

    const { POM } = await createAppointmentPopup({
      appointmentData: {
        text: 'Single occurrence',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
      title: 'Edit Appointment',
      onSave,
    });

    POM.saveButton.click();
    await new Promise(process.nextTick);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(updateAppointment).toHaveBeenCalledWith(sourceAppointment, updatedAppointment);
    expect(addAppointment).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Single occurrence' }),
    );
  });

  describe('allDay switch', () => {
    const commonAppointment = {
      text: 'common-app',
      startDate: new Date(2017, 4, 9, 9, 30),
      endDate: new Date(2017, 4, 9, 11),
    };
    const allDayAppointment = {
      text: 'all-day-app',
      startDate: new Date(2017, 4, 1),
      endDate: new Date(2017, 4, 1),
      allDay: true,
    };

    it('should be turned on when opening allDay appointment', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: allDayAppointment });

      expect(POM.getInputValue('allDayEditor')).toBe('true');
    });

    it('should be turned off when opening non-allDay appointment', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: commonAppointment });

      expect(POM.getInputValue('allDayEditor')).toBe('false');
    });

    it('should hide time editors when switched on', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: commonAppointment });

      const startTimeVisibleBefore = POM.isInputVisible('startTimeEditor');
      const endTimeVisibleBefore = POM.isInputVisible('endTimeEditor');

      POM.getInput('allDayEditor').click();

      const startTimeVisibleAfter = POM.isInputVisible('startTimeEditor');
      const endTimeVisibleAfter = POM.isInputVisible('endTimeEditor');

      expect(startTimeVisibleBefore).toBe(true);
      expect(endTimeVisibleBefore).toBe(true);
      expect(startTimeVisibleAfter).toBe(false);
      expect(endTimeVisibleAfter).toBe(false);
    });

    it('should show time editors when switched off', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: allDayAppointment });

      const startTimeVisibleBefore = POM.isInputVisible('startTimeEditor');
      const endTimeVisibleBefore = POM.isInputVisible('endTimeEditor');

      POM.getInput('allDayEditor').click();

      const startTimeVisibleAfter = POM.isInputVisible('startTimeEditor');
      const endTimeVisibleAfter = POM.isInputVisible('endTimeEditor');

      expect(startTimeVisibleBefore).toBe(false);
      expect(endTimeVisibleBefore).toBe(false);
      expect(startTimeVisibleAfter).toBe(true);
      expect(endTimeVisibleAfter).toBe(true);
    });

    it('should reset start to startDayHour and end via getCalculatedEndDate when switched off', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: commonAppointment,
        startDayHour: 9,
      });

      POM.getInput('allDayEditor').click();
      POM.getInput('allDayEditor').click();

      expect(POM.getInputValue('startDateEditor')).toBe('5/9/2017');
      expect(POM.getInputValue('startTimeEditor')).toBe('9:00 AM');
      expect(POM.getInputValue('endDateEditor')).toBe('5/9/2017');
      expect(POM.getInputValue('endTimeEditor')).toBe('10:00 AM');
    });

    it('should reset to date-only values when switched on after toggling off', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: allDayAppointment });

      POM.getInput('allDayEditor').click();
      POM.getInput('allDayEditor').click();

      expect(POM.getInputValue('startDateEditor')).toBe('5/1/2017');
      expect(POM.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.getInputValue('endDateEditor')).toBe('5/1/2017');
      expect(POM.isInputVisible('endTimeEditor')).toBeFalsy();
    });
  });

  describe('startDate/endDate editors behavior', () => {
    const testAppointment = {
      text: 'test app',
      startDate: new Date(2017, 4, 9, 9, 30),
      endDate: new Date(2017, 4, 9, 11),
    };

    it('should update endDate when startDate is changed to a value greater than endDate', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('startDateEditor', new Date(2017, 4, 10));

      expect(POM.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/10/2017');
      expect(POM.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should update endDate when startTime is changed to a value greater than endDate time', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('startTimeEditor', new Date(2017, 4, 9, 12));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('endTimeEditor')).toEqual('1:30 PM');
    });

    it('should update startDate when endDate is changed to a value less than startDate', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('endDateEditor', new Date(2017, 4, 8));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/8/2017');
      expect(POM.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should update startDate when endTime is changed to a value less than startDate time', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('endTimeEditor', new Date(2017, 4, 9, 9, 0));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('startTimeEditor')).toEqual('7:30 AM');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/9/2017');
    });

    it('should not update endDate when startDate is changed to a value less than endDate', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('startDateEditor', new Date(2017, 4, 8));

      expect(POM.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update endDate when startTime is changed to a value less than endDate time', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('startTimeEditor', new Date(2017, 4, 9, 10, 0));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update startDate when endDate is changed to a value greater than startDate', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('endDateEditor', new Date(2017, 4, 10));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.getInputValue('endTimeEditor')).toEqual('11:00 AM');
    });

    it('should not update startDate when endTime is changed to a value greater than startDate time', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: testAppointment });

      POM.setInputValue('endTimeEditor', new Date(2017, 4, 9, 12));

      expect(POM.getInputValue('startDateEditor')).toEqual('5/9/2017');
      expect(POM.getInputValue('startTimeEditor')).toEqual('9:30 AM');
      expect(POM.getInputValue('endDateEditor')).toEqual('5/9/2017');
    });
  });

  it('should propagate firstDayOfWeek to editor calendars and recurrence week day buttons', async () => {
    const { POM } = await createAppointmentPopup({
      appointmentData: {
        text: 'common-app',
        startDate: new Date(2017, 4, 9, 9, 30),
        endDate: new Date(2017, 4, 9, 11),
      },
      firstDayOfWeek: 1,
    });
    POM.selectRepeatValue('weekly');

    const startDateFDOW = POM.dxForm.getEditor('startDateEditor')?.option('calendarOptions.firstDayOfWeek');
    const endDateFDOW = POM.dxForm.getEditor('endDateEditor')?.option('calendarOptions.firstDayOfWeek');
    const recurrenceStartFDOW = POM.dxForm.getEditor('recurrenceStartDateEditor')?.option('calendarOptions.firstDayOfWeek');
    const weekDayButtonsText = POM.recurrenceWeekDayButtons.textContent;

    expect(startDateFDOW).toBe(1);
    expect(endDateFDOW).toBe(1);
    expect(recurrenceStartFDOW).toBe(1);
    expect(weekDayButtonsText).toBe('MTWTFSS');
  });

  describe('Validation', () => {
    const commonAppointment = {
      text: 'common-app',
      startDate: new Date(2017, 4, 9, 9, 30),
      endDate: new Date(2017, 4, 9, 11),
    };

    it.each([
      'startDateEditor', 'startTimeEditor', 'endDateEditor', 'endTimeEditor',
    ])('should block save when %s is empty', async (editorName) => {
      const { POM, callbacks } = await createAppointmentPopup({
        appointmentData: { ...commonAppointment },
      });

      POM.setInputValue(editorName, null);
      POM.saveButton.click();
      await Promise.resolve();

      expect(callbacks.onSave).not.toHaveBeenCalled();
    });

    it.each([
      'startTimeEditor', 'endDateEditor', 'endTimeEditor',
    ])('should block save in recurrence form when %s is empty', async (editorName) => {
      const { POM, callbacks } = await createAppointmentPopup({
        appointmentData: { ...commonAppointment },
      });

      POM.setInputValue(editorName, null);
      POM.selectRepeatValue('daily');
      POM.saveButton.click();
      await Promise.resolve();

      expect(callbacks.onSave).not.toHaveBeenCalled();
    });

    it('should not block save in recurrence form when startDateEditor is empty', async () => {
      const { POM, callbacks } = await createAppointmentPopup({
        appointmentData: { ...commonAppointment },
      });

      POM.setInputValue('startDateEditor', null);
      POM.selectRepeatValue('daily');

      const recurrenceStartDate = POM.getInputValue('recurrenceStartDateEditor');

      expect(recurrenceStartDate).toBe('5/9/2017');

      POM.saveButton.click();
      await Promise.resolve();

      expect(callbacks.onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Recurrence Form', () => {
    const recurringAppointment = {
      text: 'recurring-app',
      startDate: new Date(2017, 4, 1, 9, 30),
      endDate: new Date(2017, 4, 1, 11),
      recurrenceRule: 'FREQ=DAILY;COUNT=5',
    };

    const baseAppointment = {
      text: 'Meeting',
      startDate: new Date(2017, 4, 1, 10, 30),
      endDate: new Date(2017, 4, 1, 11),
    };

    it('should allow opening recurrence settings when allowUpdating is false', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...recurringAppointment },
        editing: { allowUpdating: false },
        readOnly: true,
      });

      const visibleBefore = POM.isRecurrenceGroupVisible();

      POM.recurrenceSettingsButton.click();

      const visibleAfter = POM.isRecurrenceGroupVisible();

      expect(visibleBefore).toBe(false);
      expect(visibleAfter).toBe(true);
    });

    it('should close repeat selectbox popup when navigating to recurrence group via settings button', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...recurringAppointment },
      });

      const repeatEditor = POM.dxForm.getEditor('repeatEditor');
      POM.getInput('repeatEditor').click();

      const openedBefore = repeatEditor?.option('opened');

      POM.recurrenceSettingsButton.click();

      const openedAfter = repeatEditor?.option('opened');

      expect(openedBefore).toBe(true);
      expect(openedAfter).toBe(false);
    });

    it('should have disabled week day buttons when allowUpdating is false', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...recurringAppointment, recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE,TU,TH,FR,SA' },
        editing: { allowUpdating: false },
        readOnly: true,
      });

      POM.recurrenceSettingsButton.click();

      const disabledButtons = POM.recurrenceWeekDayButtons.querySelectorAll('.dx-button.dx-state-disabled');

      expect(disabledButtons.length).toBe(7);
    });

    it('should show recurrence group when repeat value is selected', async () => {
      const { POM } = await createAppointmentPopup();

      POM.selectRepeatValue('weekly');

      expect(POM.isMainGroupVisible()).toBe(false);
      expect(POM.isRecurrenceGroupVisible()).toBe(true);
    });

    it('should restore main group when back button is clicked', async () => {
      const { POM } = await createAppointmentPopup();
      POM.selectRepeatValue('weekly');

      POM.backButton.click();

      expect(POM.isMainGroupVisible()).toBe(true);
      expect(POM.isRecurrenceGroupVisible()).toBe(false);
    });

    it('should set inert attribute on hidden group when switching forms', async () => {
      const { POM } = await createAppointmentPopup();

      POM.selectRepeatValue('weekly');

      expect(POM.mainGroup.getAttribute('inert')).toBe('true');
      expect(POM.recurrenceGroup.getAttribute('inert')).toBeNull();

      POM.backButton.click();

      expect(POM.mainGroup.getAttribute('inert')).toBeNull();
      expect(POM.recurrenceGroup.getAttribute('inert')).toBe('true');
    });

    it('should adjust popup height when switching to recurrence form', async () => {
      const { POM } = await createAppointmentPopup();

      POM.selectRepeatValue('weekly');

      expect(typeof POM.component.option('height')).toBe('number');
    });

    it('should reset popup height to auto when returning to main form', async () => {
      const { POM } = await createAppointmentPopup();
      POM.selectRepeatValue('weekly');

      POM.backButton.click();

      expect(POM.component.option('height')).toBe('auto');
    });

    it('should open main form when opening recurring appointment', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...recurringAppointment },
      });

      expect(POM.isMainGroupVisible()).toBe(true);
      expect(POM.isRecurrenceGroupVisible()).toBe(false);
    });

    describe('State', () => {
      it('should have correct input values for appointment with hour frequency', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=HOURLY;INTERVAL=2;COUNT=10' },
        });

        expect(POM.getInputValue('repeatEditor')).toBe('Hourly');

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Hour(s)');
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with daily frequency', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=10' },
        });

        expect(POM.getInputValue('repeatEditor')).toBe('Daily');

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Day(s)');
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with week frequency', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR;COUNT=10' },
        });

        expect(POM.getInputValue('repeatEditor')).toBe('Weekly');

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Week(s)');
        expect(POM.getWeekDaysSelection()).toEqual([false, true, false, true, false, true, false]);
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with monthly frequency', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=MONTHLY;INTERVAL=2;BYMONTHDAY=1;COUNT=10' },
        });

        expect(POM.getInputValue('repeatEditor')).toBe('Monthly');

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Month(s)');
        expect(POM.getInputValue('recurrenceDayOfMonthEditor')).toBe('1');
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('should have correct input values for appointment with yearly frequency', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=YEARLY;INTERVAL=2;BYMONTHDAY=1;BYMONTH=5;COUNT=10' },
        });

        expect(POM.getInputValue('repeatEditor')).toBe('Yearly');

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceStartDateEditor')).toBe('5/1/2017');
        expect(POM.getInputValue('recurrenceCountEditor')).toBe('2');
        expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Year(s)');
        expect(POM.getInputValue('recurrenceDayOfYearDayEditor')).toBe('1');
        expect(POM.getInputValue('recurrenceDayOfYearMonthEditor')).toBe('May');
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });

      it('T1325870: should use current locale for recurrence editors after locale change', async () => {
        const currentLocale = locale();

        loadMessages({
          de: {
            'dxScheduler-recurrenceYearly': 'custom yearly',
            'dxScheduler-recurrenceRepeatYearly': 'custom repeat yearly',
          },
        });
        locale('de');

        try {
          const { POM } = await createAppointmentPopup({
            appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=YEARLY;INTERVAL=2;BYMONTHDAY=1;BYMONTH=5;COUNT=10' },
          });

          expect(POM.getInputValue('repeatEditor')).toBe('custom yearly');

          POM.recurrenceSettingsButton.click();

          expect(POM.getInputValue('recurrencePeriodEditor')).toBe('Custom repeat yearly');
          expect(POM.getInputValue('recurrenceDayOfYearMonthEditor')).toBe('Mai');
        } finally {
          locale(currentLocale);
        }
      });

      it('should have correct input values for appointment with no end', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=DAILY;INTERVAL=2' },
        });

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceRepeatEndEditor')).toBe('never');
      });

      it('should have correct input values for appointment with end by date', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=DAILY;INTERVAL=2;UNTIL=20170601T000000Z' },
        });

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceRepeatEndEditor')).toBe('until');
        expect(POM.getInputValue('recurrenceEndUntilEditor')).toBe('6/1/2017');
      });

      it('should have correct input values for appointment with end by count', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=10' },
        });

        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceRepeatEndEditor')).toBe('count');
        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe('10 occurrence(s)');
      });
    });

    describe('Repeat End Values Preservation', () => {
      it('should preserve count value when switching between recurrence types', async () => {
        const testCount = 15;
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment },
        });

        POM.selectRepeatValue('daily');

        POM.setInputValue('recurrenceRepeatEndEditor', 'count');
        POM.setInputValue('recurrenceEndCountEditor', testCount);

        POM.backButton.click();

        POM.selectRepeatValue('weekly');
        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceEndCountEditor')).toBe(`${testCount} occurrence(s)`);
      });

      it('should preserve until value when switching between recurrence types', async () => {
        const testUntilDate = new Date(2017, 5, 16);
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...baseAppointment },
        });

        POM.selectRepeatValue('daily');

        POM.setInputValue('recurrenceRepeatEndEditor', 'until');
        POM.setInputValue('recurrenceEndUntilEditor', testUntilDate);

        POM.backButton.click();

        POM.selectRepeatValue('weekly');
        POM.recurrenceSettingsButton.click();

        expect(POM.getInputValue('recurrenceEndUntilEditor')).toBe('6/16/2017');
      });
    });

    describe('Repeat End Editors Disabled State', () => {
      it.each([
        ['never', 'FREQ=DAILY'],
        ['until', 'FREQ=DAILY;UNTIL=20170615T000000Z'],
        ['count', 'FREQ=DAILY;COUNT=10'],
      ] as ['never' | 'until' | 'count', string][])(
        'should set correct disabled state when repeatEnd is %s',
        async (repeatEndValue, recurrenceRule) => {
          const { POM } = await createAppointmentPopup({
            appointmentData: { ...baseAppointment, recurrenceRule },
          });

          POM.recurrenceSettingsButton.click();

          const untilEditor = POM.dxForm.getEditor('recurrenceEndUntilEditor');
          const countEditor = POM.dxForm.getEditor('recurrenceEndCountEditor');

          expect(untilEditor?.option('disabled')).toBe(repeatEndValue !== 'until');
          expect(countEditor?.option('disabled')).toBe(repeatEndValue !== 'count');
        },
      );
    });

    describe('FrequencyEditor focus', () => {
      afterEach(() => {
        jest.useRealTimers();
      });

      it('should not be focused when value is changed via API', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...recurringAppointment },
        });

        POM.recurrenceSettingsButton.click();

        const frequencyEditor = POM.dxForm.getEditor('recurrencePeriodEditor');
        const frequencyEditorInputElement = POM.getInput('recurrencePeriodEditor');

        frequencyEditor?.option('value', 'yearly');

        expect(document.activeElement).not.toBe(frequencyEditorInputElement);
      });

      it('should be focused when value is changed via keyboard', async () => {
        const { POM } = await createAppointmentPopup({
          appointmentData: { ...recurringAppointment },
        });

        POM.recurrenceSettingsButton.click();

        const frequencyEditorInputElement = POM.getInput('recurrencePeriodEditor');

        frequencyEditorInputElement.click();
        jest.useFakeTimers();
        fireEvent.keyDown(frequencyEditorInputElement, { key: 'ArrowDown' });
        jest.runAllTimers();

        expect(document.activeElement).toBe(frequencyEditorInputElement);
      });
    });

    it('should set animation offset CSS variable when switching to recurrence form', async () => {
      const originalGetComputedStyle = window.getComputedStyle;
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      const originalGetClientRects = Element.prototype.getClientRects;
      const originalIsVisible = DOMComponent.prototype._isVisible;

      try {
        setupSchedulerTestEnvironment({
          height: 600,
          classRects: {
            'dx-form': { top: 10 },
            'dx-scheduler-form-main-group': { top: 60 },
          },
        });

        const { POM } = await createAppointmentPopup();
        POM.selectRepeatValue('weekly');

        const animationTop = POM.dxForm.$element()[0].style.getPropertyValue('--dx-scheduler-animation-top');
        expect(animationTop).toBe('50px');
      } finally {
        window.getComputedStyle = originalGetComputedStyle;
        Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        Element.prototype.getClientRects = originalGetClientRects;
        DOMComponent.prototype._isVisible = originalIsVisible;
      }
    });

    it('T1318550: editors with hidden outer label must have labelMode: hidden', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...baseAppointment, recurrenceRule: 'FREQ=YEARLY;BYMONTHDAY=1;BYMONTH=5' },
      });

      POM.recurrenceSettingsButton.click();

      const editorsWithHiddenLabel = [
        'recurrencePeriodEditor',
        'recurrenceRepeatEndEditor',
        'recurrenceEndUntilEditor',
        'recurrenceEndCountEditor',
        'recurrenceDayOfYearDayEditor',
      ];

      editorsWithHiddenLabel.forEach((name) => {
        expect(POM.dxForm.getEditor(name)?.option('labelMode')).toBe('hidden');
      });
    });
  });

  describe('Customize form items', () => {
    const appointment = {
      text: 'Meeting',
      startDate: new Date(2017, 4, 9, 9, 30),
      endDate: new Date(2017, 4, 9, 11),
    };

    it('should use default form items when editing.form.items is not configured', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: { ...appointment } });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems.length).toBeGreaterThan(0);
    });

    it('should produce empty form when editing.form.items is empty array', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: [] } },
      });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems.length).toBe(0);
    });

    it('should resolve named group when specified as string in items array', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: ['mainGroup'] } },
      });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems.length).toBe(1);
      expect(formItems[0]?.name).toBe('mainGroup');
    });

    it.each([true, false])('should set group visibility to %s when specified in object config', async (visible) => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: [{ name: 'mainGroup', visible }] } },
      });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems[0]?.visible).toBe(visible);
    });

    it('should filter group children to specified named items', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: [{ name: 'mainGroup', items: ['subjectGroup', 'dateGroup'] }] } },
      });

      const mainGroup = (POM.dxForm.option('items') ?? [])[0] as GroupItem;

      expect(mainGroup?.items?.length).toBe(2);
      expect(mainGroup?.items?.[0]?.name).toBe('subjectGroup');
      expect(mainGroup?.items?.[1]?.name).toBe('dateGroup');
    });

    it('should produce empty children when items array in group config is empty', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: [{ name: 'mainGroup', items: [] }] } },
      });

      const mainGroup = (POM.dxForm.option('items') ?? [])[0] as GroupItem;

      expect(mainGroup?.items?.length).toBe(0);
    });

    it('should create placeholder item for non-existent group name', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: ['nonExistentGroup'] } },
      });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems.length).toBe(1);
    });

    it('should handle mixed string and object items', async () => {
      const { POM } = await createAppointmentPopup({
        appointmentData: { ...appointment },
        editing: { form: { items: ['mainGroup', { name: 'mainGroup', visible: false }] } },
      });

      const formItems = POM.dxForm.option('items') ?? [];

      expect(formItems.length).toBe(2);
      expect(formItems[0]?.name).toBe('mainGroup');
      expect(formItems[1]?.name).toBe('mainGroup');
      expect(formItems[1]?.visible).toBe(false);
    });

    it('should call custom onContentReady and onInitialized form callbacks', async () => {
      const onContentReady = jest.fn();
      const onInitialized = jest.fn();

      const { POM } = await createAppointmentPopup({
        editing: { form: { onContentReady, onInitialized } },
      });

      expect(onContentReady).toHaveBeenCalled();
      expect(onInitialized).toHaveBeenCalled();

      POM.selectRepeatValue('weekly');

      expect(POM.isMainGroupVisible()).toBe(false);
      expect(POM.isRecurrenceGroupVisible()).toBe(true);
    });
  });
});
