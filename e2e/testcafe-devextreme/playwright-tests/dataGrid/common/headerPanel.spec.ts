import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Header Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Drop-down window should be positioned correctly after resizing the toolbar (T1037975)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, Name: 'Name 1', Category: 'Category 1' },
        { ID: 2, Name: 'Name 2', Category: 'Category 1' },
      ],
      keyExpr: 'ID',
      columns: ['ID', { dataField: 'Name', groupIndex: 0 }, 'Category'],
      toolbar: {
        items: [
          {
            location: 'before',
            locateInMenu: 'always',
            widget: 'dxSelectBox',
            options: {
              width: 200,
              items: ['Name', 'Category'],
              value: 'Name',
              onValueChanged(e) {
                const gridInstance = ($('#container') as any).dxDataGrid('instance');
                gridInstance.clearGrouping();
                gridInstance.columnOption(e.value, 'groupIndex', 0);
              },
            },
          },
        ],
      },
    });

      const headerPanel = page.locator('.dx-datagrid-header-panel');

    // act
    await (headerPanel.locator('.dx-dropdownmenu-button')).click();

    // assert
    const selectPopup = headerPanel.getDropDownSelectPopup();
    const popupContent = selectPopup.menuContent();

    expect(await popupContent.exists);
    await t.ok();
    expect(await popupContent.visible);
    await t.ok();

    // act
    await (selectPopup.editButton()).click();

    // assert
    const menuItem = selectPopup.getSelectItem(1);

    expect(await menuItem.exists);
    await t.ok();
    expect(await menuItem.visible);
    await t.ok();

    // act
    await (menuItem).click();

    const visibleRows = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getVisibleRows());

    // assert
    expect(await visibleRows.length);
    await t.eql(3);

    await testScreenshot(page, 'grid-toolbar-dropdown-menu.png', { element: 'body' });
  });
});
