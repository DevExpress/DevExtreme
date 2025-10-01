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
  appointment: any,
): Promise<AppointmentPopup> => {
  await ClientFunction((appointmentData) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.showAppointmentPopup(appointmentData);
  })(appointment);

  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  return scheduler.appointmentPopup;
};

const getResources = () => ([
  {
    fieldExpr: 'assigneeId',
    allowMultiple: true,
    label: 'Assignee',
    dataSource: [
      { text: 'Samantha Bright', id: 1, color: '#727bd2' },
      { text: 'John Heart', id: 2, color: '#32c9ed' },
    ],
  },
  {
    fieldExpr: 'roomId',
    label: 'Room',
    dataSource: [
      { text: 'Room 1', id: 1, color: '#00af2c' },
    ],
  },
  {
    fieldExpr: 'priorityId',
    label: 'Priority',
    dataSource: [
      { text: 'High', id: 1, color: '#cc5c53' },
    ],
  },
]);

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
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

      const appointmentPopup = await openAppointmentPopup(appointment);

      await takeScreenshot(
        `scheduler__appointment__main-form.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.popup.content,
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
        currentDate: new Date(2021, 2, 25).toISOString(),
      });
    });

    safeSizeTest(`appointment main form with timezones (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointmentPopup = await openAppointmentPopup(appointment);

      await takeScreenshot(
        `scheduler__appointment__main-form__with-timezones.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.popup.content,
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
        currentDate: new Date(2021, 2, 25).toISOString(),
        editing: {
          allowTimeZoneEditing: true,
        },
      });
    });

    safeSizeTest(`appointment main form with resources (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointmentPopup = await openAppointmentPopup(appointment);

      await takeScreenshot(
        `scheduler__appointment__main-form__with-resources.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.popup.content,
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
        currentDate: new Date(2021, 2, 25).toISOString(),
        resources: getResources(),
      });
    });

    safeSizeTest(`appointment main form with resources and timezones (${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const appointmentPopup = await openAppointmentPopup(appointment);

      await takeScreenshot(
        `scheduler__appointment__main-form__with-resources-and-timezones.png (recurring=${isRecurringAppointment},allDay=${isAllDay},theme=${theme})`,
        appointmentPopup.popup.content,
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
        currentDate: new Date(2021, 2, 25).toISOString(),
        resources: getResources(),
        editing: {
          allowTimeZoneEditing: true,
        },
      });
    });
  });
});
