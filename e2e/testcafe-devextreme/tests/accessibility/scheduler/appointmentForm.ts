import Scheduler from 'devextreme-testcafe-models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { a11yCheckConfig } from './axe_options';

fixture.disablePageReloads`Scheduler - Appointment Form`
  .page(url(__dirname, '../../container.html'));

const APPOINTMENT_POPUP_CONTENT_SELECTOR = '.dx-scheduler-appointment-popup .dx-overlay-content';

test('Appointment Form with axe', async (t) => {
  const scheduler = new Scheduler('#container');

  const appointment = scheduler.getAppointment('App 1');

  await t.doubleClick(appointment.element);
  await t.wait(300);

  await a11yCheck(t, a11yCheckConfig, APPOINTMENT_POPUP_CONTENT_SELECTOR);
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'UTC',
    dataSource: [{
      text: 'App 1',
      startDate: Date.UTC(2021, 1, 1, 12),
      endDate: Date.UTC(2021, 1, 1, 13),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 1, 1),
  });
});
