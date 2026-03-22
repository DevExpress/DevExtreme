import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing - showEditorAlways cell in new row should be editable (T1323684)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const READONLY_CLASS = 'dx-datagrid-readonly';
  const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

  (['cell', 'batch'] as GridsEditMode[]).forEach((mode) => {

  test(`showEditorAlways editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        keyExpr: 'ID',
        dataSource: [
          { ID: 1, FirstName: 'John', LastName: 'Heart' },
          { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
        ],
        showBorders: true,
        editing: {
          mode,
          allowUpdating: false,
          allowAdding: true,
        },
        columns: [
          'LastName',
          { dataField: 'FirstName', showEditorAlways: true },
        ],
      });

          const addRowButton = page.locator('.dx-datagrid-header-panel').getAddRowButton();

      await (addRowButton).click();

      const newRow = page.locator('.dx-data-row').nth(0);
      expect(await newRow.isInserted).toBeTruthy();

      const cell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
      const editor = cell.locator('.dx-editor-cell');

      expect(await cell.element.hasClass(READONLY_CLASS));
      await t.notOk('showEditorAlways cell in new row should not have readonly class');
      expect(await cell.element.hasClass(CELL_FOCUS_DISABLED_CLASS));
      await t.notOk('showEditorAlways cell in new row should not have cell-focus-disabled class');

      await (editor.element).click();
      expect(await cell.isFocused);
      await t.ok('showEditorAlways cell should be focused after click');
      expect(await editor.element.focused);
      await t.ok('editor should be focused after click');
      await (editor.element).fill('test value');
      expect(await editor.element.value);
      await t.eql('test value');
    });
});
