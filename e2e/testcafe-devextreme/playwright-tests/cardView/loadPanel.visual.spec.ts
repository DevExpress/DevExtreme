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

  test('The load panel should match the size of the component\'s root container', async ({ page }) => {
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

    const container = page.locator('#container');
    const containerBox = await container.boundingBox();

    const loadPanelShadow = page.locator('.dx-loadpanel-wrapper .dx-loadpanel');
    const loadPanelBox = await loadPanelShadow.boundingBox();

    if (loadPanelBox && containerBox) {
      expect(Math.round(loadPanelBox.width)).toBe(500);
      expect(Math.round(loadPanelBox.height)).toBe(300);
    }
  });
});
