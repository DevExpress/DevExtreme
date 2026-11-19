import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Grid on Drop Down Box', () => {
  // T1245111
  test('DataGrid on dropDownBox should appear correctly on window resize', async ({ page }) => {
    await createWidget(page, 'dxDropDownBox', () => ({
      dataSource: Array.from({ length: 100 }, (_, index) => ({
        Value: index + 1,
        Text: `item ${index + 1}`,
      })),
      dropDownOptions: {
        width: 'auto',
      },
      contentTemplate: (e) => ($('<div/>') as any).dxDataGrid({
        dataSource: e.component.getDataSource(),
      }),
    }));

    const dropDownBox = page.locator('#container');
    const overlay = page.locator('.dx-overlay-content').first();

    await dropDownBox.click();
    await overlay.hover();
    await page.setViewportSize({ width: 800, height: 800 });
    await testScreenshot(page, 'T1245111-dropDownBox-resize.png');
  });
});
