import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Common tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: fluent.blue.light
  // visual: fluent.blue.dark
  const screenshotCheck = async (
    t: TestController,
    screenshotName: string,
  ) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${screenshotName}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  };

  test('Grid without data', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
    });

      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    await screenshotCheck(t, 'no-data');
  });
});
