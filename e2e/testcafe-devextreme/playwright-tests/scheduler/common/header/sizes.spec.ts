import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const buttons = Array.from({ length: 4 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test.describe.skip('Scheduler header sizes', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

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

    const menuButton = page.locator('.dx-scheduler-header .dx-toolbar-menu-container .dx-dropdownmenu, .dx-scheduler-header .dx-toolbar-menu-container .dx-button');
    await menuButton.click();

    await testScreenshot(page, 'scheduler-toolbar-menu.png');
  });

  test('Scheduler header should have correct sizes', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date('2025-05-02T07:59:01.167Z'),
      toolbar: { items: ['today', 'dateNavigator', ...buttons, 'viewSwitcher'] },
    });

    await testScreenshot(page, 'scheduler-toolbar.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });
});
