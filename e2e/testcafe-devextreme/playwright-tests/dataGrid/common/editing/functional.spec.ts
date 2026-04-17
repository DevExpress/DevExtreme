import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Editing.Functional', () => {
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

  test('Rollback changes on a click on a revert button  when startEditAction is dblclick', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ name: 'test', test: false }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      columns: ['name',
        {
          dataField: 'test',
          dataType: 'boolean',
          showEditorAlways: false,
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    const dataRow = dataGrid.getDataRow(0);
    const cell1 = dataRow.getDataCell(2);

    await cell1.element.dblclick();
    await expect(cell1.element).toHaveClass(/dx-editor-cell/);

    const checkbox = cell1.element.locator('.dx-checkbox');
    await checkbox.click();

    const revertButton = dataGrid.getRevertButton();
    await expect(revertButton).toBeVisible();

    await revertButton.click();
    await expect(revertButton).toBeHidden();
    await expect(cell1.element).not.toHaveClass(/dx-editor-cell/);

    const cellValue = await dataGrid.apiGetCellValue(0, 1);
    expect(cellValue).toBeFalsy();
  });

  test('Cell - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
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
            editing: { mode: 'cell', allowAdding: true, allowUpdating: true },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).getDataCell(0).click();
    await page.waitForSelector('#detailContainer');

    const detailAddButton = page.locator('#detailContainer .dx-datagrid-addrow-button');
    await detailAddButton.click();

    const detailHeaderPanel = page.locator('#detailContainer .dx-datagrid-header-panel');
    await detailHeaderPanel.click();

    const invalidMessages = page.locator('.dx-invalid-message');
    await expect(invalidMessages).toHaveCount(1);

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(1).click();
    await expect(invalidMessages).toHaveCount(1);

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(0).click();
    await expect(invalidMessages).toHaveCount(1);
  });

  test('Batch - Redundant validation messages should not be rendered in a detail grid when focused row is enabled (T950174)', async ({ page }) => {
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
            editing: { mode: 'batch', allowAdding: true, allowUpdating: true },
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).getDataCell(0).click();
    await page.waitForSelector('#detailContainer');

    const detailAddButton = page.locator('#detailContainer .dx-datagrid-addrow-button');
    await detailAddButton.click();

    const detailSaveButton = page.locator('#detailContainer .dx-datagrid-save-button');
    await detailSaveButton.click();

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(0).click();

    const invalidMessages = page.locator('.dx-invalid-message');
    await expect(invalidMessages).toHaveCount(1);

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(1).click();
    await expect(invalidMessages).toHaveCount(1);

    await page.locator('#detailContainer .dx-data-row').nth(0).locator('td').nth(0).click();
    await expect(invalidMessages).toHaveCount(1);
  });

  test('Component sends unexpected filtering request after inserting a new row if focusedRowEnabled is true and key set on event (T1181477)', async ({ page }) => {
    await page.evaluate(() => {
      const dataSourceCore = [
        { ID: 1, Name: 'Name 1' },
        { ID: 2, Name: 'Name 2' },
        { ID: 3, Name: 'Name 3' },
      ];

      const sampleAPI = new (window as any).DevExpress.data.ArrayStore(dataSourceCore);

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
        insert(values: any) {
          return sampleAPI.insert(values);
        },
      });

      ($('#container') as any).dxDataGrid({
        dataSource: store,
        showBorders: true,
        focusedRowEnabled: true,
        autoNavigateToFocusedRow: true,
        editing: { allowAdding: true },
        onInitNewRow(e: any) {
          e.promise = new Promise((resolve) => {
            const newId = dataSourceCore.length + 1;
            e.data.ID = newId;
            resolve(undefined as any);
          });
        },
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

  test('Adding rows to a second page should work correctly when initial row values are specified in the onInitNewRow method (T1274123)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).myData = new Array(30).fill(null).map((_: null, index: number) => ({ id: index + 1, text: `item ${index + 1}` }));
      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'id',
        data: (window as any).myData,
      });
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        key: 'id',
        load(loadOptions: any) {
          return (window as any).myStore.load(loadOptions);
        },
        totalCount() {
          return (window as any).myStore.totalCount();
        },
        insert(values: any) {
          if (values.id === 0) {
            values.id = (window as any).myData.length + 1;
          }
          return (window as any).myStore.insert(values);
        },
      } as any,
      columns: ['id', 'text'],
      showBorders: true,
      editing: {
        mode: 'popup',
        allowAdding: true,
      },
      onInitNewRow(e: any) {
        e.data.id = 0;
        e.data.text = 'test';
      },
      height: 300,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.apiPageIndex(1);
    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const visibleRows1 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows1.length).toBe(10);

    const cell20 = await dataGrid.getDataCell(20, 0).element.textContent();
    expect(cell20).toBe('21');

    const addAndSave = async () => {
      await dataGrid.apiAddRow();
      const popup = dataGrid.getPopupEditForm();
      await expect(popup.element).toBeVisible();
      await dataGrid.apiSaveEditData();
      await expect(popup.element).toBeHidden();
    };

    await addAndSave();
    await addAndSave();

    const visibleRows2 = await dataGrid.apiGetVisibleRows();
    expect(visibleRows2.length).toBe(12);
    expect(visibleRows2[10].key).toBe(31);
    expect(visibleRows2[11].key).toBe(32);
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

  test('Cells should be focused correctly on click when cell editing mode is used with enabled showEditorAlways (T1037019)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
        data: [
          { ID: 1, Name: 'Name 1' },
          { ID: 2, Name: 'Name 2' },
          { ID: 3, Name: 'Name 3' },
        ],
      });
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        key: 'ID',
        load(loadOptions: any) {
          return new Promise((resolve) => {
            setTimeout(() => {
              (window as any).myStore.load(loadOptions).done((data: any) => {
                resolve(data);
              });
            }, 100);
          });
        },
        update(key: any, values: any) {
          return new Promise((resolve) => {
            setTimeout(() => {
              (window as any).myStore.update(key, values).done(() => {
                resolve(key);
              });
            }, 100);
          });
        },
        totalCount(loadOptions: any) {
          return (window as any).myStore.totalCount(loadOptions);
        },
      } as any,
      keyExpr: 'ID',
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'Name',
        showEditorAlways: true,
      }],
    });

    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const dataGrid = new DataGrid(page);

    const cell00 = dataGrid.getDataCell(0, 0);
    await cell00.element.locator('.dx-texteditor-input').click();
    await expect(cell00.element).toHaveClass(/dx-focused/);

    await cell00.element.locator('.dx-texteditor-input').fill('Name 11');
    await dataGrid.getDataCell(1, 0).element.locator('.dx-texteditor-input').click();
    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const storedName1 = await page.evaluate(() => (window as any).myStore.byKey(1).then((item: any) => item.Name));
    expect(storedName1).toBe('Name 11');

    const cell10 = dataGrid.getDataCell(1, 0);
    await expect(cell10.element).toHaveClass(/dx-focused/);

    await cell10.element.locator('.dx-texteditor-input').fill('Name 22');
    await dataGrid.getDataCell(2, 0).element.locator('.dx-texteditor-input').click();
    await page.waitForFunction(() => !$('.dx-loadpanel-wrapper').is(':visible'));

    const storedName2 = await page.evaluate(() => (window as any).myStore.byKey(2).then((item: any) => item.Name));
    expect(storedName2).toBe('Name 22');

    const cell20 = dataGrid.getDataCell(2, 0);
    await expect(cell20.element).toHaveClass(/dx-focused/);
  });

  test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async ({ page }) => {
    const getGridConfig = (config: any) => ({
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      ...config,
    });

    await createWidget(page, 'dxDataGrid', getGridConfig({
      editing: { mode: 'row', allowUpdating: true },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          validationCallback(params: any) { return params.data.age >= 10; },
        }],
      }],
    }));

    const dataGrid = new DataGrid(page);
    const editButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-edit');
    await editButton.click();

    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    const editor0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0).locator('.dx-texteditor-input');
    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    const saveButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-save');
    await saveButton.click();

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('10');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    await saveButton.click();
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    const row = page.locator('.dx-data-row[aria-rowindex="1"]');
    await expect(row).toHaveClass(/dx-edit-row/);
  });

  test('Validation(Row) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async ({ page }) => {
    const getGridConfig = (config: any) => ({
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      ...config,
    });

    await createWidget(page, 'dxDataGrid', getGridConfig({
      editing: { mode: 'row', allowUpdating: true },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback(params: any) { return params.data.age >= 10; },
        }],
      }],
    }));

    const dataGrid = new DataGrid(page);
    const editButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-edit');
    await editButton.click();

    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    const editor0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0).locator('.dx-texteditor-input');
    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    const saveButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-save');
    await saveButton.click();

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('10');
    await page.keyboard.press('Enter');

    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    const row = page.locator('.dx-data-row[aria-rowindex="1"]');
    await expect(row).not.toHaveClass(/dx-edit-row/);
  });

  test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=false) (T880238)', async ({ page }) => {
    const getGridConfig = (config: any) => ({
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      ...config,
    });

    await createWidget(page, 'dxDataGrid', getGridConfig({
      editing: { mode: 'cell', allowUpdating: true },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          validationCallback(params: any) { return params.data.age >= 10; },
        }],
      }],
    }));

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);

    await cell0.click();
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    const editor0 = cell0.locator('.dx-texteditor-input');
    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);

    await editor0.selectText();
    await editor0.fill('10');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);
  });

  test('Validation(Cell) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=true) (T880238)', async ({ page }) => {
    const getGridConfig = (config: any) => ({
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      ...config,
    });

    await createWidget(page, 'dxDataGrid', getGridConfig({
      editing: { mode: 'cell', allowUpdating: true },
      columns: ['age', {
        dataField: 'name',
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback(params: any) { return params.data.age >= 10; },
        }],
      }],
    }));

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);

    await cell0.click();
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    const editor0 = cell0.locator('.dx-texteditor-input');
    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);

    await editor0.selectText();
    await editor0.fill('10');
    await page.keyboard.press('Enter');

    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).not.toHaveClass(/dx-editor-cell/);
  });

  ['false', 'true'].forEach((reevaluate) => {
    test(`Validation(Batch) - Unmodified data cell should be marked as invalid when a neighboring cell is modified (reevaluate=${reevaluate}) (T880238)`, async ({ page }) => {
      const getGridConfig = (config: any) => ({
        errorRowEnabled: true,
        dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
        keyExpr: 'id',
        legacyRendering: false,
        ...config,
      });

      const reevaluateValue = reevaluate === 'true';

      await createWidget(page, 'dxDataGrid', getGridConfig({
        editing: { mode: 'batch', allowUpdating: true },
        columns: ['age', {
          dataField: 'name',
          validationRules: [{
            type: 'custom',
            reevaluate: reevaluateValue,
            validationCallback(params: any) { return params.data.age >= 10; },
          }],
        }],
      }));

      const dataGrid = new DataGrid(page);
      const saveButton = dataGrid.getHeaderPanel().getSaveButton();

      const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
      const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);

      await cell0.click();
      await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

      const editor0 = cell0.locator('.dx-texteditor-input');
      await editor0.selectText();
      await editor0.fill('3');
      await page.keyboard.press('Enter');

      await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
      await expect(cell0).toHaveClass(/dx-cell-modified/);

      await saveButton.click();

      await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
      await expect(cell0).toHaveClass(/dx-cell-modified/);

      await cell0.click();
      await editor0.selectText();
      await editor0.fill('10');
      await page.keyboard.press('Enter');

      await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
      await expect(cell0).toHaveClass(/dx-cell-modified/);

      await saveButton.click();

      await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
      await expect(cell0).not.toHaveClass(/dx-cell-modified/);
      await expect(cell0).not.toHaveClass(/dx-editor-cell/);
    });
  });

  test('Validation(Batch) - Unmodified data cell with enabled showEditorAlways should be marked as invalid when a neighboring cell is modified (T878218)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [
        { id: 1, name: '', lastName: '' },
        { id: 2, name: '', lastName: '' },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: ['name', {
        dataField: 'lastName',
        showEditorAlways: true,
        validationRules: [{
          type: 'custom',
          reevaluate: true,
          validationCallback: (params: any): boolean => params.data.name.length <= 0,
        }],
      }],
    });

    const cell10 = page.locator('.dx-data-row[aria-rowindex="2"] td').nth(0);
    const cell11 = page.locator('.dx-data-row[aria-rowindex="2"] td').nth(1);
    const cell00 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell01 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor10 = cell10.locator('.dx-texteditor-input');

    await cell10.click();
    await expect(cell11).not.toHaveClass(/dx-datagrid-invalid/);

    await editor10.fill('test');
    await page.keyboard.press('Enter');

    await expect(cell11).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell10).toHaveClass(/dx-cell-modified/);

    await cell00.click();
    await expect(cell11).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell10).toHaveClass(/dx-cell-modified/);

    await cell01.click();
    await expect(cell11).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell10).toHaveClass(/dx-cell-modified/);

    await cell11.click();
    await expect(cell11).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell10).toHaveClass(/dx-cell-modified/);

    await cell10.click();
    await expect(cell11).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell10).toHaveClass(/dx-cell-modified/);
  });

  test('Async Validation(Batch) - Validation frame should be rendered when a neighboring cell is modified with showEditorAlways and repaintChangesOnly enabled (T906094)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: '', lastName: '' }],
      keyExpr: 'id',
      repaintChangesOnly: true,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'name',
      }, {
        dataField: 'lastName',
        showEditorAlways: true,
        validationRules: [{
          type: 'async',
          message: 'Invalid value',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(params.data.name.length < 2);
            }, 1000);
            return d.promise();
          },
        }],
      }],
    });

    const dataGrid = new DataGrid(page);
    const cancelButton = dataGrid.getHeaderPanel().getCancelButton();

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');
    const editor1 = cell1.locator('.dx-texteditor-input');

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-focused/);

    await editor0.fill('test');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    await cancelButton.click();
    await expect(cell0).not.toHaveClass(/dx-cell-modified/);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).not.toHaveClass(/dx-validation-pending/);

    await cell0.click();
    await editor0.fill('test');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);

    await editor1.click();
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveClass(/dx-focused/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);

    await cell0.click();
    await editor0.fill('t');
    await page.keyboard.press('Enter');

    await expect(cell1).toHaveClass(/dx-validation-pending/);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);
  });

  ['Cell', 'Batch'].forEach((editMode) => {
    test(`${editMode} - Edit cell should be focused correctly when showEditorAlways is enabled (T976141)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, field: 'field' },
          { id: 2, field: 'field' },
          { id: 3, field: 'field' },
        ],
        keyExpr: 'id',
        editing: {
          mode: editMode.toLowerCase(),
          allowUpdating: true,
        },
        customizeColumns(columns: any[]) {
          columns.forEach((col) => {
            col.showEditorAlways = true;
          });
        },
      });

      for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
        for (let colIndex = 0; colIndex < 2; colIndex += 1) {
          const cell = page.locator(`.dx-data-row[aria-rowindex="${rowIndex + 1}"] td`).nth(colIndex);
          const editor = cell.locator('.dx-texteditor-input');
          await editor.click();
          await expect(cell).toHaveClass(/dx-focused/);
          await expect(editor).toBeFocused();
        }
      }

      for (let rowIndex = 2; rowIndex >= 0; rowIndex -= 1) {
        for (let colIndex = 1; colIndex >= 0; colIndex -= 1) {
          const cell = page.locator(`.dx-data-row[aria-rowindex="${rowIndex + 1}"] td`).nth(colIndex);
          const editor = cell.locator('.dx-texteditor-input');
          await editor.click();
          await expect(cell).toHaveClass(/dx-focused/);
          await expect(editor).toBeFocused();
        }
      }
    });
  });

  test('Async Validation(Row) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'row',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
    await addRowButton.click();

    const insertedRow = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"]');
    await expect(insertedRow).toBeVisible();

    const cell0 = insertedRow.locator('td').nth(0);
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);

    const saveButton = page.locator('.dx-data-row.dx-row-inserted .dx-link-save');
    await saveButton.click();

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(insertedRow).toBeVisible();
    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    const editor0 = cell0.locator('.dx-texteditor-input');
    await editor0.fill('1');
    await saveButton.click();

    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted'));
    await expect(insertedRow).toBeHidden();
  });

  test('Async Validation(Row) - Only valid data is saved in a modified row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const editButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-edit');
    await editButton.click();

    const cell0 = page.locator('.dx-data-row.dx-edit-row[aria-rowindex="1"] td').nth(0);
    const editor0 = cell0.locator('.dx-texteditor-input');
    const saveButton = page.locator('.dx-data-row.dx-edit-row .dx-link-save');

    await editor0.selectText();
    await editor0.fill('3');
    await saveButton.click();

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await page.waitForFunction(() => !document.querySelector('.dx-edit-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('1');
    await saveButton.click();

    await page.waitForFunction(() => !document.querySelector('.dx-edit-row'));
    await expect(page.locator('.dx-data-row.dx-edit-row')).toBeHidden();
  });

  test('Async Validation(Row) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData: any, value: any): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    });

    const editButton = page.locator('.dx-data-row[aria-rowindex="1"] .dx-link-edit');
    await editButton.click();

    const editRow = page.locator('.dx-data-row.dx-edit-row[aria-rowindex="1"]');
    const cell0 = editRow.locator('td').nth(0);
    const cell1 = editRow.locator('td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');
    const saveButton = page.locator('.dx-data-row.dx-edit-row .dx-link-save');

    await editor0.selectText();
    await editor0.fill('3');
    await saveButton.click();

    await page.waitForFunction(() => !document.querySelector('.dx-edit-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('1');
    await saveButton.click();

    await page.waitForFunction(() => !document.querySelector('.dx-edit-row td.dx-validation-pending'));
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
  });

  test('Async Validation(Cell) - Only the last cell should be switched to edit mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(true);
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const cell2 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(2);

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-validation-pending/);

    await cell1.click();
    await expect(cell1).not.toHaveClass(/dx-focused/);

    await cell2.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell2).not.toHaveClass(/dx-hidden-focus/);
    await expect(cell2).toHaveClass(/dx-focused/);
  });

  test('Async Validation(Cell) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const insertedRow = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"]');
    await expect(insertedRow).toBeVisible();

    const cell0 = insertedRow.locator('td').nth(0);
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);

    await cell0.click();
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(insertedRow).toBeVisible();

    const editor0 = cell0.locator('.dx-texteditor-input');
    await cell0.click();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-validation-pending'));
    await expect(insertedRow).toBeHidden();
  });

  test('Async Validation(Cell) - Only valid data is saved in a modified cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);

    await cell0.click();
    await editor0.selectText();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).not.toHaveClass(/dx-editor-cell/);
  });

  test('Async Validation(Cell) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData: any, value: any): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    });

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await cell0.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-editor-cell/);
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    await cell0.click();
    await editor0.selectText();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
  });

  test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row (T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        setCellValue: (rowData: any, value: any): void => {
          rowData.age = value;
          rowData.name = 'testb';
        },
      }, {
        dataField: 'name',
        validationRules: [{
          type: 'async',
          validationCallback(): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiAddRow();

    const cell0 = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await editor0.fill('123');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveText('testb');
  });

  test('Cell mode(setCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row (T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        setCellValue: (rowData: any, value: any): void => {
          rowData.age = value;
          rowData.name = 'testb';
        },
      }, {
        dataField: 'name',
        validationRules: [{
          type: 'async',
          validationCallback(): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiEditCell(0, 0);

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await editor0.fill('123');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveText('testb');
  });

  test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a new row (T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
      }, {
        dataField: 'name',
        calculateCellValue: (rowData: any): string | undefined => (rowData.age ? `${rowData.age}b` : undefined),
        validationRules: [{
          type: 'async',
          validationCallback(): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiAddRow();

    const cell0 = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await editor0.fill('123');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveText('123b');
  });

  test('Cell mode(calculateCellValue) with async validation - The value of an invalid dependent cell should be updated in a modified row (T872751)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
      }, {
        dataField: 'name',
        calculateCellValue: (rowData: any): string | undefined => (rowData.age ? `${rowData.age}b` : undefined),
        validationRules: [{
          type: 'async',
          validationCallback(): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              d.resolve(false);
            }, 50);
            return d.promise();
          },
        }],
      }, 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiEditCell(0, 0);

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await editor0.fill('123');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveText('15123b');
  });

  test('Async Validation(Batch) - Only valid data is saved in a new row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const insertedRow = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"]');
    await expect(insertedRow).toBeVisible();

    const cell0 = insertedRow.locator('td').nth(0);
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);

    await cell0.click();
    await saveButton.click();

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(insertedRow).toBeVisible();

    const editor0 = cell0.locator('.dx-texteditor-input');
    await cell0.click();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);

    await saveButton.click();
    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted'));
    await expect(insertedRow).toBeHidden();
  });

  test('Async Validation(Batch) - Only valid data is saved in a modified cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
      }, 'name', 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-editor-cell/);

    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);

    await saveButton.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-editor-cell/);
    await editor0.selectText();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);

    await saveButton.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).not.toHaveClass(/dx-editor-cell/);
  });

  test('Async Validation(Batch) - Data is not saved when a dependant cell value becomes invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData: any, value: any): void {
          rowData.age = value;
          if (value === 1) {
            rowData.name = '';
          }
        },
      }, {
        dataField: 'name',
        validationRules: [{ type: 'required' }],
      }, 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();

    const cell0 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0);
    const cell1 = page.locator('.dx-data-row[aria-rowindex="1"] td').nth(1);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await cell0.click();
    await expect(cell0).toHaveClass(/dx-editor-cell/);
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);

    await editor0.selectText();
    await editor0.fill('3');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);

    await saveButton.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).not.toHaveClass(/dx-editor-cell/);
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).not.toHaveClass(/dx-datagrid-invalid/);

    await cell0.click();
    await editor0.selectText();
    await editor0.fill('1');
    await page.keyboard.press('Enter');

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await expect(cell1).toHaveClass(/dx-cell-modified/);

    await saveButton.click();
    await page.waitForFunction(() => !document.querySelector('.dx-data-row td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await expect(cell0).not.toHaveClass(/dx-editor-cell/);
    await expect(cell0).not.toHaveClass(/dx-datagrid-invalid/);
    await expect(cell1).toHaveClass(/dx-cell-modified/);
    await expect(cell1).not.toHaveClass(/dx-editor-cell/);
    await expect(cell1).toHaveClass(/dx-datagrid-invalid/);
  });

  test('Async Validation(Batch) - Data is not saved when a cell with async setCellValue is invalid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      errorRowEnabled: true,
      dataSource: [{ id: 1, name: 'Alex', age: 15, lastName: 'John' }],
      keyExpr: 'id',
      legacyRendering: false,
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      columns: [{
        dataField: 'age',
        validationRules: [{
          type: 'async',
          validationCallback(params: any): any {
            const d = (window as any).$.Deferred();
            setTimeout(() => {
              if (params.value === 1) d.resolve(true);
              else d.reject();
            }, 1000);
            return d.promise();
          },
        }],
        setCellValue(rowData: any, value: any): any {
          const d = (window as any).$.Deferred();
          setTimeout(() => {
            rowData.age = value;
            d.resolve();
          }, 1200);
          return d.promise();
        },
      }, 'name', 'lastName'],
    });

    const dataGrid = new DataGrid(page);
    const saveButton = dataGrid.getHeaderPanel().getSaveButton();

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const insertedRow = page.locator('.dx-data-row.dx-row-inserted[aria-rowindex="1"]');
    const cell0 = insertedRow.locator('td').nth(0);
    const editor0 = cell0.locator('.dx-texteditor-input');

    await cell0.click();
    await editor0.fill('123');
    await page.keyboard.press('Enter');

    await saveButton.click();

    await expect(cell0).toHaveClass(/dx-validation-pending/);
    await page.waitForFunction(() => !document.querySelector('.dx-row-inserted td.dx-validation-pending'));
    await expect(cell0).toHaveClass(/dx-datagrid-invalid/);
    await expect(cell0).toHaveClass(/dx-cell-modified/);
    await expect(insertedRow).toBeVisible();
  });

  [false, true].forEach((remoteOperations) => {
    test(`Empty rows should not appear after rows are updated in batch editing mode when paging and validation are enabled and remoteOperations=${remoteOperations}`, async ({ page }) => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        field_0: `val_${i}_0`,
        field_1: `val_${i}_1`,
        field_2: `val_${i}_2`,
        field_3: `val_${i}_3`,
      }));

      await createWidget(page, 'dxDataGrid', {
        dataSource: data,
        keyExpr: 'field_0',
        paging: {
          pageSize: 5,
        },
        remoteOperations,
        editing: {
          allowUpdating: true,
          mode: 'batch',
        },
        columns: [
          {
            dataField: 'field_0',
            validationRules: [
              {
                type: 'custom',
                validationCallback: (options: any) => options.value !== 'val_5_0',
              },
            ],
          },
          'field_1',
          'field_2',
          'field_3',
        ],
      });

      await page.evaluate(({ d }) => {
        const keys = d.map((e: any) => e.field_0);
        const columnToModify = 'field_1';
        const grid = ($('#container') as any).dxDataGrid('instance');
        const changes = grid.option('editing.changes');
        keys.forEach((key: string) => {
          const editData = changes.find(
            (change: any) => change.type === 'update' && change.key === key,
          );
          if (editData) {
            editData.data[columnToModify] = 'EEEEEE';
          } else {
            changes.push({
              type: 'update',
              key,
              data: { [columnToModify]: 'EEEEEE' },
            });
          }
        });
        grid.option('editing.changes', changes);
      }, { d: data });

      const dataGrid = new DataGrid(page);
      const saveButton = dataGrid.getHeaderPanel().getSaveButton();
      await saveButton.click();

      const rowCount = await page.locator('.dx-data-row').count();
      expect(rowCount).toBe(remoteOperations ? 5 : 6);

      const firstCellText = await page.locator('.dx-data-row[aria-rowindex="1"] td').nth(0).textContent();
      expect(firstCellText).toBe(remoteOperations ? 'val_0_0' : 'val_5_0');
    });
  });
});
