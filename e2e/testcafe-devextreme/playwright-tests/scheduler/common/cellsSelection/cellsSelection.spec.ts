import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Scheduler: Cells Selection in Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Selection should work correctly with all-day panel appointments', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 11, 9),
      dataSource: [{
        startDate: new Date(2021, 11, 9),
        endDate: new Date(2021, 11, 9),
        allDay: true,
        text: 'Appointment',
      }],
    });

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' }).click();
    await page.locator('.dx-scheduler-date-table-cell').first().click();

    const selectedCount = await page.locator('.dx-scheduler-date-table-cell.dx-state-focused').count();
    expect(selectedCount).toBe(1);
  });
});
