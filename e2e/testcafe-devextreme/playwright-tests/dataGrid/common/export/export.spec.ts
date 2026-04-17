import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

  test('Warning should be thrown in console if exporting is enabled, but onExporting is not specified', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      export: {
        enabled: true,
      },
    });

    const isWarningExist = warnings.some((message) => message.startsWith('W1024'));
    expect(isWarningExist).toBeTruthy();
  });

  test('Warning should be thrown in console if exporting is enabled dynamically with \'export\' option, but onExporting is not specified', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('export', { enabled: true }));

    const isWarningExist = warnings.some((message) => message.startsWith('W1024'));
    expect(isWarningExist).toBeTruthy();
  });

  test('Warning should be thrown in console if exporting is enabled dynamically with \'export.enabled\' option, but onExporting is not specified', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('export.enabled', true));

    const isWarningExist = warnings.some((message) => message.startsWith('W1024'));
    expect(isWarningExist).toBeTruthy();
  });
});
