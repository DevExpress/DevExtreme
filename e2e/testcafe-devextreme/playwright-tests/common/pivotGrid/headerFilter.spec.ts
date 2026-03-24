import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('pivotGrid_headerFilter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const PIVOT_GRID_SELECTOR = '#container';

  test.skip('Header filter popup', async ({ page }) => {

    await createWidget(page, 'dxPivotGrid', {
      allowSorting: true,
      allowFiltering: true,
      fieldPanel: {
        showColumnFields: true,
        showDataFields: true,
        showFilterFields: true,
        showRowFields: true,
        allowFieldDragging: true,
        visible: true,
      },
      headerFilter: {
        allowSearch: true,
      },
      dataSource: {
        fields: [{
          dataField: 'region',
          area: 'column',
        }, {
          dataField: 'date',
          area: 'row',
        }, {
          dataField: 'amount',
          area: 'data',
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

    await pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element.click();

    await testScreenshot(page, 'headerFilter - before scroll.png');

    await scroll(pivotGrid.getColumnHeaderArea().getHeaderFilterScrollable(), 0, 10);

    await testScreenshot(page, 'headerFilter - after scroll.png');

    });

  test.skip('[T1284200] Should handle dxList "selectAll" when has unselected items on the second page', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      fields: [
        {
          dataField: 'id',
          area: 'column',
          filterType: 'exclude',
          filterValues: [70],
        },
      ],
      store: new Array(100).fill(null).map((_, idx) => ({
        id: idx,
      })),
    },
    allowSorting: true,
    allowFiltering: true,
    fieldPanel: {
      visible: true,
    },
  });

    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

    const filterIconElement = pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element;
    const headerFilter = new HeaderFilter();
    const list = headerFilter.getList();

    await page.click(filterIconElement)
      .click(list.selectAll.checkBox.element);

    expect(list.selectAll.checkBox.isChecked).toBeTruthy();

    await list.selectAll.checkBox.element.click();

    expect(list.selectAll.checkBox.isChecked).toBeFalsy();

    });
});
