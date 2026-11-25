import { expect, test } from '../../../helpers/accessibility/test';
import Scheduler from '../../../models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheckConfig } from './axe_options';

const APPOINTMENT_POPUP_CONTENT_SELECTOR = '.dx-scheduler-appointment-popup .dx-overlay-content';

test('Appointment Form with axe', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'UTC',
    dataSource: [{
      text: 'App 1',
      startDate: Date.UTC(2021, 1, 1, 12),
      endDate: Date.UTC(2021, 1, 1, 13),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 1, 1),
  });

  const scheduler = new Scheduler(page, '#container');

  const appointment = scheduler.getAppointment('App 1');

  await appointment.element.dblclick();
  await expect(scheduler.appointmentPopup.form).toBeVisible();

  await a11yCheck(page, a11yCheckConfig, APPOINTMENT_POPUP_CONTENT_SELECTOR);
});
