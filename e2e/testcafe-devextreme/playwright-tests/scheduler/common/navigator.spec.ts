import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Scheduler: Navigator', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  const createScheduler = async (page, options = {}): Promise<void> => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentDate: new Date(2017, 4, 18),
      firstDayOfWeek: 1,
      height: 600,
      views: ['week', 'month'],
      ...options,
    });
  };

  test('Navigator can change week when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      max: new Date(2017, 4, 24),
      currentView: 'week',
    });

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const isDisabledBefore = await nextButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledBefore).toBe(false);

    await nextButton.click();

    const isDisabledAfter = await nextButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledAfter).toBe(true);
  });

  test('Navigator can change week when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      min: new Date(2017, 4, 13),
      currentView: 'week',
    });

    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const isDisabledBefore = await prevButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledBefore).toBe(false);

    await prevButton.click();

    const isDisabledAfter = await prevButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledAfter).toBe(true);
  });

  test('Navigator can change month when current date interval is more than diff between current date and `max` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      max: new Date(2017, 5, 15),
      currentView: 'month',
    });

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const isDisabledBefore = await nextButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledBefore).toBe(false);

    await nextButton.click();

    const isDisabledAfter = await nextButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledAfter).toBe(true);
  });

  test('Navigator can change month when current date interval is more than diff between current date and `min` (T830754)', async ({ page }) => {
    await createScheduler(page, {
      min: new Date(2017, 3, 28),
      currentView: 'month',
    });

    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const isDisabledBefore = await prevButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledBefore).toBe(false);

    await prevButton.click();

    const isDisabledAfter = await prevButton.evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabledAfter).toBe(true);
  });
});
