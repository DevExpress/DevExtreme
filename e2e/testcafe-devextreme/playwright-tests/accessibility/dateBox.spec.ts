import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - dateBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'date', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox type time', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'time', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox type datetime', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'datetime', value: new Date(), inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox disabled', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'date', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'date', readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'date', value: new Date(), showClearButton: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateBox with label', async ({ page }) => {
    await createWidget(page, 'dxDateBox', { type: 'date', value: new Date(), label: 'label', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
