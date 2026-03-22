import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1054312
  test('CheckBox position with double rows columns', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [{
      ID: 1,
      Full_Name: 'John Heart',
      City: 'Los Angeles',
      State: 'California',
    }],
    keyExpr: 'ID',
    selection: {
      mode: 'multiple',
    },
    columns: [{
      dataField: 'Full_Name',
    },
    { columns: ['City', 'State'] },
    ],
  });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1054312', { element: treeList.getHeaders().element });

    });

  // T1053931
  test('Correct display border to last column', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Total: 205809000,
        GDP_Agriculture: 0.054,
        GDP_Industry: 0.274,
        GDP_Services: 0.672,
        GDP_Total: 2353025,
      },
    ],
    keyExpr: 'ID',
    columns: [
      'Country',
      {
        columns: [{
          dataField: 'GDP_Total',
        }, {
          columns: [{
            dataField: 'GDP_Agriculture',
          }, {
            dataField: 'GDP_Industry',
          }, {
            dataField: 'GDP_Services',
          }],
        }],
      }, {
        columns: [{
          dataField: 'Population_Total',
        }, {
          dataField: 'Population_Urban',
        }],
      }, {
        dataField: 'Area',
      },
    ],
    width: 600,
    height: 300,
  });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1053931', { element: treeList.getHeaders().element });

    });
});
