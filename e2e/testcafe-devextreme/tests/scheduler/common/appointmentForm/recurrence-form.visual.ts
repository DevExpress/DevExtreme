import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';

fixture`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('Daily frequency with repeat end never', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Daily Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Daily');
  await appointmentPopup.setRecurrenceEnd(t, 'never');

  await takeScreenshot(
    'scheduler__recurrence-form__daily__repeat-end-never.png (theme=fluent.blue.light)',
    appointmentPopup.recurrence.group,
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  await changeTheme('fluent.blue.light');

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
  await changeTheme('generic.light');
});

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('Daily frequency with repeat end', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Daily Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
  };

  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const { appointmentPopup } = scheduler;

  await appointmentPopup.openRecurrenceForm(t, 'Daily');
  await appointmentPopup.setRecurrenceEnd(t, 'until', '12/31/2025');

  await takeScreenshot(
    'scheduler__recurrence-form__daily__repeat-end-until.png (theme=fluent.blue.light)',
    appointmentPopup.recurrence.group,
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2025/10/20');
  })();

  await changeTheme('fluent.blue.light');

  return createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
  await changeTheme('generic.light');
});
