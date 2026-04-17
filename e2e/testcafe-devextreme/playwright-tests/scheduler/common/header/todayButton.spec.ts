import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler header today button', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Scheduler today button should works', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
    });

    const todayButton = page.locator('.dx-scheduler-header .dx-button').filter({ hasText: /today/i }).first();
    await todayButton.click();

    const currentDate = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      return instance.option('currentDate');
    });

    const today = new Date();
    const currentDateObj = new Date(currentDate);
    currentDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    expect(currentDateObj.getTime()).toBe(today.getTime());
  });

  test('Scheduler today button should use indicatorTime', async ({ page }) => {
    const indicatorTime = new Date(2023, 3, 27);

    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      indicatorTime,
      toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] },
    });

    const todayButton = page.locator('.dx-scheduler-header .dx-button').filter({ hasText: /today/i }).first();
    await todayButton.click();

    const currentDate = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      return instance.option('currentDate');
    });

    const currentDateObj = new Date(currentDate);
    expect(currentDateObj.getFullYear()).toBe(indicatorTime.getFullYear());
    expect(currentDateObj.getMonth()).toBe(indicatorTime.getMonth());
    expect(currentDateObj.getDate()).toBe(indicatorTime.getDate());
  });
});
