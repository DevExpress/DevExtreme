import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTooltip', { visible: true, target: '#container', width: 50, height: 25 });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled tooltip', async ({ page }) => {
    await createWidget(page, 'dxTooltip', { visible: true, target: '#container', width: 50, height: 25, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('tooltip with custom content', async ({ page }) => {
    await createWidget(page, 'dxTooltip', {
      visible: true,
      target: '#container',
      width: 150,
      height: 50,
      contentTemplate: () => '<b>Tooltip content</b>',
    });
    await a11yCheck(page, {}, '#container');
  });
});
