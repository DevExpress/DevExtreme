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
    await page.expect(pagination.element.hasClass('dx-state-invisible'))
      .ok();

    });

  test('PageSize selector test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    itemCount: 50,
    pageIndex: 2,
    pageSize: 8, // pageCount: 7
    allowedPageSizes: [2, 4, 8],
  });

    const pagination = page.locator('#container');

    await pagination.getPageSize(1).element.click()
      .expect(pagination.option('pageCount'))
      .eql(13);

    });

  test('PageIndex test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    itemCount: 50,
    pageIndex: 1,
    pageSize: 5, // pageCount: 10
  });

    const pagination = page.locator('#container');

    await page.expect(pagination.option('pageIndex'))
      .eql(1)
      .click(pagination.getNavPage('5').element)
      .expect(pagination.option('pageIndex'))
      .eql(5);

    });

  test('PageIndex correction test', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
    itemCount: 50,
    pageIndex: 10,
    pageSize: 5, // pageCount: 10
  });

    const pagination = page.locator('#container');

    await page.expect(pagination.option('pageIndex'))
      .eql(10)
      .click(pagination.getPageSize(1).element)
      .expect(pagination.option('pageIndex'))
      .eql(5);

    });
});
