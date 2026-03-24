import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
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

  test.skip('Full size pager', async ({ page }) => {
    // TODO: requires TestCafe t.ok/t.eql assertion conversion
  });
});
