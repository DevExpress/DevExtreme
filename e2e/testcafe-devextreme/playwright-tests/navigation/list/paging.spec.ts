import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  function generateData(count) {
    const items: { id: number }[] = [];

    for (let i = 0; i < count; i += 1) {
      items.push({ id: i + 1 });
    }
    return items;
  }

  test('Should initiate load next pages if items on the first pages are invisible', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
      visible: data.id > 8,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 2,
      },
      height: 100,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await page.expect(list.getItems().count)
      .eql(isMaterial() ? 10 : 12)
      .expect(list.getVisibleItems().count)
      .eql(isMaterial() ? 2 : 4);

    await testScreenshot(page, 'List loading with first items invisible.png', { element: '#container' });

    });

  test('Should initiate load next page if all items in the current load are invisible, pageLoadMode: scrollBottom (T1092746)', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4 || data.id > 8,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 2,
      },
      height: 100,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await list.scrollTo(100);

    await page.expect(list.getItems().count)
      .eql(isMaterial() ? 4 : 10)
      .expect(list.getVisibleItems().count)
      .eql(isMaterial() ? 4 : 6);

    await testScreenshot(page, 'List loading with middle items invisible.png', { element: '#container' });

    });

  test('Should initiate load next page if some items in the current load are invisible, pageLoadMode: scrollBottom', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4 || data.id === 8 || data.id === 11,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 2,
      },
      height: 100,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await list.scrollTo(100);

    await page.expect(list.getItems().count)
      .eql(isMaterial() ? 4 : 12)
      .expect(list.getVisibleItems().count)
      .eql(isMaterial() ? 4 : 6);

    await testScreenshot(page, 'List loading with part items invisible on loaded page.png', { element: '#container' });

    });

  test('Should initiate load next page if all items on next pages are invisible', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
      visible: data.id <= 4,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 2,
      },
      height: 100,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await list.scrollTo(100);

    await page.expect(list.getItems().count)
      .eql(isMaterial() ? 4 : 12)
      .expect(list.getVisibleItems().count)
      .eql(4);

    await testScreenshot(page, 'List loading with last items invisible.png', { element: '#container' });

    });

  test('Should not initiate load next page if not reach the bottom when pullRefreshEnabled is true', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 2,
      },
      pullRefreshEnabled: true,
      height: 130,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await list.scrollTo(1);

    await page.expect(list.getItems().count)
      .eql(4);

    });

  test('Should initiate load next page on select last item by keyboard', async ({ page }) => {

    const sampleData = generateData(12).map((data) => ({
      ...data,
    }));

    await createWidget(page, 'dxList', {
      dataSource: {
        store: sampleData,
        paginate: true,
        pageSize: 3,
      },
      pullRefreshEnabled: true,
      height: 160,
      width: 200,
      pageLoadMode: 'scrollBottom',
      valueExpr: 'id',
      displayExpr: 'id',
    });

    const list = page.locator('#container');

    await list.focus();

    await page.expect(list.getItems().count)
      .eql(6);

    await page.keyboard.press('ArrowDown')
      .pressKey('down')
      .pressKey('down')
      .pressKey('down')
      .pressKey('down');

    await page.expect(list.getItems().count)
      .eql(9);

    });
});
