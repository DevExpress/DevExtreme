import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel - One group on different pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_SELECTOR = '#container';

  const endsOnNextPageApiMock = RequestMock()
    .onRequestTo(/\/api\/data\?skip=0&take=5/)
    .respond(
      {
        data: [
          { key: 'KeyA', items: null, count: 6 },
          { key: 'KeyB', items: null, count: 3 },
        ],
        groupCount: 2,
        totalCount: 11,
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?skip=0&take=1/)
    .respond(
      {
        data: [
          { key: 'KeyA', items: null, count: 6 },
        ],
        groupCount: 2,
        totalCount: 11,
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?skip=0&take=3/)
    .respond(
      {
        data: [
          { key: 'KeyA', items: null, count: 6 },
          { key: 'KeyB', items: null, count: 3 },
        ],
        groupCount: 2,
        totalCount: 11,
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?take=4.*&filter=.*KeyA/)
    .respond(
      {
        data: [
          { id: 0, data: 'A' },
          { id: 1, data: 'B' },
          { id: 2, data: 'C' },
          { id: 3, data: 'D' },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?skip=4.*&filter=.*KeyA/)
    .respond(
      {
        data: [
          { id: 4, data: 'E' },
          { id: 5, data: 'F' },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    );

  test('Group panel restored from cache and ends at the next page', async ({ page }) => {
    await t.addRequestHooks(endsOnNextPageApiMock);
      await createWidget(page, 'dxDataGrid', () => ({
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
        columns: [
          'data',
          {
            dataField: 'key',
            groupIndex: 0,
          },
        ],
        groupPanel: {
          visible: true,
        },
        grouping: {
          autoExpandAll: false,
        },
        remoteOperations: {
          groupPaging: true,
        },
        pager: {
          visible: true,
          showInfo: true,
          showPageSizeSelector: true,
          allowedPageSizes: [5],
          displayMode: 'full',
        },
        paging: {
          pageSize: 5,
        },
      }));

      await (page.locator('.dx-group-row').click().nth(0).getCell(0).element);
    await testScreenshot(page, 'group-panel_loaded_first-page.png');

    await (page.locator('.dx-pager').click().locator('.dx-page').filter({hasText: '2'}).element);
    await testScreenshot(page, 'group-panel_loaded_second-page.png');

    await (page.locator('.dx-pager').click().locator('.dx-page').filter({hasText: '1'}).element);
    await testScreenshot(page, 'group-panel_restored_first-page.png');

    await (page.locator('.dx-pager').click().locator('.dx-page').filter({hasText: '2'}).element);
    await testScreenshot(page, 'group-panel_restored_second-page.png');
  });
    // TODO: .after() block removed
});
