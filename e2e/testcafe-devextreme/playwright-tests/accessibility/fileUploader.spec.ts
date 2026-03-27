import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - fileUploader', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader disabled', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader readOnly', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader multiple', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, multiple: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader with name', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, name: 'fileUploader', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader disabled multiple', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, disabled: true, multiple: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('fileUploader readOnly multiple with name', async ({ page }) => {
    await createWidget(page, 'dxFileUploader', { focusStateEnabled: true, readOnly: true, multiple: true, name: 'fileUploader', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
