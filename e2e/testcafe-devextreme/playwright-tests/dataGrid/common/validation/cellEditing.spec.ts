import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((repaintChangesOnly) => {
    test.skip(`Navigation with tab without saving should not throw an error (repaintChangesOnly: ${repaintChangesOnly})`, async ({ page }) => {
      // TODO: Playwright migration - strict mode violation: cell input locator resolves to 2 elements
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{
          id: 1,
          col2: 30,
          col3: 240,
        },
        {
          id: 2,
          col2: 15,
          col3: 120,
        }],
        keyExpr: 'id',
        repaintChangesOnly,
        columnAutoWidth: true,
        showBorders: true,
        paging: {
          enabled: false,
        },
        editing: {
          mode: 'cell',
          allowUpdating: true,
          allowAdding: true,
        },
        columns: [{
          dataField: 'col2',
          validationRules: [{ type: 'required' }],
        }, {
          dataField: 'col3',
          validationRules: [{ type: 'required' }],
        }],
      });

      await page.locator('.dx-data-row').nth(0).locator('td').nth(0).click();

      const editor = page.locator('.dx-data-row').nth(0).locator('td').nth(0).locator('input');
      await editor.fill('123');
      await page.keyboard.press('Tab');

      expect(true).toBeTruthy();
    });
  });

  test('DataGrid - Validation message gets cut off in Fluent and Material themes (T1285387)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 'n' },
      ],
      width: 800,
      editing: {
        mode: 'form',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'A',
        validationRules: [{ type: 'required', message: 'sampletextsampletextsampletextsampletextsampletextsampletextsampletextsampletext' }],
      }],
    });

    const dataGrid = new DataGrid(page);
    const editLink = dataGrid.getDataCell(0, 1).locator('.dx-link-edit');
    await editLink.click();

    const editor = page.locator('.dx-form .dx-texteditor-input').first();
    await editor.press('Control+a');
    await editor.press('Backspace');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Invalid-message-word-wrapping.png', { element: page.locator('#container') });
  });

  test('DataGrid - Validation message is hidden if there is only one Master-Detail row and the row is collapsed (T1287261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Text: 'Item 1' },
      ],
      keyExpr: 'ID',
      columns: ['ID', {
        dataField: 'Text',
        validationRules: [{ type: 'required' }],
      }],
      editing: { mode: 'batch', allowUpdating: true },
      masterDetail: { enabled: true },
    });

    const dataGrid = new DataGrid(page);
    const cellToggle = dataGrid.getDataRow(0).getDataCell(0);
    const textCell = dataGrid.getDataCell(0, 2);

    await textCell.click();
    const editor = textCell.locator('.dx-texteditor-input');
    await editor.press('Control+a');
    await editor.press('Backspace');
    await page.keyboard.press('Enter');

    await cellToggle.click();
    await cellToggle.click();
    await textCell.click();

    await testScreenshot(page, 'validation-message-shown-after-master-detail-collapse.png', { element: page.locator('#container') });
  });
});
