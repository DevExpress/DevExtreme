import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - rangeSlider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', { start: 40, end: 60 });
    await a11yCheck(page, {}, '#container');
  });

  test('disabled range slider', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', { start: 40, end: 60, disabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('read-only range slider', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', { start: 40, end: 60, readOnly: true });
    await a11yCheck(page, {}, '#container');
  });

  test('range slider with tooltip always shown', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', {
      start: 40,
      end: 60,
      tooltip: { enabled: true, showMode: 'always', position: 'bottom' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('range slider with label', async ({ page }) => {
    await createWidget(page, 'dxRangeSlider', {
      start: 40,
      end: 60,
      label: { visible: true, position: 'top' },
    });
    await a11yCheck(page, {}, '#container');
  });
});
