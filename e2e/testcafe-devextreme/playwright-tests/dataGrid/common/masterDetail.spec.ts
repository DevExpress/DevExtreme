import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Master detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: material.blue.light
  // visual: generic.light

  test('Checkbox align right in masterdetail (T1045321) generic.light', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Prefix: 'Mr.',
      }],
      keyExpr: 'ID',
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 400,
        },
      ],
      masterDetail: {
        autoExpandAll: true,
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxTreeList({
              columnAutoWidth: true,
              showBorders: true,
              selection: {
                mode: 'multiple',
              },
              dataSource: [{
                ID: 1,
                Title: 'CEO',
                Hire_Date: '1995-01-15',
              }],
              rootValue: -1,
              keyExpr: 'ID',
              parentIdExpr: 'Head_ID',
              columns: [
                {
                  dataField: 'Title',
                  caption: 'Position',
                  width: 200,
                },
                {
                  dataField: 'Hire_Date',
                  dataType: 'date',
                  width: 200,
                },
              ],
              showRowLines: true,
            })
            .appendTo(container);
        },
      },
    });

    await testScreenshot(page, 'T1045321.png');
  });
});
