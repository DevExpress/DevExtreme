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
});
