import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Single mode', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('Multiple mode always', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('Multiple mode onClick', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('Multiple mode onLongTap', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('Multiple mode without Select All', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });
});
