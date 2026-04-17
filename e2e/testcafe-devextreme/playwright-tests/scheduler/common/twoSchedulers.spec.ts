import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, Scheduler } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Interaction of two schedulers', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  const createSchedulerWidget = async (page, container): Promise<void> => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentDate: new Date(2022, 3, 5),
      height: 600,
      views: ['day'],
      currentView: 'day',
    }, container);
  };

  test('First scheduler should work after removing second (T1063130)', async ({ page }) => {
    await createSchedulerWidget(page, '#container');
    await createSchedulerWidget(page, '#otherContainer');

    await page.evaluate(() => {
      ($('#otherContainer') as any).dxScheduler('instance').dispose();
    });

    const scheduler = new Scheduler(page, '#container');
    await scheduler.toolbar.navigator.nextButton.click();
    const caption = await scheduler.toolbar.navigator.caption.textContent();
    expect(caption).toContain('6 April 2022');
  });
});
