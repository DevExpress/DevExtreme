import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Editing events', () => {
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
});
