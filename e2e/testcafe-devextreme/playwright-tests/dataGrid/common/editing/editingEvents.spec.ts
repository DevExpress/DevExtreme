import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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

  /* eslint-disable @typescript-eslint/no-misused-promises */

  );

  // T1186997
  const testCases = [{
    caseName: 'e.cancel = promise:true',
    expected: true,

    onRowUpdating: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(true);
      });
    }),
    onRowInserting: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(true);
      });
    }),
    onRowRemoving: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(true);
      });
    }),
  }, {
    caseName: 'e.cancel = true',
    expected: true,

    onRowUpdating: ClientFunction((e) => {
      e.cancel = true;
    }),
    onRowInserting: ClientFunction((e) => {
      e.cancel = true;
    }),
    onRowRemoving: ClientFunction((e) => {
      e.cancel = true;
    }),
  }, {
    caseName: 'e.cancel = promise:false',
    expected: false,

    onRowUpdating: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(false);
      });
    }),
    onRowInserting: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(false);
      });
    }),
    onRowRemoving: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(false);
      });
    }),
  }, {
    caseName: 'e.cancel = false',
    expected: false,

    onRowUpdating: ClientFunction((e) => {
      e.cancel = false;
    }),
    onRowInserting: ClientFunction((e) => {
      e.cancel = false;
    }),
    onRowRemoving: ClientFunction((e) => {
      e.cancel = false;
    }),
  }];

  // onRowUpdating
  testCases.forEach(({ caseName, expected, onRowUpdating }) => {

  test(`onRowUpdating event should be work valid in case '${caseName}'`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          dataSource: [{
            ID: 1,
            FirstName: 'John',
          }],
          columns: [{
            dataField: 'FirstName',
            caption: 'Firs tName',
          }],
          height: 300,
          editing: {
            mode: 'row',
            allowUpdating: true,
          },
          onRowUpdating,
        });

          const dataRow = page.locator('.dx-data-row').nth(0);

      await (dataRow.locator('td').nth(1).click().getLinkEdit());

      await (dataRow.locator('td').nth(0).locator('.dx-editor-cell')).fill('test text');
      await (dataRow.locator('td').nth(1).click().getLinkSave());

      expect(await dataRow.locator('td').nth(1).getLinkSave().exists).toBe(expected);
    });
});
