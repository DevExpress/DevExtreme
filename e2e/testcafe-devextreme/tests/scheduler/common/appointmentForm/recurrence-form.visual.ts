import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture`Appointment Form: Recurrence Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'].forEach((frequency) => {
  test(`recurrence form in ${frequency} frequency`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2024-01-01T10:00:00'),
      endDate: new Date('2024-01-01T11:00:00'),
    };

    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);

    await appointmentPopup.selectRepeatValue(t, frequency);

    await testScreenshot(
      t,
      takeScreenshot,
      `scheduler__appointment__recurrence-form__${frequency.toLowerCase()}.png`,
      { element: appointmentPopup.contentElement },
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2024, 0, 1),
  }));
});

test('recurrence form with icons', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=1',
  };

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);
  await appointmentPopup.clickRecurrenceSettingsButton(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-form__with-icons.png',
    { element: appointmentPopup.contentElement },
  );
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25),
  editing: {
    form: {
      iconsShowMode: 'both',
    },
  },
}));

test('recurrence form readonly state', async (t) => {
  const appointment = {
    text: 'Readonly Recurrent Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
  };

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);
  await appointmentPopup.clickRecurrenceSettingsButton(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-form__readonly.png',
    { element: appointmentPopup.contentElement },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2024, 0, 1),
  editing: {
    allowUpdating: false,
  },
}));

test.meta({ browserSize: [450, 1000] })('recurrence form on mobile screen', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const appointmentPopup = await scheduler.openAppointmentPopup(t, undefined, false);
  await appointmentPopup.selectRepeatValue(t, 'Weekly');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-form__mobile.png',
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25),
  editing: {
    form: {
      iconsShowMode: 'both',
    },
  },
}));

test.meta({ browserSize: [1500, 1500] })('recurrence form with labelMode=static', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Readonly Recurrent Appointment',
    startDate: new Date('2024-01-01T10:00:00'),
    endDate: new Date('2024-01-01T11:00:00'),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await appointmentPopup.clickRecurrenceSettingsButton(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-form__with-labelMode-static.png',
    { element: appointmentPopup.contentElement },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
    editing: {
      allowUpdating: true,
      popup: {
        width: 420,
        height: 500,
      },
      form: {
        iconsShowMode: 'both',
        labelMode: 'static',
        items: [
          'mainGroup',
          {
            name: 'recurrenceGroup',
            items: [
              'recurrenceStartDateGroup',
              'recurrenceRuleGroup',
              {
                name: 'recurrenceEndGroup',
                items: [
                  'recurrenceEndIcon',
                  {
                    name: 'recurrenceEndEditor',
                    label: {
                      visible: true,
                      location: 'top',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  });
});
