import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { Themes } from '../../../../helpers/themes';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Appointment Form: Main Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const getResources = (withIcons = false) => ([
  {
    fieldExpr: 'assigneeId',
    allowMultiple: true,
    label: 'Assignee',
    dataSource: [
      { text: 'Samantha Bright', id: 1, color: '#727bd2' },
      { text: 'John Heart', id: 2, color: '#32c9ed' },
      { text: 'Todd Hoffman', id: 3, color: '#2a7ee4' },
      { text: 'Sandra Johnson', id: 4, color: '#7b49d3' },
    ],
    icon: withIcons ? 'user' : undefined,
  },
  {
    fieldExpr: 'roomId',
    label: 'Room',
    dataSource: [
      { text: 'Room 1', id: 1, color: '#00af2c' },
    ],
    icon: withIcons ? 'conferenceroomfilled' : undefined,
  },
  {
    fieldExpr: 'priorityId',
    label: 'Priority',
    dataSource: [
      { text: 'High', id: 1, color: '#cc5c53' },
    ],
    icon: withIcons ? 'tags' : undefined,
  },
]);

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
[
  { isRecurringAppointment: false, isAllDay: true },
  { isRecurringAppointment: false, isAllDay: false },
  { isRecurringAppointment: true, isAllDay: true },
  { isRecurringAppointment: true, isAllDay: false },
].forEach(({ isRecurringAppointment, isAllDay }) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: isAllDay,
    recurrenceRule: isRecurringAppointment ? 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10' : undefined,
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
  };

  test.meta({ browserSize: [1500, 1500] })('appointment main form', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(
      t,
      appointment,
      isRecurringAppointment,
    );

    await testScreenshot(
      t,
      takeScreenshot,
      `scheduler__appointment__main-form (recurring=${isRecurringAppointment},allDay=${isAllDay}).png`,
      { element: appointmentPopup.contentElement },
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [appointment],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });
  });

  test.meta({ browserSize: [1500, 1500] })('appointment main form with resources and timezones', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(
      t,
      appointment,
      isRecurringAppointment,
    );

    await testScreenshot(
      t,
      takeScreenshot,
      `scheduler__appointment__main-form__with-resources-and-timezones (recurring=${isRecurringAppointment},allDay=${isAllDay}).png`,
      { element: appointmentPopup.contentElement },
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [appointment],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      resources: getResources(),
      editing: {
        allowTimeZoneEditing: true,
      },
    });
  });
});

test.meta({ browserSize: [1500, 1500] })('main form with resources that have icons', async (t) => {
  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
  };

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__with-resources-with-icons.png',
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
  resources: getResources(true),
}));

test.meta({ browserSize: [1500, 1500] })('appointment form readonly state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    assigneeId: [1, 2],
    roomId: 1,
    priorityId: 1,
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__readonly.png',
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
    resources: getResources(),
    editing: {
      allowUpdating: false,
      allowTimeZoneEditing: true,
    },
  });
});

test.meta({ browserSize: [450, 1000] })('main form on mobile screen', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await scheduler.openAppointmentPopup(t, undefined, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__mobile.png',
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25),
  resources: getResources(true),
  editing: {
    form: {
      iconsShowMode: 'both',
    },
  },
}));

test.meta({ browserSize: [1500, 1500] })('main form without icons', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, undefined, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__icons-mode-none.png',
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
  resources: getResources(true),
  editing: {
    form: {
      iconsShowMode: 'none',
    },
  },
}));

test.meta({ browserSize: [1500, 1500] })('appointment form resource with multiple selection', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    assigneeId: [1, 2, 3, 4],
    roomId: 1,
    priorityId: 1,
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__resource-with-multiple-selection.png',
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
    resources: getResources(true),
    editing: {
      allowUpdating: true,
    },
  });
});

test.meta({ browserSize: [1500, 1500] })('appointment main form with opened startDate calendar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, false);

  await t.click(appointmentPopup.startDateEditor.dropDownEditorButton);

  const calendarPopup = appointmentPopup.startDateEditor.getPopup();
  await t.expect(await calendarPopup.isVisible()).ok();

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__startDate-calendar-opened.png',
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
  });
});

test.meta({ browserSize: [1500, 1500] })('Recurrence settings button should have correct focus state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const appointment = {
    text: 'Appointment',
    startDate: new Date('2021-04-26T16:30:00.000Z'),
    endDate: new Date('2021-04-26T18:30:00.000Z'),
    allDay: false,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  };

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, appointment, true);

  await t
    .click(appointmentPopup.repeatEditor.element)
    .pressKey('tab');

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__recurrence-settings-button__focus-state.png',
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
  });
});

test.meta({
  browserSize: [1500, 1500],
  themes: [Themes.genericLight, Themes.materialBlue, Themes.fluentBlue],
})('appointment form with labelMode=static', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(t, undefined, false);

  await testScreenshot(
    t,
    takeScreenshot,
    'scheduler__appointment__main-form__with-labelMode-static.png',
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
    resources: getResources(true),
    editing: {
      allowUpdating: true,
      form: {
        labelMode: 'static',
      },
    },
  });
});
