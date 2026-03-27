import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxSlider', { value: 45 });
    await a11yCheck(page, {}, '#container');
  });

  test('slider disabled', async ({ page }) => {
    await createWidget(page, 'dxSlider', { value: 45, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('slider readOnly', async ({ page }) => {
    await createWidget(page, 'dxSlider', { value: 45, readOnly: true });
    await a11yCheck(page, {}, '#container');
  });

  test('slider with label and tooltip', async ({ page }) => {
    await createWidget(page, 'dxSlider', {
      value: 45,
      label: { visible: true, position: 'top' },
      tooltip: { enabled: true, showMode: 'always', position: 'bottom' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('slider with name and min/max', async ({ page }) => {
    await createWidget(page, 'dxSlider', { value: 45, min: 10, max: 90, name: 'slider' });
    await a11yCheck(page, {}, '#container');
  });
});
