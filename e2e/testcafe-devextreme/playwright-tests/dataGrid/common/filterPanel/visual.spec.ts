import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('filterPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1182854

  test('editor\'s popup inside filterBuilder is opening & closing right (T1182854)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      filterValue: ['column1', 'anyof', []],
      filterPanel: {
        visible: true,
      },
    });

      const filterBuilder = (
      await dataGrid.getFilterPanel().openFilterBuilderPopup(t)
    ).getFilterBuilder();

    await testScreenshot(page, 'dataGrid-filterPanel-popup-focused.png');
  await (filterBuilder.getField().click().getValueText());
    await testScreenshot(page, 'dataGrid-filterPanel-popup.-with-editor-popup.png');
  await (filterBuilder.getField().click().getValueText());
    await testScreenshot(page, 'dataGrid-filterPanel-popup.png');
  await (filterBuilder.getField().click().getValueText());
    await testScreenshot(page, 'dataGrid-filterPanel-popup.-with-editor-popup.png');
  });
});
