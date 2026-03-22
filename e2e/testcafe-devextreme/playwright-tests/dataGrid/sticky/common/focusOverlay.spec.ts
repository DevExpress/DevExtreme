import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FixedColumns - Focus Overlay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Focus overlay should be displayed correctly if sticky columns are turned on', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 40),
      columnFixing: {
        enabled: true,
      },
      groupPanel: {
        visible: true,
      },
      width: 800,
      showColumnHeaders: true,
      columnAutoWidth: true,
      allowColumnReordering: true,
      allowColumnResizing: true,
      summary: {
        totalItems: [{
          column: 'field_1',
          summaryType: 'count',
        }, {
          column: 'field_6',
          summaryType: 'count',
        }],
        groupItems: [{
          column: 'field_0',
          summaryType: 'count',
          showInGroupFooter: false,
          alignByColumn: true,
        },
        {
          column: 'field_11',
          summaryType: 'count',
          showInGroupFooter: false,
          alignByColumn: true,
        }, {
          column: 'field_6',
          summaryType: 'count',
          showInGroupFooter: true,
        }],
      },
      customizeColumns(columns) {
        columns[5].fixed = true;
        columns[6].fixed = true;

        columns[11].fixed = true;
        columns[11].fixedPosition = 'right';
        columns[12].fixed = true;
        columns[12].fixedPosition = 'right';

        columns.splice(15, 5, {
          caption: 'Band column 1',
          columns: [{
            caption: 'Nested column 1',
            columns: ['field_15', 'field_16'],
          },
          'field_17',
          {
            caption: 'Nested column 2',
            columns: ['field_18', 'field_19'],
          }],
        });

        columns.splice(25, 4, {
          caption: 'Band column 2',
          columns: [
            'field_29',
            {
              caption: 'Nested column 3',
              columns: ['field_30', 'field_31'],
            },
            'field_32',
          ],
        });

        columns[0].hidingPriority = 0;
        columns[columns.length - 1].hidingPriority = 1;
        columns[columns.length - 2].hidingPriority = 2;
        columns[columns.length - 3].hidingPriority = 3;

        columns[1].groupIndex = 0;
        columns[2].groupIndex = 1;
      },
    });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await (page.locator('.dx-group-row').click().nth(0).getCell(1).element);
    await page.keyboard.press('tab');

    await testScreenshot(page, 'datagrid_group_row_focused.png', { element: page.locator('#container') });

    await (page.locator('.dx-data-row').click().nth(2).locator('.dx-command-edit').nth(40).getAdaptiveButton());
    await page.keyboard.press('tab');

    await testScreenshot(page, 'datagrid_adaptive_item_focused.png', { element: page.locator('#container') });

    await (dataGrid.getGroupFooterRow().click().nth(0), { offsetX: 5, offsetY: 5 });
    await page.keyboard.press('tab');

    await testScreenshot(page, 'datagrid_group_footer_row_focused.png', { element: page.locator('#container') });
  });
});
