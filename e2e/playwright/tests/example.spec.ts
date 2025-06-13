import { test, expect } from '../fixtures/fixtures';

test('dxScheduler can be initialized', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
  });
  await expect(page.locator('.dx-scheduler')).toBeVisible();
  await expect(page).toHaveScreenshot('scheduler-init.png');
});
