import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Interaction of two schedulers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const createScheduler = async (container): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentDate: new Date(2022, 3, 5),
    height: 600,
    views: ['day'],
    currentView: 'day',
  }, container);
};

test('First scheduler should work after removing second (T1063130)', async ({ page }) => {
  // Scheduler on '#container'
  const { navigator } = scheduler.toolbar;

  await (navigator.nextButton).click()
    .expect(navigator.caption.textContent).toBe('6 April 2022');
});

// TODO: .before() block not converted - move to test setup
// {
  await createScheduler('#container');
  await createScheduler('#otherContainer');
});
});
