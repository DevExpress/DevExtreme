import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const createScheduler = async (page: Page, container: string): Promise<void> => createWidget(
  page,
  'dxScheduler',
  {
    dataSource: [],
    currentDate: new Date(2022, 3, 5),
    height: 600,
    views: ['day'],
    currentView: 'day',
  },
  container,
);

test('First scheduler should work after removing second (T1063130)', async ({ page }) => {
  await createScheduler(page, '#container');
  await createScheduler(page, '#otherContainer');

  const scheduler = new Scheduler(page, '#container');
  const { navigator } = scheduler.toolbar;

  await navigator.nextButton.click();

  await expect(navigator.caption).toHaveText('6 April 2022');
});
