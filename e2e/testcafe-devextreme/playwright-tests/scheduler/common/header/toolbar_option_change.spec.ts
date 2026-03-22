import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const SCHEDULER_SELECTOR = '#container';

const createSchedulerWidget = async (page: any) => {
  await createWidget(page, 'dxScheduler', {
    views: ['day', 'week'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    height: 200,
    width: 500,
  });
};

const buttons = Array.from({ length: 7 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

const setSchedulerOption = async (page: any, optionPath: string, value: any) => {
  await page.evaluate(({ sel, opt, val }) => {
    ($(sel) as any).dxScheduler('instance').option(opt, val);
  }, { sel: SCHEDULER_SELECTOR, opt: optionPath, val: value });
};

test.describe('Scheduler: Toolbar options change', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Scheduler should change toolbar item location', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar.items[0].location', 'after');

    await testScreenshot(page, 'scheduler-toolbar-location-changed.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });

  test('Scheduler should change toolbar', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar', { items: [{ template: 'Custom text' }] });

    await testScreenshot(page, 'scheduler-toolbar-changed.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });

  test('Scheduler should hide and show toolbar', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar.visible', false);
    await expect(page.locator('.dx-scheduler-header')).not.toBeVisible();

    await setSchedulerOption(page, 'toolbar.visible', true);
    await expect(page.locator('.dx-scheduler-header')).toBeVisible();
  });

  test('Scheduler should change toolbar items', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar.items', buttons);

    await testScreenshot(page, 'scheduler-toolbar-items-changed.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });

  test('Scheduler should change toolbar item option', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar.items[0].options.text', 'Changed text');

    await testScreenshot(page, 'scheduler-toolbar-item-option-changed.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });

  test('Scheduler should change toolbar options / integration', async ({ page }) => {
    await createSchedulerWidget(page);

    await setSchedulerOption(page, 'toolbar.items', buttons);
    await setSchedulerOption(page, 'toolbar.multiline', true);

    await testScreenshot(page, 'scheduler-toolbar-property-changed.png', {
      element: page.locator('.dx-scheduler-header'),
    });

    await setSchedulerOption(page, 'toolbar', { multiline: false });

    await testScreenshot(page, 'scheduler-toolbar-changed-2.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });
});
