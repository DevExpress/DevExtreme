import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-and-drop behaviour for the appointment tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Drag-n-drop between a scheduler table cell and the appointment tooltip', async ({ page }) => {
  // Scheduler on '#container'
  const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });
  const collector = scheduler.collectors.find('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  await (collector.element).click()
    .expect(appointmentTooltip.isVisible()).toBeTruthy()
    .dragToElement(appointmentTooltipItem.element, page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(5), { speed: 0.5 })
    .expect(appointmentTooltipItem.element.exists)
    .notOk()
    .expect(appointment.element.exists)
    .ok()
    .expect(appointment.size.height)
    .eql('76px')
    .expect(appointment.date.time)
    .eql('9:30 AM - 10:30 AM')
    .dragToElement(appointment.element, page.locator('.dx-scheduler-date-table-row').nth(3).locator('.dx-scheduler-date-table-cell').nth(2), { speed: 0.5 })
    .click(collector.element)
    .expect(appointmentTooltip.isVisible())
    .ok()
    .expect(appointment.element.exists)
    .notOk();
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: appointmentCollectorData,
  maxAppointmentsPerCell: 2,
  width: 1000,
}));

test('Drag-n-drop to the cell on the left should work in week view (T1005115)', async ({ page }) => {
  // Scheduler on '#container'
  const collector = scheduler.collectors.find('1');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

    await (collector.element).click()
    .dragToElement(
      appointmentTooltipItem.element,
      page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2),
      { speed: 0.5 },
    );

  await testScreenshot(page, 'drag-n-drop-from-tooltip-to-left-cell-in-week.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  currentDate: new Date(2019, 3, 1),
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2019, 3, 3, 9, 30),
    endDate: new Date(2019, 3, 3, 11, 30),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2019, 3, 3, 10, 0),
    endDate: new Date(2019, 3, 3, 10, 30),
  }, {
    text: 'Install New Database',
    startDate: new Date(2019, 3, 3, 9, 45),
    endDate: new Date(2019, 3, 3, 11, 15),
  }],
  maxAppointmentsPerCell: 2,
  height: 800,
  startDayHour: 9,
}));

test('Drag-n-drop in the same table cell', async ({ page }) => {
  // Scheduler on '#container'
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  await (scheduler.collectors.find('2').click().element)
    .expect(appointmentTooltip.isVisible()).toBeTruthy()
    .drag(appointmentTooltipItem.element, 0, -90)
    .click(scheduler.collectors.find('2').element)
    .expect(appointmentTooltip.isVisible())
    .ok()
    .expect(appointmentTooltipItem.element.exists)
    .ok();
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: appointmentCollectorData,
  maxAppointmentsPerCell: 2,
  width: 1000,
}));

test.meta({ runInTheme: Themes.genericLight })('Drag-n-drop to the cell below should work in month view (T1005115)', async (t) => {
  // Scheduler on '#container'
  const collector = scheduler.collectors.find('1 more');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

    await (collector.element).click()
    .dragToElement(
      appointmentTooltipItem.element,
      page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(3),
      { speed: 0.5 },
    );

  await testScreenshot(page, 'drag-n-drop-from-tooltip-to-cell-below-in-month.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
  currentDate: new Date(2019, 3, 1),
  views: ['month'],
  currentView: 'month',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2019, 3, 3, 9, 30),
    endDate: new Date(2019, 3, 3, 11, 30),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2019, 3, 3, 10, 0),
    endDate: new Date(2019, 3, 3, 11, 0),
  }, {
    text: 'Install New Database',
    startDate: new Date(2019, 3, 3, 9, 45),
    endDate: new Date(2019, 3, 3, 11, 15),
  }],
  maxAppointmentsPerCell: 2,
  height: 800,
}));
});
