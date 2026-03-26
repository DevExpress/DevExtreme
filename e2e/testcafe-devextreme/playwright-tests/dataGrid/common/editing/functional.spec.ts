import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Focused cell should be switched to the editing mode after onSaving\'s promise is resolved (T1190566)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).deferred = $.Deferred();
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, field1: 'value1' },
        { id: 2, field1: 'value2' },
        { id: 3, field1: 'value3' },
        { id: 4, field1: 'value4' },
      ],
      keyExpr: 'id',
      showBorders: true,
      columns: ['field1'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onSaving(e) {
        e.promise = (window as any).deferred;
      },
    });

    const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    await firstCell.click();

    const editor = page.locator('.dx-data-row').nth(0).locator('.dx-texteditor-input').first();
    await editor.fill('new_value');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.evaluate(() => (window as any).deferred.resolve());

    const thirdCell = page.locator('.dx-data-row').nth(2).locator('td').nth(0);
    await expect(thirdCell.locator('.dx-texteditor')).toBeVisible();
  });

  test('DataGrid - The "Cannot read properties of undefined error" occurs when using Tab while saving a promise', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).deferred = $.Deferred();
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, field1: 'value1' },
        { id: 2, field1: 'value2' },
        { id: 3, field1: 'value3' },
        { id: 4, field1: 'value4' },
      ],
      keyExpr: 'id',
      showBorders: true,
      columns: ['field1'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onSaving(e) {
        e.promise = (window as any).deferred;
      },
    });

    const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    await firstCell.click();

    const editor = page.locator('.dx-data-row').nth(0).locator('.dx-texteditor-input').first();
    await editor.fill('new_value');

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.evaluate(() => (window as any).deferred.resolve());

    const thirdCell = page.locator('.dx-data-row').nth(2).locator('td').nth(0);
    await expect(thirdCell).toHaveClass(/dx-focused/);
  });

  test('Click should work if a column button set using svg icon (T863635)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ value: 1 }],
      columns: [{
        type: 'buttons',
        width: 110,
        buttons: [
          {
            hint: 'svg icon',
            icon: '<svg id="svg-icon"><circle cx="15" cy="15" r="14" /> </svg>',
            onClick: (): void => {
              const global = window as Window & typeof globalThis & { onSvgClickCounter: number };
              if (!global.onSvgClickCounter) {
                global.onSvgClickCounter = 0;
              }
              global.onSvgClickCounter += 1;
            },
          }],
      }],
    }));

    const svgIcon = page.locator('#svg-icon').first();
    await svgIcon.click();

    const clickCount = await page.evaluate(() => (window as any).onSvgClickCounter);
    expect(clickCount).toBe(1);
  });

  test('Value change on dataGrid row should be fired after clicking on editor (T823431)', async ({ page }) => {
    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid({
        dataSource: [{ name: 'old_value', value: 1 }],
        editing: {
          mode: 'batch',
          allowUpdating: true,
          selectTextOnEditStart: true,
          startEditAction: 'click',
        },
      });
      ($('#otherContainer') as any).dxSelectBox({});
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    await page.locator('.dx-data-row').nth(0).locator('td').nth(0).click();
    const editor = page.locator('.dx-data-row').nth(0).locator('.dx-texteditor-input').first();
    await editor.fill('new_value');

    await page.locator('#otherContainer .dx-dropdowneditor-button').click();

    const cellText = await page.locator('.dx-data-row').nth(0).locator('td').nth(0).textContent();
    expect(cellText).toBe('new_value');
  });

  test('The "Cannot read property "brokenRules" of undefined" error occurs T978286', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        LastName: 'Heart',
        Active: false,
      }, {
        ID: 1,
        LastName: 'Broken',
        Active: false,
      }],
      keyExpr: 'ID',
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
    });

    const dataGrid = new DataGrid(page);
    const lastName0 = dataGrid.getDataCell(0, 1);
    const active1 = dataGrid.getDataCell(1, 2);

    await lastName0.click();
    const editor = lastName0.locator('.dx-texteditor-input');
    await editor.fill('1');
    await active1.click();
    await lastName0.click();

    expect(true).toBeTruthy();
  });

  ['Cell', 'Batch'].forEach((editMode) => {
    test(`${editMode} - Cell value should not be reset when a checkbox in a neigboring cell is clicked (T1023809)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, field1: 'test', field2: true },
        ],
        keyExpr: 'id',
        columns: ['field1', 'field2'],
        editing: {
          mode: editMode.toLowerCase() as any,
          allowUpdating: true,
        },
      });

      const dataGrid = new DataGrid(page);
      const firstCell = dataGrid.getDataCell(0, 0);
      const secondCell = dataGrid.getDataCell(0, 1);

      await firstCell.click();
      await expect(firstCell).toHaveClass(/dx-editor-cell/);

      const editor = firstCell.locator('.dx-texteditor-input');
      await editor.fill('123');

      await secondCell.locator('.dx-checkbox').click();

      const cellValue = await dataGrid.apiGetCellValue(0, 0);
      expect(cellValue).toBe('123');
    });
  });

  test('The editCellTemplate template should not be called after clicking on a cell in another row and column', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).editCellTemplateCallArgs = [];
    });

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Column1: 'a', Column2: 'b', Column3: 'c' },
        { ID: 2, Column1: 'd', Column2: 'e', Column3: 'f' },
        { ID: 3, Column1: 'g', Column2: 'h', Column3: 'i' },
      ],
      keyExpr: 'ID',
      columns: [{
        dataField: 'Column1',
        editCellTemplate(_: any, cellInfo: any) {
          (window as any).editCellTemplateCallArgs.push(cellInfo.column.dataField);
          return ($('<div>') as any).dxTextBox({
            value: cellInfo.value,
            onValueChanged: (args: any) => cellInfo.setValue(args.value),
          });
        },
      }, 'Column2', 'Column3'],
      showBorders: true,
      editing: { mode: 'batch', allowUpdating: true },
    }));

    const dataGrid = new DataGrid(page);
    const firstCellOfFirstRow = dataGrid.getDataCell(0, 0);
    const secondCellOfSecondRow = dataGrid.getDataCell(1, 1);

    await firstCellOfFirstRow.click();
    await expect(firstCellOfFirstRow).toHaveClass(/dx-editor-cell/);

    const callArgs1: string[] = await page.evaluate(() => (window as any).editCellTemplateCallArgs);
    expect(callArgs1.length).toBe(1);
    expect(callArgs1[0]).toBe('Column1');

    await secondCellOfSecondRow.click();
    await expect(secondCellOfSecondRow).toHaveClass(/dx-editor-cell/);

    const callArgs2: string[] = await page.evaluate(() => (window as any).editCellTemplateCallArgs);
    expect(callArgs2.length).toBe(1);
    expect(callArgs2[0]).toBe('Column1');
  });

  test('The onEditorPreparing event should be called once after clicking on a cell in another row and column', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onEditorPreparingCallArgs = [];
    });

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Column1: 'a', Column2: 'b', Column3: 'c' },
        { ID: 2, Column1: 'd', Column2: 'e', Column3: 'f' },
        { ID: 3, Column1: 'g', Column2: 'h', Column3: 'i' },
      ],
      keyExpr: 'ID',
      columns: ['Column1', 'Column2', 'Column3'],
      showBorders: true,
      editing: { mode: 'batch', allowUpdating: true },
      onEditorPreparing(e: any) {
        (window as any).onEditorPreparingCallArgs.push({
          dataField: e.dataField,
          rowIndex: e.row?.rowIndex,
        });
      },
    }));

    const dataGrid = new DataGrid(page);
    const firstCellOfFirstRow = dataGrid.getDataCell(0, 0);
    const secondCellOfSecondRow = dataGrid.getDataCell(1, 1);

    await firstCellOfFirstRow.click();
    await expect(firstCellOfFirstRow).toHaveClass(/dx-editor-cell/);

    const args1: { dataField: string; rowIndex: number }[] = await page.evaluate(() => (window as any).onEditorPreparingCallArgs);
    expect(args1.length).toBe(1);
    expect(args1[0]).toEqual({ dataField: 'Column1', rowIndex: 0 });

    await secondCellOfSecondRow.click();
    await expect(secondCellOfSecondRow).toHaveClass(/dx-editor-cell/);

    const args2: { dataField: string; rowIndex: number }[] = await page.evaluate(() => (window as any).onEditorPreparingCallArgs);
    expect(args2.length).toBe(2);
    expect(args2[1]).toEqual({ dataField: 'Column2', rowIndex: 1 });
  });

  test('Focus behavior should be correct when editing cells (T1194439)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(10)].map((_, i) => ({
        ID: i + 1,
        CompanyName: `company name ${i + 1}`,
        City: `city ${i + 1}`,
      })),
      keyExpr: 'ID',
      columns: [{
        dataField: 'CompanyName',
        showEditorAlways: true,
      }, {
        caption: 'City',
        calculateCellValue(rowData: any) { return rowData.City; },
        allowEditing: false,
      }],
      showBorders: true,
      editing: {
        allowUpdating: true,
        mode: 'batch',
      },
    });

    const dataGrid = new DataGrid(page);

    for (let i = 0; i < 3; i++) {
      const cell = dataGrid.getDataCell(i, 0);
      await cell.click();
      await expect(cell).toHaveClass(/dx-focused/);

      const editor = cell.locator('.dx-texteditor-input');
      await editor.fill(`new_value ${i}`);
    }

    expect(true).toBeTruthy();
  });

  test('Tab key on editor should focus next cell if editing mode is cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ name: 'AaAaA', value: 1 }, { name: 'aAaAa', value: 2 }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{ dataField: 'name', allowEditing: false }, { dataField: 'value', showEditorAlways: true }],
    });

    const dataGrid = new DataGrid(page);
    const cell01 = dataGrid.getDataCell(0, 1);
    await cell01.click();

    const editor = cell01.locator('.dx-texteditor-input');
    await editor.fill('1');
    await page.keyboard.press('Tab');

    const cell11 = dataGrid.getDataCell(1, 1);
    await expect(cell11).toHaveClass(/dx-focused/);
  });

  test('Component sends unexpected filtering request after inserting a new row if focusedRowEnabled is true and key set in data source (T1181477)', async ({ page }) => {
    await page.evaluate(() => {
      const dataSourceCore = [
        { ID: 1, Name: 'Name 1' },
        { ID: 2, Name: 'Name 2' },
        { ID: 3, Name: 'Name 3' },
      ];

      const sampleAPI = {
        load() {
          const data = dataSourceCore;
          return new Promise((resolve) => { setTimeout(() => { resolve(data); }, 100); });
        },
        totalCount() {
          return new Promise((resolve) => { setTimeout(() => { resolve(dataSourceCore.length); }, 100); });
        },
        insert(values: any) {
          return new Promise((resolve) => {
            setTimeout(() => {
              const newID = dataSourceCore.length + 1;
              values.ID = newID;
              dataSourceCore.push(values);
              resolve(newID);
            }, 100);
          });
        },
      };

      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o: any) {
          if (o.filter) {
            $('#otherContainer').append('Fail');
          }
          return Promise.all([sampleAPI.load(), sampleAPI.totalCount()]).then((res: any) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
        insert(values: any) { return sampleAPI.insert(values); },
      });

      ($('#container') as any).dxDataGrid({
        dataSource: store,
        showBorders: true,
        focusedRowEnabled: true,
        autoNavigateToFocusedRow: true,
        editing: { allowAdding: true },
        remoteOperations: true,
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');
    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const addRowButton = page.locator('.dx-datagrid-addrow-button');
    await addRowButton.click();

    const saveLink = page.locator('.dx-data-row').nth(0).locator('.dx-link-save');
    await saveLink.click();

    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const otherContainerText = await page.locator('#otherContainer').textContent();
    expect(otherContainerText).toBe('');
  });

  test('Row - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, field: 'field' }],
      keyExpr: 'id',
      masterDetail: {
        enabled: true,
        template() {
          return ($('<div id="detailContainer">') as any).dxDataGrid({
            dataSource: [],
            keyExpr: 'id',
            focusedRowEnabled: true,
            columns: [
              { dataField: 'id', validationRules: [{ type: 'required' }] },
              { dataField: 'field', validationRules: [{ type: 'required' }] },
            ],
            editing: { mode: 'row', allowAdding: true, allowUpdating: true },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).getDataCell(0).click();

    await page.waitForSelector('#detailContainer');

    const detailAddButton = page.locator('#detailContainer .dx-datagrid-addrow-button');
    await detailAddButton.click();

    const saveBtn = page.locator('#detailContainer .dx-data-row').nth(0).locator('.dx-link-save');
    await saveBtn.click();

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(0).click();

    const invalidMessages = page.locator('.dx-invalid-message');
    await expect(invalidMessages).toHaveCount(1);

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(1).click();
    await expect(invalidMessages).toHaveCount(1);
  });
});
