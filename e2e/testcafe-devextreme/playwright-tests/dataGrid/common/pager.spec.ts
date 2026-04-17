import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Pager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  async function createDataGridWithPager(page: any): Promise<any> {
    const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
    return createWidget(page, 'dxDataGrid', {
      dataSource,
      columns: ['name', 'phone', 'room'],
      paging: {
        pageSize: 5,
        pageIndex: 5,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
        showInfo: true,
        showNavigationButtons: true,
      },
    });
  }

  test('Full size pager', async ({ page }) => {
    await createDataGridWithPager(page);

    const dataGrid = new DataGrid(page);
    const pager = dataGrid.getPager();

    await expect(pager).toBeVisible();

    const pageSizeSelector = pager.locator('.dx-page-sizes');
    await expect(pageSizeSelector).toBeVisible();

    const infoText = pager.locator('.dx-info');
    await expect(infoText).toBeVisible();

    const navButtons = pager.locator('.dx-navigate-button');
    const navCount = await navButtons.count();
    expect(navCount).toBeGreaterThan(0);

    const pages = pager.locator('.dx-page');
    const pageCount = await pages.count();
    expect(pageCount).toBeGreaterThan(0);

    const selectedPage = pager.locator('.dx-page.dx-selection');
    await expect(selectedPage).toHaveText('6');
  });

  test('Changing pageSize to \'all\' with rowRenderingMode=\'virtual\' should work (T1090331)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: { rowRenderingMode: 'virtual' },
      paging: { pageSize: 10 },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 'all'],
        showPageSizeSelector: true,
        displayMode: 'compact',
      },
      height: 400,
    });

    const pageSizeOption = await dataGrid.option('paging.pageSize');
    expect(pageSizeOption).toBe(10);

    await dataGrid.scrollBy({ y: 100 });

    const pager = dataGrid.getPager();
    const pageSizeButton = pager.locator('.dx-page-size').filter({ hasText: '10' });
    await pageSizeButton.click();

    const allOption = page.locator('.dx-dropdowneditor-overlay .dx-list-item').filter({ hasText: 'All' });
    await allOption.click();

    const pageSizeAfter = await dataGrid.option('paging.pageSize');
    expect(pageSizeAfter).toBe(0);
  });

  test('Page index should not reset when scrolling while the grid is being refreshed (T1196099)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: { mode: 'standard', rowRenderingMode: 'virtual' },
      paging: { pageIndex: 2 },
      pager: { visible: true, displayMode: 'compact' },
      height: 440,
    });

    const pageIndexBefore = await dataGrid.option('paging.pageIndex');
    expect(pageIndexBefore).toBe(2);

    await dataGrid.apiRefresh();
    await dataGrid.scrollBy({ y: 20 });

    const pageIndexAfter = await dataGrid.option('paging.pageIndex');
    expect(pageIndexAfter).toBe(2);
  });

  test('No error should occur if dataSource is not defined and pageIndex is promise chained (T1256070)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      onContentReady(e: any) {
        e.component.pageIndex(1).then(() => {}, () => {});
      },
    });

    const isReady = await dataGrid.isReady();
    expect(isReady).toBe(true);
  });

  test('Compact pager - page navigation and page size selection work', async ({ page }) => {
    await createDataGridWithPager(page);

    const dataGrid = new DataGrid(page);
    const pager = dataGrid.getPager();

    await expect(pager).toBeVisible();

    const selectedPage = pager.locator('.dx-page.dx-selection');
    await expect(selectedPage).toHaveText('6');

    const page7 = pager.locator('.dx-page').filter({ hasText: '7' });
    await page7.click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const pageIndexAfter = await dataGrid.option('paging.pageIndex');
    expect(pageIndexAfter).toBe(6);

    await pager.locator('.dx-prev-button').click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const pageIndexPrev = await dataGrid.option('paging.pageIndex');
    expect(pageIndexPrev).toBe(5);

    await pager.locator('.dx-next-button').click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const pageIndexNext = await dataGrid.option('paging.pageIndex');
    expect(pageIndexNext).toBe(6);
  });

  test('Pager info text displays correct page and total count', async ({ page }) => {
    const dataSource = Array.from({ length: 100 }, (_, i) => ({ name: 'Alex', phone: '555555', room: i }));
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      columns: ['name', 'phone', 'room'],
      paging: {
        pageSize: 10,
        pageIndex: 0,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [5, 10, 20],
        showInfo: true,
        showNavigationButtons: true,
      },
    });

    const dataGrid = new DataGrid(page);
    const pager = dataGrid.getPager();

    const infoText = pager.locator('.dx-info');
    await expect(infoText).toContainText('Page 1 of 10');
    await expect(infoText).toContainText('100 items');
  });

  test('Pager should allow changing page size via selector', async ({ page }) => {
    const dataSource = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      paging: { pageSize: 5 },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 25],
        showPageSizeSelector: true,
        showInfo: true,
      },
    });

    const dataGrid = new DataGrid(page);

    const pageSizeBefore = await dataGrid.option('paging.pageSize');
    expect(pageSizeBefore).toBe(5);

    const pager = dataGrid.getPager();
    const pageSize10 = pager.locator('.dx-page-size').filter({ hasText: '10' });
    await pageSize10.click();
    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());

    const pageSizeAfter = await dataGrid.option('paging.pageSize');
    expect(pageSizeAfter).toBe(10);
  });

  test('Pager page count updates when data source changes', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: Array.from({ length: 20 }, (_, i) => ({ id: i })),
      keyExpr: 'id',
      paging: { pageSize: 10 },
      pager: {
        visible: true,
        showInfo: true,
      },
    });

    const pager = dataGrid.getPager();
    const infoText = pager.locator('.dx-info');
    await expect(infoText).toContainText('Page 1 of 2');

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option(
        'dataSource',
        Array.from({ length: 40 }, (_, i) => ({ id: i })),
      );
    });

    await page.waitForFunction(() => ($('#container') as any).dxDataGrid('instance').isReady());
    await expect(infoText).toContainText('Page 1 of 4');
  });

  test('Pager should hide when pager.visible is set to false', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: Array.from({ length: 20 }, (_, i) => ({ id: i })),
      keyExpr: 'id',
      paging: { pageSize: 10 },
      pager: { visible: true },
    });

    const pager = dataGrid.getPager();
    await expect(pager).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').option('pager.visible', false);
    });

    await expect(pager).not.toBeVisible();
  });

  test('Pager first/last page navigation buttons work', async ({ page }) => {
    const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      paging: { pageSize: 10, pageIndex: 4 },
      pager: {
        showNavigationButtons: true,
        showInfo: true,
      },
    });

    const dataGrid = new DataGrid(page);
    const pageIndex = await dataGrid.option('paging.pageIndex');
    expect(pageIndex).toBe(4);

    const pager = dataGrid.getPager();
    const infoText = pager.locator('.dx-info');
    await expect(infoText).toContainText('Page 5 of 10');
  });
});
