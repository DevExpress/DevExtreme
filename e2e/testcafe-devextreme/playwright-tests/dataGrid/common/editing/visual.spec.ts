import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Editing.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('The E0110 should not occur when editing a column with setCellValue in form mode (T1193894)', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Name: 'test',
      }],
      keyExpr: 'ID',
      editing: {
        mode: 'form',
        allowUpdating: true,
        editRowKey: 1,
      },
      columns: [{
        dataField: 'Name',
        setCellValue(rowData: any, value: any) {
          rowData.Name = value;
        },
      }],
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getFormItemEditor(0).fill('new');
    await dataGrid.getEditForm().saveButton.click();

    await testScreenshot(page, 'grid-form-editing-T1193894.png', { element: page.locator('#container') });
  });

  test('Popup EditForm screenshot', async ({ page }) => {
    const getData = (rowCount: number, colCount: number): Record<string, number>[] => {
      const items: Record<string, number>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const item: Record<string, number> = {};
        for (let j = 0; j < colCount; j++) item[`field_${j}`] = i + j;
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
      },
    });

    await page.locator('.dx-data-row').first().locator('.dx-link-edit').click();

    await expect(page.locator('.dx-datagrid-edit-popup')).toBeVisible();
    await testScreenshot(page, 'popup-edit-form.png', { element: page.locator('#container') });
  });

  test('Popup EditForm screenshot when editRowKey is initially specified', async ({ page }) => {
    const getData = (rowCount: number, colCount: number): Record<string, number>[] => {
      const items: Record<string, number>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const item: Record<string, number> = {};
        for (let j = 0; j < colCount; j++) item[`field_${j}`] = i + j;
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2).map((item, index) => ({ ...item, id: index })),
      keyExpr: 'id',
      height: 400,
      showBorders: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
        editRowKey: 0,
      },
    });

    await expect(page.locator('.dx-datagrid-edit-popup')).toBeVisible();
    await testScreenshot(page, 'popup-edit-form-with-initial-editrowkey.png', { element: page.locator('#container') });
  });

  test('DataGrid - A new row is added above the existing row if the data source is empty or contains only one record and newRowPosition is set to "pageBottom" (T1287287)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'ID',
      editing: {
        mode: 'batch',
        allowAdding: true,
        newRowPosition: 'pageBottom',
      },
      columns: [
        {
          dataField: 'A',
        },
      ],
    });

    const addRowButton = page.locator('.dx-datagrid-addrow-button');
    await addRowButton.click();
    await addRowButton.click();

    await expect(page.locator('.dx-data-row.dx-row-inserted').nth(1)).toBeVisible();

    await testScreenshot(page, 'newRowPosition-pageBottom-add-row-to-bottom.png', { element: page.locator('#container') });
  });

  test('DataGrid - ColorBox in DataGrid causes input value to appear behind color preview (T1280023)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { Color: 'red' },
      ],
      showBorders: true,
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      onEditorPreparing(e: any) {
        if (e.dataField === 'Color') {
          e.editorName = 'dxColorBox';
          e.editorOptions.readOnly = false;
        }
      },
    });

    await page.locator('.dx-data-row').first().locator('td').first().click();

    await testScreenshot(page, 'grid-form-editing-with-color-box.png', { element: page.locator('#container') });
  });

  test('An exception should not throw after pressing enter on the save button and onSaving\'s promise is resolved (T1201724)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).deferred = $.Deferred();
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, field1: 'value1', field2: 'value2', field3: 'value3' },
        { id: 2, field1: 'value4', field2: 'value5', field3: 'value6' },
      ],
      keyExpr: 'id',
      showBorders: true,
      columns: ['field1', 'field2', 'field3'],
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      onSaving(e: any) {
        e.promise = (window as any).deferred;
      },
    });

    const dataGrid = new DataGrid(page);
    const dataRow = dataGrid.getDataRow(0);

    const editButton = dataRow.element.locator('.dx-link-edit');
    await editButton.click();

    await expect(dataRow.element).toHaveClass(/dx-edit-row/);

    const editor = dataGrid.getDataCell(0, 0).locator('.dx-texteditor-input');
    await editor.fill('new_value');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.evaluate(() => (window as any).deferred.resolve());

    await expect(dataRow.element).not.toHaveClass(/dx-edit-row/);

    await testScreenshot(page, 'grid-editing-with-onSaving-T1201724.png', { element: page.locator('#container') });
  });

  test('DataGrid cell with checkbox should have outline on focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 150,
      width: 200,
      dataSource: [{
        Id: 0,
        Checkbox: true,
      }],
      keyExpr: 'Id',
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      columns: ['Id', 'Checkbox'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getDataCell(0, 0).click();
    await expect(dataGrid.getDataCell(0, 0)).toHaveClass(/dx-focused/);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'grid-checkbox-outline.png', { element: page.locator('#container') });
  });

  [true, false].forEach((useIcons) => {
    test(`The disabled state should be correct for a custom button when given as a SVG image (useIcons=${useIcons})`, async ({ page }) => {
      const encodedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+DQo8L3N2Zz4NCg==';

      await createWidget(page, 'dxDataGrid', {
        width: 600,
        dataSource: [{ Id: 0, name: 'test' }],
        keyExpr: 'Id',
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
          useIcons,
        },
        columns: ['Id', 'name', {
          type: 'buttons',
          width: 200,
          buttons: [
            { name: 'delete', disabled: false },
            { name: 'delete', disabled: true },
            { icon: encodedIcon, disabled: false },
            { icon: encodedIcon, disabled: true },
          ],
        }],
      });

      await testScreenshot(page, `T1179114-grid-edit-custom-button when-useicons-is-${useIcons}.png`, { element: page.locator('#container') });
    });
  });

  test('DataGrid adaptive text should have correct paddings (T1062084)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [{
        OrderNumber: 35703,
        SaleAmount: 11800,
        OrderDate: '2014/04/10',
        Employee: 'Harv Mudd',
      }],
      keyExpr: 'OrderNumber',
      columnHidingEnabled: true,
      editing: {
        allowUpdating: true,
        mode: 'batch',
      },
      columns: [{
        dataField: 'OrderNumber',
        caption: 'Invoice Number',
        width: 300,
      }, {
        dataField: 'Employee',
      }, {
        dataField: 'OrderDate',
        dataType: 'date',
      }, {
        dataField: 'SaleAmount',
        validationRules: [{ type: 'range', max: 100000 }],
        format: 'currency',
      }],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getAdaptiveButton(0).click();

    await dataGrid.getFormItemElement(0).click();
    await dataGrid.getFormItemEditor(0).fill('1');
    await page.keyboard.press('Enter');

    await dataGrid.getFormItemElement(2).click();
    await dataGrid.getFormItemEditor(2).fill('0');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'grid-adaptive-item-text.png', { element: page.locator('#container') });
  });

  test('DataGrid checkboxes should have correct outline in adaptive row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [{
        OrderNumber: 35703,
        Employee: 'Sam',
        OrderDate: '2014/04/10',
        Checkbox: true,
      }],
      keyExpr: 'OrderNumber',
      columnHidingEnabled: true,
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      columns: [{
        dataField: 'OrderNumber',
        caption: 'Invoice Number',
        width: 300,
      }, {
        dataField: 'Employee',
      }, {
        dataField: 'OrderDate',
        dataType: 'date',
      }, {
        dataField: 'Checkbox',
        dataType: 'boolean',
      }],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getAdaptiveButton(0).click();
    await dataGrid.getFormItemElement(2).click();

    await testScreenshot(page, 'grid-adaptive-checkbox.png', { element: page.locator('#container') });
  });

  test('DataGrid inside editing popup should have synchronized columns (T1059401)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1 }],
      keyExpr: 'ID',
      editing: {
        allowUpdating: true,
        mode: 'popup',
        form: {
          colCount: 1,
          items: [{
            template() {
              return ($('<div>') as any).dxDataGrid({
                showColumnLines: true,
                dataSource: [{
                  ID: 1,
                  FirstName: 'John',
                  LastName: 'Heart',
                }],
                height: 200,
                editing: {
                  allowUpdating: true,
                  allowDeleting: true,
                },
              });
            },
          }],
        },
      },
    });

    const dataGrid = new DataGrid(page);
    await page.mouse.click(10, 10);

    await dataGrid.getDataRow(0).element.locator('.dx-link-edit').click();

    const popupOverlay = page.locator('.dx-datagrid-edit-popup .dx-overlay-content');
    await expect(popupOverlay).toBeVisible();

    const popupDataGridRow = popupOverlay.locator('.dx-data-row').first();
    await expect(popupDataGridRow).toBeVisible();

    await testScreenshot(page, 'grid-popup-editing-grid.png', { element: popupOverlay });
  });
});
