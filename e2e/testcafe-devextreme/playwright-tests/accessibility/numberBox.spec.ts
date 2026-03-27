import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - numberBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox disabled', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox with showClearButton and showSpinButtons', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, showClearButton: true, showSpinButtons: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox with placeholder', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { placeholder: 'Enter value', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox disabled with placeholder', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { placeholder: 'Enter value', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox readOnly with showSpinButtons', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, readOnly: true, showSpinButtons: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox disabled with showSpinButtons', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, disabled: true, showSpinButtons: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox with min and max', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 50, min: 0, max: 100, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox with name', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, name: 'quantity', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('numberBox with label', async ({ page }) => {
    await createWidget(page, 'dxNumberBox', { value: 20.5, label: 'Amount', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
