import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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
    .disablePageReloads`Keyboard Navigation - Group Column Reordering`
    .page(url(__dirname, '../../../container.html'));

  // Move grouped columns
  [true, false].forEach((rtlEnabled) => {

  test(`reorder group column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          rtlEnabled,
          dataSource: [{
            field1: 'test1',
            field2: 'test2',
            field3: 'test3',
            field4: 'test4',
          }],
          groupPanel: {
            visible: true,
          },
          columns: [
            {
              dataField: 'field1',
              groupIndex: 1,
            },
            'field2',
            'field3',
            {
              dataField: 'field4',
              groupIndex: 0,
            },
          ],
        });

          const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);
      const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

      await (firstGroupHeader.element).click();
      await t.pressKey(shortcut);

      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: page.locator('#container') });
    });
});
