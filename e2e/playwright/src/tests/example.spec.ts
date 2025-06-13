import { test, expect } from '../fixtures/fixtures';

test('dxScheduler can be initialized', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
  });
  await expect(page.locator('.dx-scheduler')).toBeVisible();
  await expect(page).toHaveScreenshot('scheduler-init.png');
});

test('dxScheduler should fail', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
    endDayHour: 14,
    startDayHour: 2,
  });
  await expect(page.locator('.dx-scheduler')).not.toBeVisible();
});

test('dxScheduler should pass', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
    endDayHour: 14,
    startDayHour: 2,
  });
  await expect(page.locator('.dx-scheduler')).toBeVisible();
});
