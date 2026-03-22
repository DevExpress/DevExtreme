import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-and-drop appointments in the Scheduler basic views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

['day', 'week', 'workWeek'].forEach((view) => test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
  // --- setup ---
await createScheduler({
    timeZone: 'Etc/GMT',
    dataSource: [{
      text: 'Test appointment',
      startDate: new Date('2022-09-08T10:00:00.000Z'),
      endDate: new Date('2022-09-08T10:30:00.000Z'),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date('2022-09-09T10:00:00.000Z'),
    startDayHour: 9,
    width: 600,
    height: 600,
  // --- test ---
// Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(0))
    .expect(draggableAppointment.size.height).toBe('38px')
    .expect(draggableAppointment.date.time)
    .eql('11:00 AM - 11:30 AM');
}).before(async () => createScheduler({
  views: [view],
  currentView: view,
  dataSource,
})));

test('Drag-n-drop in the "month" view', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4))
    .expect(draggableAppointment.size.height).toBe('23.8281px')
    .expect(draggableAppointment.date.time)
    .eql('9:00 AM - 9:30 AM');
}).before(async () => createScheduler({
  views: ['month'],
  currentView: 'month',
  dataSource,
  height: 834,
}));

test('Drag-n-drop when browser has horizontal scroll', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Staff Productivity Report' });

  await t
    .drag(draggableAppointment.element, 250, -50, { speed: 0.2 })
    .expect(draggableAppointment.isAllDay).toBe(true);
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 6, 9, 0),
    endDate: new Date(2019, 3, 6, 10, 30),
    resourceId: 2,
  }],
  width: 1800,
}));

test('Drag-n-drop when browser has vertical scroll', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Staff Productivity Report' });

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(25).locator('.dx-scheduler-date-table-cell').nth(0), { speed: 0.5 })
    .expect(draggableAppointment.date.time).toBe('9:30 PM - 10:00 PM');
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 1, 21, 0),
    endDate: new Date(2019, 3, 1, 21, 30),
    resourceId: 2,
  }],
  height: 1800,
}));

test('Drag recurrent appointment occurrence from collector (T832887)', async ({ page }) => {
  // Scheduler on '#container'
  const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Recurrence two' });
  const collector = scheduler.collectors.find('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
  const popup = Scheduler.getDeleteRecurrenceDialog();

  await (collector.element).click()
    .expect(appointmentTooltip.isVisible()).toBeTruthy()
    .dragToElement(appointmentTooltipItem.element, page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2))
    .expect(appointmentTooltipItem.element.exists)
    .notOk()
    .click(popup.appointment)
    .expect(appointment.element.exists)
    .ok()
    .expect(appointment.date.time)
    .eql('4:00 AM - 6:00 AM')
    .expect(collector.element.exists)
    .notOk();
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  firstDayOfWeek: 2,
  startDayHour: 4,
  maxAppointmentsPerCell: 1,
  dataSource: [{
    text: 'Recurrence one',
    startDate: new Date(2019, 2, 26, 8, 0),
    endDate: new Date(2019, 2, 26, 10, 0),
    recurrenceException: '',
    recurrenceRule: 'FREQ=DAILY',
  }, {
    text: 'Non-recurrent appointment',
    startDate: new Date(2019, 2, 26, 7, 0),
    endDate: new Date(2019, 2, 26, 11, 0),
  }, {
    text: 'Recurrence two',
    startDate: new Date(2019, 2, 26, 8, 0),
    endDate: new Date(2019, 2, 26, 10, 0),
    recurrenceException: '',
    recurrenceRule: 'FREQ=DAILY',
  }],
  currentDate: new Date(2019, 2, 26),
}));

test('Drag-n-drop the appointment to the left column to the cell that has the same time', async ({ page }) => {
  // Scheduler on '#container'
    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test appointment' });

  await t
    .dragToElement(
      draggableAppointment.element,
      page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2),
      { speed: 0.5 },
    );

  await testScreenshot(page, 'drag-n-drop-appointment-to-left-column.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
