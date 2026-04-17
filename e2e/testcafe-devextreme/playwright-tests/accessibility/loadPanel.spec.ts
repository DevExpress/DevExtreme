import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - loadPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, showIndicator: true });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel without indicator', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, showIndicator: false });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel without pane', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, showPane: false });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel with message', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, message: 'Loading...' });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel without indicator and without pane', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, showIndicator: false, showPane: false, message: 'message' });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel not visible', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: false, showIndicator: true });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel with width and height', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, width: 200, height: 90, message: 'Loading...' });
    await a11yCheck(page, {}, '#container');
  });

  test('loadPanel with shading', async ({ page }) => {
    await createWidget(page, 'dxLoadPanel', { visible: true, shading: true, shadingColor: 'rgba(0,0,0,0.4)', message: 'Please wait...' });
    await a11yCheck(page, {}, '#container');
  });
});
