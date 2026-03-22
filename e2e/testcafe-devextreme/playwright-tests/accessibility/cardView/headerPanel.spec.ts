import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView headerPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Default render', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('render with header filter enabled', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('render with single sorting', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('render with multiple sorting', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('headerPanel column chooser link', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });
});
