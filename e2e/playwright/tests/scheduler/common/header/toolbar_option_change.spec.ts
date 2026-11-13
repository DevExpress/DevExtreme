import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const createScheduler = async (page: Page): Promise<void> => createWidget(page, 'dxScheduler', {
  views: ['day', 'week'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 27),
  height: 200,
  width: 500,
});
const buttons = Array.from({ length: 7 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test.describe('Scheduler: Toolbar options change', () => {
  test.beforeEach(async ({ page }) => {
    await createScheduler(page);
  });

  test('Scheduler should change toolbar item location', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar.items[0].location', 'after');

    await testScreenshot(page, 'scheduler-toolbar-location-changed.png', { element: scheduler.toolbar.element });
  });

  test('Scheduler should change toolbar', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar', { items: [{ template: 'Custom text' }] });

    await testScreenshot(page, 'scheduler-toolbar-changed.png', { element: scheduler.toolbar.element });
  });

  test('Scheduler should hide and show toolbar', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar.visible', false);
    await scheduler.toolbar.expectInvisible();
    await scheduler.option('toolbar.visible', true);
    await scheduler.toolbar.expectInvisible(false);
  });

  test('Scheduler should change toolbar items', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar.items', buttons);

    await testScreenshot(page, 'scheduler-toolbar-items-changed.png', { element: scheduler.toolbar.element });
  });

  test('Scheduler should change toolbar item option', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar.items[0].options.text', 'Changed text');

    await testScreenshot(page, 'scheduler-toolbar-item-option-changed.png', { element: scheduler.toolbar.element });
  });

  test('Scheduler should change toolbar options / integration', async ({ page }) => {
    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.option('toolbar.items', buttons);
    await scheduler.option('toolbar.multiline', true);

    await testScreenshot(page, 'scheduler-toolbar-property-changed.png', { element: scheduler.toolbar.element });

    await scheduler.option('toolbar', { multiline: false });

    await testScreenshot(page, 'scheduler-toolbar-changed-2.png', { element: scheduler.toolbar.element });
  });
});
