import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Grid on Drop Down Box', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('DataGrid on dropDownBox should appear correctly on window resize', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', {
      dataSource: Array.from({ length: 100 }, (_, index) => ({
        Value: index + 1,
        Text: `item ${index + 1}`,
      })),
      dropDownOptions: {
        width: 'auto',
      },
      contentTemplate: (e: any) => ($('<div/>') as any).dxDataGrid({
        dataSource: e.component.getDataSource(),
      }),
    });

    const dropDownBox = page.locator('#container');
    const overlay = page.locator('.dx-overlay-content');

    await dropDownBox.click();
    await overlay.hover();
    await page.setViewportSize({ width: 800, height: 800 });

    await testScreenshot(page, 'T1245111-dropDownBox-resize.png');
  });
});
