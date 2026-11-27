import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import type { MockedRequest } from '../../../../helpers/apiMock';
import { mockApi } from '../../../../helpers/apiMock';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const endsOnNextPageApiMock: MockedRequest[] = [{
  url: /\/api\/data\?skip=0&take=5/,
  body: {
    data: [
      { key: 'KeyA', items: null, count: 6 },
      { key: 'KeyB', items: null, count: 3 },
    ],
    groupCount: 2,
    totalCount: 11,
  },
}, {
  url: /\/api\/data\?skip=0&take=1/,
  body: {
    data: [
      { key: 'KeyA', items: null, count: 6 },
    ],
    groupCount: 2,
    totalCount: 11,
  },
}, {
  url: /\/api\/data\?skip=0&take=3/,
  body: {
    data: [
      { key: 'KeyA', items: null, count: 6 },
      { key: 'KeyB', items: null, count: 3 },
    ],
    groupCount: 2,
    totalCount: 11,
  },
}, {
  url: /\/api\/data\?take=4.*&filter=.*KeyA/,
  body: {
    data: [
      { id: 0, data: 'A' },
      { id: 1, data: 'B' },
      { id: 2, data: 'C' },
      { id: 3, data: 'D' },
    ],
  },
}, {
  url: /\/api\/data\?skip=4.*&filter=.*KeyA/,
  body: {
    data: [
      { id: 4, data: 'E' },
      { id: 5, data: 'F' },
    ],
  },
}];

const endsOnPageApiMock: MockedRequest[] = [{
  url: /\/api\/data\?skip=0&take=5/,
  body: {
    data: [
      { key: 'KeyA', items: null, count: 4 },
      { key: 'KeyB', items: null, count: 2 },
    ],
    groupCount: 2,
    totalCount: 8,
  },
}, {
  url: /\/api\/data\?skip=0&take=1/,
  body: {
    data: [
      { key: 'KeyA', items: null, count: 4 },
    ],
    groupCount: 2,
    totalCount: 8,
  },
}, {
  url: /\/api\/data\?skip=1&take=5/,
  body: {
    data: [
      { key: 'KeyB', items: null, count: 2 },
    ],
    groupCount: 2,
    totalCount: 8,
  },
}, {
  url: /\/api\/data.*&filter=.*KeyA/,
  body: {
    data: [
      { id: 0, data: 'A' },
      { id: 1, data: 'B' },
      { id: 2, data: 'C' },
      { id: 3, data: 'D' },
    ],
  },
}];

const createDataGrid = (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', () => ({
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

test.describe('Grouping Panel - One group on different pages', () => {
  test.describe(() => {
    test.use({ browserSize: [800, 800] });

    test('Group panel restored from cache and ends at the next page', async ({ page }) => {
      await mockApi(page, endsOnNextPageApiMock);
      await createDataGrid(page);

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await dataGrid.getGroupRow(0).getCell(0).element.click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await testScreenshot(page, 'group-panel_loaded_first-page.png');

      await dataGrid.getPager().getNavPage('2').click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await testScreenshot(page, 'group-panel_loaded_second-page.png');

      await dataGrid.getPager().getNavPage('1').click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await testScreenshot(page, 'group-panel_restored_first-page.png');

      await dataGrid.getPager().getNavPage('2').click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await testScreenshot(page, 'group-panel_restored_second-page.png');
    });
  });

  test('Group panel restored from cache and ends at the page end', async ({ page }) => {
    await mockApi(page, endsOnPageApiMock);
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getGroupRow(0).getCell(0).element.click();
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await testScreenshot(page, 'group-panel_loaded_page-end.png', { element: dataGrid.element });

    await dataGrid.getPager().getNavPage('2').click();
    await dataGrid.getPager().getNavPage('1').click();
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await testScreenshot(page, 'group-panel_restored_page-end.png', { element: dataGrid.element });
  });
});
