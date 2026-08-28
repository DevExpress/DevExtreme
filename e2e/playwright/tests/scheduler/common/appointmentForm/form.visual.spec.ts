import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const DESKTOP_SIZE: [number, number] = [1500, 1500];
const MOBILE_SIZE: [number, number] = [450, 1000];

const getResources = (withIcons = false): Record<string, unknown>[] => ([
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

test.describe(() => {
  test.use({ browserSize: DESKTOP_SIZE });

  [
    { isRecurringAppointment: false, isAllDay: true },
    { isRecurringAppointment: false, isAllDay: false },
    { isRecurringAppointment: true, isAllDay: true },
    { isRecurringAppointment: true, isAllDay: false },
  ].forEach(({ isRecurringAppointment, isAllDay }) => {
    const params = `recurring=${isRecurringAppointment},allDay=${isAllDay}`;
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

    // The parameters are part of the title: the TestCafe fixture allowed four tests to share the
    // same name, a Playwright file cannot.
    test(`appointment main form (${params})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [appointment],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 25),
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointmentPopup = await scheduler.openAppointmentPopup(
        appointment,
        isRecurringAppointment,
      );

      await testScreenshot(
        page,
        `scheduler__appointment__main-form (${params}).png`,
        { element: appointmentPopup.contentElement },
      );
    });

    test(`appointment main form with resources and timezones (${params})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [appointment],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 25),
        resources: getResources(),
        editing: {
          allowTimeZoneEditing: true,
        },
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const appointmentPopup = await scheduler.openAppointmentPopup(
        appointment,
        isRecurringAppointment,
      );

      await testScreenshot(
        page,
        `scheduler__appointment__main-form__with-resources-and-timezones (${params}).png`,
        { element: appointmentPopup.contentElement },
      );
    });
  });

  test('main form with resources that have icons', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      resources: getResources(true),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      assigneeId: [1, 2],
      roomId: 1,
      priorityId: 1,
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__with-resources-with-icons.png',
      { element: appointmentPopup.contentElement },
    );
  });

  test('appointment form readonly state', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__readonly.png',
      { element: appointmentPopup.contentElement },
    );
  });

  test('main form without icons', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(undefined, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__icons-mode-none.png',
      { element: appointmentPopup.contentElement },
    );
  });

  test('appointment form resource with multiple selection', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      resources: getResources(true),
      editing: {
        allowUpdating: true,
      },
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      assigneeId: [1, 2, 3, 4],
      roomId: 1,
      priorityId: 1,
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__resource-with-multiple-selection.png',
      { element: appointmentPopup.contentElement },
    );
  });

  test('appointment main form with opened startDate calendar', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, false);

    await appointmentPopup.startDateEditor.dropDownEditorButton.click();

    await expect(appointmentPopup.startDateEditor.element.locator('.dx-calendar')).toBeVisible();

    await testScreenshot(page, 'scheduler__appointment__main-form__startDate-calendar-opened.png');
  });

  test('Recurrence settings button should have correct focus state', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, true);

    await appointmentPopup.repeatEditor.element.click();
    await page.keyboard.press('Tab');

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-settings-button__focus-state.png',
      { element: appointmentPopup.contentElement },
    );
  });

  test('appointment form with labelMode=static', {
    tag: ['@generic.light', '@material.blue.light'],
  }, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(undefined, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__with-labelMode-static.png',
      { element: appointmentPopup.contentElement },
    );
  });
});

test.describe(() => {
  test.use({ browserSize: MOBILE_SIZE });

  test('main form on mobile screen', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.openAppointmentPopup(undefined, false);

    await testScreenshot(page, 'scheduler__appointment__main-form__mobile.png');
  });
});
