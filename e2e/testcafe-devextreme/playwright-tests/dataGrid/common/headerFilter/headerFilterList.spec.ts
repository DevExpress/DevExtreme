import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Header Filter - dxList integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

  const openHeaderFilterAndGetList = async (t: TestController, dataGrid: DataGrid) => {
    const headerCell = dataGrid.getHeaders()
      .getHeaderRow(0)
      .locator('td').nth(0);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter();
    const list = headerFilter.getList();
    const firstListItem = list.getItem(0);
    const secondListItem = list.getItem(1);

    await t
      .click(filterIconElement);

    return { list, firstListItem, secondListItem };
  };

  test('Should has unchecked "Select all" checkbox state if no values is selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

      const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

    expect(await list.selectAll.checkBox.getCheckBoxState());
    await t.eql('unchecked');
    expect(await firstListItem.isSelected);
    await t.notOk();
    expect(await secondListItem.isSelected);
    await t.notOk();
  });
});
