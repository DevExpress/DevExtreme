import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
      keyExpr: 'id',
      selectedRowKeys: [1, 2],
      paging: {
        pageSize: 3,
      },
      selection: {
        mode: 'multiple',
      },
      onSelectionChanged(e) {
        e.component.refresh(true);
      },
    });

      const firstRowSelectionCheckBox = new CheckBox(page.locator('.dx-data-row').nth(0).locator('td').nth(0).locator('.dx-editor-cell'));
    const selectAllCheckBox = new CheckBox(
      page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-editor-cell'),
    );

    // act
    await (firstRowSelectionCheckBox.element).click();
    // assert
    expect(await selectAllCheckBox.option('value')).toBe(undefined);
    expect(await firstRowSelectionCheckBox.option('value')).toBe(false);
  });
});
