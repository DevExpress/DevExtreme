import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Should sort without DataSource reload if scrolling mode isn\'t virtual', async ({ page }) => {
    // skipped: requires .before()/.after() with RequestMock, RequestLogger, addRequestHooks
  });

  test.skip('Should sort with DataSource reload if scrolling mode is virtual', async ({ page }) => {
    // skipped: requires .before()/.after() with RequestMock, RequestLogger, addRequestHooks
  });
});
