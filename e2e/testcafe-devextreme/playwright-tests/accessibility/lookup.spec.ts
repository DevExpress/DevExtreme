import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: ['John Heart', 'Samantha Bright'], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('lookup empty', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: [], inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('lookup disabled', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: ['John Heart', 'Samantha Bright'], disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('lookup readOnly', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: ['John Heart', 'Samantha Bright'], readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('lookup with placeholder', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: ['John Heart', 'Samantha Bright'], placeholder: 'Select person', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('lookup opened', async ({ page }) => {
    await createWidget(page, 'dxLookup', { dataSource: ['John Heart', 'Samantha Bright'], opened: true, deferRendering: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
