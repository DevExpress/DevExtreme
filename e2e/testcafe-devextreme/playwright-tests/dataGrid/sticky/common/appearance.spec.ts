import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns - appearance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: generic.light
  // visual: generic.light.compact
  // visual: material.blue
  // visual: material.blue.compact
  // visual: fluent.blue
  // visual: fluent.blue.compact
  [false, true].forEach(
    (showRowLines) => {
      // T1268664
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
          customizeColumns(columns) {
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

        await (page.locator('.dx-data-row').click().nth(2).locator('.dx-command-edit').nth(41).locator('.dx-link').nth(0));
        await (page.locator('.dx-data-row').click().nth(3).locator('.dx-command-edit').nth(0));
        await (page.locator('.dx-data-row').click().nth(4).locator('td').nth(4));

        await testScreenshot(page, `datagrid_selected_focused_edit_state_with_${showRowLinesState}.png`, { element: page.locator('#container') });
      });
});
