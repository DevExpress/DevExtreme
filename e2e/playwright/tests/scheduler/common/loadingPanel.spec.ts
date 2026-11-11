import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';

test.describe('Scheduler loading panel', () => {
  test('Save appointment loading panel screenshot', async ({ page }) => {
    await createWidget(page, 'dxScheduler', (title: string) => ({
      dataSource: [{
        id: 1,
        text: title,
        startDate: new Date(2021, 2, 29, 9, 30),
        endDate: new Date(2021, 2, 29, 11, 30),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 14,
      height: 600,
      onAppointmentUpdating: (e) => {
        e.cancel = new Promise(() => {});
      },
    }), SCHEDULER_SELECTOR, { arg: INITIAL_APPOINTMENT_TITLE });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);
    const { appointmentPopup } = scheduler;

    await appointment.element.dblclick();
    await appointmentPopup.textEditor.element.click();
    await appointmentPopup.textEditor.input.pressSequentially(ADDITIONAL_TITLE_TEXT);
    await appointmentPopup.saveButton.element.click();

    await testScreenshot(page, 'save-appointment-loading-panel-screenshot.png', { element: scheduler.element });
  });
});
