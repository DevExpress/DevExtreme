import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxForm', { height: 200, formData: { ID: 1, FirstName: 'John', LastName: 'Heart' } });
    await a11yCheck(page, {}, '#container');
  });

  test('form with alignItemLabels false', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      height: 200,
      alignItemLabels: false,
      formData: { ID: 1, FirstName: 'John', LastName: 'Heart', Position: 'CEO', Active: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('form with showOptionalMark', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      height: 200,
      showOptionalMark: true,
      formData: { ID: 1, FirstName: 'John', LastName: 'Heart', Position: 'CEO', Active: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('form with required mark', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      height: 200,
      showRequiredMark: true,
      items: [{
        itemType: 'simple',
        dataField: 'Email',
        validationRules: [{ type: 'required', message: 'Email is required' }],
      }],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('form with validation summary', async ({ page }) => {
    await createWidget(page, 'dxForm', {
      height: 200,
      showValidationSummary: true,
      items: [{
        itemType: 'simple',
        dataField: 'Email',
        validationRules: [{ type: 'required', message: 'Email is required' }],
      }],
    });
    await a11yCheck(page, {}, '#container');
  });
});
