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

    expect(popup.visible).toBe(true);
    POM.cancelButton.click();
    expect(popup.visible).toBe(false);
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

  describe('State', () => {
    it('should create a new dxForm instance on each popup opening', async () => {
      const { POM, reopen } = await createAppointmentPopup();
      const firstFormInstance = POM.dxForm;

      POM.cancelButton.click();

      const { POM: POM2 } = await reopen();
      const secondFormInstance = POM2.dxForm;

      expect(secondFormInstance).not.toBe(firstFormInstance);
    });
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

      expect(POM.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('startTimeEditor')).toBeTruthy();
      expect(POM.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('endTimeEditor')).toBeTruthy();

      POM.getInput('allDayEditor').click();

      expect(POM.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('endTimeEditor')).toBeFalsy();
    });

    it('should show time editors when switched off', async () => {
      const { POM } = await createAppointmentPopup({ appointmentData: allDayAppointment });

      expect(POM.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('startTimeEditor')).toBeFalsy();
      expect(POM.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('endTimeEditor')).toBeFalsy();

      POM.getInput('allDayEditor').click();

      expect(POM.isInputVisible('startDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('startTimeEditor')).toBeTruthy();
      expect(POM.isInputVisible('endDateEditor')).toBeTruthy();
      expect(POM.isInputVisible('endTimeEditor')).toBeTruthy();
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
});
