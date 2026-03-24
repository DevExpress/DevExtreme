import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pagination Base Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Pagination visibile property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      visible: false,
    });

    const pagination = page.locator('#container');
    expect(await pagination.evaluate((el) => el.classList.contains('dx-state-invisible'))).toBe(true);
  });

  test('PageSize selector test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 2,
      pageSize: 8,
      allowedPageSizes: [2, 4, 8],
    });

    const pagination = page.locator('#container');
    await pagination.locator('.dx-page-size').nth(1).click();

    const pageCount = await page.evaluate(() =>
      ($('#container') as any).dxPagination('instance').option('pageCount'),
    );
    expect(pageCount).toBe(13);
  });

  test('PageIndex test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 1,
      pageSize: 5,
    });

    const pageIndex = await page.evaluate(() =>
      ($('#container') as any).dxPagination('instance').option('pageIndex'),
    );
    expect(pageIndex).toBe(1);

    await page.locator('.dx-page').filter({ hasText: '5' }).click();

    const newPageIndex = await page.evaluate(() =>
      ($('#container') as any).dxPagination('instance').option('pageIndex'),
    );
    expect(newPageIndex).toBe(5);
  });

  test('PageIndex correction test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      pageIndex: 10,
      pageSize: 5,
    });

    const pageIndex = await page.evaluate(() =>
      ($('#container') as any).dxPagination('instance').option('pageIndex'),
    );
    expect(pageIndex).toBe(10);

    await page.locator('#container .dx-page-size').nth(1).click();

    const newPageIndex = await page.evaluate(() =>
      ($('#container') as any).dxPagination('instance').option('pageIndex'),
    );
    expect(newPageIndex).toBe(5);
  });
});
