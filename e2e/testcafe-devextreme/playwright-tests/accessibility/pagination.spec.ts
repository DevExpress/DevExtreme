import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'full' });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination compact mode', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'compact' });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination with info text', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'full', showInfo: true, infoText: 'Total {2} items. Page {0} of {1}' });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination with page size selector', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'full', showPageSizeSelector: true });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination with navigation buttons', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'full', showNavigationButtons: true });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination compact with info text', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'compact', showInfo: true, infoText: 'Total {2} items. Page {0} of {1}' });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination compact with page size selector', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'compact', showPageSizeSelector: true });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination compact with navigation buttons', async ({ page }) => {
    await createWidget(page, 'dxPagination', { itemCount: 50, displayMode: 'compact', showNavigationButtons: true });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination with all features enabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 100,
      displayMode: 'full',
      showInfo: true,
      showNavigationButtons: true,
      showPageSizeSelector: true,
      infoText: 'Total {2} items. Page {0} of {1}',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination with page size 5', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      displayMode: 'full',
      pageSize: 5,
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('pagination on last page', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 4,
      displayMode: 'full',
      showNavigationButtons: true,
    });
    await a11yCheck(page, {}, '#container');
  });
});
