import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const defaultSchedulerOptions = {
  views: ['day'],
  dataSource: [],
  resources: [
    {
      fieldExpr: 'resourceId',
      dataSource: [
        { id: 0, color: '#e01e38' },
        { id: 1, color: '#f98322' },
        { id: 2, color: '#1e65e8' },
      ],
      label: 'Color',
    },
  ],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
};

const appointmentCollectorData = [
  { text: 'Website Re-Design Plan', startDate: new Date(2019, 3, 3, 9, 30), endDate: new Date(2019, 3, 3, 11, 30) },
  { text: 'Approve Personal Computer Upgrade Plan', startDate: new Date(2019, 3, 3, 10, 0), endDate: new Date(2019, 3, 3, 11, 0) },
  { text: 'Install New Database', startDate: new Date(2019, 3, 3, 9, 45), endDate: new Date(2019, 3, 3, 11, 15) },
  { text: 'Customer Workshop', startDate: new Date(2019, 3, 3, 11, 0), endDate: new Date(2019, 3, 3, 12, 0) },
  { text: 'Prepare 2015 Marketing Plan', startDate: new Date(2019, 3, 3, 11, 0), endDate: new Date(2019, 3, 3, 13, 30) },
  { text: 'Create Icons for Website', startDate: new Date(2019, 3, 3, 10, 0), endDate: new Date(2019, 3, 3, 11, 30) },
];

test.describe('Drag-and-drop behaviour for the appointment tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Drag-n-drop between a scheduler table cell and the appointment tooltip', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: appointmentCollectorData,
      maxAppointmentsPerCell: 2,
      width: 1000,
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '2' });
    const tooltipItem = page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(5);

    await collector.click();
    await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

    await tooltipItem.dragTo(targetCell);
    await expect(tooltipItem).not.toBeVisible();

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });
    await expect(appointment).toBeVisible();

    const height = await appointment.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('76px');

    const timeText = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('9:30 AM - 10:30 AM');

    const targetCell2 = page.locator('.dx-scheduler-date-table-row').nth(3).locator('.dx-scheduler-date-table-cell').nth(2);
    await appointment.dragTo(targetCell2);

    await collector.click();
    await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();
    await expect(appointment).not.toBeVisible();
  });

  test('Drag-n-drop to the cell on the left should work in week view (T1005115)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2019, 3, 1),
      views: ['week'],
      currentView: 'week',
      dataSource: [
        { text: 'Website Re-Design Plan', startDate: new Date(2019, 3, 3, 9, 30), endDate: new Date(2019, 3, 3, 11, 30) },
        { text: 'Approve Personal Computer Upgrade Plan', startDate: new Date(2019, 3, 3, 10, 0), endDate: new Date(2019, 3, 3, 10, 30) },
        { text: 'Install New Database', startDate: new Date(2019, 3, 3, 9, 45), endDate: new Date(2019, 3, 3, 11, 15) },
      ],
      maxAppointmentsPerCell: 2,
      height: 800,
      startDayHour: 9,
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '1' });
    const tooltipItem = page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(2);

    await collector.click();
    await tooltipItem.dragTo(targetCell);

    await testScreenshot(page, 'drag-n-drop-from-tooltip-to-left-cell-in-week.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });

  test('Drag-n-drop in the same table cell', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...defaultSchedulerOptions,
      views: ['week'],
      currentView: 'week',
      dataSource: appointmentCollectorData,
      maxAppointmentsPerCell: 2,
      width: 1000,
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '2' });
    const tooltipItem = page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });

    await collector.click();
    await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

    const box = await tooltipItem.boundingBox();
    await tooltipItem.hover();
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2 - 90, { steps: 10 });
    await page.mouse.up();

    await collector.click();
    await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();
    await expect(tooltipItem).toBeVisible();
  });

  test('Drag-n-drop to the cell below should work in month view (T1005115)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2019, 3, 1),
      views: ['month'],
      currentView: 'month',
      dataSource: [
        { text: 'Website Re-Design Plan', startDate: new Date(2019, 3, 3, 9, 30), endDate: new Date(2019, 3, 3, 11, 30) },
        { text: 'Approve Personal Computer Upgrade Plan', startDate: new Date(2019, 3, 3, 10, 0), endDate: new Date(2019, 3, 3, 11, 0) },
        { text: 'Install New Database', startDate: new Date(2019, 3, 3, 9, 45), endDate: new Date(2019, 3, 3, 11, 15) },
      ],
      maxAppointmentsPerCell: 2,
      height: 800,
    });

    const collector = page.locator('.dx-scheduler-appointment-collector').filter({ hasText: '1 more' });
    const tooltipItem = page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'Approve Personal Computer Upgrade Plan' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(3);

    await collector.click();
    await tooltipItem.dragTo(targetCell);

    await testScreenshot(page, 'drag-n-drop-from-tooltip-to-cell-below-in-month.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
