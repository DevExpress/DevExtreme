import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

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

test('Scheduler should change toolbar item location', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar.items[0].location', 'after');

  await testScreenshot(page, 'scheduler-toolbar-location-changed.png', { element: scheduler.toolbar.element });
});

test('Scheduler should change toolbar', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar', { items: [{ template: 'Custom text' }] });

  await testScreenshot(page, 'scheduler-toolbar-changed.png', { element: scheduler.toolbar.element });
});

test('Scheduler should hide and show toolbar', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar.visible', false);
  expect(await scheduler.toolbar.isInvisible()).toBe(true);

  await scheduler.option('toolbar.visible', true);
  expect(await scheduler.toolbar.isInvisible()).toBe(false);
});

test('Scheduler should change toolbar items', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar.items', buttons);

  await testScreenshot(page, 'scheduler-toolbar-items-changed.png', { element: scheduler.toolbar.element });
});

test('Scheduler should change toolbar item option', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar.items[0].options.text', 'Changed text');

  await testScreenshot(page, 'scheduler-toolbar-item-option-changed.png', { element: scheduler.toolbar.element });
});

test('Scheduler should change toolbar options / integration', async ({ page }) => {
  await createScheduler(page);

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('toolbar.items', buttons);
  await scheduler.option('toolbar.multiline', true);

  await testScreenshot(page, 'scheduler-toolbar-property-changed.png', { element: scheduler.toolbar.element });

  await scheduler.option('toolbar', { multiline: false });

  await testScreenshot(page, 'scheduler-toolbar-changed-2.png', { element: scheduler.toolbar.element });
});
