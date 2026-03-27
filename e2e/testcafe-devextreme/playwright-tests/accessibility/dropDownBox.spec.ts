import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - dropDownBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', { dataSource: ['Item_1', 'Item_2', 'Item_3'], inputAttr: { 'aria-label': 'DropDownBox' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox empty', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', { dataSource: [], inputAttr: { 'aria-label': 'DropDownBox' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox disabled', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', { dataSource: ['Item_1', 'Item_2', 'Item_3'], disabled: true, inputAttr: { 'aria-label': 'DropDownBox' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', { dataSource: ['Item_1', 'Item_2', 'Item_3'], readOnly: true, inputAttr: { 'aria-label': 'DropDownBox' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox with label and showClearButton', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      value: 'Item_1',
      label: 'label',
      showClearButton: true,
      inputAttr: { 'aria-label': 'DropDownBox' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox opened with deferRendering', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      value: 'Item_1',
      opened: true,
      deferRendering: true,
      inputAttr: { 'aria-label': 'DropDownBox' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox with showDropDownButton', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      value: 'Item_1',
      showDropDownButton: true,
      inputAttr: { 'aria-label': 'DropDownBox' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dropDownBox with custom button', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dataSource: ['Item_1', 'Item_2', 'Item_3'],
      value: 'Item_1',
      inputAttr: { 'aria-label': 'DropDownBox' },
      buttons: [{ name: 'custom', location: 'before', options: { text: 'Custom', stylingMode: 'text' } }],
    });
    await a11yCheck(page, {}, '#container');
  });
});
