import { test, expect } from '../../fixtures/fixtures';

const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';
const UPDATED_APPOINTMENT_TITLE = `${INITIAL_APPOINTMENT_TITLE}${ADDITIONAL_TITLE_TEXT}`;

test('Should correctly update appointment if dataSource is a simple array', async ({ page, dxScheduler }) => {
  const scheduler = await dxScheduler({
    dataSource: [{
      id: 1,
      text: INITIAL_APPOINTMENT_TITLE,
      startDate: new Date(2021, 2, 29, 9, 30),
      endDate: new Date(2021, 2, 29, 11, 30),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 29),
    startDayHour: 9,
    endDayHour: 14,
    height: 600,
  });

  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
  const updatedAppointment = scheduler.getAppointment(UPDATED_APPOINTMENT_TITLE);
  const subjectInput = page
    .locator('.dx-scheduler-appointment-popup .e2e-dx-scheduler-form-text .dx-texteditor-input');
  const doneButton = page
    .locator('.dx-scheduler-appointment-popup .dx-popup-done.dx-button');

  await appointment.dblclick();
  await subjectInput.fill(UPDATED_APPOINTMENT_TITLE);
  await expect(subjectInput).toHaveValue(UPDATED_APPOINTMENT_TITLE);
  await doneButton.click();
  await expect(updatedAppointment).toBeVisible();
});
