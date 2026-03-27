import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - tagBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with value', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox disabled', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with search enabled', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], searchEnabled: true, searchTimeout: 0, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], showClearButton: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox opened with showSelectionControls', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], opened: true, showSelectionControls: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox opened without showSelectionControls', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], opened: true, showSelectionControls: false, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with label', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], label: 'label', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox without showDropDownButton', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], showDropDownButton: false, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with custom button', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], value: ['HD Video Player'], buttons: [{ name: 'today', location: 'before', options: { text: 'Today', stylingMode: 'text' } }], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('tagBox with placeholder', async ({ page }) => {
    await createWidget(page, 'dxTagBox', { dataSource: ['HD Video Player', 'SuperHD Video Player', 'SuperPlasma 50'], placeholder: 'placeholder', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
