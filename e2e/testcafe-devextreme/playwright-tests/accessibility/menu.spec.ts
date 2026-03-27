import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 400 });
    await a11yCheck(page, {}, '#container');
  });

  test('menu vertical orientation', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 400, orientation: 'vertical' });
    await a11yCheck(page, {}, '#container');
  });

  test('menu disabled', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 400, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('menu with adaptivity enabled', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 400, adaptivityEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('menu with nested items', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items: [{
        text: 'remove', icon: 'remove',
        items: [{ text: 'item_1' }, { text: 'item_2' }],
      }, { text: 'user', icon: 'user' }],
      width: 400,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('menu disabled vertical', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 400, disabled: true, orientation: 'vertical' });
    await a11yCheck(page, {}, '#container');
  });

  test('menu wide horizontal', async ({ page }) => {
    await createWidget(page, 'dxMenu', { items: [{ text: 'remove', icon: 'remove' }, { text: 'user', icon: 'user' }], width: 1024, orientation: 'horizontal' });
    await a11yCheck(page, {}, '#container');
  });

  test('menu with selection mode single', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items: [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }],
      width: 400,
      selectionMode: 'single',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('menu with disabled item', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items: [{ text: 'Item 1' }, { text: 'Item 2', disabled: true }, { text: 'Item 3' }],
      width: 400,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('menu with hideSubmenuOnMouseLeave', async ({ page }) => {
    await createWidget(page, 'dxMenu', {
      items: [{
        text: 'Parent',
        items: [{ text: 'Child 1' }, { text: 'Child 2' }],
      }],
      width: 400,
      hideSubmenuOnMouseLeave: true,
    });
    await a11yCheck(page, {}, '#container');
  });
});
