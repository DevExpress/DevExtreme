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

  test.skip('Warning should be thrown in console if exporting is enabled, but onExporting is not specified', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (t.getBrowserConsoleMessages)
    await createWidget(page, 'dxDataGrid', {
        dataSource: [],
        export: {
          enabled: true,
        },
      });

    const consoleMessages = await t.getBrowserConsoleMessages();
    const isWarningExist = !!consoleMessages?.warn.find((message) => message.startsWith('W1024'));

    expect(await isWarningExist).toBeTruthy();
  });
});
