import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Scheduler - Drag and drop with promise delay (no console errors)`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const dataSource = [{
  text: 'Test Appointment',
  startDate: new Date(2023, 0, 2, 10, 0),
  endDate: new Date(2023, 0, 2, 11, 0),
}];

test('Should not throw error when trying to drag appointment while it is already being dragged (with 5s delay)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment('Test Appointment');

  await t
    .drag(appointment.element, 300, 0, { speed: 0.8 });

  await t.wait(200);

  await t
    .drag(appointment.element, 600, 0, { speed: 0.8 });

  await t.wait(2000);

  const consoleMessages = await t.getBrowserConsoleMessages();
  const hasErrors = consoleMessages?.error && consoleMessages.error.length > 0;
  const getBoundingClientRectError = consoleMessages?.error?.find(
    (msg) => msg.includes('getBoundingClientRect') || msg.includes('Cannot read properties of undefined'),
  );

  await t
    .expect(getBoundingClientRectError).notOk('Should not have getBoundingClientRect error')
    .expect(hasErrors).notOk('No console errors should occur when dragging during active drag');
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource,
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2023, 0, 2),
    height: 600,
    onAppointmentUpdating: (e) => {
      e.cancel = new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, 5000);
      });
    },
  });
});
