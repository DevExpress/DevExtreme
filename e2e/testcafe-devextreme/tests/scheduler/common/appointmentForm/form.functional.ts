import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Form: Functional`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

test('Subject text editor should have focus after returning from recurrence form', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.clickRecurrenceSettingsButton(t);

  await t.click(appointmentPopup.recurrence.backButton);

  await t
    .expect(appointmentPopup.textEditor.getInput().focused)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});

test('Recurrence start date editor should have focus after opening recurrence settings', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.clickRecurrenceSettingsButton(t);

  await t
    .expect(appointmentPopup.recurrence.startDateInput.focused)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });
});
