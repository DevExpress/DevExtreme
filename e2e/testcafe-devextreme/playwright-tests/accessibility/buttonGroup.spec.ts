import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - buttonGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ text: 'text_1' }, { text: 'text_2' }], selectionMode: 'single' });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup empty', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [], selectionMode: 'single' });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup disabled', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ text: 'text_1' }, { text: 'text_2' }], disabled: true, selectionMode: 'single' });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup multiple selection mode', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ text: 'text_1' }, { text: 'text_2' }], selectionMode: 'multiple', selectedItemKeys: ['text_1'] });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup none selection mode', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ text: 'text_1' }, { text: 'text_2' }], selectionMode: 'none' });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup with icons', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ icon: 'user' }, { icon: 'check' }], selectionMode: 'single' });
    await a11yCheck(page, {}, '#container');
  });

  test('buttonGroup with disabled item', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', { items: [{ text: 'text_1' }, { text: 'text_2', disabled: true }], selectionMode: 'single' });
    await a11yCheck(page, {}, '#container');
  });
});
