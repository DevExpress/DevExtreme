import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { classMatcher } from '../../../models/internal/classMatcher';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const DISABLED_CLASS = 'dx-state-disabled';

const createScheduler = async (page: Page, options = {}): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    ...options,
    dataSource: [],
    currentDate: new Date(2017, 4, 18),
    firstDayOfWeek: 1,
    height: 600,
    views: ['week', 'month'],
  });
};

test.describe('Scheduler: Navigator', () => {
  test('Navigator can change week when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      max: new Date(2017, 4, 24),
      currentView: 'week',
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    // Navigation `next` must be enabled at default

    await expect(toolbar.navigator.nextButton).not.toHaveClass(classMatcher(DISABLED_CLASS));

    // Navigation `next` must be disabled after change 1 week earlier

    await toolbar.navigator.nextButton.click();
    await expect(toolbar.navigator.nextButton).toHaveClass(classMatcher(DISABLED_CLASS));
  });

  test('Navigator can change week when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      min: new Date(2017, 4, 13),
      currentView: 'week',
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    // Navigation `prev` must be enabled at default

    await expect(toolbar.navigator.prevButton).not.toHaveClass(classMatcher(DISABLED_CLASS));

    // Navigation `prev` must be disabled after change 1 week later

    await toolbar.navigator.prevButton.click();
    await expect(toolbar.navigator.prevButton).toHaveClass(classMatcher(DISABLED_CLASS));
  });

  test('Navigator can change month when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      max: new Date(2017, 5, 15),
      currentView: 'month',
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    // Navigation `next` must be enabled at default

    await expect(toolbar.navigator.nextButton).not.toHaveClass(classMatcher(DISABLED_CLASS));

    // Navigation `next` must be disabled after change 1 week earlier

    await toolbar.navigator.nextButton.click();
    await expect(toolbar.navigator.nextButton).toHaveClass(classMatcher(DISABLED_CLASS));
  });

  test('Navigator can change month when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      min: new Date(2017, 3, 28),
      currentView: 'month',
    });

    const { toolbar } = new Scheduler(page, SCHEDULER_SELECTOR);

    // Navigation `prev` must be enabled at default

    await expect(toolbar.navigator.prevButton).not.toHaveClass(classMatcher(DISABLED_CLASS));

    // Navigation `prev` must be disabled after change 1 week later

    await toolbar.navigator.prevButton.click();
    await expect(toolbar.navigator.prevButton).toHaveClass(classMatcher(DISABLED_CLASS));
  });
});
