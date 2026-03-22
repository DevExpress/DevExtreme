import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Scheduler: Navigator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const createScheduler = async (options = {}): Promise<void> => {
  await createWidget(page, 'dxScheduler', extend(options, {
    dataSource: [],
    currentDate: new Date(2017, 4, 18),
    firstDayOfWeek: 1,
    height: 600,
    views: ['week', 'month'],
  }));
};

test('Navigator can change week when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
  // Scheduler on '#container' (destructured: toolbar )

  // Navigation `next` must be enabled at default

  expect(page.locator('.dx-scheduler-navigator-next').hasClass('dx-state-disabled')).toBeFalsy();

  // Navigation `next` must be disabled after change 1 week earlier

  await (page.locator('.dx-scheduler-navigator-next')).click()
    .expect(page.locator('.dx-scheduler-navigator-next').hasClass('dx-state-disabled')).toBeTruthy();
}).before(async () => createScheduler({
  max: new Date(2017, 4, 24),
  currentView: 'week',
}));

test('Navigator can change week when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
  // Scheduler on '#container' (destructured: toolbar )

  // Navigation `prev` must be enabled at default

  expect(page.locator('.dx-scheduler-navigator-previous').hasClass('dx-state-disabled')).toBeFalsy();

  // Navigation `prev` must be disabled after change 1 week later

  await (page.locator('.dx-scheduler-navigator-previous')).click()
    .expect(page.locator('.dx-scheduler-navigator-previous').hasClass('dx-state-disabled')).toBeTruthy();
}).before(async () => createScheduler({
  min: new Date(2017, 4, 13),
  currentView: 'week',
}));

test('Navigator can change month when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
  // Scheduler on '#container' (destructured: toolbar )

  // Navigation `next` must be enabled at default

  expect(page.locator('.dx-scheduler-navigator-next').hasClass('dx-state-disabled')).toBeFalsy();

  // Navigation `next` must be disabled after change 1 week earlier

  await (page.locator('.dx-scheduler-navigator-next')).click()
    .expect(page.locator('.dx-scheduler-navigator-next').hasClass('dx-state-disabled')).toBeTruthy();
}).before(async () => createScheduler({
  max: new Date(2017, 5, 15),
  currentView: 'month',
}));

test('Navigator can change month when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
  // Scheduler on '#container' (destructured: toolbar )

  // Navigation `prev` must be enabled at default

  expect(page.locator('.dx-scheduler-navigator-previous').hasClass('dx-state-disabled')).toBeFalsy();

  // Navigation `prev` must be disabled after change 1 week later

  await (page.locator('.dx-scheduler-navigator-previous')).click()
    .expect(page.locator('.dx-scheduler-navigator-previous').hasClass('dx-state-disabled')).toBeTruthy();
}).before(async () => createScheduler({
  min: new Date(2017, 3, 28),
  currentView: 'month',
}));
});
