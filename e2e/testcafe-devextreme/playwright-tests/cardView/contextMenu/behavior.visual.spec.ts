import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - ContextMenu Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Context menu should be shown at the mouse cursor', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ ID: 1 }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right', position: { x: 10, y: 10 } });

    await testScreenshot(page, 'card-view_context-menu_mouse-click_position.png', {
      element: page.locator('#container'),
    });
  });
});
