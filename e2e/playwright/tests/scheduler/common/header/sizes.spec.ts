import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const buttons = Array.from({ length: 4 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test('items inside toolbar menu should stretch', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    width: 320,
    currentDate: new Date('2025-05-02T07:59:01.167Z'),
    toolbar: {
      items: ['today', 'dateNavigator', ...buttons, {
        location: 'after',
        locateInMenu: 'auto',
        name: 'viewSwitcher',
      }],
    },
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.toolbar.menuButton.click();

  await expect(page.locator('.dx-overlay-content .dx-toolbar-menu-section').first()).toBeVisible();

  await testScreenshot(page, 'scheduler-toolbar-menu.png');
});

test('Scheduler header should have correct sizes', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date('2025-05-02T07:59:01.167Z'),
    toolbar: { items: ['today', 'dateNavigator', ...buttons, 'viewSwitcher'] },
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'scheduler-toolbar.png', { element: scheduler.toolbar.element });
});
