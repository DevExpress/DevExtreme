import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('a11y - contrast', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Scheduler a11y: Insufficient contrast of day numbers in the MonthView', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'month',
      currentDate: new Date(2020, 10, 25),
    });

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'month_day_number_contrast.png', { element: scheduler });
  });
});
