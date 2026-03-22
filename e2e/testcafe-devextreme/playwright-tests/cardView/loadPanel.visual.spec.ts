import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

test.describe('CardView - LoadPanel', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Default render', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await createWidget(page, 'dxCardView', {
      width: 500,
      height: 300,
      dataSource: {
        key: 'id',
        load: () => new Promise(() => {}),
      },
      columns: ['A', 'B', 'C', 'D'],
    });

    await testScreenshot(page, 'load-panel.png', {
      element: page.locator('#container'),
    });
  });

  test('Default render when CardView has a large height', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await createWidget(page, 'dxCardView', {
      width: 500,
      height: 3000,
      dataSource: {
        key: 'id',
        load: () => new Promise(() => {}),
      },
      columns: ['A', 'B', 'C', 'D'],
    });

    await testScreenshot(page, 'load-panel-with-large-height.png');
  });
});
