import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxButton', { text: 'text', icon: 'user' });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });

  test('button disabled', async ({ page }) => {
    await createWidget(page, 'dxButton', { text: 'text', disabled: true });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });

  test('button with text only', async ({ page }) => {
    await createWidget(page, 'dxButton', { text: 'Click me', elementAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });

  test('button with icon only', async ({ page }) => {
    await createWidget(page, 'dxButton', { icon: 'user', elementAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });

  test('button with useSubmitBehavior', async ({ page }) => {
    await createWidget(page, 'dxButton', { text: 'Submit', useSubmitBehavior: true });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });

  test('button disabled with icon only', async ({ page }) => {
    await createWidget(page, 'dxButton', { icon: 'save', disabled: true, elementAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, { rules: { 'nested-interactive': { enabled: false } } }, '#container');
  });
});
