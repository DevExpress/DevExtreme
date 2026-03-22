import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:AppointmentForm:AllDay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Start and end dates should be reflect the current day(appointment is already available case)', async ({ page }) => {
  // Scheduler on '#container'
    const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).click().element)
    .click(scheduler.appointmentTooltip.getListItem('Text').element);

  await testScreenshot(page, 'appointment-form-before-click-all-day.png');

  await (appointmentPopup.allDayElement).click();

  await testScreenshot(page, 'appointment-form-after-click-all-day.png');

  await (appointmentPopup.doneButton).click();

  await testScreenshot(page, 'all-day-appointment-on-tables.png');

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).click().element)
    .click(scheduler.appointmentTooltip.getListItem('Text').element);

  await testScreenshot(page, 'appointment-form-after-render-on-table.png');

  await (appointmentPopup.allDayElement).click();

  await testScreenshot(page, 'appointment-form-after-switch-off-all-day.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2021, 3, 28, 10),
      endDate: new Date(2021, 3, 28, 12),
    }],
    editing: { legacyForm: true },
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
    height: 600,
  });
});

test('Start and end dates should be reflect the current day(create new appointment case)', async ({ page }) => {
  // Scheduler on '#container'
    const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(3).dblclick());

  await testScreenshot(page, 'new-appointment-form-before-click-all-day.png');

  await (appointmentPopup.allDayElement).click();

  await testScreenshot(page, 'new-appointment-form-after-click-all-day.png');

  await (appointmentPopup.doneButton).click();

  await testScreenshot(page, 'new-all-day-appointment-on-tables.png');

  await (page.locator('.dx-scheduler-appointment').filter({ hasText: '' }).click().element)
    .click(scheduler.appointmentTooltip.getListItem('').element);

  await testScreenshot(page, 'new-appointment-form-after-render-on-table.png');

  await (appointmentPopup.allDayElement).click();

  await testScreenshot(page, 'new-appointment-form-after-switch-off-all-day.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    editing: { legacyForm: true },
    currentView: 'week',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
    height: 600,
  });
});

test('StartDate and endDate should have correct type after "allDay" and "repeat" option are changed (T1002864)', async ({ page }) => {
  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

    await (page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0).dblclick());

  await testScreenshot(page,
    'form-before-change-allday-and-reccurence-options.png',
    { element: appointmentPopup.content },
  );

  await (appointmentPopup.allDayElement).click()
    .click(appointmentPopup.recurrenceElement);

  await testScreenshot(page,
    'form-after-change-allday-and-reccurence-options.png',
    { element: appointmentPopup.content },
  );

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  currentDate: new Date(2021, 1, 1),
  editing: { legacyForm: true },
}));
});
