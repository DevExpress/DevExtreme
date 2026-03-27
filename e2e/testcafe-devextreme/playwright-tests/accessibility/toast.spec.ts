import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, message: 'message', type: 'info' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast type error', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, message: 'Error occurred', type: 'error' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast type success', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, message: 'Operation completed', type: 'success' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast type warning', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, message: 'Warning', type: 'warning' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast type custom', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, type: 'custom' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast without message', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, type: 'info' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast error without message', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, type: 'error' });
    await a11yCheck(page, {}, '#container');
  });

  test('toast success without message', async ({ page }) => {
    await createWidget(page, 'dxToast', { visible: true, type: 'success' });
    await a11yCheck(page, {}, '#container');
  });
});
