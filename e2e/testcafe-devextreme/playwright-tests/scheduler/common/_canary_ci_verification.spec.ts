import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

// CANARY TESTS — intentional failures to verify CI catches errors.
// Remove this file after CI verification is complete.

test.describe('CI Verification Canary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  });

  test('CANARY: wrong screenshot reference should fail', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 2, 1),
      currentView: 'day',
      height: 300,
    });

    // Reference a non-existent etalon — must fail with "missing snapshot" error
    await expect(page.locator('.dx-scheduler')).toHaveScreenshot(
      ['this-etalon-does-not-exist (fluent.blue.light).png'],
    );
  });

  test('CANARY: wrong element dimensions should fail screenshot comparison', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 2, 1),
      currentView: 'day',
      height: 300,
    });

    // Set completely wrong dimensions — any real etalon comparison should fail
    await page.locator('.dx-scheduler').evaluate((el) => {
      el.style.width = '50px';
      el.style.height = '50px';
    });

    await testScreenshot(page, 'view=day-crossScrolling=false-horizontal-rtl', {
      element: '.dx-scheduler',
    });
  });

  test('CANARY: assertion failure should be reported', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 2, 1),
      currentView: 'day',
      height: 300,
    });

    // Plain assertion that must fail
    const appointmentCount = await page.locator('.dx-scheduler-appointment').count();
    expect(appointmentCount).toBe(999);
  });
});
