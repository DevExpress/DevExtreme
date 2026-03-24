import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Interaction of two schedulers', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  const createScheduler = async (page, container): Promise<void> => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentDate: new Date(2022, 3, 5),
      height: 600,
      views: ['day'],
      currentView: 'day',
    }, container);
  };

  // TODO: needs Scheduler page object (scheduler.toolbar.navigator)
  test.skip('First scheduler should work after removing second (T1063130)', async ({ page }) => {
    await createScheduler(page, '#container');
    await createScheduler(page, '#otherContainer');

    await page.evaluate(() => {
      ($('#otherContainer') as any).dxScheduler('instance').dispose();
    });

    await page.locator('.dx-scheduler-navigator-next').click();
    const caption = await page.locator('.dx-scheduler-navigator-caption').textContent();
    expect(caption).toContain('6 April 2022');
  });
});
