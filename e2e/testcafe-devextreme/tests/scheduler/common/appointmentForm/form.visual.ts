import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import AppointmentPopup from 'devextreme-testcafe-models/scheduler/appointment/popup';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

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
    icon: withIcons ? 'conference-room' : undefined,
  },
  {
    fieldExpr: 'priorityId',
    label: 'Priority',
    dataSource: [
      { text: 'High', id: 1, color: '#cc5c53' },
    ],
    icon: withIcons ? 'tag' : undefined,
  },
]);

[
  'generic.light',
  'generic.light.compact',
  'material.blue.light',
  'material.blue.light.compact',
  'fluent.blue.light',
  'fluent.blue.light.compact',
].forEach((theme) => {
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

    safeSizeTest(`appointment main form (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointmentPopup = await openAppointmentPopup(t, appointment, isRecurringAppointment);

      await takeScreenshot(
        `scheduler__appointment__main-form.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.contentElement,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);
      await createWidget('dxScheduler', {
        dataSource: [appointment],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 25),
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });

    safeSizeTest(`appointment main form with resources and timezones (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointmentPopup = await openAppointmentPopup(t, appointment, isRecurringAppointment);

      await takeScreenshot(
        `scheduler__appointment__main-form__with-resources-and-timezones.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.contentElement,
      );

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [1500, 1500]).before(async () => {
      await changeTheme(theme);
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
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });
});

safeSizeTest('main form with resources that have icons', async (t) => {
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

  await takeScreenshot(
    'scheduler__appointment__main-form__with-resources-with-icons.png',
    appointmentPopup.contentElement,
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25),
  resources: getResources(true),
}));
