import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('initNewRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1274123

  test('No errors should be thrown if inserting new row after cancelling insert on second page', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(40)].map((_, index) => ({ id: index + 1, text: `item ${index + 1}` })),
        keyExpr: 'id',
        paging: {
          pageIndex: 1,
        },
        columns: ['id', 'text'],
        showBorders: true,
        editing: { mode: 'popup', allowAdding: true },
        onInitNewRow(e) {
          e.data.id = 0;
          e.data.text = 'test';
        },
        height: 300,
      });

      await (;
        page.locator('.dx-datagrid-header-panel').getAddRowButton(),).click()
      .click(
        dataGrid.getPopupEditForm().cancelButton,
      );

    await (page.locator('.dx-datagrid-header-panel').getAddRowButton(),).click();

    expect(await 
      dataGrid.getPopupEditForm().element.exists,
    ).toBeTruthy();
  });
});
