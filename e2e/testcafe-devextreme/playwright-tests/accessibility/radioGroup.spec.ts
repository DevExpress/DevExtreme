import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - radioGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'] });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup horizontal layout', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], layout: 'horizontal' });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup disabled', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup readOnly', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], readOnly: true });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup disabled horizontal', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], disabled: true, layout: 'horizontal' });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup readOnly horizontal', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], readOnly: true, layout: 'horizontal' });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup with value selected', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Item_1', 'Item_2', 'Item_3'], value: 'Item_2' });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup with single item', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: ['Only Item'] });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup with object items', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', {
      items: [{ id: 1, text: 'Option A' }, { id: 2, text: 'Option B' }, { id: 3, text: 'Option C' }],
      valueExpr: 'id',
      displayExpr: 'text',
      value: 2,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('radioGroup empty items', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', { items: [] });
    await a11yCheck(page, {}, '#container');
  });
});
