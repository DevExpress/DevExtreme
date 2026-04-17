import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe.skip('Editing events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const testCases = [{
    caseName: 'e.cancel = promise:true',
    expected: true,
    onRowUpdating: `(e) => { e.cancel = new Promise((resolve) => { resolve(true); }); }`,
  }, {
    caseName: 'e.cancel = true',
    expected: true,
    onRowUpdating: `(e) => { e.cancel = true; }`,
  }, {
    caseName: 'e.cancel = promise:false',
    expected: false,
    onRowUpdating: `(e) => { e.cancel = new Promise((resolve) => { resolve(false); }); }`,
  }, {
    caseName: 'e.cancel = false',
    expected: false,
    onRowUpdating: `(e) => { e.cancel = false; }`,
  }];

  testCases.forEach(({ caseName, expected, onRowUpdating }) => {
    test(`onRowUpdating event should be work valid in case '${caseName}'`, async ({ page }) => {
      await page.evaluate((handler) => {
        ($('#container') as any).dxDataGrid({
          dataSource: [{
            ID: 1,
            FirstName: 'John',
          }],
          columns: [{
            dataField: 'FirstName',
            caption: 'First Name',
          }],
          height: 300,
          editing: {
            mode: 'row',
            allowUpdating: true,
          },
          // eslint-disable-next-line no-eval
          onRowUpdating: eval(handler),
        });
      }, onRowUpdating);

      await page.waitForSelector('.dx-datagrid-rowsview');

      const dataRow = page.locator('.dx-data-row').nth(0);
      const editLink = dataRow.locator('.dx-link-edit');
      await editLink.click();

      const editor = dataRow.locator('.dx-texteditor-input').first();
      await editor.fill('test text');

      const saveLink = dataRow.locator('.dx-link-save');
      await saveLink.click();

      if (expected) {
        await expect(dataRow.locator('.dx-link-save')).toBeVisible();
      } else {
        await expect(dataRow.locator('.dx-link-save')).toBeHidden();
      }
    });
  });

  const testCasesInserting = [{
    caseName: 'e.cancel = promise:true',
    expected: true,
    onRowInserting: `(e) => { e.cancel = new Promise((resolve) => { resolve(true); }); }`,
  }, {
    caseName: 'e.cancel = true',
    expected: true,
    onRowInserting: `(e) => { e.cancel = true; }`,
  }, {
    caseName: 'e.cancel = promise:false',
    expected: false,
    onRowInserting: `(e) => { e.cancel = new Promise((resolve) => { resolve(false); }); }`,
  }, {
    caseName: 'e.cancel = false',
    expected: false,
    onRowInserting: `(e) => { e.cancel = false; }`,
  }];

  testCasesInserting.forEach(({ caseName, expected, onRowInserting }) => {
    test(`onRowInserting event should be work valid in case '${caseName}'`, async ({ page }) => {
      await page.evaluate((handler) => {
        ($('#container') as any).dxDataGrid({
          dataSource: [],
          columns: [{
            dataField: 'FirstName',
            caption: 'First Name',
          }],
          height: 300,
          editing: {
            mode: 'row',
            allowAdding: true,
          },
          // eslint-disable-next-line no-eval
          onRowInserting: eval(handler),
        });
      }, onRowInserting);

      await page.waitForSelector('.dx-datagrid-rowsview');

      const addRowButton = page.locator('.dx-datagrid-addrow-button');
      await addRowButton.click();

      const dataRow = page.locator('.dx-data-row').nth(0);
      const editor = dataRow.locator('.dx-texteditor-input').first();
      await editor.fill('test text');

      const saveLink = dataRow.locator('.dx-link-save');
      await saveLink.click();

      if (expected) {
        await expect(dataRow.locator('.dx-link-save')).toBeVisible();
      } else {
        await expect(dataRow.locator('.dx-link-save')).toBeHidden();
      }
    });
  });

  const testCasesRemoving = [{
    caseName: 'e.cancel = promise:true',
    expected: true,
    onRowRemoving: `(e) => { e.cancel = new Promise((resolve) => { resolve(true); }); }`,
  }, {
    caseName: 'e.cancel = true',
    expected: true,
    onRowRemoving: `(e) => { e.cancel = true; }`,
  }, {
    caseName: 'e.cancel = promise:false',
    expected: false,
    onRowRemoving: `(e) => { e.cancel = new Promise((resolve) => { resolve(false); }); }`,
  }, {
    caseName: 'e.cancel = false',
    expected: false,
    onRowRemoving: `(e) => { e.cancel = false; }`,
  }];

  testCasesRemoving.forEach(({ caseName, expected, onRowRemoving }) => {
    test(`onRowRemoving event should be work valid in case '${caseName}'`, async ({ page }) => {
      await page.evaluate((handler) => {
        ($('#container') as any).dxDataGrid({
          dataSource: [{
            ID: 1,
            FirstName: 'John',
          }],
          columns: [{
            dataField: 'FirstName',
            caption: 'First Name',
          }],
          height: 300,
          editing: {
            mode: 'row',
            allowDeleting: true,
            confirmDelete: false,
          },
          // eslint-disable-next-line no-eval
          onRowRemoving: eval(handler),
        });
      }, onRowRemoving);

      await page.waitForSelector('.dx-datagrid-rowsview');

      const dataRow = page.locator('.dx-data-row').nth(0);
      const deleteLink = dataRow.locator('.dx-link-delete');
      await deleteLink.click();

      if (expected) {
        await expect(page.locator('.dx-data-row').nth(0)).toBeVisible();
      } else {
        await expect(page.locator('.dx-data-row').nth(0)).toBeHidden();
      }
    });
  });

  // T1250405
  test('DataGrid - Canceled rows are hidden when multiple rows are added in batch mode', async ({ page }) => {
    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid({
        dataSource: [
          { ID: 1, Text: 'Item 1' },
        ],
        keyExpr: 'ID',
        columns: ['Text'],
        editing: {
          mode: 'batch',
          allowAdding: true,
        },
        onRowInserting(e: any) {
          e.cancel = new Promise((resolve) => {
            const dialog = (window as any).DevExpress.ui.dialog.confirm(
              'Are you sure?',
              'Confirm changes',
            );
            dialog.done((confirm: boolean) => resolve(!confirm));
          });
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    const addBtn = page.locator('.dx-datagrid-addrow-button');
    const saveBtn = page.locator('.dx-datagrid-save-button');

    await addBtn.click();
    await page.locator('.dx-data-row').nth(0).locator('.dx-texteditor-input').fill('1');
    await addBtn.click();
    await page.locator('.dx-data-row').nth(0).locator('.dx-texteditor-input').fill('2');
    await saveBtn.click();

    const dialogs = page.locator('.dx-dialog-wrapper');
    await expect(dialogs.nth(0)).toBeVisible();
    await expect(dialogs.nth(1)).toBeVisible();

    await dialogs.nth(1).locator('[aria-label="No"]').click();

    await dialogs.nth(0).locator('[aria-label="Yes"]').click();

    const dataRows = page.locator('.dx-data-row');
    await expect(dataRows).toHaveCount(2);
  });

  test('onRowUpdating event should provide correct oldData and newData', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowUpdatingArgs = null;
      ($('#container') as any).dxDataGrid({
        dataSource: [{
          ID: 1,
          FirstName: 'John',
        }],
        keyExpr: 'ID',
        columns: [{
          dataField: 'FirstName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowUpdating: true,
        },
        onRowUpdating(e: any) {
          (window as any).rowUpdatingArgs = {
            oldData: e.oldData,
            newData: e.newData,
            key: e.key,
          };
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    const dataRow = page.locator('.dx-data-row').nth(0);
    await dataRow.locator('.dx-link-edit').click();

    const editor = dataRow.locator('.dx-texteditor-input').first();
    await editor.fill('Jane');
    await dataRow.locator('.dx-link-save').click();

    const args = await page.evaluate(() => (window as any).rowUpdatingArgs);
    expect(args).not.toBeNull();
    expect(args.key).toBe(1);
    expect(args.oldData.FirstName).toBe('John');
    expect(args.newData.FirstName).toBe('Jane');
  });

  test('onRowInserting event should provide correct data', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowInsertingArgs = null;
      ($('#container') as any).dxDataGrid({
        dataSource: [],
        keyExpr: 'ID',
        columns: [{
          dataField: 'FirstName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowAdding: true,
        },
        onRowInserting(e: any) {
          (window as any).rowInsertingArgs = {
            data: e.data,
          };
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    await page.locator('.dx-datagrid-addrow-button').click();

    const dataRow = page.locator('.dx-data-row').nth(0);
    const editor = dataRow.locator('.dx-texteditor-input').first();
    await editor.fill('Alice');
    await dataRow.locator('.dx-link-save').click();

    const args = await page.evaluate(() => (window as any).rowInsertingArgs);
    expect(args).not.toBeNull();
    expect(args.data.FirstName).toBe('Alice');
  });

  test('onRowRemoving event should provide correct key', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowRemovingArgs = null;
      ($('#container') as any).dxDataGrid({
        dataSource: [{
          ID: 42,
          FirstName: 'Bob',
        }],
        keyExpr: 'ID',
        columns: [{
          dataField: 'FirstName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowDeleting: true,
          confirmDelete: false,
        },
        onRowRemoving(e: any) {
          (window as any).rowRemovingArgs = {
            key: e.key,
            data: e.data,
          };
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    const dataRow = page.locator('.dx-data-row').nth(0);
    await dataRow.locator('.dx-link-delete').click();

    const args = await page.evaluate(() => (window as any).rowRemovingArgs);
    expect(args).not.toBeNull();
    expect(args.key).toBe(42);
    expect(args.data.FirstName).toBe('Bob');
  });

  test('onRowUpdating event should be called in batch mode when saving changes', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowUpdatingCallCount = 0;
      ($('#container') as any).dxDataGrid({
        dataSource: [
          { ID: 1, Name: 'Item 1' },
          { ID: 2, Name: 'Item 2' },
        ],
        keyExpr: 'ID',
        columns: ['Name'],
        editing: {
          mode: 'batch',
          allowUpdating: true,
        },
        onRowUpdating() {
          (window as any).rowUpdatingCallCount += 1;
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(0);
    await firstCell.click();
    await firstCell.locator('.dx-texteditor-input').fill('Updated 1');

    const secondCell = page.locator('.dx-data-row').nth(1).locator('td').nth(0);
    await secondCell.click();
    await secondCell.locator('.dx-texteditor-input').fill('Updated 2');

    await page.locator('.dx-datagrid-save-button').click();

    const callCount = await page.evaluate(() => (window as any).rowUpdatingCallCount);
    expect(callCount).toBe(2);
  });

  test('onRowRemoving event should be called with confirmDelete=true when user confirms', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowRemovingCalled = false;
      ($('#container') as any).dxDataGrid({
        dataSource: [{
          ID: 1,
          Name: 'Item',
        }],
        keyExpr: 'ID',
        columns: ['Name'],
        height: 300,
        editing: {
          mode: 'row',
          allowDeleting: true,
          confirmDelete: true,
        },
        onRowRemoving() {
          (window as any).rowRemovingCalled = true;
        },
      });
    });

    await page.waitForSelector('.dx-datagrid-rowsview');

    const dataRow = page.locator('.dx-data-row').nth(0);
    await dataRow.locator('.dx-link-delete').click();

    const dialog = page.locator('.dx-dialog-wrapper');
    await expect(dialog).toBeVisible();
    await dialog.locator('[aria-label="Yes"]').click();

    const called = await page.evaluate(() => (window as any).rowRemovingCalled);
    expect(called).toBe(true);
    await expect(page.locator('.dx-data-row').nth(0)).toBeHidden();
  });
});
