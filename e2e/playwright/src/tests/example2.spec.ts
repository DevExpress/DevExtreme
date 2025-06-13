import { test, expect } from '../fixtures/fixtures';

test('several screenshots', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
  });
  await expect(page.locator('.dx-scheduler')).toBeVisible();
  await expect(page).toHaveScreenshot('scheduler-1.png');
  await expect(page).toHaveScreenshot('scheduler-2.png');
});
