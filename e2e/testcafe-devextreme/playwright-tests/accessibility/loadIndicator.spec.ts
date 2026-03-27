import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - loadIndicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxLoadIndicator', {});
    await a11yCheck(page, {}, '#container');
  });

  test('loadIndicator with height', async ({ page }) => {
    await createWidget(page, 'dxLoadIndicator', { height: 40 });
    await a11yCheck(page, {}, '#container');
  });

  test('loadIndicator with width', async ({ page }) => {
    await createWidget(page, 'dxLoadIndicator', { width: 40 });
    await a11yCheck(page, {}, '#container');
  });

  test('loadIndicator with height and width', async ({ page }) => {
    await createWidget(page, 'dxLoadIndicator', { height: 40, width: 40 });
    await a11yCheck(page, {}, '#container');
  });
});
