import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - checkBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: true, elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });

  test('checkBox unchecked', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: false, elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });

  test('checkBox indeterminate with three-state', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: null, enableThreeStateBehavior: true, elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });

  test('checkBox disabled', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: true, disabled: true, elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });

  test('checkBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: true, readOnly: true, elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });

  test('checkBox with text', async ({ page }) => {
    await createWidget(page, 'dxCheckBox', { value: true, text: 'text', elementAttr: { 'aria-label': 'Checked' } });
    await a11yCheck(page, {}, '#container');
  });
});
