import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - contextMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxContextMenu', { target: '#container', items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('context menu with single selection mode', async ({ page }) => {
    await createWidget(page, 'dxContextMenu', {
      target: '#container',
      items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }],
      selectionMode: 'single',
    });
    await page.evaluate(() => {
      (window as any).$('#container').dxContextMenu('show');
    });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled context menu', async ({ page }) => {
    await createWidget(page, 'dxContextMenu', {
      target: '#container',
      items: [{ text: 'Item 1' }, { text: 'Item 2' }],
      disabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('context menu with submenu items', async ({ page }) => {
    await createWidget(page, 'dxContextMenu', {
      target: '#container',
      items: [
        { text: 'Item 1', items: [{ text: 'Sub 1' }, { text: 'Sub 2' }] },
        { text: 'Item 2' },
      ],
    });
    await page.evaluate(() => {
      (window as any).$('#container').dxContextMenu('show');
    });
    await a11yCheck(page, {}, '#container');
  });
});
