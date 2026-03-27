import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accessibility - CardView pager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const pagedData = Array.from({ length: 20 }, (_, i) => ({ text: i.toString(), value: i }));

  test('pager accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: Array.from({ length: 50 }, (_, i) => ({ value: `value_${i}` })),
      columns: [{ dataField: 'value' }],
      paging: { pageSize: 10 },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('pager with full display mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: pagedData,
      columns: ['text', 'value'],
      paging: { pageSize: 2, pageIndex: 5 },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [2, 3, 4],
        showInfo: true,
        showNavigationButtons: true,
        displayMode: 'full',
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('pager with compact display mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: pagedData,
      columns: ['text', 'value'],
      paging: { pageSize: 2, pageIndex: 3 },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [2, 3, 4],
        showInfo: true,
        showNavigationButtons: true,
        displayMode: 'compact',
      },
    });
    await a11yCheck(page, {}, '#container');
  });
});
