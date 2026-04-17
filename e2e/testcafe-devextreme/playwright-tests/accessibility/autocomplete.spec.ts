import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - autocomplete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete empty datasource', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: [], inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete disabled', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], disabled: true, inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete readOnly', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], readOnly: true, inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with value', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], value: 'Item_1', inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with placeholder', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], placeholder: 'placeholder', inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete opened with deferRendering', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], opened: true, deferRendering: true, inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with label', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], value: 'Item_1', label: 'label', inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], value: 'Item_1', showClearButton: true, inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with showDropDownButton', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', { dataSource: ['Item_1', 'Item_2', 'Item_3'], value: 'Item_1', showDropDownButton: true, inputAttr: { 'aria-label': 'aria-label' }, searchTimeout: 0 });
    await a11yCheck(page, {}, '#container');
  });

  test('autocomplete with custom button', async ({ page }) => {
    await createWidget(page, 'dxAutocomplete', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      value: 'Item_1',
      inputAttr: { 'aria-label': 'aria-label' },
      searchTimeout: 0,
      buttons: [{ name: 'custom', location: 'before', options: { text: 'Custom', stylingMode: 'text' } }],
    });
    await a11yCheck(page, {}, '#container');
  });
});
