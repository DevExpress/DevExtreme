import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('State Storing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

  const makeLocalStorageJsonInvalid = ClientFunction(() => {
    window.localStorage.testStorageKey = '{]';
  });

  const dataGridConfig = {
    dataSource: [
      { id: 0, text: 'item 1' },
      { id: 1, text: 'item 2' },
      { id: 2, text: 'item 3' },
      { id: 3, text: 'item 4' },
    ],
    columnFixing: {
      enabled: true,
    },
    keyExpr: 'id',
    stateStoring: {
      enabled: true,
    },
    scrolling: {
      mode: 'virtual' as any,
    },
    customizeColumns(columns) {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'sticky';
    },
  };

  test('The Grid should load if JSON in localStorage is invalid and stateStoring enabled', async ({ page }) => {
    await makeLocalStorageJsonInvalid();
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
    const consoleMessages = await t.getBrowserConsoleMessages();

    expect(await secondCell.element().innerText).toBe('5');
    const isWarningExist = !!consoleMessages.warn.find((message) => message.startsWith('W1022'));
    expect(await isWarningExist).toBeTruthy();
  });
});
