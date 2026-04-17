import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - ContextMenu Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test.skip('Context menu should be shown at the mouse cursor', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ ID: 1 }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click({ button: 'right', position: { x: 10, y: 10 } });

    await testScreenshot(page, 'card-view_context-menu_mouse-click_position.png', {
      element: page.locator('#container'),
    });
  });

  test('Context menu should be shown at center of the header item if shown with the keyboard', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ ID: 1 }],
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    const box = await headerItem.boundingBox();

    await page.evaluate(([x, y]) => {
      const element = document.querySelector('.dx-cardview-headers .dx-cardview-header-item');
      const event = new MouseEvent('contextmenu');
      Object.defineProperty(event, 'pageX', { value: x });
      Object.defineProperty(event, 'pageY', { value: y });
      element!.dispatchEvent(event);
    }, [box!.x + box!.width / 2, box!.y + box!.height / 2]);

    await testScreenshot(page, 'card-view_context-menu_keyboard_position.png', {
      element: page.locator('#container'),
    });
  });
});
