import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import AppointmentPopup from 'devextreme-testcafe-models/scheduler/appointment/popup';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Appointment Form: Main Form`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const openAppointmentPopup = async (
  t: TestController,
  appointment: any,
  isRecurringAppointment: boolean,
): Promise<AppointmentPopup> => {
  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  if (isRecurringAppointment) {
    await t.click(Scheduler.getEditRecurrenceDialog().series);
  }

  return scheduler.appointmentPopup;
};

const getResources = (withIcons = false) => ([
  {
    fieldExpr: 'assigneeId',
    allowMultiple: true,
    label: 'Assignee',
    dataSource: [
      { text: 'Samantha Bright', id: 1, color: '#727bd2' },
      { text: 'John Heart', id: 2, color: '#32c9ed' },
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

    const appointmentPopup = await openAppointmentPopup(t, appointment, isRecurringAppointment);

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

    const appointmentPopup = await openAppointmentPopup(t, appointment, isRecurringAppointment);

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

  const appointmentPopup = await openAppointmentPopup(t, appointment, false);

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
