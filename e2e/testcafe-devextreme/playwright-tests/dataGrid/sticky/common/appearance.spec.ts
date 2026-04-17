import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe.skip('FixedColumns - appearance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [false, true].forEach((showRowLines) => {
    const showRowLinesState = `showRowLines=${showRowLines ? 'true' : 'false'}`;

    test(`Row height for selected, focus and edit state should not differ from the default one if ${showRowLinesState}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(13, 40),
        keyExpr: 'field_0',
        columnFixing: {
          enabled: true,
        },
        groupPanel: {
          visible: true,
        },
        editing: {
          allowUpdating: true,
          mode: 'row',
        },
        showColumnHeaders: true,
        columnAutoWidth: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        focusedRowEnabled: true,
        showRowLines,
        selection: {
          mode: 'multiple',
        },
        customizeColumns(columns: any[]) {
          columns[5].fixed = true;
          columns[6].fixed = true;
          columns[11].fixed = true;
          columns[11].fixedPosition = 'right';
          columns[12].fixed = true;
          columns[12].fixedPosition = 'right';
        },
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      await testScreenshot(page, `datagrid_default_state_with_${showRowLinesState}.png`, { element: page.locator('#container') });

      await testScreenshot(page, `datagrid_selected_focused_edit_state_with_${showRowLinesState}.png`, { element: page.locator('#container') });
    });
  });
});
