import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toasts in TreeList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Toast should be visible after calling and should be not visible after default display time', async ({ page }) => {

    createWidget(page, 'dxTreeList', {});

    const treeList = page.locator('#container');
    await treeList.isReady();
    await treeList.apiShowErrorToast();
    await expect(treeList.getToast().exists).ok();

    await testScreenshot(page, 'ai-column__toast__at-the-right-position.png', { element: treeList.element });
    await expect(treeList.getToast().exists).notOk();

    });
});
