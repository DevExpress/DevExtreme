import { test, expect } from '@playwright/test';
import { createWidget, PivotGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const sales = [
  {
    region: 'North America', city: 'New York', date: '2015/01/01', amount: 1740,
  },
  {
    region: 'North America', city: 'Los Angeles', date: '2015/02/01', amount: 2295,
  },
  {
    region: 'Europe', city: 'London', date: '2015/01/01', amount: 1190,
  },
  {
    region: 'Europe', city: 'Berlin', date: '2015/02/01', amount: 1060,
  },
  {
    region: 'Asia', city: 'Tokyo', date: '2015/01/01', amount: 1445,
  },
  {
    region: 'Asia', city: 'Shanghai', date: '2015/02/01', amount: 1455,
  },
];

test.describe('pivotGrid_sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should sort without DataSource reload if scrolling mode isn\'t virtual', async ({ page }) => {
    let loadCount = 0;

    await page.exposeFunction('__pivotGridLoadCalled', () => {
      loadCount += 1;
    });

    await createWidget(page, 'dxPivotGrid', {
      allowSorting: true,
      dataSource: {
        fields: [{
          dataField: 'region',
          area: 'row',
        }, {
          dataField: 'date',
          area: 'column',
        }, {
          dataField: 'amount',
          area: 'data',
          summaryType: 'sum',
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);
    loadCount = 0;

    const sortIcon = pivotGrid.getRowHeaderArea().element.locator('td').first();
    await sortIcon.click();

    await page.waitForTimeout(500);
    expect(loadCount).toBe(0);
  });

  test('Should sort with DataSource reload if scrolling mode is virtual', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowSorting: true,
      scrolling: {
        mode: 'virtual',
      },
      dataSource: {
        fields: [{
          dataField: 'region',
          area: 'row',
        }, {
          dataField: 'date',
          area: 'column',
        }, {
          dataField: 'amount',
          area: 'data',
          summaryType: 'sum',
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);

    const sortIcon = pivotGrid.getRowHeaderArea().element.locator('td').first();
    await sortIcon.click();

    await page.waitForTimeout(500);

    await expect(pivotGrid.element.locator('.dx-pivotgrid')).toBeVisible();
  });
});
