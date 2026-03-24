import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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
});
