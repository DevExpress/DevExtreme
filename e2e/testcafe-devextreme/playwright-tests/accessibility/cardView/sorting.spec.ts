import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView sorting', () => {
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

  test.skip('Default multiple sorting render', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('Sort index API', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('ShowSortIndexes API', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('AllowSorting API', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('CalculateSortValue API', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });

  test.skip('SortingMethod API', async ({ page }) => {
    // TODO: Convert a11yCheck() to Playwright with @axe-core/playwright
  });
});
