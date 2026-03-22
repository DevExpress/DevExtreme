import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Hide tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Appointment tooltip should be hidden when drag is started', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['day'],
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      height: 600,
      dataSource: [{
        text: 'Test',
        startDate: new Date(2021, 3, 26, 9),
        endDate: new Date(2021, 3, 26, 9, 30),
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });
    await appointment.click();

    const tooltip = page.locator('.dx-scheduler-appointment-tooltip');
    await expect(tooltip).toBeVisible();

    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(0);
    await appointment.dragTo(targetCell);

    await expect(tooltip).not.toBeVisible();
  });
});
