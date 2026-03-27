import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - selectBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox empty', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: [], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox with value', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], value: 'HD Video Player', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox disabled', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox with search enabled', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], searchEnabled: true, searchTimeout: 0, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('selectBox with label and showClearButton', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', { dataSource: ['HD Video Player', 'SuperHD Video Player'], value: 'HD Video Player', label: 'label', showClearButton: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
