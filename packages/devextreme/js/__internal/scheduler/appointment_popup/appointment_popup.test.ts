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
});
