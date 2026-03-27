import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxPopover', { visible: true, target: '#container', width: 300, height: 280 });
    await a11yCheck(page, {}, '#container');
  });

  test('popover with title', async ({ page }) => {
    await createWidget(page, 'dxPopover', { visible: true, target: '#container', width: 300, height: 280, showTitle: true, title: 'title' });
    await a11yCheck(page, {}, '#container');
  });

  test('popover with showCloseButton', async ({ page }) => {
    await createWidget(page, 'dxPopover', { visible: true, target: '#container', width: 300, height: 280, showTitle: true, showCloseButton: true });
    await a11yCheck(page, {}, '#container');
  });

  test('popover without title header', async ({ page }) => {
    await createWidget(page, 'dxPopover', { visible: true, target: '#container', width: 300, height: 280, showTitle: false });
    await a11yCheck(page, {}, '#container');
  });

  test('popover with toolbar items', async ({ page }) => {
    await createWidget(page, 'dxPopover', {
      visible: true,
      target: '#container',
      width: 300,
      height: 280,
      showTitle: true,
      toolbarItems: [{ location: 'before', widget: 'dxButton', options: { icon: 'back' } }],
    });
    await a11yCheck(page, {}, '#container');
  });
});
