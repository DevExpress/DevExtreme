import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - validationSummary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', {});
    await a11yCheck(page, {}, '#container');
  });

  test('validationSummary with validationGroup', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', { validationGroup: 'myGroup' });
    await a11yCheck(page, {}, '#container');
  });

  test('validationSummary with elementAttr', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', { elementAttr: { 'aria-label': 'Validation Summary' } });
    await a11yCheck(page, {}, '#container');
  });

  test('validationSummary with validationGroup and elementAttr', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', { validationGroup: 'formGroup', elementAttr: { 'aria-label': 'Form Errors' } });
    await a11yCheck(page, {}, '#container');
  });

  test('validationSummary with custom width', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', { width: 300 });
    await a11yCheck(page, {}, '#container');
  });

  test('validationSummary with custom height', async ({ page }) => {
    await createWidget(page, 'dxValidationSummary', { height: 100 });
    await a11yCheck(page, {}, '#container');
  });
});
