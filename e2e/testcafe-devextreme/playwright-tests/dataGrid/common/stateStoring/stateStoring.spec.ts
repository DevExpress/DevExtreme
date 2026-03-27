import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('State Storing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The Grid should load if JSON in localStorage is invalid and stateStoring enabled', async ({ page }) => {
    await page.evaluate(() => {
      window.localStorage.testStorageKey = '{]';
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 1, B: 2, C: 3 },
        { A: 4, B: 5, C: 6 },
        { A: 7, B: 8, C: 9 },
      ],
      stateStoring: {
        enabled: true,
        storageKey: 'testStorageKey',
      },
    });

    const secondCell = page.locator('.dx-data-row').nth(1).locator('td').nth(1);
    await expect(secondCell).toHaveText('5');

    const consoleWarnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    await page.reload();
    await page.evaluate(() => {
      window.localStorage.testStorageKey = '{]';
    });
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 1, B: 2, C: 3 },
        { A: 4, B: 5, C: 6 },
        { A: 7, B: 8, C: 9 },
      ],
      stateStoring: {
        enabled: true,
        storageKey: 'testStorageKey',
      },
    });

    await expect(page.locator('.dx-data-row').nth(1).locator('td').nth(1)).toHaveText('5');
  });

  test('The focused state of a row with the 0 key should be restored (T1252962)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, text: 'item 1' },
        { id: 1, text: 'item 2' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return Promise.resolve({
            focusedRowKey: 0,
          });
        },
      },
    });

    const isReady = await dataGrid.isReady();
    expect(isReady).toBe(true);

    const focusedRow = dataGrid.element.locator('.dx-row-focused');
    await expect(focusedRow).toBeVisible();
  });

  test('DataGrid - Cannot read properties error when column fixing and state storing are used (T1283168)', async ({ page }) => {
    const dataGridConfig = {
      dataSource: [
        { id: 0, text: 'item 1' },
        { id: 1, text: 'item 2' },
        { id: 2, text: 'item 3' },
        { id: 3, text: 'item 4' },
      ],
      columnFixing: { enabled: true },
      keyExpr: 'id',
      stateStoring: { enabled: true },
      scrolling: { mode: 'virtual' as const },
      customizeColumns(columns: any[]) {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'sticky';
      },
    };

    await createWidget(page, 'dxDataGrid', dataGridConfig);

    await page.reload();
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');

    await createWidget(page, 'dxDataGrid', dataGridConfig);

    const dataGrid = new DataGrid(page);
    const isReady = await dataGrid.isReady();
    expect(isReady).toBe(true);
  });

  test('DataGrid - The filterType property is reset if client state storing contains no filtering settings (T1296608)', async ({ page }) => {
    const dataGrid = new DataGrid(page);

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, textID: '0', text: 'item 0' },
        { id: 1, textID: '1', text: 'item 1' },
      ],
      keyExpr: 'id',
      filterSyncEnabled: true,
      columns: [
        {
          dataField: 'id',
          caption: 'ID',
          dataType: 'string',
        },
        {
          dataField: 'textID',
          filterType: 'exclude',
          name: 'textID',
          dataType: 'string',
          filterValues: ['0'],
        },
      ],
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return Promise.resolve({
            columns: [
              { dataField: 'id' },
              { dataField: 'textID' },
            ],
          });
        },
      },
    });

    const isReady = await dataGrid.isReady();
    expect(isReady).toBe(true);

    const firstCellText = await dataGrid.getDataCell(0, 0).element.textContent();
    expect(firstCellText?.trim()).toBe('1');
  });
});
