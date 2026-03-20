import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import fx from '../../../common/core/animation/fx';
import { ACTION_TO_APPOINTMENT } from '../appointment_popup/m_popup';
import {
  createAppointmentPopup,
  disposeAppointmentPopups,
} from './__mock__/create_appointment_popup';

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

  it('should call addAppointment on Save click for CREATE action', async () => {
    const { POM, callbacks } = await createAppointmentPopup({
      appointmentData: {
        text: 'New Appointment',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
      action: ACTION_TO_APPOINTMENT.CREATE,
    });

    POM.saveButton.click();

    expect(callbacks.addAppointment).toHaveBeenCalledTimes(1);
    expect(callbacks.addAppointment).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'New Appointment',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      }),
    );
  });

  it('should call updateAppointment on Save click for UPDATE action', async () => {
    const { POM, callbacks } = await createAppointmentPopup({
      appointmentData: {
        text: 'Existing Appointment',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 0),
      },
      action: ACTION_TO_APPOINTMENT.UPDATE,
    });

    POM.saveButton.click();

    expect(callbacks.updateAppointment).toHaveBeenCalledTimes(1);
  });

  it('should hide popup on Cancel click', async () => {
    const { popup, POM } = await createAppointmentPopup();

    expect(popup.visible).toBe(true);
    POM.cancelButton.click();
    expect(popup.visible).toBe(false);
  });
});
