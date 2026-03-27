import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pager', () => {
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
});
