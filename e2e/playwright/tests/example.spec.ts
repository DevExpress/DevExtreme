import { test, expect } from '../fixtures/fixtures';

test('get started link', async ({ page, dxScheduler }) => {
  await dxScheduler({
    dataSource: [],
  });
  await expect(page.locator('.dx-scheduler')).toBeVisible();
});
