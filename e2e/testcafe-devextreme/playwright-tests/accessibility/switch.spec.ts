import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: true });
    await a11yCheck(page, {}, '#container');
  });

  test('switch off', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: false });
    await a11yCheck(page, {}, '#container');
  });

  test('switch disabled on', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: true, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('switch disabled off', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: false, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('switch readOnly', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: true, readOnly: true });
    await a11yCheck(page, {}, '#container');
  });

  test('switch with name', async ({ page }) => {
    await createWidget(page, 'dxSwitch', { value: true, name: 'switchName' });
    await a11yCheck(page, {}, '#container');
  });
});
