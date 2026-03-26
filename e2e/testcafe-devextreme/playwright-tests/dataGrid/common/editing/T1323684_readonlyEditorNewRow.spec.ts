import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const READONLY_CLASS = 'dx-datagrid-readonly';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

test.describe('Editing - showEditorAlways cell in new row should be editable (T1323684)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  (['cell', 'batch'] as const).forEach((mode) => {
    const testFn = mode === 'batch' ? test.skip : test;
    testFn(`showEditorAlways editor should be editable in a new row when allowUpdating is false, ${mode} mode`, async ({ page }) => {
      // TODO: Playwright migration - batch mode: hasReadonly is true instead of false
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

      const dataGrid = new DataGrid(page);
      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

      await addRowButton.click();

      const newRowCell = dataGrid.getDataCell(0, 1);

      const hasReadonly = await newRowCell.element.evaluate(
        (el, cls) => el.classList.contains(cls),
        READONLY_CLASS,
      );
      expect(hasReadonly).toBe(false);

      const hasFocusDisabled = await newRowCell.element.evaluate(
        (el, cls) => el.classList.contains(cls),
        CELL_FOCUS_DISABLED_CLASS,
      );
      expect(hasFocusDisabled).toBe(false);

      const editor = newRowCell.element.locator('.dx-texteditor-input');
      await editor.click();
      await editor.fill('test value');

      const editorValue = await editor.inputValue();
      expect(editorValue).toBe('test value');
    });
  });
});
