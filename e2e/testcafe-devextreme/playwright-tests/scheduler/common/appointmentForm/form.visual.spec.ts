import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

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

const openAppointmentPopup = async (page: any, appointment?: any, isRecurring = false) => {
  await page.evaluate(({ appt, recurring, sel }) => {
    const instance = ($(sel) as any).dxScheduler('instance');
    instance.showAppointmentPopup(appt, !appt, recurring);
  }, { appt: appointment, recurring: isRecurring, sel: SCHEDULER_SELECTOR });
  await page.locator('.dx-scheduler-appointment-popup').waitFor({ state: 'visible' });
};

test.describe('Appointment Form: Main Form', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

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

    test(`appointment main form (recurring=${isRecurringAppointment},allDay=${isAllDay})`, async ({ page }) => {
      await page.setViewportSize({ width: 1500, height: 1500 });

      await createWidget(page, 'dxScheduler', {
        dataSource: [appointment],
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 2, 25),
      });

      await openAppointmentPopup(page, appointment, isRecurringAppointment);

      await testScreenshot(
        page,
        `scheduler__appointment__main-form (recurring=${isRecurringAppointment},allDay=${isAllDay}).png`,
        { element: page.locator('.dx-popup-content') },
      );
    });

    test(`appointment main form with resources and timezones (recurring=${isRecurringAppointment},allDay=${isAllDay})`, async ({ page }) => {
      await page.setViewportSize({ width: 1500, height: 1500 });

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

      await openAppointmentPopup(page, appointment, isRecurringAppointment);

      await testScreenshot(
        page,
        `scheduler__appointment__main-form__with-resources-and-timezones (recurring=${isRecurringAppointment},allDay=${isAllDay}).png`,
        { element: page.locator('.dx-popup-content') },
      );
    });
  });

  test('main form with resources that have icons', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      assigneeId: [1, 2],
      roomId: 1,
      priorityId: 1,
    };

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      resources: getResources(true),
    });

    await openAppointmentPopup(page, appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__with-resources-with-icons.png',
      { element: page.locator('.dx-popup-content') },
    );
  });

  test('appointment form readonly state', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

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

    await openAppointmentPopup(page, appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__readonly.png',
      { element: page.locator('.dx-popup-content') },
    );
  });

  test('main form on mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 450, height: 1000 });

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

    await openAppointmentPopup(page, undefined, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__mobile.png',
    );
  });

  test('appointment form resource with multiple selection', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      assigneeId: [1, 2, 3, 4],
      roomId: 1,
      priorityId: 1,
    };

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

    await openAppointmentPopup(page, appointment, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__resource-with-multiple-selection.png',
      { element: page.locator('.dx-popup-content') },
    );
  });

  test('appointment main form with opened startDate calendar', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
    };

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    await openAppointmentPopup(page, appointment, false);

    const startDateDropDown = page.locator('.dx-scheduler-appointment-popup .dx-first-row .dx-dropdowneditor-button');
    await startDateDropDown.first().click();

    await page.locator('.dx-calendar').waitFor({ state: 'visible' });

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__startDate-calendar-opened.png',
    );
  });

  test('Recurrence settings button should have correct focus state', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    await openAppointmentPopup(page, appointment, true);

    await page.locator('.dx-recurrence-editor').click();
    await page.keyboard.press('Tab');

    await testScreenshot(
      page,
      'scheduler__appointment__recurrence-settings-button__focus-state.png',
      { element: page.locator('.dx-popup-content') },
    );
  });

  test('appointment form with labelMode=static', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });

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

    await openAppointmentPopup(page, undefined, false);

    await testScreenshot(
      page,
      'scheduler__appointment__main-form__with-labelMode-static.png',
      { element: page.locator('.dx-popup-content') },
    );
  });
});
