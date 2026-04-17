import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

function getData(rowCount: number, fieldCount: number): Record<string, string>[] {
  return Array.from({ length: rowCount }, (_, rowIdx) => {
    const row: Record<string, string> = {};
    for (let colIdx = 0; colIdx < fieldCount; colIdx += 1) {
      row[`field_${colIdx}`] = `val_${rowIdx}_${colIdx}`;
    }
    return row;
  });
}

test.describe.skip('Accessibility - DataGrid templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('grid templates accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 3),
      keyExpr: 'field_0',
      columns: ['field_0', 'field_1', 'field_2'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dataRowTemplate', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(10)].map((_, i) => ({
        ID: i + 1,
        CompanyName: `company name ${i + 1}`,
        City: `city ${i + 1}`,
        Notes: `test ${i + 1}`,
      })),
      keyExpr: 'ID',
      columns: ['ID', 'CompanyName', 'City'],
      dataRowTemplate: (container, { data }) => {
        const markup = `<tr class='main-row'><td>${data.ID}</td><td>${data.CompanyName}</td><td>${data.City}</td></tr><tr class='notes-row'><td colspan='3'><div>${data.Notes}</div></td></tr>`;
        container.append(markup);
      },
      rowAlternationEnabled: true,
      columnAutoWidth: true,
      showBorders: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('column header template', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 3),
      keyExpr: 'field_0',
      columns: [
        { dataField: 'field_0', headerCellTemplate: (container) => { container.textContent = 'Custom Header'; } },
        'field_1',
        'field_2',
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with row alternation and borders', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 4),
      keyExpr: 'field_0',
      columns: ['field_0', 'field_1', 'field_2', 'field_3'],
      rowAlternationEnabled: true,
      showBorders: true,
      columnAutoWidth: true,
    });
    await a11yCheck(page, {}, '#container');
  });
});
