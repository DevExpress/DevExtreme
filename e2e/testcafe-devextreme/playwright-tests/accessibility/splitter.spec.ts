import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - splitter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxSplitter', { dataSource: [{ text: 'Left Pane', size: '140px' }, { text: 'Right Pane', size: '140px' }], height: 400, width: 450 });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });

  test('splitter with keyboard navigation disabled', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      dataSource: [{ text: 'Left Pane', size: '140px' }, { text: 'Right Pane', size: '140px' }],
      height: 400,
      width: 450,
      allowKeyboardNavigation: false,
    });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });

  test('disabled splitter', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      dataSource: [{ text: 'Left Pane', size: '140px' }, { text: 'Right Pane', size: '140px' }],
      height: 400,
      width: 450,
      disabled: true,
    });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });

  test('splitter with vertical orientation', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      dataSource: [{ text: 'Top Pane' }, { text: 'Bottom Pane' }],
      orientation: 'vertical',
      height: 400,
      width: 450,
    });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });

  test('splitter with custom separator size', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      dataSource: [{ text: 'Left Pane', size: '140px' }, { text: 'Right Pane', size: '140px' }],
      height: 400,
      width: 450,
      separatorSize: 5,
    });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });

  test('splitter with auto width', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      dataSource: [{ text: 'Left Pane' }, { text: 'Right Pane' }],
      height: 400,
      width: 'auto',
    });
    await a11yCheck(page, { rules: { 'scrollable-region-focusable': { enabled: false } } }, '#container');
  });
});
