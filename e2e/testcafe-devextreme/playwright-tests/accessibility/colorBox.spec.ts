import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - colorBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox opened', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', opened: true, deferRendering: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox with alpha channel', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', opened: true, editAlphaChannel: true, deferRendering: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox disabled', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', showClearButton: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox with label', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', label: 'label', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox without deferRendering', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', opened: false, deferRendering: false, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox without value', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox with placeholder', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { placeholder: 'placeholder', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox without showDropDownButton', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', showDropDownButton: false, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('colorBox with custom button', async ({ page }) => {
    await createWidget(page, 'dxColorBox', { value: '#f05b41', buttons: [{ name: 'today', location: 'before', options: { text: 'Today', stylingMode: 'text' } }], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
