import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import {
  createAppointmentPopup,
  disposeAppointmentPopups,
} from '../__tests__/__mock__/create_appointment_popup';

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
    const addAppointment: jest.Mock = jest.fn(() => Promise.resolve());

    const sourceAppointment = { text: 'Series', recurrenceRule: 'FREQ=DAILY' };
    const updatedAppointment = { text: 'Series', recurrenceException: '20210426' };

    const onSave = jest.fn((newAppointment) => {
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
});
