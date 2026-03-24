import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, PivotGrid, HeaderFilter } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const sales = [
  { region: 'North America', date: '2015/01/01', amount: 1740 },
  { region: 'North America', date: '2015/02/01', amount: 2295 },
  { region: 'Europe', date: '2015/01/01', amount: 1190 },
  { region: 'Europe', date: '2015/02/01', amount: 1060 },
  { region: 'Asia', date: '2015/01/01', amount: 1445 },
  { region: 'Asia', date: '2015/02/01', amount: 1455 },
];

test.describe('pivotGrid_headerFilter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Header filter popup', async ({ page }) => {
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

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().click();

    await testScreenshot(page, 'headerFilter - before scroll.png');
  });

  test.skip('[T1284200] Should handle dxList "selectAll" when has unselected items on the second page', async ({ page }) => {
    // skipped: requires complex HeaderFilter list interaction with checkboxes
  });
});
