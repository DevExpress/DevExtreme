import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  fixture
    .disablePageReloads`Keyboard Navigation - Column Reordering`
    .page(url(__dirname, '../../../container.html'));

  const triggerVisibilityChange = ClientFunction(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  test('The column should be grouped when pressing Ctrl + G if grouping.contextMenuEnabled is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        width: 550,
        columnWidth: 100,
        grouping: {
          contextMenuEnabled: false,
        },
        groupPanel: {
          visible: true,
        },
        dataSource: [{
          field1: 'test1',
          field2: 'test2',
          field3: 'test3',
          field4: 'test4',
        }],
      });

      const firstVisibleHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(0);

    await (firstVisibleHeader.element).click();
    await page.keyboard.press('ctrl+g');

    expect(await dataGrid.getGroupPanel().getHeadersCount());
    await t.eql(1);
    expect(await page.locator('.dx-header-row').nth(0).locator('td').nth(1).isFocused);
    await t.ok();
  });
});
